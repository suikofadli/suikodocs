---
sidebar_position: 23
---

# Locked Properties

Properti Livewire dapat dimodifikasi dengan bebas di frontend dan backend menggunakan utilitas seperti `wire:model`. Jika Anda ingin mencegah properti — seperti ID model — dari dimodifikasi di frontend, Anda dapat menggunakan atribut `#[Locked]` Livewire.

## Penggunaan dasar

Berikut adalah komponen `ShowPost` yang menyimpan ID model `Post` sebagai properti publik bernama `$id`. Untuk mencegah properti ini dimodifikasi oleh pengguna yang ingin tahu atau berbahaya, Anda dapat menambahkan atribut `#[Locked]` ke properti tersebut:

> [!warning] Pastikan Anda mengimpor kelas atribut
> Pastikan Anda mengimpor kelas atribut apa pun. Misalnya, atribut `#[Locked]` di bawah ini memerlukan import berikut `use Livewire\Attributes\Locked;`.

```php
use Livewire\Attributes\Locked;
use Livewire\Component;

class ShowPost extends Component
{
	#[Locked] // [tl! highlight]
    public $id;

    public function mount($postId)
    {
        $this->id = $postId;
    }

	// ...
}
```

Dengan menambahkan atribut `#[Locked]`, Anda memastikan bahwa properti `$id` tidak akan pernah diubah.

> [!tip] Properti model aman secara default
> Jika Anda menyimpan model Eloquent di properti publik sebagai ganti hanya ID model, Livewire akan memastikan ID tidak diubah, tanpa Anda perlu secara eksplisit menambahkan atribut `#[Locked]` ke properti. Untuk sebagian besar kasus, ini adalah pendekatan yang lebih baik daripada menggunakan `#[Locked]`:
>
> ```php
> class ShowPost extends Component
> {
>    public Post $post; // [tl! highlight]
>
>    public function mount($postId)
>    {
>        $this->post = Post::find($postId);
>    }
>
>
> 	// ...
> }
> ```

### Mengapa tidak menggunakan properti protected?

Anda mungkin bertanya pada diri sendiri: mengapa tidak menggunakan properti protected untuk data sensitif?

Ingat, Livewire hanya mempertahankan properti publik antara request jaringan. Untuk data yang statis dan hard-coded, properti protected cocok. Namun, untuk data yang disimpan saat runtime, Anda harus menggunakan properti publik untuk memastikan bahwa data dipertahankan dengan benar.

### Bisakah Livewire melakukan ini secara otomatis?

Dalam dunia yang sempurna, Livewire akan mengunci properti secara default, dan hanya mengizinkan modifikasi ketika `wire:model` digunakan pada properti tersebut.

Sayangnya, itu akan memerlukan Livewire untuk menguraikan semua template Blade Anda untuk memahami apakah properti dimodifikasi oleh `wire:model` atau API serupa.

Tidak hanya akan menambah overhead teknis dan performa, akan mustahil untuk mendeteksi jika properti diubah oleh sesuatu seperti Alpine atau JavaScript khusus lainnya.

Oleh karena itu, Livewire akan terus membuat properti publik dapat dimodifikasi secara bebas secara default dan memberikan alat kepada pengembang untuk menguncinya sesuai kebutuhan.
