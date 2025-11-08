---
sidebar_position: 2
---

# Client-side setup

Setelah [framework sisi server dikonfigurasi](/server-side-setup), Anda perlu menyiapkan framework sisi klien. Inertia saat ini menyediakan dukungan untuk React, Vue, dan Svelte.

## Laravel starter kits

[Laravel starter kits](https://laravel.com/starter-kits) menyediakan scaffolding langsung untuk aplikasi Inertia baru. Starter kits ini adalah cara tercepat untuk mulai membangun proyek Inertia baru menggunakan Laravel dan Vue atau React. Namun, jika Anda ingin menginstal Inertia secara manual ke dalam aplikasi Anda, silakan lihat dokumentasi di bawah ini.

## Install dependencies

Pertama, instal *adapter* sisi klien Inertia yang sesuai dengan framework pilihan Anda.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="vue" label="Vue" default>

```bash
npm install @inertiajs/vue3
```

  </TabItem>
  <TabItem value="react" label="React">

```bash
npm install @inertiajs/react
```

  </TabItem>
  <TabItem value="svelte" label="Svelte">

```bash
npm install @inertiajs/svelte
```

  </TabItem>
</Tabs>

## Initialize the Inertia app

Selanjutnya, perbarui file *JavaScript* utama Anda untuk menjalankan aplikasi Inertia. Untuk melakukannya, kami akan menginisialisasi framework sisi klien dengan komponen Inertia dasar.

<Tabs>
  <TabItem value="vue" label="Vue" default>

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

  </TabItem>
  <TabItem value="react" label="React">

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

  </TabItem>
  <TabItem value="svelte-4" label="Svelte 4">

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

  </TabItem>
  <TabItem value="svelte-5" label="Svelte 5">

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

  </TabItem>
</Tabs>

*Callback* `setup` menerima semua yang diperlukan untuk menginisialisasi framework sisi klien, termasuk komponen `App` root Inertia. Opsi `{ eager: true }` digunakan untuk me-*load* semua komponen halaman secara bersamaan saat aplikasi dimulai, yang menghasilkan satu *bundle JavaScript* yang lebih besar tetapi memberikan performa navigasi yang lebih cepat karena tidak perlu me-*load* komponen secara dinamis.

## Configuring defaults

Anda dapat melewatkan objek `defaults` ke `createInertiaApp()` untuk mengonfigurasi pengaturan default untuk berbagai fitur. Anda tidak perlu memasukkan semua keys, hanya yang ingin Anda ubah.

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

Callback `visitOptions` menerima URL target dan opsi kunjungan saat ini, dan harus mengembalikan objek dengan opsi apa pun yang ingin Anda timpa. Untuk detail lebih lanjut tentang opsi konfigurasi yang tersedia, lihat dokumentasi [forms](/forms#form-errors), [prefetching](/prefetching), dan [manual visits](/manual-visits#global-visit-options).

### Updating at runtime

Anda juga dapat memperbarui nilai konfigurasi saat *runtime* menggunakan *instance* `config` yang diekspor. Ini sangat berguna ketika Anda perlu menyesuaikan pengaturan berdasarkan preferensi pengguna atau status aplikasi.

<Tabs>
  <TabItem value="vue" label="Vue" default>

```js
import { config } from '@inertiajs/vue3'
// Setel satu nilai menggunakan notasi titik...
config.set('form.recentlySuccessfulDuration', 1000)
config.set('prefetch.cacheFor', '5m')
// Setel beberapa nilai sekaligus...
config.set({
  'form.recentlySuccessfulDuration': 1000,
  'prefetch.cacheFor': '5m',
})
```

  </TabItem>
  <TabItem value="react" label="React">

```js
import { config } from '@inertiajs/react'
// Setel satu nilai menggunakan notasi titik...
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

  </TabItem>
  <TabItem value="svelte" label="Svelte">

```js
import { config } from '@inertiajs/svelte'
// Setel satu nilai menggunakan notasi titik...
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

  </TabItem>
</Tabs>

## Resolving components

*Callback* `resolve` memberi tahu Inertia cara memuat komponen halaman. *Callback* ini menerima nama halaman (*string*), dan mengembalikan *modul komponen* halaman. Cara Anda mengimplementasikan *callback* ini bergantung pada *bundler* mana (*Vite* atau *Webpack*) yang Anda gunakan.

<Tabs>
  <TabItem value="vue" label="Vue" default>

```js
// Vite
resolve: name => {
  const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
  return pages[`./Pages/${name}.vue`]
},
// Webpack
resolve: name => require(`./Pages/${name}`),
```

  </TabItem>
  <TabItem value="react" label="React">

```js
// Vite
resolve: name => {
  const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
  return pages[`./Pages/${name}.jsx`]
},
// Webpack
resolve: name => require(`./Pages/${name}`),
```

  </TabItem>
  <TabItem value="svelte" label="Svelte">

```js
// Vite
resolve: name => {
  const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
  return pages[`./Pages/${name}.svelte`]
},
// Webpack
resolve: name => require(`./Pages/${name}.svelte`),
```

  </TabItem>
</Tabs>

Secara default kami merekomendasikan *eager loading* komponen Anda, yang akan menghasilkan satu bundle JavaScript. Namun, jika Anda ingin *lazy-load* komponen Anda, lihat dokumentasi [code splitting](/code-splitting) kami.

## Defining a root element

Secara default, Inertia mengasumsikan bahwa root template aplikasi Anda memiliki elemen root dengan `id` `app`. Jika elemen root aplikasi Anda memiliki `id` yang berbeda, Anda dapat menyediakannya menggunakan properti `id`.

```js
createInertiaApp({
  id: 'my-app',
  // ...
})
```

Jika Anda mengubah `id` elemen root, pastikan untuk memperbarunya juga di [sisi server](/server-side-setup#root-template).
