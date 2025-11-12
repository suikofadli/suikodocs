---
sidebar_position: 33
---

# wire:cloak

`wire:cloak` adalah direktif yang menyembunyikan elemen saat halaman dimuat sampai Livewire sepenuhnya diinisialisasi. Ini berguna untuk mencegah "flash of unstyled content" yang dapat terjadi ketika halaman dimuat sebelum Livewire memiliki kesempatan untuk menginisialisasi.

## Penggunaan dasar

Untuk menggunakan `wire:cloak`, tambahkan direktif ke elemen apa pun yang ingin Anda sembunyikan saat halaman dimuat:

```blade
<div wire:cloak>
    Konten ini akan disembunyikan sampai Livewire dimuat sepenuhnya
</div>
```

### Konten dinamis

`wire:cloak` sangat berguna dalam skenario di mana Anda ingin mencegah pengguna melihat konten dinamis yang tidak diinisialisasi seperti elemen yang ditampilkan atau disembunyikan menggunakan `wire:show`.

```blade
<div>
    <div wire:show="starred" wire:cloak>
        <!-- Ikon bintang kuning... -->
    </div>

    <div wire:show="!starred" wire:cloak>
        <!-- Ikon bintang abu-abu... -->
    </div>
</div>
```

Dalam contoh di atas, tanpa `wire:cloak`, kedua ikon akan ditampilkan sebelum Livewire menginisialisasi. Namun, dengan `wire:cloak`, kedua elemen akan disembunyikan sampai inisialisasi.