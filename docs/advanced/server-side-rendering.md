---
title: Server-side Rendering
---

# Server-side Rendering (SSR)

Server-side rendering merender halaman JavaScript Anda terlebih dahulu di server, memungkinkan pengunjung Anda menerima HTML yang sepenuhnya dirender ketika mereka mengunjungi aplikasi Anda. Karena HTML yang sepenuhnya dirender disajikan oleh aplikasi Anda, ini juga lebih mudah untuk mesin pencari untuk mengindeks situs Anda.

Server-side rendering menggunakan Node.js untuk merender halaman Anda dalam proses background; oleh karena itu, Node harus tersedia di server Anda agar server-side rendering berfungsi dengan baik.

## Laravel starter kits

Jika Anda menggunakan [Laravel Starter Kits](https://laravel.com/docs/starter-kits), Inertia SSR [didukung](https://laravel.com/docs/starter-kits#inertia-ssr) melalui perintah build:

Laravel:

```bash
npm run build:ssr
```

## Install dependencies

Jika Anda tidak menggunakan Laravel starter kit dan ingin mengkonfigurasi SSR secara manual, kami pertama akan menginstal dependensi tambahan yang diperlukan untuk server-side rendering. Ini hanya diperlukan untuk adapter Vue, jadi Anda dapat melewati langkah ini jika Anda menggunakan React atau Svelte.

Vue:

```bash
npm install @vue/server-renderer
```

React:

```js
// Tidak ada dependensi tambahan yang diperlukan
```

Svelte:

```js
// Tidak ada dependensi tambahan yang diperlukan
```

## Tambahkan server entry-point

Selanjutnya, kami akan membuat file `resources/js/ssr.js` dalam proyek Laravel kami yang akan berfungsi sebagai titik masuk SSR kami.

```bash
touch resources/js/ssr.js
```

File ini akan terlihat sangat mirip dengan file `resources/js/app.js` Anda, kecuali file ini tidak akan berjalan di browser, melainkan di Node.js. Berikut adalah contoh lengkapnya.

Vue:

```js
import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'

createServer(page =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: name => {
            const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
            return pages[`./Pages/${name}.vue`]
        },
        setup({ App, props, plugin }) {
            return createSSRApp({
                render: () => h(App, props),
            }).use(plugin)
        },
    }),
)
```

React:

```jsx
import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'

createServer(page =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: name => {
            const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
            return pages[`./Pages/${name}.jsx`]
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
)
```

Svelte 4:

```js
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'

createServer(page =>
    createInertiaApp({
        page,
        resolve: name => {
            const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
            return pages[`./Pages/${name}.svelte`]
        },
        setup({ App, props }) {
            return App.render(props)
        },
    }),
)
```

Svelte 5:

```js
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'
import { render } from 'svelte/server'

createServer(page =>
    createInertiaApp({
        page,
        resolve: name => {
            const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
            return pages[`./Pages/${name}.svelte`]
        },
        setup({ App, props }) {
            return render(App, { props })
        },
    }),
)
```

Saat membuat file ini, pastikan untuk menambahkan apa pun yang hilang dari file `app.js` Anda yang masuk akal untuk dijalankan dalam mode SSR, seperti plugin atau mixin kustom.

### Clustering

Secara default, server SSR akan berjalan pada satu thread. Clustering memulai beberapa server Node pada port yang sama, permintaan kemudian ditangani oleh setiap thread dengan cara round-robin.

Anda dapat mengaktifkan clustering dengan meneruskan argumen kedua dari opsi ke `createServer`.

Vue:

```js
import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'

createServer(page =>
    createInertiaApp({
        // ...
    }),
    { cluster: true },
)
```

React:

```jsx
import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'

createServer(page =>
    createInertiaApp({
        // ...
    }),
    { cluster: true },
)
```

Svelte 4:

```js
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'

createServer(page =>
    createInertiaApp({
        // ...
    }),
    { cluster: true },
)
```

Svelte 5:

```js
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'
import { render } from 'svelte/server'

createServer(page =>
    createInertiaApp({
        // ...
    }),
    { cluster: true },
)
```

## Setup Vite

Selanjutnya, kami perlu memperbarui konfigurasi Vite kami untuk membangun file `ssr.js` baru kami. Kami dapat melakukan ini dengan menambahkan properti `ssr` ke konfigurasi plugin Vite Laravel dalam file `vite.config.js` kami.

```diff
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
+           ssr: 'resources/js/ssr.js',
            refresh: true,
        }),
        // ...
    ],
})
```

## Update npm script

Selanjutnya, mari kita perbarui skrip `build` dalam file `package.json` kami untuk juga membangun file `ssr.js` baru kami.

```diff
"scripts": {
    "dev": "vite",
-   "build": "vite build"
+   "build": "vite build && vite build --ssr"
},
```

Sekarang Anda dapat membangun bundle client-side dan server-side Anda.

```bash
npm run build
```

## Menjalankan server SSR

Sekarang Anda telah membangun bundle client-side dan server-side, Anda harus dapat menjalankan server SSR Inertia berbasis Node menggunakan perintah berikut.

```bash
php artisan inertia:start-ssr
```

Anda dapat menggunakan opsi `--runtime` untuk menentukan runtime mana yang ingin Anda gunakan. Ini memungkinkan Anda untuk beralih dari runtime Node.js default ke Bun.

```bash
php artisan inertia:start-ssr --runtime=bun
```

Dengan server berjalan, Anda seharusnya dapat mengakses aplikasi Anda dalam browser dengan server-side rendering diaktifkan. Faktanya, Anda seharusnya dapat menonaktifkan JavaScript sepenuhnya dan masih menavigasi aplikasi Anda.

## Client side hydration

Karena situs web Anda sekarang sedang dirender di sisi server, Anda dapat menginstruksikan Vue, React, atau Svelte untuk "hydrate" markup statis dan membuatnya interaktif sebagai ganti merender ulang semua HTML yang baru saja kami buat.

### Vue

Untuk mengaktifkan client-side hydration dalam aplikasi Vue, perbarui file `ssr.js` Anda untuk menggunakan `createSSRApp` sebagai ganti `createApp`.

```diff
- import { createApp, h } from 'vue'
+ import { createSSRApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
        return pages[`./Pages/${name}.vue`]
    },
    setup({ el, App, props, plugin }) {
-       createApp({ render: () => h(App, props) })
+       createSSRApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el)
    },
})
```

### React

Untuk mengaktifkan client-side hydration dalam aplikasi React, perbarui file `ssr.js` Anda untuk menggunakan `hydrateRoot` sebagai ganti `createRoot`.

```diff
import { createInertiaApp } from '@inertiajs/react'
- import { createRoot } from 'react-dom/client'
+ import { hydrateRoot } from 'react-dom/client'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
-       createRoot(el).render(<App {...props} />)
+       hydrateRoot(el, <App {...props} />)
    },
})
```

### Svelte 4

Untuk mengaktifkan client-side hydration dalam aplikasi Svelte 4, atur opsi `hydrate` ke `true` dalam file `ssr.js` Anda.

```diff
import { createInertiaApp } from '@inertiajs/svelte'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
        return pages[`./Pages/${name}.svelte`]
    },
    setup({ el, App, props }) {
-       new App({ target: el, props })
+       new App({ target: el, props, hydrate: true })
    },
})
```

### Svelte 5

Untuk mengaktifkan client-side hydration dalam aplikasi Svelte 5, perbarui file `ssr.js` Anda untuk menggunakan `hydrate` sebagai ganti `mount` saat server rendering.

```diff
import { createInertiaApp } from '@inertiajs/svelte'
-  import { mount } from 'svelte'
+  import { hydrate, mount } from 'svelte'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
        return pages[`./Pages/${name}.svelte`]
    },
    setup({ el, App, props }) {
-       mount(App, { target: el, props })
+       if (el.dataset.serverRendered === 'true') {
+           hydrate(App, { target: el, props })
+       } else {
+           mount(App, { target: el, props })
+       }
    },
})
```

### Konfigurasi Tambahan Svelte 4

Anda juga perlu mengatur opsi compiler `hydratable` ke `true` dalam file `vite.config.js` Anda:

```diff
import { svelte } from '@sveltejs/vite-plugin-svelte'
import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        laravel.default({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            ssr: 'resources/js/ssr.js',
            refresh: true,
        }),
-       svelte(),
+       svelte({
+           compilerOptions: {
+               hydratable: true,
+           },
+       }),
    ],
})
```

## Deployment

Saat menerapkan aplikasi dengan SSR ke production, Anda perlu membangun bundle client-side (`app.js`) dan server-side (`ssr.js`), lalu menjalankan server SSR sebagai proses background, biasanya menggunakan alat monitoring proses seperti Supervisor.

```bash
php artisan inertia:start-ssr
```

Untuk menghentikan server SSR, misalnya saat Anda menerapkan versi baru situs web Anda, Anda dapat menggunakan perintah Artisan `inertia:stop-ssr`. Monitor proses Anda (seperti Supervisor) harus bertanggung jawab untuk secara otomatis memulai ulang server SSR setelah dihentikan.

```bash
php artisan inertia:stop-ssr
```

Anda dapat menggunakan perintah Artisan `inertia:check-ssr` untuk memverifikasi bahwa server SSR berjalan. Ini dapat membantu setelah deployment dan berfungsi dengan baik sebagai health check Docker untuk memastikan server merespons seperti yang diharapkan.

```bash
php artisan inertia:check-ssr
```

Secara default, pemeriksaan dilakukan untuk memastikan bundle server-side ada sebelum mengirim permintaan ke server SSR. Dalam beberapa kasus, seperti saat aplikasi Anda berjalan pada beberapa server atau dikontainerkan, server web mungkin tidak memiliki akses ke bundle SSR. Untuk menonaktifkan pemeriksaan ini, Anda dapat mengatur nilai konfigurasi `inertia.ssr.ensure_bundle_exists` ke `false`.

### Laravel Cloud

Untuk menjalankan server SSR di Laravel Cloud, Anda dapat menggunakan [dukungan native untuk Inertia SSR](https://cloud.laravel.com/docs/compute#inertia-ssr) dari Cloud.

### Laravel Forge

Untuk menjalankan server SSR di Forge, Anda harus membuat daemon baru yang menjalankan `php artisan inertia:start-ssr` dari root aplikasi Anda. Atau, Anda dapat menggunakan integrasi Inertia bawaan dari dashboard manajemen aplikasi Forge Anda.

Selanjutnya, kapan pun Anda menerapkan aplikasi Anda, Anda dapat secara otomatis memulai ulang server SSR dengan memanggil perintah `php artisan inertia:stop-ssr`. Ini akan menghentikan server SSR yang ada, memaksa server baru untuk dimulai oleh monitor proses Anda.

### Heroku

Untuk menjalankan server SSR di Heroku, perbarui konfigurasi `web` dalam `Procfile` Anda untuk menjalankan server SSR sebelum memulai server web Anda.

```bash
web: php artisan inertia:start-ssr & vendor/bin/heroku-php-apache2 public/
```

Perhatikan, Anda harus menginstal buildpack `heroku/nodejs` selain buildpack `heroku/php` agar server SSR dapat berjalan.