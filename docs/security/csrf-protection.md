---
title: CSRF Protection
---

# CSRF Protection

## Melakukan request

Laravel secara otomatis menyertakan CSRF token yang tepat saat melakukan request melalui Inertia atau Axios. Namun, jika Anda menggunakan Laravel, pastikan untuk menghilangkan meta tag `csrf-token` dari proyek Anda, karena ini akan mencegah CSRF token diperbarui dengan benar.

Jika framework server-side Anda menyertakan perlindungan cross-site request forgery (CSRF), Anda perlu memastikan bahwa setiap request Inertia menyertakan CSRF token yang diperlukan untuk request `POST`, `PUT`, `PATCH`, dan `DELETE`.

Tentu saja, seperti yang telah dibahas, beberapa framework server-side seperti Laravel secara otomatis menangani penyertaan CSRF token saat melakukan request. **Oleh karena itu, tidak ada konfigurasi tambahan yang diperlukan saat menggunakan salah satu framework ini.**

Namun, jika Anda perlu menangani perlindungan CSRF secara manual, salah satu pendekatannya adalah dengan menyertakan CSRF token sebagai prop di setiap respons. Anda kemudian dapat menggunakan token tersebut saat melakukan request Inertia.

Vue:

```js
import { router, usePage } from '@inertiajs/vue3'
const page = usePage()
router.post('/users', {
  _token: page.props.csrf_token,
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

React:

```js
import { router, usePage } from '@inertiajs/react'
const props = usePage().props
router.post('/users', {
  _token: props.csrf_token,
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

Svelte:

```js
import { page, router } from '@inertiajs/svelte'
router.post('/users', {
  _token: $page.props.csrf_token,
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

Anda bahkan dapat menggunakan fungsi [shared data](/shared-data) dari Inertia untuk secara otomatis menyertakan `csrf_token` di setiap respons.

Namun, pendekatan yang lebih baik adalah menggunakan fungsionalitas CSRF yang sudah ada di [axios](https://github.com/axios/axios) untuk ini. Axios adalah library HTTP yang digunakan Inertia di balik layar.

Axios secara otomatis memeriksa keberadaan cookie `XSRF-TOKEN`. Jika ada, maka akan menyertakan token di header `X-XSRF-TOKEN` untuk setiap request yang dibuatnya.

Cara termudah untuk mengimplementasikan ini adalah menggunakan middleware server-side. Cukup sertakan cookie `XSRF-TOKEN` di setiap respons, lalu verifikasi token menggunakan header `X-XSRF-TOKEN` yang dikirim dalam request dari axios.

## Menangani ketidakcocokan

Ketika terjadi ketidakcocokan CSRF token, framework server-side Anda kemungkinan akan melempar exception yang menghasilkan respons error. Misalnya, saat menggunakan Laravel, `TokenMismatchException` dilempar yang menghasilkan halaman error `419`. Karena itu bukan respons Inertia yang valid, error ditampilkan dalam modal.

<video controls=""><source src="/mp4/csrf-mismatch-modal.mp4" type="video/mp4"></source></video>Jelas, ini bukan pengalaman pengguna yang baik. Cara yang lebih baik untuk menangani error ini adalah dengan mengembalikan pengalihan kembali ke halaman sebelumnya, beserta flash message bahwa halaman telah kedaluwarsa. Ini akan menghasilkan respons Inertia yang valid dengan flash message tersedia sebagai prop yang kemudian dapat Anda tampilkan kepada pengguna. Tentu saja, Anda perlu membagikan [flash messages](/shared-data#flash-messages) Anda dengan Inertia agar ini berfungsi.

Saat menggunakan Laravel, Anda dapat memodifikasi exception handler aplikasi Anda untuk secara otomatis mengalihkan pengguna kembali ke halaman tempat mereka sebelumnya sambil mengirimkan message ke sesi. Untuk melakukan ini, Anda dapat menggunakan metode exception `respond` di file `bootstrap/app.php` aplikasi Anda.

Laravel:

```php
use Symfony\Component\HttpFoundation\Response;
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->respond(function (Response $response) {
        if ($response->getStatusCode() === 419) {
            return back()->with([
                'message' => 'The page expired, please try again.',
            ]);
        }

        return $response;
    });
});
```

Hasil akhirnya adalah pengalaman yang jauh lebih baik untuk pengguna Anda. Alih-alih melihat modal error, pengguna justru disajikan dengan message bahwa halaman "kedaluwarsa" dan diminta untuk mencoba lagi.

<video controls=""><source src="/mp4/csrf-mismatch-warning.mp4" type="video/mp4"></source></video>