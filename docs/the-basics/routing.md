---
sidebar_position: 4
---

# Routing

## Mendefinisikan routes

Saat menggunakan Inertia, semua route aplikasi Anda didefinisikan di sisi server. Ini berarti Anda tidak memerlukan Vue Router atau React Router. Sebaliknya, Anda cukup mendefinisikan route Laravel dan mengembalikan response Inertia dari route tersebut.

## Route singkat

Jika Anda memiliki halaman yang tidak memerlukan method controller yang sesuai, seperti halaman "FAQ" atau "about", Anda dapat merutekan langsung ke komponen melalui method `Route::inertia()`.

Laravel:

```php
Route::inertia('/about', 'About');
```

## Membuat URLs

Beberapa framework sisi server memungkinkan Anda membuat URL dari route bernama. Namun, Anda tidak akan memiliki akses ke helper tersebut di sisi klien. Berikut adalah beberapa cara untuk tetap menggunakan route bernama dengan Inertia.

Opsi pertama adalah membuat URL di sisi server dan menyertakannya sebagai props. Perhatikan dalam contoh ini bagaimana kita mengirimkan `edit_url` dan `create_url` ke komponen `Users/Index`.

Laravel:

```php
class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::all()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'edit_url' => route('users.edit', $user),
                ];
            }),
            'create_url' => route('users.create'),
        ]);
    }
}
```

Namun, saat menggunakan Laravel, library [Ziggy](https://github.com/tighten/ziggy) dapat membuat route bernama sisi server Anda tersedia melalui fungsi global `route()`. Faktanya, jika Anda mengembangkan aplikasi menggunakan salah satu [starter kits](https://laravel.com/docs/starter-kits) Laravel, Ziggy sudah dikonfigurasi untuk Anda.

Jika Anda menggunakan plugin Vue yang disertakan dengan Ziggy, Anda dapat menggunakan fungsi `route()` langsung di template Anda.

```html
<Link :href="route('users.create')">Create User</Link>
```

Saat [server-side rendering](/server-side-rendering) diaktifkan, Anda dapat melewati objek opsi ke plugin Ziggy di file `ssr.js` Anda. Ini harus mencakup definisi route dan lokasi saat ini.

```js
.use(ZiggyVue, {
    ...page.props.ziggy,
    location: new URL(page.props.ziggy.location),
});
```

## Kustomisasi URL Halaman

[Objek halaman](/the-protocol#the-page-object) menyertakan `url` yang mewakili URL halaman saat ini. Secara default, adapter Laravel menyelesaikan ini menggunakan method `fullUrl()` pada instance `Request`, tetapi menghilangkan scheme dan host sehingga hasilnya adalah URL relatif.

Jika Anda perlu menyesuaikan bagaimana URL diselesaikan, Anda dapat menyediakan resolver dalam method `urlResolver` dari middleware Inertia `HandleInertiaRequests`.

```php
class HandleInertiaRequests extends Middleware
{
    public function urlResolver()
    {
        return function (Request $request) {
            // Kembalikan URL untuk request...
        };
    }
}
```

Alternatifnya, Anda dapat mendefinisikan resolver menggunakan method `Inertia::resolveUrlUsing()`.

```php
Inertia::resolveUrlUsing(function (Request $request) {
    // Kembalikan URL untuk request...
});
```