---
sidebar_position: 37
---

# wire:init

Livewire menawarkan direktif `wire:init` untuk menjalankan tindakan segera setelah komponen dirender. Ini dapat membantu dalam kasus di mana Anda tidak ingin menahan seluruh beban halaman, tetapi ingin memuat beberapa data segera setelah halaman dimuat.

```blade
<div wire:init="loadPosts">
    <!-- ... -->
</div>
```

Tindakan `loadPosts` akan dijalankan segera setelah komponen Livewire dirender di halaman.

Namun dalam kebanyakan kasus, [fitur lazy loading Livewire](/docs/lazy) lebih disukai daripada menggunakan `wire:init`.