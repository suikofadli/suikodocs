---
title: Events
---

# Events

Inertia menyediakan sistem event yang memungkinkan Anda untuk "hook into" berbagai lifecycle event dari library.

## Mendaftarkan listeners

Untuk mendaftarkan event listener, gunakan metode `router.on()`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

Di balik layar, Inertia menggunakan event browser native, jadi Anda juga dapat berinteraksi dengan event Inertia menggunakan metode event tipikal yang mungkin sudah Anda kenal - pastikan untuk menambahkan `inertia:` di awal nama event.

Vue:

```js
import { router } from '@inertiajs/vue3'
document.addEventListener('inertia:start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
document.addEventListener('inertia:start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
document.addEventListener('inertia:start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

## Menghapus listeners

Ketika Anda mendaftarkan event listener, Inertia secara otomatis mengembalikan callback yang dapat dipanggil untuk menghapus event listener.

Vue:

```js
import { router } from '@inertiajs/vue3'
let removeStartEventListener = router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
// Hapus listener...
removeStartEventListener()
```

React:

```jsx
import { router } from '@inertiajs/react'
let removeStartEventListener = router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
// Hapus listener...
removeStartEventListener()
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
let removeStartEventListener = router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
// Hapus listener...
removeStartEventListener()
```

Dikombinasikan dengan hooks, Anda dapat secara otomatis menghapus event listener ketika components unmount.

Vue:

```jsx
import { router } from '@inertiajs/vue3'
import { onUnmounted } from 'vue'

onUnmounted(
    router.on('start', (event) => {
        console.log(`Starting a visit to ${event.detail.visit.url}`)
    })
)
```

React:

```jsx
import { useEffect } from 'react'
import { router } from '@inertiajs/react'

useEffect(() => {
    return router.on('start', (event) => {
        console.log(`Starting a visit to ${event.detail.visit.url}`)
    })
}, [])
```

Svelte 4:

```js
import { router } from '@inertiajs/svelte'
import { onMount } from 'svelte'

onMount(() => {
    return router.on('start', (event) => {
        console.log(`Starting a visit to ${event.detail.visit.url}`)
    })
})
```

Svelte 5:

```js
import { router } from '@inertiajs/svelte'

$effect(() => {
    return router.on('start', (event) => {
        console.log(`Starting a visit to ${event.detail.visit.url}`)
    })
})
```

Sebagai alternatif, jika Anda menggunakan event browser native, Anda dapat menghapus event listener menggunakan `removeEventListener()`.

Vue:

```js
import { router } from '@inertiajs/vue3'
let startEventListener = (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
}
document.addEventListener('inertia:start', startEventListener)
// Hapus listener...
document.removeEventListener('inertia:start', startEventListener)
```

React:

```jsx
import { router } from '@inertiajs/react'
let startEventListener = (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
}
document.addEventListener('inertia:start', startEventListener)
// Hapus listener...
document.removeEventListener('inertia:start', startEventListener)
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
let startEventListener = (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
}
document.addEventListener('inertia:start', startEventListener)
// Hapus listener...
document.removeEventListener('inertia:start', startEventListener)
```

## Membatalkan events

Beberapa event, seperti `before`, `exception`, dan `invalid`, mendukung pembatalan, memungkinkan Anda untuk mencegah perilaku default Inertia. Sama seperti event native, event akan dibatalkan jika hanya satu event listener yang memanggil `event.preventDefault()`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('before', (event) => {
    if (!confirm('Are you sure you want to navigate away?')) {
        event.preventDefault()
    }
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('before', (event) => {
    if (!confirm('Are you sure you want to navigate away?')) {
        event.preventDefault()
    }
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('before', (event) => {
    if (!confirm('Are you sure you want to navigate away?')) {
        event.preventDefault()
    }
})
```

Untuk kemudahan, jika Anda mendaftarkan event listener Anda menggunakan `router.on()`, Anda dapat membatalkan event dengan mengembalikan `false` dari listener.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('before', (event) => {
    return confirm('Are you sure you want to navigate away?')
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('before', (event) => {
    return confirm('Are you sure you want to navigate away?')
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('before', (event) => {
    return confirm('Are you sure you want to navigate away?')
})
```

Perhatikan, browser tidak mengizinkan pembatalan event `popstate` native, jadi mencegah kunjungan history maju dan mundur saat menggunakan Inertia.js tidak dimungkinkan.

## Before

Event `before` aktif ketika permintaan akan dibuat ke server. Ini berguna untuk mencegat kunjungan.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('before', (event) => {
    console.log(`About to make a visit to ${event.detail.visit.url}`)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('before', (event) => {
    console.log(`About to make a visit to ${event.detail.visit.url}`)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('before', (event) => {
    console.log(`About to make a visit to ${event.detail.visit.url}`)
})
```

Tujuan utama dari event ini adalah untuk memungkinkan Anda mencegah kunjungan terjadi.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('before', (event) => {
    return confirm('Are you sure you want to navigate away?')
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('before', (event) => {
    return confirm('Are you sure you want to navigate away?')
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('before', (event) => {
    return confirm('Are you sure you want to navigate away?')
})
```

## Start

Event `start` aktif ketika permintaan ke server telah dimulai. Ini berguna untuk menampilkan loading indicators.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

Event `start` tidak dapat dibatalkan.

## Progress

Event `progress` aktif sebagai peningkatan progress selama upload file.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('progress', (event) => {
    this.form.progress = event.detail.progress.percentage
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('progress', (event) => {
    this.form.progress = event.detail.progress.percentage
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('progress', (event) => {
    this.form.progress = event.detail.progress.percentage
})
```

Event `progress` tidak dapat dibatalkan.

## Success

Event `success` aktif pada kunjungan halaman yang berhasil, kecuali jika ada validation errors. Namun, ini *tidak* termasuk kunjungan history.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('success', (event) => {
    console.log(`Successfully made a visit to ${event.detail.page.url}`)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('success', (event) => {
    console.log(`Successfully made a visit to ${event.detail.page.url}`)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('success', (event) => {
    console.log(`Successfully made a visit to ${event.detail.page.url}`)
})
```

Event `success` tidak dapat dibatalkan.

## Error

Event `error` aktif ketika ada validation errors pada kunjungan halaman yang "berhasil".

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('error', (errors) => {
    console.log(errors)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('error', (errors) => {
    console.log(errors)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('error', (errors) => {
    console.log(errors)
})
```

Event `error` tidak dapat dibatalkan.

## Invalid

Event `invalid` aktif ketika respons non-Inertia diterima dari server, seperti respons HTML atau vanilla JSON. Respons Inertia yang valid adalah respons yang memiliki header `X-Inertia` diatur ke `true` dengan payload `json` yang berisi [page object](/the-protocol#the-page-object).

Event ini aktif untuk semua jenis respons, termasuk kode respons `200`, `400`, dan `500`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('invalid', (event) => {
    console.log(`An invalid Inertia response was received.`)
    console.log(event.detail.response)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('invalid', (event) => {
    console.log(`An invalid Inertia response was received.`)
    console.log(event.detail.response)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('invalid', (event) => {
    console.log(`An invalid Inertia response was received.`)
    console.log(event.detail.response)
})
```

Anda dapat membatalkan event `invalid` untuk mencegah Inertia menampilkan modal respons non-Inertia.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('invalid', (event) => {
    event.preventDefault()
    // Tangani respons tidak valid sendiri...
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('invalid', (event) => {
    event.preventDefault()
    // Tangani respons tidak valid sendiri...
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('invalid', (event) => {
    event.preventDefault()
    // Tangani respons tidak valid sendiri...
})
```

## Exception

Event `exception` aktif pada error XHR yang tidak terduga seperti gangguan jaringan. Selain itu, event ini aktif untuk kesalahan yang dihasilkan saat menyelesaikan page components.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('exception', (event) => {
    console.log(`An unexpected error occurred during an Inertia visit.`)
    console.log(event.detail.error)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('exception', (event) => {
    console.log(`An unexpected error occurred during an Inertia visit.`)
    console.log(event.detail.error)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('exception', (event) => {
    console.log(`An unexpected error occurred during an Inertia visit.`)
    console.log(event.detail.error)
})
```

Anda dapat membatalkan event `exception` untuk mencegah error dilempar.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('exception', (event) => {
    event.preventDefault()
    // Tangani error sendiri
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('exception', (event) => {
    event.preventDefault()
    // Tangani error sendiri
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('exception', (event) => {
    event.preventDefault()
    // Tangani error sendiri
})
```

Event ini *tidak* akan aktif untuk permintaan XHR yang menerima respons level `400` dan `500` atau untuk respons non-Inertia, karena situasi ini ditangani dengan cara lain oleh Inertia. Silakan lihat [dokumentasi error handling](/error-handling) untuk informasi lebih lanjut.

## Finish

Event `finish` aktif setelah permintaan XHR telah selesai untuk respons yang "berhasil" dan "tidak berhasil". Event ini berguna untuk menyembunyikan loading indicators.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('finish', (event) => {
    NProgress.done()
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('finish', (event) => {
    NProgress.done()
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('finish', (event) => {
    NProgress.done()
})
```

Event `finish` tidak dapat dibatalkan.

## Navigate

Event `navigate` aktif pada kunjungan halaman yang berhasil, serta saat menavigasi melalui history.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('navigate', (event) => {
    console.log(`Navigated to ${event.detail.page.url}`)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('navigate', (event) => {
    console.log(`Navigated to ${event.detail.page.url}`)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('navigate', (event) => {
    console.log(`Navigated to ${event.detail.page.url}`)
})
```

Event `navigate` tidak dapat dibatalkan.

## Prefetching

Event `prefetching` aktif ketika router mulai melakukan prefetch halaman.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('prefetching', (event) => {
    console.log(`Prefetching ${event.detail.page.url}`)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('prefetching', (event) => {
    console.log(`Prefetching ${event.detail.page.url}`)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('prefetching', (event) => {
    console.log(`Prefetching ${event.detail.page.url}`)
})
```

Event `prefetching` tidak dapat dibatalkan.

## Prefetched

Event `prefetched` aktif ketika router telah berhasil melakukan prefetch halaman.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.on('prefetched', (event) => {
    console.log(`Prefetched ${event.detail.page.url}`)
})
```

React:

```jsx
import { router } from '@inertiajs/react'
router.on('prefetched', (event) => {
    console.log(`Prefetched ${event.detail.page.url}`)
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.on('prefetched', (event) => {
    console.log(`Prefetched ${event.detail.page.url}`)
})
```

Event `prefetched` tidak dapat dibatalkan.

## Event callbacks

Selain event global yang dijelaskan di seluruh halaman ini, Inertia juga menyediakan sejumlah [event callback](/manual-visits#event-callbacks) yang aktif saat secara manual membuat kunjungan Inertia.