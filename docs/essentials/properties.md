---
sidebar_position: 5
---

# Properties

Properties menyimpan dan mengelola data di dalam komponen Livewire Anda. Properties didefinisikan sebagai public properties pada kelas komponen dan dapat diakses serta dimodifikasi baik di sisi server maupun client.

## Menginisialisasi properties

Anda dapat mengatur nilai awal untuk properties dalam metode `mount()` komponen Anda.

Pertimbangkan contoh berikut:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class TodoList extends Component
{
    public $todos = [];

    public $todo = '';

    public function mount()
    {
        $this->todos = Auth::user()->todos; // [tl! highlight]
    }

    // ...
}
```

Dalam contoh ini, kita telah mendefinisikan array `todos` kosong dan menginisialisasinya dengan todos yang sudah ada dari user yang terautentikasi. Sekarang, ketika komponen dirender untuk pertama kali, semua todos yang sudah ada di database akan ditampilkan kepada user.

## Bulk assignment

Terkadang menginisialisasi banyak properties dalam metode `mount()` bisa terasa verbose. Untuk membantu dengan ini, Livewire menyediakan cara yang mudah untuk menetapkan multiple properties sekaligus melalui metode `fill()`. Dengan melewatkan array asosiatif dari nama properties dan nilainya masing-masing, Anda dapat mengatur beberapa properties secara bersamaan dan mengurangi baris kode yang berulang di `mount()`.

Sebagai contoh:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public $post;

    public $title;

    public $description;

    public function mount(Post $post)
    {
        $this->post = $post;

        $this->fill( // [tl! highlight]
            $post->only('title', 'description'), // [tl! highlight]
        ); // [tl! highlight]
    }

    // ...
}
```

Karena `$post->only(...)` mengembalikan array asosiatif dari atribut dan nilai model berdasarkan nama yang Anda masukkan, properties `$title` dan `$description` akan diatur awalnya ke `title` dan `description` dari model `$post` dari database tanpa harus mengatur masing-masing secara individual.

## Data binding

Livewire mendukung data binding dua arah melalui atribut HTML `wire:model`. Ini memungkinkan Anda untuk dengan mudah menyinkronkan data antara properties komponen dan input HTML, menjaga antarmuka pengguna dan state komponen tetap sinkron.

Mari kita gunakan direktif `wire:model` untuk mengikat property `$todo` dalam komponen `TodoList` ke elemen input dasar:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class TodoList extends Component
{
    public $todos = [];

    public $todo = '';

    public function add()
    {
        $this->todos[] = $this->todo;

        $this->todo = '';
    }

    // ...
}
```

```blade
<div>
    <input type="text" wire:model="todo" placeholder="Todo..."> <!-- [tl! highlight] -->

    <button wire:click="add">Add Todo</button>

    <ul>
        @foreach ($todos as $todo)
            <li>{{ $todo }}</li>
        @endforeach
    </ul>
</div>
```

Dalam contoh di atas, nilai input teks akan disinkronkan dengan property `$todo` di server ketika tombol "Add Todo" diklik.

Ini baru permukaan dari `wire:model`. Untuk informasi lebih dalam tentang data binding, periksa [dokumentasi kami tentang forms](/docs/forms).

## Me-reset properties

Terkadang, Anda mungkin perlu me-reset properties kembali ke state awalnya setelah aksi dilakukan oleh user. Dalam kasus ini, Livewire menyediakan metode `reset()` yang menerima satu atau lebih nama properties dan mengatur ulang nilainya ke state awal.

Dalam contoh di bawah, kita dapat menghindari duplikasi kode dengan menggunakan `$this->reset()` untuk me-reset field `todo` setelah tombol "Add Todo" diklik:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class ManageTodos extends Component
{
    public $todos = [];

    public $todo = '';

    public function addTodo()
    {
        $this->todos[] = $this->todo;

        $this->reset('todo'); // [tl! highlight]
    }

    // ...
}
```

Dalam contoh di atas, setelah user mengklik "Add Todo", field input yang menampung todo yang baru saja ditambahkan akan terhapus, memungkinkan user untuk menulis todo baru.

> [!warning] `reset()` tidak akan bekerja pada nilai yang diatur di `mount()`
> `reset()` akan me-reset property ke statenya sebelum metode `mount()` dipanggil. Jika Anda menginisialisasi property di `mount()` ke nilai yang berbeda, Anda harus me-reset property secara manual.

## Mengambil properties

Sebagai alternatif, Anda dapat menggunakan metode `pull()` untuk me-reset dan mengambil nilai dalam satu operasi.

Berikut contoh yang sama dari atas, tetapi disederhanakan dengan `pull()`:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class ManageTodos extends Component
{
    public $todos = [];

    public $todo = '';

    public function addTodo()
    {
        $this->todos[] = $this->pull('todo'); // [tl! highlight]
    }

    // ...
}
```

Contoh di atas mengambil satu nilai, tetapi `pull()` juga dapat digunakan untuk me-reset dan mengambil (sebagai pasangan key-value) semua atau beberapa properties:

```php
// Sama seperti $this->all() dan $this->reset();
$this->pull();

// Sama seperti $this->only(...) dan $this->reset(...);
$this->pull(['title', 'content']);
```

## Tipe property yang didukung

Livewire mendukung set terbatas dari tipe property karena pendekatan uniknya dalam mengelola data komponen antara request server.

Setiap property dalam komponen Livewire diserialisasikan atau "dehidrasi" ke JSON antara request, kemudian "hidrasi" dari JSON kembali ke PHP untuk request berikutnya.

Proses konversi dua arah ini memiliki batasan tertentu, membatasi jenis properties yang dapat bekerja dengan Livewire.

### Tipe primitif

Livewire mendukung tipe primitif seperti string, integer, dll. Tipe-tipe ini dapat dengan mudah dikonversi dari dan ke JSON, membuatnya ideal untuk digunakan sebagai properties dalam komponen Livewire.

Livewire mendukung tipe property primitif berikut: `Array`, `String`, `Integer`, `Float`, `Boolean`, dan `Null`.

```php
class TodoList extends Component
{
    public $todos = []; // Array

    public $todo = ''; // String

    public $maxTodos = 10; // Integer

    public $showTodos = false; // Boolean

    public $todoFilter; // Null
}
```

### Tipe PHP umum

Selain tipe primitif, Livewire mendukung tipe objek PHP umum yang digunakan dalam aplikasi Laravel. Namun, penting untuk dicatat bahwa tipe-tipe ini akan _dehidrasi_ ke JSON dan _hidrasi_ kembali ke PHP pada setiap request. Ini berarti bahwa property mungkin tidak mempertahankan nilai run-time seperti closures. Juga, informasi tentang objek seperti nama kelas mungkin terekspos ke JavaScript.

Tipe PHP yang didukung:
| Tipe | Nama Kelas Lengkap |
|------|-----------------|
| BackedEnum | `BackedEnum` |
| Collection | `Illuminate\Support\Collection` |
| Eloquent Collection | `Illuminate\Database\Eloquent\Collection` |
| Model | `Illuminate\Database\Eloquent\Model` |
| DateTime | `DateTime` |
| Carbon | `Carbon\Carbon` |
| Stringable | `Illuminate\Support\Stringable` |

> [!warning] Eloquent Collections dan Models
> Saat menyimpan Eloquent Collections dan Models dalam properties Livewire, constraint query tambahan seperti select(...) tidak akan diterapkan kembali pada request berikutnya.
>
> Lihat [Eloquent constraints aren't preserved between requests](#eloquent-constraints-arent-preserved-between-requests) untuk detail lebih lanjut

Berikut contoh cepat mengatur properties sebagai berbagai tipe:

```php
public function mount()
{
    $this->todos = collect([]); // Collection

    $this->todos = Todos::all(); // Eloquent Collection

    $this->todo = Todos::first(); // Model

    $this->date = new DateTime('now'); // DateTime

    $this->date = new Carbon('now'); // Carbon

    $this->todo = str(''); // Stringable
}
```

### Mendukung tipe kustom

Livewire memungkinkan aplikasi Anda untuk mendukung tipe kustom melalui dua mekanisme yang kuat:

* Wireables
* Synthesizers

Wireables sederhana dan mudah digunakan untuk sebagian besar aplikasi, jadi kita akan menjelajahinya di bawah. Jika Anda adalah pengguna tingkat lanjut atau pembuat paket yang menginginkan lebih banyak fleksibilitas, [Synthesizers adalah pilihan yang tepat](/docs/synthesizers).

#### Wireables

Wireables adalah kelas apa pun dalam aplikasi Anda yang mengimplementasikan interface `Wireable`.

Sebagai contoh, mari kita bayangkan Anda memiliki objek `Customer` dalam aplikasi Anda yang berisi data utama tentang customer:

```php
class Customer
{
    protected $name;
    protected $age;

    public function __construct($name, $age)
    {
        $this->name = $name;
        $this->age = $age;
    }
}
```

Mencoba mengatur instance dari kelas ini ke property komponen Livewire akan menghasilkan kesalahan yang memberitahu Anda bahwa tipe property `Customer` tidak didukung:

```php
class ShowCustomer extends Component
{
    public Customer $customer;

    public function mount()
    {
        $this->customer = new Customer('Caleb', 29);
    }
}
```

Namun, Anda dapat menyelesaikan ini dengan mengimplementasikan interface `Wireable` dan menambahkan metode `toLivewire()` dan `fromLivewire()` ke kelas Anda. Metode-metode ini memberitahu Livewire cara mengubah properties dari tipe ini ke JSON dan kembali lagi:

```php
use Livewire\Wireable;

class Customer implements Wireable
{
    protected $name;
    protected $age;

    public function __construct($name, $age)
    {
        $this->name = $name;
        $this->age = $age;
    }

    public function toLivewire()
    {
        return [
            'name' => $this->name,
            'age' => $this->age,
        ];
    }

    public static function fromLivewire($value)
    {
        $name = $value['name'];
        $age = $value['age'];

        return new static($name, $age);
    }
}
```

Sekarang Anda dapat dengan bebas mengatur objek `Customer` pada komponen Livewire Anda dan Livewire akan tahu cara mengubah objek-objek ini ke JSON dan kembali ke PHP.

Seperti disebutkan sebelumnya, jika Anda ingin mendukung tipe secara lebih global dan kuat, Livewire menawarkan Synthesizers, mekanisme internal tingkat lanjutnya untuk menangani tipe property yang berbeda. [Pelajari lebih lanjut tentang Synthesizers](/docs/synthesizers).

## Mengakses properties dari JavaScript

Karena properties Livewire juga tersedia di browser melalui JavaScript, Anda dapat mengakses dan memanipulasi representasi JavaScriptnya dari [AlpineJS](https://alpinejs.dev/).

Alpine adalah library JavaScript ringan yang disertakan dengan Livewire. Alpine menyediakan cara untuk membangun interaksi ringan ke dalam komponen Livewire Anda tanpa membuat server roundtrip penuh.

Secara internal, frontend Livewire dibangun di atas Alpine. Faktanya, setiap komponen Livewire sebenarnya adalah komponen Alpine di balik layar. Ini berarti Anda dapat dengan bebas menggunakan Alpine di dalam komponen Livewire Anda.

Sisa halaman ini mengasumsikan keakraban dasar dengan Alpine. Jika Anda tidak familiar dengan Alpine, [lihat dokumentasi Alpine](https://alpinejs.dev/docs).

### Mengakses properties

Livewire mengekspos objek magic `$wire` ke Alpine. Anda dapat mengakses objek `$wire` dari ekspresi Alpine apa pun di dalam komponen Livewire Anda.

Objek `$wire` dapat diperlakukan seperti versi JavaScript dari komponen Livewire Anda. Objek ini memiliki semua properties dan metode yang sama dengan versi PHP dari komponen Anda, tetapi juga mengandung beberapa metode khusus untuk melakukan fungsi tertentu dalam template Anda.

Sebagai contoh, kita dapat menggunakan `$wire` untuk menampilkan hitungan karakter langsung dari field input `todo`:

```blade
<div>
    <input type="text" wire:model="todo">

    Todo character length: <h2 x-text="$wire.todo.length"></h2>
</div>
```

Saat user mengetik di field, panjang karakter dari todo yang sedang ditulis akan ditampilkan dan diperbarui secara langsung di halaman, semua tanpa mengirim permintaan jaringan ke server.

Jika Anda lebih suka, Anda dapat menggunakan metode `.get()` yang lebih eksplisit untuk mencapai hal yang sama:

```blade
<div>
    <input type="text" wire:model="todo">

    Todo character length: <h2 x-text="$wire.get('todo').length"></h2>
</div>
```

### Memanipulasi properties

Demikian pula, Anda dapat memanipulasi properties komponen Livewire Anda dalam JavaScript menggunakan `$wire`.

Sebagai contoh, mari kita tambahkan tombol "Clear" ke komponen `TodoList` untuk memungkinkan user me-reset field input hanya menggunakan JavaScript:

```blade
<div>
    <input type="text" wire:model="todo">

    <button x-on:click="$wire.todo = ''">Clear</button>
</div>
```

Setelah user mengklik "Clear", input akan di-reset ke string kosong, tanpa mengirim permintaan jaringan ke server.

Pada request berikutnya, nilai sisi server dari `$todo` akan diperbarui dan disinkronkan.

Jika Anda lebih suka, Anda juga dapat menggunakan metode `.set()` yang lebih eksplisit untuk mengatur properties di sisi klien. Namun, Anda harus perhatikan bahwa menggunakan `.set()` secara default segera memicu permintaan jaringan dan menyinkronkan state dengan server. Jika itu diinginkan, maka ini adalah API yang sangat baik:

```blade
<button x-on:click="$wire.set('todo', '')">Clear</button>
```

Untuk memperbarui property tanpa mengirim permintaan jaringan ke server, Anda dapat melewatkan parameter bool ketiga. Ini akan menunda permintaan jaringan dan pada request berikutnya, state akan disinkronkan di sisi server:
```blade
<button x-on:click="$wire.set('todo', '', false)">Clear</button>
```

## Keamanan

Meskipun properties Livewire adalah fitur yang kuat, ada beberapa pertimbangan keamanan yang harus Anda ketahui sebelum menggunakannya.

Singkatnya, selalu perlakukan public properties sebagai input user — seolah-olah mereka adalah input request dari endpoint tradisional. Mengingat hal ini, sangat penting untuk memvalidasi dan mengotorisasi properties sebelum mempertahankannya ke database — sama seperti yang Anda lakukan saat bekerja dengan input request dalam controller.

### Jangan percaya nilai properties

Untuk menunjukkan bagaimana kelalaian dalam mengotorisasi dan memvalidasi properties dapat memperkenalkan lubang keamanan dalam aplikasi Anda, komponen `UpdatePost` berikut rentan terhadap serangan:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public $id;
    public $title;
    public $content;

    public function mount(Post $post)
    {
        $this->id = $post->id;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function update()
    {
        $post = Post::findOrFail($this->id);

        $post->update([
            'title' => $this->title,
            'content' => $this->content,
        ]);

        session()->flash('message', 'Post updated successfully!');
    }

    public function render()
    {
        return view('livewire.update-post');
    }
}
```

```blade
<form wire:submit="update">
    <input type="text" wire:model="title">
    <input type="text" wire:model="content">

    <button type="submit">Update</button>
</form>
```

Pada pandangan pertama, komponen ini mungkin terlihat sepenuhnya baik. Tapi, mari kita telusuri bagaimana penyerang dapat menggunakan komponen untuk melakukan hal-hal tidak sah dalam aplikasi Anda.

Karena kita menyimpan `id` dari post sebagai public property pada komponen, id tersebut dapat dimanipulasi di klien sama seperti properties `title` dan `content`.

Tidak masalah jika kita tidak menulis input dengan `wire:model="id"`. User berbahaya dapat dengan mudah mengubah view ke berikut menggunakan DevTools browser mereka:

```blade
<form wire:submit="update">
    <input type="text" wire:model="id"> <!-- [tl! highlight] -->
    <input type="text" wire:model="title">
    <input type="text" wire:model="content">

    <button type="submit">Update</button>
</form>
```

Sekarang user berbahaya dapat memperbarui input `id` ke ID dari model post yang berbeda. Ketika form disubmit dan `update()` dipanggil, `Post::findOrFail()` akan mengembalikan dan memperbarui post yang bukan milik user.

Untuk mencegah jenis serangan ini, kita dapat menggunakan satu atau kedua strategi berikut:

* Mengotorisasi input
* Mengunci property dari pembaruan

#### Mengotorisasi input

Karena `$id` dapat dimanipulasi di sisi klien dengan sesuatu seperti `wire:model`, sama seperti dalam controller, kita dapat menggunakan [otorisasi Laravel](https://laravel.com/docs/authorization) untuk memastikan user saat ini dapat memperbarui post:

```php
public function update()
{
    $post = Post::findOrFail($this->id);

    $this->authorize('update', $post); // [tl! highlight]

    $post->update(...);
}
```

Jika user berbahaya mengubah property `$id`, otorisasi yang ditambahkan akan menangkapnya dan melempar kesalahan.

#### Mengunci property

Livewire juga memungkinkan Anda untuk "mengunci" properties untuk mencegah properties dimodifikasi di sisi klien. Anda dapat "mengunci" property dari manipulasi sisi klien menggunakan atribut `#[Locked]`:

```php
use Livewire\Attributes\Locked;
use Livewire\Component;

class UpdatePost extends Component
{
    #[Locked] // [tl! highlight]
    public $id;

    // ...
}
```

Sekarang, jika user mencoba memodifikasi `$id` di front end, kesalahan akan dilempar.

Dengan menggunakan `#[Locked]`, Anda dapat berasumsi bahwa property ini tidak dimanipulasi di mana pun di luar kelas komponen Anda.

Untuk informasi lebih lanjut tentang mengunci properties, [lihat dokumentasi Locked properties](/docs/locked).

#### Model Eloquent dan penguncian

Ketika model Eloquent ditetapkan ke property komponen Livewire, Livewire akan secara otomatis mengunci property dan memastikan ID tidak berubah, sehingga Anda aman dari jenis serangan ini:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public Post $post; // [tl! highlight]
    public $title;
    public $content;

    public function mount(Post $post)
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function update()
    {
        $this->post->update([
            'title' => $this->title,
            'content' => $this->content,
        ]);

        session()->flash('message', 'Post updated successfully!');
    }

    public function render()
    {
        return view('livewire.update-post');
    }
}
```

### Properties mengekspos informasi sistem ke browser

Hal penting lainnya yang harus diingat adalah bahwa properties Livewire diserialisasikan atau "dehidrasi" sebelum dikirim ke browser. Ini berarti bahwa nilainya dikonversi ke format yang dapat dikirim melalui jaringan dan dipahami oleh JavaScript. Format ini dapat mengekspos informasi tentang aplikasi Anda ke browser, termasuk nama dan nama kelas dari properties Anda.

Sebagai contoh, misalkan Anda memiliki komponen Livewire yang mendefinisikan public property bernama `$post`. Property ini berisi instance dari model `Post` dari database Anda. Dalam kasus ini, nilai yang dihidrasi dari property ini yang dikirim melalui jaringan mungkin terlihat seperti ini:

```json
{
    "type": "model",
    "class": "App\Models\Post",
    "key": 1,
    "relationships": []
}
```

Seperti yang Anda lihat, nilai yang dihidrasi dari property `$post` termasuk nama kelas dari model (`App\Models\Post`) serta ID dan relationship apa pun yang telah di-eager-load.

Jika Anda tidak ingin mengekspos nama kelas dari model, Anda dapat menggunakan fungsionalitas "morphMap" Laravel dari service provider untuk menetapkan alias ke nama kelas model:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Relation::morphMap([
            'post' => 'App\Models\Post',
        ]);
    }
}
```

Sekarang, ketika model Eloquent "dehidrasi" (diserialisasikan), nama kelas asli tidak akan terekspos, hanya alias "post":

```json
{
    "type": "model",
    "class": "App\Models\Post", // [tl! remove]
    "class": "post", // [tl! add]
    "key": 1,
    "relationships": []
}
```

### Constraint Eloquent tidak dipertahankan antara request

Biasanya, Livewire mampu mempertahankan dan membuat ulang properties sisi server antara request; namun, ada skenario tertentu di mana mempertahankan nilai tidak mungkin antara request.

Sebagai contoh, saat menyimpan Eloquent collections sebagai properties Livewire, constraint query tambahan seperti `select(...)` tidak akan diterapkan kembali pada request berikutnya.

Untuk mendemonstrasikan, pertimbangkan komponen `ShowTodos` berikut dengan constraint `select()` diterapkan ke Eloquent collection `Todos`:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class ShowTodos extends Component
{
    public $todos;

    public function mount()
    {
        $this->todos = Auth::user()
            ->todos()
            ->select(['title', 'content']) // [tl! highlight]
            ->get();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

Ketika komponen ini dimuat awalnya, property `$todos` akan diatur ke Eloquent collection dari todos user; namun, hanya field `title` dan `content` dari setiap baris dalam database yang akan di-query dan dimuat ke dalam setiap model.

Ketika Livewire _menghidrasi_ JSON dari property ini kembali ke PHP pada request berikutnya, constraint select akan hilang.

Untuk memastikan integritas query Eloquent, kami merekomendasikan Anda menggunakan [computed properties](/docs/computed-properties) sebagai gantinya properties.

Computed properties adalah metode dalam komponen Anda yang ditandai dengan atribut `#[Computed]`. Mereka dapat diakses sebagai property dinamis yang tidak disimpan sebagai bagian dari state komponen tetapi sebagai gantinya dievaluasi on-the-fly.

Berikut contoh di atas ditulis ulang menggunakan computed property:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowTodos extends Component
{
    #[Computed] // [tl! highlight]
    public function todos()
    {
        return Auth::user()
            ->todos()
            ->select(['title', 'content'])
            ->get();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

Berikut cara Anda akan mengakses _todos_ ini dari view Blade:

```blade
<ul>
    @foreach ($this->todos as $todo)
        <li>{{ $todo }}</li>
    @endforeach
</ul>
```

Perhatikan, di dalam view Anda, Anda hanya dapat mengakses computed properties pada objek `$this` seperti ini: `$this->todos`.

Anda juga dapat mengakses `$todos` dari dalam kelas Anda. Sebagai contoh, jika Anda memiliki aksi `markAllAsComplete()`:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowTodos extends Component
{
    #[Computed]
    public function todos()
    {
        return Auth::user()
            ->todos()
            ->select(['title', 'content'])
            ->get();
    }

    public function markAllComplete() // [tl! highlight:3]
    {
        $this->todos->each->complete();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

Anda mungkin bertanya-tanya mengapa tidak hanya memanggil `$this->todos()` sebagai metode langsung di tempat Anda membutuhkannya? Mengapa menggunakan `#[Computed]` pada awalnya?

Alasannya adalah bahwa computed properties memiliki keuntungan performa, karena mereka secara otomatis di-cache setelah penggunaan pertama mereka selama request tunggal. Ini berarti Anda dapat dengan bebas mengakses `$this->todos` dalam komponen Anda dan yakin bahwa metode aktual hanya akan dipanggil sekali, sehingga Anda tidak menjalankan query mahal beberapa kali dalam request yang sama.

Untuk informasi lebih lanjut, [kunjungi dokumentasi computed properties](/docs/computed-properties).