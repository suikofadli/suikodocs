---
sidebar_position: 2
---

# Partial Reloads

Saat mengunjungi halaman yang sama lagi, Anda tidak selalu perlu mengambil ulang semua data dari server. Fitur "partial reload" Inertia membantu mengoptimalkan performa dengan hanya mengambil data yang diperlukan.

## Hanya props tertentu

Gunakan opsi `only` untuk menentukan data mana yang akan dikembalikan:

Vue:
```js
router.visit(url, { only: ['users'] })
```

React:
```js
router.visit(url, { only: ['users'] })
```

Svelte:
```js
router.visit(url, { only: ['users'] })
```

## Kecualikan props tertentu

Gunakan opsi `except` untuk menentukan data mana yang akan dikecualikan:

Vue:
```js
router.visit(url, { except: ['users'] })
```

React:
```js
router.visit(url, { except: ['users'] })
```

Svelte:
```js
router.visit(url, { except: ['users'] })
```

## Router shorthand

Gunakan `router.reload()` untuk kunjungan halaman yang sama:

Vue:
```js
router.reload({ only: ['users'] })
```

React:
```js
router.reload({ only: ['users'] })
```

Svelte:
```js
router.reload({ only: ['users'] })
```

## Menggunakan links

Partial reload bekerja dengan Inertia links menggunakan properti `only`:

Vue:
```jsx
<Link href="/users?active=true" :only="['users']">Show active</Link>
```

React:
```jsx
<Link href="/users?active=true" only={['users']}>Show active</Link>
```

Svelte:
```jsx
<a href="/users?active=true" use:inertia={{ only: ['users'] }}>Show active</a>
```

## Lazy data evaluation

Bungkus data opsional dalam closures untuk performa yang lebih baik:

```php
return Inertia::render('Users/Index', [
    'users' => fn () => User::all(),
    'companies' => fn () => Company::all(),
]);
```

Gunakan `Inertia::optional()` untuk hanya menyertakan saat diminta:

```php
return Inertia::render('Users/Index', [
    'users' => Inertia::optional(fn () => User::all()),
]);
```

Gunakan `Inertia::always()` untuk selalu menyertakan:

```php
return Inertia::render('Users/Index', [
    'users' => Inertia::always(User::all()),
]);
```