---
sidebar_position: 7
---

# Manual Visits

Selain [membuat link](/links), Anda juga dapat secara manual membuat kunjungan/permintaan Inertia secara programatis melalui JavaScript. Ini dilakukan melalui metode `router.visit()`.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.visit(url, {
    method: 'get',
    data: {},
    replace: false,
    preserveState: false,
    preserveScroll: false,
    only: [],
    except: [],
    headers: {},
    errorBag: null,
    forceFormData: false,
    queryStringArrayFormat: 'brackets',
    async: false,
    showProgress: true,
    fresh: false,
    reset: [],
    preserveUrl: false,
    prefetch: false,
    viewTransition: false,
    onCancelToken: cancelToken => {},
    onCancel: () => {},
    onBefore: visit => {},
    onStart: visit => {},
    onProgress: progress => {},
    onSuccess: page => {},
    onError: errors => {},
    onFinish: visit => {},
    onPrefetching: () => {},
    onPrefetched: () => {},
})
```

React:

```js
import { router } from '@inertiajs/react'

router.visit(url, {
    method: 'get',
    data: {},
    replace: false,
    preserveState: false,
    preserveScroll: false,
    only: [],
    except: [],
    headers: {},
    errorBag: null,
    forceFormData: false,
    queryStringArrayFormat: 'brackets',
    async: false,
    showProgress: true,
    fresh: false,
    reset: [],
    preserveUrl: false,
    prefetch: false,
    viewTransition: false,
    onCancelToken: cancelToken => {},
    onCancel: () => {},
    onBefore: visit => {},
    onStart: visit => {},
    onProgress: progress => {},
    onSuccess: page => {},
    onError: errors => {},
    onFinish: visit => {},
    onPrefetching: () => {},
    onPrefetched: () => {},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.visit(url, {
    method: 'get',
    data: {},
    replace: false,
    preserveState: false,
    preserveScroll: false,
    only: [],
    except: [],
    headers: {},
    errorBag: null,
    forceFormData: false,
    queryStringArrayFormat: 'brackets',
    async: false,
    showProgress: true,
    fresh: false,
    reset: [],
    preserveUrl: false,
    prefetch: false,
    viewTransition: false,
    onCancelToken: cancelToken => {},
    onCancel: () => {},
    onBefore: visit => {},
    onStart: visit => {},
    onProgress: progress => {},
    onSuccess: page => {},
    onError: errors => {},
    onFinish: visit => {},
    onPrefetching: () => {},
    onPrefetched: () => {},
})
```

Namun, umumnya lebih nyaman menggunakan salah satu metode permintaan singkat Inertia. Metode ini berbagi semua opsi yang sama dengan `router.visit()`.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Menggunakan URL saat ini
```

React:

```js
import { router } from '@inertiajs/react'

router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Menggunakan URL saat ini
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Menggunakan URL saat ini
```

Metode `reload()` adalah metode singkat yang mudah yang secara otomatis mengunjungi halaman saat ini dengan `preserveState` dan `preserveScroll` keduanya diatur ke `true`, membuatnya menjadi metode sempurna untuk dipanggil saat Anda hanya ingin memuat ulang data halaman saat ini.

## Method

Saat melakukan kunjungan manual, Anda dapat menggunakan opsi `method` untuk mengatur metode HTTP permintaan menjadi `get`, `post`, `put`, `patch`, atau `delete`. Metode default adalah `get`.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.visit(url, { method: 'post' })
```

React:

```js
import { router } from '@inertiajs/react'

router.visit(url, { method: 'post' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.visit(url, { method: 'post' })
```

Mengunggah file melalui `put` atau `patch` tidak didukung di Laravel. Sebagai gantinya, buat permintaan melalui `post`, termasuk field `_method` yang diatur ke `put` atau `patch`. Ini disebut [form method spoofing](https://laravel.com/docs/routing#form-method-spoofing).

## Wayfinder

<minimumversion version="2.1.2"></minimumversion>

Saat menggunakan [Wayfinder](https://github.com/laravel/wayfinder), Anda dapat melewatkan objek hasil langsung ke metode router apa pun. Router akan menyimpulkan metode HTTP dan URL dari objek Wayfinder.

Vue:

```js
import { router } from '@inertiajs/vue3'
import { show } from 'App/Http/Controllers/UserController'

router.visit(show(1))
router.post(store())
router.delete(destroy(1))
```

React:

```js
import { router } from '@inertiajs/react'
import { show } from 'App/Http/Controllers/UserController'

router.visit(show(1))
router.post(store())
router.delete(destroy(1))
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
import { show } from 'App/Http/Controllers/UserController'

router.visit(show(1))
router.post(store())
router.delete(destroy(1))
```

Jika Anda memberikan objek Wayfinder dan menentukan opsi `method`, opsi `method` akan diutamakan.

Vue:

```js
import { router } from '@inertiajs/vue3'
import { update } from 'App/Http/Controllers/UserController'

router.visit(update(1), { method: 'patch' })
```

React:

```js
import { router } from '@inertiajs/react'
import { update } from 'App/Http/Controllers/UserController'

router.visit(update(1), { method: 'patch' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
import { update } from 'App/Http/Controllers/UserController'

router.visit(update(1), { method: 'patch' })
```

## Data

Anda dapat menggunakan opsi `data` untuk menambahkan data ke permintaan.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.visit('/users', {
    method: 'post',
    data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
    },
})
```

React:

```js
import { router } from '@inertiajs/react'

router.visit('/users', {
    method: 'post',
    data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
    },
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.visit('/users', {
    method: 'post',
    data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
    },
})
```

Untuk kemudahan, metode `get()`, `post()`, `put()`, dan `patch()` semua menerima `data` sebagai argumen kedua.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/users', {
    name: 'John Doe',
    email: 'john.doe@example.com',
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/users', {
    name: 'John Doe',
    email: 'john.doe@example.com',
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/users', {
    name: 'John Doe',
    email: 'john.doe@example.com',
})
```

## Custom headers

Opsi `headers` memungkinkan Anda menambahkan header khusus ke permintaan.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
    headers: {
        'Custom-Header': 'value',
    },
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
    headers: {
        'Custom-Header': 'value',
    },
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
    headers: {
        'Custom-Header': 'value',
    },
})
```

Header yang digunakan Inertia secara internal untuk mengkomunikasikan statusnya ke server memiliki prioritas dan karenanya tidak dapat ditimpa.

## Global visit options

Anda dapat mengonfigurasi callback `visitOptions` saat [menginisialisasi aplikasi Inertia Anda](/client-side-setup#configuring-defaults) untuk memodifikasi opsi kunjungan secara global untuk setiap permintaan. Callback menerima URL target dan opsi kunjungan saat ini, dan harus mengembalikan objek dengan opsi apa pun yang ingin Anda timpa.

Vue:

```js
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'

createInertiaApp({
    // ...
    defaults: {
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

React:

```jsx
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
    // ...
    defaults: {
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

Svelte:

```js
import { createInertiaApp } from '@inertiajs/svelte'

createInertiaApp({
    // ...
    defaults: {
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

## File uploads

Saat melakukan kunjungan/permintaan yang menyertakan file, Inertia akan secara otomatis mengubah data permintaan menjadi objek `FormData`. Jika Anda ingin permintaan selalu menggunakan objek `FormData`, Anda dapat menggunakan opsi `forceFormData`.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/companies', data, {
    forceFormData: true,
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/companies', data, {
    forceFormData: true,
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/companies', data, {
    forceFormData: true,
})
```

Untuk informasi lebih lanjut tentang mengunggah file, lihat dokumentasi khusus [file uploads](/file-uploads).

## Browser history

Saat melakukan kunjungan, Inertia secara otomatis menambahkan entri baru ke browser history. Namun, dimungkinkan juga untuk mengganti entri history saat ini dengan mengatur opsi `replace` ke `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.get('/users', { search: 'John' }, { replace: true })
```

React:

```js
import { router } from '@inertiajs/react'

router.get('/users', { search: 'John' }, { replace: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.get('/users', { search: 'John' }, { replace: true })
```

Kunjungan yang dilakukan ke URL yang sama secara otomatis mengatur `replace` ke `true`.

## Client side visits

Anda dapat menggunakan metode `router.push` dan `router.replace` untuk melakukan kunjungan sisi klien. Metode ini berguna saat Anda ingin memperbarui browser history tanpa membuat permintaan server.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.push({
    url: '/users',
    component: 'Users',
    props: { search: 'John' },
    clearHistory: false,
    encryptHistory: false,
    preserveScroll: false,
    preserveState: false,
    errorBag: null,
    onSuccess: (page) => {},
    onError: (errors) => {},
    onFinish: (visit) => {},
})
```

React:

```js
import { router } from '@inertiajs/react'

router.push({
    url: '/users',
    component: 'Users',
    props: { search: 'John' },
    clearHistory: false,
    encryptHistory: false,
    preserveScroll: false,
    preserveState: false,
    errorBag: null,
    onSuccess: (page) => {},
    onError: (errors) => {},
    onFinish: (visit) => {},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.push({
    url: '/users',
    component: 'Users',
    props: { search: 'John' },
    clearHistory: false,
    encryptHistory: false,
    preserveScroll: false,
    preserveState: false,
    errorBag: null,
    onSuccess: (page) => {},
    onError: (errors) => {},
    onFinish: (visit) => {},
})
```

Semua parameter bersifat opsional. Secara default, semua parameter yang dilewatkan (kecuali `errorBag`) akan digabung dengan halaman saat ini. Ini berarti Anda bertanggung jawab untuk menimpa URL, komponen, dan props halaman saat ini.

Jika Anda memerlukan akses ke props halaman saat ini, Anda dapat melewatkan fungsi ke opsi props. Fungsi ini akan menerima props halaman saat ini sebagai argumen dan harus mengembalikan props baru.

Opsi `errorBag` memungkinkan Anda menentukan error bag mana yang akan digunakan saat menangani kesalahan validasi dalam callback `onError`.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.push({ url: '/users', component: 'Users' })
router.replace({
    props: (currentProps) => ({ ...currentProps, search: 'John' })
})
```

React:

```js
import { router } from '@inertiajs/react'

router.push({ url: '/users', component: 'Users' })
router.replace({
    props: (currentProps) => ({ ...currentProps, search: 'John' })
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.push({ url: '/users', component: 'Users' })
router.replace({
    props: (currentProps) => ({ ...currentProps, search: 'John' })
})
```

Pastikan rute apa pun yang Anda push di sisi klien juga didefinisikan di sisi server. Jika pengguna me-refresh halaman, server perlu tahu cara merender halaman.

### Prop helpers

Inertia menyediakan tiga metode helper untuk memperbarui props halaman tanpa membuat permintaan server. Metode ini adalah pintasan ke `router.replace()` dan secara otomatis mengatur `preserveScroll` dan `preserveState` ke `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'

// Mengganti nilai prop...
router.replaceProp('user.name', 'Jane Smith')

// Menambahkan ke prop array...
router.appendToProp('messages', { id: 4, text: 'Pesan baru' })

// Menambahkan ke awal prop array...
router.prependToProp('tags', 'urgent')
```

React:

```js
import { router } from '@inertiajs/react'

// Mengganti nilai prop...
router.replaceProp('user.name', 'Jane Smith')

// Menambahkan ke prop array...
router.appendToProp('messages', { id: 4, text: 'Pesan baru' })

// Menambahkan ke awal prop array...
router.prependToProp('tags', 'urgent')
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

// Mengganti nilai prop...
router.replaceProp('user.name', 'Jane Smith')

// Menambahkan ke prop array...
router.appendToProp('messages', { id: 4, text: 'Pesan baru' })

// Menambahkan ke awal prop array...
router.prependToProp('tags', 'urgent')
```

Ketiga metode mendukung notasi titik untuk props bersarang dan dapat menerima fungsi callback yang menerima nilai saat ini sebagai argumen pertama dan props halaman saat ini sebagai argumen kedua.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.prependToProp('notifications', (current, props) => {
    return {
        id: Date.now(),
        message: `Halo ${props.user.name}`,
    }
})
```

React:

```js
import { router } from '@inertiajs/react'

router.prependToProp('notifications', (current, props) => {
    return {
        id: Date.now(),
        message: `Halo ${props.user.name}`,
    }
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.prependToProp('notifications', (current, props) => {
    return {
        id: Date.now(),
        message: `Halo ${props.user.name}`,
    }
})
```

## State preservation

Secara default, kunjungan halaman ke halaman yang sama membuat instance komponen halaman baru. Ini menyebabkan state lokal apa pun, seperti input form, posisi scroll, dan state fokus hilang.

Namun, dalam beberapa situasi, perlu untuk mempertahankan state komponen halaman. Misalnya, saat mengirimkan form, Anda perlu mempertahankan data form Anda jika validasi form gagal di server.

Untuk alasan ini, metode `post`, `put`, `patch`, `delete`, dan `reload` semua mengatur opsi `preserveState` ke `true` secara default.

Anda dapat menginstruksikan Inertia untuk mempertahankan state komponen saat menggunakan metode `get` dengan mengatur opsi `preserveState` ke `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.get('/users', { search: 'John' }, { preserveState: true })
```

React:

```js
import { router } from '@inertiajs/react'

router.get('/users', { search: 'John' }, { preserveState: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.get('/users', { search: 'John' }, { preserveState: true })
```

Jika Anda hanya ingin mempertahankan state jika respons menyertakan kesalahan validasi, atur opsi `preserveState` ke "errors".

Vue:

```js
import { router } from '@inertiajs/vue3'

router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

React:

```js
import { router } from '@inertiajs/react'

router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

Anda juga dapat mengevaluasi opsi `preserveState` secara malas berdasarkan respons dengan menyediakan callback.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
    preserveState: (page) => page.props.someProp === 'value',
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
    preserveState: (page) => page.props.someProp === 'value',
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
    preserveState: (page) => page.props.someProp === 'value',
})
```

## Scroll preservation

Saat menavigasi antar halaman, Inertia meniru perilaku browser default dengan secara otomatis me-reset posisi scroll dokumen body (serta [scroll regions](/scroll-management#scroll-regions) apa pun yang telah Anda definisikan) kembali ke atas halaman.

Anda dapat menonaktifkan perilaku ini dengan mengatur opsi `preserveScroll` ke `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.visit(url, { preserveScroll: true })
```

React:

```js
import { router } from '@inertiajs/react'

router.visit(url, { preserveScroll: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.visit(url, { preserveScroll: true })
```

Jika Anda hanya ingin mempertahankan posisi scroll jika respons menyertakan kesalahan validasi, atur opsi `preserveScroll` ke "errors".

Vue:

```js
import { router } from '@inertiajs/vue3'

router.visit(url, { preserveScroll: 'errors' })
```

React:

```js
import { router } from '@inertiajs/react'

router.visit(url, { preserveScroll: 'errors' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.visit(url, { preserveScroll: 'errors' })
```

Anda juga dapat mengevaluasi opsi `preserveScroll` secara malas berdasarkan respons dengan menyediakan callback.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
    preserveScroll: (page) => page.props.someProp === 'value',
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
    preserveScroll: (page) => page.props.someProp === 'value',
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
    preserveScroll: (page) => page.props.someProp === 'value',
})
```

Untuk informasi lebih lanjut mengenai fitur ini, silakan konsultasikan dokumentasi [pengelolaan scroll](/scroll-management).

## Partial reloads

Opsi `only` memungkinkan Anda meminta subset dari props (data) dari server pada kunjungan berikutnya ke halaman yang sama, sehingga membuat aplikasi Anda lebih efisien karena tidak perlu mengambil data yang tidak diminati halaman untuk disegarkan.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.get('/users', { search: 'John' }, { only: ['users'] })
```

React:

```js
import { router } from '@inertiajs/react'

router.get('/users', { search: 'John' }, { only: ['users'] })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.get('/users', { search: 'John' }, { only: ['users'] })
```

Untuk informasi lebih lanjut tentang fitur ini, silakan konsultasikan dokumentasi [partial reloads](/partial-reloads).

## View transitions

Anda dapat mengaktifkan [View transitions](/view-transitions) untuk kunjungan dengan mengatur opsi `viewTransition` ke `true`. Ini akan menggunakan View Transitions API browser untuk menganimasikan transisi halaman.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.visit('/another-page', { viewTransition: true })
```

React:

```js
import { router } from '@inertiajs/react'

router.visit('/another-page', { viewTransition: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.visit('/another-page', { viewTransition: true })
```

## Visit cancellation

Anda dapat membatalkan kunjungan menggunakan cancel token, yang secara otomatis dihasilkan dan disediakan Inertia melalui callback `onCancelToken()` sebelum melakukan kunjungan.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
    onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})

// Membatalkan kunjungan...
this.cancelToken.cancel()
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
    onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})

// Membatalkan kunjungan...
this.cancelToken.cancel()
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
    onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})

// Membatalkan kunjungan...
this.cancelToken.cancel()
```

Callback event `onCancel()` dan `onFinish()` akan dieksekusi saat kunjungan dibatalkan.

## Event callbacks

Selain [event global Inertia](/events), Inertia juga menyediakan sejumlah callback event per kunjungan.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
    onBefore: (visit) => {},
    onStart: (visit) => {},
    onProgress: (progress) => {},
    onSuccess: (page) => {},
    onError: (errors) => {},
    onCancel: () => {},
    onFinish: visit => {},
    onPrefetching: () => {},
    onPrefetched: () => {},
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
    onBefore: (visit) => {},
    onStart: (visit) => {},
    onProgress: (progress) => {},
    onSuccess: (page) => {},
    onError: (errors) => {},
    onCancel: () => {},
    onFinish: visit => {},
    onPrefetching: () => {},
    onPrefetched: () => {},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
    onBefore: (visit) => {},
    onStart: (visit) => {},
    onProgress: (progress) => {},
    onSuccess: (page) => {},
    onError: (errors) => {},
    onCancel: () => {},
    onFinish: visit => {},
    onPrefetching: () => {},
    onPrefetched: () => {},
})
```

Mengembalikan `false` dari callback `onBefore()` akan menyebabkan kunjungan dibatalkan.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.delete(`/users/${user.id}`, {
    onBefore: () => {
        if (!confirm('Apakah Anda yakin?')) {
            return false
        }
    }
})
```

React:

```js
import { router } from '@inertiajs/react'

router.delete(`/users/${user.id}`, {
    onBefore: () => {
        if (!confirm('Apakah Anda yakin?')) {
            return false
        }
    }
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.delete(`/users/${user.id}`, {
    onBefore: () => {
        if (!confirm('Apakah Anda yakin?')) {
            return false
        }
    }
})
```

Dimungkinkan juga untuk mengembalikan promise dari callback `onSuccess()` dan `onError()`. Saat melakukannya, event "finish" akan ditunda sampai promise diselesaikan.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post(url, {
    onSuccess: () => {
        return Promise.all([
            this.firstTask(),
            this.secondTask()
        ])
    },
    onFinish: visit => {
        // Tidak dipanggil sampai firstTask() dan secondTask() selesai
    },
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post(url, {
    onSuccess: () => {
        return Promise.all([
            this.firstTask(),
            this.secondTask()
        ])
    },
    onFinish: visit => {
        // Tidak dipanggil sampai firstTask() dan secondTask() selesai
    },
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post(url, {
    onSuccess: () => {
        return Promise.all([
            this.firstTask(),
            this.secondTask()
        ])
    },
    onFinish: visit => {
        // Tidak dipanggil sampai firstTask() dan secondTask() selesai
    },
})
```