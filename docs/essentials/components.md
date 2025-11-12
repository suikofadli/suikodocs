---
sidebar_position: 4
---

# Components

Components adalah blok bangunan dari aplikasi Livewire Anda. Mereka menggabungkan state dan perilaku untuk membuat bagian UI yang dapat digunakan kembali untuk frontend Anda. Di sini, kita akan membahas dasar-dasar membuat dan me-render komponen.

## Membuat komponen

Komponen Livewire hanyalah kelas PHP yang extends `Livewire\Component`. Anda dapat membuat file komponen secara manual atau menggunakan perintah Artisan berikut:

```shell
php artisan make:livewire CreatePost
```

Jika Anda lebih suka nama kebab-cased, Anda juga dapat menggunakannya:

```shell
php artisan make:livewire create-post
```

Setelah menjalankan perintah ini, Livewire akan membuat dua file baru di aplikasi Anda. Yang pertama akan menjadi kelas komponen: `app/Livewire/CreatePost.php`

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
	public function render()
	{
		return view('livewire.create-post');
	}
}
```

Yang kedua akan menjadi tampilan Blade komponen: `resources/views/livewire/create-post.blade.php`

```php
<div>
	{{-- ... --}}
</div>
```

Anda dapat menggunakan sintaks namespace atau dot-notation untuk membuat komponen Anda di sub-direktori. Misalnya, perintah berikut akan membuat komponen `CreatePost` di sub-direktori `Posts`:

```shell
php artisan make:livewire Posts\\CreatePost
php artisan make:livewire posts.create-post
```

### Komponen inline

Jika komponen Anda cukup kecil, Anda mungkin ingin membuat komponen _inline_. Komponen inline adalah komponen Livewire file tunggal yang template tampilannya terkandung langsung dalam metode `render()` daripada file terpisah:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
	public function render()
	{
		return <<<'HTML' // [tl! highlight:4]
		<div>
		    {{-- Your Blade template goes here... --}}
		</div>
		HTML;
	}
}
```

Anda dapat membuat komponen inline dengan menambahkan flag `--inline` ke perintah `make:livewire`:

```shell
php artisan make:livewire CreatePost --inline
```

### Menghilangkan metode render

Untuk mengurangi boilerplate di komponen Anda, Anda dapat menghilangkan metode `render()` sepenuhnya dan Livewire akan menggunakan metode `render()` yang mendasarinya, yang mengembalikan tampilan dengan nama konvensional yang sesuai dengan komponen Anda:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    //
}
```

Jika komponen di atas di-render pada halaman, Livewire akan secara otomatis menentukan bahwa itu harus di-render menggunakan template `livewire.create-post`.

### Mengkustomisasi stub komponen

Anda dapat mengkustomisasi file (atau _stubs_) yang digunakan Livewire untuk menghasilkan komponen baru dengan menjalankan perintah berikut:

```shell
php artisan livewire:stubs
```

Ini akan membuat tujuh file baru di aplikasi Anda:

* `stubs/livewire.stub` — digunakan untuk menghasilkan komponen baru
* `stubs/livewire.attribute.stub` — digunakan untuk menghasilkan kelas atribut
* `stubs/livewire.form.stub` — digunakan untuk menghasilkan kelas form
* `stubs/livewire.inline.stub` — digunakan untuk menghasilkan komponen _inline_
* `stubs/livewire.pest-test.stub` — digunakan untuk menghasilkan file tes Pest
* `stubs/livewire.test.stub` — digunakan untuk menghasilkan file tes PHPUnit
* `stubs/livewire.view.stub` — digunakan untuk menghasilkan tampilan komponen

Meskipun file ini berada di aplikasi Anda, Anda masih dapat menggunakan perintah Artisan `make:livewire` dan Livewire akan secara otomatis menggunakan stub kustom Anda saat menghasilkan file.

## Mengatur properti

Komponen Livewire memiliki properti yang menyimpan data dan dapat dengan mudah diakses di dalam kelas komponen dan tampilan Blade. Bagian ini membahas dasar-dasar menambahkan properti ke komponen dan menggunakannya di aplikasi Anda.

Untuk menambahkan properti ke komponen Livewire, deklarasikan properti publik di kelas komponen Anda. Misalnya, mari kita buat properti `$title` di komponen `CreatePost`:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title = 'Post title...';

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

### Mengakses properti di tampilan

Properti komponen secara otomatis tersedia untuk tampilan Blade komponen. Anda dapat merujuknya menggunakan sintaks Blade standar. Di sini kita akan menampilkan nilai properti `$title`:

```php
<div>
    <h1>Title: "{{ $title }}"</h1>
</div>
```

Output yang di-render dari komponen ini akan menjadi:

```php
<div>
    <h1>Title: "Post title..."</h1>
</div>
```

### Berbagi data tambahan dengan tampilan

Selain mengakses properti dari tampilan, Anda dapat secara eksplisit meneruskan data ke tampilan dari metode `render()`, seperti yang biasanya Anda lakukan dari controller. Ini dapat berguna ketika Anda ingin meneruskan data tambahan tanpa terlebih dahulu menyimpannya sebagai properti—karena properti memiliki [implikasi performa dan keamanan yang spesifik](/docs/properties#security-concerns).

Untuk meneruskan data ke tampilan dalam metode `render()`, Anda dapat menggunakan metode `with()` pada instance tampilan. Misalnya, mari katakan Anda ingin meneruskan nama penulis posting ke tampilan. Dalam kasus ini, penulis posting adalah pengguna yang saat ini diautentikasi:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class CreatePost extends Component
{
    public $title;

    public function render()
    {
        return view('livewire.create-post')->with([
	        'author' => Auth::user()->name,
	    ]);
    }
}
```

Sekarang Anda dapat mengakses properti `$author` dari tampilan Blade komponen:

```php
<div>
	<h1>Title: {{ $title }}</h1>

	<span>Author: {{ $author }}</span>
</div>
```

### Menambahkan `wire:key` ke loop `@foreach`

Saat melakukan loop melalui data dalam template Livewire menggunakan `@foreach`, Anda harus menambahkan atribut `wire:key` unik ke elemen root yang di-render oleh loop.

Tanpa atribut `wire:key` yang ada dalam loop Blade, Livewire tidak akan dapat mencocokkan elemen lama dengan posisi baru mereka saat loop berubah. Ini dapat menyebabkan banyak masalah yang sulit didiagnosis di aplikasi Anda.

Misalnya, jika Anda melakukan loop melalui array posts, Anda dapat mengatur atribut `wire:key` ke ID posting:

```php
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}"> <!-- [tl! highlight] -->
            <!-- ... -->
        </div>
    @endforeach
</div>
```

Jika Anda melakukan loop melalui array yang me-render komponen Livewire, Anda dapat mengatur kunci sebagai atribut komponen `:key` atau meneruskan kunci sebagai argumen ketiga saat menggunakan directive `@livewire`.

```php
<div>
    @foreach ($posts as $post)
        <livewire:post-item :$post :key="$post->id">

        @livewire(PostItem::class, ['post' => $post], key($post->id))
    @endforeach
</div>
```

### Mengikat input ke properti

Salah satu fitur paling kuat Livewire adalah "data binding": kemampuan untuk secara otomatis menjaga properti tetap sinkron dengan input form di halaman.

Mari kita ikat properti `$title` dari komponen `CreatePost` ke input teks menggunakan directive `wire:model`:

```php
<form>
    <label for="title">Title:</label>

    <input type="text" id="title" wire:model="title"> <!-- [tl! highlight] -->
</form>
```

Setiap perubahan yang dilakukan pada input teks akan secara otomatis disinkronkan dengan properti `$title` di komponen Livewire Anda.

> [!warning] "Kenapa komponen saya tidak diperbarui secara live saat saya mengetik?"
> Jika Anda mencoba ini di browser Anda dan bingung mengapa judul tidak diperbarui secara otomatis, itu karena Livewire hanya memperbarui komponen ketika "aksi" diajukan—seperti menekan tombol submit—bukan saat pengguna mengetik di bidang. Ini mengurangi permintaan jaringan dan meningkatkan performa. Untuk mengaktifkan pembaruan "live" saat pengguna mengetik, Anda dapat menggunakan `wire:model.live` sebagai gantinya. [Pelajari lebih lanjut tentang data binding](/docs/properties#data-binding).


Properti Livewire sangat kuat dan merupakan konsep penting untuk dipahami. Untuk informasi lebih lanjut, lihat [dokumentasi properti Livewire](/docs/properties).

## Memanggil aksi

Aksi adalah metode dalam komponen Livewire Anda yang menangani interaksi pengguna atau melakukan tugas tertentu. Mereka sering berguna untuk merespons klik tombol atau pengiriman form di halaman.

Untuk mempelajari lebih lanjut tentang aksi, mari kita tambahkan aksi `save` ke komponen `CreatePost`:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title;

    public function save() // [tl! highlight:8]
    {
		Post::create([
			'title' => $this->title
		]);

		return redirect()->to('/posts')
			->with('status', 'Post created!');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

Selanjutnya, mari kita panggil aksi `save` dari tampilan Blade komponen dengan menambahkan directive `wire:submit` ke elemen `<form>`:

```php
<form wire:submit="save"> <!-- [tl! highlight] -->
    <label for="title">Title:</label>

    <input type="text" id="title" wire:model="title">

	<button type="submit">Save</button>
</form>
```

Saat tombol "Save" diklik, metode `save()` di komponen Livewire Anda akan dieksekusi dan komponen Anda akan di-render ulang.

Untuk terus belajar tentang aksi Livewire, kunjungi [dokumentasi aksi](/docs/actions).

## Me-render komponen

Ada dua cara untuk me-render komponen Livewire di halaman:

1. Sertakan dalam tampilan Blade yang ada
2. Tetapkan langsung ke rute sebagai komponen halaman penuh

Mari kita bahas cara pertama untuk me-render komponen Anda, karena ini lebih sederhana dari cara kedua.

Anda dapat menyertakan komponen Livewire dalam template Blade Anda menggunakan sintaks `<livewire:component-name />`:

```php
<livewire:create-post />
```

Jika kelas komponen bersarang lebih dalam dalam direktori `app/Livewire/`, Anda dapat menggunakan karakter `.` untuk mengindikasikan nesting direktori. Misalnya, jika kita mengasumsikan komponen berada di `app/Livewire/EditorPosts/CreatePost.php`, kita dapat me-rendernya seperti ini:

```php
<livewire:editor-posts.create-post />
```

> [!warning] Anda harus menggunakan kebab-case
> Seperti yang Anda lihat dalam cuplikan di atas, Anda harus menggunakan versi _kebab-cased_ dari nama komponen. Menggunakan versi _StudlyCase_ dari nama (`<livewire:CreatePost />`) tidak valid dan tidak akan dikenali oleh Livewire.


### Meneruskan data ke dalam komponen

Untuk meneruskan data luar ke dalam komponen Livewire, Anda dapat menggunakan atribut pada tag komponen. Ini berguna ketika Anda ingin menginisialisasi komponen dengan data tertentu.

Untuk meneruskan nilai awal ke properti `$title` dari komponen `CreatePost`, Anda dapat menggunakan sintaks berikut:

```php
<livewire:create-post title="Initial Title" />
```

Jika Anda perlu meneruskan nilai dinamis atau variabel ke komponen, Anda dapat menulis ekspresi PHP dalam atribut komponen dengan mengawali atribut dengan titik dua:

```php
<livewire:create-post :title="$initialTitle" />
```

Data yang diteruskan ke dalam komponen diterima melalui lifecycle hook `mount()` sebagai parameter metode. Dalam kasus ini, untuk menetapkan parameter `$title` ke properti, Anda akan menulis metode `mount()` seperti berikut:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title;

    public function mount($title = null)
    {
        $this->title = $title;
    }

    // ...
}
```

Dalam contoh ini, properti `$title` akan diinisialisasi dengan nilai "Initial Title".

Anda dapat menganggap metode `mount()` sebagai konstruktor kelas. Ini berjalan pada load awal komponen, tetapi tidak pada permintaan berikutnya dalam halaman. Anda dapat mempelajari lebih lanjut tentang `mount()` dan lifecycle hook berguna lainnya dalam [dokumentasi lifecycle](/docs/lifecycle-hooks).

Untuk mengurangi kode boilerplate di komponen Anda, Anda juga dapat menghilangkan metode `mount()` dan Livewire akan secara otomatis mengatur properti apa pun di komponen Anda dengan nama yang cocok dengan nilai yang diteruskan:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title; // [tl! highlight]

    // ...
}
```

Ini secara efektif sama dengan menetapkan `$title` di dalam metode `mount()`.

> [!warning] Properti ini tidak reaktif secara default
> Properti `$title` tidak akan diperbarui secara otomatis jika `:title="$initialValue"` luar berubah setelah load halaman awal. Ini adalah titik kebingungan yang umum saat menggunakan Livewire, terutama untuk pengembang yang telah menggunakan framework JavaScript seperti Vue atau React dan mengasumsikan "parameter" ini berperilaku seperti "reactive props" di framework tersebut. Tapi, jangan khawatir, Livewire memungkinkan Anda untuk opt-in ke [membuat props Anda reaktif](/docs/nesting#reactive-props).


## Komponen halaman penuh

Livewire memungkinkan Anda untuk menetapkan komponen langsung ke rute di aplikasi Laravel Anda. Ini disebut "komponen halaman penuh". Anda dapat menggunakannya untuk membuat halaman mandiri dengan logika dan tampilan, sepenuhnya dikapsulkan dalam komponen Livewire.

Untuk membuat komponen halaman penuh, tentukan rute di file `routes/web.php` Anda dan gunakan metode `Route::get()` untuk memetakan komponen langsung ke URL tertentu. Misalnya, mari kita bayangkan Anda ingin me-render komponen `CreatePost` di rute khusus: `/posts/create`.

Anda dapat melakukan ini dengan menambahkan baris berikut ke file `routes/web.php` Anda:

```php
use App\Livewire\CreatePost;

Route::get('/posts/create', CreatePost::class);
```

Sekarang, saat Anda mengunjungi path `/posts/create` di browser Anda, komponen `CreatePost` akan di-render sebagai komponen halaman penuh.

### File layout

Ingat bahwa komponen halaman penuh akan menggunakan layout aplikasi Anda, biasanya didefinisikan dalam file `resources/views/components/layouts/app.blade.php`.

Anda dapat membuat file ini jika belum ada dengan menjalankan perintah berikut:

```shell
php artisan livewire:layout
```

Perintah ini akan menghasilkan file bernama `resources/views/components/layouts/app.blade.php`.

Pastikan Anda telah membuat file Blade di lokasi ini dan menyertakan placeholder `{{ $slot }}`:

```php
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

#### Konfigurasi layout global

Untuk menggunakan layout kustom di semua komponen Anda, Anda dapat mengatur kunci `layout` di `config/livewire.php` ke path layout kustom Anda, relatif terhadap `resources/views`. Misalnya:

```php
'layout' => 'layouts.app',
```

Dengan konfigurasi di atas, Livewire akan me-render komponen halaman penuh di dalam file layout: `resources/views/layouts/app.blade.php`.

#### Konfigurasi layout per komponen

Untuk menggunakan layout berbeda untuk komponen tertentu, Anda dapat menempatkan atribut `#[Layout]` Livewire di atas metode `render()` komponen, meneruskannya path tampilan relatif dari layout kustom Anda:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

class CreatePost extends Component
{
	// ...

	#[Layout('layouts.app')] // [tl! highlight]
	public function render()
	{
	    return view('livewire.create-post');
	}
}
```

Atau jika Anda lebih suka, Anda dapat menggunakan atribut ini di atas deklarasi kelas:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.app')] // [tl! highlight]
class CreatePost extends Component
{
	// ...
}
```

Atribut PHP hanya mendukung nilai literal. Jika Anda perlu meneruskan nilai dinamis, atau lebih suka sintaks alternatif ini, Anda dapat menggunakan metode fluent `->layout()` dalam metode `render()` komponen:

```php
public function render()
{
    return view('livewire.create-post')
	     ->layout('layouts.app'); // [tl! highlight]
}
```

Sebagai alternatif, Livewire mendukung penggunaan file layout Blade tradisional dengan `@extends`.

Diberikan file layout berikut:

```php
<body>
    @yield('content')
</body>
```

Anda dapat mengkonfigurasi Livewire untuk merujuknya menggunakan `->extends()` sebagai ganti `->layout()`:

```php
public function render()
{
    return view('livewire.show-posts')
        ->extends('layouts.app'); // [tl! highlight]
}
```

Jika Anda perlu mengkonfigurasi `@section` untuk digunakan komponen, Anda dapat mengkonfigurasinya juga dengan metode `->section()`:

```php
public function render()
{
    return view('livewire.show-posts')
        ->extends('layouts.app')
        ->section('body'); // [tl! highlight]
}
```

### Mengatur judul halaman

Menetapkan judul halaman unik untuk setiap halaman di aplikasi Anda membantu baik pengguna maupun mesin pencari.

Untuk mengatur judul halaman kustom untuk komponen halaman penuh, pertama, pastikan file layout Anda menyertakan judul dinamis:

```php
<head>
    <title>{{ $title ?? 'Page Title' }}</title>
</head>
```

Selanjutnya, di atas metode `render()` komponen Livewire Anda, tambahkan atribut `#[Title]` dan teruskan judul halaman Anda:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

class CreatePost extends Component
{
	// ...

	#[Title('Create Post')] // [tl! highlight]
	public function render()
	{
	    return view('livewire.create-post');
	}
}
```

Ini akan mengatur judul halaman untuk komponen Livewire `CreatePost`. Dalam contoh ini, judul halaman akan menjadi "Create Post" saat komponen di-render.

Jika Anda lebih suka, Anda dapat menggunakan atribut ini di atas deklarasi kelas:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Create Post')] // [tl! highlight]
class CreatePost extends Component
{
	// ...
}
```

Jika Anda perlu meneruskan judul dinamis, seperti judul yang menggunakan properti komponen, Anda dapat menggunakan metode fluent `->title()` dalam metode `render()` komponen:

```php
public function render()
{
    return view('livewire.create-post')
	     ->title('Create Post'); // [tl! highlight]
}
```

### Mengatur slot file layout tambahan

Jika [file layout](#layout-files) Anda memiliki slot bernama apa pun selain `$slot`, Anda dapat mengatur kontennya di tampilan Blade Anda dengan mendefinisikan `<x-slot>` di luar elemen root Anda. Misalnya, jika Anda ingin dapat mengatur bahasa halaman untuk setiap komponen secara individual, Anda dapat menambahkan slot `$lang` dinamis ke tag HTML pembuka di file layout Anda:

```php
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $lang ?? app()->getLocale()) }}"> <!-- [tl! highlight] -->
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

Kemudian, di tampilan komponen Anda, definisikan elemen `<x-slot>` di luar elemen root:

```php
<x-slot:lang>fr</x-slot> // This component is in French <!-- [tl! highlight] -->

<div>
    // French content goes here...
</div>
```


### Mengakses parameter rute

Saat bekerja dengan komponen halaman penuh, Anda mungkin perlu mengakses parameter rute dalam komponen Livewire Anda.

Untuk mendemonstrasikan, pertama, tentukan rute dengan parameter di file `routes/web.php` Anda:

```php
use App\Livewire\ShowPost;

Route::get('/posts/{id}', ShowPost::class);
```

Di sini, kita telah mendefinisikan rute dengan parameter `id` yang mewakili ID posting.

Selanjutnya, perbarui komponen Livewire Anda untuk menerima parameter rute dalam metode `mount()`:

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount($id) // [tl! highlight]
    {
        $this->post = Post::findOrFail($id);
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

Dalam contoh ini, karena nama parameter `$id` cocok dengan parameter rute `{id}`, jika URL `/posts/1` dikunjungi, Livewire akan meneruskan nilai "1" sebagai `$id`.

### Menggunakan route model binding

Route model binding Laravel memungkinkan Anda untuk secara otomatis menyelesaikan model Eloquent dari parameter rute.

Setelah mendefinisikan rute dengan parameter model di file `routes/web.php` Anda:

```php
use App\Livewire\ShowPost;

Route::get('/posts/{post}', ShowPost::class);
```

Anda sekarang dapat menerima parameter model rute melalui metode `mount()` komponen Anda:

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post) // [tl! highlight]
    {
        $this->post = $post;
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

Livewire tahu untuk menggunakan "route model binding" karena type-hint `Post` ditambahkan ke parameter `$post` di `mount()`.

Seperti sebelumnya, Anda dapat mengurangi boilerplate dengan menghilangkan metode `mount()`:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post; // [tl! highlight]

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

Properti `$post` akan secara otomatis ditetapkan ke model yang diikat melalui parameter `{post}` rute.

### Memodifikasi respons

Dalam beberapa skenario, Anda mungkin ingin memodifikasi respons dan mengatur header respons kustom. Anda dapat mengaitkan ke objek respons dengan memanggil metode `response()` pada tampilan dan menggunakan closure untuk memodifikasi objek respons:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Http\Response;

class ShowPost extends Component
{
    public function render()
    {
        return view('livewire.show-post')
            ->response(function(Response $response) {
                $response->header('X-Custom-Header', true);
            });
    }
}
```

## Menggunakan JavaScript

Ada banyak contoh di mana utilitas Livewire dan Alpine bawaan tidak cukup untuk mencapai tujuan Anda di dalam komponen Livewire Anda.

Untungnya, Livewire menyediakan banyak titik ekstensi dan utilitas yang berguna untuk berinteraksi dengan JavaScript khusus. Anda dapat belajar dari referensi lengkap di [halaman dokumentasi JavaScript](/docs/javascript). Tapi untuk saat ini, berikut adalah beberapa cara berguna untuk menggunakan JavaScript Anda sendiri di dalam komponen Livewire Anda.

### Menjalankan skrip

Livewire menyediakan directive `@script` yang berguna, yang saat membungkus elemen `<script>`, akan menjalankan JavaScript yang diberikan saat komponen Anda diinisialisasi di halaman.

Berikut adalah contoh `@script` sederhana yang menggunakan `setInterval()` JavaScript untuk menyegarkan komponen Anda setiap dua detik:

```php
@script
<script>
    setInterval(() => {
        $wire.$refresh()
    }, 2000)
</script>
@endscript
```

Anda akan melihat kami menggunakan objek bernama `$wire` di dalam `<script>` untuk mengontrol komponen. Livewire secara otomatis membuat objek ini tersedia di dalam `@script` apa pun. Jika Anda tidak familiar dengan `$wire`, Anda dapat mempelajari lebih lanjut tentang `$wire` dalam dokumentasi berikut:
* [Mengakses properti dari JavaScript](/docs/properties#accessing-properties-from-javascript)
* [Memanggil aksi Livewire dari JS/Alpine](/docs/actions#calling-actions-from-alpine)
* [Referensi objek `$wire`](/docs/javascript#the-wire-object)

### Memuat aset

Selain `@script` sekali pakai, Livewire menyediakan utilitas `@assets` yang berguna untuk dengan mudah memuat dependensi skrip/gaya apa pun di halaman.

Ini juga memastikan bahwa aset yang disediakan hanya dimuat sekali per halaman browser, tidak seperti `@script`, yang dieksekusi setiap kali instance baru komponen Livewire itu diinisialisasi.

Berikut adalah contoh menggunakan `@assets` untuk memuat library date picker bernama [Pikaday](https://github.com/Pikaday/Pikaday) dan menginisialisasinya di dalam komponen Anda menggunakan `@script`:

```php
<div>
    <input type="text" data-picker>
</div>

@assets
<script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js" defer></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endassets

@script
<script>
    new Pikaday({ field: $wire.$el.querySelector('[data-picker]') });
</script>
@endscript
```

> [!info] Menggunakan `@script` dan `@assets` di dalam komponen Blade
> Jika Anda menggunakan [komponen Blade](https://laravel.com/docs/blade#components) untuk mengekstrak bagian markup Anda, Anda juga dapat menggunakan `@script` dan `@assets` di dalamnya; bahkan jika ada beberapa komponen Blade di dalam komponen Livewire yang sama. Namun, `@script` dan `@assets` saat ini hanya didukung dalam konteks komponen Livewire, artinya jika Anda menggunakan komponen Blade yang diberikan di luar Livewire sama sekali, skrip dan aset tersebut tidak akan dimuat di halaman.