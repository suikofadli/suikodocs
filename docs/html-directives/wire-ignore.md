---
sidebar_position: 40
---

# wire:ignore

Kemampuan Livewire untuk membuat pembaruan ke halaman adalah yang membuatnya "live", namun, ada saat-saat di mana Anda mungkin ingin mencegah Livewire memperbarui sebagian halaman.

Dalam kasus ini, Anda dapat menggunakan direktif `wire:ignore` untuk menginstruksikan Livewire untuk mengabaikan konten elemen tertentu, bahkan jika mereka berubah antara request.

Ini paling berguna dalam konteks bekerja dengan library javascript pihak ketiga untuk input formulir kustom dan sejenisnya.

Di bawah ini adalah contoh membungkus elemen yang digunakan oleh library pihak ketiga dalam `wire:ignore` sehingga Livewire tidak mengganggu HTML yang dihasilkan oleh library:

```blade
<form>
    <!-- ... -->

    <div wire:ignore>
        <!-- Elemen ini akan diacu oleh -->
        <!-- library pihak ketiga untuk inisialisasi... -->
        <input id="id-for-date-picker-library">
    </div>

    <!-- ... -->
</form>
```

Anda juga dapat menginstruksikan Livewire untuk hanya mengabaikan perubahan pada atribut elemen root alih-alih mengamati perubahan pada kontennya menggunakan `wire:ignore.self`.

```blade
<div wire:ignore.self>
    <!-- ... -->
</div>
```