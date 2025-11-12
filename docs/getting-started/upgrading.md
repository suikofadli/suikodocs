---
sidebar_position: 3
---

# Upgrade Guide

## Alat peningkatan versi otomatis

Untuk menghemat waktu Anda dalam peningkatan versi, kami telah menyertakan perintah Artisan untuk mengotomasi sebanyak mungkin bagian dari proses peningkatan versi.

Setelah [menginstal Livewire versi 3](/docs/upgrading#update-livewire-to-version-3), jalankan perintah berikut, dan Anda akan menerima petunjuk untuk meningkatkan setiap perubahan yang breaking secara otomatis:

```shell
php artisan livewire:upgrade
```

Meskipun perintah di atas dapat meningkatkan sebagian besar aplikasi Anda, satu-satunya cara untuk memastikan peningkatan versi yang lengkap adalah dengan mengikuti panduan langkah demi langkah di halaman ini.

> [!tip] Sewa kami untuk meningkatkan aplikasi Anda
> Jika Anda memiliki aplikasi Livewire yang besar atau hanya tidak ingin dealing dengan peningkatan versi dari versi 2 ke versi 3, Anda dapat menyewa kami untuk menanganinya untuk Anda. [Pelajari lebih lanjut tentang layanan peningkatan versi kami di sini.](/jumpstart)

## Peningkatan PHP

Livewire sekarang memerlukan bahwa aplikasi Anda berjalan pada PHP versi 8.1 atau lebih tinggi.

## Perbarui Livewire ke versi 3

Jalankan perintah composer berikut untuk meningkatkan dependensi Livewire aplikasi Anda dari versi 2 ke 3:

```shell
composer require livewire/livewire "^3.0"
```

> [!warning] Kompatibilitas paket Livewire 3
> Sebagian besar paket Livewire pihak ketiga utama either saat ini mendukung Livewire 3 atau sedang mengerjakan dukungannya segera. Namun, akan selalu ada paket yang membutuhkan waktu lebih lama untuk merilis dukungan untuk Livewire 3.

## Bersihkan cache view

Jalankan perintah Artisan berikut dari direktori root aplikasi Anda untuk membersihkan cache view Blade yang di-cache/dikompilasi dan memaksa Livewire untuk mengompilasi ulang agar kompatibel dengan Livewire 3:

```shell
php artisan view:clear
```

## Gabungkan konfigurasi baru

Livewire 3 telah mengubah beberapa opsi konfigurasi. Jika aplikasi Anda memiliki file konfigurasi yang dipublikasikan (`config/livewire.php`), Anda perlu memperbaruinya untuk mengakomodasi perubahan berikut.

### Konfigurasi baru

Kunci konfigurasi berikut telah diperkenalkan dalam versi 3:

```php
'legacy_model_binding' => false,

'inject_assets' => true,

'inject_morph_markers' => true,

'navigate' => false,

'pagination_theme' => 'tailwind',
```

Anda dapat merujuk ke [file konfigurasi baru Livewire di GitHub](https://github.com/livewire/livewire/blob/master/config/livewire.php) untuk deskripsi opsi tambahan dan kode yang dapat di-copy-paste.

### Konfigurasi yang diubah

Item konfigurasi berikut telah diperbarui dengan nilai default baru:

#### Namespace kelas baru

Namespace default `class_namespace` Livewire telah berubah dari `App\\Http\\Livewire` menjadi `App\\Livewire`. Anda dipersilakan untuk mempertahankan nilai konfigurasi namespace lama; namun, jika Anda memilih untuk memperbarui konfigurasi Anda ke namespace baru, Anda harus memindahkan komponen Livewire Anda ke `app/Livewire`:

```php
'class_namespace' => 'App\\Http\\Livewire', // [tl! remove]
'class_namespace' => 'App\\Livewire', // [tl! add]
```

#### Path view layout baru

Saat merender komponen halaman penuh di versi 2, Livewire akan menggunakan `resources/views/layouts/app.blade.php` sebagai layout Blade komponen default.

Karena preferensi komunitas yang berkembang untuk komponen Blade anonim, Livewire 3 telah mengubah lokasi default menjadi: `resources/views/components/layouts/app.blade.php`.

```php
'layout' => 'layouts.app', // [tl! remove]
'layout' => 'components.layouts.app', // [tl! add]
```

### Konfigurasi yang dihapus

Livewire tidak lagi mengenali item konfigurasi berikut.

#### `app_url`

Jika aplikasi Anda dilayani di bawah URI non-root, di Livewire 2 Anda dapat menggunakan opsi konfigurasi `app_url` untuk mengkonfigurasi URL yang digunakan Livewire untuk membuat permintaan AJAX.

Dalam kasus ini, kami menemukan konfigurasi string terlalu kaku. Oleh karena itu, Livewire 3 telah memilih untuk menggunakan konfigurasi runtime sebagai gantinya. Anda dapat merujuk dokumentasi kami tentang [mengkonfigurasi endpoint update Livewire](/docs/installation#configuring-livewires-update-endpoint) untuk informasi lebih lanjut.

#### `asset_url`

Di Livewire 2, jika aplikasi Anda dilayani di bawah URI non-root, Anda akan menggunakan opsi konfigurasi `asset_url` untuk mengkonfigurasi URL basis yang digunakan Livewire untuk menyajikan aset JavaScriptnya.

Livewire 3 sebagai gantinya telah memilih strategi konfigurasi runtime. Anda dapat merujuk dokumentasi kami tentang [mengkonfigurasi endpoint aset skrip Livewire](/docs/installation#customizing-the-asset-url) untuk informasi lebih lanjut.

#### `middleware_group`

Karena Livewire sekarang mengekspos cara yang lebih fleksibel untuk menyesuaikan endpoint update-nya, opsi konfigurasi `middleware_group` telah dihapus.

Anda dapat merujuk dokumentasi kami tentang [menyesuaikan endpoint update Livewire](/docs/installation#configuring-livewires-update-endpoint) untuk informasi lebih lanjut tentang penerapan middleware khusus ke permintaan Livewire.

#### `manifest_path`

Livewire 3 tidak lagi menggunakan file manifest untuk autoloading komponen. Oleh karena itu, konfigurasi `manifest_path` tidak lagi diperlukan.

#### `back_button_cache`

Karena Livewire 3 sekarang menawarkan [pengalaman SPA untuk aplikasi Anda menggunakan `wire:navigate`](/docs/navigate), konfigurasi `back_button_cache` tidak lagi diperlukan.

## Namespace aplikasi Livewire

Di versi 2, komponen Livewire dibuat dan dikenali secara otomatis di bawah namespace `App\\Http\\Livewire`.

Livewire 3 telah mengubah default ini menjadi: `App\\Livewire`.

Anda dapat memindahkan semua komponen Anda ke lokasi baru atau menambahkan konfigurasi berikut ke file konfigurasi `config/livewire.php` aplikasi Anda:

```php
'class_namespace' => 'App\\Http\\Livewire',
```

### Penemuan

Dengan Livewire 3, tidak ada manifest yang ada, dan karena itu tidak ada yang "ditemukan" dalam kaitannya dengan Komponen Livewire, dan Anda dapat dengan aman menghapus referensi livewire:discover dari skrip build Anda tanpa masalah.

## View layout komponen halaman

Saat merender komponen Livewire sebagai halaman penuh menggunakan sintaks seperti berikut:

```php
Route::get('/posts', ShowPosts::class);
```

File layout Blade yang digunakan oleh Livewire untuk merender komponen telah berubah dari `resources/views/layouts/app.blade.php` menjadi `resources/views/components/layouts/app.blade.php`:

```shell
resources/views/layouts/app.blade.php #[tl! remove]
resources/views/components/layouts/app.blade.php #[tl! add]
```

Anda dapat memindahkan file layout Anda ke lokasi baru atau menerapkan konfigurasi berikut di dalam file konfigurasi `config/livewire.php` aplikasi Anda:

```php
'layout' => 'layouts.app',
```

Untuk informasi lebih lanjut, periksa dokumentasi tentang [membuat dan menggunakan layout komponen halaman](/docs/components#layout-files).

## Binding model Eloquent

Livewire 2 mendukung binding `wire:model` langsung ke properti model Eloquent. Misalnya, berikut adalah pola yang umum:

```php
public Post $post;

protected $rules = [
    'post.title' => 'required',
    'post.description' => 'required',
];
```

```html
<input wire:model="post.title" /> <input wire:model="post.description" />
```

Di Livewire 3, binding langsung ke model Eloquent telah dinonaktifkan sebagai gantinya menggunakan properti individual, atau mengekstrak [Form Objects](/docs/forms#extracting-a-form-object).

Namun, karena perilaku ini sangat bergantung pada aplikasi Livewire, versi 3 mempertahankan dukungan untuk perilaku ini melalui item konfigurasi di `config/livewire.php`:

```php
'legacy_model_binding' => true,
```

Dengan mengatur `legacy_model_binding` ke `true`, Livewire akan menangani properti model Eloquent persis seperti di versi 2.

## AlpineJS

Livewire 3 dikirimkan dengan [AlpineJS](https://alpinejs.dev) secara default.

Jika Anda secara manual menyertakan Alpine di aplikasi Livewire Anda, Anda perlu menghapusnya, agar versi bawaan Livewire tidak konflik.

### Menyertakan Alpine melalui tag skrip

Jika Anda menyertakan Alpine ke aplikasi Anda melalui tag skrip seperti berikut, Anda dapat menghapusnya seluruhnya dan Livewire akan memuat versi internalnya sebagai gantinya:

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
></script>
<!-- [tl! remove] -->
```

### Menyertakan plugin melalui tag skrip

Livewire 3 sekarang dikirimkan dengan plugin Alpine berikut out-of-the-box:

- [Anchor](https://alpinejs.dev/plugins/anchor)
- [Collapse](https://alpinejs.dev/plugins/collapse)
- [Focus](https://alpinejs.dev/plugins/focus)
- [Intersect](https://alpinejs.dev/plugins/intersect)
- [Mask](https://alpinejs.dev/plugins/mask)
- [Morph](https://alpinejs.dev/plugins/morph)
- [Persist](https://alpinejs.dev/plugins/persist)

Penting untuk memperhatikan perubahan pada file [package.json](https://github.com/livewire/livewire/blob/main/package.json), karena plugin Alpine baru mungkin ditambahkan!

Jika Anda sebelumnya telah menyertakan plugin ini di aplikasi Anda melalui tag `<script>` seperti di bawah ini, Anda harus menghapusnya bersama dengan inti Alpine:

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.x.x/dist/cdn.min.js"
></script>
<!-- [tl! remove:1] -->
<!-- ... -->
```

### Mengakses global Alpine melalui tag skrip

Jika Anda saat ini mengakses objek global `Alpine` dari tag skrip seperti ini:

```html
<script>
  document.addEventListener('alpine:init', () => {
      Alpine.data(...)
  })
</script>
```

Anda dapat terus melakukannya, karena Livewire secara internal menyertakan dan mendaftarkan objek global Alpine seperti sebelumnya.

### Menyertakan melalui JS bundle

Jika Anda telah menyertakan Alpine atau plugin Alpine inti populer yang disebutkan di atas melalui NPM ke dalam JavaScript bundle aplikasi Anda seperti ini:

```js
// Warning: this is a snippet of the Livewire 2 approach to including Alpine

import Alpine from "alpinejs";
import intersect from "@alpinejs/intersect";

Alpine.plugin(intersect);

Alpine.start();
```

Anda dapat menghapusnya seluruhnya, karena Livewire menyertakan Alpine dan banyak plugin Alpine populer secara default.

#### Mengakses Alpine melalui JS bundle

Jika Anda mendaftarkan plugin Alpine khusus atau komponen di dalam JavaScript bundle aplikasi Anda seperti ini:

```js
// Warning: this is a snippet of the Livewire 2 approach to including Alpine

import Alpine from "alpinejs";
import customPlugin from "./plugins/custom-plugin";

Alpine.plugin(customPlugin);

Alpine.start();
```

Anda masih dapat melakukan ini dengan mengimpor modul ESM inti Livewire ke dalam bundle Anda dan mengakses `Alpine` dari sana.

Untuk mengimpor Livewire ke dalam bundle Anda, Anda harus terlebih dahulu menonaktifkan injeksi JavaScript normal Livewire dan menyediakan konfigurasi yang diperlukan ke Livewire dengan mengganti `@livewireScripts` dengan `@livewireScriptConfig` dalam layout utama aplikasi Anda:

```blade
    <!-- ... -->

    @livewireScripts <!-- [tl! remove] -->
    @livewireScriptConfig <!-- [tl! add] -->
</body>
```

Sekarang, Anda dapat mengimpor `Alpine` dan `Livewire` ke dalam bundle aplikasi Anda seperti ini:

```js
import {
  Livewire,
  Alpine,
} from "../../vendor/livewire/livewire/dist/livewire.esm";
import customPlugin from "./plugins/custom-plugin";

Alpine.plugin(customPlugin);

Livewire.start();
```

Perhatikan Anda tidak lagi perlu memanggil `Alpine.start()`. Livewire akan memulai Alpine secara otomatis.

Untuk informasi lebih lanjut, silakan konsultasi dokumentasi kami tentang [secara manual membundel JavaScript Livewire](/docs/installation#manually-bundling-livewire-and-alpine).

## `wire:model`

Di Livewire 3, `wire:model` "deferred" secara default (bukan dengan `wire:model.defer`). Untuk mencapai perilaku yang sama seperti `wire:model` dari Livewire 2, Anda harus menggunakan `wire:model.live`.

Berikut adalah daftar substitusi yang diperlukan yang harus Anda buat dalam template Anda untuk menjaga perilaku aplikasi Anda konsisten:

```html
<input wire:model="..." />
<!-- [tl! remove] -->
<input wire:model.live="..." />
<!-- [tl! add] -->

<input wire:model.defer="..." />
<!-- [tl! remove] -->
<input wire:model="..." />
<!-- [tl! add] -->

<input wire:model.lazy="..." />
<!-- [tl! remove] -->
<input wire:model.blur="..." />
<!-- [tl! add] -->
```

## `@entangle`

Mirip dengan perubahan pada `wire:model`, Livewire 3 menangguhkan semua data binding secara default. Untuk mencocokkan perilaku ini, `@entangle` juga telah diperbarui.

Untuk menjaga aplikasi Anda berjalan seperti yang diharapkan, buat substitusi `@entangle` berikut:

```blade
@entangle(...) <!-- [tl! remove] -->
@entangle(...).live <!-- [tl! add] -->

@entangle(...).defer <!-- [tl! remove] -->
@entangle(...) <!-- [tl! add] -->
```

## Event

Di Livewire 2, Livewire memiliki dua metode PHP berbeda untuk memicu event:

- `emit()`
- `dispatchBrowserEvent()`

Livewire 3 telah menyatukan kedua metode ini menjadi satu metode:

- `dispatch()`

Berikut adalah contoh dasar pengiriman dan mendengarkan event di Livewire 3:

```php
// Dispatching...
class CreatePost extends Component
{
    public Post $post;

    public function save()
    {
        $this->dispatch('post-created', postId: $this->post->id);
    }
}

// Listening...
class Dashboard extends Component
{
    #[On('post-created')]
    public function postAdded($postId)
    {
        //
    }
}
```

Tiga perubahan utama dari Livewire 2 adalah:

1. `emit()` telah diganti namanya menjadi `dispatch()` (Begitu juga `emitTo()` dan `emitSelf()` sekarang menjadi `dispatchTo()` dan `dispatchSelf()`)
2. `dispatchBrowserEvent()` telah diganti namanya menjadi `dispatch()`
3. Semua parameter event harus bernama

Untuk informasi lebih lanjut, periksa halaman dokumentasi [event baru](/docs/events).

Berikut adalah perbedaan "find and replace" yang harus diterapkan ke aplikasi Anda:

```php
$this->emit('post-created'); // [tl! remove]
$this->dispatch('post-created'); // [tl! add]

$this->emitTo('foo', 'post-created'); // [tl! remove]
$this->dispatch('post-created')->to('foo'); // [tl! add]

$this->emitSelf('post-created'); // [tl! remove]
$this->dispatch('post-created')->self(); // [tl! add]

$this->emit('post-created', $post->id); // [tl! remove]
$this->dispatch('post-created', postId: $post->id); // [tl! add]

$this->dispatchBrowserEvent('post-created'); // [tl! remove]
$this->dispatch('post-created'); // [tl! add]

$this->dispatchBrowserEvent('post-created', ['postId' => $post->id]); // [tl! remove]
$this->dispatch('post-created', postId: $post->id); // [tl! add]
```

```html
<button wire:click="$emit('post-created')">...</button>
<!-- [tl! remove] -->
<button wire:click="$dispatch('post-created')">...</button>
<!-- [tl! add] -->

<button wire:click="$emit('post-created', 1)">...</button>
<!-- [tl! remove] -->
<button wire:click="$dispatch('post-created', { postId: 1 })">...</button>
<!-- [tl! add] -->

<button wire:click="$emitTo('foo', post-created', 1)">...</button>
<!-- [tl! remove] -->
<button wire:click="$dispatchTo('foo', 'post-created', { postId: 1 })">
  ...
</button>
<!-- [tl! add] -->

<button x-on:click="$wire.emit('post-created', 1)">...</button>
<!-- [tl! remove] -->
<button x-on:click="$dispatch('post-created', { postId: 1 })">...</button>
<!-- [tl! add] -->
```

### `emitUp()`

Konsep `emitUp` telah dihapus seluruhnya. Event sekarang dikirim menggunakan event browser dan karena itu akan "bubble up" secara default.

Anda dapat menghapus instance `$this->emitUp(...)` atau `$emitUp(...)` dari komponen Anda.

### Menguji event

Livewire juga telah mengubah asersi event untuk mencocokkan terminologi terpadu baru mengenai pengiriman event:

```php
Livewire::test(Component::class)->assertEmitted('post-created'); // [tl! remove]
Livewire::test(Component::class)->assertDispatched('post-created'); // [tl! add]

Livewire::test(Component::class)->assertEmittedTo(Foo::class, 'post-created'); // [tl! remove]
Livewire::test(Component::class)->assertDispatchedTo(Foo::class, 'post-created'); // [tl! add]

Livewire::test(Component::class)->assertNotEmitted('post-created'); // [tl! remove]
Livewire::test(Component::class)->assertNotDispatched('post-created'); // [tl! add]

Livewire::test(Component::class)->assertEmittedUp() // [tl! remove]
```

### String kueri URL

Di versi Livewire sebelumnya, jika Anda mengikat properti ke string kueri URL, nilai properti akan selalu ada di string kueri, kecuali Anda menggunakan opsi `except`.

Di Livewire 3, semua properti yang diikat ke string kueri hanya akan muncul jika nilainya telah berubah setelah halaman dimuat. Default ini menghapus kebutuhan akan opsi `except`:

```php
public $search = '';

protected $queryString = [
    'search' => ['except' => ''], // [tl! remove]
    'search', // [tl! add]
];
```

Jika Anda ingin kembali ke perilaku Livewire 2 untuk selalu menampilkan properti di string kueri tidak peduli nilainya, Anda dapat menggunakan opsi `keep`:

```php
public $search = '';

protected $queryString = [
    'search' => ['keep' => true], // [tl! highlight]
];
```

## Paginasi

Sistem paginasi telah diperbarui di Livewire 3 untuk mendukung multiple paginators dalam komponen yang sama dengan lebih baik.

### Perbarui view paginasi yang dipublikasikan

Jika Anda telah mempublikasikan view paginasi Livewire, Anda dapat merujuk ke yang baru di [direktori paginasi di GitHub](https://github.com/livewire/livewire/tree/master/src/Features/SupportPagination/views) dan memperbarui aplikasi Anda sesuai.

### Mengakses `$this->page` langsung

Karena Livewire sekarang mendukung multiple paginators per komponen, telah menghapus properti `$page` dari kelas komponen dan menggantinya dengan properti `$paginators` yang menyimpan array paginators:

```php
$this->page = 2; // [tl! remove]
$this->paginators['page'] = 2; // [tl! add]
```

Namun, disarankan agar Anda menggunakan metode `getPage` dan `setPage` yang disediakan untuk memodifikasi dan mengakses halaman saat ini:

```php
// Getter...
$this->getPage();

// Setter...
$this->setPage(2);
```

### `wire:click.prefetch`

Fitur prefetching Livewire (`wire:click.prefetch`) telah dihapus seluruhnya. Jika Anda bergantung pada fitur ini, aplikasi Anda masih akan berjalan, hanya akan sedikit kurang performa pada instance di mana Anda sebelumnya mendapat manfaat dari `.prefetch`.

```html
<button wire:click.prefetch="">
  <!-- [tl! remove] -->
  <button wire:click="..."><!-- [tl! add] --></button>
</button>
```

## Perubahan kelas komponen

Perubahan berikut telah dibuat pada kelas dasar `Livewire\\Component` Livewire yang mungkin telah diandalkan oleh aplikasi Anda.

### Properti `$id` komponen

Jika Anda mengakses ID komponen secara langsung melalui `$this->id`, Anda harus menggunakan `$this->getId()` sebagai gantinya:

```php
$this->id; // [tl! remove]

$this->getId(); // [tl! add]
```

### Nama metode dan properti duplikat

PHP memungkinkan Anda menggunakan nama yang sama untuk properti kelas dan metode. Di Livewire 3, ini akan menyebabkan masalah saat memanggil metode dari frontend melalui `wire:click`.

Sangat disarankan agar Anda menggunakan nama yang berbeda untuk semua metode dan properti publik dalam komponen:

```php
public $search = ''; // [tl! remove]

public function search() {
    // ...
}
```

```php
public $query = ''; // [tl! add]

public function search() {
    // ...
}
```

## Perubahan API JavaScript

### `livewire:load`

Di versi Livewire sebelumnya, Anda dapat mendengarkan event `livewire:load` untuk mengeksekusi kode JavaScript tepat sebelum Livewire menginisialisasi halaman.

Di Livewire 3, nama event tersebut telah diubah menjadi `livewire:init` untuk mencocokkan `alpine:init` Alpine:

```js
document.addEventListener('livewire:load', () => {...}) // [tl! remove]
document.addEventListener('livewire:init', () => {...}) // [tl! add]
```

### Hook halaman kedaluwarsa

Di versi 2, Livewire mengekspos metode JavaScript khusus untuk menyesuaikan perilaku kedaluwarsa halaman: `Livewire.onPageExpired()`. Metode ini telah dihapus sebagai gantinya menggunakan hook `request` yang lebih kuat secara langsung:

```js
Livewire.onPageExpired(() => {...}) // [tl! remove]

Livewire.hook('request', ({ fail }) => { // [tl! add:8]
    fail(({ status, preventDefault }) => {
        if (status === 419) {
            preventDefault()

            confirm('Your custom page expiration behavior...')
        }
    })
})
```

### Hook lifecycle baru

Banyak hook lifecycle JavaScript internal Livewire telah berubah di Livewire 3.

Berikut adalah perbandingan hook lama dan sintaks baru mereka untuk Anda find/replace di aplikasi Anda:

```js
Livewire.hook("component.initialized", (component) => {}); // [tl! remove]
Livewire.hook("component.init", ({ component, cleanup }) => {}); // [tl! add]

Livewire.hook("element.initialized", (el, component) => {}); // [tl! remove]
Livewire.hook("element.init", ({ el, component }) => {}); // [tl! add]

Livewire.hook("element.updating", (fromEl, toEl, component) => {}); // [tl! remove]
Livewire.hook("morph.updating", ({ el, toEl, component }) => {}); // [tl! add]

Livewire.hook("element.updated", (el, component) => {}); // [tl! remove]
Livewire.hook("morph.updated", ({ el, component }) => {}); // [tl! add]

Livewire.hook("element.removed", (el, component) => {}); // [tl! remove]
Livewire.hook("morph.removed", ({ el, component }) => {}); // [tl! add]

Livewire.hook("message.sent", (message, component) => {}); // [tl! remove]
Livewire.hook("message.failed", (message, component) => {}); // [tl! remove]
Livewire.hook("message.received", (message, component) => {}); // [tl! remove]
Livewire.hook("message.processed", (message, component) => {}); // [tl! remove]

Livewire.hook("commit", ({ component, commit, respond, succeed, fail }) => {
  // [tl! add:14]
  // Equivalent of 'message.sent'

  succeed(({ snapshot, effects }) => {
    // Equivalent of 'message.received'

    queueMicrotask(() => {
      // Equivalent of 'message.processed'
    });
  });

  fail(() => {
    // Equivalent of 'message.failed'
  });
});
```

Anda dapat berkonsultasi dengan dokumentasi [hook JavaScript baru](/docs/javascript) untuk pemahaman yang lebih menyeluruh tentang sistem hook baru.

## Lokalisasi

Jika aplikasi Anda menggunakan prefiks lokal dalam URI seperti `https://example.com/en/...`, Livewire 2 secara otomatis mempertahankan prefiks URL ini saat membuat pembaruan komponen melalui `https://example.com/en/livewire/update`.

Livewire 3 telah berhenti mendukung perilaku ini secara otomatis. Sebagai gantinya, Anda dapat mengesampingkan endpoint update Livewire dengan prefiks URI apa pun yang Anda butuhkan menggunakan `setUpdateRoute()`:

```php
Route::group(['prefix' => LaravelLocalization::setLocale()], function ()
{
    // Your other localized routes...

    Livewire::setUpdateRoute(function ($handle) {
        return Route::post('/livewire/update', $handle);
    });
});
```

Untuk informasi lebih lanjut, silakan konsultasi dokumentasi kami tentang [mengkonfigurasi endpoint update Livewire](/docs/installation#configuring-livewires-update-endpoint).
