---
title: Progress Indicators
---

# Progress Indicators

Karena permintaan Inertia dibuat melalui XHR, biasanya tidak akan ada loading indicator browser saat menavigasi dari satu halaman ke halaman lain. Untuk mengatasi ini, Inertia menampilkan progress indicator di bagian atas halaman setiap kali Anda membuat kunjungan Inertia. Namun, [permintaan asinkron](#visit-options) tidak menunjukkan progress indicator kecuali dikonfigurasi secara eksplisit.

Tentu saja, jika Anda lebih suka, Anda dapat menonaktifkan loading indicator default Inertia dan menyediakan implementasi kustom Anda sendiri. Kami akan membahas kedua pendekatan ini di bawah.

## Default

Progress indicator default Inertia adalah wrapper ringan di sekitar library [NProgress](https://ricostacruz.com/nprogress/). Anda dapat menyesuaikannya melalui properti `progress` dari fungsi `createInertiaApp()`.

```js
createInertiaApp({
    progress: {
        // Penundaan setelah mana progress bar akan muncul, dalam milidetik...
        delay: 250,
        // Warna progress bar...
        color: '#29d',
        // Apakah akan menyertakan style NProgress default...
        includeCSS: true,
        // Apakah spinner NProgress akan ditampilkan...
        showSpinner: false,
    },
    // ...
})
```

Anda dapat menonaktifkan loading indicator default Inertia dengan mengatur properti `progress` ke `false`.

```js
createInertiaApp({
    progress: false,
    // ...
})
```

## Akses programatik

Ketika Anda perlu mengontrol progress indicator di luar permintaan Inertia, misalnya, saat membuat permintaan dengan Axios atau library lain, Anda dapat menggunakan metode progress Inertia secara langsung.

Vue:

```js
import { progress } from '@inertiajs/vue3'
progress.start()      // Mulai animasi progress
progress.set(0.25)    // Atur ke 25% selesai
progress.finish()     // Selesaikan dan fade out
progress.reset()      // Reset ke awal
progress.remove()     // Selesaikan dan hapus dari DOM
progress.hide()       // Sembunyikan progress bar
progress.reveal()     // Tampilkan progress bar
progress.isStarted()  // Mengembalikan boolean
progress.getStatus()  // Mengembalikan persentase saat ini atau null
```

React:

```js
import { progress } from '@inertiajs/react'
progress.start()      // Mulai animasi progress
progress.set(0.25)    // Atur ke 25% selesai
progress.finish()     // Selesaikan dan fade out
progress.reset()      // Reset ke awal
progress.remove()     // Selesaikan dan hapus dari DOM
progress.hide()       // Sembunyikan progress bar
progress.reveal()     // Tampilkan progress bar
progress.isStarted()  // Mengembalikan boolean
progress.getStatus()  // Mengembalikan persentase saat ini atau null
```

Svelte:

```js
import { progress } from '@inertiajs/svelte'
progress.start()      // Mulai animasi progress
progress.set(0.25)    // Atur ke 25% selesai
progress.finish()     // Selesaikan dan fade out
progress.reset()      // Reset ke awal
progress.remove()     // Selesaikan dan hapus dari DOM
progress.hide()       // Sembunyikan progress bar
progress.reveal()     // Tampilkan progress bar
progress.isStarted()  // Mengembalikan boolean
progress.getStatus()  // Mengembalikan persentase saat ini atau null
```

Metode `hide()` dan `reveal()` bekerja sama untuk mencegah konflik ketika bagian terpisah dari kode Anda perlu mengontrol visibilitas progress. Setiap panggilan `hide()` menambah penghitung internal, sementara `reveal()` menguranginya. Progress bar hanya muncul ketika penghitung ini mencapai nol.

Namun, `reveal()` menerima parameter `force` opsional yang melewati penghitung ini. Inertia menggunakan pola ini secara internal untuk menyembunyikan progress selama prefetching sambil memastikan itu muncul untuk navigasi aktual.

```js
progress.hide()    // Counter = 1, bar disembunyikan
progress.hide()    // Counter = 2, bar masih disembunyikan
progress.reveal()  // Counter = 1, bar masih disembunyikan
progress.reveal()  // Counter = 0, bar sekarang terlihat
// Force reveal melewati counter
progress.reveal(true)
```

Jika Anda telah menonaktifkan progress indicator dengan `progress: false` di `createInertiaApp()`, metode programatik ini tidak akan berfungsi.

## Kustom

Dimungkinkan juga untuk mengatur page loading indicator kustom Anda sendiri menggunakan [event](/events) Inertia. Mari kita jelajahi cara melakukan ini menggunakan library [NProgress](https://ricostacruz.com/nprogress/) sebagai contoh.

Pertama, nonaktifkan loading indicator default Inertia.

```js
createInertiaApp({
    progress: false,
    // ...
})
```

Selanjutnya, instal library NProgress.

```bash
npm install nprogress
```

Setelah instalasi, Anda perlu menambahkan [style](https://github.com/rstacruz/nprogress/blob/master/nprogress.css) NProgress ke proyek Anda. Anda dapat melakukan ini menggunakan salinan style yang di-host CDN.

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />
```

Kemudian, impor `NProgress` dan Inertia `router` ke aplikasi Anda.

Vue:

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/vue3'
```

React:

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/react'
```

Svelte:

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/svelte'
```

Selanjutnya, tambahkan event listener `start`. Kami akan menggunakan listener ini untuk menampilkan progress bar ketika kunjungan Inertia baru dimulai.

```js
router.on('start', () => NProgress.start())
```

Terakhir, tambahkan event listener `finish` untuk menyembunyikan progress bar ketika kunjungan halaman selesai.

```js
router.on('finish', () => NProgress.done())
```

Itu saja! Sekarang, saat Anda menavigasi dari satu halaman ke halaman lain, progress bar akan ditambahkan dan dihapus dari halaman.

### Menangani kunjungan yang dibatalkan

Meskipun implementasi progress kustom ini berfungsi dengan baik untuk kunjungan halaman yang selesai dengan benar, akan lebih baik untuk juga menangani kunjungan yang dibatalkan. Pertama, untuk kunjungan yang terputus (yang dibatalkan sebagai akibat dari kunjungan baru), progress bar harus direset kembali ke posisi awal. Kedua, untuk kunjungan yang dibatalkan secara manual, progress bar harus segera dihapus dari halaman.

Kita dapat melakukan ini dengan memeriksa objek `event.detail.visit` yang disediakan ke event finish.

```js
router.on('finish', (event) => {
    if (event.detail.visit.completed) {
        NProgress.done()
    } else if (event.detail.visit.interrupted) {
        NProgress.set(0)
    } else if (event.detail.visit.cancelled) {
        NProgress.done()
        NProgress.remove()
    }
})
```

### Progress upload file

Mari kita ambil ini lebih jauh. Ketika file sedang diupload, akan lebih baik untuk memperbarui loading indicator untuk mencerminkan progress upload. Ini dapat dilakukan menggunakan event `progress`.

```js
router.on('progress', (event) => {
    if (event.detail.progress.percentage) {
        NProgress.set((event.detail.progress.percentage / 100) * 0.9)
    }
})
```

Sekarang, sebagai ganti progress bar "menetes" saat file sedang diupload, itu akan benar-benar memperbarui posisinya berdasarkan progress dari permintaan. Kami membatasi progress di sini hingga 90%, karena kami masih perlu menunggu respons dari server.

### Penundaan loading indicator

Hal terakhir yang akan kami implementasikan adalah penundaan loading indicator. Seringkali lebih baik untuk menunda menampilkan loading indicator hingga permintaan telah memakan waktu lebih dari 250-500 milidetik. Ini mencegah loading indicator muncul terus-menerus pada kunjungan halaman cepat, yang dapat mengganggu secara visual.

Untuk mengimplementasikan perilaku penundaan, kami akan menggunakan fungsi `setTimeout` dan `clearTimeout`. Mari kita mulai dengan mendefinisikan variabel untuk melacak timeout.

```js
let timeout = null
```

Selanjutnya, mari kita perbarui event listener `start` untuk memulai timeout baru yang akan menampilkan progress bar setelah 250 milidetik.

```js
router.on('start', () => {
    timeout = setTimeout(() => NProgress.start(), 250)
})
```

Selanjutnya, kami akan memperbarui event listener `finish` untuk membersihkan timeout yang ada jika kunjungan halaman selesai sebelum timeout selesai.

```js
router.on('finish', (event) => {
    clearTimeout(timeout)
    // ...
})
```

Di event listener `finish`, kami perlu menentukan apakah progress bar benar-benar telah mulai menampilkan progress, jika tidak kami akan tanpa sengaja menyebabkannya muncul sebelum timeout selesai.

```js
router.on('finish', (event) => {
    clearTimeout(timeout)
    if (!NProgress.isStarted()) {
        return
    }
    // ...
})
```

Dan, terakhir, kami perlu melakukan pemeriksaan yang sama di event listener `progress`.

```js
router.on('progress', event => {
    if (!NProgress.isStarted()) {
        return
    }
    // ...
})
```

Itu saja, Anda sekarang memiliki page loading indicator kustom yang indah!

### Contoh lengkap

Untuk kemudahan, berikut adalah kode sumber lengkap dari versi final loading indicator kustom kami.

Vue:

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/vue3'

let timeout = null

router.on('start', () => {
    timeout = setTimeout(() => NProgress.start(), 250)
})

router.on('progress', (event) => {
    if (NProgress.isStarted() && event.detail.progress.percentage) {
        NProgress.set((event.detail.progress.percentage / 100) * 0.9)
    }
})

router.on('finish', (event) => {
    clearTimeout(timeout)
    if (!NProgress.isStarted()) {
        return
    } else if (event.detail.visit.completed) {
        NProgress.done()
    } else if (event.detail.visit.interrupted) {
        NProgress.set(0)
    } else if (event.detail.visit.cancelled) {
        NProgress.done()
        NProgress.remove()
    }
})
```

React:

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/react'

let timeout = null

router.on('start', () => {
    timeout = setTimeout(() => NProgress.start(), 250)
})

router.on('progress', (event) => {
    if (NProgress.isStarted() && event.detail.progress.percentage) {
        NProgress.set((event.detail.progress.percentage / 100) * 0.9)
    }
})

router.on('finish', (event) => {
    clearTimeout(timeout)
    if (!NProgress.isStarted()) {
        return
    } else if (event.detail.visit.completed) {
        NProgress.done()
    } else if (event.detail.visit.interrupted) {
        NProgress.set(0)
    } else if (event.detail.visit.cancelled) {
        NProgress.done()
        NProgress.remove()
    }
})
```

Svelte:

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/svelte'

let timeout = null

router.on('start', () => {
    timeout = setTimeout(() => NProgress.start(), 250)
})

router.on('progress', (event) => {
    if (NProgress.isStarted() && event.detail.progress.percentage) {
        NProgress.set((event.detail.progress.percentage / 100) * 0.9)
    }
})

router.on('finish', (event) => {
    clearTimeout(timeout)
    if (!NProgress.isStarted()) {
        return
    } else if (event.detail.visit.completed) {
        NProgress.done()
    } else if (event.detail.visit.interrupted) {
        NProgress.set(0)
    } else if (event.detail.visit.cancelled) {
        NProgress.done()
        NProgress.remove()
    }
})
```

## Visit Options

Selain konfigurasi ini, Inertia.js menyediakan dua opsi kunjungan untuk mengontrol loading indicator per-permintaan: `showProgress` dan `async`. Opsi ini menawarkan kontrol lebih besar atas bagaimana Inertia.js menangani permintaan asinkron dan mengelola progress indicators.

### showProgress

Opsi `showProgress` menyediakan kontrol halus atas visibilitas loading indicator selama permintaan.

```js
router.get('/settings', {}, { showProgress: false })
```

### async

Opsi `async` memungkinkan Anda melakukan permintaan asinkron tanpa menampilkan progress indicator default. Ini dapat digunakan dalam kombinasi dengan opsi `showProgress`.

```js
// Nonaktifkan progress indicator
router.get('/settings', {}, { async: true })
// Aktifkan progress indicator dengan permintaan async
router.get('/settings', {}, { async: true, showProgress: true })
```