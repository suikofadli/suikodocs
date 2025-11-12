---
sidebar_position: 34
---

# wire:dirty

Dalam halaman HTML tradisional yang berisi formulir, formulir hanya akan dikirim ketika pengguna menekan tombol "Submit".

Namun, Livewire mampu melakukan jauh lebih banyak daripada pengiriman formulir tradisional. Anda dapat memvalidasi input formulir secara real-time atau bahkan menyimpan formulir saat pengguna mengetik.

Dalam skenario pembaruan "real-time" ini, dapat membantu untuk memberi sinyal kepada pengguna Anda ketika formulir atau subset dari formulir telah diubah, tetapi belum disimpan ke database.

Ketika formulir berisi input yang belum disimpan, formulir tersebut dianggap "kotor". Formulir hanya menjadi "bersih" ketika request jaringan telah dipicu untuk menyinkronkan status server dengan status sisi klien.

## Penggunaan dasar

Livewire memungkinkan Anda untuk dengan mudah mengaktifkan elemen visual di halaman menggunakan direktif `wire:dirty`.

Dengan menambahkan `wire:dirty` ke elemen, Anda menginstruksikan Livewire untuk hanya menampilkan elemen ketika status sisi klien menyimpang dari status sisi server.

Untuk mendemonstrasikan, berikut adalah contoh formulir `UpdatePost` yang berisi indikasi visual "Unsaved changes..." yang memberi sinyal kepada pengguna bahwa formulir berisi input yang belum disimpan:

```blade
<form wire:submit="update">
    <input type="text" wire:model="title">

    <!-- ... -->

    <button type="submit">Update</button>

    <div wire:dirty>Perubahan belum disimpan...</div> <!-- [tl! highlight] -->
</form>
```

Karena `wire:dirty` telah ditambahkan ke pesan "Perubahan belum disimpan...", pesan akan disembunyikan secara default. Livewire akan secara otomatis menampilkan pesan ketika pengguna mulai memodifikasi input formulir.

Ketika pengguna mengirimkan formulir, pesan akan menghilang lagi, karena data server/klien kembali sinkron.

### Menghapus elemen

Dengan menambahkan modifier `.remove` ke `wire:dirty`, Anda dapat menampilkan elemen secara default dan hanya menyembunyikannya ketika komponen memiliki status "kotor":

```blade
<div wire:dirty.remove>Data sudah sinkron...</div>
```

## Menargetkan pembaruan properti

Bayangkan Anda menggunakan `wire:model.blur` untuk memperbarui properti di server segera setelah pengguna meninggalkan bidang input. Dalam skenario ini, Anda dapat memberikan indikasi "kotor" hanya untuk properti tersebut dengan menambahkan `wire:target` ke elemen yang berisi direktif `wire:dirty`.

Berikut adalah contoh hanya menampilkan indikasi kotor ketika properti title telah diubah:

```blade
<form wire:submit="update">
    <input wire:model.blur="title">

    <div wire:dirty wire:target="title">Title belum disimpan...</div> <!-- [tl! highlight] -->

    <button type="submit">Update</button>
</form>
```

## Mengaktifkan kelas

Seringkali, alih-alih mengaktifkan seluruh elemen, Anda mungkin ingin mengaktifkan kelas CSS individual pada input ketika statusnya "kotor".

Berikut adalah contoh di mana pengguna mengetik dalam bidang input dan border menjadi kuning, menunjukkan status "belum disimpan". Kemudian, ketika pengguna men-tab keluar dari bidang, border dihapus, menunjukkan bahwa status telah disimpan di server:

```blade
<input wire:model.blur="title" wire:dirty.class="border-yellow-500">
```