---

# Morphing

Ketika komponen Livewire memperbarui DOM browser, hal tersebut dilakukan dengan cara cerdas yang kami sebut "morphing". Istilah _morph_ berbeda dengan kata seperti _replace_.

Alih-alih _mengganti_ HTML komponen dengan HTML yang baru dirender setiap kali komponen diperbarui, Livewire secara dinamis membandingkan HTML saat ini dengan HTML baru, mengidentifikasi perbedaan, dan melakukan perubahan secara tepat pada HTML hanya di bagian tempat perubahan diperlukan.

Ini memiliki manfaat untuk menjaga elemen-elemen yang sudah ada dan tidak berubah pada komponen. Sebagai contoh, event listener, state fokus, dan nilai input form semuanya dipertahankan antar pembaruan Livewire. Tentu saja, morphing juga menawarkan performa yang lebih baik dibandingkan dengan menghapus dan merender ulang DOM baru pada setiap pembaruan.

## Cara kerja morphing

Untuk memahami bagaimana Livewire menentukan elemen mana yang akan diperbarui antar permintaan Livewire, pertimbangkan komponen `Todos` sederhana ini:

```php
class Todos extends Component
{
    public $todo = '';

    public $todos = [
        'first',
        'second',
    ];

    public function add()
    {
        $this->todos[] = $this->todo;
    }
}
```

```php
<form wire:submit="add">
    <ul>
        @foreach ($todos as $item)
            <li>{{ $item }}</li>
        @endforeach
    </ul>

    <input wire:model="todo">
</form>
```

Render awal dari komponen ini akan menghasilkan HTML berikut:

```html
<form wire:submit="add">
    <ul>
        <li>first</li>

        <li>second</li>
    </ul>

    <input wire:model="todo">
</form>
```

Sekarang, bayangkan Anda mengetik "third" ke dalam field input dan menekan tombol `[Enter]`. HTML yang baru dirender akan menjadi:

```html
<form wire:submit="add">
    <ul>
        <li>first</li>

        <li>second</li>

        <li>third</li> <!-- [tl! add] -->
    </ul>

    <input wire:model="todo">
</form>
```

Ketika Livewire memproses pembaruan komponen, ia _morphs_ DOM asli menjadi HTML yang baru dirender. Visualisasi berikut seharusnya secara intuitif memberikan pemahaman tentang cara kerjanya:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/844600772?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="morph_basic"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Seperti yang Anda lihat, Livewire berjalan melalui kedua pohon HTML secara bersamaan. Saat ia menemukan setiap elemen di kedua pohon, ia membandingkannya untuk perubahan, penambahan, dan penghapusan. Jika ia mendeteksi adanya perubahan, ia akan melakukan perubahan yang tepat.

## Kekurangan morphing

Berikut adalah skenario di mana algoritma morphing gagal mengidentifikasi perubahan dalam pohon HTML dengan benar dan karenanya menyebabkan masalah dalam aplikasi Anda.

### Menyisipkan elemen perantara

Pertimbangkan template Blade Livewire berikut untuk komponen `CreatePost` fiktif:

```php
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    @if ($errors->has('title'))
        <div>{{ $errors->first('title') }}</div>
    @endif

    <div>
        <button>Save</button>
    </div>
</form>
```

Jika pengguna mencoba mengirimkan formulir, tetapi mengalami error validasi, masalah berikut terjadi:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/844600840?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="morph_problem"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Seperti yang Anda lihat, ketika Livewire menemukan `<div>` baru untuk pesan error, ia tidak tahu apakah akan mengubah `<div>` yang sudah ada di tempat, atau menyisipkan `<div>` baru di tengah.

Untuk mengulangi kembali apa yang terjadi lebih eksplisit:

* Livewire menemukan `<div>` pertama di kedua pohon. Mereka sama, jadi ia melanjutkan.
* Livewire menemukan `<div>` kedua di kedua pohon dan mengira mereka adalah `<div>` yang sama, hanya satu yang memiliki konten berubah. Jadi alih-alih menyisipkan pesan error sebagai elemen baru, ia mengubah `<button>` menjadi pesan error.
* Livewire kemudian, setelah secara keliru memodifikasi elemen sebelumnya, memperhatikan elemen tambahan di akhir perbandingan. Ia kemudian membuat dan menambahkan elemen setelah elemen sebelumnya.
* Oleh karena itu, menghancurkan, lalu membuat ulang elemen yang seharusnya hanya dipindahkan.

Skenario ini adalah akar dari hampir semua bug terkait morph.

Berikut adalah beberapa dampak bermasalah spesifik dari bug ini:
* Event listener dan state elemen hilang antar pembaruan
* Event listener dan state salah tempat pada elemen yang salah
* Seluruh komponen Livewire dapat direset atau duplikat karena komponen Livewire juga merupakan elemen sederhana dalam pohon DOM
* Komponen dan state Alpine dapat hilang atau salah tempat

Untungnya, Livewire telah bekerja keras untuk mengatasi masalah ini menggunakan pendekatan berikut:

### Look-ahead internal

Livewire memiliki langkah tambahan dalam algoritma morphing-nya yang memeriksa elemen berikutnya dan isinya sebelum mengubah elemen.

Ini mencegah skenario di atas terjadi dalam banyak kasus.

Berikut adalah visualisasi algoritma "look-ahead" dalam aksi:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/844600800?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="morph_lookahead"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

### Menyuntikkan penanda morph

Di backend, Livewire secara otomatis mendeteksi kondisional di dalam template Blade dan membungkusnya dalam penanda komentar HTML yang dapat digunakan JavaScript Livewire sebagai panduan saat morphing.

Berikut adalah contoh template Blade sebelumnya tetapi dengan penanda Livewire yang disuntikkan:

```php
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    <!--[if BLOCK]><![endif]--> <!-- [tl! highlight] -->
    @if ($errors->has('title'))
        <div>Error: {{ $errors->first('title') }}</div>
    @endif
    <!--[if ENDBLOCK]><![endif]--> <!-- [tl! highlight] -->

    <div>
        <button>Save</button>
    </div>
</form>
```

Dengan penanda ini yang disuntikkan ke dalam template, Livewire sekarang dapat lebih mudah mendeteksi perbedaan antara perubahan dan penambahan.

Fitur ini sangat bermanfaat untuk aplikasi Livewire, tetapi karena memerlukan parsing template melalui regex, ia terkadang gagal mendeteksi kondisional dengan benar. Jika fitur ini lebih mengganggu daripada membantu aplikasi Anda, Anda dapat menonaktifkannya dengan konfigurasi berikut dalam file `config/livewire.php` aplikasi Anda:

```php
'inject_morph_markers' => false,
```

#### Membungkus kondisional

Jika kedua solusi di atas tidak mencakup situasi Anda, cara paling andal untuk menghindari masalah morphing adalah dengan membungkus kondisional dan loop dalam elemen mereka sendiri yang selalu ada.

Sebagai contoh, berikut adalah template Blade di atas yang ditulis ulang dengan pembungkus elemen `<div>`:

```php
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    <div> <!-- [tl! highlight] -->
        @if ($errors->has('title'))
            <div>{{ $errors->first('title') }}</div>
        @endif
    </div> <!-- [tl! highlight] -->

    <div>
        <button>Save</button>
    </div>
</form>
```

Sekarang setelah kondisional dibungkus dalam elemen yang persisten, Livewire akan morph dua pohon HTML yang berbeda dengan benar.

#### Melewati morphing

Jika Anda perlu melewati morphing sepenuhnya untuk elemen, Anda dapat menggunakan [wire:replace](/docs/wire-replace) untuk menginstruksikan Livewire untuk mengganti semua anak elemen alih-alih mencoba morph elemen yang sudah ada.