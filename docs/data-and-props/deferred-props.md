---
sidebar_position: 3
---

# Deferred Props

Fitur deferred props Inertia memungkinkan Anda menunda loading data halaman tertentu hingga setelah render halaman awal. Ini dapat berguna untuk meningkatkan performa yang dirasakan dari aplikasi Anda dengan memungkinkan render halaman awal terjadi secepat mungkin.

## Server side

Untuk menunda sebuah prop, Anda dapat menggunakan metode `Inertia::defer()` saat mengembalikan respons Anda. Metode ini menerima callback yang mengembalikan data prop. Callback akan dieksekusi dalam permintaan terpisah setelah render halaman awal.

Laravel:

```php
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all(),
        'roles' => Role::all(),
        'permissions' => Inertia::defer(fn () => Permission::all()),
    ]);
});
```

### Grouping requests

Secara default, semua deferred props diambil dalam satu permintaan setelah halaman awal dirender, tetapi Anda dapat memilih untuk mengambil data secara paralel dengan mengelompokkan props bersama-sama.

Laravel:

```php
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all(),
        'roles' => Role::all(),
        'permissions' => Inertia::defer(fn () => Permission::all()),
        'teams' => Inertia::defer(fn () => Team::all(), 'attributes'),
        'projects' => Inertia::defer(fn () => Project::all(), 'attributes'),
        'tasks' => Inertia::defer(fn () => Task::all(), 'attributes'),
    ]);
});
```

Dalam contoh di atas, props `teams`, `projects`, dan `tasks` akan diambil dalam satu permintaan, sedangkan prop `permissions` akan diambil dalam permintaan terpisah secara paralel. Nama grup adalah string sembarang dan bisa apa saja yang Anda pilih.

## Client side

Di sisi klien, Inertia menyediakan komponen `Deferred` untuk membantu Anda mengelola deferred props. Komponen ini akan secara otomatis menunggu deferred props yang ditentukan tersedia sebelum merender children-nya.

Vue:

```markup
<script setup>
import { Deferred } from '@inertiajs/vue3'
</script>
<template>
<Deferred data="permissions">
<template #fallback>
<div>Loading...</div>
</template>
<div v-for="permission in permissions">
\<!-- ... -->
</div>
</Deferred>
</template>
```

React:

```jsx
import { Deferred } from '@inertiajs/react'
export default () => (
<Deferred data="permissions" fallback={<div>Loading...</div>}>
<PermissionsChildComponent />
</Deferred>
)
```

Svelte 4:

```jsx
<script>
import { Deferred } from '@inertiajs/svelte'
export let permissions
</script>
<Deferred data="permissions">
<svelte:fragment slot="fallback">
<div>Loading...</div>
</svelte:fragment>
{#each permissions as permission}
\<!-- ... -->
{/each}
</Deferred>
```

Svelte 5:

```jsx
<script>
import { Deferred } from '@inertiajs/svelte'
let { permissions } = $props()
</script>
<Deferred data="permissions">
{#snippet fallback()}
<div>Loading...</div>
{/snippet}
{#each permissions as permission}
\<!-- ... -->
{/each}
</Deferred>
```

Jika Anda perlu menunggu multiple deferred props tersedia, Anda dapat menentukan array ke prop `data`.

Vue:

```markup
<script setup>
import { Deferred } from '@inertiajs/vue3'
</script>
<template>
<Deferred :data="['teams', 'users']">
<template #fallback>
<div>Loading...</div>
</template>
\<!-- Props are now loaded -->
</Deferred>
</template>
```

React:

```jsx
import { Deferred } from '@inertiajs/react'
export default () => (
<Deferred data={['teams', 'users']} fallback={<div>Loading...</div>}>
<ChildComponent />
</Deferred>
)
```

Svelte 4:

```jsx
<script>
import { Deferred } from '@inertiajs/svelte'
export let teams
export let users
</script>
<Deferred data={['teams', 'users']}>
<svelte:fragment slot="fallback">
<div>Loading...</div>
</svelte:fragment>
<!-- Props are now loaded -->
</Deferred>
```

Svelte 5:

```jsx
<script>
import { Deferred } from '@inertiajs/svelte'
let { teams, users } = $props()
</script>
<Deferred data={['teams', 'users']}>
{#snippet fallback()}
<div>Loading...</div>
{/snippet}
<!-- Props are now loaded -->
</Deferred>
```