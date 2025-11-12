---
sidebar_position: 21
---

# Redirecting

Setelah pengguna melakukan beberapa tindakan — seperti mengirimkan form — Anda mungkin ingin mengalihkan mereka ke halaman lain di aplikasi Anda.

Karena request Livewire bukan request browser full-page standar, redirect HTTP standar tidak akan berfungsi. Sebagai gantinya, Anda perlu memicu pengalihan melalui JavaScript. Untungnya, Livewire menyediakan metode helper `$this->redirect()` yang sederhana untuk digunakan di dalam komponen Anda. Secara internal, Livewire akan menangani proses pengalihan di frontend.

Jika Anda lebih suka, Anda juga dapat menggunakan [utilitas pengalihan bawaan Laravel](https://laravel.com/docs/responses#redirects) di dalam komponen Anda.

## Penggunaan dasar

Berikut adalah contoh komponen Livewire `CreatePost` yang mengalihkan pengguna ke halaman lain setelah mereka mengirimkan form untuk membuat post:

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

		$this->redirect('/posts'); // [tl! highlight]
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

Seperti yang Anda lihat, ketika aksi `save` dipicu, pengalihan juga akan dipicu ke `/posts`. Ketika Livewire menerima respons ini, ia akan mengalihkan pengguna ke URL baru di frontend.

## Pengalihan ke Route

Jika Anda ingin mengalihkan ke halaman menggunakan nama route, Anda dapat menggunakan `redirectRoute`.

Misalnya, jika Anda memiliki halaman dengan route bernama `'profile'` seperti ini:

```php
    Route::get('/user/profile', function () {
        // ...
    })->name('profile');
```

Anda dapat menggunakan `redirectRoute` untuk mengalihkan ke halaman itu menggunakan nama route seperti ini:

```php
    $this->redirectRoute('profile');
```

Jika Anda perlu meneruskan parameter ke route, Anda dapat menggunakan argumen kedua dari metode `redirectRoute` seperti ini:

```php
    $this->redirectRoute('profile', ['id' => 1]);
```

## Pengalihan ke intended

Jika Anda ingin mengalihkan pengguna kembali ke halaman sebelumnya tempat mereka berada, Anda dapat menggunakan `redirectIntended`. Metode ini menerima URL default opsional sebagai argumen pertama yang digunakan sebagai fallback jika halaman sebelumnya tidak dapat ditentukan:

```php
    $this->redirectIntended('/default/url');
```

## Mengalihkan ke komponen full-page

Karena Livewire menggunakan fitur pengalihan bawaan Laravel, Anda dapat menggunakan semua metode pengalihan yang tersedia untuk Anda dalam aplikasi Laravel yang khas.

Misalnya, jika Anda menggunakan komponen Livewire sebagai komponen full-page untuk route seperti ini:

```php
use App\Livewire\ShowPosts;

Route::get('/posts', ShowPosts::class);
```

Anda dapat mengalihkan ke komponen dengan menyediakan nama komponen ke metode `redirect()`:

```php
public function save()
{
    // ...

    $this->redirect(ShowPosts::class);
}
```

## Flash messages

Selain memungkinkan Anda menggunakan metode pengalihan bawaan Laravel, Livewire juga mendukung [utilitas session flash data Laravel](https://laravel.com/docs/session#flash-data).

Untuk meneruskan flash data bersama dengan pengalihan, Anda dapat menggunakan metode `session()->flash()` Laravel seperti ini:

```php
use Livewire\Component;

class UpdatePost extends Component
{
    // ...

    public function update()
    {
        // ...

        session()->flash('status', 'Post berhasil diperbarui.');

        $this->redirect('/posts');
    }
}
```

Dengan asumsi halaman yang diarahkan mengandung snippet Blade berikut, pengguna akan melihat pesan "Post berhasil diperbarui." setelah memperbarui post:

```php
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
```
