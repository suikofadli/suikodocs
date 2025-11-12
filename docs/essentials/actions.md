---
sidebar_position: 6
---

# Actions

Actions Livewire adalah metode pada komponen Anda yang dapat dipicu oleh interaksi frontend seperti mengklik tombol atau mengirimkan form. Mereka memberikan pengalaman pengembang untuk dapat memanggil metode PHP langsung dari browser, memungkinkan Anda untuk fokus pada logika aplikasi tanpa terbebani menulis kode boilerplate yang menghubungkan frontend dan backend aplikasi Anda.

Mari kita jelajahi contoh dasar memanggil aksi `save` pada komponen `CreatePost`:

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

        return redirect()->to('/posts');
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

Pada contoh di atas, ketika pengguna mengirimkan form dengan mengklik "Save", `wire:submit` mencegat event `submit` dan memanggil aksi `save()` di server.

Pada dasarnya, actions adalah cara untuk dengan mudah memetakan interaksi pengguna ke fungsionalitas server-side tanpa kesulitan mengirim dan menangani permintaan AJAX secara manual.

## Me-refresh komponen

Terkadang Anda mungkin ingin memicu "refresh" sederhana dari komponen Anda. Misalnya, jika Anda memiliki komponen yang memeriksa status sesuatu di database, Anda mungkin ingin menampilkan tombol kepada pengguna yang memungkinkan mereka menyegarkan hasil yang ditampilkan.

Anda dapat melakukan ini menggunakan aksi `$refresh` Livewire yang sederhana di mana pun Anda biasanya merujuk ke metode komponen Anda sendiri:

```php
<button type="button" wire:click="$refresh">...</button>
```

Ketika aksi `$refresh` dipicu, Livewire akan melakukan server-roundtrip dan me-render ulang komponen Anda tanpa memanggil metode apa pun.

Penting untuk dicatat bahwa pembaruan data yang tertunda di komponen Anda (misalnya binding `wire:model`) akan diterapkan di server saat komponen disegarkan.

Secara internal, Livewire menggunakan nama "commit" untuk merujuk ke setiap kali komponen Livewire diperbarui di server. Jika Anda lebih suka terminologi ini, Anda dapat menggunakan helper `$commit` sebagai ganti `$refresh`. Keduanya identik.

```php
<button type="button" wire:click="$commit">...</button>
```

Anda juga dapat memicu refresh komponen menggunakan AlpineJS di komponen Livewire Anda:

```php
<button type="button" x-on:click="$wire.$refresh()">...</button>
```

Pelajari lebih lanjut dengan membaca [dokumentasi untuk menggunakan Alpine di dalam Livewire](/docs/alpine).

## Mengkonfirmasi aksi

Saat memungkinkan pengguna melakukan tindakan berbahaya—seperti menghapus posting dari database—Anda mungkin ingin menunjukkan kepada mereka peringatan konfirmasi untuk memverifikasi bahwa mereka ingin melakukan tindakan tersebut.

Livewire membuat ini mudah dengan menyediakan directive sederhana yang disebut `wire:confirm`:

```php
<button
    type="button"
    wire:click="delete"
    wire:confirm="Are you sure you want to delete this post?"
>
    Delete post <!-- [tl! highlight:-2,1] -->
</button>
```

Ketika `wire:confirm` ditambahkan ke elemen yang berisi aksi Livewire, ketika pengguna mencoba memicu aksi tersebut, mereka akan disajikan dengan dialog konfirmasi yang berisi pesan yang disediakan. Mereka dapat menekan "OK" untuk mengkonfirmasi aksi, atau menekan "Cancel" atau menekan tombol escape.

Untuk informasi lebih lanjut, kunjungi [halaman dokumentasi `wire:confirm`](/docs/wire-confirm).

## Event listener

Livewire mendukung berbagai event listener, memungkinkan Anda untuk merespons berbagai jenis interaksi pengguna:

| Listener        | Description                               |
|-----------------|-------------------------------------------|
| `wire:click`    | Dipicu ketika elemen diklik      |
| `wire:submit`   | Dipicu ketika form dikirim        |
| `wire:keydown`  | Dipicu ketika tombol ditekan      |
| `wire:keyup`  | Dipicu ketika tombol dilepaskan
| `wire:mouseenter`| Dipicu ketika mouse memasuki elemen |
| `wire:*`| Teks apa pun yang mengikuti `wire:` akan digunakan sebagai nama event dari listener |

Karena nama event setelah `wire:` dapat berupa apa saja, Livewire mendukung event browser apa pun yang mungkin perlu Anda dengarkan. Misalnya, untuk mendengarkan `transitionend`, Anda dapat menggunakan `wire:transitionend`.

### Mendengarkan tombol spesifik

Anda dapat menggunakan salah satu alias Livewire yang nyaman untuk mempersempit event listener penekanan tombol ke tombol atau kombinasi tombol tertentu.

Misalnya, untuk melakukan pencarian ketika pengguna menekan `Enter` setelah mengetik di kotak pencarian, Anda dapat menggunakan `wire:keydown.enter`:

```php
<input wire:model="query" wire:keydown.enter="searchPosts">
```

Anda dapat merantai lebih banyak alias tombol setelah yang pertama untuk mendengarkan kombinasi tombol. Misalnya, jika Anda ingin mendengarkan tombol `Enter` hanya saat tombol `Shift` ditekan, Anda dapat menulis berikut:

```php
<input wire:keydown.shift.enter="...">
```

Berikut adalah daftar semua pengubah tombol yang tersedia:

| Modifier      | Key                          |
|---------------|------------------------------|
| `.shift`      | Shift                        |
| `.enter`      | Enter                        |
| `.space`      | Space                        |
| `.ctrl`       | Ctrl                         |
| `.cmd`        | Cmd                          |
| `.meta`       | Cmd di Mac, tombol Windows di Windows |
| `.alt`        | Alt                          |
| `.up`         | Panah atas                     |
| `.down`       | Panah bawah                   |
| `.left`       | Panah kiri                   |
| `.right`      | Panah kanan                  |
| `.escape`     | Escape                       |
| `.tab`        | Tab                          |
| `.caps-lock`  | Caps Lock                    |
| `.equal`      | Sama dengan, `=`                   |
| `.period`     | Titik, `.`                  |
| `.slash`      | Garis miring, `/`           |

### Event handler modifiers

Livewire juga menyertakan pengubah yang berguna untuk membuat tugas penanganan event yang umum menjadi sepele.

Misalnya, jika Anda perlu memanggil `event.preventDefault()` dari dalam event listener, Anda dapat mengakhiri nama event dengan `.prevent`:

```php
<input wire:keydown.prevent="...">
```

Berikut adalah daftar lengkap semua event listener modifiers yang tersedia dan fungsinya:

| Modifier         | Key                                                     |
|------------------|---------------------------------------------------------|
| `.prevent`       | Setara dengan memanggil `.preventDefault()`               |
| `.stop`          | Setara dengan memanggil `.stopPropagation()`              |
| `.window`        | Mendengarkan event pada objek `window`                 |
| `.outside`       | Hanya mendengarkan klik "di luar" elemen            |
| `.document`      | Mendengarkan event pada objek `document`              |
| `.once`          | Memastikan listener hanya dipanggil sekali                 |
| `.debounce`      | Debounce handler 250ms sebagai default               |
| `.debounce.100ms`| Debounce handler untuk waktu tertentu       |
| `.throttle`      | Throttle handler agar dipanggil setiap 250ms minimum |
| `.throttle.100ms`| Throttle handler pada durasi kustom                |
| `.self`          | Hanya memanggil listener jika event berasal dari elemen ini, bukan anak |
| `.camel`         | Mengubah nama event menjadi camel case (`wire:custom-event` -> "customEvent") |
| `.dot`           | Mengubah nama event menjadi dot notation (`wire:custom-event` -> "custom.event") |
| `.passive`       | `wire:touchstart.passive` tidak akan memblokir performa scroll |
| `.capture`       | Mendengarkan event dalam fase "capturing"                 |

Karena `wire:` menggunakan directive [Alpine's](https://alpinejs.dev) `x-on` di balik layar, pengubah ini tersedia untuk Anda oleh Alpine. Untuk konteks lebih lanjut tentang kapan Anda harus menggunakan pengubah ini, konsultasikan [Dokumentasi Event Alpine](https://alpinejs.dev/essentials/events).

### Menangani event pihak ketiga

Livewire juga mendukung mendengarkan event khusus yang dipecat oleh library pihak ketiga.

Misalnya, mari kita bayangkan Anda menggunakan editor teks kaya [Trix](https://trix-editor.org/) di proyek Anda dan Anda ingin mendengarkan event `trix-change` untuk menangkap konten editor. Anda dapat melakukan ini menggunakan directive `wire:trix-change`:

```php
<form wire:submit="save">
    <!-- ... -->

    <trix-editor
        wire:trix-change="setPostContent($event.target.value)"
    ></trix-editor>

    <!-- ... -->
</form>
```

Pada contoh ini, aksi `setPostContent` dipanggil setiap kali event `trix-change` dipicu, memperbarui properti `content` di komponen Livewire dengan nilai saat ini dari editor Trix.

> [!info] Anda dapat mengakses objek event menggunakan `$event`
> Dalam handler event Livewire, Anda dapat mengakses objek event melalui `$event`. Ini berguna untuk merujuk informasi pada event. Misalnya, Anda dapat mengakses elemen yang memicu event melalui `$event.target`.

> [!warning]
> Kode demo Trix di atas tidak lengkap dan hanya berguna sebagai demonstrasi event listener. Jika digunakan verbatim, permintaan jaringan akan dipecat pada setiap ketukan. Implementasi yang lebih berperforma adalah:
>
> ```php
> <trix-editor
>    x-on:trix-change="$wire.content = $event.target.value"
> ></trix-editor>
> ```

### Mendengarkan event khusus yang dikirim

Jika aplikasi Anda mengirim event khusus dari Alpine, Anda juga dapat mendengarkannya menggunakan Livewire:

```php
<div wire:custom-event="...">

    <!-- Deeply nested within this component: -->
    <button x-on:click="$dispatch('custom-event')">...</button>

</div>
```

Ketika tombol diklik pada contoh di atas, event `custom-event` dikirim dan menggelembung ke root komponen Livewire di mana `wire:custom-event` menangkapnya dan memanggil aksi yang diberikan.

Jika Anda ingin mendengarkan event yang dikirim di tempat lain di aplikasi Anda, Anda perlu menunggu event menggelembung ke objek `window` dan mendengarkannya di sana. Untungnya, Livewire membuat ini mudah dengan memungkinkan Anda menambahkan pengubah `.window` sederhana ke event listener apa pun:

```php
<div wire:custom-event.window="...">
    <!-- ... -->
</div>

<!-- Dispatched somewhere on the page outside the component: -->
<button x-on:click="$dispatch('custom-event')">...</button>
```

### Menonaktifkan input saat form dikirim

Pertimbangkan contoh `CreatePost` yang telah kita diskusikan sebelumnya:

```php
<form wire:submit="save">
    <input wire:model="title">

    <textarea wire:model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

Ketika pengguna mengklik "Save", permintaan jaringan dikirim ke server untuk memanggil aksi `save()` pada komponen Livewire.

Tapi, mari kita bayangkan bahwa pengguna mengisi form ini pada koneksi internet yang lambat. Pengguna mengklik "Save" dan tidak ada yang terjadi awalnya karena permintaan jaringan memakan waktu lebih lama dari biasanya. Mereka mungkin bertanya-tanya apakah pengiriman gagal dan mencoba mengklik tombol "Save" lagi saat permintaan pertama masih diproses.

Dalam kasus ini, akan ada dua permintaan untuk aksi yang sama yang diproses pada saat yang sama.

Untuk mencegah skenario ini, Livewire secara otomatis menonaktifkan tombol submit dan semua input form di dalam elemen `<form>` saat aksi `wire:submit` sedang diproses. Ini memastikan bahwa form tidak secara tidak sengaja dikirim dua kali.

Untuk lebih mengurangi kebingungan bagi pengguna pada koneksi yang lebih lambat, seringkali membantu untuk menunjukkan beberapa indikator loading seperti perubahan warna latar belakang yang halus atau animasi SVG.

Livewire menyediakan directive `wire:loading` yang membuatnya sepele untuk menunjukkan dan menyembunyikan indikator loading di mana saja di halaman. Berikut adalah contoh singkat menggunakan `wire:loading` untuk menunjukkan pesan loading di bawah tombol "Save":

```php
<form wire:submit="save">
    <textarea wire:model="content"></textarea>

    <button type="submit">Save</button>

    <span wire:loading>Saving...</span> <!-- [tl! highlight] -->
</form>
```

`wire:loading` adalah fitur yang kuat dengan berbagai fitur yang lebih kuat. [Lihat dokumentasi loading lengkap untuk informasi lebih lanjut](/docs/wire-loading).

## Meneruskan parameter

Livewire memungkinkan Anda untuk meneruskan parameter dari template Blade ke aksi di komponen Anda, memberi Anda kesempatan untuk menyediakan data tambahan atau status dari frontend ke aksi saat dipanggil.

Misalnya, mari kita bayangkan Anda memiliki komponen `ShowPosts` yang memungkinkan pengguna menghapus posting. Anda dapat meneruskan ID posting sebagai parameter ke aksi `delete()` di komponen Livewire Anda. Kemudian, aksi dapat mengambil posting yang relevan dan menghapusnya dari database:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete($id)
    {
        $post = Post::findOrFail($id);

        $this->authorize('delete', $post);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```php
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="delete({{ $post->id }})">Delete</button> <!-- [tl! highlight] -->
        </div>
    @endforeach
</div>
```

Untuk posting dengan ID 2, tombol "Delete" di template Blade di atas akan di-render di browser sebagai:

```php
<button wire:click="delete(2)">Delete</button>
```

Ketika tombol ini diklik, metode `delete()` akan dipanggil dan `$id` akan diteruskan dengan nilai "2".

> [!warning] Jangan percaya parameter aksi
> Parameter aksi harus diperlakukan sama seperti input permintaan HTTP, artinya nilai parameter aksi tidak boleh dipercaya. Anda harus selalu mengotorisasi kepemilikan entitas sebelum memperbaruinya di database.
>
> Untuk informasi lebih lanjut, konsultasikan dokumentasi kami mengenai [kekhawatiran keamanan dan praktik terbaik](/docs/actions#security-concerns).


Sebagai kemudahan tambahan, Anda dapat secara otomatis menyelesaikan model Eloquent dengan ID model yang sesuai yang disediakan ke aksi sebagai parameter. Ini sangat mirip dengan [route model binding](/docs/components#using-route-model-binding). Untuk memulai, type-hint parameter aksi dengan kelas model dan model yang sesuai akan secara otomatis diambil dari database dan diteruskan ke aksi sebagai ganti ID:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete(Post $post) // [tl! highlight]
    {
        $this->authorize('delete', $post);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

## Dependency injection

Anda dapat memanfaatkan [sistem dependency injection Laravel](https://laravel.com/docs/controllers#dependency-injection-and-controllers) dengan type-hint parameter dalam tanda tangan aksi Anda. Livewire dan Laravel akan secara otomatis menyelesaikan dependensi aksi dari kontainer:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Repositories\PostRepository;

class ShowPosts extends Component
{
    public function delete(PostRepository $posts, $postId) // [tl! highlight]
    {
        $posts->deletePost($postId);
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```php
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="delete({{ $post->id }})">Delete</button> <!-- [tl! highlight] -->
        </div>
    @endforeach
</div>
```

Pada contoh ini, metode `delete()` menerima instance `PostRepository` yang diselesaikan melalui [service container Laravel](https://laravel.com/docs/container#main-content) sebelum menerima parameter `$postId` yang disediakan.

## Memanggil aksi dari Alpine

Livewire berintegrasi secara mulus dengan [Alpine](https://alpinejs.dev/). Faktanya, di balik layar, setiap komponen Livewire juga merupakan komponen Alpine. Ini berarti Anda dapat memanfaatkan sepenuhnya Alpine dalam komponen Anda untuk menambahkan interaktivitas client-side yang didukung JavaScript.

Untuk membuat pasangan ini bahkan lebih kuat, Livewire mengekspos objek magic `$wire` ke Alpine yang dapat diperlakukan sebagai representasi JavaScript dari komponen PHP Anda. Selain [mengakses dan mengubah properti publik melalui `$wire`](/docs/properties#accessing-properties-from-javascript), Anda dapat memanggil aksi. Ketika aksi dipanggil pada objek `$wire`, metode PHP yang sesuai akan dipanggil pada komponen Livewire backend Anda:

```php
<button x-on:click="$wire.save()">Save Post</button>
```

Atau, untuk mengilustrasikan contoh yang lebih kompleks, Anda mungkin menggunakan utilitas [`x-intersect`](https://alpinejs.dev/plugins/intersect) Alpine untuk memicu aksi `incrementViewCount()` Livewire ketika elemen tertentu terlihat di halaman:

```php
<div x-intersect="$wire.incrementViewCount()">...</div>
```

### Meneruskan parameter

Parameter apa pun yang Anda teruskan ke metode `$wire` juga akan diteruskan ke metode kelas PHP. Misalnya, pertimbangkan aksi Livewire berikut:

```php
public function addTodo($todo)
{
    $this->todos[] = $todo;
}
```

Dalam template Blade komponen Anda, Anda dapat memanggil aksi ini melalui Alpine, menyediakan parameter yang harus diberikan ke aksi:

```php
<div x-data="{ todo: '' }">
    <input type="text" x-model="todo">

    <button x-on:click="$wire.addTodo(todo)">Add Todo</button>
</div>
```

Jika pengguna telah mengetik "Take out the trash" ke input teks dan menekan tombol "Add Todo", metode `addTodo()` akan dipicu dengan nilai parameter `$todo` adalah "Take out the trash".

### Menerima nilai pengembalian

Untuk kekuatan lebih lanjut, aksi `$wire` yang dipanggil mengembalikan promise saat permintaan jaringan sedang diproses. Ketika respons server diterima, promise terselesaikan dengan nilai yang dikembalikan oleh aksi backend.

Misalnya, pertimbangkan komponen Livewire yang memiliki aksi berikut:

```php
use App\Models\Post;

public function getPostCount()
{
    return Post::count();
}
```

Menggunakan `$wire`, aksi dapat dipanggil dan nilai yang dikembalikan diselesaikan:

```php
<span x-init="$el.innerHTML = await $wire.getPostCount()"></span>
```

Pada contoh ini, jika metode `getPostCount()` mengembalikan "10", tag `<span>` juga akan berisi "10".

Pengetahuan Alpine tidak diperlukan saat menggunakan Livewire; namun, ini adalah alat yang sangat kuat dan mengetahui Alpine akan meningkatkan pengalaman dan produktivitas Livewire Anda.

## Aksi JavaScript

Livewire memungkinkan Anda untuk mendefinisikan aksi JavaScript yang berjalan sepenuhnya di client-side tanpa membuat permintaan server. Ini berguna dalam dua skenario:

1. Ketika Anda ingin melakukan pembaruan UI sederhana yang tidak memerlukan komunikasi server
2. Ketika Anda ingin memperbarui UI secara optimis dengan JavaScript sebelum membuat permintaan server

Untuk mendefinisikan aksi JavaScript, Anda dapat menggunakan fungsi `$js()` di dalam tag `<script>` di komponen Anda.

Berikut adalah contoh bookmark posting yang menggunakan aksi JavaScript untuk memperbarui UI secara optimis sebelum membuat permintaan server. Aksi JavaScript segera menunjukkan ikon bookmark yang terisi, kemudian membuat permintaan untuk mempertahankan bookmark di database:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public $bookmarked = false;

    public function mount()
    {
        $this->bookmarked = $this->post->bookmarkedBy(auth()->user());
    }

    public function bookmarkPost()
    {
        $this->post->bookmark(auth()->user());

        $this->bookmarked = $this->post->bookmarkedBy(auth()->user());
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

```php
<div>
    <button wire:click="$js.bookmark" class="flex items-center gap-1">
        {{-- Outlined bookmark icon... --}}
        <svg wire:show="!bookmarked" wire:cloak xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>

        {{-- Solid bookmark icon... --}}
        <svg wire:show="bookmarked" wire:cloak xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
        </svg>
    </button>
</div>

@script
<script>
    $js('bookmark', () => {
        $wire.bookmarked = !$wire.bookmarked

        $wire.bookmarkPost()
    })
</script>
@endscript
```

Ketika pengguna mengklik tombol hati, urutan berikut terjadi:

1. Aksi JavaScript "bookmark" dipicu
2. Ikon hati segera diperbarui dengan mengubah `$wire.bookmarked` di client-side
3. Metode `bookmarkPost()` dipanggil untuk menyimpan perubahan ke database

Ini memberikan umpan balik visual instan sambil memastikan status bookmark dipertahankan dengan benar.

### Memanggil dari Alpine

Anda dapat memanggil aksi JavaScript langsung dari Alpine menggunakan objek `$wire`. Misalnya, Anda dapat menggunakan objek `$wire` untuk memanggil aksi JavaScript `bookmark`:

```php
<button x-on:click="$wire.$js.bookmark()">Bookmark</button>
```

### Memanggil dari PHP

Aksi JavaScript juga dapat dipanggil menggunakan metode `js()` dari PHP:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title = '';

    public function save()
    {
        // ...

        $this->js('onPostSaved'); // [tl! highlight]
    }
}
```

```php
<div>
    <!-- ... -->

    <button wire:click="save">Save</button>
</div>

@script
<script>
    $js('onPostSaved', () => {
        alert('Your post has been saved successfully!')
    })
</script>
@endscript
```

Pada contoh ini, ketika aksi `save()` selesai, aksi JavaScript `postSaved` akan dijalankan, memicu dialog peringatan.

## Aksi magic

Livewire menyediakan sekumpulan aksi "magic" yang memungkinkan Anda melakukan tugas umum di komponen Anda tanpa mendefinisikan metode kustom. Aksi magic ini dapat digunakan dalam event listener yang didefinisikan dalam template Blade Anda.

### `$parent`

Variabel magic `$parent` memungkinkan Anda mengakses properti komponen induk dan memanggil aksi komponen induk dari komponen anak:

```php
<button wire:click="$parent.removePost({{ $post->id }})">Remove</button>
```

Pada contoh di atas, jika komponen induk memiliki aksi `removePost()`, anak dapat memanggilnya langsung dari template Blade menggunakan `$parent.removePost()`.

### `$set`

Aksi magic `$set` memungkinkan Anda memperbarui properti di komponen Livewire Anda langsung dari template Blade. Untuk menggunakan `$set`, berikan properti yang ingin Anda perbarui dan nilai baru sebagai argumen:

```php
<button wire:click="$set('query', '')">Reset Search</button>
```

Pada contoh ini, ketika tombol diklik, permintaan jaringan dikirim yang mengatur properti `$query` di komponen ke `''`.

### `$refresh`

Aksi `$refresh` memicu render ulang komponen Livewire Anda. Ini dapat berguna saat memperbarui tampilan komponen tanpa mengubah nilai properti apa pun:

```php
<button wire:click="$refresh">Refresh</button>
```

Ketika tombol diklik, komponen akan di-render ulang, memungkinkan Anda melihat perubahan terbaru di tampilan.

### `$toggle`

Aksi `$toggle` digunakan untuk mengubah nilai properti boolean di komponen Livewire Anda:

```php
<button wire:click="$toggle('sortAsc')">
    Sort {{ $sortAsc ? 'Descending' : 'Ascending' }}
</button>
```

Pada contoh ini, ketika tombol diklik, properti `$sortAsc` di komponen akan beralih antara `true` dan `false`.

### `$dispatch`

Aksi `$dispatch` memungkinkan Anda mengirim event Livewire langsung di browser. Di bawah ini adalah contoh tombol yang, ketika diklik, akan mengirim event `post-deleted`:

```php
<button type="submit" wire:click="$dispatch('post-deleted')">Delete Post</button>
```

### `$event`

Aksi `$event` dapat digunakan dalam event listener seperti `wire:click`. Aksi ini memberi Anda akses ke event JavaScript aktual yang dipicu, memungkinkan Anda merujuk ke elemen pemicu dan informasi relevan lainnya:

```php
<input type="text" wire:keydown.enter="search($event.target.value)">
```

Ketika tombol enter ditekan saat pengguna mengetik di input di atas, konten input akan diteruskan sebagai parameter ke aksi `search()`.

### Menggunakan aksi magic dari Alpine

Anda juga dapat memanggil aksi magic dari Alpine menggunakan objek `$wire`. Misalnya, Anda dapat menggunakan objek `$wire` untuk memanggil aksi magic `$refresh`:

```php
<button x-on:click="$wire.$refresh()">Refresh</button>
```

## Melewati re-render

Terkadang mungkin ada aksi di komponen Anda tanpa efek samping yang akan mengubah template Blade yang di-render saat aksi dipanggil. Jika demikian, Anda dapat melewati bagian `render` dari siklus hidup Livewire dengan menambahkan atribut `#[Renderless]` di atas metode aksi.

Untuk mendemonstrasikan, di komponen `ShowPost` di bawah, "view count" dicatat ketika pengguna telah menggulir ke bagian bawah posting:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Renderless;
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post)
    {
        $this->post = $post;
    }

    #[Renderless] // [tl! highlight]
    public function incrementViewCount()
    {
        $this->post->incrementViewCount();
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

```php
<div>
    <h1>{{ $post->title }}</h1>
    <p>{{ $post->content }}</p>

    <div x-intersect="$wire.incrementViewCount()"></div>
</div>
```

Contoh di atas menggunakan [`x-intersect`](https://alpinejs.dev/plugins/intersect), utilitas Alpine yang memanggil ekspresi ketika elemen memasuki viewport (biasanya digunakan untuk mendeteksi ketika pengguna menggulir ke elemen lebih jauh di halaman).

Seperti yang Anda lihat, ketika pengguna menggulir ke bagian bawah posting, `incrementViewCount()` dipanggil. Karena `#[Renderless]` ditambahkan ke aksi, tampilan dicatat, tetapi template tidak di-render ulang dan tidak ada bagian halaman yang terpengaruh.

Jika Anda lebih suka tidak menggunakan atribut metode atau perlu melewati rendering secara kondisional, Anda dapat memanggil metode `skipRender()` dalam aksi komponen Anda:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post)
    {
        $this->post = $post;
    }

    public function incrementViewCount()
    {
        $this->post->incrementViewCount();

        $this->skipRender(); // [tl! highlight]
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

## Kekhawatiran keamanan

Ingat bahwa metode publik apa pun di komponen Livewire Anda dapat dipanggil dari client-side, bahkan tanpa handler `wire:click` terkait yang memanggilnya. Dalam skenario ini, pengguna masih dapat memicu aksi dari DevTools browser.

Di bawah ini adalah tiga contoh kerentanan yang mudah dilewatkan dalam komponen Livewire. Masing-masing akan menunjukkan komponen rentan terlebih dahulu dan komponen aman setelahnya. Sebagai latihan, coba temukan kerentanan dalam contoh pertama sebelum melihat solusinya.

Jika Anda kesulitan menemukan kerentanan dan itu membuat Anda khawatir tentang kemampuan menjaga aplikasi Anda tetap aman, ingat semua kerentanan ini berlaku untuk aplikasi web standar yang menggunakan permintaan dan controller. Jika Anda menggunakan metode komponen sebagai proxy untuk metode controller, dan parameternya sebagai proxy untuk input permintaan, Anda harus dapat menerapkan pengetahuan keamanan aplikasi yang ada ke kode Livewire Anda.

### Selalu otorisasi parameter aksi

Sama seperti input permintaan controller, sangat penting untuk mengotorisasi parameter aksi karena itu adalah input pengguna yang sewenang-wenang.

Di bawah ini adalah komponen `ShowPosts` di mana pengguna dapat melihat semua posting mereka di satu halaman. Mereka dapat menghapus posting apa pun yang mereka suka menggunakan salah satu tombol "Delete" posting.

Berikut adalah versi rentan dari komponen:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete($id)
    {
        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```php
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="delete({{ $post->id }})">Delete</button>
        </div>
    @endforeach
</div>
```

Ingat bahwa pengguna berbahaya dapat memanggil `delete()` langsung dari konsol JavaScript, meneruskan parameter apa pun yang mereka inginkan ke aksi. Ini berarti bahwa pengguna yang melihat salah satu posting mereka dapat menghapus posting pengguna lain dengan meneruskan ID posting yang tidak dimiliki ke `delete()`.

Untuk melindungi dari ini, kita perlu mengotorisasi bahwa pengguna memiliki posting yang akan dihapus:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete($id)
    {
        $post = Post::find($id);

        $this->authorize('delete', $post); // [tl! highlight]

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

### Selalu otorisasi server-side

Seperti controller Laravel standar, aksi Livewire dapat dipanggil oleh pengguna mana pun, bahkan jika tidak ada kemudahan untuk memanggil aksi di UI.

Pertimbangkan komponen `BrowsePosts` berikut di mana pengguna mana pun dapat melihat semua posting di aplikasi, tetapi hanya administrator yang dapat menghapus posting:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

```php
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            @if (Auth::user()->isAdmin())
                <button wire:click="deletePost({{ $post->id }})">Delete</button>
            @endif
        </div>
    @endforeach
</div>
```

Seperti yang Anda lihat, hanya administrator yang dapat melihat tombol "Delete"; namun, pengguna mana pun dapat memanggil `deletePost()` pada komponen dari DevTools browser.

Untuk menambal kerentanan ini, kita perlu mengotorisasi aksi di server seperti ini:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        if (! Auth::user()->isAdmin) { // [tl! highlight:2]
            abort(403);
        }

        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

Dengan perubahan ini, hanya administrator yang dapat menghapus posting dari komponen ini.

### Jaga metode berbahaya protected atau private

Setiap metode publik di dalam komponen Livewire Anda dapat dipanggil dari client. Bahkan metode yang belum Anda rujuk di dalam handler `wire:click`. Untuk mencegah pengguna memanggil metode yang tidak dimaksudkan untuk dipanggil client-side, Anda harus menandainya sebagai `protected` atau `private`. Dengan melakukan itu, Anda membatasi visibilitas metode sensitif tersebut ke kelas komponen dan subkelasnya, memastikan mereka tidak dapat dipanggil dari client-side.

Pertimbangkan contoh `BrowsePosts` yang telah kita diskusikan sebelumnya, di mana pengguna dapat melihat semua posting di aplikasi Anda, tetapi hanya administrator yang dapat menghapus posting. Di bagian [Selalu otorisasi server-side](/docs/actions#always-authorize-server-side), kami membuat aksi aman dengan menambahkan otorisasi server-side. Sekarang bayangkan kami memfaktorkan ulang penghapusan posting aktual ke metode khusus seperti yang mungkin Anda lakukan untuk menyederhanakan kode Anda:

```php
// Warning: This snippet demonstrates what NOT to do...
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        if (! Auth::user()->isAdmin) {
            abort(403);
        }

        $this->delete($id); // [tl! highlight]
    }

    public function delete($postId)  // [tl! highlight:5]
    {
        $post = Post::find($postId);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

```php
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="deletePost({{ $post->id }})">Delete</button>
        </div>
    @endforeach
</div>
```

Seperti yang Anda lihat, kami memfaktorkan ulang logika penghapusan posting ke metode khusus bernama `delete()`. Meskipun metode ini tidak dirujuk di mana pun di template kami, jika pengguna mendapat pengetahuan tentang keberadaannya, mereka akan dapat memanggilnya dari DevTools browser karena itu `publik`.

Untuk mengatasi ini, kami dapat menandai metode sebagai `protected` atau `private`. Setelah metode ditandai sebagai `protected` atau `private`, kesalahan akan dilempar jika pengguna mencoba memanggilnya:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        if (! Auth::user()->isAdmin) {
            abort(403);
        }

        $this->delete($id);
    }

    protected function delete($postId) // [tl! highlight]
    {
        $post = Post::find($postId);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

<!--
## Applying middleware

By default, Livewire re-applies authentication and authorization related middleware on subsequent requests if those middleware were applied on the initial page load request.

For example, imagine your component is loaded inside a route that is assigned the `auth` middleware and a user's session ends. When the user triggers another action, the `auth` middleware will be re-applied and the user will receive an error.

If there are specific middleware that you would like to apply to a specific action, you may do so with the `#[Middleware]` attribute. For example, we could apply a `LogPostCreation` middleware to an action that creates posts:

```php
<?php

namespace App\Livewire;

use App\Http\Middleware\LogPostCreation;
use Livewire\Component;

class CreatePost extends Component
{
    public $title;

    public $content;

    #[Middleware(LogPostCreation::class)] // [tl! highlight]
    public function save()
    {
        // Create the post...
    }

    // ...
}
```

Now, the `LogPostCreation` middleware will be applied only to the `createPost` action, ensuring that the activity is only being logged when users create a new post.

-->