---
sidebar_position: 4
---

# Merging Props

Inertia memungkinkan Anda menggabungkan props dari berbagai sumber dengan cara yang fleksibel dan terkontrol.

## Default merging behavior

Secara default, Inertia akan menggabungkan props dari semua sumber yang tersedia, termasuk shared data, props dari controller, dan props lainnya.

## Properti unik

Jika ada properti dengan nama yang sama dari sumber yang berbeda, Inertia akan menggunakan nilai dari sumber yang memiliki prioritas lebih tinggi dalam urutan berikut:

1. Controller props
2. Shared data
3. Props lainnya

## Menghindari konflik

Untuk menghindari konflik penamaan, sebaiknya gunakan namespace yang berbeda untuk data yang berasal dari sumber yang berbeda:

```php
// Dalam controller
return Inertia::render('Dashboard', [
    'user_data' => $userData,
    'app_data' => $appData,
]);
```

## Contoh penggunaan

Dengan shared data yang sudah didefinisikan sebelumnya:

```php
// Dalam middleware HandleInertiaRequests
public function share(Request $request)
{
    return array_merge(parent::share($request), [
        'app' => [
            'name' => config('app.name'),
            'version' => config('app.version'),
        ],
        'auth' => [
            'user' => fn () => $request->user(),
        ],
    ]);
}
```

Dan dalam controller:

```php
// Dalam controller
return Inertia::render('Profile', [
    'user' => User::find($id),
    'posts' => Post::where('user_id', $id)->get(),
]);
```

Hasil akhir props yang akan diterima komponen:

```js
{
    app: {
        name: 'My App',
        version: '1.0.0'
    },
    auth: {
        user: { /* user data */ }
    },
    user: { /* user profile data */ },
    posts: [/* posts array */]
}
```

## Best practices

1. **Gunakan namespace yang jelas** untuk memisahkan data dari sumber yang berbeda
2. **Hindari nama properti yang sama** dari sumber yang berbeda
3. **Organisasi data dengan hierarki** untuk memudahkan pengaksesan
4. **Gunakan dot notation** untuk nested data access

```php
// Contoh penggunaan namespace yang baik
return Inertia::render('Dashboard', [
    'dashboard' => [
        'stats' => $stats,
        'charts' => $charts,
    ],
]);
```