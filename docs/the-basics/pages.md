---
sidebar_position: 1
---

# Pages

Saat membangun aplikasi menggunakan Inertia, setiap halaman dalam aplikasi Anda biasanya memiliki controller / route sendiri dan komponen JavaScript yang sesuai. Ini memungkinkan Anda untuk mengambil hanya data yang diperlukan untuk halaman tersebut - tidak perlu API.

Selain itu, semua data yang diperlukan untuk halaman dapat diambil sebelum halaman pernah dirender oleh browser, menghilangkan kebutuhan untuk menampilkan status "loading" saat pengunjung mengunjungi aplikasi Anda.

## Membuat halaman

Halaman Inertia hanyalah komponen JavaScript. Jika Anda pernah menulis komponen Vue, React, atau Svelte, Anda akan merasa nyaman. Seperti yang Anda lihat dalam contoh di bawah, halaman menerima data dari controller aplikasi Anda sebagai props.

Vue:

```markup
<script setup>
import Layout from './Layout'
import { Head } from '@inertiajs/vue3'
defineProps({ user: Object })
</script>
<template>
<Layout>
<Head title="Welcome" />
<h1>Welcome</h1>
<p>Hello {{ user.name }}, welcome to your first Inertia app!</p>
</Layout>
</template>
```

React:

```jsx
import Layout from './Layout'
import { Head } from '@inertiajs/react'
export default function Welcome({ user }) {
return (
<Layout>
<Head title="Welcome" />
<h1>Welcome</h1>
<p>Hello {user.name}, welcome to your first Inertia app!</p>
</Layout>
)
}
```

Svelte 4:

```html
<script>
import Layout from './Layout.svelte'
export let user
</script>
<svelte:head>
<title>Welcome</title>
</svelte:head>
<Layout>
<h1>Welcome</h1>
<p>Hello {user.name}, welcome to your first Inertia app!</p>
</Layout>
```

Svelte 5:

```html
<script>
import Layout from './Layout.svelte'
let { user } = $props()
</script>
<svelte:head>
<title>Welcome</title>
</svelte:head>
<Layout>
<h1>Welcome</h1>
<p>Hello {user.name}, welcome to your first Inertia app!</p>
</Layout>
```

Mengingat halaman di atas, Anda dapat me-render halaman dengan mengembalikan response Inertia dari controller atau route. Dalam contoh ini, mari kita asumsikan halaman ini disimpan di `resources/js/Pages/User/Show.vue` dalam aplikasi Laravel.

Laravel:

```php
use Inertia\Inertia;

class UserController extends Controller
{
    public function show(User $user)
    {
        return Inertia::render('User/Show', [
            'user' => $user
        ]);
    }
}
```

Jika Anda mencoba me-render halaman yang tidak ada, responsnya biasanya adalah layar kosong. Untuk mencegah ini, Anda dapat mengatur opsi konfigurasi `inertia.ensure_pages_exist` ke `true`. Adapter Laravel kemudian akan melempar `Inertia\ComponentNotFoundException` ketika halaman tidak dapat ditemukan.

## Membuat layout

Meskipun tidak diwajibkan, untuk sebagian besar proyek masuk akal untuk membuat komponen layout yang dapat digunakan oleh semua halaman Anda. Anda mungkin telah memperhatikan dalam contoh halaman kami di atas bahwa kami membungkus konten halaman dalam komponen `<Layout>`. Berikut adalah contoh komponen semacam itu:

Vue:

```markup
<script setup>
import { Link } from '@inertiajs/vue3'
</script>
<template>
<main>
<header>
<Link href="/">Home</Link>
<Link href="/about">About</Link>
<Link href="/contact">Contact</Link>
</header>
<article>
<slot />
</article>
</main>
</template>
```

React:

```jsx
import { Link } from '@inertiajs/react'
export default function Layout({ children }) {
return (
<main>
<header>
<Link href="/">Home</Link>
<Link href="/about">About</Link>
<Link href="/contact">Contact</Link>
</header>
<article>{children}</article>
</main>
)
}
```

Svelte 4:

```html
<script>
import { inertia } from '@inertiajs/svelte'
</script>
<main>
<header>
<a use:inertia href="/">Home</a>
<a use:inertia href="/about">About</a>
<a use:inertia href="/contact">Contact</a>
</header>
<article>
<slot />
</article>
</main>
```

Svelte 5:

```html
<script>
import { inertia } from '@inertiajs/svelte'
let { children } = $props()
</script>
<main>
<header>
<a use:inertia href="/">Home</a>
<a use:inertia href="/about">About</a>
<a use:inertia href="/contact">Contact</a>
</header>
<article>
{@render children()}
</article>
</main>
```

Seperti yang Anda lihat, tidak ada yang spesifik Inertia dalam template ini. Ini hanyalah komponen Vue, React, Svelte yang biasa.

## Persistent layouts

Meskipun mudah untuk mengimplementasikan layout sebagai anak dari komponen halaman, layout instance akan dihancurkan dan dibuat ulang antara kunjungan. Ini berarti Anda tidak dapat memiliki state layout yang persisten saat menavigasi antar halaman.

Misalnya, mungkin Anda memiliki audio player di website podcast yang ingin Anda terus mainkan saat pengguna menavigasi situs. Atau, mungkin Anda hanya ingin mempertahankan posisi scroll di navigasi sidebar antara kunjungan halaman. Dalam situasi ini, solusinya adalah memanfaatkan persistent layouts Inertia.

Vue:

```markup
<script>
import Layout from './Layout'
export default {
// Using a render function...
layout: (h, page) => h(Layout, [page]),
// Using shorthand syntax...
layout: Layout,
}
</script>
<script setup>
defineProps({ user: Object })
</script>
<template>
<h1>Welcome</h1>
<p>Hello {{ user.name }}, welcome to your first Inertia app!</p>
</template>
```

React:

```jsx
import Layout from './Layout'

const Home = ({ user }) => {
    return (
        <H1>Welcome</H1>
        <p>Hello {user.name}, welcome to your first Inertia app!</p>
    )
}

Home.layout = page => <Layout children={page} title="Welcome" />

export default Home
```

Svelte 4:

```html
<script context="module">
export { default as layout } from './Layout.svelte'
</script>
<script>
export let user
</script>
<h1>Welcome</h1>
<p>Hello {user.name}, welcome to your first Inertia app!</p>
</html>
```

Svelte 5:

```html
<script module>
export { default as layout } from './Layout.svelte'
</script>
<script>
let { user } = $props()
</script>
<h1>Welcome</h1>
<p>Hello {user.name}, welcome to your first Inertia app!</p>
</html>
```

Anda juga dapat membuat pengaturan layout yang lebih kompleks menggunakan nested layouts.

Vue:

```markup
<script>
import SiteLayout from './SiteLayout'
import NestedLayout from './NestedLayout'
export default {
// Using a render function...
layout: (h, page) => {
return h(SiteLayout, () => h(NestedLayout, () => page))
},
// Using the shorthand...
layout: [SiteLayout, NestedLayout],
}
</script>
<script setup>
defineProps({ user: Object })
</script>
<template>
<h1>Welcome</h1>
<p>Hello {{ user.name }}, welcome to your first Inertia app!</p>
</template>
```

React:

```jsx
import SiteLayout from './SiteLayout'
import NestedLayout from './NestedLayout'

const Home = ({ user }) => {
    return (
        <H1>Welcome</H1>
        <p>Hello {user.name}, welcome to your first Inertia app!</p>
    )
}

Home.layout = page => (
    <SiteLayout title="Welcome">
        <NestedLayout children={page} />
    </SiteLayout>
)

export default Home
```

Svelte 4:

```html
<script context="module">
import SiteLayout from './SiteLayout.svelte'
import NestedLayout from './NestedLayout.svelte'
// Using a render function...
export const layout = (h, page) => {
return h(SiteLayout, [h(NestedLayout, [page])])
}
// Using the shorthand...
export const layout = [SiteLayout, NestedLayout]
</script>
<script>
export let user
</script>
<h1>Welcome</h1>
<p>Hello {user.name}, welcome to your first Inertia app!</p>
</html>
```

Svelte 5:

```html
<script module>
import SiteLayout from './SiteLayout.svelte'
import NestedLayout from './NestedLayout.svelte'
// Using a render function...
export const layout = (h, page) => {
return h(SiteLayout, [h(NestedLayout, [page])])
}
// Using the shorthand...
export const layout = [SiteLayout, NestedLayout]
</script>
<script>
let { user } = $props()
</script>
<h1>Welcome</h1>
<p>Hello {user.name}, welcome to your first Inertia app!</p>
</html>
```

Jika Anda menggunakan Vue 3.3+, Anda dapat secara alternatif menggunakan defineOptions untuk mendefinisikan layout dalam `<script setup>`. Versi Vue yang lebih lama dapat menggunakan plugin defineOptions:

```markup
<script setup>
import Layout from './Layout'
defineOptions({ layout: Layout })
</script>
```

## Default layouts

Jika Anda menggunakan persistent layouts, Anda mungkin merasa nyaman untuk mendefinisikan layout halaman default dalam callback `resolve()` dari file JavaScript utama aplikasi Anda.

Vue:

```js
import Layout from './Layout'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
        let page = pages[`./Pages/${name}.vue`]
        page.default.layout = page.default.layout || Layout
        return page
    },
    // ...
})
```

React:

```js
import Layout from './Layout'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        let page = pages[`./Pages/${name}.jsx`]
        page.default.layout = page.default.layout || (page => <Layout children={page} />)
        return page
    },
    // ...
})
```

Svelte:

```js
import Layout from './Layout'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
        let page = pages[`./Pages/${name}.svelte`]
        return { default: page.default, layout: page.layout || Layout }
    },
    // ...
})
```

Ini akan secara otomatis mengatur layout halaman ke `Layout` jika layout belum diatur untuk halaman tersebut.

Anda bahkan dapat melangkah lebih jauh dan secara bersyarat mengatur layout halaman default berdasarkan `name` halaman, yang tersedia untuk callback `resolve()`. Misalnya, mungkin Anda tidak ingin layout default diterapkan ke halaman publik Anda.

Vue:

```js
import Layout from './Layout'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
        let page = pages[`./Pages/${name}.vue`]
        page.default.layout = name.startsWith('Public/') ? undefined : Layout
        return page
    },
    // ...
})
```

React:

```js
import Layout from './Layout'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        let page = pages[`./Pages/${name}.jsx`]
        page.default.layout = name.startsWith('Public/') ? undefined : page => <Layout children={page} />
        return page
    },
    // ...
})
```

Svelte:

```js
import Layout from './Layout'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
        let page = pages[`./Pages/${name}.svelte`]
        return { default: page.default, layout: name.startsWith('Public/') ? undefined : Layout }
    },
    // ...
})
```