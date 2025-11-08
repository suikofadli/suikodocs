---
sidebar_position: 1
---

# *Server-side setup*

Langkah pertama saat menginstal Inertia adalah mengonfigurasi *server-side framework* Anda. Inertia menyediakan *server-side adapter* resmi untuk [Laravel](https://laravel.com/). Untuk *framework* lainnya, silakan lihat [*community adapters*](/community-adapters).

Inertia dioptimalkan secara khusus untuk Laravel, jadi contoh dokumentasi di website ini menggunakan Laravel. Untuk contoh penggunaan Inertia dengan *server-side frameworks* lainnya, silakan merujuk pada dokumentasi spesifik *framework* yang dikelola oleh *adapter* tersebut.

## *Laravel starter kits*

[*Starter kits*](https://laravel.com/docs/starter-kits) Laravel, Breeze dan Jetstream, menyediakan *scaffolding* siap pakai untuk aplikasi Inertia baru. *Starter kits* ini adalah cara tercepat untuk mulai membangun proyek Inertia baru menggunakan Laravel dan Vue atau React. Namun, jika Anda ingin menginstal Inertia secara manual ke aplikasi Anda, silakan lihat dokumentasi di bawah ini.

## Install *dependencies*

Pertama, instal *server-side adapter* Inertia menggunakan *package manager* Composer.

**Laravel**:
```bash
composer require inertiajs/inertia-laravel
```

## *Root template*

Selanjutnya, siapkan *root template* yang akan dimuat pada kunjungan halaman pertama ke aplikasi Anda. *Template* ini harus menyertakan *assets* CSS dan JavaScript situs Anda, beserta direktif `@inertia` dan `@inertiaHead`.

Direktif `@inertia` merender elemen `<div>` dengan `id` `app` yang berfungsi sebagai *mounting point* untuk aplikasi JavaScript Anda. Sedangkan direktif `@inertiaHead` digunakan untuk me-*render* *meta tags* dan judul halaman yang didefinisikan di komponen Inertia Anda.

**Laravel**:
```markup
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @vite('resources/js/app.js')
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

Untuk aplikasi React, disarankan untuk menyertakan direktif `@viteReactRefresh` sebelum direktif `@vite` untuk mengaktifkan *Fast Refresh* dalam pengembangan.

Anda dapat mengkustomisasi `id` elemen *mounting point* dengan memberikan nilai berbeda ke direktif `@inertia`:

```markup
<html>
...
<body>
    @inertia('custom-app-id')
</body>
</html>
```

Jika Anda mengubah `id` elemen *root*, pastikan untuk memperbarunya di [*client-side*](/client-side-setup#defining-a-root-element) juga.

Secara default, *Laravel adapter* Inertia akan mengasumsikan *root template* Anda bernama `app.blade.php`. Jika Anda ingin menggunakan *root view* yang berbeda, Anda dapat mengubahnya menggunakan metode `Inertia::setRootView()`.

## *Middleware*

Selanjutnya kita perlu menyiapkan *middleware* Inertia. Anda dapat melakukannya dengan mempublikasikan *middleware* `HandleInertiaRequests` ke aplikasi Anda, yang dapat dilakukan menggunakan perintah Artisan berikut.

```sh
php artisan inertia:middleware
```

Setelah *middleware* dipublikasikan, tambahkan *middleware* `HandleInertiaRequests` ke *middleware group* `web` di file `bootstrap/app.php` aplikasi Anda.

```php
use App\Http\Middleware\HandleInertiaRequests;

->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        HandleInertiaRequests::class,
    ]);
})
```

*Middleware* ini menyediakan metode `version()` untuk mengatur [*asset version*](/asset-versioning), serta metode `share()` untuk mendefinisikan [*shared data*](/shared-data).

## Membuat *responses*

Itu saja, Anda siap untuk pergi di *server-side*! Sekarang Anda siap untuk mulai membuat [*pages*](/pages) Inertia dan merendernya melalui [*responses*](/responses).

**Laravel**:
```php
use Inertia\Inertia;

class EventsController extends Controller
{
    public function show(Event $event)
    {
        return Inertia::render('Event/Show', [
            'event' => $event->only(
                'id',
                'title',
                'start_date',
                'description'
            ),
        ]);
    }
}
```
