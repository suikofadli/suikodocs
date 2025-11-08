---
sidebar_position: 6
---

# Prefetching

Inertia mendukung prefetching data untuk halaman yang mungkin akan dikunjungi selanjutnya, meningkatkan performa aplikasi dengan mengambil data di latar belakang.

## Link prefetching

Tambahkan prop `prefetch` ke komponen link Inertia:

Vue: `<Link href="/users" prefetch>Users</Link>`
React: `<Link href="/users" prefetch>Users</Link>`
Svelte: `<a href="/users" use:inertia={{ prefetch: true }}>Users</a>`

Data di-cache selama 30 detik secara default. Kustomisasi dengan prop `cacheFor`:
Vue: `<Link href="/users" prefetch cache-for="1m">Users</Link>`

Picu prefetching pada berbagai acara:
- `hover` (default, 75ms delay)
- `click`: `<Link href="/users" prefetch="click">Users</Link>`
- `mount`: `<Link href="/users" prefetch="mount">Users</Link>`
- Gabungan: `<Link href="/users" prefetch={['mount', 'hover']}>Users</Link>`

## Prefetching programatik

Gunakan `router.prefetch` untuk prefetch data secara programatik:

```js
router.prefetch('/users', { method: 'get', data: { page: 2 } }, { cacheFor: '1m' })
```

Hook `usePrefetch` melacak status prefetch:
```js
const { lastUpdatedAt, isPrefetching, isPrefetched, flush } = usePrefetch()
```

## Cache tags

Tag data yang di-cache untuk mengelompokkan konten terkait dan membatalkan bersama-sama:

Vue: `<Link href="/users" prefetch cache-tags="users">Users</Link>`
Vue: `<Link href="/dashboard" prefetch :cache-tags="['dashboard', 'stats']">Dashboard</Link>`

## Cache invalidation

Flush cache secara manual:
```js
router.flushAll() // semua data yang di-cache
router.flush('/users') // halaman spesifik
router.flushByCacheTags('users') // berdasarkan tag
```

Pembatalan otomatis:
```js
router.on('navigate', () => router.flushAll())
```

Batalkan saat pengiriman form:
```js
<Form action="/users" method="post" invalidate-cache-tags={['users', 'dashboard']}>
```

## Stale while revalidate

Kustomisasi kesegaran cache:
```js
<Link href="/users" prefetch :cacheFor="['30s', '1m']">Users</Link>
```

Ini menyediakan data segar segera, data basi di latar belakang, lalu mengambil data baru saat diperlukan.