---
sidebar_position: 5
---

# Polling

## Poll helper

Polling server Anda untuk informasi baru pada halaman saat ini adalah hal yang umum, jadi Inertia menyediakan poll helper yang dirancang untuk membantu mengurangi jumlah boilerplate code. Selain itu, poll helper akan secara otomatis berhenti polling ketika halaman di-unmount.

Argumen yang diperlukan hanyalah interval polling dalam milidetik.

Vue:

```js
import { usePoll } from '@inertiajs/vue3'
usePoll(2000)
```

React:

```jsx
import { usePoll } from '@inertiajs/react'
usePoll(2000)
```

Svelte:

```js
import { usePoll } from '@inertiajs/svelte'
usePoll(2000)
```

Jika Anda perlu meneruskan opsi permintaan tambahan ke poll helper, Anda dapat meneruskan salah satu opsi `router.reload` sebagai parameter kedua.

Vue:

```js
import { usePoll } from '@inertiajs/vue3'
usePoll(2000, {
    onStart() {
        console.log('Polling request started')
    },
    onFinish() {
        console.log('Polling request finished')
    }
})
```

React:

```jsx
import { usePoll } from '@inertiajs/react'
usePoll(2000, {
    onStart() {
        console.log('Polling request started')
    },
    onFinish() {
        console.log('Polling request finished')
    }
})
```

Svelte:

```js
import { usePoll } from '@inertiajs/svelte'
usePoll(2000, {
    onStart() {
        console.log('Polling request started')
    },
    onFinish() {
        console.log('Polling request finished')
    }
})
```

Jika Anda ingin kontrol lebih atas perilaku polling, poll helper menyediakan metode `stop` dan `start` yang memungkinkan Anda secara manual memulai dan menghentikan polling. Anda dapat meneruskan opsi `autoStart: false` ke poll helper untuk mencegahnya secara otomatis memulai polling ketika komponen di-mount.

Vue:

```markup
<script setup>
import { usePoll } from '@inertiajs/vue3'
const { start, stop } = usePoll(2000, {}, {
autoStart: false,
})
</script>
<template>
<button @click="start">Start polling</button>
<button @click="stop">Stop polling</button>
</template>
```

React:

```jsx
import { usePoll } from '@inertiajs/react'
export default () => {
    const { start, stop } = usePoll(2000, {}, {
        autoStart: false,
    })
    return (
        <div>
            <button onClick={start}>Start polling</button>
            <button onClick={stop}>Stop polling</button>
        </div>
    )
}
```

Svelte:

```js
import { usePoll } from '@inertiajs/svelte'
const { start, stop } = usePoll(2000, {}, {
    autoStart: false,
})
```

## Throttling

Secara default, poll helper akan throttle permintaan sebesar 90% ketika browser tab berada di latar belakang. Jika Anda ingin menonaktifkan perilaku ini, Anda dapat meneruskan opsi `keepAlive` ke poll helper.

Vue:

```js
import { usePoll } from '@inertiajs/vue3'
usePoll(2000, {}, {
keepAlive: true,
})
```

React:

```jsx
import { usePoll } from '@inertiajs/react'
usePoll(2000, {}, {
keepAlive: true,
})
```

Svelte:

```js
import { usePoll } from '@inertiajs/svelte'
usePoll(2000, {}, {
keepAlive: true,
})
```