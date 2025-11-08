---
sidebar_position: 1
---

# Server-side setup

Langkah pertama adalah mengonfigurasi framework server-side Anda. Install adapter Laravel dari Inertia:

```bash
composer require inertiajs/inertia-laravel
```

Buat root template dengan direktif `@inertia` dan `@inertiaHead`:

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

Atur middleware dengan:

```sh
php artisan inertia:middleware
```

Tambahkan ke web middleware group:

```php
use App\Http\Middleware\HandleInertiaRequests;

->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        HandleInertiaRequests::class,
    ]);
})
```

Buat response menggunakan:

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
