---
sidebar_position: 25
---

# Offline

Pada aplikasi real-time, dapat membantu untuk memberikan indikasi visual bahwa perangkat pengguna tidak lagi terhubung ke internet.

Livewire menyediakan direktif `wire:offline` untuk kasus seperti ini.

Dengan menambahkan `wire:offline` ke elemen di dalam komponen Livewire, elemen tersebut akan disembunyikan secara default dan menjadi terlihat ketika pengguna kehilangan koneksi:

```php
<div wire:offline>
    Perangkat ini sedang offline.
</div>
```

## Beralih kelas

Menambahkan modifier `class` memungkinkan Anda untuk menambahkan kelas ke elemen ketika pengguna kehilangan koneksi mereka. Kelas akan dihapus lagi, setelah pengguna kembali online:

```php
<div wire:offline.class="bg-red-300">
```

Atau, menggunakan modifier `.remove`, Anda dapat menghapus kelas ketika pengguna kehilangan koneksi mereka. Dalam contoh ini, kelas `bg-green-300` akan dihapus dari `<div>` saat pengguna kehilangan koneksi mereka:

```php
<div class="bg-green-300" wire:offline.class.remove="bg-green-300">
```

## Beralih atribut

Modifier `.attr` memungkinkan Anda untuk menambahkan atribut ke elemen ketika pengguna kehilangan koneksi mereka. Dalam contoh ini, tombol "Save" akan dinonaktifkan saat pengguna kehilangan koneksi mereka:

```php
<button wire:offline.attr="disabled">Save</button>
```