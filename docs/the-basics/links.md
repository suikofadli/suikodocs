---
sidebar_position: 6
---

# Links

Untuk membuat link ke halaman lain dalam aplikasi Inertia, Anda biasanya akan menggunakan komponen `<Link>` dari Inertia. Komponen ini adalah pembungkus ringan dari link anchor `<a>` standar yang mencegat event klik dan mencegah reload halaman penuh. Ini adalah [cara Inertia menyediakan pengalaman single-page app](/how-it-works) setelah aplikasi Anda dimuat.

## Membuat link

Untuk membuat link Inertia, gunakan komponen `<Link>` dari Inertia. Atribut apa pun yang Anda berikan ke komponen ini akan diteruskan ke tag HTML yang mendasarinya.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/">Beranda</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link href="/">Beranda</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<a href="/" use:inertia>Beranda</a>
<Link href="/">Beranda</Link>
```

Secara default, Inertia merender link sebagai elemen anchor `<a>`. Namun, Anda dapat mengubah tag menggunakan prop `as`.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/logout" method="post" as="button">Keluar</Link>
// Dirender sebagai...
<button type="button">Keluar</button>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link href="/logout" method="post" as="button">Keluar</Link>
// Dirender sebagai...
<button type="button">Keluar</button>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<Link href="/logout" method="post" as="button">Keluar</Link>
// Dirender sebagai...
<button type="button">Keluar</button>
```

Membuat link anchor `<a>` untuk `POST`/`PUT`/`PATCH`/`DELETE` tidak disarankan karena menyebabkan masalah aksesibilitas "Open Link in New Tab / Window". Komponen secara otomatis merender elemen `<button>` saat menggunakan metode ini.

## Method

Anda dapat menentukan metode permintaan HTTP untuk permintaan link Inertia menggunakan prop `method`. Metode default yang digunakan oleh link adalah `GET`, tetapi Anda dapat menggunakan prop `method` untuk membuat permintaan `POST`, `PUT`, `PATCH`, dan `DELETE` melalui link.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/logout" method="post" as="button">Keluar</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link href="/logout" method="post" as="button">Keluar</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<button use:inertia={{ href: '/logout', method: 'post' }} type="button">Keluar</button>
<Link href="/logout" method="post">Keluar</Link>
```

## Wayfinder

<minimumversion version="2.0.6"></minimumversion>

Saat menggunakan [Wayfinder](https://github.com/laravel/wayfinder) bersamaan dengan komponen `Link`, Anda dapat langsung melewatkan objek hasil ke prop `href`. Komponen `Link` akan menyimpulkan metode HTTP dan URL langsung dari objek Wayfinder.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'
import { show } from 'App/Http/Controllers/UserController'

<Link :href="show(1)">John Doe</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'
import { show } from 'App/Http/Controllers/UserController'

<Link href={show(1)}>John Doe</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'
import { show } from 'App/Http/Controllers/UserController'

<button use:inertia={{ href: show(1) }} type="button">John Doe</button>
<Link href={show(1)}>John Doe</Link>
```

## Data

Saat membuat permintaan `POST` atau `PUT`, Anda mungkin ingin menambahkan data tambahan ke permintaan. Anda dapat melakukannya menggunakan prop `data`. Data yang disediakan dapat berupa instance `object` atau `FormData`.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/endpoint" method="post" :data="{ foo: bar }">Simpan</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link href="/endpoint" method="post" data={{ foo: bar }}>Simpan</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<button use:inertia={{ href: '/endpoint', method: 'post', data: { foo: bar } }} type="button">Simpan</button>
<Link href="/endpoint" method="post" data={{ foo: bar }}>Simpan</Link>
```

## Custom headers

Prop `headers` memungkinkan Anda menambahkan header khusus ke link Inertia. Namun, header yang digunakan Inertia secara internal untuk mengkomunikasikan statusnya ke server memiliki prioritas dan karenanya tidak dapat ditimpa.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/endpoint" :headers="{ foo: bar }">Simpan</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link href="/endpoint" headers={{ foo: bar }}>Simpan</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<button use:inertia={{ href: '/endpoint', headers: { foo: bar } }}>Simpan</button>
<Link href="/endpoint" headers={{ foo: bar }}>Simpan</Link>
```

## Browser history

Prop `replace` memungkinkan Anda menentukan perilaku history browser. Secara default, kunjungan halaman mendorong (new) state (`window.history.pushState`) ke dalam history; namun, dimungkinkan juga untuk mengganti state (`window.history.replaceState`) dengan mengatur prop `replace` ke `true`. Ini akan menyebabkan kunjungan mengganti history state saat ini alih-alih menambahkan history state baru ke stack.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/" replace>Beranda</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link replace href="/">Beranda</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<a href="/" use:inertia={{ replace: true }}>Beranda</a>
<Link href="/" replace>Beranda</Link>
```

## State preservation

Anda dapat mempertahankan state lokal komponen halaman menggunakan prop `preserve-state`. Ini akan mencegah komponen halaman render ulang sepenuhnya. Prop `preserve-state` sangat membantu pada halaman yang mengandung form, karena Anda dapat menghindari pengisian ulang field input secara manual dan juga dapat mempertahankan input yang difokuskan.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<input v-model="query" type="text" />
<Link href="/search" :data="{ query }" preserve-state>Cari</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<input onChange={this.handleChange} value={query} type="text" />
<Link href="/search" data={query} preserveState>Cari</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<input bind:value={query} type="text" />
<button use:inertia={{ href: '/search', data: { query }, preserveState: true }}>Cari</button>
<Link href="/search" data={{ query }} preserveState>Cari</Link>
```

## Scroll preservation

Anda dapat menggunakan prop `preserveScroll` untuk mencegah Inertia secara otomatis me-reset posisi scroll saat melakukan kunjungan halaman.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/" preserve-scroll>Beranda</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link preserveScroll href="/">Beranda</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<a href="/" use:inertia={{ preserveScroll: true }}>Beranda</a>
<Link href="/" preserveScroll>Beranda</Link>
```

Untuk informasi lebih lanjut tentang mengelola posisi scroll, lihat dokumentasi tentang [pengelolaan scroll](/scroll-management).

## Partial reloads

Prop `only` memungkinkan Anda menentukan bahwa hanya subset dari props (data) halaman yang harus diambil dari server pada kunjungan berikutnya ke halaman itu.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/users?active=true" :only="['users']">Tampilkan aktif</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link href="/users?active=true" only={['users']}>Tampilkan aktif</Link>
```

Svelte:

```jsx
import { inertia, Link } from '@inertiajs/svelte'

<a href="/users?active=true" use:inertia={{ only: ['users'] }}>Tampilkan aktif</a>
<Link href="/users?active=true" only={['users']}>Tampilkan aktif</Link>
```

Untuk informasi lebih lanjut tentang topik ini, lihat dokumentasi lengkap tentang [partial reloads](/partial-reloads).

## View transitions

Anda dapat mengaktifkan [View transitions](/view-transitions) untuk link dengan mengatur prop `viewTransition` ke `true`. Ini akan menggunakan View Transitions API browser untuk menganimasikan transisi halaman.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

<Link href="/another-page" view-transition>Navigasi</Link>
```

React:

```jsx
import { Link } from '@inertiajs/react'

<Link href="/another-page" viewTransition>Navigasi</Link>
```

Svelte:

```jsx
import { Link } from '@inertiajs/svelte'

<Link href="/another-page" viewTransition>Navigasi</Link>
```

## Active states

Sangat umum untuk mengatur state aktif untuk link navigasi berdasarkan halaman saat ini. Ini dapat dilakukan saat menggunakan Inertia dengan memeriksa objek `page` dan melakukan perbandingan string terhadap properti `page.url` dan `page.component`.

Vue:

```jsx
import { Link } from '@inertiajs/vue3'

// URL exact match...
<Link href="/users" :class="{ 'active': $page.url === '/users' }">Pengguna</Link>

// Component exact match...
<Link href="/users" :class="{ 'active': $page.component === 'Users/Index' }">Pengguna</Link>

// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" :class="{ 'active': $page.url.startsWith('/users') }">Pengguna</Link>

// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" :class="{ 'active': $page.component.startsWith('Users') }">Pengguna</Link>
```

React:

```jsx
import { usePage } from '@inertiajs/react'
const { url, component } = usePage()

// URL exact match...
<Link href="/users" className={url === '/users' ? 'active' : ''}>Pengguna</Link>

// Component exact match...
<Link href="/users" className={component === 'Users/Index' ? 'active' : ''}>Pengguna</Link>

// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" className={url.startsWith('/users') ? 'active' : ''}>Pengguna</Link>

// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" className={component.startsWith('Users') ? 'active' : ''}>Pengguna</Link>
```

Svelte:

```jsx
import { inertia, Link, page } from '@inertiajs/svelte'

// URL exact match...
<a href="/users" use:inertia class:active={$page.url === '/users'}>Pengguna</a>

// Component exact match...
<a href="/users" use:inertia class:active={$page.component === 'Users/Index'}>Pengguna</a>

// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" class={$page.url.startsWith('/users') ? 'active' : ''}>Pengguna</Link>

// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" class={$page.component.startsWith('Users') ? 'active' : ''}>Pengguna</Link>
```

Anda dapat melakukan perbandingan exact match (`===`), perbandingan `startsWith()` (berguna untuk mencocokkan subset halaman), atau bahkan perbandingan yang lebih kompleks menggunakan regular expressions.

Dengan pendekatan ini, Anda tidak terbatas hanya pada pengaturan nama kelas. Anda dapat menggunakan teknik ini untuk mengondisikan rendering markup apa pun pada state aktif, seperti teks link yang berbeda atau bahkan ikon SVG yang mewakili link sedang aktif.

## Data loading attribute

Saat link membuat permintaan aktif, atribut `data-loading` ditambahkan ke elemen link. Ini memungkinkan Anda untuk memberi gaya pada link saat dalam keadaan loading. Atribut dihapus setelah permintaan selesai.