---
sidebar_position: 44
---

# wire:text

`wire:text` adalah direktif yang secara dinamis memperbarui konten teks elemen berdasarkan properti komponen atau ekspresi. Berbeda dengan menggunakan sintaks Blade `{{ }}`, `wire:text` memperbarui konten tanpa memerlukan network roundtrip untuk me-render ulang komponen.

Jika Anda terbiasa dengan direktif `x-text` Alpine, keduanya pada dasarnya sama.

## Penggunaan dasar

Berikut adalah contoh penggunaan `wire:text` untuk secara optimis menampilkan pembaruan ke properti Livewire tanpa menunggu network roundtrip.

```php
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public $likes;

    public function mount()
    {
        $this->likes = $this->post->like_count;
    }

    public function like()
    {
        $this->post->like();

        $this->likes = $this->post->fresh()->like_count;
    }
}
```

```blade
<div>
    <button x-on:click="$wire.likes++" wire:click="like">❤️ Like</button>

    Likes: <span wire:text="likes"></span>
</div>
```

Ketika tombol diklik, `$wire.likes++` segera memperbarui hitungan yang ditampilkan melalui `wire:text`, sementara `wire:click="like"` menyimpan perubahan ke database di latar belakang.

Pola ini membuat `wire:text` sempurna untuk membangun UI optimis di Livewire.