---
sidebar_position: 11
---

# View Transitions

Inertia mendukung [View Transitions API](https://developer.chrome.com/docs/web-platform/view-transitions), memungkinkan Anda menganimasikan transisi halaman.

## Mengaktifkan transisi

Anda dapat mengaktifkan transisi tampilan untuk kunjungan dengan mengatur opsi `viewTransition` ke `true`. Secara default, ini akan menerapkan transisi cross-fade antar halaman.

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

## Callback transisi

Anda juga dapat meneruskan callback ke opsi `viewTransition`, yang akan menerima instance [`ViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition) standar yang disediakan oleh browser.

Vue:

```js
router.visit('/another-page', {
    viewTransition: (transition) => {
        transition.ready.then(() => console.log('Transition ready'))
        transition.updateCallbackDone.then(() => console.log('DOM updated'))
        transition.finished.then(() => console.log('Transition finished'))
    },
})
```

React:

```js
router.visit('/another-page', {
    viewTransition: (transition) => {
        transition.ready.then(() => console.log('Transition ready'))
        transition.updateCallbackDone.then(() => console.log('DOM updated'))
        transition.finished.then(() => console.log('Transition finished'))
    },
})
```

Svelte:

```js
router.visit('/another-page', {
    viewTransition: (transition) => {
        transition.ready.then(() => console.log('Transition ready'))
        transition.updateCallbackDone.then(() => console.log('DOM updated'))
        transition.finished.then(() => console.log('Transition finished'))
    },
})
```

## Link

Opsi `viewTransition` juga tersedia pada komponen `Link`.

Vue:

```jsx
<Link href="/another-page" view-transition>Navigate</Link>
```

React:

```jsx
<Link href="/another-page" viewTransition>Navigate</Link>
```

Svelte:

```html
<Link href="/another-page" viewTransition>Navigate</Link>
```

Anda juga dapat meneruskan callback untuk mengakses instance `ViewTransition`.

Vue:

```jsx
<Link
    href="/another-page"
    :view-transition="(transition) => {
        transition.ready.then(() => console.log('Transition ready'))
    }"
>
    Navigate
</Link>
```

React:

```jsx
<Link
    href="/another-page"
    viewTransition={(transition) => {
        transition.ready.then(() => console.log('Transition ready'))
    }}
>
    Navigate
</Link>
```

## Konfigurasi global

Anda dapat mengaktifkan transisi tampilan secara global untuk semua kunjungan dengan mengonfigurasi callback `visitOptions` saat [menginisialisasi aplikasi Inertia](/client-side-setup#configuring-defaults).

Vue:

```js
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'

createInertiaApp({
    // ...
    defaults: {
        visitOptions: {
            viewTransition: true,
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
        visitOptions: {
            viewTransition: true,
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
        visitOptions: {
            viewTransition: true,
        },
    },
})
```

## Menyesuaikan transisi

Anda dapat menyesuaikan animasi transisi menggunakan CSS. View Transitions API menggunakan beberapa pseudo-element yang dapat Anda target dengan CSS untuk membuat animasi kustom.

```css
@keyframes fade-in {
    from { opacity: 0; }
}

@keyframes fade-out {
    to { opacity: 0; }
}

::view-transition-old(root) {
    animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(root) {
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) both fade-in,
        300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}
```

Anda juga dapat menganimasikan elemen individual antar halaman dengan menetapkan `view-transition-name` unik.

Vue:

```jsx
<template>
    <img src="/avatar.jpg" alt="User" class="avatar-large" />
</template>

<style>
.avatar-large {
    view-transition-name: user-avatar;
    width: auto;
    height: 200px;
}
</style>
```

React:

```jsx
export default function UserAvatar() {
    return (
        <>
            <img src="/avatar.jpg" alt="User" className="avatar-large" />
            <style jsx>{`
                .avatar-large {
                    view-transition-name: user-avatar;
                    width: auto;
                    height: 200px;
                }
            `}</style>
        </>
    )
}
```

Svelte:

```html
<script>
    // Component logic here
</script>

<style>
    .avatar-large {
        view-transition-name: user-avatar;
        width: auto;
        height: 200px;
    }
</style>

<img src="/avatar.jpg" alt="User" class="avatar-large" />
```

Anda dapat menyesuaikan transisi tampilan sesuai keinginan Anda menggunakan animasi CSS apa pun yang Anda inginkan.