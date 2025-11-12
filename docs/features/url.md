---
sidebar_position: 18
---

# URL

Livewire memungkinkan Anda menyimpan properti komponen dalam query string URL. Sebagai contoh, Anda mungkin ingin menyertakan properti `$search` dalam komponen Anda ke dalam URL: `https://example.com/users?search=bob`. Ini sangat berguna untuk hal-hal seperti filtering, sorting, dan pagination, karena memungkinkan pengguna untuk berbagi dan bookmark status tertentu dari halaman.

## Penggunaan dasar

Di bawah ini adalah komponen `ShowUsers` yang memungkinkan Anda untuk mencari pengguna berdasarkan nama mereka melalui input teks sederhana:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Url;
use Livewire\Component;
use App\Models\User;

class ShowUsers extends Component
{
    public $search = '';

    public function render()
    {
        return view('livewire.show-users', [
            'users' => User::search($this->search)->get(),
        ]);
    }
}
```

```php
<div>
    <input type="text" wire:model.live="search">

    <ul>
        @foreach ($users as $user)
            <li wire:key="{{ $user->id }}">{{ $user->name }}</li>
        @endforeach
    </ul>
</div>
```

Seperti yang Anda lihat, karena input teks menggunakan `wire:model.live="search"`, ketika pengguna mengetik di field tersebut, permintaan jaringan akan dikirim untuk memperbarui properti `$search` dan menampilkan sekumpulan pengguna yang sudah difilter di halaman.

Namun, jika pengunjung me-refresh halaman, nilai pencarian dan hasil akan hilang.

Untuk mempertahankan nilai pencarian di seluruh beban halaman sehingga pengunjung dapat me-refresh halaman atau membagikan URL, kita dapat menyimpan nilai pencarian dalam query string URL dengan menambahkan atribut `#[Url]` di atas properti `$search` seperti berikut:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Url;
use Livewire\Component;
use App\Models\User;

class ShowUsers extends Component
{
    #[Url] // [tl! highlight]
    public $search = '';

    public function render()
    {
        return view('livewire.show-users', [
            'posts' => User::search($this->search)->get(),
        ]);
    }
}
```

Sekarang, jika pengguna mengetik "bob" ke dalam field pencarian, bilah URL di browser akan menampilkan:

```
https://example.com/users?search=bob
```

Jika mereka sekarang memuat URL ini dari jendela browser baru, "bob" akan diisi di field pencarian, dan hasil pengguna akan difilter sesuai.

## Menginisialisasi properti dari URL

Seperti yang Anda lihat pada contoh sebelumnya, ketika properti menggunakan `#[Url]`, tidak hanya menyimpan nilai yang diperbarui dalam query string URL, tetapi juga mereferensikan nilai query string yang ada pada saat beban halaman.

Sebagai contoh, jika pengguna mengunjungi URL `https://example.com/users?search=bob`, Livewire akan mengatur nilai awal `$search` menjadi "bob".

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url]
    public $search = ''; // Akan diatur menjadi "bob"...

    // ...
}
```

### Properti nullable

Secara default, jika halaman dimuat dengan entri query string kosong seperti `?search=`, Livewire akan memperlakukan nilai itu sebagai string kosong. Dalam banyak kasus, ini diharapkan, namun ada kalanya Anda ingin `?search=` diperlakukan sebagai `null`.

Dalam kasus ini, Anda dapat menggunakan typehint nullable seperti berikut:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url]
    public ?string $search; // [tl! highlight]

    // ...
}
```

Karena `?` ada dalam typehint di atas, Livewire akan melihat `?search=` dan mengatur `$search` menjadi `null` bukannya string kosong.

Ini juga berlaku sebaliknya, jika Anda mengatur `$this->search = null` dalam aplikasi Anda, itu akan direpresentasikan dalam query string sebagai `?search=`.

## Menggunakan alias

Livewire memberikan Anda kontrol penuh atas nama apa yang ditampilkan dalam query string URL. Sebagai contoh, Anda mungkin memiliki properti `$search` tetapi ingin mengaburkan nama properti sebenarnya atau memperpendeknya menjadi `q`.

Anda dapat menentukan alias query string dengan memberikan parameter `as` ke atribut `#[Url]`:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(as: 'q')]
    public $search = '';

    // ...
}
```

Sekarang, ketika pengguna mengetik "bob" ke dalam field pencarian, URL akan menampilkan: `https://example.com/users?q=bob` bukannya `?search=bob`.

## Mengecualikan nilai tertentu

Secara default, Livewire hanya akan memasukkan entri dalam query string ketika nilainya telah berubah dari saat inisialisasi. Sebagian besar waktu, ini adalah perilaku yang diinginkan, namun ada skenario tertentu di mana Anda mungkin ingin lebih banyak kontrol atas nilai mana yang akan dikecualikan Livewire dari query string. Dalam kasus ini, Anda dapat menggunakan parameter `except`.

Sebagai contoh, dalam komponen di bawah ini, nilai awal `$search` dimodifikasi dalam `mount()`. Untuk memastikan browser hanya akan mengecualikan `search` dari query string jika nilai `search` adalah string kosong, parameter `except` telah ditambahkan ke `#[Url]`:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(except: '')]
    public $search = '';

    public function mount() {
        $this->search = auth()->user()->username;
    }

    // ...
}
```

Tanpa `except` dalam contoh di atas, Livewire akan menghapus entri `search` dari query string setiap kali nilai `search` sama dengan nilai awal dari `auth()->user()->username`. Sebaliknya, karena `except: ''` digunakan, Livewire akan mempertahankan semua nilai query string kecuali ketika `search` adalah string kosong.

## Tampilan pada saat beban halaman

Secara default, Livewire hanya akan menampilkan nilai dalam query string setelah nilai berubah di halaman. Sebagai contoh, jika nilai default untuk `$search` adalah string kosong: `""`, ketika input pencarian aktual kosong, tidak ada nilai yang akan muncul di URL.

Jika Anda ingin entri `?search` selalu disertakan dalam query string, bahkan ketika nilainya kosong, Anda dapat memberikan parameter `keep` ke atribut `#[Url]`:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(keep: true)]
    public $search = '';

    // ...
}
```

Sekarang, ketika halaman dimuat, URL akan diubah menjadi berikut: `https://example.com/users?search=`

## Menyimpan dalam history

Secara default, Livewire menggunakan [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) untuk memodifikasi URL bukannya [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState). Ini berarti ketika Livewire memperbarui query string, ia memodifikasi entri saat ini dalam status history browser bukannya menambahkan yang baru.

Karena Livewire "mengganti" history saat ini, menekan tombol "kembali" di browser akan pergi ke halaman sebelumnya bukannya nilai `?search=` sebelumnya.

Untuk memaksa Livewire menggunakan `history.pushState` saat memperbarui URL, Anda dapat memberikan parameter `history` ke atribut `#[Url]`:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(history: true)]
    public $search = '';

    // ...
}
```

Dalam contoh di atas, ketika pengguna mengubah nilai pencarian dari "bob" menjadi "frank" dan kemudian mengklik tombol kembali browser, nilai pencarian (dan URL) akan diatur kembali menjadi "bob" bukannya menavigasi ke halaman yang dikunjungi sebelumnya.

## Menggunakan metode queryString

Query string juga dapat didefinisikan sebagai metode pada komponen. Ini dapat berguna jika beberapa properti memiliki opsi dinamis.

```php
use Livewire\Component;

class ShowUsers extends Component
{
    // ...

    protected function queryString()
    {
        return [
            'search' => [
                'as' => 'q',
            ],
        ];
    }
}
```

## Trait hooks

Livewire menawarkan [hooks](/docs/lifecycle-hooks) untuk query string juga.

```php
trait WithSorting
{
    // ...

    protected function queryStringWithSorting()
    {
        return [
            'sortBy' => ['as' => 'sort'],
            'sortDirection' => ['as' => 'direction'],
        ];
    }
}
```