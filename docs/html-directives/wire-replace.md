---
sidebar_position: 41
---

# wire:replace

DOM diffing Livewire berguna untuk memperbarui elemen yang ada di halaman Anda, tetapi terkadang Anda mungkin perlu memaksa beberapa elemen untuk dirender dari awal untuk mereset status internal.

Dalam kasus ini, Anda dapat menggunakan direktif `wire:replace` untuk menginstruksikan Livewire untuk melewati DOM diffing pada anak-anak elemen, dan sebagai gantinya sepenuhnya mengganti konten dengan elemen baru dari server.

Ini paling berguna dalam konteks bekerja dengan library javascript pihak ketiga dan komponen web kustom, atau ketika penggunaan kembali elemen dapat menyebabkan masalah saat menjaga status.

Di bawah ini adalah contoh membungkus komponen web dengan shadow DOM `wire:replace` sehingga Livewire sepenuhnya mengganti elemen memungkinkan elemen kustom untuk menangani siklus hidupnya sendiri:

```blade
<form>
    <!-- ... -->

    <div wire:replace>
        <!-- Elemen kustom ini akan memiliki status internalnya sendiri -->
        <json-viewer>@json($someProperty)</json-viewer>
    </div>

    <!-- ... -->
</form>
```

Anda juga dapat menginstruksikan Livewire untuk mengganti elemen target serta semua anak-anak dengan `wire:replace.self`.

```blade
<div x-data="{open: false}" wire:replace.self>
  <!-- Pastikan bahwa status "open" diatur ulang ke false pada setiap render -->
</div>
```