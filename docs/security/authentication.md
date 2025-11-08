---
title: Authentication
---

# Authentication

Salah satu keuntungan menggunakan Inertia adalah Anda tidak memerlukan sistem autentikasi khusus seperti OAuth untuk terhubung ke penyedia data (API) Anda. Juga, karena data Anda disediakan melalui controller Anda, dan berada di domain yang sama dengan komponen JavaScript Anda, Anda tidak perlu khawatir tentang pengaturan CORS.

Justru, saat menggunakan Inertia, Anda dapat menggunakan sistem autentikasi apa pun yang disertakan dengan framework server-side Anda. Biasanya, ini akan menjadi sistem autentikasi berbasis sesi seperti sistem autentikasi yang disertakan dengan Laravel.

[Starter kits](https://laravel.com/docs/starter-kits) Laravel menyediakan scaffolding siap pakai untuk aplikasi Inertia baru, termasuk autentikasi.