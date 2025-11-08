---
title: Error Handling
---

# Error Handling

## Development

Salah satu keuntungan bekerja dengan framework server-side yang robust adalah exception handling bawaan yang Anda dapatkan secara gratis. Misalnya, Laravel dilengkapi dengan alat pelaporan error yang indah yang menampilkan stack trace yang diformat dengan baik dalam pengembangan lokal.

Tantangannya adalah, jika Anda membuat permintaan XHR (yang dilakukan Inertia) dan mengalami error server-side, Anda biasanya akan menggali melalui tab jaringan di devtools browser Anda untuk mendiagnosis masalah.

Inertia menyelesaikan masalah ini dengan menampilkan semua respons non-Inertia dalam modal. Ini berarti Anda mendapatkan pelaporan error yang indah yang biasa Anda gunakan, meskipun Anda telah membuat permintaan tersebut melalui XHR.

## Dialog element

Secara default, Inertia menampilkan modal error menggunakan overlay `<div>` kustom. Namun, Anda dapat memilih untuk menggunakan elemen `<dialog>` HTML native sebagai gantinya, yang menyediakan fungsionalitas modal bawaan termasuk penanganan backdrop.

Untuk mengaktifkan ini, konfigurasikan opsi `future.useDialogForErrorModal` dalam [application defaults](/client-side-setup#configuring-defaults) Anda.

```js
createInertiaApp({
    // resolve, setup, etc.
    defaults: {
        future: {
            useDialogForErrorModal: true,
        },
    },
})
```

## Production

Di production Anda akan ingin mengembalikan respons error Inertia yang tepat sebagai ganti mengandalkan pelaporan error yang digerakkan modal yang ada selama pengembangan. Untuk melakukan ini, Anda perlu memperbarui penangan exception default framework Anda untuk mengembalikan halaman error kustom.

Saat membangun aplikasi Laravel, Anda dapat melakukan ini dengan menggunakan metode exception `respond` dalam file `bootstrap/app.php` aplikasi Anda.

Laravel:

```php
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
        if (! app()->environment(['local', 'testing']) && in_array($response->getStatusCode(), [500, 503, 404, 403])) {
            return Inertia::render('ErrorPage', ['status' => $response->getStatusCode()])
                ->toResponse($request)
                ->setStatusCode($response->getStatusCode());
        } elseif ($response->getStatusCode() === 419) {
            return back()->with([
                'message' => 'The page expired, please try again.',
            ]);
        }
        return $response;
    });
})
```

Anda mungkin telah memperhatikan kami mengembalikan komponen halaman `ErrorPage` dalam contoh di atas. Anda perlu benar-benar membuat komponen ini, yang akan berfungsi sebagai halaman error generik untuk aplikasi Anda. Berikut adalah contoh komponen error yang dapat Anda gunakan sebagai titik awal.

Vue:

```markup
<script setup>
import { computed } from 'vue'

const props = defineProps({ status: Number })

const title = computed(() => {
    return {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[props.status]
})

const description = computed(() => {
    return {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[props.status]
})
</script>

<template>
    <div>
        <h1>{{ title }}</h1>
        <div>{{ description }}</div>
    </div>
</template>
```

React:

```jsx
export default function ErrorPage({ status }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status]

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status]

    return (
        <div>
            <H1>{title}</H1>
            <div>{description}</div>
        </div>
    )
}
```

Svelte 4:

```jsx
<script>
    export let status

    $: title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status]

    $: description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status]
</script>

<div>
    <h1>{title}</h1>
    <div>{description}</div>
</div>
```

Svelte 5:

```jsx
<script>
    let { status } = $props()

    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }
</script>

<div>
    <h1>{title[status]}</h1>
    <div>{description[status]}</div>
</div>
```