---
sidebar_position: 9
---

# Remembering State

Saat menavigasi browser history, Inertia memulihkan halaman menggunakan data prop yang di-cache dalam history state. Namun, Inertia tidak memulihkan state komponen halaman lokal karena ini di luar jangkauannya. Ini dapat menyebabkan halaman usang dalam browser history Anda.

Misalnya, jika pengguna sebagian menyelesaikan form, lalu menavigasi pergi, lalu kembali, form akan direset dan pekerjaan mereka akan hilang.

Untuk mengatasi masalah ini, Anda dapat memberi tahu Inertia state komponen lokal mana yang harus disimpan dalam browser history.

## Menyimpan local state

Untuk menyimpan state komponen lokal ke history state, gunakan fitur `useRemember` untuk memberi tahu Inertia data mana yang harus diingat.

Vue (Gunakan hook "useRemember" untuk memberi tahu Inertia data mana yang harus diingat.):

```js
import { useRemember } from '@inertiajs/vue3'
const form = useRemember({
  first_name: null,
  last_name: null,
})
```

React (Gunakan hook "useRemember" untuk memberi tahu Inertia data mana yang harus diingat.):

```jsx
import { useRemember } from '@inertiajs/react'
export default function Profile() {
  const [formState, setFormState] = useRemember({
    first_name: null,
    last_name: null,
    // ...
  })
  // ...
}
```

Svelte (Gunakan store "useRemember" untuk memberi tahu Inertia data mana yang harus diingat.):

```js
import { useRemember } from '@inertiajs/svelte'
const form = useRemember({
  first_name: null,
  last_name: null,
})
// ...
```

Sekarang, setiap kali state `form` lokal Anda berubah, Inertia akan secara otomatis menyimpan data ini ke history state dan akan memulihkannya pada navigasi history.

## Multiple components

Jika halaman Anda berisi multiple komponen yang menggunakan fungsionalitas remember yang disediakan oleh Inertia, Anda perlu menyediakan kunci unik untuk setiap komponen sehingga Inertia tahu data mana yang akan dipulihkan ke setiap komponen.

Vue (Setel kunci sebagai argumen kedua dari useRemember()):

```js
import { useRemember } from '@inertiajs/vue3'
const form = useRemember({
  first_name: null,
  last_name: null,
}, 'Users/Create')
```

React (Setel kunci sebagai argumen kedua dari useRemember()):

```jsx
import { useRemember } from '@inertiajs/react'
export default function Profile() {
  const [formState, setFormState] = useRemember({
    first_name: null,
    last_name: null,
  }, 'Users/Create')
}
```

Svelte (Setel kunci sebagai argumen kedua dari useRemember()):

```js
import { page, useRemember } from '@inertiajs/svelte'
const form = useRemember({
  first_name: null,
  last_name: null,
}, 'Users/Create')
```

Jika Anda memiliki multiple instance dari komponen yang sama di halaman menggunakan fungsionalitas remember, pastikan untuk juga menyertakan kunci unik untuk setiap instance komponen, seperti identifier model.

Vue (Setel kunci dinamis sebagai argumen kedua dari useRemember()):

```js
import { useRemember } from '@inertiajs/vue3'
const props = defineProps({ user: Object })
const form = useRemember({
  first_name: null,
  last_name: null,
}, `Users/Edit:${props.user.id}`)
```

React (Setel kunci dinamis sebagai argumen kedua dari useRemember()):

```jsx
import { useRemember } from '@inertiajs/react'
export default function Profile() {
  const [formState, setFormState] = useRemember({
    first_name: props.user.first_name,
    last_name: props.user.last_name,
  }, `Users/Edit:${props.user.id}`)
}
```

Svelte (Setel kunci dinamis sebagai argumen kedua dari useRemember()):

```js
import { page, useRemember } from '@inertiajs/svelte'
const form = useRemember({
  first_name: $page.props.user.first_name,
  last_name: $page.props.user.last_name,
}, `Users/Edit:${$page.props.user.id}`)
```

## Form helper

Jika Anda menggunakan [Inertia form helper](/forms#form-helper), Anda dapat meneruskan kunci form unik sebagai argumen pertama saat menginisialisasi form Anda. Ini akan menyebabkan data form dan kesalahan secara otomatis diingat.

Vue:

```js
import { useForm } from '@inertiajs/vue3'
const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${props.user.id}`)
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

## Menyimpan state secara manual

Hook `useRemember` memantau perubahan data dan secara otomatis menyimpan perubahan tersebut ke history state. Lalu, Inertia akan memulihkan data saat halaman dimuat.

Namun, juga mungkin untuk mengelola ini secara manual menggunakan metode `remember()` dan `restore()` yang diekspos oleh Inertia.

Vue:

```js
import { router } from '@inertiajs/vue3'
// Simpan state komponen lokal ke history state
router.remember(data, 'my-key')
// Pulihkan state komponen lokal dari history state
let data = router.restore('my-key')
```

React:

```jsx
import { router } from '@inertiajs/react'
// Simpan state komponen lokal ke history state
router.remember(data, 'my-key')
// Pulihkan state komponen lokal dari history state
let data = router.restore('my-key')
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
// Simpan state komponen lokal ke history state
router.remember(data, 'my-key')
// Pulihkan state komponen lokal dari history state
let data = router.restore('my-key')
```