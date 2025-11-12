---
sidebar_position: 13
---

# Navigate

Banyak aplikasi web modern dibangun sebagai "single page applications" (SPAs). Dalam aplikasi ini, setiap halaman yang di-render oleh aplikasi tidak lagi memerlukan reload halaman browser penuh, menghindari overhead re-download asset JavaScript dan CSS di setiap permintaan.

Alternatif dari *single page application* adalah *multi-page application*. Dalam aplikasi ini, setiap kali pengguna mengklik link, halaman HTML yang benar-benar baru diminta dan di-render di browser.

Sementara sebagian besar aplikasi PHP secara tradisional adalah multi-page applications, Livewire menawarkan pengalaman single page application melalui atribut sederhana yang dapat Anda tambahkan ke link di aplikasi Anda: `wire:navigate`.

## Penggunaan dasar

Mari kita jelajahi contoh penggunaan `wire:navigate`. Di bawah ini adalah file route Laravel tipikal (`routes/web.php`) dengan tiga komponen Livewire yang didefinisikan sebagai route:

```php
use App\Livewire\Dashboard;
use App\Livewire\ShowPosts;
use App\Livewire\ShowUsers;

Route::get('/', Dashboard::class);

Route::get('/posts', ShowPosts::class);

Route::get('/users', ShowUsers::class);
```

Dengan menambahkan `wire:navigate` ke setiap link di menu navigasi di setiap halaman, Livewire akan mencegah penanganan standar dari klik link dan menggantinya dengan versinya yang lebih cepat:

```blade
<nav>
    <a href="/" wire:navigate>Dashboard</a>
    <a href="/posts" wire:navigate>Posts</a>
    <a href="/users" wire:navigate>Users</a>
</nav>
```

Di bawah ini adalah rincian tentang apa yang terjadi ketika link `wire:navigate` diklik:

* Pengguna mengklik link
* Livewire mencegah browser mengunjungi halaman baru
* Sebaliknya, Livewire meminta halaman di latar belakang dan menampilkan loading bar di bagian atas halaman
* Ketika HTML untuk halaman baru telah diterima, Livewire mengganti URL, tag `<title>`, dan konten `<body>` halaman saat ini dengan elemen dari halaman baru

Teknik ini menghasilkan waktu loading halaman yang jauh lebih cepat — seringkali dua kali lebih cepat — dan membuat aplikasi "terasa" seperti single page application yang didukung oleh JavaScript.

## Redirect

Ketika salah satu komponen Livewire Anda mengarahkan pengguna ke URL lain dalam aplikasi Anda, Anda juga dapat menginstruksikan Livewire untuk menggunakan fungsionalitas `wire:navigate` untuk memuat halaman baru. Untuk mencapai ini, berikan argumen `navigate` ke metode `redirect()`:

```php
return $this->redirect('/posts', navigate: true);
```

Sekarang, alih-alih menggunakan permintaan halaman penuh untuk mengarahkan pengguna ke URL baru, Livewire akan mengganti konten dan URL halaman saat ini dengan yang baru.

## Prefetching link

Secara default, Livewire menyertakan strategi ringan untuk _prefetch_ halaman sebelum pengguna mengklik link:

* Pengguna menekan tombol mouse mereka
* Livewire mulai meminta halaman
* Mereka melepaskan tombol mouse untuk menyelesaikan _klik_
* Livewire menyelesaikan permintaan dan menavigasi ke halaman baru

Mengejutkan, waktu antara pengguna menekan dan melepaskan tombol mouse seringkali cukup waktu untuk memuat setengah atau bahkan seluruh halaman dari server.

Jika Anda menginginkan pendekatan yang lebih agresif untuk prefetching, Anda dapat menggunakan modifier `.hover` pada link:

```blade
<a href="/posts" wire:navigate.hover>Posts</a>
```

Modifier `.hover` akan menginstruksikan Livewire untuk prefetch halaman setelah pengguna melayang di atas link selama `60` milidetik.

> [!warning] Prefetching saat hover meningkatkan penggunaan server
> Karena tidak semua pengguna akan mengklik link yang mereka lewati, menambahkan `.hover` akan meminta halaman yang mungkin tidak diperlukan, meskipun Livewire mencoba mengurangi beberapa overhead ini dengan menunggu `60` milidetik sebelum prefetching halaman.

## Mempertahankan elemen antar kunjungan halaman

Terkadang, ada bagian dari antarmuka pengguna yang perlu Anda pertahankan antar loading halaman, seperti pemutar audio atau video. Misalnya, dalam aplikasi podcasting, pengguna mungkin ingin terus mendengarkan episode saat mereka menjelajahi halaman lain.

Anda dapat mencapai ini di Livewire dengan direktif `@persist`.

Dengan membungkus elemen dengan `@persist` dan memberinya nama, ketika halaman baru diminta menggunakan `wire:navigate`, Livewire akan mencari elemen di halaman baru yang memiliki `@persist` yang cocok. Alih-alih mengganti elemen seperti biasa, Livewire akan menggunakan elemen DOM yang ada dari halaman sebelumnya di halaman baru, mempertahankan state apa pun di dalam elemen.

Berikut adalah contoh elemen pemutar `<audio>` yang dipertahankan di seluruh halaman menggunakan `@persist`:

```blade
@persist('player')
    <audio src="{{ $episode->file }}" controls></audio>
@endpersist
```

Jika HTML di atas muncul di kedua halaman — halaman saat ini, dan halaman berikutnya — elemen asli akan digunakan kembali di halaman baru. Dalam kasus pemutar audio, pemutaran audio tidak akan terganggu saat menavigasi dari satu halaman ke halaman lain.

Harap perhatikan bahwa elemen yang dipertahankan harus ditempatkan di luar komponen Livewire Anda. Praktik umum adalah memposisikan elemen yang dipertahankan di layout utama Anda, seperti `resources/views/components/layouts/app.blade.php`.

```html
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        <main>
            {{ $slot }}
        </main>

        @persist('player') <!-- [tl! highlight:2] -->
            <audio src="{{ $episode->file }}" controls></audio>
        @endpersist
    </body>
</html>
```

### Menyoroti link aktif

Anda mungkin terbiasa menyoroti link halaman yang saat ini aktif di navbar menggunakan Blade server-side seperti ini:

```blade
<nav>
    <a href="/" class="@if (request->is('/')) font-bold text-zinc-800 @endif">Dashboard</a>
    <a href="/posts" class="@if (request->is('/posts')) font-bold text-zinc-800 @endif">Posts</a>
    <a href="/users" class="@if (request->is('/users')) font-bold text-zinc-800 @endif">Users</a>
</nav>
```

Namun, ini tidak akan berfungsi di dalam elemen yang dipertahankan karena mereka digunakan kembali antar loading halaman. Sebaliknya, Anda harus menggunakan direktif `wire:current` Livewire untuk menyoroti link yang saat ini aktif.

Cukup berikan kelas CSS apa pun yang ingin Anda terapkan ke link yang saat ini aktif ke `wire:current`:

```blade
<nav>
    <a href="/dashboard" ... wire:current="font-bold text-zinc-800">Dashboard</a>
    <a href="/posts" ... wire:current="font-bold text-zinc-800">Posts</a>
    <a href="/users" ... wire:current="font-bold text-zinc-800">Users</a>
</nav>
```

Sekarang, ketika halaman `/posts` dikunjungi, link "Posts" akan memiliki treatment font yang lebih kuat daripada link lainnya.

Baca selengkapnya di [dokumentasi `wire:current`](/docs/wire-current).

### Mempertahankan posisi scroll

Secara default, Livewire akan mempertahankan posisi scroll halaman saat menavigasi bolak-balik antar halaman. Namun, terkadang Anda mungkin ingin mempertahankan posisi scroll elemen individual yang Anda pertahankan antar loading halaman.

Untuk melakukan ini, Anda harus menambahkan `wire:scroll` ke elemen yang mengandung scrollbar seperti ini:

```html
@persist('scrollbar')
<div class="overflow-y-scroll" wire:scroll> <!-- [tl! highlight] -->
    <!-- ... -->
</div>
@endpersist
```

## JavaScript hooks

Setiap navigasi halaman memicu tiga lifecycle hooks:

* `livewire:navigate`
* `livewire:navigating`
* `livewire:navigated`

Penting untuk dicatat bahwa ketiga hooks event ini di-dispatch pada navigasi semua jenis. Ini termasuk navigasi manual menggunakan `Livewire.navigate()`, redirect dengan navigasi diaktifkan, dan penekanan tombol back dan forward di browser.

Berikut adalah contoh mendaftarkan listeners untuk setiap event ini:

```js
document.addEventListener('livewire:navigate', (event) => {
    // Dipicu ketika navigasi dijalankan.

    // Dapat "dibatalkan" (mencegah navigate benar-benar dilakukan):
    event.preventDefault()

    // Mengandung konteks bermanfaat tentang pemicu navigasi:
    let context = event.detail

    // Objek URL dari tujuan yang dimaksud dari navigasi...
    context.url

    // Boolean [true/false] menunjukkan apakah navigasi ini
    // dipicu oleh navigasi back/forward (state history)...
    context.history

    // Boolean [true/false] menunjukkan apakah ada
    // versi cached dari halaman ini untuk digunakan sebagai ganti
    // mengambil yang baru melalui round-trip jaringan...
    context.cached
})

document.addEventListener('livewire:navigating', () => {
    // Dipicu ketika HTML baru akan ditukar ke halaman...

    // Ini adalah tempat yang baik untuk mengubah HTML apa pun sebelum halaman
    // dinavigasi jauh dari...
})

document.addEventListener('livewire:navigated', () => {
    // Dipicu sebagai langkah terakhir dari navigasi halaman apa pun...

    // Juga dipicu pada page-load sebagai ganti "DOMContentLoaded"...
})
```

> [!warning] Event listeners akan bertahan di seluruh halaman
>
> Ketika Anda mengaitkan event listener ke dokumen, event listener tidak akan dihapus saat Anda menavigasi ke halaman yang berbeda. Ini dapat menyebabkan perilaku yang tidak diharapkan jika Anda memerlukan kode untuk dijalankan hanya setelah menavigasi ke halaman tertentu, atau jika Anda menambahkan event listener yang sama di setiap halaman. Jika Anda tidak menghapus event listener Anda, ini dapat menyebabkan pengecualian di halaman lain saat mencari elemen yang tidak ada, atau Anda mungkin berakhir dengan event listener yang dieksekusi beberapa kali per navigasi.
>
> Metode mudah untuk menghapus event listener setelah dijalankan adalah dengan meneruskan opsi `{once: true}` sebagai parameter ketiga ke fungsi `addEventListener`.
> ```js
> document.addEventListener('livewire:navigated', () => {
>     // ...
> }, { once: true })
> ```

## Mengunjungi halaman baru secara manual

Selain `wire:navigate`, Anda dapat memanggil metode `Livewire.navigate()` secara manual untuk memicu kunjungan ke halaman baru menggunakan JavaScript:

```html
<script>
    // ...

    Livewire.navigate('/new/url')
</script>
```

## Menggunakan dengan software analytics

Saat menavigasi halaman menggunakan `wire:navigate` di aplikasi Anda, tag `<script>` apa pun di `<head>` hanya dievaluasi saat halaman dimuat awal.

Ini menciptakan masalah untuk software analytics seperti [Fathom Analytics](https://usefathom.com/). Tools ini bergantung pada snippet `<script>` yang dievaluasi pada setiap perubahan halaman, bukan hanya yang pertama.

Tools seperti [Google Analytics](https://marketingplatform.google.com/about/analytics/) cukup pintar untuk menangani ini secara otomatis, namun, saat menggunakan Fathom Analytics, Anda harus menambahkan `data-spa="auto"` ke tag script Anda untuk memastikan setiap kunjungan halaman dilacak dengan benar:

```blade
<head>
    <!-- ... -->

    <!-- Fathom Analytics -->
    @if (! config('app.debug'))
        <script src="https://cdn.usefathom.com/script.js" data-site="ABCDEFG" data-spa="auto" defer></script> <!-- [tl! highlight] -->
    @endif
</head>
```

## Evaluasi script

Saat menavigasi ke halaman baru menggunakan `wire:navigate`, ini _terasa_ seperti browser telah mengubah halaman; namun, dari perspektif browser, Anda secara teknis masih di halaman asli.

Karena ini, style dan script dieksekusi secara normal di halaman pertama, tetapi di halaman selanjutnya, Anda mungkin harus mengubah cara Anda biasa menulis JavaScript.

Berikut adalah beberapa caveats dan skenario yang harus Anda ketahui saat menggunakan `wire:navigate`.

### Jangan bergantung pada `DOMContentLoaded`

Ini adalah praktik umum untuk menempatkan JavaScript di dalam event listener `DOMContentLoaded` sehingga kode yang ingin Anda jalankan hanya dieksekusi setelah halaman dimuat sepenuhnya.

Saat menggunakan `wire:navigate`, `DOMContentLoaded` hanya di-fire pada kunjungan halaman pertama, bukan kunjungan selanjutnya.

Untuk menjalankan kode di setiap kunjungan halaman, ganti setiap instance `DOMContentLoaded` dengan `livewire:navigated`:

```js
document.addEventListener('DOMContentLoaded', () => { // [tl! remove]
document.addEventListener('livewire:navigated', () => { // [tl! add]
    // ...
})
```

Sekarang, kode apa pun yang ditempatkan di dalam listener ini akan dijalankan pada kunjungan halaman awal, dan juga setelah Livewire selesai menavigasi ke halaman selanjutnya.

Mendengarkan event ini berguna untuk hal-hal seperti menginisialisasi library pihak ketiga.

### Script di `<head>` dimuat sekali

Jika dua halaman menyertakan tag `<script>` yang sama di `<head>`, script tersebut hanya akan dijalankan pada kunjungan halaman awal dan bukan pada kunjungan halaman selanjutnya.

```blade
<!-- Halaman satu -->
<head>
    <script src="/app.js"></script>
</head>

<!-- Halaman dua -->
<head>
    <script src="/app.js"></script>
</head>
```

### Script `<head>` baru dievaluasi

Jika halaman selanjutnya menyertakan tag `<script>` baru di `<head>` yang tidak ada di `<head>` kunjungan halaman awal, Livewire akan menjalankan tag `<script>` baru.

Dalam contoh di bawah ini, _halaman dua_ menyertakan library JavaScript baru untuk tool pihak ketiga. Ketika pengguna menavigasi ke _halaman dua_, library tersebut akan dievaluasi.

```blade
<!-- Halaman satu -->
<head>
    <script src="/app.js"></script>
</head>

<!-- Halaman dua -->
<head>
    <script src="/app.js"></script>
    <script src="/third-party.js"></script>
</head>
```

> [!info] Head assets bersifat blocking
> Jika Anda menavigasi ke halaman baru yang berisi asset seperti `<script src="...">` di tag head. Asset tersebut akan diambil dan diproses sebelum navigasi selesai dan halaman baru ditukar. Ini mungkin perilaku yang mengejutkan, tetapi ini memastikan script apa pun yang bergantung pada asset tersebut akan memiliki akses langsung ke mereka.

### Reload saat asset berubah

Ini adalah praktik umum untuk menyertakan version hash dalam nama file JavaScript utama aplikasi. Ini memastikan bahwa setelah menerapkan versi baru aplikasi Anda, pengguna akan menerima asset JavaScript yang segar, dan bukan versi lama yang disajikan dari cache browser.

Tetapi, sekarang Anda menggunakan `wire:navigate` dan setiap kunjungan halaman tidak lagi menjadi beban halaman browser segar, pengguna Anda mungkin masih menerima JavaScript yang basi setelah deployment.

Untuk mencegah ini, Anda dapat menambahkan `data-navigate-track` ke tag `<script>` di `<head>`:

```blade
<!-- Halaman satu -->
<head>
    <script src="/app.js?id=123" data-navigate-track></script>
</head>

<!-- Halaman dua -->
<head>
    <script src="/app.js?id=456" data-navigate-track></script>
</head>
```

Ketika pengguna mengunjungi _halaman dua_, Livewire akan mendeteksi asset JavaScript yang segar dan memicu reload halaman browser penuh.

Jika Anda menggunakan [plugin Vite Laravel](https://laravel.com/docs/vite#loading-your-scripts-and-styles) untuk bundle dan menyajikan asset Anda, Livewire menambahkan `data-navigate-track` ke tag asset HTML yang di-render secara otomatis. Anda dapat terus mereferensikan asset dan script Anda seperti biasa:

```blade
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
```

Livewire akan secara otomatis menyuntikkan `data-navigate-track` ke tag HTML yang di-render.

> [!warning] Hanya perubahan query string yang dilacak
> Livewire hanya akan me-reload halaman jika query string elemen `[data-navigate-track]` (`?id="456"`) berubah, bukan URI itu sendiri (`/app.js`).

### Script di `<body>` dievaluasi ulang

Karena Livewire mengganti seluruh konten `<body>` di setiap halaman baru, semua tag `<script>` di halaman baru akan dijalankan:

```blade
<!-- Halaman satu -->
<body>
    <script>
        console.log('Runs on page one')
    </script>
</body>

<!-- Halaman dua -->
<body>
    <script>
        console.log('Runs on page two')
    </script>
</body>
```

Jika Anda memiliki tag `<script>` di body yang hanya ingin Anda jalankan sekali, Anda dapat menambahkan atribut `data-navigate-once` ke tag `<script>` dan Livewire hanya akan menjalankannya pada kunjungan halaman awal:

```blade
<script data-navigate-once>
    console.log('Runs only on page one')
</script>
```

## Menyesuaikan progress bar

Ketika halaman membutuhkan waktu lebih dari 150ms untuk dimuat, Livewire akan menampilkan progress bar di bagian atas halaman.

Anda dapat menyesuaikan warna bar ini atau menonaktifkannya sama sekali di file config Livewire (`config/livewire.php`):

```php
'navigate' => [
    'show_progress_bar' => false,
    'progress_bar_color' => '#2299dd',
],
```