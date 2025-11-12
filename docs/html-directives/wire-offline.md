---
sidebar_position: 39
---

# wire:offline

Dalam keadaan tertentu dapat membantu bagi pengguna Anda untuk mengetahui apakah mereka saat ini terhubung ke internet.

Jika misalnya, Anda telah membangun platform blogging di Livewire, Anda mungkin ingin memberi tahu pengguna Anda dengan cara tertentu jika mereka sedang offline sehingga mereka tidak membuat draf blog post seluruhnya tanpa kemampuan Livewire untuk menyimpannya ke database.

Livewire membuat ini sepele dengan menyediakan direktif `wire:offline`. Dengan menempelkan `wire:offline` ke elemen di komponen Livewire Anda, elemen akan disembunyikan secara default dan hanya ditampilkan ketika Livewire mendeteksi koneksi jaringan telah terputus dan tidak tersedia. Elemen kemudian akan menghilang lagi ketika jaringan telah mendapatkan kembali koneksi.

Sebagai contoh:

```blade
<p class="alert alert-warning" wire:offline>
    Ups, perangkat Anda telah kehilangan koneksi. Halaman web yang Anda lihat sedang offline.
</p>
```