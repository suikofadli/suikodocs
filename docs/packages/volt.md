---
sidebar_position: 53
---

# Volt

> [!warning] Kenali Livewire terlebih dahulu
> Sebelum menggunakan Volt, kami merekomendasikan agar Anda terbiasa dengan penggunaan Livewire berbasis kelas standar. Ini akan memungkinkan Anda untuk mentransfer pengetahuan Livewire Anda dengan cepat ke dalam menulis komponen menggunakan API fungsional Volt.

Volt adalah API fungsional yang dibuat dengan elegan untuk Livewire yang mendukung komponen file tunggal, memungkinkan logika PHP komponen dan template Blade untuk hidup berdampingan dalam file yang sama. Di balik layar, API fungsional dikompilasi ke komponen kelas Livewire dan ditautkan dengan template yang ada dalam file yang sama.

Komponen Volt sederhana terlihat seperti berikut:

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

## Instalasi

Untuk memulai, instal Volt ke dalam proyek Anda menggunakan manajer paket Composer:

```bash
composer require livewire/volt
```

Setelah menginstal Volt, Anda dapat menjalankan perintah Artisan `volt:install`, yang akan menginstal file service provider Volt ke dalam aplikasi Anda. Service provider ini menentukan direktori yang dipasang di mana Volt akan mencari komponen file tunggal:

```bash
php artisan volt:install
```

## Membuat komponen

Anda dapat membuat komponen Volt dengan menempatkan file dengan ekstensi `.blade.php` di salah satu direktori Volt yang dipasang. Secara default, `VoltServiceProvider` memasang direktori `resources/views/livewire` dan `resources/views/pages`, tetapi Anda dapat menyesuaikan direktori ini dalam metode `boot` service provider Volt Anda.

Untuk kemudahan, Anda dapat menggunakan perintah Artisan `make:volt` untuk membuat komponen Volt baru:

```bash
php artisan make:volt counter
```

Dengan menambahkan direktif `--test` saat membuat komponen, file tes yang sesuai juga akan dibuat. Jika Anda ingin tes terkait menggunakan [Pest](https://pestphp.com/), Anda harus menggunakan flag `--pest`:

```bash
php artisan make:volt counter --test --pest
```

Dengan menambahkan direktif `--class` akan menghasilkan komponen volt berbasis kelas.

```bash
php artisan make:volt counter --class
```

## Gaya API

Dengan memanfaatkan API fungsional Volt, kita dapat mendefinisikan logika komponen Livewire melalui fungsi `Livewire\Volt` yang diimpor. Volt kemudian mengubah dan mengompilasi kode fungsional ke dalam kelas Livewire konvensional, memungkinkan kita untuk memanfaatkan kemampuan luas Livewire dengan boilerplate yang dikurangi.

API Volt secara otomatis mengikat closure apa pun yang digunakannya ke komponen yang mendasarinya. Jadi, kapan saja, aksi, computed properties, atau pendengar dapat merujuk ke komponen menggunakan variabel `$this`:

```php
use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

// ...
```

### Komponen Volt berbasis kelas

Jika Anda ingin menikmati kemampuan komponen file tunggal Volt sambil tetap menulis komponen berbasis kelas, kami telah membantu Anda. Untuk memulai, definisikan kelas anonim yang memperluas `Livewire\Volt\Component`. Di dalam kelas, Anda dapat memanfaatkan semua fitur Livewire menggunakan sintaks Livewire tradisional:

```blade
<?php

use Livewire\Volt\Component;

new class extends Component {
    public $count = 0;

    public function increment()
    {
        $this->count++;
    }
} ?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

#### Atribut kelas

Seperti komponen Livewire biasa, komponen Volt mendukung atribut kelas. Saat menggunakan kelas PHP anonim, atribut kelas harus didefinisikan setelah kata kunci `new`:

```blade
<?php

use Livewire\Attributes\{Layout, Title};
use Livewire\Volt\Component;

new
#[Layout('layouts.guest')]
#[Title('Login')]
class extends Component
{
    public string $name = '';

    // ...
```

#### Menyediakan data view tambahan

Saat menggunakan komponen Volt berbasis kelas, view yang dirender adalah template yang ada dalam file yang sama. Jika Anda perlu meneruskan data tambahan ke view setiap kali dirender, Anda dapat menggunakan metode `with`. Data ini akan diteruskan ke view selain dari public properties komponen:

```blade
<?php

use Livewire\WithPagination;
use Livewire\Volt\Component;
use App\Models\Post;

new class extends Component {
    use WithPagination;

    public function with(): array
    {
        return [
            'posts' => Post::paginate(10),
        ];
    }
} ?>

<div>
    <!-- ... -->
</div>
```

#### Memodifikasi instance view

Terkadang, Anda mungkin ingin berinteraksi langsung dengan instance view, misalnya, untuk mengatur judul view menggunakan string yang diterjemahkan. Untuk mencapai ini, Anda dapat mendefinisikan metode `rendering` pada komponen Anda:

```blade
<?php

use Illuminate\View\View;
use Livewire\Volt\Component;

new class extends Component {
    public function rendering(View $view): void
    {
        $view->title('Create Post');

        // ...
    }

    // ...
```

## Rendering dan mounting komponen

Sama seperti komponen Livewire biasa, komponen Volt dapat dirender menggunakan sintaks tag Livewire atau direktif Blade `@livewire`:

```blade
<livewire:user-index :users="$users" />
```

Untuk mendeklarasikan properties yang diterima komponen, Anda dapat menggunakan fungsi `state`:

```php
use function Livewire\Volt\{state};

state('users');

// ...
```

Jika perlu, Anda dapat mencegat properties yang diteruskan ke komponen dengan menyediakan closure ke fungsi `state`, memungkinkan Anda untuk berinteraksi dengan dan memodifikasi nilai yang diberikan:

```php
use function Livewire\Volt\{state};

state(['count' => fn ($users) => count($users)]);
```

Fungsi `mount` dapat digunakan untuk mendefinisikan [lifecycle hook](/docs/lifecycle-hooks) "mount" dari komponen Livewire. Parameter yang disediakan ke komponen akan disuntikkan ke dalam metode ini. Parameter lain yang diperlukan oleh hook mount akan diselesaikan oleh service container Laravel:

```php
use App\Services\UserCounter;
use function Livewire\Volt\{mount};

mount(function (UserCounter $counter, $users) {
    $counter->store('userCount', count($users));

    // ...
});
```

### Komponen halaman penuh

Secara opsional, Anda dapat merender komponen Volt sebagai komponen halaman penuh dengan mendefinisikan rute Volt di file `routes/web.php` aplikasi Anda:

```php
use Livewire\Volt\Volt;

Volt::route('/users', 'user-index');
```

Secara default, komponen akan dirender menggunakan layout `components.layouts.app`. Anda dapat menyesuaikan file layout ini menggunakan fungsi `layout`:

```php
use function Livewire\Volt\{layout, state};

state('users');

layout('components.layouts.admin');

// ...
```

Anda juga dapat menyesuaikan judul halaman menggunakan fungsi `title`:

```php
use function Livewire\Volt\{layout, state, title};

state('users');

layout('components.layouts.admin');

title('Users');

// ...
```

Jika judul bergantung pada state komponen atau dependensi eksternal, Anda dapat melewatkan closure ke fungsi `title` sebagai gantinya:

```php
use function Livewire\Volt\{layout, state, title};

state('users');

layout('components.layouts.admin');

title(fn () => 'Users: ' . $this->users->count());
```

## Properties

Properties Volt, seperti properties Livewire, dapat diakses dengan mudah dalam view dan bertahan antara pembaruan Livewire. Anda dapat mendefinisikan property menggunakan fungsi `state`:

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

?>

<div>
    {{ $count }}
</div>
```

Jika nilai awal property state bergantung pada dependensi luar, seperti query database, model, atau layanan container, resolusinya harus dikapsulkan dalam closure. Ini mencegah nilai diselesaikan sampai benar-benar diperlukan:

```php
use App\Models\User;
use function Livewire\Volt\{state};

state(['count' => fn () => User::count()]);
```

Jika nilai awal property state disuntikkan melalui [route model binding Laravel Folio's](https://github.com/laravel/folio), itu juga harus dikapsulkan dalam closure:

```php
use App\Models\User;
use function Livewire\Volt\{state};

state(['user' => fn () => $user]);
```

Tentu saja, properties juga dapat dideklarasikan tanpa secara eksplisit menentukan nilai awalnya. Dalam kasus seperti itu, nilai awalnya akan `null` atau akan diatur berdasarkan properties yang diteruskan ke komponen saat dirender:

```php
use function Livewire\Volt\{mount, state};

state(['count']);

mount(function ($users) {
    $this->count = count($users);

    //
});
```

### Properties terkunci

Livewire menawarkan kemampuan untuk melindungi properties dengan memungkinkan Anda untuk "mengunci" mereka, sehingga mencegah modifikasi apa pun terjadi di sisi klien. Untuk mencapai ini menggunakan Volt, cukup rantai metode `locked` pada state yang ingin Anda lindungi:

```php
state(['id'])->locked();
```

### Properties reaktif

Saat bekerja dengan komponen bersarang, Anda mungkin menemukan diri Anda dalam situasi di mana Anda perlu meneruskan property dari komponen induk ke komponen anak, dan memiliki komponen anak [secara otomatis diperbarui](/docs/nesting#reactive-props) ketika komponen induk memperbarui property.

Untuk mencapai ini menggunakan Volt, Anda dapat merantai metode `reactive` pada state yang ingin Anda reaktifkan:

```php
state(['todos'])->reactive();
```

### Properties yang dapat dimodel

Dalam kasus di mana Anda tidak ingin menggunakan properties reaktif, Livewire menyediakan [fitur modelable](/docs/nesting#binding-to-child-data-using-wiremodel) di mana Anda dapat membagikan state antara komponen induk dan komponen anak menggunakan `wire:model` langsung pada komponen anak.

Untuk mencapai ini menggunakan Volt, cukup rantai metode `modelable` pada state yang ingin Anda modelable:

```php
state(['form'])->modelable();
```

### Computed properties

Livewire juga memungkinkan Anda untuk mendefinisikan [computed properties](/docs/computed-properties), yang dapat berguna untuk mengambil informasi secara malas yang dibutuhkan oleh komponen Anda. Hasil computed property "dimemoisasi", atau di-cache dalam memori, untuk lifecycle request Livewire individu.

Untuk mendefinisikan computed property, Anda dapat menggunakan fungsi `computed`. Nama variabel akan menentukan nama computed property:

```php
<?php

use App\Models\User;
use function Livewire\Volt\{computed};

$count = computed(function () {
    return User::count();
});

?>

<div>
    {{ $this->count }}
</div>
```

Anda dapat mempertahankan nilai computed property dalam cache aplikasi Anda dengan merantai metode `persist` ke definisi computed property:

```php
$count = computed(function () {
    return User::count();
})->persist();
```

Secara default, Livewire menyimpan nilai computed property selama 3600 detik. Anda dapat menyesuaikan nilai ini dengan menyediakan jumlah detik yang diinginkan ke metode `persist`:

```php
$count = computed(function () {
    return User::count();
})->persist(seconds: 10);
```

## Aksi

[aksi](/docs/actions) Livewire menyediakan cara yang mudah untuk mendengarkan interaksi halaman dan memanggil metode yang sesuai pada komponen Anda, menghasilkan rendering ulang komponen. Seringkali, aksi dipanggil sebagai respons terhadap user yang mengklik tombol.

Untuk mendefinisikan aksi Livewire menggunakan Volt, Anda hanya perlu mendefinisikan closure. Nama variabel yang berisi closure akan menentukan nama aksi:

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

Di dalam closure, variabel `$this` diikat ke komponen Livewire yang mendasarinya, memberi Anda kemampuan untuk mengakses metode lain pada komponen seperti yang Anda lakukan pada komponen Livewire biasa:

```php
use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = function () {
    $this->dispatch('count-updated');

    //
};
```

Aksi Anda juga dapat menerima argumen atau dependensi dari service container Laravel:

```php
use App\Repositories\PostRepository;
use function Livewire\Volt\{state};

state(['postId']);

$delete = function (PostRepository $posts) {
    $posts->delete($this->postId);

    // ...
};
```

### Aksi tanpa render

Dalam beberapa kasus, komponen Anda mungkin mendeklarasikan aksi yang tidak melakukan operasi apa pun yang akan menyebabkan template Blade yang dirender komponen berubah. Jika itu masalahnya, Anda dapat [melewati fase rendering](/docs/actions#skipping-re-renders) dari lifecycle Livewire dengan mengenkapsulasi aksi dalam fungsi `action` dan merantai metode `renderless` ke definisinya:

```php
use function Livewire\Volt\{action};

$incrementViewCount = action(fn () => $this->viewCount++)->renderless();
```

### Helper yang dilindungi

Secara default, semua aksi Volt adalah "public" dan dapat dipanggil oleh klien. Jika Anda ingin membuat fungsi yang [hanya dapat diakses dari dalam aksi Anda](/docs/actions#keep-dangerous-methods-protected-or-private), Anda dapat menggunakan fungsi `protect`:

```php
use App\Repositories\PostRepository;
use function Livewire\Volt\{protect, state};

state(['postId']);

$delete = function (PostRepository $posts) {
    $this->ensurePostCanBeDeleted();

    $posts->delete($this->postId);

    // ...
};

$ensurePostCanBeDeleted = protect(function () {
    // ...
});
```

## Form

[form](/docs/forms) Livewire menyediakan cara yang mudah untuk menangani validasi dan pengiriman form dalam satu kelas. Untuk menggunakan form Livewire dalam komponen Volt, Anda dapat memanfaatkan fungsi `form`:

```php
<?php

use App\Livewire\Forms\PostForm;
use function Livewire\Volt\{form};

form(PostForm::class);

$save = function () {
    $this->form->store();

    // ...
};

?>

<form wire:submit="save">
    <input type="text" wire:model="form.title">
    @error('form.title') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save</button>
</form>
```

Seperti yang Anda lihat, fungsi `form` menerima nama kelas form Livewire. Setelah didefinisikan, form dapat diakses melalui property `$this->form` dalam komponen Anda.

Jika Anda ingin menggunakan nama property yang berbeda untuk form Anda, Anda dapat meneruskan nama sebagai argumen kedua ke fungsi `form`:

```php
form(PostForm::class, 'postForm');

$save = function () {
    $this->postForm->store();

    // ...
};
```

## Pendengar

[sistem event global](/docs/events) Livewire memungkinkan komunikasi antar komponen. Jika ada dua komponen Livewire yang ada di halaman, mereka dapat berkomunikasi dengan memanfaatkan event dan pendengar. Saat menggunakan Volt, pendengar dapat didefinisikan menggunakan fungsi `on`:

```php
use function Livewire\Volt\{on};

on(['eventName' => function () {
    //
}]);
```

Jika Anda perlu menetapkan nama dinamis ke pendengar event, seperti yang berdasarkan user yang terautentikasi atau data yang diteruskan ke komponen, Anda dapat melewatkan closure ke fungsi `on`. Closure ini dapat menerima parameter komponen apa pun, serta dependensi tambahan yang akan diselesaikan melalui service container Laravel:

```php
on(fn ($post) => [
    'event-'.$post->id => function () {
        //
    }),
]);
```

Untuk kemudahan, data komponen juga dapat dirujuk saat mendefinisikan pendengar menggunakan notasi "titik":

```php
on(['event-{post.id}' => function () {
    //
}]);
```

## Lifecycle hooks

Livewire memiliki berbagai [lifecycle hooks](/docs/lifecycle-hooks) yang dapat digunakan untuk mengeksekusi kode pada berbagai titik dalam lifecycle komponen. Menggunakan API yang mudah dari Volt, Anda dapat mendefinisikan lifecycle hooks ini menggunakan fungsi yang sesuai:

```php
use function Livewire\Volt\{boot, booted, ...};

boot(fn () => /* ... */);
booted(fn () => /* ... */);
mount(fn () => /* ... */);
hydrate(fn () => /* ... */);
hydrate(['count' => fn () => /* ... */]);
dehydrate(fn () => /* ... */);
dehydrate(['count' => fn () => /* ... */]);
updating(['count' => fn () => /* ... */]);
updated(['count' => fn () => /* ... */]);
```

## Placeholder lazy loading

Saat merender komponen Livewire, Anda dapat meneruskan parameter `lazy` ke komponen Livewire untuk [menunda loadingnya](/docs/lazy) sampai halaman awal dimuat sepenuhnya. Secara default, Livewire memasukkan tag `<div></div>` ke DOM di mana komponen akan dimuat.

Jika Anda ingin menyesuaikan HTML yang ditampilkan dalam placeholder komponen saat halaman awal dimuat, Anda dapat menggunakan fungsi `placeholder`:

```php
use function Livewire\Volt\{placeholder};

placeholder('<div>Loading...</div>');
```

## Validasi

Livewire menawarkan akses mudah ke [fitur validasi](/docs/validation) Laravel yang kuat. Menggunakan API Volt, Anda dapat mendefinisikan aturan validasi komponen Anda menggunakan fungsi `rules`. Seperti komponen Livewire tradisional, aturan ini akan diterapkan ke data komponen Anda saat Anda memanggil metode `validate`:

```php
<?php

use function Livewire\Volt\{rules};

rules(['name' => 'required|min:6', 'email' => 'required|email']);

$submit = function () {
    $this->validate();

    // ...
};

?>

<form wire:submit.prevent="submit">
    //
</form>
```

Jika Anda perlu mendefinisikan aturan secara dinamis, seperti aturan berdasarkan user yang terautentikasi atau informasi dari database Anda, Anda dapat menyediakan closure ke fungsi `rules`:

```php
rules(fn () => [
    'name' => ['required', 'min:6'],
    'email' => ['required', 'email', 'not_in:'.Auth::user()->email]
]);
```

### Pesan kesalahan dan atribut

Untuk memodifikasi pesan validasi atau atribut yang digunakan selama validasi, Anda dapat merantai metode `messages` dan `attributes` ke definisi `rules` Anda:

```php
use function Livewire\Volt\{rules};

rules(['name' => 'required|min:6', 'email' => 'required|email'])
    ->messages([
        'email.required' => 'The :attribute may not be empty.',
        'email.email' => 'The :attribute format is invalid.',
    ])->attributes([
        'email' => 'email address',
    ]);
```

## Pengunggahan file

Saat menggunakan Volt, [mengunggah dan menyimpan file](/docs/uploads) menjadi lebih mudah berkat Livewire. Untuk menyertakan trait `Livewire\WithFileUploads` pada komponen Volt fungsional Anda, Anda dapat menggunakan fungsi `usesFileUploads`:

```php
use function Livewire\Volt\{state, usesFileUploads};

usesFileUploads();

state(['photo']);

$save = function () {
    $this->validate([
        'photo' => 'image|max:1024',
    ]);

    $this->photo->store('photos');
};
```

## Parameter query URL

Terkadang berguna untuk [memperbarui parameter query URL browser](/docs/url) saat state komponen Anda berubah. Dalam kasus ini, Anda dapat menggunakan metode `url` untuk menginstruksikan Livewire untuk menyinkronkan parameter query URL dengan bagian state komponen:

```php
<?php

use App\Models\Post;
use function Livewire\Volt\{computed, state};

state(['search'])->url();

$posts = computed(function () {
    return Post::where('title', 'like', '%'.$this->search.'%')->get();
});

?>

<div>
    <input wire:model.live="search" type="search" placeholder="Search posts by title...">

    <h1>Search Results:</h1>

    <ul>
        @foreach($this->posts as $post)
            <li wire:key="{{ $post->id }}">{{ $post->title }}</li>
        @endforeach
    </ul>
</div>
```

Opsi parameter query URL tambahan yang didukung oleh Livewire, seperti alias parameter query URL, juga dapat disediakan ke metode `url`:

```php
use App\Models\Post;
use function Livewire\Volt\{state};

state(['page' => 1])->url(as: 'p', history: true, keep: true);

// ...
```

## Paginasi

Livewire dan Volt juga memiliki dukungan penuh untuk [paginasi](/docs/pagination). Untuk menyertakan trait `Livewire\WithPagination` pada komponen Volt fungsional Anda, Anda dapat menggunakan fungsi `usesPagination`:

```php
<?php

use function Livewire\Volt\{with, usesPagination};

usesPagination();

with(fn () => ['posts' => Post::paginate(10)]);

?>

<div>
    @foreach ($posts as $post)
        //
    @endforeach

    {{ $posts->links() }}
</div>
```

Seperti Laravel, view paginasi default Livewire menggunakan kelas Tailwind untuk styling. Jika Anda menggunakan Bootstrap di aplikasi Anda, Anda dapat mengaktifkan tema paginasi Bootstrap dengan menentukan tema yang diinginkan saat memanggil fungsi `usesPagination`:

```php
usesPagination(theme: 'bootstrap');
```

## Traits dan interfaces kustom

Untuk menyertakan trait atau interface apa pun secara arbitrer pada komponen Volt fungsional Anda, Anda dapat menggunakan fungsi `uses`:

```php
use function Livewire\Volt\{uses};

use App\Contracts\Sorting;
use App\Concerns\WithSorting;

uses([Sorting::class, WithSorting::class]);
```

## Komponen anonim

Terkadang, Anda mungkin ingin mengubah sebagian kecil halaman menjadi komponen Volt tanpa mengekstraknya ke file terpisah. Sebagai contoh, bayangkan rute Laravel yang mengembalikan view berikut:

```php
Route::get('/counter', fn () => view('pages/counter.blade.php'));
```

Konten view adalah template Blade biasa, termasuk definisi layout dan slot. Namun, dengan membungkus sebagian view dalam direktif Blade `@volt`, kita dapat mengubah bagian view itu menjadi komponen Volt yang berfungsi penuh:

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<x-app-layout>
    <x-slot name="header">
        Counter
    </x-slot>

    @volt('counter')
        <div>
            <h1>{{ $count }}</h1>
            <button wire:click="increment">+</button>
        </div>
    @endvolt
</x-app-layout>
```

#### Melewatkan data ke komponen anonim

Saat merender view yang berisi komponen anonim, semua data yang diberikan ke view juga akan tersedia untuk komponen Volt anonim:

```php
use App\Models\User;

Route::get('/counter', fn () => view('users.counter', [
    'count' => User::count(),
]));
```

Tentu saja, Anda dapat mendeklarasikan data ini sebagai "state" pada komponen Volt Anda. Saat menginisialisasi state dari data yang diproksikan ke komponen oleh view, Anda hanya perlu mendeklarasikan nama variabel state. Volt akan secara otomatis menghidrasi nilai default state menggunakan data view yang diproksikan:

```php
<?php

use function Livewire\Volt\{state};

state('count');

$increment = function () {
    // Simpan nilai hitungan baru di database...

    $this->count++;
};

?>

<x-app-layout>
    <x-slot name="header">
        Initial value: {{ $count }}
    </x-slot>

    @volt('counter')
        <div>
            <h1>{{ $count }}</h1>
            <button wire:click="increment">+</button>
        </div>
    @endvolt
</x-app-layout>
```

## Menguji komponen

Untuk mulai menguji komponen Volt, Anda dapat memanggil metode `Volt::test`, menyediakan nama komponen:

```php
use Livewire\Volt\Volt;

it('increments the counter', function () {
    Volt::test('counter')
        ->assertSee('0')
        ->call('increment')
        ->assertSee('1');
});
```

Saat menguji komponen Volt, Anda dapat memanfaatkan semua metode yang disediakan oleh [API pengujian Livewire standar](/docs/testing).

Jika komponen Volt Anda bersarang, Anda dapat menggunakan notasi "titik" untuk menentukan komponen yang ingin Anda uji:

```php
Volt::test('users.stats')
```

Saat menguji halaman yang berisi komponen Volt anonim, Anda dapat menggunakan metode `assertSeeVolt` untuk menyatakan bahwa komponen dirender:

```php
$this->get('/users')
    ->assertSeeVolt('stats');
```