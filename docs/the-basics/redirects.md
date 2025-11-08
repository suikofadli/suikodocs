---
sidebar_position: 3
---

# Redirects

Saat membuat permintaan Inertia non-GET secara manual atau melalui elemen `<Link>`, pastikan untuk selalu merespons dengan redirect Inertia yang tepat.

Laravel:

```php
class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::all(),
        ]);
    }

    public function store(Request $request)
    {
        User::create(
            $request->validate([
                'name' => ['required', 'max:50'],
                'email' => ['required', 'max:50', 'email'],
            ])
        );

        return to_route('users.index');
    }
}
```

## Kode respons 303

Saat melakukan redirect setelah permintaan `PUT`, `PATCH`, atau `DELETE`, Anda harus menggunakan kode respons `303`.

## Redirect eksternal

Untuk redirect ke situs eksternal (bukan dalam aplikasi Inertia Anda), gunakan metode `Inertia::location()`. Ini akan menghasilkan respons `409 Conflict` dengan header `X-Inertia-Location`, yang akan menyebabkan Inertia melakukan kunjungan penuh ke lokasi baru.