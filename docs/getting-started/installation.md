---
sidebar_position: 2
---

# Installation

Livewire adalah package Laravel, jadi Anda perlu memiliki aplikasi Laravel yang berjalan sebelum Anda dapat menginstal dan menggunakan Livewire. Jika Anda membutuhkan bantuan untuk menyiapkan aplikasi Laravel baru, silakan lihat [dokumentasi Laravel resmi](https://laravel.com/docs/installation).

Untuk menginstal Livewire, buka terminal Anda dan arahkan ke direktori aplikasi Laravel Anda, lalu jalankan perintah berikut:

```shell
composer require livewire/livewire
```

Itu saja — benar-benar. Jika Anda menginginkan opsi kustomisasi lebih lanjut, terus membaca. Jika tidak, Anda dapat langsung mulai menggunakan Livewire.

> [!warning] `/livewire/livewire.js` mengembalikan kode status 404
> Secara default, Livewire mengekspos rute di aplikasi Anda untuk menyajikan aset JavaScriptnya dari: `/livewire/livewire.js`. Ini tidak masalah untuk sebagian besar aplikasi, namun, jika Anda menggunakan Nginx dengan konfigurasi kustom, Anda mungkin menerima 404 dari endpoint ini. Untuk memperbaiki masalah ini, Anda dapat [mengompilasi aset JavaScript Livewire sendiri](#manually-bundling-livewire-and-alpine), atau [mengkonfigurasi Nginx untuk mengizinkan ini](https://benjamincrozat.com/livewire-js-404-not-found).

## Mempublikasikan file konfigurasi

Livewire adalah "zero-config", yang berarti Anda dapat menggunakannya dengan mengikuti konvensi, tanpa konfigurasi tambahan. Namun, jika diperlukan, Anda dapat mempublikasikan dan menyesuaikan file konfigurasi Livewire dengan menjalankan perintah Artisan berikut:

```shell
php artisan livewire:publish --config
```

Ini akan membuat file `livewire.php` baru di direktori `config` aplikasi Laravel Anda.

## Memasukkan aset frontend Livewire secara manual

Secara default, Livewire menyuntikkan aset JavaScript dan CSS yang dibutuhkannya ke setiap halaman yang menyertakan komponen Livewire.

Jika Anda menginginkan lebih banyak kontrol atas perilaku ini, Anda dapat memasukkan aset secara manual pada halaman menggunakan Blade directives berikut:

```php
<html>
<head>
	...
	@livewireStyles
</head>
<body>
	...
	@livewireScripts
</body>
</html>
```

Dengan memasukkan aset ini secara manual pada halaman, Livewire tahu untuk tidak menyuntikkan aset secara otomatis.

> [!warning] AlpineJS dibundle dengan Livewire
> Karena Alpine dibundle dengan aset JavaScript Livewire, Anda harus menyertakan @livewireScripts pada setiap halaman yang ingin Anda gunakan Alpine. Bahkan jika Anda tidak menggunakan Livewire pada halaman itu.

Meskipun jarang diperlukan, Anda dapat menonaktifkan perilaku aset auto-injecting Livewire dengan memperbarui opsi konfigurasi `inject_assets` di file `config/livewire.php` aplikasi Anda:

```php
'inject_assets' => false,
```

Jika Anda lebih suka memaksa Livewire untuk menyuntikkan asetnya pada satu halaman atau beberapa halaman, Anda dapat memanggil metode global berikut dari rute saat ini atau dari service provider.

```php
\Livewire\Livewire::forceAssetInjection();
```

## Mengkonfigurasi endpoint update Livewire

Setiap update di komponen Livewire mengirimkan permintaan jaringan ke server di endpoint berikut: `https://example.com/livewire/update`

Ini bisa menjadi masalah untuk beberapa aplikasi yang menggunakan localization atau multi-tenancy.

Dalam kasus tersebut, Anda dapat mendaftarkan endpoint Anda sendiri sesuai keinginan Anda, dan selama Anda melakukannya di dalam `Livewire::setUpdateRoute()`, Livewire akan tahu untuk menggunakan endpoint ini untuk semua update komponen:

```php
Livewire::setUpdateRoute(function ($handle) {
	return Route::post('/custom/livewire/update', $handle);
});
```

Sekarang, alih-alih menggunakan `/livewire/update`, Livewire akan mengirimkan update komponen ke `/custom/livewire/update`.

Karena Livewire memungkinkan Anda untuk mendaftarkan rute update Anda sendiri, Anda dapat mendeklarasikan middleware tambahan apa pun yang Anda inginkan Livewire gunakan langsung di dalam `setUpdateRoute()`:

```php
Livewire::setUpdateRoute(function ($handle) {
	return Route::post('/custom/livewire/update', $handle)
        ->middleware([...]); // [tl! highlight]
});
```

## Menyesuaikan URL aset

Secara default, Livewire akan menyajikan aset JavaScriptnya dari URL berikut: `https://example.com/livewire/livewire.js`. Selain itu, Livewire akan mereferensikan aset ini dari tag script seperti ini:

```php
<script src="/livewire/livewire.js" ...
```

Jika aplikasi Anda memiliki prefiks rute global karena localization atau multi-tenancy, Anda dapat mendaftarkan endpoint Anda sendiri yang harus digunakan Livewire secara internal saat mengambil JavaScriptnya.

Untuk menggunakan endpoint aset JavaScript kustom, Anda dapat mendaftarkan rute Anda sendiri di dalam `Livewire::setScriptRoute()`:

```php
Livewire::setScriptRoute(function ($handle) {
    return Route::get('/custom/livewire/livewire.js', $handle);
});
```

Sekarang, Livewire akan memuat JavaScriptnya seperti ini:

```php
<script src="/custom/livewire/livewire.js" ...
```

## Membundle Livewire dan Alpine secara manual

Secara default, Alpine dan Livewire dimuat menggunakan tag `<script src="livewire.js">`, yang berarti Anda tidak memiliki kontrol atas urutan library ini dimuat. Akibatnya, mengimpor dan mendaftarkan plugin Alpine, seperti yang ditunjukkan pada contoh di bawah, tidak akan berfungsi lagi:

```js
// Warning: This snippet demonstrates what NOT to do...

import Alpine from 'alpinejs'
import Clipboard from '@ryangjchandler/alpine-clipboard'

Alpine.plugin(Clipboard)
Alpine.start()
```

Untuk mengatasi masalah ini, kita perlu memberi tahu Livewire bahwa kita ingin menggunakan versi ESM (ECMAScript module) sendiri dan mencegah injeksi tag script `livewire.js`. Untuk mencapai ini, kita harus menambahkan directive `@livewireScriptConfig` ke file layout kita (`resources/views/components/layouts/app.blade.php`):

```php
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

Ketika Livewire mendeteksi directive `@livewireScriptConfig`, ia akan menahan diri untuk menyuntikkan script Livewire dan Alpine. Jika Anda menggunakan directive `@livewireScripts` untuk memuat Livewire secara manual, pastikan untuk menghapusnya. Pastikan untuk menambahkan directive `@livewireStyles` jika belum ada.

Langkah terakhir adalah mengimpor Alpine dan Livewire di file `app.js` kita, memungkinkan kita untuk mendaftarkan sumber daya kustom apa pun, dan pada akhirnya memulai Livewire dan Alpine:

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import Clipboard from '@ryangjchandler/alpine-clipboard'

Alpine.plugin(Clipboard)

Livewire.start()
```

> [!tip] Rebuild aset Anda setelah composer update
> Pastikan bahwa jika Anda membundle Livewire dan Alpine secara manual, Anda rebuild aset Anda setiap kali Anda menjalankan `composer update`.

> [!warning] Tidak kompatibel dengan Laravel Mix
> Laravel Mix tidak akan berfungsi jika Anda membundle Livewire dan AlpineJS secara manual. Sebagai gantinya, kami sarankan Anda [beralih ke Vite](https://laravel.com/docs/vite).

## Mempublikasikan aset frontend Livewire

> [!warning] Mempublikasikan aset tidak perlu
> Mempublikasikan aset Livewire tidak perlu agar Livewire dapat berjalan. Lakukan ini hanya jika Anda memiliki kebutuhan spesifik untuk itu.

Jika Anda lebih suka aset JavaScript disajikan oleh web server Anda bukan melalui Laravel, gunakan perintah `livewire:publish`:

```bash
php artisan livewire:publish --assets
```

Untuk menjaga aset tetap up-to-date dan menghindari masalah pada update mendatang, kami sangat menyarankan Anda menambahkan perintah berikut ke file composer.json Anda:

```json
{
    "scripts": {
        "post-update-cmd": [
            // Other scripts
            "@php artisan vendor:publish --tag=livewire:assets --ansi --force"
        ]
    }
}
```