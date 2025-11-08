---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Panduan Upgrade untuk v2.0

Anda dapat menemukan dokumentasi warisan untuk Inertia.js v1.0 di [v1.inertiajs.com](https://v1.inertiajs.com).

## Apa yang Baru

Inertia.js v2.0 adalah langkah maju besar untuk Inertia! Inti *library* telah ditulis ulang secara arsitektural untuk mendukung permintaan *asynchronous*, memungkinkan serangkaian fitur baru, termasuk:

- [Polling](/polling)
- [Prefetching](/prefetching)
- [Deferred props](/deferred-props)
- [Infinite scrolling](/merging-props)
- [Lazy loading data on scroll](/load-when-visible)

Selain itu, untuk proyek sensitif keamanan, Inertia sekarang menawarkan [history encryption API](/history-encryption), memungkinkan Anda menghapus data halaman dari status riwayat saat keluar dari aplikasi.

## Pembaruan *Dependencies*

Untuk memutakhirkan ke Inertia.js v2.0, gunakan *npm* terlebih dahulu untuk menginstal *adapter* sisi *client* pilihan Anda:

<Tabs groupId="package-manager" defaultValue="vue" values={[
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
]}>
  <TabItem value="vue">

  ```bash
  npm install @inertiajs/vue3@^2.0
  ```

  </TabItem>
  <TabItem value="react">

  ```bash
  npm install @inertiajs/react@^2.0
  ```

  </TabItem>
  <TabItem value="svelte">

  ```bash
  npm install @inertiajs/svelte@^2.0
  ```

  </TabItem>
</Tabs>

Selanjutnya, perbarui paket `inertiajs/inertia-laravel` untuk menggunakan *branch* dev `2.x`:

```bash
composer require inertiajs/inertia-laravel:^2.0
```

## *Breaking Changes*

Meskipun rilis yang signifikan, Inertia.js v2.0 tidak memperkenalkan banyak *breaking changes*. Berikut adalah daftar semua *breaking changes*:

### Dihentikannya dukungan Laravel 8 dan 9

*Adapter* Laravel sekarang memerlukan Laravel 10 dan PHP 8.1 sebagai minimum.

### Dihentikannya dukungan Vue 2

*Adapter* Vue 2 telah dihapus. Vue 2 mencapai **End of Life** pada 3 Desember 2023, jadi ini terasa sudah waktunya.

### Metode `replace` *Router*

Metode `router.replace` yang sebelumnya *deprecated* telah diaktifkan kembali, tetapi fungsinya berubah. Sekarang digunakan untuk membuat [*page visits* Client Side](/manual-visits#client-side-visits). Untuk membuat *server-side visits* yang mengganti entri riwayat saat ini di *browser*, gunakan opsi `replace`:

<Tabs groupId="framework" defaultValue="vue" values={[
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
]}>
  <TabItem value="vue">

  ```javascript
  router.get('/users', { search: 'John' }, { replace: true })
  ```

  </TabItem>
  <TabItem value="react">

  ```javascript
  router.get('/users', { search: 'John' }, { replace: true })
  ```

  </TabItem>
  <TabItem value="svelte">

  ```javascript
  router.get('/users', { search: 'John' }, { replace: true })
  ```

  </TabItem>
</Tabs>

### *Adapter* Svelte

- Dihentikannya dukungan Svelte 3 karena mencapai **End of Life** pada 20 Juni 2023.
- Helper `remember` telah diganti namanya menjadi `useRemember` untuk konsistensi dengan helper lainnya.
- *Callback* `setup` diperbarui di `app.js`. Anda perlu melewatkan `props` saat menginisialisasi komponen `App`. [Lihat setup di app.js](/client-side-setup#initialize-the-inertia-app)
- *Callback* `setup` sekarang diperlukan di `ssr.js`. [Lihat setup di ssr.js](/server-side-rendering#add-server-entry-point)

### *Partial reloads* sekarang *asynchronous*

Sebelumnya *partial reloads* di Inertia bersifat *synchronous*, seperti semua permintaan Inertia. Di v2.0, *partial reloads* sekarang bersifat *asynchronous*. Umumnya ini diinginkan, tetapi jika Anda bergantung pada permintaan yang bersifat *synchronous*, Anda mungkin perlu menyesuaikan kode Anda.