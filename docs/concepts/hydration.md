---
sidebar_position: 46
---

# Hydration

Menggunakan Livewire terasa seperti menempelkan kelas PHP sisi-server langsung ke browser web. Hal-hal seperti memanggil fungsi sisi-server langsung dari tekanan tombol mendukung ilusi ini. Tapi pada kenyataannya, ini hanya itu: sebuah ilusi.

Di latar belakang, Livewire sebenarnya berperilaku lebih seperti aplikasi web standar. Ia merender HTML statis ke browser, mendengarkan event browser, lalu membuat permintaan AJAX untuk memanggil kode sisi-server.

Karena setiap permintaan AJAX yang Livewire buat ke server bersifat "stateless" (artinya tidak ada proses backend yang berjalan lama yang menjaga state komponen tetap hidup), Livewire harus membuat ulang state terakhir yang diketahui dari komponen sebelum melakukan pembaruan apa pun.

Ia melakukan ini dengan mengambil "snapshot" komponen PHP setelah setiap pembaruan sisi-server sehingga komponen dapat dibuat ulang atau _dilanjutkan_ pada permintaan berikutnya.

Sepanjang dokumentasi ini, kami akan merujuk pada proses pengambilan snapshot sebagai "dehidrasi" dan proses membuat ulang komponen dari snapshot sebagai "hidrasi".

## Dehidrasi

Ketika Livewire _dehidrasi_ komponen sisi-server, ia melakukan dua hal:

* Merender template komponen menjadi HTML
* Membuat snapshot JSON dari komponen

### Merender HTML

Setelah komponen dimount atau pembaruan telah dilakukan, Livewire memanggil metode `render()` komponen untuk mengubah template Blade menjadi HTML mentah.

Ambil komponen `Counter` berikut sebagai contoh:

```php
class Counter extends Component
{
    public $count = 1;

    public function increment()
    {
        $this->count++;
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            Count: {{ $count }}

            <button wire:click="increment">+</button>
        </div>
        HTML;
    }
}
```

Setiap mount atau pembaruan, Livewire akan merender komponen `Counter` di atas ke HTML berikut:

```html
<div>
    Count: 1

    <button wire:click="increment">+</button>
</div>
```

### Snapshot

Untuk membuat ulang komponen `Counter` di server selama permintaan berikutnya, snapshot JSON dibuat, mencoba menangkap sebanyak mungkin state komponen:

```js
{
    state: {
        count: 1,
    },

    memo: {
        name: 'counter',

        id: '1526456',
    },
}
```

Perhatikan dua bagian berbeda dari snapshot: `memo`, dan `state`.

Bagian `memo` digunakan untuk menyimpan informasi yang diperlukan untuk mengidentifikasi dan membuat ulang komponen, sedangkan bagian `state` menyimpan nilai dari semua properti publik komponen.

> [!info]
> Snapshot di atas adalah versi ringkas dari snapshot aktual di Livewire. Dalam aplikasi langsung, snapshot berisi informasi yang jauh lebih banyak, seperti error validasi, daftar komponen anak, lokal, dan banyak lagi. Untuk melihat lebih detail tentang objek snapshot, Anda dapat merujuk pada [dokumentasi skema snapshot](/docs/javascript#the-snapshot-object).

### Menyematkan snapshot dalam HTML

Ketika komponen pertama kali dirender, Livewire menyimpan snapshot sebagai JSON di dalam atribut HTML yang disebut `wire:snapshot`. Dengan cara ini, inti JavaScript Livewire dapat mengekstrak JSON dan mengubahnya menjadi objek runtime:

```html
<div wire:id="..." wire:snapshot="{ state: {...}, memo: {...} }">
    Count: 1

    <button wire:click="increment">+</button>
</div>
```

## Hidrasi

Ketika pembaruan komponen dipicu, misalnya, tombol "+" ditekan dalam komponen `Counter`, payload seperti berikut dikirim ke server:

```js
{
    calls: [
        { method: 'increment', params: [] },
    ],

    snapshot: {
        state: {
            count: 1,
        },

        memo: {
            name: 'counter',

            id: '1526456',
        },
    }
}
```

Sebelum Livewire dapat memanggil metode `increment`, ia harus terlebih dahulu membuat instance `Counter` baru dan menyemainya dengan state snapshot.

Berikut adalah beberapa kode PHP pseudo-code yang mencapai hasil ini:

```php
$state = request('snapshot.state');
$memo = request('snapshot.memo');

$instance = Livewire::new($memo['name'], $memo['id']);

foreach ($state as $property => $value) {
    $instance[$property] = $value;
}
```

Jika Anda mengikuti skrip di atas, Anda akan melihat bahwa setelah membuat objek `Counter`, properti publiknya diatur berdasarkan state yang disediakan dari snapshot.

## Hidrasi lanjutan

Contoh `Counter` di atas bekerja dengan baik untuk mendemonstrasikan konsep hidrasi; namun, itu hanya mendemonstrasikan bagaimana Livewire menangani hidrasi nilai sederhana seperti bilangan bulat (`1`).

Seperti yang Anda ketahui, Livewire mendukung banyak tipe properti yang lebih canggih di luar bilangan bulat.

Mari kita lihat contoh yang sedikit lebih kompleks - komponen `Todos`:

```php
class Todos extends Component
{
    public $todos;

    public function mount() {
        $this->todos = collect([
            'first',
            'second',
            'third',
        ]);
    }
}
```

Seperti yang Anda lihat, kami mengatur properti `$todos` menjadi [Laravel collection](https://laravel.com/docs/collections#main-content) dengan tiga string sebagai isinya.

JSON saja tidak dapat merepresentasikan Laravel collection, jadi sebagai gantinya, Livewire telah membuat polanya sendiri untuk mengaitkan metadata dengan data murni di dalam snapshot.

Berikut adalah objek state snapshot untuk komponen `Todos` ini:

```js
state: {
    todos: [
        [ 'first', 'second', 'third' ],
        { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
    ],
},
```

Ini mungkin membingungkan bagi Anda jika Anda mengharapkan sesuatu yang lebih mudah seperti:

```js
state: {
    todos: [ 'first', 'second', 'third' ],
},
```

Namun, jika Livewire menghidrasi komponen berdasarkan data ini, ia tidak akan memiliki cara untuk mengetahui bahwa itu adalah collection dan bukan array biasa.

Oleh karena itu, Livewire mendukung sintaks state alternatif dalam bentuk tuple (array dari dua item):

```js
todos: [
    [ 'first', 'second', 'third' ],
    { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
],
```

Ketika Livewire menemukan tuple saat menghidrasi state komponen, ia menggunakan informasi yang disimpan dalam elemen kedua dari tuple untuk menghidrasi state yang disimpan dalam elemen pertama dengan lebih cerdas.

Untuk mendemonstrasikan lebih jelas, berikut adalah kode yang disederhanakan yang menunjukkan bagaimana Livewire mungkin membuat ulang properti collection berdasarkan snapshot di atas:

```php
[ $state, $metadata ] = request('snapshot.state.todos');

$collection = new $metadata['class']($state);
```

Seperti yang Anda lihat, Livewire menggunakan metadata yang terkait dengan state untuk menurunkan class collection lengkap.

### Tuple bersarang dalam

Satu keunggulan yang berbeda dari pendekatan ini adalah kemampuan untuk mendehidrasi dan menghidrasi properti yang bersarang secara mendalam.

Sebagai contoh, pertimbangkan contoh `Todos` di atas, kecuali sekarang dengan [Laravel Stringable](https://laravel.com/docs/helpers#method-str) bukan string biasa sebagai item ketiga dalam collection:

```php
class Todos extends Component
{
    public $todos;

    public function mount() {
        $this->todos = collect([
            'first',
            'second',
            str('third'),
        ]);
    }
}
```

Snapshot terdehidrasi untuk state komponen ini sekarang akan terlihat seperti ini:

```js
todos: [
    [
        'first',
        'second',
        [ 'third', { s: 'str' } ],
    ],
    { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
],
```

Seperti yang Anda lihat, item ketiga dalam collection telah didehidrasi menjadi tuple metadata. Elemen pertama dalam tuple adalah nilai string biasa, dan yang kedua adalah flag yang menandakan kepada Livewire bahwa string ini adalah _stringable_.

### Mendukung tipe properti kustom

Secara internal, Livewire memiliki dukungan hidrasi untuk tipe PHP dan Laravel yang paling umum. Namun, jika Anda ingin mendukung tipe yang tidak didukung, Anda dapat melakukannya menggunakan [Synthesizers](/docs/synthesizers) — mekanisme internal Livewire untuk menghidrasi/mendehidrasi tipe properti non-primitif.