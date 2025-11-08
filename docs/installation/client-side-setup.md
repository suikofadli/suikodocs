---
sidebar_position: 2
---

# Client-side setup

Setel sisi klien setelah [konfigurasi sisi server](/server-side-setup). Inertia mendukung React, Vue, dan Svelte.

## Laravel starter kits

[Laravel starter kits](https://laravel.com/starter-kits) menyediakan scaffolding langsung untuk aplikasi Inertia baru. Starter kits ini adalah cara tercepat untuk memulai proyek Inertia baru menggunakan Laravel dan Vue atau React. Namun, jika Anda ingin menginstal Inertia secara manual ke dalam aplikasi Anda, silakan lihat dokumentasi di bawah ini.

## Install dependencies

Instal adapter sisi klien Inertia yang sesuai dengan framework pilihan Anda.

Vue:

```bash
npm install @inertiajs/vue3
```

React:

```bash
npm install @inertiajs/react
```

Svelte:

```bash
npm install @inertiajs/svelte
```

## Initialize the Inertia app

Perbarui file JavaScript utama Anda untuk memulai aplikasi Inertia. Untuk melakukannya, kami akan menginisialisasi framework sisi klien dengan komponen Inertia dasar.

Vue:

```js
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
    return pages[`./Pages/${name}.vue`]
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
})
```

React:

```jsx
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
```

Svelte 4:

```js
import { createInertiaApp } from '@inertiajs/svelte'
createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
    return pages[`./Pages/${name}.svelte`]
  },
  setup({ el, App, props }) {
    new App({ target: el, props })
  },
})
```

Svelte 5:

```js
import { createInertiaApp } from '@inertiajs/svelte'
import { mount } from 'svelte'
createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
    return pages[`./Pages/${name}.svelte`]
  },
  setup({ el, App, props }) {
    mount(App, { target: el, props })
  },
})
```

## Configuring defaults

Anda dapat melewatkan objek `defaults` untuk mengkonfigurasi pengaturan default untuk berbagai fitur.

```js
createInertiaApp({
  // ...
  defaults: {
    form: {
      recentlySuccessfulDuration: 5000,
    },
    prefetch: {
      cacheFor: '1m',
      hoverDelay: 150,
    },
    visitOptions: (href, options) => {
      return {
        headers: {
          ...options.headers,
          'X-Custom-Header': 'value',
        },
      }
    },
  },
})
```

Callback `visitOptions` menerima URL target dan opsi kunjungan saat ini, dan harus mengembalikan objek dengan opsi apa pun yang ingin Anda timpa. Untuk detail lebih lanjut tentang opsi konfigurasi yang tersedia, lihat dokumentasi [form](/forms#form-errors), [prefetching](/prefetching), dan [manual visits](/manual-visits#global-visit-options).

### Updating at runtime

Anda juga dapat memperbarui nilai konfigurasi saat runtime menggunakan instance `config` yang diekspor. Ini sangat berguna ketika Anda perlu menyesuaikan pengaturan berdasarkan preferensi pengguna atau status aplikasi.

Vue:

```js
import { config } from '@inertiajs/vue3'
// Setel nilai tunggal menggunakan notasi titik...
config.set('form.recentlySuccessfulDuration', 1000)
config.set('prefetch.cacheFor', '5m')
// Setel beberapa nilai sekaligus...
config.set({
  'form.recentlySuccessfulDuration': 1000,
  'prefetch.cacheFor': '5m',
})
```

React:

```js
import { config } from '@inertiajs/react'
// Setel nilai tunggal menggunakan notasi titik...
config.set('form.recentlySuccessfulDuration', 1000)
config.set('prefetch.cacheFor', '5m')
// Setel beberapa nilai sekaligus...
config.set({
  'form.recentlySuccessfulDuration': 1000,
  'prefetch.cacheFor': '5m',
})
// Dapatkan nilai konfigurasi...
const duration = config.get('form.recentlySuccessfulDuration')
```

Svelte:

```js
import { config } from '@inertiajs/svelte'
// Setel nilai tunggal menggunakan notasi titik...
config.set('form.recentlySuccessfulDuration', 1000)
config.set('prefetch.cacheFor', '5m')
// Setel beberapa nilai sekaligus...
config.set({
  'form.recentlySuccessfulDuration': 1000,
  'prefetch.cacheFor': '5m',
})
// Dapatkan nilai konfigurasi...
const duration = config.get('form.recentlySuccessfulDuration')
```

## Resolving components

Callback `resolve` memberi tahu Inertia cara memuat komponen halaman. Ini menerima nama halaman (string), dan mengembalikan modul komponen halaman. Cara Anda mengimplementasikan callback ini bergantung pada bundler mana (Vite atau Webpack) yang Anda gunakan.

Vue:

```js
// Vite
resolve: name => {
  const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
  return pages[`./Pages/${name}.vue`]
},
// Webpack
resolve: name => require(`./Pages/${name}`),
```

React:

```js
// Vite
resolve: name => {
  const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
  return pages[`./Pages/${name}.jsx`]
},
// Webpack
resolve: name => require(`./Pages/${name}`),
```

Svelte:

```js
// Vite
resolve: name => {
  const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
  return pages[`./Pages/${name}.svelte`]
},
// Webpack
resolve: name => require(`./Pages/${name}.svelte`),
```

Secara default kami merekomendasikan eager loading komponen Anda, yang akan menghasilkan satu bundle JavaScript. Namun, jika Anda ingin lazy-load komponen Anda, lihat dokumentasi [code splitting](/code-splitting) kami.

## Defining a root element

Secara default, Inertia mengasumsikan bahwa root template aplikasi Anda memiliki elemen root dengan `id` `app`. Jika elemen root aplikasi Anda memiliki `id` yang berbeda, Anda dapat menyediakannya menggunakan properti `id`.

```js
createInertiaApp({
  id: 'my-app',
  // ...
})
```

Jika Anda mengubah `id` elemen root, pastikan untuk memperbarunya juga di [sisi server](/server-side-setup#root-template).
