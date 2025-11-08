---
title: Scroll Management
---

# Scroll Management

## Scroll resetting

Saat menavigasi antar halaman, Inertia meniru perilaku browser default dengan secara otomatis mereset posisi scroll dari body dokumen (serta [scroll regions](#scroll-regions) yang telah Anda definisikan) kembali ke atas.

Selain itu, Inertia melacak posisi scroll dari setiap halaman dan secara otomatis mengembalikan posisi scroll tersebut saat Anda menavigasi maju dan mundur dalam history.

## Scroll preservation

Terkadang diinginkan untuk mencegah scroll resetting default saat membuat kunjungan. Anda dapat menonaktifkan perilaku ini dengan mengatur opsi `preserveScroll` ke `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.visit(url, { preserveScroll: true })
```

React:

```js
import { router } from '@inertiajs/react'
router.visit(url, { preserveScroll: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.visit(url, { preserveScroll: true })
```

Jika Anda hanya ingin mempertahankan posisi scroll jika respons menyertakan validation errors, atur opsi `preserveScroll` ke "errors".

Vue:

```js
import { router } from '@inertiajs/vue3'
router.visit(url, { preserveScroll: 'errors' })
```

React:

```js
import { router } from '@inertiajs/react'
router.visit(url, { preserveScroll: 'errors' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.visit(url, { preserveScroll: 'errors' })
```

Anda juga dapat mengevaluasi opsi `preserveScroll` secara malas berdasarkan respons dengan menyediakan callback.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post('/users', data, {
    preserveScroll: (page) => page.props.someProp === 'value',
})
```

React:

```js
import { router } from '@inertiajs/react'
router.post('/users', data, {
    preserveScroll: (page) => page.props.someProp === 'value',
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post('/users', data, {
    preserveScroll: (page) => page.props.someProp === 'value',
})
```

Saat menggunakan [Inertia link](/links), Anda dapat mempertahankan posisi scroll menggunakan prop `preserveScroll`.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'
<Link href="/" preserve-scroll>Home</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'
<Link preserveScroll href="/">Home</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'
<a href="/" use:inertia={{ preserveScroll: true }}>Home</a>
<Link href="/" preserveScroll>Home</Link>
```

## Scroll regions

Jika aplikasi Anda tidak menggunakan document body scrolling, tetapi sebagai gantinya memiliki elemen yang dapat di-scroll (menggunakan properti CSS `overflow`), scroll resetting tidak akan berfungsi.

Dalam situasi ini, Anda harus memberi tahu Inertia elemen yang dapat di-scroll mana yang akan dikelola dengan menambahkan atribut `scroll-region` ke elemen tersebut.

```html
<div class="overflow-y-auto" scroll-region>
    <!-- Your page content -->
</div>
```

## Text fragments

[Text fragments](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment/Text_fragments) memungkinkan Anda untuk terhubung langsung ke teks spesifik pada halaman menggunakan sintaks URL khusus seperti `#:~:text=term`. Namun, browser menghapus direktif fragment sebelum JavaScript apa pun dijalankan, jadi text fragments hanya berfungsi jika teks yang dituju ada dalam respons HTML awal.

Untuk menggunakan text fragments dengan halaman Inertia Anda, aktifkan [server-side rendering](/server-side-rendering).