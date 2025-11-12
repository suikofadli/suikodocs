---
sidebar_position: 20
---

# Session Properties

Livewire memudahkan untuk mempertahankan nilai properti di seluruh refresh/perubahan halaman menggunakan atribut `#[Session]`.

Dengan menambahkan `#[Session]` ke properti dalam komponen Anda, Livewire akan menyimpan nilai properti tersebut dalam sesi set kali berubah. Dengan cara ini, ketika halaman di-refresh, Livewire akan mengambil nilai terbaru dari sesi dan menggunakannya dalam komponen Anda.

Atribut `#[Session]` analog dengan atribut [`#[Url]`](/docs/url). Keduanya berguna dalam skenario yang serupa. Perbedaan utamanya adalah `#[Session]` mempertahankan nilai tanpa memodifikasi query string URL, yang terkadang diinginkan; terkadang tidak.

## Penggunaan dasar

Berikut adalah komponen `ShowPosts` yang memungkinkan pengguna memfilter posting yang terlihat berdasarkan string yang disimpan dalam properti `$search`:

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Session] // [tl! highlight]
    public $search;

    protected function posts()
    {
        return $this->search === ''
            ? Post::all()
            : Post::where('title', 'like', '%'.$this->search.'%');
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => $this->posts(),
        ]);
    }
}
```

Karena atribut `#[Session]` telah ditambahkan ke properti `$search`, setelah pengguna memasukkan nilai pencarian, mereka dapat me-refresh halaman dan nilai pencarian akan dipertahankan. Setiap kali `$search` diperbarui, nilai barunya akan disimpan dalam sesi pengguna dan digunakan di seluruh beban halaman.

> [!warning] Implikasi performa
> Karena sesi Laravel dimuat ke dalam memori selama setiap permintaan, Anda dapat memperlambat performa seluruh aplikasi untuk pengguna tertentu dengan menyimpan terlalu banyak dalam sesi pengguna.

## Mengatur kunci khusus

Saat menggunakan `[#Session]`, Livewire akan menyimpan nilai properti dalam sesi menggunakan kunci yang dihasilkan secara dinamis yang terdiri dari nama komponen yang digabungkan dengan nama properti.

Ini memastikan bahwa properti di seluruh instance komponen akan menggunakan nilai sesi yang sama. Ini juga memastikan properti dengan nama yang sama dari komponen yang berbeda tidak akan konflik.

Jika Anda ingin kontrol penuh atas kunci sesi apa yang digunakan Livewire untuk properti tertentu, Anda dapat memberikan parameter `key:`:

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;

class ShowPosts extends Component
{
    #[Session(key: 'search')] // [tl! highlight]
    public $search;

    // ...
}
```

Ketika Livewire menyimpan dan mengambil nilai properti `$search`, ia akan menggunakan kunci yang diberikan: "search".

Selain itu, jika Anda ingin menghasilkan kunci secara dinamis dari properti lain dalam komponen Anda, Anda dapat melakukannya menggunakan notasi kurung kurawal berikut:

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;
use App\Models\Author;

class ShowPosts extends Component
{
    public Author $author;

    #[Session(key: 'search-{author.id}')] // [tl! highlight]
    public $search;

    // ...
}
```

Dalam contoh di atas, jika id model `$author` adalah "4", kunci sesi akan menjadi: `search-4`