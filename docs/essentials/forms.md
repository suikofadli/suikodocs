---
sidebar_position: 7
---

# Forms

Karena *form* adalah *tulang punggung* sebagian besar aplikasi *web*, Livewire menyediakan banyak utilitas berguna untuk membangunnya. Dari menangani *elemen input* sederhana hingga hal-hal kompleks seperti *validasi real-time* atau pengunggahan *file*, Livewire memiliki alat-alat yang sederhana dan terdokumentasi dengan baik untuk mempermudah hidup Anda dan menyenangkan *user* Anda.

Mari kita mulai.

## Mengirimkan form

Mari kita mulai dengan melihat *form* yang sangat sederhana dalam *component* `CreatePost`. *Form* ini akan memiliki dua *input teks* sederhana dan *tombol submit*, serta beberapa kode di *backend* untuk mengelola *state* dan pengiriman *form*:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title = '';

    public $content = '';

    public function save()
    {
        Post::create(
            $this->only(['title', 'content'])
        );

        session()->flash('status', 'Post successfully updated.');

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save">
    <input type="text" wire:model="title">

    <input type="text" wire:model="content">

    <button type="submit">Save</button>
</form>
```

Seperti yang Anda lihat, kita *"mengikat"* *public properties* `$title` dan `$content` dalam *form* di atas menggunakan `wire:model`. Ini adalah salah satu fitur Livewire yang paling umum digunakan dan *powerful*.

Selain mengikat `$title` dan `$content`, kita menggunakan `wire:submit` untuk menangkap *event* `submit` ketika *tombol* "Save" diklik dan memanggil *action* `save()`. *Action* ini akan mempertahankan *input form* ke *database*.

Setelah *post* baru dibuat di *database*, kita mengarahkan *user* ke halaman *component* `ShowPosts` dan menunjukkan kepada mereka *pesan flash* bahwa *post* baru telah dibuat.

### Menambahkan validasi

Untuk menghindari menyimpan *input user* yang tidak lengkap atau berbahaya, sebagian besar *form* memerlukan beberapa jenis *validasi input*.

Livewire membuat *validasi form* Anda sesederhana menambahkan *attribute* `#[Validate]` di atas *properties* yang ingin Anda validasi.

Setelah sebuah *property* memiliki *attribute* `#[Validate]` yang terpasang, aturan validasi akan diterapkan ke nilai *property* kapan pun diperbarui di sisi *server*.

Mari kita tambahkan beberapa aturan validasi dasar ke properties `$title` dan `$content` dalam komponen `CreatePost` kita:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Validate; // [tl! highlight]
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required')] // [tl! highlight]
    public $title = '';

    #[Validate('required')] // [tl! highlight]
    public $content = '';

    public function save()
    {
        $this->validate(); // [tl! highlight]

        Post::create(
            $this->only(['title', 'content'])
        );

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

Kita juga akan memodifikasi *template Blade* kita untuk menampilkan *error validasi* apa pun di halaman.

```blade
<form wire:submit="save">
    <input type="text" wire:model="title">
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror <!-- [tl! highlight] -->
    </div>

    <input type="text" wire:model="content">
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror <!-- [tl! highlight] -->
    </div>

    <button type="submit">Save</button>
</form>
```

Sekarang, jika *user* mencoba mengirimkan *form* tanpa mengisi *field* mana pun, mereka akan melihat *pesan validasi* yang memberi tahu mereka *field* mana yang *wajib diisi* sebelum menyimpan *post*.

Livewire memiliki lebih banyak fitur validasi untuk ditawarkan. Untuk informasi lebih lanjut, kunjungi [halaman dokumentasi khusus kami tentang Validasi](/docs/validation).

### Mengekstrak objek form

Jika Anda bekerja dengan *form* yang besar dan lebih suka mengekstrak semua *properties*, *logika validasi*, dll., ke dalam *kelas* terpisah, Livewire menawarkan *form objects*.

*Form objects* memungkinkan Anda untuk menggunakan kembali *logika form* di seluruh *component* dan menyediakan cara yang bagus untuk menjaga *kelas component* Anda lebih bersih dengan mengelompokkan semua kode terkait *form* ke dalam *kelas* terpisah.

Anda dapat membuat *kelas form* secara manual atau menggunakan *perintah artisan* yang mudah:

```shell
php artisan livewire:form PostForm
```

*Perintah* di atas akan membuat file bernama `app/Livewire/Forms/PostForm.php`.

Mari kita tulis ulang *component* `CreatePost` untuk menggunakan *kelas* `PostForm`:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';
}
```

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public PostForm $form; // [tl! highlight]

    public function save()
    {
        $this->validate();

        Post::create(
            $this->form->only(['title', 'content']) // [tl! highlight]
        );

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save">
    <input type="text" wire:model="form.title">
    <div>
        @error('form.title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model="form.content">
    <div>
        @error('form.content') <span class="error">{{ $message }}</span> @enderror
    </div>

    <button type="submit">Save</button>
</form>
```

Jika Anda mau, Anda juga dapat mengekstrak *logika pembuatan post* ke dalam *form object* seperti ini:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    public function store() // [tl! highlight:5]
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));
    }
}
```

Sekarang Anda dapat memanggil `$this->form->store()` dari komponen:

```php
class CreatePost extends Component
{
    public PostForm $form;

    public function save()
    {
        $this->form->store(); // [tl! highlight]

        return $this->redirect('/posts');
    }

    // ...
}
```

Jika Anda ingin menggunakan objek form ini untuk form create dan update, Anda dapat dengan mudah menyesuaikannya untuk menangani kedua kasus penggunaan.

Berikut tampilannya menggunakan objek form yang sama untuk komponen `UpdatePost` dan mengisinya dengan data awal:

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public PostForm $form;

    public function mount(Post $post)
    {
        $this->form->setPost($post);
    }

    public function save()
    {
        $this->form->update();

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;
use App\Models\Post;

class PostForm extends Form
{
    public ?Post $post;

    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    public function setPost(Post $post)
    {
        $this->post = $post;

        $this->title = $post->title;

        $this->content = $post->content;
    }

    public function store()
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));
    }

    public function update()
    {
        $this->validate();

        $this->post->update(
            $this->only(['title', 'content'])
        );
    }
}
```

Seperti yang Anda lihat, kita telah menambahkan metode `setPost()` ke objek `PostForm` untuk secara opsional memungkinkan pengisian form dengan data yang ada serta menyimpan post pada objek form untuk digunakan nanti. Kami juga telah menambahkan metode `update()` untuk memperbarui post yang ada.

*Form objects* tidak diperlukan saat bekerja dengan Livewire, tetapi mereka menawarkan *abstraksi* yang bagus untuk menjaga *component* Anda bebas dari *boilerplate* yang berulang.

### Me-reset field form

Jika Anda menggunakan objek form, Anda mungkin ingin me-reset form setelah dikirim. Ini dapat dilakukan dengan memanggil metode `reset()`:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    // ...

    public function store()
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));

        $this->reset(); // [tl! highlight]
    }
}
```

Anda juga dapat me-reset properties tertentu dengan memasukkan nama properties ke dalam metode `reset()`:

```php
$this->reset('title');

// Atau beberapa sekaligus...

$this->reset(['title', 'content']);
```

### Mengambil field form

Sebagai alternatif, Anda dapat menggunakan metode `pull()` untuk mengambil properties form dan me-resetnya dalam satu operasi.

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    // ...

    public function store()
    {
        $this->validate();

        Post::create(
            $this->pull() // [tl! highlight]
        );
    }
}
```

Anda juga dapat mengambil properties tertentu dengan memasukkan nama properties ke dalam metode `pull()`:

```php
// Mengembalikan nilai sebelum me-reset...
$this->pull('title');

 // Mengembalikan array key-value dari properties sebelum me-reset...
$this->pull(['title', 'content']);
```

### Menggunakan objek Rule

Jika Anda memiliki skenario validasi yang lebih canggih di mana objek `Rule` Laravel diperlukan, Anda dapat secara alternatif mendefinisikan metode `rules()` untuk mendeklarasikan aturan validasi Anda seperti ini:

```php
<?php

namespace App\Livewire\Forms;

use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    public ?Post $post;

    public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => [
                'required',
                Rule::unique('posts')->ignore($this->post), // [tl! highlight]
            ],
            'content' => 'required|min:5',
        ];
    }

    // ...

    public function update()
    {
        $this->validate();

        $this->post->update($this->only(['title', 'content']));

        $this->reset();
    }
}
```

Saat menggunakan metode `rules()` sebagai ganti `#[Validate]`, Livewire hanya akan menjalankan aturan validasi ketika Anda memanggil `$this->validate()`, bukan setiap kali property diperbarui.

Jika Anda menggunakan validasi real-time atau skenario lain di mana Anda ingin Livewire memvalidasi field tertentu setelah setiap request, Anda dapat menggunakan `#[Validate]` tanpa aturan yang disediakan seperti ini:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    public ?Post $post;

    #[Validate] // [tl! highlight]
    public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => [
                'required',
                Rule::unique('posts')->ignore($this->post),
            ],
            'content' => 'required|min:5',
        ];
    }

    // ...

    public function update()
    {
        $this->validate();

        $this->post->update($this->only(['title', 'content']));

        $this->reset();
    }
}
```

Sekarang jika property `$title` diperbarui sebelum form dikirim—seperti saat menggunakan [`wire:model.blur`](/docs/wire-model#updating-on-blur-event)—validasi untuk `$title` akan dijalankan.

### Menunjukkan indikator loading

Secara default, Livewire akan secara otomatis menonaktifkan *tombol submit* dan menandai *input* sebagai `readonly` saat *form* sedang dikirim, mencegah *user* mengirimkan *form* lagi saat pengiriman pertama sedang ditangani.

Namun, bisa jadi sulit bagi *user* untuk mendeteksi *state* "*loading*" ini tanpa tambahan di *UI* aplikasi Anda.

Berikut adalah contoh menambahkan spinner loading kecil ke tombol "Save" melalui `wire:loading` sehingga user memahami bahwa form sedang dikirim:

```blade
<button type="submit">
    Save

    <div wire:loading>
        <svg>...</svg> <!-- SVG loading spinner -->
    </div>
</button>
```

Sekarang, ketika user menekan "Save", spinner kecil sebaris akan muncul.

Fitur `wire:loading` Livewire memiliki lebih banyak lagi untuk ditawarkan. Kunjungi [Dokumentasi Loading untuk mempelajari lebih lanjut.](/docs/wire-loading)

## Field yang diperbarui secara real-time

Secara default, Livewire hanya mengirim *permintaan jaringan* ketika *form* dikirim (atau [action](/docs/actions) lainnya dipanggil), bukan saat *form* sedang diisi.

Ambil *component* `CreatePost` sebagai contoh. Jika Anda ingin memastikan *field input* "title" disinkronkan dengan *property* `$title` di *backend* saat *user* mengetik, Anda dapat menambahkan *modifier* `.live` ke `wire:model` seperti ini:

```blade
<input type="text" wire:model.live="title">
```

Sekarang, saat user mengetik di field ini, permintaan jaringan akan dikirim ke server untuk memperbarui `$title`. Ini berguna untuk hal-hal seperti pencarian real-time, di mana dataset disaring saat user mengetik di kotak pencarian.

## Hanya memperbarui field pada _blur_

Untuk sebagian besar kasus, `wire:model.live` baik untuk pembaruan field form real-time; namun, bisa jadi terlalu intensif sumber daya jaringan pada input teks.

Jika alih-alih mengirim permintaan jaringan saat user mengetik, Anda sebagai gantinya hanya ingin mengirim permintaan saat user "tab" keluar dari input teks (juga disebut sebagai "mengaburkan" input), Anda dapat menggunakan modifier `.blur` sebagai gantinya:

```blade
<input type="text" wire:model.blur="title" >
```

Sekarang kelas komponen di server tidak akan diperbarui sampai user menekan tab atau mengklik menjauh dari input teks.

## Validasi real-time

Terkadang, Anda mungkin ingin menunjukkan kesalahan validasi saat user mengisi form. Dengan cara ini, mereka diberi tahu lebih awal bahwa ada sesuatu yang salah alih-alih harus menunggu sampai seluruh form diisi.

Livewire menangani jenis hal ini secara otomatis. Dengan menggunakan `.live` atau `.blur` pada `wire:model`, Livewire akan mengirim permintaan jaringan saat user mengisi form. Setiap permintaan jaringan tersebut akan menjalankan aturan validasi yang sesuai sebelum memperbarui setiap property. Jika validasi gagal, property tidak akan diperbarui di server dan pesan validasi akan ditampilkan kepada user:

```blade
<input type="text" wire:model.blur="title">

<div>
    @error('title') <span class="error">{{ $message }}</span> @enderror
</div>
```

```php
#[Validate('required|min:5')]
public $title = '';
```

Sekarang, jika user hanya mengetik tiga karakter ke dalam input "title", lalu mengklik input berikutnya dalam form, pesan validasi akan ditampilkan kepada mereka yang menunjukkan ada minimum lima karakter untuk field tersebut.

Untuk informasi lebih lanjut, periksa [halaman dokumentasi validasi](/docs/validation).

## Penyimpanan form real-time

Jika Anda ingin secara otomatis menyimpan form saat user mengisinya alih-alih menunggu sampai user mengklik "submit", Anda dapat melakukannya menggunakan hook `updated()` Livewire:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public Post $post;

    #[Validate('required')]
    public $title = '';

    #[Validate('required')]
    public $content = '';

    public function mount(Post $post)
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function updated($name, $value) // [tl! highlight:5]
    {
        $this->post->update([
            $name => $value,
        ]);
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit>
    <input type="text" wire:model.blur="title">
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model.blur="content">
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror
    </div>
</form>
```

Dalam contoh di atas, ketika user menyelesaikan field (dengan mengklik atau men-tab ke field berikutnya), permintaan jaringan dikirim untuk memperbarui property tersebut pada komponen. Segera setelah property diperbarui pada kelas, hook `updated()` dipanggil untuk nama property spesifik itu dan nilai barunya.

Kita dapat menggunakan hook ini untuk memperbarui hanya field tertentu itu dalam database.

Selain itu, karena kita memiliki atribut `#[Validate]` yang terpasang pada properties tersebut, aturan validasi akan dijalankan sebelum property diperbarui dan hook `updated()` dipanggil.

Untuk mempelajari lebih lanjut tentang hook lifecycle "updated" dan hook lainnya, [kunjungi dokumentasi lifecycle hooks](/docs/lifecycle-hooks).

## Menunjukkan indikator kotor

Dalam skenario penyimpanan real-time yang dibahas di atas, mungkin membantu untuk menunjukkan kepada user ketika field belum dipertahankan ke database.

Sebagai contoh, jika user mengunjungi halaman `UpdatePost` dan mulai memodifikasi judul post dalam input teks, mungkin tidak jelas bagi mereka kapan judul sebenarnya diperbarui di database, terutama jika tidak ada tombol "Save" di bagian bawah form.

Livewire menyediakan direktif `wire:dirty` untuk memungkinkan Anda mengaktifkan elemen atau memodifikasi kelas ketika nilai input menyimpang dari komponen sisi server:

```blade
<input type="text" wire:model.blur="title" wire:dirty.class="border-yellow">
```

Dalam contoh di atas, ketika user mengetik di field input, border kuning akan muncul di sekitar field. Ketika user men-tab menjauh, permintaan jaringan dikirim dan border akan menghilang; memberi sinyal kepada mereka bahwa input telah dipertahankan dan tidak lagi "kotor".

Jika Anda ingin mengaktifkan visibilitas seluruh elemen, Anda dapat melakukannya dengan menggunakan `wire:dirty` bersama dengan `wire:target`. `wire:target` digunakan untuk menentukan bagian data mana yang ingin Anda awasi untuk "kotor". Dalam kasus ini, field "title":

```blade
<input type="text" wire:model="title">

<div wire:dirty wire:target="title">Unsaved...</div>
```

## Mendebounce input

Saat menggunakan `.live` pada input teks, Anda mungkin menginginkan kontrol yang lebih halus atas seberapa sering permintaan jaringan dikirim. Secara default, debounce "250ms" diterapkan ke input; namun, Anda dapat menyesuaikannya menggunakan modifier `.debounce`:

```blade
<input type="text" wire:model.live.debounce.150ms="title" >
```

Sekarang bahwa `.debounce.150ms` telah ditambahkan ke field, debounce yang lebih pendek "150ms" akan digunakan saat menangani pembaruan input untuk field ini. Dengan kata lain, saat user mengetik, permintaan jaringan hanya akan dikirim jika user berhenti mengetik setidaknya selama 150 milidetik.

## Menthrottle input

Seperti dinyatakan sebelumnya, ketika input debounce diterapkan ke field, permintaan jaringan tidak akan dikirim sampai user berhenti mengetik untuk jumlah waktu tertentu. Ini berarti jika user terus mengetik pesan panjang, permintaan jaringan tidak akan dikirim sampai user selesai.

Terkadang ini bukan perilaku yang diinginkan, dan Anda lebih suka mengirim permintaan saat user mengetik, bukan ketika mereka selesai atau beristirahat.

Dalam kasus ini, Anda dapat sebagai gantinya menggunakan `.throttle` untuk menandakan interval waktu untuk mengirim permintaan jaringan:

```blade
<input type="text" wire:model.live.throttle.150ms="title" >
```

Dalam contoh di atas, saat user terus mengetik secara kontinu di field "title", permintaan jaringan akan dikirim setiap 150 milidetik sampai user selesai.

## Mengekstrak field input ke komponen Blade

Bahkan dalam komponen kecil seperti contoh `CreatePost` yang telah kita diskusikan, kita akhirnya menduplikasi banyak boilerplate field form seperti pesan validasi dan label.

Dapat membantu untuk mengekstrak elemen UI yang berulang seperti ini ke [komponen Blade](https://laravel.com/docs/blade#components) khusus untuk dibagikan di seluruh aplikasi Anda.

Sebagai contoh, di bawah ini adalah template Blade asli dari komponen `CreatePost`. Kami akan mengekstrak dua input teks berikut ke komponen Blade khusus:

```blade
<form wire:submit="save">
    <input type="text" wire:model="title"> <!-- [tl! highlight:3] -->
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model="content"> <!-- [tl! highlight:3] -->
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror
    </div>

    <button type="submit">Save</button>
</form>
```

Berikut tampilan template setelah mengekstrak komponen Blade yang dapat digunakan kembali yang disebut `<x-input-text>`:

```blade
<form wire:submit="save">
    <x-input-text name="title" wire:model="title" /> <!-- [tl! highlight] -->

    <x-input-text name="content" wire:model="content" /> <!-- [tl! highlight] -->

    <button type="submit">Save</button>
</form>
```

Selanjutnya, berikut adalah sumber untuk komponen `x-input-text`:

```blade
<!-- resources/views/components/input-text.blade.php -->

@props(['name'])

<input type="text" name="{{ $name }}" {{ $attributes }}>

<div>
    @error($name) <span class="error">{{ $message }}</span> @enderror
</div>
```

Seperti yang Anda lihat, kita mengambil HTML yang berulang dan menempatkannya di dalam komponen Blade khusus.

Untuk sebagian besar, komponen Blade hanya mengandung HTML yang diekstrak dari komponen asli. Namun, kami telah menambahkan dua hal:

* Direktif `@props`
* Pernyataan `{{ $attributes }}` pada input

Mari kita diskusikan masing-masing tambahan ini:

Dengan menentukan `name` sebagai "prop" menggunakan `@props(['name'])` kami memberi tahu Blade: jika atribut bernama "name" diatur pada komponen ini, ambil nilainya dan buat tersedia di dalam komponen ini sebagai `$name`.

Untuk atribut lain yang tidak memiliki tujuan eksplisit, kami menggunakan pernyataan `{{ $attributes }}`. Ini digunakan untuk "attribute forwarding", atau dengan kata lain, mengambil atribut HTML apa pun yang ditulis pada komponen Blade dan meneruskannya ke elemen dalam komponen.

Ini memastikan `wire:model="title"` dan atribut tambahan lainnya seperti `disabled`, `class="..."`, atau `required` tetap diteruskan ke elemen `<input>` yang sebenarnya.

### Kontrol form kustom

Dalam contoh sebelumnya, kita "membungkus" elemen input ke dalam komponen Blade yang dapat digunakan kembali yang dapat kita gunakan seolah-olah itu adalah elemen input HTML asli.

Pola ini sangat berguna; namun, mungkin ada beberapa kasus di mana Anda ingin membuat seluruh komponen input dari awal (tanpa elemen input asli yang mendasarinya), tetapi masih dapat mengikat nilainya ke properties Livewire menggunakan `wire:model`.

Sebagai contoh, mari kita bayangkan Anda ingin membuat komponen `<x-input-counter />` yang merupakan input "counter" sederhana yang ditulis dalam Alpine.

Sebelum kita membuat komponen Blade, mari kita pertama-tama lihat komponen "counter" Alpine murni yang sederhana untuk referensi:

```blade
<div x-data="{ count: 0 }">
    <button x-on:click="count--">-</button>

    <span x-text="count"></span>

    <button x-on:click="count++">+</button>
</div>
```

Seperti yang Anda lihat, komponen di atas menunjukkan angka di samping dua tombol untuk menambah dan mengurangi angka tersebut.

Sekarang, mari kita bayangkan kita ingin mengekstrak komponen ini ke dalam komponen Blade yang disebut `<x-input-counter />` yang akan kita gunakan dalam komponen seperti ini:

```blade
<x-input-counter wire:model="quantity" />
```

Membuat komponen ini sebagian besar sederhana. Kita mengambil HTML dari counter dan menempatkannya di dalam template komponen Blade seperti `resources/views/components/input-counter.blade.php`.

Namun, membuatnya bekerja dengan `wire:model="quantity"` sehingga Anda dapat dengan mudah mengikat data dari komponen Livewire Anda ke "count" di dalam komponen Alpine ini membutuhkan satu langkah tambahan.

Berikut adalah sumber untuk komponen:

```blade
<!-- resources/view/components/input-counter.blade.php -->

<div x-data="{ count: 0 }" x-modelable="count" {{ $attributes}}>
    <button x-on:click="count--">-</button>

    <span x-text="count"></span>

    <button x-on:click="count++">+</button>
</div>
```

Seperti yang Anda lihat, satu-satunya bagian yang berbeda tentang HTML ini adalah `x-modelable="count"` dan `{{ $attributes }}`.

`x-modelable` adalah utilitas di Alpine yang memberi tahu Alpine untuk membuat bagian data tertentu tersedia untuk pengikatan dari luar. [Dokumentasi Alpine memiliki informasi lebih lanjut tentang direktif ini.](https://alpinejs.dev/directives/modelable)

`{{ $attributes }}`, seperti kita jelaskan sebelumnya, meneruskan atribut apa pun yang dimasukkan ke dalam komponen Blade dari luar. Dalam kasus ini, direktif `wire:model` akan diteruskan.

Karena `{{ $attributes }}`, ketika HTML dirender di browser, `wire:model="quantity"` akan dirender bersama dengan `x-modelable="count"` pada `<div>` root komponen Alpine seperti ini:

```blade
<div x-data="{ count: 0 }" x-modelable="count" wire:model="quantity">
```

`x-modelable="count"` memberi tahu Alpine untuk mencari pernyataan `x-model` atau `wire:model` apa pun dan menggunakan "count" sebagai data untuk mengikatnya.

Karena `x-modelable` bekerja untuk `wire:model` dan `x-model`, Anda juga dapat menggunakan komponen Blade ini secara bergantian dengan Livewire dan Alpine. Berikut adalah contoh menggunakan komponen Blade ini dalam konteks Alpine murni:

```blade
<x-input-counter x-model="quantity" />
```

Membuat elemen input khusus dalam aplikasi Anda sangat kuat tetapi memerlukan pemahaman yang lebih dalam tentang utilitas yang disediakan Livewire dan Alpine dan bagaimana mereka berinteraksi satu sama lain.