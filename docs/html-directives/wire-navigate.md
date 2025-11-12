---
sidebar_position: 31
---

# wire:navigate

Fitur `wire:navigate` dari Livewire membuat navigasi halaman menjadi jauh lebih cepat, memberikan pengalaman seperti SPA untuk pengguna Anda.

Halaman ini adalah referensi sederhana untuk direktif `wire:navigate`. Pastikan untuk membaca [halaman tentang fitur Navigate Livewire](/docs/navigate) untuk dokumentasi yang lebih lengkap.

Berikut adalah contoh sederhana menambahkan `wire:navigate` ke link di bilah navigasi:

```blade
<nav>
    <a href="/" wire:navigate>Dashboard</a>
    <a href="/posts" wire:navigate>Posts</a>
    <a href="/users" wire:navigate>Users</a>
</nav>
```

Ketika salah satu link ini diklik, Livewire akan mengintersepsi klik dan, alih-alih membiarkan browser melakukan kunjungan halaman penuh, Livewire akan mengambil halaman di latar belakang dan menggantinya dengan halaman saat ini (menghasilkan navigasi halaman yang jauh lebih cepat dan lebih halus).

## Mengambil halaman lebih awal saat hover

Dengan menambahkan modifier `.hover`, Livewire akan mengambil halaman terlebih dahulu ketika pengguna mengarahkan kursor ke link. Dengan cara ini, halaman akan sudah diunduh dari server ketika pengguna mengklik link.

```blade
<a href="/" wire:navigate.hover>Dashboard</a>
```

## Lebih dalam

Untuk dokumentasi yang lebih lengkap tentang fitur ini, kunjungi [halaman dokumentasi navigate Livewire](/docs/navigate).