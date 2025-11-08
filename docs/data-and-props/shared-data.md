---
sidebar_position: 1
---

# Shared Data

Terkadang Anda perlu mengakses data tertentu di banyak halaman dalam aplikasi Anda. "Meneruskan data ini secara manual menjadi merepotkan." Inertia menyediakan shared data untuk setiap permintaan.

## Membagikan data

Adapter sisi server membuat shared data tersedia untuk setiap permintaan, biasanya di luar controller. Shared data digabung dengan page props di controller Anda.

Middleware `HandleInertiaRequests` Laravel menangani ini:

```php
class HandleInertiaRequests extends Middleware
{
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'appName' => config('app.name'),
            'auth.user' => fn () => $request->user()
                ? $request->user()->only('id', 'name', 'email')
                : null,
        ]);
    }
}
```

Alternatifnya, gunakan `Inertia::share`:

```php
use Inertia\Inertia;
Inertia::share('appName', config('app.name'));
Inertia::share('user', fn (Request $request) => $request->user()
    ? $request->user()->only('id', 'name', 'email')
    : null
);
```

"Shared data harus digunakan secara hemat karena semua shared data disertakan dalam setiap respons."

## Mengakses shared data

Vue:
```markup
<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
const page = usePage()
const user = computed(() => page.props.auth.user)
</script>
```

React:
```jsx
import { usePage } from '@inertiajs/react'
export default function Layout({ children }) {
    const { auth } = usePage().props
    return (
        <main>
            <header>You are logged in as: {auth.user.name}</header>
            <article>{children}</article>
        </main>
    )
}
```

Svelte:
```html
<script>
import { page } from '@inertiajs/svelte'
</script>
<main>
<header>You are logged in as: {$page.props.auth.user.name}</header>
<article><slot /></article>
</main>
```

## Flash messages

Flash messages disimpan di session untuk permintaan berikutnya:

Laravel:
```php
class HandleInertiaRequests extends Middleware
{
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'flash' => [
                'message' => fn () => $request->session()->get('message')
            ],
        ]);
    }
}
```

Tampilkan di komponen layout (contoh Vue, React, Svelte menunjukkan pemeriksaan `$page.props.flash.message` dan rendering kondisional div alert).