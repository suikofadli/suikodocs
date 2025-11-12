---
sidebar_position: 1
---

# Quickstart

Untuk memulai perjalanan Livewire Anda, kita akan membuat komponen "counter" yang sederhana dan menampilkannya di browser. Contoh ini adalah cara yang bagus untuk merasakan Livewire untuk pertama kali karena mendemonstrasikan _liveness_ Livewire dengan cara yang paling sederhana.

## Prasyarat

Sebelum kita mulai, pastikan Anda telah menginstal hal berikut:

- Laravel versi 10 atau lebih baru
- PHP versi 8.1 atau lebih baru

## Instal Livewire

Dari direktori root aplikasi Laravel Anda, jalankan perintah [Composer](https://getcomposer.org/) berikut:

```shell
composer require livewire/livewire
```

> [!warning] Pastikan Alpine belum terinstal
> Jika aplikasi yang Anda gunakan sudah memiliki AlpineJS terinstal, Anda perlu menghapusnya agar Livewire berfungsi dengan baik; jika tidak, Alpine akan dimuat dua kali dan Livewire tidak akan berfungsi. Misalnya, jika Anda menginstal Laravel Breeze "Blade with Alpine" starter kit, Anda perlu menghapus Alpine dari `resources/js/app.js`.

## Buat komponen Livewire

Livewire menyediakan perintah Artisan yang nyaman untuk menghasilkan komponen baru dengan cepat. Jalankan perintah berikut untuk membuat komponen `Counter` baru:

```shell
php artisan make:livewire counter
```

Perintah ini akan menghasilkan dua file baru di proyek Anda:

- `app/Livewire/Counter.php`
- `resources/views/livewire/counter.blade.php`

## Menulis kelas

Buka `app/Livewire/Counter.php` dan ganti isinya dengan yang berikut:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Counter extends Component
{
    public $count = 1;

    public function increment()
    {
        $this->count++;
    }

    public function decrement()
    {
        $this->count--;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

Berikut adalah penjelasan singkat dari kode di atas:

- `public $count = 1;` — Mendeklarasikan properti publik bernama `$count` dengan nilai awal `1`.
- `public function increment()` — Mendeklarasikan metode publik bernama `increment()` yang menambah properti `$count` setiap kali dipanggil. Metode publik seperti ini dapat dipicu dari browser dengan berbagai cara, termasuk ketika pengguna mengklik tombol.
- `public function render()` — Mendeklarasikan metode `render()` yang mengembalikan tampilan Blade. Tampilan Blade ini akan berisi template HTML untuk komponen kita.

## Menulis tampilan

Buka file `resources/views/livewire/counter.blade.php` dan ganti isinya dengan yang berikut:

```php
<div>
    <h1>{{ $count }}</h1>

    <button wire:click="increment">+</button>

    <button wire:click="decrement">-</button>
</div>
```

Kode ini akan menampilkan nilai properti `$count` dan dua tombol yang menambah dan mengurangi properti `$count`.

> [!warning] Komponen Livewire HARUS memiliki satu elemen root
> Agar Livewire berfungsi, komponen harus memiliki hanya **satu** elemen tunggal sebagai root. Jika beberapa elemen root terdeteksi, exception akan dilempar. Disarankan untuk menggunakan elemen `<div>` seperti pada contoh. Komentar HTML dihitung sebagai elemen terpisah dan harus ditempatkan di dalam elemen root.
> Saat merender [komponen halaman penuh](/docs/components#full-page-components), slot bernama untuk file layout dapat ditempatkan di luar elemen root. Ini akan dihapus sebelum komponen dirender.

## Daftarkan rute untuk komponen

Buka file `routes/web.php` di aplikasi Laravel Anda dan tambahkan kode berikut:

```php
use App\Livewire\Counter;

Route::get('/counter', Counter::class);
```

Sekarang, komponen _counter_ kita ditugaskan ke rute `/counter`, sehingga ketika pengguna mengunjungi endpoint `/counter` di aplikasi Anda, komponen ini akan dirender oleh browser.

## Buat template layout

Sebelum Anda dapat mengunjungi `/counter` di browser, kita memerlukan layout HTML untuk komponen kita agar dapat dirender. Secara default, Livewire akan otomatis mencari file layout bernama: `resources/views/components/layouts/app.blade.php`

Anda dapat membuat file ini jika belum ada dengan menjalankan perintah berikut:

```shell
php artisan livewire:layout
```

Perintah ini akan menghasilkan file bernama `resources/views/components/layouts/app.blade.php` dengan konten berikut:

```php
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

Komponen _counter_ akan dirender menggantikan variabel `$slot` dalam template di atas.

Anda mungkin telah memperhatikan tidak ada aset JavaScript atau CSS yang disediakan oleh Livewire. Itu karena Livewire 3 dan lebih tinggi secara otomatis menyuntikkan aset frontend yang dibutuhkannya.

## Cobalah

Dengan kelas komponen dan template kita di tempat, komponen kita siap untuk diuji!

Kunjungi `/counter` di browser Anda, dan Anda akan melihat angka ditampilkan di layar dengan dua tombol untuk menambah dan mengurangi angka.

Setelah mengklik salah satu tombol, Anda akan melihat bahwa angka diperbarui secara real time, tanpa reload halaman. Ini adalah magic dari Livewire: aplikasi frontend dinamis yang ditulis seluruhnya dalam PHP.

Kami baru saja menggores permukaan dari apa yang Livewire mampu. Terus membaca dokumentasi untuk melihat semua yang Livewire tawarkan.
