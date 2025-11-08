---
sidebar_position: 8
---

# Forms

Inertia menyediakan dua cara utama untuk membangun form: komponen `<Form>` dan helper `useForm`. Keduanya mengintegrasikan dengan validasi server-side framework Anda dan menangani pengiriman form tanpa reload halaman penuh.

## Komponen Form

Inertia menyediakan komponen `<Form>` yang berfungsi seperti HTML form klasik, tetapi menggunakan Inertia di bawah tenda untuk menghindari reload halaman penuh. Ini adalah cara termudah untuk memulai dengan form di Inertia.

Vue:

```html
<script setup>
import { Form } from '@inertiajs/vue3'
</script>

<template>
    <Form action="/users" method="post">
        <input type="text" name="name" />
        <input type="email" name="email" />
        <button type="submit">Create User</button>
    </Form>
</template>
```

React:

```jsx
import { Form } from '@inertiajs/react'

export default () => (
    <Form action="/users" method="post">
        <input type="text" name="name" />
        <input type="email" name="email" />
        <button type="submit">Create User</button>
    </Form>
)
```

Svelte:

```html
<script>
    import { Form } from '@inertiajs/svelte'
</script>

<Form action="/users" method="post">
    <input type="text" name="name" />
    <input type="email" name="email" />
    <button type="submit">Create User</button>
</Form>
```

Seperti form HTML tradisional, tidak perlu melampirkan <vue>`v-model`</vue><react>`onChange` handler</react><svelte>`bind:`</svelte> ke field input Anda, cukup beri setiap input atribut `name` <react>dan `defaultValue` (jika berlaku)</react> dan komponen `Form` akan menangani pengiriman data untuk Anda.

Komponen juga mendukung struktur data bersarang, unggahan file, dan notasi kunci berpoin.

Vue:

```html
<Form action="/reports" method="post">
    <input type="text" name="name" />
    <textarea name="report[description]"></textarea>
    <input type="text" name="report[tags][]" />
    <input type="file" name="documents" multiple />
    <button type="submit">Create Report</button>
</Form>
```

React:

```jsx
<Form action="/reports" method="post">
    <input type="text" name="name" />
    <textarea name="report[description]"></textarea>
    <input type="text" name="report[tags][]" />
    <input type="file" name="documents" multiple />
    <button type="submit">Create Report</button>
</Form>
```

Svelte:

```html
<Form action="/reports" method="post">
    <input type="text" name="name" />
    <textarea name="report[description]"></textarea>
    <input type="text" name="report[tags][]" />
    <input type="file" name="documents" multiple />
    <button type="submit">Create Report</button>
</Form>
```

Anda dapat melewatkan prop `transform` untuk memodifikasi data form sebelum pengiriman. Ini berguna untuk menyuntikkan bidang tambahan atau mentransformasi data yang ada, meskipun input tersembunyi juga berfungsi.

Vue:

```html
<Form
    action="/posts"
    method="post"
    :transform="data => ({ ...data, user_id: 123 })"
>
    <input type="text" name="title" />
    <button type="submit">Create Post</button>
</Form>
```

React:

```jsx
<Form
    action="/posts"
    method="post"
    transform={data => ({ ...data, user_id: 123 })}
>
    <input type="text" name="title" />
    <button type="submit">Create Post</button>
</Form>
```

Svelte:

```html
<Form
    action="/posts"
    method="post"
    transform={data => ({ ...data, user_id: 123 })}
>
    <input type="text" name="title" />
    <button type="submit">Create Post</button>
</Form>
```

### Wayfinder

Saat menggunakan [Wayfinder](https://github.com/laravel/wayfinder), Anda dapat melewatkan objek hasil langsung ke prop `action`. Komponen Form akan menebak metode HTTP dan URL dari objek Wayfinder.

Vue:

```html
<script setup>
import { Form } from '@inertiajs/vue3'
import { store } from 'App/Http/Controllers/UserController'
</script>

<template>
    <Form :action="store()">
        <input type="text" name="name" />
        <input type="email" name="email" />
        <button type="submit">Create User</button>
    </Form>
</template>
```

React:

```jsx
import { Form } from '@inertiajs/react'
import { store } from 'App/Http/Controllers/UserController'

export default () => (
    <Form action={store()}>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <button type="submit">Create User</button>
    </Form>
)
```

Svelte:

```html
<script>
    import { Form } from '@inertiajs/svelte'
    import { store } from 'App/Http/Controllers/UserController'
</script>

<Form action={store()}>
    <input type="text" name="name" />
    <input type="email" name="email" />
    <button type="submit">Create User</button>
</Form>
```

### Nilai default

Anda dapat menetapkan nilai default untuk input form menggunakan atribut HTML standar. Gunakan <react>`defaultValue`</react><vue>`defaultValue`</vue><svelte>`value`</svelte> untuk input teks dan textarea, dan <react>`defaultChecked`</react><vue>`defaultChecked`</vue><svelte>`checked`</svelte> untuk checkbox dan radio.

Vue:

```html
<Form action="/users" method="post">
    <input type="text" name="name" defaultValue="John Doe" />
    <select name="country">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk" selected>United Kingdom</option>
    </select>
    <input type="checkbox" name="subscribe" value="yes" defaultChecked />
    <button type="submit">Submit</button>
</Form>
```

React:

```jsx
<Form action="/users" method="post">
    <input type="text" name="name" defaultValue="John Doe" />
    <select name="country" defaultValue="uk">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
    </select>
    <input type="checkbox" name="subscribe" value="yes" defaultChecked />
    <button type="submit">Submit</button>
</Form>
```

Svelte:

```html
<Form action="/users" method="post">
    <input type="text" name="name" value="John Doe" />
    <select name="country" value="uk">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
    </select>
    <input type="checkbox" name="subscribe" value="yes" checked />
    <button type="submit">Submit</button>
</Form>
```

### Input checkbox

Saat bekerja dengan checkbox, Anda mungkin ingin menambahkan atribut `value` eksplisit seperti `value="1"`. Tanpa atribut value, checkbox yang dicentang akan dikirim sebagai `"on"`, yang beberapa aturan validasi sisi server mungkin tidak mengenali sebagai nilai boolean yang tepat.

### Props dan opsi

Selain `action` dan `method`, komponen `<Form>` menerima beberapa prop. Banyak dari mereka identik dengan opsi yang tersedia dalam opsi visit Inertia [visit options](/manual-visits).

Vue:

```html
<Form
    action="/profile"
    method="put"
    error-bag="profile"
    query-string-array-format="indices"
    :headers="{ 'X-Custom-Header': 'value' }"
    :show-progress="false"
    :transform="data => ({ ...data, timestamp: Date.now() })"
    :invalidate-cache-tags="['users', 'dashboard']"
    disable-while-processing
    :options="{
        preserveScroll: true,
        preserveState: true,
        preserveUrl: true,
        replace: true,
        only: ['users', 'flash'],
        except: ['secret'],
        reset: ['page'],
    }"
>
    <input type="text" name="name" />
    <button type="submit">Update</button>
</Form>
```

React:

```jsx
<Form
    action="/profile"
    method="put"
    errorBag="profile"
    queryStringArrayFormat="indices"
    headers={{ 'X-Custom-Header': 'value' }}
    showProgress={false}
    transform={data => ({ ...data, timestamp: Date.now() })}
    invalidateCacheTags={['users', 'dashboard']}
    disableWhileProcessing
    options={{
        preserveScroll: true,
        preserveState: true,
        preserveUrl: true,
        replace: true,
        only: ['users', 'flash'],
        except: ['secret'],
        reset: ['page'],
    }}
>
    <input type="text" name="name" />
    <button type="submit">Update</button>
</Form>
```

Svelte:

```html
<Form
    action="/profile"
    method="put"
    errorBag="profile"
    queryStringArrayFormat="indices"
    headers={{ 'X-Custom-Header': 'value' }}
    showProgress={false}
    transform={data => ({ ...data, timestamp: Date.now() })}
    invalidateCacheTags={['users', 'dashboard']}
    disableWhileProcessing
    options={{
        preserveScroll: true,
        preserveState: true,
        preserveUrl: true,
        replace: true,
        only: ['users', 'flash'],
        except: ['secret'],
        reset: ['page'],
    }}
>
    <input type="text" name="name" />
    <button type="submit">Update</button>
</Form>
```

Beberapa prop sengaja dikelompokkan di bawah `options` bukan sebagai tingkat atas untuk menghindari kebingungan. Misalnya, `only`, `except`, dan `reset` terkait dengan *reload parsial*, bukan *pengiriman parsial*. Aturan umum: prop tingkat atas untuk pengiriman form itu sendiri, sedangkan `options` mengendalikan bagaimana Inertia menangani visit berikutnya.

### Akses programatik

Anda dapat mengakses metode form secara programatis menggunakan refs. Ini menyediakan alternatif untuk [slot props](#slot-props) saat Anda perlu memicu tindakan form dari luar form.

Vue:

```html
<script setup>
import { ref } from 'vue'
import { Form } from '@inertiajs/vue3'

const formRef = ref()

const handleSubmit = () => {
    formRef.value.submit()
}
</script>

<template>
    <Form ref="formRef" action="/users" method="post">
        <input type="text" name="name" />
        <button type="submit">Submit</button>
    </Form>
    <button @click="handleSubmit">Submit Programmatically</button>
</template>
```

React:

```jsx
import { useRef } from 'react'
import { Form } from '@inertiajs/react'

export default function CreateUser() {
    const formRef = useRef()

    const handleSubmit = () => {
        formRef.current.submit()
    }

    return (
        <Form ref={formRef} action="/users" method="post">
            <input type="text" name="name" />
            <button type="submit">Submit</button>
        </Form>
        <button onClick={handleSubmit}>Submit Programmatically</button>
    )
}
```

Svelte:

```html
<script>
    import { Form } from '@inertiajs/svelte'
    let formRef

    function handleSubmit() {
        formRef.submit()
    }
</script>

<Form bind:this={formRef} action="/users" method="post">
    <input type="text" name="name" />
    <button type="submit">Submit</button>
</Form>

<button on:click={handleSubmit}>Submit Programmatically</button>
```

## Form helper

Selain komponen `<Form>`, Inertia juga menyediakan helper `useForm` saat Anda memerlukan kontrol programatis atas data dan perilaku pengiriman form Anda.

Vue:

```html
<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
    email: null,
    password: null,
    remember: false,
})
</script>

<template>
    <form @submit.prevent="form.post('/login')">
        <!-- email -->
        <input type="text" v-model="form.email">
        <div v-if="form.errors.email">{{ form.errors.email }}</div>

        <!-- password -->
        <input type="password" v-model="form.password">
        <div v-if="form.errors.password">{{ form.errors.password }}</div>

        <!-- remember me -->
        <input type="checkbox" v-model="form.remember"> Remember Me

        <!-- submit -->
        <button type="submit" :disabled="form.processing">Login</button>
    </form>
</template>
```

React:

```jsx
import { useForm } from '@inertiajs/react'

const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
})

function submit(e) {
    e.preventDefault()
    post('/login')
}

return (
    <form onSubmit={submit}>
        <input type="text" value={data.email} onChange={e => setData('email', e.target.value)} />
        {errors.email && <div>{errors.email}</div>}

        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
        {errors.password && <div>{errors.password}</div>}

        <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} /> Remember Me

        <button type="submit" disabled={processing}>Login</button>
    </form>
)
```

Svelte 4:

```html
<script>
    import { useForm } from '@inertiajs/svelte'

    const form = useForm({
        email: null,
        password: null,
        remember: false,
    })

    function submit() {
        $form.post('/login')
    }
</script>

<form on:submit|preventDefault={submit}>
    <input type="text" bind:value={$form.email} />
    {#if $form.errors.email}
        <div class="form-error">{$form.errors.email}</div>
    {/if}

    <input type="password" bind:value={$form.password} />
    {#if $form.errors.password}
        <div class="form-error">{$form.errors.password}</div>
    {/if}

    <input type="checkbox" bind:checked={$form.remember} /> Remember Me

    <button type="submit" disabled={$form.processing}>Submit</button>
</form>
```

Svelte 5:

```html
<script>
    import { useForm } from '@inertiajs/svelte'

    const form = useForm({
        email: null,
        password: null,
        remember: false,
    })

    function submit(e) {
        e.preventDefault()
        $form.post('/login')
    }
</script>

<form onsubmit={submit}>
    <input type="text" bind:value={$form.email} />
    {#if $form.errors.email}
        <div class="form-error">{$form.errors.email}</div>
    {/if}

    <input type="password" bind:value={$form.password} />
    {#if $form.errors.password}
        <div class="form-error">{$form.errors.password}</div>
    {/if}

    <input type="checkbox" bind:checked={$form.remember} /> Remember Me

    <button type="submit" disabled={$form.processing}>Submit</button>
</form>
```

### Mereset Form

Untuk mengatur nilai-nilai kembali ke nilai default mereka, Anda dapat menggunakan metode `reset()`.

Vue:

```js
// Reset seluruh form...
form.reset()

// Reset field tertentu...
form.reset('field', 'anotherfield')
```

React:

```js
const { reset } = useForm({ ... })

// Reset seluruh form...
reset()

// Reset field tertentu...
reset('field', 'anotherfield')
```

Svelte:

```js
// Reset seluruh form...
$form.reset()

// Reset field tertentu...
$form.reset('field', 'anotherfield')
```

### Form errors

Jika ada kesalahan validasi form, mereka tersedia melalui properti `errors`. Saat membangun aplikasi Inertia yang diperkuat Laravel, kesalahan form akan secara otomatis diisi saat aplikasi Anda melempar instance `ValidationException`, seperti saat menggunakan `$request->validate()`.

Vue:

```jsx
<div v-if="form.errors.email">{{ form.errors.email }}</div>
```

React:

```jsx
const { errors } = useForm({ ... })

{errors.email && <div>{errors.email}</div>}
```

Svelte:

```jsx
{#if $form.errors.email}
    <div>{$form.errors.email}</div>
{/if}
```

### Form data dan history state

Untuk memberi tahu Inertia untuk menyimpan data dan kesalahan form dalam [history state](/remembering-state), Anda dapat memberikan kunci form unik sebagai argumen pertama saat menginisialisasi form Anda.

Vue:

```js
import { useForm } from '@inertiajs/vue3'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${user.id}`)
```

React:

```js
import { useForm } from '@inertiajs/react'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${user.id}`)
```

Svelte:

```js
import { useForm } from '@inertiajs/svelte'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${user.id}`)
```

### Wayfinder

<minimumversion version="2.0.6"></minimumversion>

Saat menggunakan [Wayfinder](https://github.com/laravel/wayfinder) bersamaan dengan helper form, Anda dapat sederhana melewatkan objek hasil langsung ke metode `form.submit`. Helper form akan menebak metode HTTP dan URL dari objek Wayfinder.

Vue:

```js
import { useForm } from '@inertiajs/vue3'
import { store } from 'App/Http/Controllers/UserController'

const form = useForm({
    name: 'John Doe',
    email: 'john.doe@example.com',
})

form.submit(store())
```

React:

```js
import { useForm } from '@inertiajs/react'
import { store } from 'App/Http/Controllers/UserController'

const form = useForm({
    name: 'John Doe',
    email: 'john.doe@example.com',
})

form.submit(store())
```

Svelte:

```js
import { useForm } from '@inertiajs/svelte'
import { store } from 'App/Http/Controllers/UserController'

const form = useForm({
    name: 'John Doe',
    email: 'john.doe@example.com',
})

form.submit(store())
```

## File uploads

Saat membuat permintaan atau pengiriman form yang termasuk file, Inertia akan secara otomatis mengonversi data permintaan menjadi objek `FormData`. Ini berfungsi dengan komponen `<Form>`, helper `useForm`, dan pengiriman router manual.

Untuk informasi lebih lanjut tentang unggahan file, termasuk pelacakan kemajuan, lihat dokumentasi [file uploads](/file-uploads).