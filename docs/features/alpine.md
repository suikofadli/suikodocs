---
sidebar_position: 12
---

# Alpine

[AlpineJS](https://alpinejs.dev/) adalah library JavaScript yang ringan yang memudahkan untuk menambahkan interaktivitas client-side ke halaman web Anda. Awalnya dibuat untuk melengkapi tools seperti Livewire di mana utility yang lebih berpusat pada JavaScript membantu untuk menambahkan interaktivitas di sekitar aplikasi Anda.

Livewire sudah menyertakan Alpine secara built-in, jadi tidak perlu menginstalnya secara terpisah ke dalam proyek Anda.

Tempat terbaik untuk mempelajari penggunaan AlpineJS adalah [dokumentasi Alpine](https://alpinejs.dev).

## Komponen Alpine Dasar

Untuk meletakkan fondasi bagi dokumentasi selanjutnya, berikut adalah salah satu contoh Alpine component yang paling sederhana dan informatif. Sebuah "counter" kecil yang menampilkan angka di halaman dan memungkinkan pengguna untuk menambah angka tersebut dengan mengklik tombol:

```html
<!-- Deklarasikan objek JavaScript data... -->
<div x-data="{ count: 0 }">
    <!-- Render nilai "count" saat ini di dalam elemen... -->
    <h2 x-text="count"></h2>

    <!-- Tambah nilai "count" sebesar "1" ketika event click dijalankan... -->
    <button x-on:click="count++">+</button>
</div>
```

Komponen Alpine di atas dapat digunakan di dalam komponen Livewire apa pun di aplikasi Anda tanpa masalah. Livewire bertanggung jawab untuk mempertahankan state Alpine melalui update komponen Livewire. Pada intinya, Anda seharusnya merasa bebas menggunakan komponen Alpine di dalam Livewire seolah-olah Anda menggunakan Alpine dalam konteks non-Livewire lainnya.

## Menggunakan Alpine di dalam Livewire

Mari kita jelajahi contoh yang lebih nyata dari penggunaan komponen Alpine di dalam komponen Livewire.

Di bawah ini adalah komponen Livewire sederhana yang menampilkan detail model post dari database. Secara default, hanya judul post yang ditampilkan:

```html
<div>
    <h1>{{ $post->title }}</h1>

    <div x-data="{ expanded: false }">
        <button type="button" x-on:click="expanded = ! expanded">
            <span x-show="! expanded">Tampilkan konten post...</span>
            <span x-show="expanded">Sembunyikan konten post...</span>
        </button>

        <div x-show="expanded">
            {{ $post->content }}
        </div>
    </div>
</div>
```

Dengan menggunakan Alpine, kita dapat menyembunyikan konten post sampai pengguna menekan tombol "Tampilkan konten post...". Pada titik itu, properti `expanded` Alpine akan diatur ke `true` dan konten akan ditampilkan di halaman karena `x-show="expanded"` digunakan untuk memberikan kontrol Alpine atas visibilitas konten post.

Ini adalah contoh di mana Alpine bersinar: menambahkan interaktivitas ke dalam aplikasi Anda tanpa memicu server-roundtrips Livewire.

## Mengontrol Livewire dari Alpine menggunakan `$wire`

Salah satu fitur paling kuat yang tersedia bagi Anda sebagai developer Livewire adalah `$wire`. Objek `$wire` adalah objek magic yang tersedia untuk semua komponen Alpine Anda yang digunakan di dalam Livewire.

Anda dapat menganggap `$wire` sebagai gateway dari JavaScript ke PHP. Ini memungkinkan Anda untuk mengakses dan memodifikasi properti komponen Livewire, memanggil metode komponen Livewire, dan melakukan lebih banyak lagi; semua dari dalam AlpineJS.

### Mengakses properti Livewire

Berikut adalah contoh utilitas "character count" sederhana dalam form untuk membuat post. Ini akan secara instan menampilkan kepada pengguna berapa banyak karakter yang terdapat di dalam konten post mereka saat mereka mengetik:

```html
<form wire:submit="save">
    <!-- ... -->

    <input wire:model="content" type="text">

    <small>
        Jumlah karakter: <span x-text="$wire.content.length"></span> <!-- [tl! highlight] -->
    </small>

    <button type="submit">Simpan</button>
</form>
```

Seperti yang Anda lihat `x-text` pada contoh di atas digunakan untuk memungkinkan Alpine mengontrol konten teks dari elemen `<span>`. `x-text` menerima ekspresi JavaScript apa pun di dalamnya dan secara otomatis bereaksi ketika dependensi apa pun diperbarui. Karena kita menggunakan `$wire.content` untuk mengakses nilai `$content`, Alpine akan secara otomatis memperbarui konten teks setiap kali `$wire.content` diperbarui dari Livewire; dalam hal ini oleh `wire:model="content"`.

### Mengubah properti Livewire

Berikut adalah contoh penggunaan `$wire` di dalam Alpine untuk mengosongkan field "title" dari form untuk membuat post.

```html
<form wire:submit="save">
    <input wire:model="title" type="text">

    <button type="button" x-on:click="$wire.title = ''">Hapus</button> <!-- [tl! highlight] -->

    <!-- ... -->

    <button type="submit">Simpan</button>
</form>
```

Saat pengguna mengisi form Livewire di atas, mereka dapat menekan "Hapus" dan field title akan dikosongkan tanpa mengirim permintaan jaringan dari Livewire. Interaksi akan "instan".

Berikut adalah penjelasan singkat tentang apa yang terjadi untuk membuat itu terjadi:

* `x-on:click` memberitahu Alpine untuk mendengarkan klik pada elemen tombol
* Saat diklik, Alpine menjalankan ekspresi JS yang disediakan: `$wire.title = ''`
* Karena `$wire` adalah objek magic yang mewakili komponen Livewire, semua properti dari komponen Anda dapat diakses atau diubah langsung dari JavaScript
* `$wire.title = ''` mengatur nilai `$title` di komponen Livewire Anda ke string kosong
* Setiap utility Livewire seperti `wire:model` akan langsung bereaksi terhadap perubahan ini, semua tanpa mengirim server-roundtrip
* Pada permintaan jaringan Livewire berikutnya, properti `$title` akan diperbarui ke string kosong di backend

### Memanggil metode Livewire

Alpine juga dapat dengan mudah memanggil metode/aksi Livewire apa pun dengan hanya memanggilnya langsung pada `$wire`.

Berikut adalah contoh penggunaan Alpine untuk mendengarkan event "blur" pada input dan memicu penyimpanan form. Event "blur" dijalankan oleh browser ketika pengguna menekan "tab" untuk menghapus fokus dari elemen saat ini dan memfokuskan pada elemen berikutnya di halaman:

```html
<form wire:submit="save">
    <input wire:model="title" type="text" x-on:blur="$wire.save()">  <!-- [tl! highlight] -->

    <!-- ... -->

    <button type="submit">Simpan</button>
</form>
```

Biasanya, Anda akan menggunakan `wire:model.blur="title"` dalam situasi ini, namun, ini membantu untuk tujuan demonstrasi bagaimana Anda dapat mencapai ini menggunakan Alpine.

#### Melewatkan parameter

Anda juga dapat melewatkan parameter ke metode Livewire dengan hanya melewatkan mereka ke pemanggilan metode `$wire`.

Pertimbangkan komponen dengan metode `deletePost()` seperti ini:

```php
public function deletePost($postId)
{
    $post = Post::find($postId);

    // Otorisasi user dapat menghapus...
    auth()->user()->can('update', $post);

    $post->delete();
}
```

Sekarang, Anda dapat melewatkan parameter `$postId` ke metode `deletePost()` dari Alpine seperti ini:

```html
<button type="button" x-on:click="$wire.deletePost(1)">
```

Secara umum, sesuatu seperti `$postId` akan dihasilkan di Blade. Berikut adalah contoh penggunaan Blade untuk menentukan `$postId` mana yang dilewatkan Alpine ke `deletePost()`:

```html
@foreach ($posts as $post)
    <button type="button" x-on:click="$wire.deletePost({{ $post->id }})">
        Hapus "{{ $post->title }}"
    </button>
@endforeach
```

Jika ada tiga post di halaman, template Blade di atas akan merender menjadi sesuatu seperti berikut di browser:

```html
<button type="button" x-on:click="$wire.deletePost(1)">
    Hapus "The power of walking"
</button>

<button type="button" x-on:click="$wire.deletePost(2)">
    Hapus "How to record a song"
</button>

<button type="button" x-on:click="$wire.deletePost(3)">
    Hapus "Teach what you learn"
</button>
```

Seperti yang Anda lihat, kita telah menggunakan Blade untuk merender ID post yang berbeda ke dalam ekspresi Alpine `x-on:click`.

#### "Gotchas" parameter Blade

Ini adalah teknik yang sangat kuat, tetapi dapat membingungkan saat membaca template Blade Anda. Mungkin sulit untuk mengetahui bagian mana yang Blade dan bagian mana yang Alpine pada pandangan pertama. Oleh karena itu, membantu untuk memeriksa HTML yang dirender di halaman untuk memastikan apa yang Anda harapkan untuk dirender akurat.

Berikut adalah contoh yang sering membingungkan orang:

Misalkan, bukan ID, model Post Anda menggunakan UUID untuk indeks (ID adalah bilangan bulat, dan UUID adalah string karakter yang panjang).

Jika kita merender berikut ini seperti yang kita lakukan dengan ID akan ada masalah:

```html
<!-- Peringatan: ini adalah contoh kode yang bermasalah... -->
<button
    type="button"
    x-on:click="$wire.deletePost({{ $post->uuid }})"
>
```

Template Blade di atas akan merender berikut ini di HTML Anda:

```html
<!-- Peringatan: ini adalah contoh kode yang bermasalah... -->
<button
    type="button"
    x-on:click="$wire.deletePost(93c7b04c-c9a4-4524-aa7d-39196011b81a)"
>
```

Perhatikan kurangnya tanda kutip di sekitar string UUID? Ketika Alpine akan mengevaluasi ekspresi ini, JavaScript akan melempar error: "Uncaught SyntaxError: Invalid or unexpected token".

Untuk memperbaikinya, kita perlu menambahkan tanda kutip di sekitar ekspresi Blade seperti ini:

```html
<button
    type="button"
    x-on:click="$wire.deletePost('{{ $post->uuid }}')"
>
```

Sekarang template di atas akan merender dengan benar dan semuanya akan berfungsi seperti yang diharapkan:

```html
<button
    type="button"
    x-on:click="$wire.deletePost('93c7b04c-c9a4-4524-aa7d-39196011b81a')"
>
```

### Me-refresh komponen

Anda dapat dengan mudah me-refresh komponen Livewire (memicu roundtrip jaringan untuk merender ulang tampilan Blade komponen) menggunakan `$wire.$refresh()`:

```html
<button type="button" x-on:click="$wire.$refresh()">
```

## Berbagi state menggunakan `$wire.entangle`

Dalam kebanyakan kasus, `$wire` adalah semua yang Anda butuhkan untuk berinteraksi dengan state Livewire dari Alpine. Namun, Livewire menyediakan utilitas `$wire.entangle()` tambahan yang dapat digunakan untuk menjaga nilai dari Livewire tetap sinkron dengan nilai di Alpine.

Untuk mendemonstrasikan, pertimbangkan contoh dropdown ini dengan properti `showDropdown` yang terjerat antara Livewire dan Alpine menggunakan `$wire.entangle()`. Dengan menggunakan entanglement, kami sekarang dapat mengontrol state dropdown dari Alpine dan Livewire:

```php
use Livewire\Component;

class PostDropdown extends Component
{
    public $showDropdown = false;

    public function archive()
    {
        // ...

        $this->showDropdown = false;
    }

    public function delete()
    {
        // ...

        $this->showDropdown = false;
    }
}
```

```blade
<div x-data="{ open: $wire.entangle('showDropdown') }">
    <button x-on:click="open = true">Tampilkan Lebih Banyak...</button>

    <ul x-show="open" x-on:click.outside="open = false">
        <li><button wire:click="archive">Arsipkan</button></li>

        <li><button wire:click="delete">Hapus</button></li>
    </ul>
</div>
```

Pengguna sekarang dapat beralih dropdown langsung dengan Alpine, tetapi ketika mereka mengklik aksi Livewire seperti "Arsipkan", dropdown akan diperintahkan untuk menutup dari Livewire. Alpine dan Livewire dipersilakan untuk memanipulasi properti mereka masing-masing, dan yang lain akan secara otomatis diperbarui.

Secara default, memperbarui state ditunda (perubahan di client, tetapi tidak segera di server) hingga permintaan Livewire berikutnya. Jika Anda perlu memperbarui state di server-side segera setelah pengguna mengklik, rantai modifier `.live` seperti ini:

```blade
<div x-data="{ open: $wire.entangle('showDropdown').live }">
    ...
</div>
```

> [!tip] Anda mungkin tidak membutuhkan `$wire.entangle`
> Dalam kebanyakan kasus, Anda dapat mencapai apa yang Anda inginkan dengan menggunakan `$wire` untuk mengakses properti Livewire langsung dari Alpine daripada menjalin mereka. Menjerat dua properti daripada mengandalkan satu dapat menyebabkan masalah prediktabilitas dan kinerja saat menggunakan objek bersarang dalam yang sering berubah. Untuk alasan ini, `$wire.entangle` telah ditekankan dalam dokumentasi Livewire mulai versi 3.

> [!warning] Hindari menggunakan direktif @@entangle
> Di Livewire versi 2, disarankan untuk menggunakan direktif `@@entangle` Blade. Itu tidak lagi menjadi kasus di v3. `$wire.entangle()` lebih disukai karena ini adalah utilitas yang lebih kuat dan menghindari [masalah tertentu saat menghapus elemen DOM](https://github.com/livewire/livewire/pull/6833#issuecomment-1902260844).

## Membundle Alpine secara manual di build JavaScript Anda

Secara default, JavaScript Livewire dan Alpine disuntikkan ke setiap halaman Livewire secara otomatis.

Ini ideal untuk setup yang lebih sederhana, namun, Anda mungkin ingin menyertakan komponen, store, dan plugin Alpine Anda sendiri ke dalam proyek Anda.

Untuk menyertakan Livewire dan Alpine melalui bundle JavaScript Anda sendiri di halaman sangat mudah.

Pertama, Anda harus menyertakan direktif `@livewireScriptConfig` di file layout Anda seperti ini:

```blade
<html>
<head>
    <!-- ... -->
    @livewireStyles
    @vite(['resources/js/app.js'])
</head>
<body>
    {{ $slot }}

    @livewireScriptConfig <!-- [tl! highlight] -->
</body>
</html>
```

Ini memungkinkan Livewire untuk menyediakan bundle Anda dengan konfigurasi tertentu yang dibutuhkan agar aplikasi Anda berjalan dengan baik.

Sekarang Anda dapat mengimpor Livewire dan Alpine di file `resources/js/app.js` Anda seperti ini:

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';

// Daftarkan direktif, komponen, atau plugin Alpine apa pun di sini...

Livewire.start()
```

Berikut adalah contoh mendaftarkan direktif Alpine kustom yang disebut "x-clipboard" di aplikasi Anda:

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';

Alpine.directive('clipboard', (el) => {
    let text = el.textContent

    el.addEventListener('click', () => {
        navigator.clipboard.writeText(text)
    })
})

Livewire.start()
```

Sekarang direktif `x-clipboard` akan tersedia untuk semua komponen Alpine Anda di aplikasi Livewire Anda.
