---
sidebar_position: 42
---

# wire:show

Direktif `wire:show` Livewire memudahkan untuk menampilkan dan menyembunyikan elemen berdasarkan hasil dari ekspresi.

Direktif `wire:show` berbeda dari penggunaan `@if` di Blade karena ia beralih visibility elemen menggunakan CSS (`display: none`) daripada menghapus elemen dari DOM sepenuhnya. Ini berarti elemen tetap ada di halaman tetapi disembunyikan, memungkinkan transisi yang lebih halus tanpa memerlukan server round-trip.

## Penggunaan dasar

Berikut adalah contoh praktis penggunaan `wire:show` untuk beralih modal "Create Post":

```php
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $showModal = false;

    public $content = '';

    public function save()
    {
        Post::create(['content' => $this->content]);

        $this->reset('content');

        $this->showModal = false;
    }
}
```

```blade
<div>
    <button x-on:click="$wire.showModal = true">New Post</button>

    <div wire:show="showModal">
        <form wire:submit="save">
            <textarea wire:model="content"></textarea>

            <button type="submit">Save Post</button>
        </form>
    </div>
</div>
```

Ketika tombol "Create New Post" diklik, modal muncul tanpa server roundtrip. Setelah berhasil menyimpan post, modal disembunyikan dan form direset.

## Menggunakan transisi

Anda dapat menggabungkan `wire:show` dengan transisi Alpine.js untuk membuat animasi show/hide yang halus. Karena `wire:show` hanya beralih properti CSS `display`, direktif `x-transition` Alpine bekerja dengan sempurna dengannya:

```blade
<div>
    <button x-on:click="$wire.showModal = true">New Post</button>

    <div wire:show="showModal" x-transition.duration.500ms>
        <form wire:submit="save">
            <textarea wire:model="content"></textarea>
            <button type="submit">Save Post</button>
        </form>
    </div>
</div>
```

Kelas transisi Alpine.js di atas akan membuat efek fade dan scale ketika modal muncul dan menghilang.

[Lihat dokumentasi x-transition lengkap →](https://alpinejs.dev/directives/transition)