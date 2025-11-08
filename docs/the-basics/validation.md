---
sidebar_position: 10
---

# Validation

## Cara kerja

Penanganan kesalahan validasi sisi server di Inertia bekerja secara berbeda dengan form XHR klasik. Alih-alih menangkap respons `422`, Inertia beroperasi seperti pengiriman form halaman penuh standar.

Saat terjadi kesalahan validasi, Anda di-redirect kembali ke halaman form dengan kesalahan yang di-flash ke session. Kesalahan ini dibagikan dengan Inertia sebagai page props, membuatnya tersedia di sisi klien.

Inertia memeriksa kesalahan dalam `page.props.errors` dan memanggil `onError()` alih-alih `onSuccess()` saat ada kesalahan.

## Membagikan kesalahan

Adapter first-party Inertia seperti Laravel secara otomatis membagikan kesalahan validasi melalui prop `errors`. Untuk framework lainnya, Anda mungkin perlu melakukan ini secara manual.

## Menampilkan kesalahan

Kesalahan validasi tersedia sebagai page props. Berikut cara menampilkannya di berbagai framework:

Vue:

```html
<script setup>
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'

defineProps({ errors: Object })

const form = reactive({
    first_name: null,
    last_name: null,
    email: null,
})

function submit() {
    router.post('/users', form)
}
</script>

<template>
    <form @submit.prevent="submit">
        <label for="first_name">First name:</label>
        <input id="first_name" v-model="form.first_name" />
        <div v-if="errors.first_name">{{ errors.first_name }}</div>

        <label for="last_name">Last name:</label>
        <input id="last_name" v-model="form.last_name" />
        <div v-if="errors.last_name">{{ errors.last_name }}</div>

        <label for="email">Email:</label>
        <input id="email" v-model="form.email" />
        <div v-if="errors.email">{{ errors.email }}</div>

        <button type="submit">Submit</button>
    </form>
</template>
```

React:

```jsx
import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function Edit() {
    const { errors } = usePage().props

    const [values, setValues] = useState({
        first_name: null,
        last_name: null,
        email: null,
    })

    function handleChange(e) {
        setValues(values => ({
            ...values,
            [e.target.id]: e.target.value,
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        router.post('/users', values)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">First name:</label>
            <input
                id="first_name"
                value={values.first_name}
                onChange={handleChange}
            />
            {errors.first_name && <div>{errors.first_name}</div>}

            <label htmlFor="last_name">Last name:</label>
            <input
                id="last_name"
                value={values.last_name}
                onChange={handleChange}
            />
            {errors.last_name && <div>{errors.last_name}</div>}

            <label htmlFor="email">Email:</label>
            <input
                id="email"
                value={values.email}
                onChange={handleChange}
            />
            {errors.email && <div>{errors.email}</div>}

            <button type="submit">Submit</button>
        </form>
    )
}
```

Svelte:

```html
<script>
    import { router } from '@inertiajs/svelte'

    export let errors = {}

    let values = {
        first_name: null,
        last_name: null,
        email: null,
    }

    function handleSubmit() {
        router.post('/users', values)
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <label for="first_name">First name:</label>
    <input id="first_name" bind:value={values.first_name}>
    {#if errors.first_name}<div>{errors.first_name}</div>{/if}

    <label for="last_name">Last name:</label>
    <input id="last_name" bind:value={values.last_name}>
    {#if errors.last_name}<div>{errors.last_name}</div>{/if}

    <label for="email">Email:</label>
    <input id="email" bind:value={values.email}>
    {#if errors.email}<div>{errors.email}</div>{/if}

    <button type="submit">Submit</button>
</form>
```

## Mengisi ulang input

Inertia secara otomatis mempertahankan state komponen untuk permintaan `post`, `put`, `patch`, dan `delete`. Jadi data form tetap seperti apa adanya saat terjadi kesalahan validasi.

## Error bags

Untuk halaman dengan multiple form yang memiliki nama field yang sama, Anda dapat menggunakan "error bags" untuk membatasi kesalahan validasi:

Vue:

```js
import { router } from '@inertiajs/vue3'

router.post('/companies', data, {
    errorBag: 'createCompany',
})

router.post('/users', data, {
    errorBag: 'createUser',
})
```

React:

```js
import { router } from '@inertiajs/react'

router.post('/companies', data, {
    errorBag: 'createCompany',
})

router.post('/users', data, {
    errorBag: 'createUser',
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'

router.post('/companies', data, {
    errorBag: 'createCompany',
})

router.post('/users', data, {
    errorBag: 'createUser',
})
```

Kesalahan akan tersedia di `page.props.errors.createCompany` dan `page.props.errors.createUser` secara berturut-turut.