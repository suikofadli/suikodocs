---
sidebar_position: 5
---

# Title & Meta

Karena Inertia.js dirender dalam dokumen `<body>`, Inertia tidak dapat memodifikasi elemen `<head>`. Untuk mengatasi ini, Inertia menyediakan komponen `<Head>` untuk memperbarui judul halaman dan meta tag.

Vue:

```jsx
import { Head } from '@inertiajs/vue3'

<Head title="Judul Halaman" />
```

React:

```jsx
import { Head } from '@inertiajs/react'

<Head title="Judul Halaman" />
```

Svelte:

```html
<script>
    import { Head } from '@inertiajs/svelte'
</script>

<Head title="Judul Halaman" />
```

## Meta tag

Anda juga dapat menambahkan meta tag lain menggunakan komponen `<Head>`:

Vue:

```jsx
import { Head } from '@inertiajs/vue3'

<Head>
    <title>Judul Halaman</title>
    <meta name="description" content="Deskripsi halaman" />
    <meta name="keywords" content="kata kunci, halaman, web" />
</Head>
```

React:

```jsx
import { Head } from '@inertiajs/react'

<Head>
    <title>Judul Halaman</title>
    <meta name="description" content="Deskripsi halaman" />
    <meta name="keywords" content="kata kunci, halaman, web" />
</Head>
```

Svelte:

```html
<script>
    import { Head } from '@inertiajs/svelte'
</script>

<Head>
    <title>Judul Halaman</title>
    <meta name="description" content="Deskripsi halaman" />
    <meta name="keywords" content="kata kunci, halaman, web" />
</Head>
```

## Multiple head components

Anda dapat menggunakan beberapa komponen `<Head>` dalam satu halaman. Inertia akan secara otomatis menggabungkan kontennya:

Vue:

```jsx
import { Head } from '@inertiajs/vue3'

<Head title="Judul Utama" />
<Head>
    <meta name="description" content="Deskripsi halaman" />
</Head>
```

React:

```jsx
import { Head } from '@inertiajs/react'

<Head title="Judul Utama" />
<Head>
    <meta name="description" content="Deskripsi halaman" />
</Head>
```

Svelte:

```html
<script>
    import { Head } from '@inertiajs/svelte'
</script>

<Head title="Judul Utama" />
<Head>
    <meta name="description" content="Deskripsi halaman" />
</Head>
```

## Head keys

Saat menggunakan multiple head components yang sama, Anda dapat menggunakan atribut `head-key` untuk mencegah duplikasi:

Vue:

```jsx
import { Head } from '@inertiajs/vue3'

<Head>
    <meta head-key="description" name="description" content="Deskripsi unik" />
</Head>
```

React:

```jsx
import { Head } from '@inertiajs/react'

<Head>
    <meta head-key="description" name="description" content="Deskripsi unik" />
</Head>
```

Svelte:

```html
<script>
    import { Head } from '@inertiajs/svelte'
</script>

<Head>
    <meta head-key="description" name="description" content="Deskripsi unik" />
</Head>
```