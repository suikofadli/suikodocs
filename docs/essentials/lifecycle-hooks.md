---
sidebar_position: 9
---

# Lifecycle Hooks

Livewire menyediakan berbagai *lifecycle hooks* yang memungkinkan Anda untuk mengeksekusi kode pada titik-titik tertentu selama *lifecycle component*. *Hook* ini memungkinkan Anda untuk melakukan tindakan sebelum atau setelah *event* tertentu, seperti menginisialisasi *component*, memperbarui *properties*, atau merender *template*.

Berikut adalah daftar semua lifecycle hook komponen yang tersedia:

| Metode Hook      | Deskripsi                                                                     |
|------------------|---------------------------------------------------------------------------------|
| `mount()`        | Dipanggil ketika komponen dibuat                                              |
| `hydrate()`      | Dipanggil ketika komponen di-rehydrate di awal request berikutnya |
| `boot()`         | Dipanggil di awal setiap request. Baik awal, dan berikutnya          |
| `updating()`     | Dipanggil sebelum memperbarui property komponen                                     |
| `updated()`      | Dipanggil setelah memperbarui property                                                |
| `rendering()`    | Dipanggil sebelum `render()` dipanggil                                              |
| `rendered()`     | Dipanggil setelah `render()` dipanggil                                               |
| `dehydrate()`    | Dipanggil di akhir setiap request komponen                                    |
| `exception($e, $stopPropagation)` | Dipanggil ketika exception dilempar                     |                    |

## Mount

Dalam *kelas PHP* standar, *constructor* (`__construct()`) menerima parameter luar dan menginisialisasi *state objek*. Namun, di Livewire, Anda menggunakan metode `mount()` untuk menerima parameter dan menginisialisasi *state component* Anda.

*Component* Livewire tidak menggunakan `__construct()` karena *component* Livewire _dibangun kembali_ pada *request jaringan* berikutnya, dan kami hanya ingin menginisialisasi *component* sekali ketika pertama kali dibuat.

Berikut adalah contoh menggunakan metode `mount()` untuk menginisialisasi *properties* `name` dan `email` dari *component* `UpdateProfile`:

```php
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class UpdateProfile extends Component
{
    public $name;

    public $email;

    public function mount()
    {
        $this->name = Auth::user()->name;

        $this->email = Auth::user()->email;
    }

    // ...
}
```

Seperti disebutkan sebelumnya, metode `mount()` menerima data yang dimasukkan ke dalam *component* sebagai parameter metode:

```php
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public $title;

    public $content;

    public function mount(Post $post)
    {
        $this->title = $post->title;

        $this->content = $post->content;
    }

    // ...
}
```

> [!tip] Anda dapat menggunakan *dependency injection* dengan semua metode *hook*
> Livewire memungkinkan Anda untuk menyelesaikan *dependencies* dari [*service container* Laravel](https://laravel.com/docs/container#automatic-injection) dengan *type-hinting* parameter metode pada *lifecycle hooks*.

Metode `mount()` adalah bagian penting dari penggunaan Livewire. Dokumentasi berikut menyediakan contoh lebih lanjut tentang penggunaan metode `mount()` untuk menyelesaikan tugas-tugas umum:

* [Menginisialisasi *properties*](/docs/properties#initializing-properties)
* [Menerima data dari *component induk*](/docs/nesting#passing-props-to-children)
* [Mengakses *parameter route*](/docs/components#accessing-route-parameters)

## Boot

Se/helpful `mount()`, ini hanya berjalan sekali per *lifecycle component*, dan Anda mungkin ingin menjalankan logika di awal setiap *request* ke *server* untuk *component* tertentu.

Untuk kasus ini, Livewire menyediakan metode `boot()` di mana Anda dapat menulis kode *setup component* yang Anda niatkan untuk dijalankan setiap kali *kelas component* di-*boot*: baik pada inisialisasi maupun pada *request* berikutnya.

Metode `boot()` dapat berguna untuk hal-hal seperti menginisialisasi *protected properties*, yang tidak dipertahankan antar *request*. Di bawah ini adalah contoh menginisialisasi *protected property* sebagai *model Eloquent*:

```php
use Livewire\Attributes\Locked;
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    #[Locked]
    public $postId = 1;

    protected Post $post;

    public function boot() // [tl! highlight:3]
    {
        $this->post = Post::find($this->postId);
    }

    // ...
}
```

Anda dapat menggunakan teknik ini untuk memiliki kontrol penuh atas menginisialisasi property komponen dalam komponen Livewire Anda.

> [!tip] Sebagian besar waktu, Anda dapat menggunakan *computed property* sebagai gantinya
> Teknik yang digunakan di atas kuat; namun, seringkali lebih baik untuk menggunakan [*computed properties* Livewire](/docs/computed-properties) untuk menyelesaikan *use case* ini.

> [!warning] Selalu kunci *public properties* yang sensitif
> Seperti yang Anda lihat di atas, kami menggunakan *attribute* `#[Locked]` pada *property* `$postId`. Dalam skenario seperti di atas, di mana Anda ingin memastikan *property* `$postId` tidak diubah oleh *user* di *sisi klien*, penting untuk mengotorisasi nilai *property* sebelum menggunakannya atau menambahkan `#[Locked]` ke *property* untuk memastikannya tidak pernah berubah.
>
> Untuk informasi lebih lanjut, periksa [dokumentasi tentang Locked properties](/docs/locked).


## Update

*User* di *sisi klien* dapat memperbarui *public properties* dengan banyak cara berbeda, yang paling umum dengan memodifikasi *input* yang memiliki `wire:model` di atasnya.

Livewire menyediakan *hook* yang mudah untuk mencegat pembaruan *public property* sehingga Anda dapat memvalidasi atau mengotorisasi nilai sebelum diatur, atau memastikan *property* diatur dalam format tertentu.

Di bawah ini adalah contoh menggunakan `updating` untuk mencegah modifikasi property `$postId`.

Perlu dicatat bahwa untuk contoh khusus ini, dalam aplikasi aktual, Anda harus menggunakan [atribut `#[Locked]`](/docs/locked) sebagai gantinya, seperti dalam contoh di atas.

```php
use Exception;
use Livewire\Component;

class ShowPost extends Component
{
    public $postId = 1;

    public function updating($property, $value)
    {
        // $property: Nama property saat ini yang sedang diperbarui
        // $value: Nilai yang akan diatur ke property

        if ($property === 'postId') {
            throw new Exception;
        }
    }

    // ...
}
```

Metode `updating()` di atas berjalan sebelum property diperbarui, memungkinkan Anda untuk menangkap input yang tidak valid dan mencegah property diperbarui. Di bawah ini adalah contoh menggunakan `updated()` untuk memastikan nilai property tetap konsisten:

```php
use Livewire\Component;

class CreateUser extends Component
{
    public $username = '';

    public $email = '';

    public function updated($property)
    {
        // $property: Nama property saat ini yang telah diperbarui

        if ($property === 'username') {
            $this->username = strtolower($this->username);
        }
    }

    // ...
}
```

Sekarang, kapan pun *property* `$username` diperbarui di *sisi klien*, kami akan memastikan bahwa nilai akan selalu huruf kecil.

Karena Anda sering menargetkan *property* tertentu saat menggunakan *update hooks*, Livewire memungkinkan Anda untuk menentukan nama *property* langsung sebagai bagian dari nama metode. Berikut adalah contoh yang sama dari atas tetapi ditulis ulang memanfaatkan teknik ini:

```php
use Livewire\Component;

class CreateUser extends Component
{
    public $username = '';

    public $email = '';

    public function updatedUsername()
    {
        $this->username = strtolower($this->username);
    }

    // ...
}
```

Tentu saja, Anda juga dapat menerapkan teknik ini ke hook `updating`.

### Array

Array properties memiliki argumen `$key` tambahan yang dilewatkan ke fungsi-fungsi ini untuk menentukan elemen yang berubah.

Perhatikan bahwa ketika array itu sendiri diperbarui alih-alih kunci tertentu, argumen `$key` adalah null.

```php
use Livewire\Component;

class UpdatePreferences extends Component
{
    public $preferences = [];

    public function updatedPreferences($value, $key)
    {
        // $value = 'dark'
        // $key   = 'theme'
    }

    // ...
}
```

## Hydrate & Dehydrate

*Hydrate* dan *dehydrate* adalah *hook* yang kurang dikenal dan kurang dimanfaatkan. Namun, ada skenario tertentu di mana mereka dapat menjadi kuat.

Istilah "dehydrate" dan "hydrate" mengacu pada *component* Livewire yang diserialisasikan ke JSON untuk *sisi klien* dan kemudian di-unserialisasikan kembali ke *objek PHP* pada *request* berikutnya.

Kami sering menggunakan istilah "hydrate" dan "dehydrate" untuk merujuk ke proses ini di seluruh codebase dan dokumentasi Livewire. Jika Anda ingin lebih jelas tentang istilah-istilah ini, Anda dapat mempelajari lebih lanjut dengan [mengkonsultasikan dokumentasi hidrasi kami](/docs/hydration).

Mari kita lihat contoh yang menggunakan `mount()`, `hydrate()`, dan `dehydrate()` semua bersama-sama untuk mendukung penggunaan *custom* [*data transfer object* (DTO)](https://en.wikipedia.org/wiki/Data_transfer_object) alih-alih *model Eloquent* untuk menyimpan data *post* dalam *component*:

```php
use Livewire\Component;

class ShowPost extends Component
{
    public $post;

    public function mount($title, $content)
    {
        // Berjalan di awal request awal pertama...

        $this->post = new PostDto([
            'title' => $title,
            'content' => $content,
        ]);
    }

    public function hydrate()
    {
        // Berjalan di awal setiap request "berikutnya"...
        // Ini tidak berjalan pada request awal ("mount" yang melakukannya)...

        $this->post = new PostDto($this->post);
    }

    public function dehydrate()
    {
        // Berjalan di akhir setiap request tunggal...

        $this->post = $this->post->toArray();
    }

    // ...
}
```

Sekarang, dari *action* dan tempat lain di dalam *component* Anda, Anda dapat mengakses *objek* `PostDto` alih-alih data *primitif*.

Contoh di atas terutama mendemonstrasikan kemampuan dan sifat dari *hook* `hydrate()` dan `dehydrate()`. Namun, disarankan agar Anda menggunakan [*Wireables* atau *Synthesizers*](/docs/properties#supporting-custom-types) untuk menyelesaikan ini sebagai gantinya.

## Render

Jika Anda ingin mengaitkan ke proses *rendering view Blade component*, Anda dapat melakukannya menggunakan *hook* `rendering()` dan `rendered()`:

```php
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function render()
    {
        return view('livewire.show-posts', [
            'post' => Post::all(),
        ])
    }

    public function rendering($view, $data)
    {
        // Berjalan SEBELUM view yang disediakan dirender...
        //
        // $view: View yang akan dirender
        // $data: Data yang disediakan ke view
    }

    public function rendered($view, $html)
    {
        // Berjalan SETELAH view yang disediakan dirender...
        //
        // $view: View yang dirender
        // $html: HTML final yang dirender
    }

    // ...
}
```

## Exception

Terkadang dapat membantu untuk mencegat dan menangkap kesalahan, misalnya: untuk menyesuaikan pesan kesalahan atau mengabaikan jenis *exception* tertentu. *Hook* `exception()` memungkinkan Anda untuk melakukan hal itu: Anda dapat melakukan pemeriksaan pada `$error`, dan menggunakan parameter `$stopPropagation` untuk menangkap masalah.
Ini juga membuka *pola* yang kuat ketika Anda ingin menghentikan eksekusi kode lebih lanjut (*kembali lebih awal*), ini adalah cara kerja metode internal seperti `validate()`.

```php
use Livewire\Component;

class ShowPost extends Component
{
    public function mount() // [tl! highlight:3]
    {
        $this->post = Post::find($this->postId);
    }

    public function exception($e, $stopPropagation) {
        if ($e instanceof NotFoundException) {
            $this->notify('Post is not found');
            $stopPropagation();
        }
    }

    // ...
}
```

## Menggunakan hook di dalam trait

*Traits* adalah cara yang berguna untuk menggunakan kembali kode di seluruh *component* atau mengekstrak kode dari *component tunggal* ke file yang didedikasikan.

Untuk menghindari beberapa *traits* bentrok satu sama lain saat mendeklarasikan metode *lifecycle hook*, Livewire mendukung *prefixing* metode *hook* dengan nama *camelCased* dari *trait* saat ini yang mendeklarasikannya.

Dengan cara ini, Anda dapat memiliki beberapa *traits* menggunakan *lifecycle hooks* yang sama dan menghindari definisi metode yang bentrok.

Di bawah ini adalah contoh *component* yang mereferensikan *trait* yang disebut `HasPostForm`:

```php
use Livewire\Component;

class CreatePost extends Component
{
    use HasPostForm;

    // ...
}
```

Sekarang berikut adalah trait `HasPostForm` aktual yang berisi semua hook yang tersedia yang di-prefix:

```php
trait HasPostForm
{
    public $title = '';

    public $content = '';

    public function mountHasPostForm()
    {
        // ...
    }

    public function hydrateHasPostForm()
    {
        // ...
    }

    public function bootHasPostForm()
    {
        // ...
    }

    public function updatingHasPostForm()
    {
        // ...
    }

    public function updatedHasPostForm()
    {
        // ...
    }

    public function renderingHasPostForm()
    {
        // ...
    }

    public function renderedHasPostForm()
    {
        // ...
    }

    public function dehydrateHasPostForm()
    {
        // ...
    }

    // ...
}
```

## Menggunakan hook di dalam objek form

*Form objects* di Livewire mendukung *hook pembaruan property*. *Hook* ini bekerja mirip dengan [*hook pembaruan component*](#update), memungkinkan Anda melakukan tindakan ketika *properties* dalam *form object* berubah.

Di bawah ini adalah contoh *component* yang menggunakan *form object* `PostForm`:

```php
use Livewire\Component;

class CreatePost extends Component
{
    public PostForm $form;

    // ...
}
```

Berikut adalah objek form `PostForm` yang berisi semua hook yang tersedia:

```php
namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    public $title = '';

    public $tags = [];

    public function updating($property, $value)
    {
        // ...
    }

    public function updated($property, $value)
    {
        // ...
    }

    public function updatingTitle($value)
    {
        // ...
    }

    public function updatedTitle($value)
    {
        // ...
    }

    public function updatingTags($value, $key)
    {
        // ...
    }

    public function updatedTags($value, $key)
    {
        // ...
    }

    // ...
}
```