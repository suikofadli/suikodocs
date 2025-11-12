---
sidebar_position: 17
---

# Pagination

Fitur pagination Laravel memungkinkan Anda untuk melakukan query pada subset data dan memberikan kemampuan kepada pengguna untuk menavigasi antar *halaman* dari hasil tersebut.

Karena paginator Laravel dirancang untuk aplikasi statis, pada aplikasi non-Livewire, setiap navigasi halaman memicu kunjungan browser penuh ke URL baru yang berisi halaman yang diinginkan (`?page=2`).

Namun, ketika Anda menggunakan pagination di dalam komponen Livewire, pengguna dapat menavigasi antar halaman sambil tetap berada pada halaman yang sama. Livewire akan menangani semuanya di balik layar, termasuk memperbarui query string URL dengan halaman saat ini.

## Penggunaan dasar

Berikut adalah contoh paling dasar penggunaan pagination di dalam komponen `ShowPosts` untuk hanya menampilkan sepuluh postingan pada satu waktu:

> [!warning] Anda harus menggunakan trait `WithPagination`
> Untuk memanfaatkan fitur pagination Livewire, setiap komponen yang mengandung pagination harus menggunakan trait `Livewire\WithPagination`.

```php
<?php

namespace App\Livewire;

use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::paginate(10),
        ]);
    }
}
```

```blade
<div>
    <div>
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    </div>

    {{ $posts->links() }}
</div>
```

Seperti yang Anda lihat, selain membatasi jumlah postingan yang ditampilkan melalui method `Post::paginate()`, kami juga akan menggunakan `$posts->links()` untuk merender link navigasi halaman.

Untuk informasi lebih lanjut tentang pagination menggunakan Laravel, lihat [dokumentasi pagination lengkap Laravel](https://laravel.com/docs/pagination).

## Menonaktifkan pelacakan query string URL

Secara default, paginator Livewire melacak halaman saat ini di query string URL browser seperti ini: `?page=2`.

Jika Anda ingin tetap menggunakan utilitas pagination Livewire, tetapi menonaktifkan pelacakan query string, Anda dapat melakukannya menggunakan trait `WithoutUrlPagination`:

```php
use Livewire\WithoutUrlPagination;
use Livewire\WithPagination;
use Livewire\Component;

class ShowPosts extends Component
{
    use WithPagination, WithoutUrlPagination; // [tl! highlight]

    // ...
}
```

Sekarang, pagination akan bekerja seperti yang diharapkan, tetapi halaman saat ini tidak akan muncul di query string. Ini juga berarti halaman saat ini tidak akan bertahan saat perubahan halaman.

## Menyesuaikan perilaku scroll

Secara default, paginator Livewire menggulir ke bagian atas halaman setiap kali halaman berubah.

Anda dapat menonaktifkan perilaku ini dengan memberikan `false` pada parameter `scrollTo` dari method `links()` seperti ini:

```blade
{{ $posts->links(data: ['scrollTo' => false]) }}
```

Atau, Anda dapat memberikan selector CSS apa pun pada parameter `scrollTo`, dan Livewire akan menemukan elemen terdekat yang cocok dengan selector tersebut dan menggulir ke sana setiap navigasi:

```blade
{{ $posts->links(data: ['scrollTo' => '#paginated-posts']) }}
```

## Me-reset halaman

Saat mengurutkan atau menyaring hasil, umumnya Anda ingin me-reset nomor halaman kembali ke `1`.

Untuk alasan ini, Livewire menyediakan method `$this->resetPage()`, memungkinkan Anda untuk me-reset nomor halaman dari mana saja di komponen Anda.

Komponen berikut mendemonstrasikan penggunaan method ini untuk me-reset halaman setelah formulir pencarian dikirim:

```php
<?php

namespace App\Livewire;

use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Post;

class SearchPosts extends Component
{
    use WithPagination;

    public $query = '';

    public function search()
    {
        $this->resetPage();
    }

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::where('title', 'like', '%'.$this->query.'%')->paginate(10),
        ]);
    }
}
```

```blade
<div>
    <form wire:submit="search">
        <input type="text" wire:model="query">

        <button type="submit">Cari postingan</button>
    </form>

    <div>
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    </div>

    {{ $posts->links() }}
</div>
```

Sekarang, jika pengguna berada di halaman `5` dari hasil tersebut dan kemudian menyaring hasil lebih lanjut dengan menekan "Cari postingan", halaman akan direset kembali ke `1`.

### Method navigasi halaman yang tersedia

Selain `$this->resetPage()`, Livewire menyediakan method berguna lainnya untuk menavigasi antar halaman secara programmatis dari komponen Anda:

| Method | Deskripsi |
|-----------------|-------------------------------------------|
| `$this->setPage($page)` | Mengatur paginator ke nomor halaman tertentu |
| `$this->resetPage()` | Me-reset halaman kembali ke 1 |
| `$this->nextPage()` | Pergi ke halaman berikutnya |
| `$this->previousPage()` | Pergi ke halaman sebelumnya |

## Beberapa paginator

Karena Laravel dan Livewire menggunakan parameter query string URL untuk menyimpan dan melacak nomor halaman saat ini, jika halaman tunggal mengandung beberapa paginator, penting untuk memberi mereka nama yang berbeda.

Untuk mendemonstrasikan masalah ini dengan lebih jelas, pertimbangkan komponen `ShowClients` berikut:

```php
use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Client;

class ShowClients extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-clients', [
            'clients' => Client::paginate(10),
        ]);
    }
}
```

Seperti yang Anda lihat, komponen di atas berisi kumpulan *klien* yang dipaginasi. Jika pengguna menavigasi ke halaman `2` dari kumpulan hasil ini, URL mungkin terlihat seperti berikut:

```
http://application.test/?page=2
```

Misalkan halaman tersebut juga berisi komponen `ShowInvoices` yang juga menggunakan pagination. Untuk melacak halaman saat ini setiap paginator secara independen, Anda perlu menentukan nama untuk paginator kedua seperti ini:

```php
use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Invoices;

class ShowInvoices extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-invoices', [
            'invoices' => Invoice::paginate(10, pageName: 'invoices-page'),
        ]);
    }
}
```

Sekarang, karena parameter `pageName` telah ditambahkan ke method `paginate`, ketika pengguna mengunjungi halaman `2` dari *invoices*, URL akan berisi:

```
https://application.test/customers?page=2&invoices-page=2
```

Saat menggunakan method navigasi halaman Livewire pada paginator yang bernama, Anda harus memberikan nama halaman sebagai parameter tambahan:

```php
$this->setPage(2, pageName: 'invoices-page');

$this->resetPage(pageName: 'invoices-page');

$this->nextPage(pageName: 'invoices-page');

$this->previousPage(pageName: 'invoices-page');
```

## Hooking ke pembaruan halaman

Livewire memungkinkan Anda untuk mengeksekusi kode sebelum dan sesudah halaman diperbarui dengan mendefinisikan salah satu method berikut di dalam komponen Anda:

```php
use Livewire\WithPagination;

class ShowPosts extends Component
{
    use WithPagination;

    public function updatingPage($page)
    {
        // Berjalan sebelum halaman diperbarui untuk komponen ini...
    }

    public function updatedPage($page)
    {
        // Berjalan setelah halaman diperbarui untuk komponen ini...
    }

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::paginate(10),
        ]);
    }
}
```

### Hooks paginator bernama

Hooks sebelumnya hanya berlaku untuk paginator default. Jika Anda menggunakan paginator yang bernama, Anda harus mendefinisikan method menggunakan nama paginator.

Contohnya, berikut adalah contoh apa yang akan terlihat seperti hook untuk paginator bernama `invoices-page`:

```php
public function updatingInvoicesPage($page)
{
    //
}
```

### Hooks paginator umum

Jika Anda lebih suka tidak mereferensikan nama paginator dalam nama method hook, Anda dapat menggunakan alternatif yang lebih generik dan hanya menerima `$pageName` sebagai argumen kedua ke method hook:

```php
public function updatingPaginators($page, $pageName)
{
    // Berjalan sebelum halaman diperbarui untuk komponen ini...
}

public function updatedPaginators($page, $pageName)
{
    // Berjalan setelah halaman diperbarui untuk komponen ini...
}
```

## Menggunakan tema sederhana

Anda dapat menggunakan method `simplePaginate()` Laravel sebagai ganti `paginate()` untuk peningkatan kecepatan dan kesederhanaan.

Saat memaginasi hasil menggunakan method ini, hanya link navigasi *selanjutnya* dan *sebelumnya* yang akan ditampilkan kepada pengguna sebagai ganti link individual untuk setiap nomor halaman:

```php
public function render()
{
    return view('show-posts', [
        'posts' => Post::simplePaginate(10),
    ]);
}
```

Untuk informasi lebih lanjut tentang pagination sederhana, lihat [dokumentasi "simplePaginator" Laravel](https://laravel.com/docs/pagination#simple-pagination).

## Menggunakan cursor pagination

Livewire juga mendukung penggunaan cursor pagination Laravel — metode pagination yang lebih cepat yang berguna untuk dataset besar:

```php
public function render()
{
    return view('show-posts', [
        'posts' => Post::cursorPaginate(10),
    ]);
}
```

Dengan menggunakan `cursorPaginate()` sebagai ganti `paginate()` atau `simplePaginate()`, query string di URL aplikasi Anda akan menyimpan *cursor* yang dikodekan sebagai ganti nomor halaman standar. Contohnya:

```
https://example.com/posts?cursor=eyJpZCI6MTUsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0
```

Untuk informasi lebih lanjut tentang cursor pagination, lihat [dokumentasi cursor pagination Laravel](https://laravel.com/docs/pagination#cursor-pagination).

## Menggunakan Bootstrap sebagai ganti Tailwind

Jika Anda menggunakan [Bootstrap](https://getbootstrap.com/) sebagai ganti [Tailwind](https://tailwindcss.com/) sebagai framework CSS aplikasi Anda, Anda dapat mengkonfigurasi Livewire untuk menggunakan tampilan pagination bergaya Bootstrap sebagai ganti tampilan Tailwind default.

Untuk melakukan ini, atur nilai konfigurasi `pagination_theme` di file `config/livewire.php` aplikasi Anda:

```php
'pagination_theme' => 'bootstrap',
```

> [!info] Mempublikasikan file konfigurasi Livewire
> Sebelum menyesuaikan tema pagination, Anda harus terlebih dahulu mempublikasikan file konfigurasi Livewire ke direktori `/config` aplikasi Anda dengan menjalankan perintah berikut:
> ```shell
> php artisan livewire:publish --config
> ```

## Memodifikasi tampilan pagination default

Jika Anda ingin memodifikasi tampilan pagination Livewire agar sesuai dengan gaya aplikasi Anda, Anda dapat melakukannya dengan *mempublikasikan* mereka menggunakan perintah berikut:

```shell
php artisan livewire:publish --pagination
```

Setelah menjalankan perintah ini, empat file berikut akan dimasukkan ke dalam direktori `resources/views/vendor/livewire`:

| Nama file tampilan | Deskripsi |
|-----------------|-------------------------------------------|
| `tailwind.blade.php` | Tema pagination Tailwind standar |
| `tailwind-simple.blade.php` | Tema pagination Tailwind *sederhana* |
| `bootstrap.blade.php` | Tema pagination Bootstrap standar |
| `bootstrap-simple.blade.php` | Tema pagination Bootstrap *sederhana* |

Setelah file dipublikasikan, Anda memiliki kontrol penuh atas mereka. Saat merender link pagination menggunakan method `->links()` dari hasil yang dipaginasi di dalam template Anda, Livewire akan menggunakan file-file ini sebagai ganti miliknya sendiri.

## Menggunakan tampilan pagination kustom

Jika Anda ingin melewati tampilan pagination Livewire sama sekali, Anda dapat merender milik Anda sendiri dengan dua cara:

1. Method `->links()` di tampilan Blade Anda
2. Method `paginationView()` atau `paginationSimpleView()` di komponen Anda

### Melalui `->links()`

Pendekatan pertama adalah dengan hanya memberikan nama tampilan pagination Blade kustom Anda ke method `->links()` secara langsung:

```blade
{{ $posts->links('custom-pagination-links') }}
```

Saat merender link pagination, Livewire sekarang akan mencari tampilan di `resources/views/custom-pagination-links.blade.php`.

### Melalui `paginationView()` atau `paginationSimpleView()`

Pendekatan kedua adalah dengan mendeklarasikan method `paginationView` atau `paginationSimpleView` di dalam komponen Anda yang mengembalikan nama tampilan yang ingin Anda gunakan:

```php
public function paginationView()
{
    return 'custom-pagination-links-view';
}

public function paginationSimpleView()
{
    return 'custom-simple-pagination-links-view';
}
```

### Contoh tampilan pagination

Berikut adalah contoh sederhana yang tidak bergaya dari tampilan pagination Livewire sederhana untuk referensi Anda.

Seperti yang Anda lihat, Anda dapat menggunakan helper navigasi halaman Livewire seperti `$this->nextPage()` langsung di dalam template Anda dengan menambahkan `wire:click="nextPage"` ke tombol:

```blade
<div>
    @if ($paginator->hasPages())
        <nav role="navigation" aria-label="Pagination Navigation">
            <span>
                @if ($paginator->onFirstPage())
                    <span>Sebelumnya</span>
                @else
                    <button wire:click="previousPage" wire:loading.attr="disabled" rel="prev">Sebelumnya</button>
                @endif
            </span>

            <span>
                @if ($paginator->onLastPage())
                    <span>Berikutnya</span>
                @else
                    <button wire:click="nextPage" wire:loading.attr="disabled" rel="next">Berikutnya</button>
                @endif
            </span>
        </nav>
    @endif
</div>
```