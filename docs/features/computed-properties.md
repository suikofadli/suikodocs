---
sidebar_position: 19
---

# Computed Properties

Computed properties adalah cara untuk membuat properti "turunan" di Livewire. Seperti accessor pada model Eloquent, computed properties memungkinkan Anda mengakses nilai dan menyimpannya untuk akses di masa mendatang selama permintaan.

Computed properties sangat berguna dalam kombinasi dengan properti publik komponen.

## Penggunaan dasar

Untuk membuat computed property, Anda dapat menambahkan atribut `#[Computed]` di atas metode apa pun dalam komponen Livewire Anda. Setelah atribut ditambahkan ke metode, Anda dapat mengaksesnya seperti properti lainnya.

> [!warning] Pastikan Anda mengimpor kelas atribut
> Pastikan Anda mengimpor kelas atribut apa pun. Sebagai contoh, atribut `#[Computed]` di bawah ini memerlukan import berikut `use Livewire\Attributes\Computed;`.

Sebagai contoh, berikut adalah komponen `ShowUser` yang menggunakan computed property bernama `user()` untuk mengakses model Eloquent `User` berdasarkan properti bernama `$userId`:

```php
<?php

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\User;

class ShowUser extends Component
{
    public $userId;

    #[Computed]
    public function user()
    {
        return User::find($this->userId);
    }

    public function follow()
    {
        Auth::user()->follow($this->user);
    }

    public function render()
    {
        return view('livewire.show-user');
    }
}
```

```php
<div>
    <h1>{{ $this->user->name }}</h1>

    <span>{{ $this->user->email }}</span>

    <button wire:click="follow">Follow</button>
</div>
```

Karena atribut `#[Computed]` telah ditambahkan ke metode `user()`, nilainya dapat diakses di metode lain dalam komponen dan di dalam template Blade.

> [!info] Harus menggunakan `$this` dalam template Anda
> Tidak seperti properti normal, computed properties tidak tersedia langsung di dalam template komponen Anda. Sebaliknya, Anda harus mengaksesnya pada objek `$this`. Sebagai contoh, computed property bernama `posts()` harus diakses melalui `$this->posts` di dalam template Anda.

> [!warning] Computed properties tidak didukung pada objek `Livewire\Form`.
> Mencoba menggunakan Computed property dalam [Form](https://livewire.laravel.com/docs/forms) akan menghasilkan kesalahan ketika Anda mencoba mengakses properti di blade menggunakan sintaks $form->property.

## Keuntungan performa

Anda mungkin bertanya pada diri sendiri: mengapa menggunakan computed properties sama sekali? Mengapa tidak memanggil metode secara langsung?

Mengakses metode sebagai computed property menawarkan keuntungan performa dibandingkan dengan memanggil metode. Secara internal, ketika computed property dieksekusi untuk pertama kalinya, Livewire menyimpan nilai yang dikembalikan. Dengan cara ini, akses berikutnya dalam permintaan akan mengembalikan nilai yang tersimpan daripada mengeksekusi beberapa kali.

Ini memungkinkan Anda untuk dengan bebas mengakses nilai turunan dan tidak khawatir tentang implikasi performa.

> [!warning] Computed properties hanya disimpan untuk satu permintaan
> Ini adalah kesalahpahaman umum bahwa Livewire menyimpan computed properties untuk seluruh masa pakai komponen Livewire Anda di halaman. Namun, ini tidak terjadi. Sebaliknya, Livewire hanya menyimpan hasil untuk durasi satu permintaan komponen. Ini berarti jika metode computed property Anda berisi query database yang mahal, itu akan dieksekusi setiap kali komponen Livewire Anda melakukan pembaruan.

### Menghapus cache

Pertimbangkan skenario bermasalah berikut:
1) Anda mengakses computed property yang bergantung pada properti atau status database tertentu
2) Properti atau status database yang mendasarinya berubah
3) Nilai yang tersimpan untuk properti menjadi basi dan perlu dihitung ulang

Untuk membersihkan, atau "menghapus", cache yang tersimpan, Anda dapat menggunakan fungsi `unset()` PHP.

Di bawah ini adalah contoh aksi bernama `createPost()` yang, dengan membuat posting baru dalam aplikasi, membuat computed `posts()` menjadi basi — artinya computed property `posts()` perlu dihitung ulang untuk menyertakan posting yang baru ditambahkan:

```php
<?php

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowPosts extends Component
{
    public function createPost()
    {
        if ($this->posts->count() > 10) {
            throw new \Exception('Jumlah post maksimum terlampaui');
        }

        Auth::user()->posts()->create(...);

        unset($this->posts); // [tl! highlight]
    }

    #[Computed]
    public function posts()
    {
        return Auth::user()->posts;
    }

    // ...
}
```

Dalam komponen di atas, computed property disimpan sebelum posting baru dibuat karena metode `createPost()` mengakses `$this->posts` sebelum posting baru dibuat. Untuk memastikan bahwa `$this->posts` berisi konten yang paling up-to-date ketika diakses di dalam view, cache dibatalkan menggunakan `unset($this->posts)`.

### Menyimpan antar permintaan

Terkadang Anda ingin menyimpan nilai computed property untuk masa pakai komponen Livewire, bukannya dihapus setiap permintaan. Dalam kasus ini, Anda dapat menggunakan [utilitas caching Laravel](https://laravel.com/docs/cache#retrieve-store).

Di bawah ini adalah contoh computed property bernama `user()`, di mana daripada mengeksekusi query Eloquent secara langsung, kita membungkus query dalam `Cache::remember()` untuk memastikan bahwa permintaan di masa mendatang mengambilnya dari cache Laravel bukannya mengeksekusi ulang query:

```php
<?php

use Illuminate\Support\Facades\Cache;
use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\User;

class ShowUser extends Component
{
    public $userId;

    #[Computed]
    public function user()
    {
        $key = 'user'.$this->getId();
        $seconds = 3600; // 1 jam...

        return Cache::remember($key, $seconds, function () {
            return User::find($this->userId);
        });
    }

    // ...
}
```

Karena setiap instance unik dari komponen Livewire memiliki ID unik, kita dapat menggunakan `$this->getId()` untuk menghasilkan kunci cache unik yang hanya akan diterapkan pada permintaan di masa mendatang untuk instance komponen yang sama.

Tetapi, seperti yang mungkin Anda perhatikan, sebagian besar kode ini dapat diprediksi dan dengan mudah diabstraksi. Karena ini, atribut `#[Computed]` Livewire menyediakan parameter `persist` yang membantu. Dengan menerapkan `#[Computed(persist: true)]` ke metode, Anda dapat mencapai hasil yang sama tanpa kode tambahan:

```php
use Livewire\Attributes\Computed;
use App\Models\User;

#[Computed(persist: true)]
public function user()
{
    return User::find($this->userId);
}
```

Dalam contoh di atas, ketika `$this->user` diakses dari komponen Anda, itu akan terus disimpan untuk durasi komponen Livewire di halaman. Ini berarti query Eloquent aktual hanya akan dieksekusi sekali.

Livewire menyimpan nilai yang dipertahankan selama 3600 detik (satu jam). Anda dapat mengesampingkan default ini dengan memberikan parameter `seconds` tambahan ke atribut `#[Computed]`:

```php
#[Computed(persist: true, seconds: 7200)]
```

> [!tip] Memanggil `unset()` akan menghapus cache ini
> Seperti yang dibahas sebelumnya, Anda dapat menghapus cache computed property menggunakan metode `unset()` PHP. Ini juga berlaku untuk computed properties yang menggunakan parameter `persist: true`. Ketika memanggil `unset()` pada computed property yang di-cache, Livewire akan menghapus tidak hanya cache computed property, tetapi juga nilai yang di-cache yang mendasarinya dalam cache Laravel.

## Menyimpan di seluruh komponen

Alih-alih menyimpan nilai computed property untuk masa pakai satu komponen, Anda dapat menyimpan nilai computed di seluruh komponen dalam aplikasi Anda menggunakan parameter `cache: true` yang disediakan oleh atribut `#[Computed]`:

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed(cache: true)]
public function posts()
{
    return Post::all();
}
```

Dalam contoh di atas, sampai cache kedaluwarsa atau dihapus, setiap instance komponen ini dalam aplikasi Anda akan berbagi nilai cache yang sama untuk `$this->posts`.

Jika Anda perlu menghapus cache untuk computed property secara manual, Anda dapat mengatur kunci cache khusus menggunakan parameter `key`:

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed(cache: true, key: 'homepage-posts')]
public function posts()
{
    return Post::all();
}
```

## Kapan menggunakan computed properties?

Selain menawarkan keuntungan performa, ada beberapa skenario lain di mana computed properties membantu.

Secara khusus, saat memasukkan data ke dalam template Blade komponen Anda, ada beberapa kesempatan di mana computed property adalah alternatif yang lebih baik. Di bawah ini adalah contoh metode `render()` komponen sederhana yang memasukkan koleksi `posts` ke template Blade:

```php
public function render()
{
    return view('livewire.show-posts', [
        'posts' => Post::all(),
    ]);
}
```

```php
<div>
    @foreach ($posts as $post)
        <!-- ... -->
    @endforeach
</div>
```

Meskipun ini cukup untuk banyak kasus penggunaan, berikut adalah tiga skenario di mana computed property akan menjadi alternatif yang lebih baik:

### Mengakses nilai secara kondisional

Jika Anda mengakses nilai secara kondisional yang mahal untuk diambil dalam template Blade Anda, Anda dapat mengurangi beban performa menggunakan computed property.

Pertimbangkan template berikut tanpa computed property:

```php
<div>
    @if (Auth::user()->can_see_posts)
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    @endif
</div>
```

Jika pengguna dibatasi dari melihat posting, query database untuk mengambil posting sudah dibuat, namun posting tidak pernah digunakan dalam template.

Berikut adalah versi skenario di atas menggunakan computed property sebagai gantinya:

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed]
public function posts()
{
    return Post::all();
}

public function render()
{
    return view('livewire.show-posts');
}
```

```php
<div>
    @if (Auth::user()->can_see_posts)
        @foreach ($this->posts as $post)
            <!-- ... -->
        @endforeach
    @endif
</div>
```

Sekarang, karena kita menyediakan posting ke template menggunakan computed property, kita hanya mengeksekusi query database ketika data diperlukan.

### Menggunakan template inline

Skenario lain ketika computed properties membantu adalah menggunakan [template inline](/docs/components#inline-components) dalam komponen Anda.

Di bawah ini adalah contoh komponen inline di mana, karena kita mengembalikan string template langsung di dalam `render()`, kita tidak pernah memiliki kesempatan untuk memasukkan data ke dalam view:

```php
<?php

use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Computed]
    public function posts()
    {
        return Post::all();
    }

    public function render()
    {
        return <<<HTML
        <div>
            @foreach ($this->posts as $post)
                <!-- ... -->
            @endforeach
        </div>
        HTML;
    }
}
```

Dalam contoh di atas, tanpa computed property, kita tidak akan memiliki cara untuk secara eksplisit memasukkan data ke dalam template Blade.

### Menghilangkan metode render

Di Livewire, cara lain untuk mengurangi boilerplate dalam komponen Anda adalah dengan menghilangkan metode `render()` sama sekali. Ketika dihilangkan, Livewire akan menggunakan metode `render()`-nya sendiri yang mengembalikan view Blade yang sesuai secara konvensi.

Dalam kasus ini, Anda jelas tidak memiliki metode `render()` dari mana Anda dapat memasukkan data ke dalam view Blade.

Alih-alih memasukkan kembali metode `render()` ke dalam komponen Anda, Anda sebagai gantinya dapat menyediakan data tersebut ke view melalui computed properties:

```php
<?php

use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Computed]
    public function posts()
    {
        return Post::all();
    }
}
```

```php
<div>
    @foreach ($this->posts as $post)
        <!-- ... -->
    @endforeach
</div>
```