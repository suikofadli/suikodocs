---
sidebar_position: 28
---

# wire:submit

Livewire memudahkan penanganan pengiriman form melalui direktif `wire:submit`. Dengan menambahkan `wire:submit` ke elemen `<form>`, Livewire akan mencegat pengiriman form, mencegah penanganan default browser, dan memanggil metode komponen Livewire apa pun.

Berikut adalah contoh dasar menggunakan `wire:submit` untuk menangani pengiriman form "Create Post":

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title = '';

    public $content = '';

    public function save()
    {
        Post::create([
            'title' => $this->title,
            'content' => $this->content,
        ]);

        $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```php
<form wire:submit="save"> <!-- [tl! highlight] -->
    <input type="text" wire:model="title">

    <textarea wire:model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

Pada contoh di atas, ketika pengguna mengirimkan form dengan mengklik "Save", `wire:submit` mencegat event `submit` dan memanggil action `save()` di server.

> [!info] Livewire otomatis memanggil `preventDefault()`
> `wire:submit` berbeda dari event handler Livewire lainnya karena secara internal memanggil `event.preventDefault()` tanpa perlu modifier `.prevent`. Ini karena sangat jarang ada kasus di mana Anda mendengarkan event `submit` dan TIDAK ingin mencegah penanganan default browser (melakukan pengiriman form penuh ke endpoint).

> [!info] Livewire otomatis menonaktifkan form saat mengirimkan
> Secara default, ketika Livewire mengirimkan pengiriman form ke server, ia akan menonaktifkan tombol submit form dan menandai semua input form sebagai `readonly`. Dengan cara ini pengguna tidak dapat mengirimkan form yang sama lagi sampai pengiriman awal selesai.

## Lebih dalam

`wire:submit` hanyalah salah satu dari banyak event listener yang disediakan Livewire. Dua halaman berikut menyediakan dokumentasi yang lebih lengkap tentang penggunaan `wire:submit` dalam aplikasi Anda:

* [Merespons event browser dengan Livewire](/docs/actions)
* [Membuat form di Livewire](/docs/forms)