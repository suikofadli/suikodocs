---
sidebar_position: 35
---

# wire:confirm

Sebelum melakukan tindakan berbahaya di Livewire, Anda mungkin ingin memberikan pengguna Anda semacam konfirmasi visual.

Livewire memudahkan ini dengan menambahkan `wire:confirm` selain tindakan apa pun (`wire:click`, `wire:submit`, dll.).

Berikut adalah contoh menambahkan dialog konfirmasi ke tombol "Delete post":

```blade
<button
    type="button"
    wire:click="delete"
    wire:confirm="Apakah Anda yakin ingin menghapus post ini?"
>
    Hapus post <!-- [tl! highlight:-2,1] -->
</button>
```

Ketika pengguna mengklik "Hapus post", Livewire akan memicu dialog konfirmasi (Alert konfirmasi browser default). Jika pengguna menekan escape atau menekan cancel, tindakan tidak akan dilakukan. Jika mereka menekan "OK", tindakan akan selesai.

## Meminta input pengguna

Untuk tindakan yang lebih berbahaya seperti menghapus akun pengguna sepenuhnya, Anda mungkin ingin menampilkan prompt konfirmasi yang memerlukan mereka mengetik string karakter tertentu untuk mengkonfirmasi tindakan.

Livewire menyediakan modifier `.prompt` yang membantu, ketika diterapkan ke `wire:confirm`, akan meminta pengguna untuk input dan hanya mengkonfirmasi tindakan jika input cocok (case-sensitive) dengan string yang disediakan (ditandai dengan karakter "|" (pipe) di akhir nilai `wire:confirm`):

```blade
<button
    type="button"
    wire:click="delete"
    wire:confirm.prompt="Apakah Anda yakin?\n\nKetik DELETE untuk mengkonfirmasi|DELETE"
>
    Hapus akun <!-- [tl! highlight:-2,1] -->
</button>
```

Ketika pengguna menekan "Hapus akun", tindakan hanya akan dilakukan jika "DELETE" dimasukkan ke dalam prompt, jika tidak, tindakan akan dibatalkan.