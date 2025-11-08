---
sidebar_position: 3
---

# Panduan Upgrade untuk v2.0

Anda dapat menemukan dokumentasi warisan untuk Inertia.js v1.0 di [v1.inertiajs.com](https://v1.inertiajs.com).

## Apa yang Baru

Inertia.js v2.0 adalah langkah maju besar untuk Inertia! Inti library telah ditulis ulang secara arsitektural untuk mendukung permintaan asinkron, memungkinkan serangkaian fitur baru, termasuk:

- [Polling](/polling)
- [Prefetching](/prefetching)
- [Props tertunda](/deferred-props)
- [Scrolling tak terbatas](/merging-props)
- [Muat data malas saat scroll](/load-when-visible)

Selain itu, untuk proyek sensitif keamanan, Inertia sekarang menawarkan API enkripsi riwayat, memungkinkan Anda menghapus data halaman dari status riwayat saat keluar dari aplikasi.

## Pembaruan Dependencies

Untuk memutakhirkan ke Inertia.js v2.0, gunakan npm terlebih dahulu untuk menginstal adapter sisi klien pilihan Anda:

Vue:
```bash
npm install @inertiajs/vue3@^2.0
```

React:
```bash
npm install @inertiajs/react@^2.0
```

Svelte:
```bash
npm install @inertiajs/svelte@^2.0
```

Selanjutnya, perbarui paket `inertiajs/inertia-laravel` untuk menggunakan cabang dev `2.x`:

Laravel:
```bash
composer require inertiajs/inertia-laravel:^2.0
```

## Perubahan Pemecah

Meskipun rilis yang signifikan, Inertia.js v2.0 tidak memperkenalkan banyak perubahan pemecah. Berikut adalah daftar semua perubahan pemecah:

### Dihentikannya dukungan Laravel 8 dan 9

Adapter Laravel sekarang memerlukan Laravel 10 dan PHP 8.1 sebagai minimum.

### Dihentikannya dukungan Vue 2

Adapter Vue 2 telah dihapus. Vue 2 mencapai Akhir Hidup pada 3 Desember 2023, jadi ini terasa sudah waktunya.

### Metode `replace` Router

Metode `router.replace` yang sebelumnya tidak digunakan lagi telah diaktifkan kembali, tetapi fungsinya berubah. Sekarang digunakan untuk membuat kunjungan halaman [Sisi Klien](/manual-visits#client-side-visits). Untuk membuat kunjungan sisi server yang mengganti entri riwayat saat ini di browser, gunakan opsi `replace`:

Vue:
```javascript
router.get('/users', { search: 'John' }, { replace: true })
```

### Adapter Svelte

- Dihentikannya dukungan Svelte 3 karena mencapai Akhir Hidup pada 20 Juni 2023.
- Helper `remember` telah diganti namanya menjadi `useRemember` untuk konsistensi dengan helper lainnya.
- Callback `setup` diperbarui di `app.js`. Anda perlu melewatkan `props` saat menginisialisasi komponen `App`. [Lihat setup di app.js](/client-side-setup#initialize-the-inertia-app)
- Callback `setup` sekarang diperlukan di `ssr.js`. [Lihat setup di ssr.js](/server-side-rendering#add-server-entry-point)

### Reload parsial sekarang asinkron

Sebelumnya reload parsial di Inertia bersifat sinkron, seperti semua permintaan Inertia. Di v2.0, reload parsial sekarang bersifat asinkron. Umumnya ini diinginkan, tetapi jika Anda bergantung pada permintaan yang bersifat sinkron, Anda mungkin perlu menyesuaikan kode Anda.