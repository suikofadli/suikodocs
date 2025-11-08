---
sidebar_position: 9
---

# Pengunggahan File

## Konversi FormData

Saat membuat permintaan Inertia yang mencakup file (bahkan file yang bersarang), Inertia akan secara otomatis mengonversi data permintaan menjadi objek `FormData`. Konversi ini diperlukan untuk mengirim permintaan `multipart/form-data` melalui XHR.

Jika Anda ingin permintaan selalu menggunakan objek `FormData` terlepas dari apakah ada file dalam data, Anda dapat memberikan opsi `forceFormData` saat membuat permintaan.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
    forceFormData: true,
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
    forceFormData: true,
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
    forceFormData: true,
})
```

Anda dapat mempelajari lebih lanjut tentang antarmuka `FormData` melalui [dokumentasi MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

Sebelum versi 0.8.0, Inertia tidak mengonversi permintaan secara otomatis menjadi `FormData`. Jika Anda menggunakan rilis Inertia sebelum versi ini, Anda perlu melakukan konversi ini secara manual.

## Contoh pengunggahan file

Mari kita lihat contoh lengkap pengunggahan file menggunakan Inertia. Contoh ini mencakup input teks `name` dan input file `avatar`.

Vue:

```html
<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
    name: null,
    avatar: null,
})

function submit() {
    form.post('/users')
}
</script>

<template>
    <form @submit.prevent="submit">
        <input type="text" v-model="form.name" />
        <input type="file" @input="form.avatar = $event.target.files[0]" />
        <progress v-if="form.progress" :value="form.progress.percentage" max="100">
            {{ form.progress.percentage }}%
        </progress>
        <button type="submit">Submit</button>
    </form>
</template>
```

React:

```jsx
import { useForm } from '@inertiajs/react'

const { data, setData, post, progress } = useForm({
    name: null,
    avatar: null,
})

function submit(e) {
    e.preventDefault()
    post('/users')
}

return (
    <form onSubmit={submit}>
        <input
            type="text"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
        />
        <input
            type="file"
            onChange={e => setData('avatar', e.target.files[0])}
        />
        {progress && (
            <progress value={progress.percentage} max="100">
                {progress.percentage}%
            </progress>
        )}
        <button type="submit">Submit</button>
    </form>
)
```

Svelte 4:

```html
<script>
    import { useForm } from '@inertiajs/svelte'

    const form = useForm({
        name: null,
        avatar: null,
    })

    function submit() {
        $form.post('/users')
    }
</script>

<form on:submit|preventDefault={submit}>
    <input type="text" bind:value={$form.name} />
    <input type="file" on:input={e => $form.avatar = e.target.files[0]} />
    {#if $form.progress}
        <progress value={$form.progress.percentage} max="100">
            {$form.progress.percentage}%
        </progress>
    {/if}
    <button type="submit">Submit</button>
</form>
```

Svelte 5:

```html
<script>
    import { useForm } from '@inertiajs/svelte'

    const form = useForm({
        name: null,
        avatar: null,
    })

    function submit(e) {
        e.preventDefault()
        $form.post('/users')
    }
</script>

<form onsubmit={submit}>
    <input type="text" bind:value={$form.name} />
    <input type="file" oninput={e => $form.avatar = e.target.files[0]} />
    {#if $form.progress}
        <progress value={$form.progress.percentage} max="100">
            {$form.progress.percentage}%
        </progress>
    {/if}
    <button type="submit">Submit</button>
</form>
```

Contoh ini menggunakan [form helper Inertia](/forms#form-helper) untuk kemudahan, karena form helper menyediakan akses mudah ke kemajuan unggahan saat ini. Namun, Anda dapat mengirimkan form Anda menggunakan [kunjungan manual Inertia](/manual-visits) juga.

## Batasan multipart

Pengunggahan file menggunakan permintaan `multipart/form-data` tidak didukung secara asli di beberapa framework sisi server saat menggunakan metode HTTP `PUT`, `PATCH`, atau `DELETE`. Solusi termudah untuk batasan ini adalah dengan mengunggah file menggunakan permintaan `POST` sebagai gantinya.

Namun, beberapa framework seperti [Laravel](https://laravel.com/docs/routing#form-method-spoofing) dan [Rails](https://guides.rubyonrails.org/form_helpers.html#how-do-forms-with-patch-put-or-delete-methods-work-questionmark) mendukung form method spoofing, yang memungkinkan Anda mengunggah file menggunakan `POST`, tetapi framework menangani permintaan sebagai permintaan `PUT` atau `PATCH`. Ini dilakukan dengan menyertakan atribut `_method` dalam data permintaan Anda.

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post(`/users/${user.id}`, { _method: 'PUT' })
```

React:

```js
import { router } from '@inertiajs/react'

router.post(`/users/${user.id}`, { _method: 'PUT' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post(`/users/${user.id}`, { _method: 'PUT' })
```