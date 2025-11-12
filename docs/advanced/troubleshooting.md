---
sidebar_position: 48
---

# Troubleshooting

Di Livewire HQ, kami mencoba menghapus masalah dari jalan Anda sebelum Anda menabrakinya. Namun, terkadang, ada beberapa masalah yang tidak dapat kami selesaikan tanpa memperkenalkan masalah baru, dan di lain waktu, ada masalah yang tidak dapat kami antisipasi.

Berikut adalah beberapa kesalahan umum dan skenario yang mungkin Anda temui dalam aplikasi Livewire Anda.

## Ketidakcocok komponen

Saat berinteraksi dengan komponen Livewire di halaman Anda, Anda mungkin mengalami perilaku aneh atau pesan kesalahan seperti berikut:

```
Error: Component already initialized
```

```
Error: Snapshot missing on Livewire with id: ...
```

Ada banyak alasan mengapa Anda mungkin menghadapi pesan-pesan ini, tetapi yang paling umum adalah lupa menambahkan `wire:key` ke elemen dan komponen di dalam loop `@foreach`.

### Menambahkan `wire:key`

Setiap kali Anda memiliki loop dalam template Blade Anda menggunakan sesuatu seperti `@foreach`, Anda perlu menambahkan `wire:key` ke tag pembuka dari elemen pertama dalam loop:

```blade
@foreach($posts as $post)
    <div wire:key="{{ $post->id }}"> <!-- [tl! highlight] -->
        ...
    </div>
@endforeach
```

Ini memastikan bahwa Livewire dapat melacak elemen yang berbeda dalam loop saat loop berubah.

Hal yang sama berlaku untuk komponen Livewire dalam loop:

```blade
@foreach($posts as $post)
    <livewire:show-post :$post :key="$post->id" /> <!-- [tl! highlight] -->
@endforeach
```

Namun, ini adalah skenario rumit yang mungkin belum Anda asumsikan:

Saat Anda memiliki komponen Livewire yang bersarang dalam loop `@foreach`, Anda MASIH perlu menambahkan kunci ke sana. Sebagai contoh:

```blade
@foreach($posts as $post)
    <div wire:key="{{ $post->id }}">
        ...
        <livewire:show-post :$post :key="$post->id" /> <!-- [tl! highlight] -->
        ...
    </div>
@endforeach
```

Tanpa kunci pada komponen Livewire yang bersarang, Livewire tidak akan dapat mencocokkan komponen yang di-loop antar request jaringan.

#### Memberi awalan pada kunci

Skenario rumit lain yang mungkin Anda temui adalah memiliki kunci duplikat dalam komponen yang sama. Ini sering kali terjadi dari menggunakan ID model sebagai kunci, yang kadang-kadang bertabrak.

Berikut adalah contoh di mana kita perlu menambahkan awalan `post-` dan `author-` untuk menunjuk setiap kumpulan kunci sebagai unik. Jika tidak, jika Anda memiliki model `$post` dan `$author` dengan ID yang sama, Anda akan memiliki tabrakan ID:

```blade
<div>
    @foreach($posts as $post)
        <div wire:key="post-{{ $post->id }}">...</div> <!-- [tl! highlight] -->
    @endforeach

    @foreach($authors as $author)
        <div wire:key="author-{{ $author->id }}">...</div> <!-- [tl! highlight] -->
    @endforeach
</div>
```

## Multiple instances Alpine

Saat menginstal Livewire, Anda mungkin mengalami pesan kesalahan seperti berikut:

```
Error: Detected multiple instances of Alpine running
```

```
Alpine Expression Error: $wire is not defined
```

Jika ini masalahnya, Anda kemungkinan memiliki dua versi Alpine yang berjalan pada halaman yang sama. Livewire menyertakan bundle Alpine-nya sendiri di balik layar, jadi Anda harus menghapus versi Alpine lainnya di halaman Livewire dalam aplikasi Anda.

Satu skenario umum di mana ini terjadi adalah menambahkan Livewire ke aplikasi yang sudah ada yang sudah menyertakan Alpine. Sebagai contoh, jika Anda menginstal starter kit Laravel Breeze dan kemudian menambahkan Livewire, Anda akan mengalami ini.

Solusi untuk ini sederhana: hapus instance Alpine tambahan.

### Menghapus Alpine Laravel Breeze

Jika Anda menginstal Livewire di dalam Laravel Breeze yang ada (versi Blade + Alpine), Anda perlu menghapus baris berikut dari `resources/js/app.js`:

```js
import './bootstrap';

import Alpine from 'alpinejs'; // [tl! remove:4]

window.Alpine = Alpine;

Alpine.start();
```

### Menghapus versi CDN Alpine

Karena Livewire versi 2 dan di bawah tidak menyertakan Alpine secara default, Anda mungkin telah menyertakan CDN Alpine sebagai tag skrip di kepala layout Anda. Di Livewire v3, Anda dapat menghapus CDN ini sama sekali, dan Livewire akan secara otomatis menyediakan Alpine untuk Anda:

```html
    ...
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script> <!-- [tl! remove] -->
</head>
```

Catatan: Anda juga dapat menghapus plugin Alpine tambahan apa pun, karena Livewire menyertakan semua plugin Alpine kecuali `@alpinejs/ui`.

## Hilang `@alpinejs/ui`

Versi Alpine yang dibundel Livewire menyertakan semua plugin Alpine KECUALI `@alpinejs/ui`. Jika Anda menggunakan komponen headless dari [Alpine Components](https://alpinejs.dev/components), yang bergantung pada plugin ini, Anda mungkin mengalami kesalahan seperti berikut:

```
Uncaught Alpine: no element provided to x-anchor
```

Untuk memperbaikinya, Anda dapat menyertakan plugin `@alpinejs/ui` sebagai CDN dalam file layout Anda seperti ini:

```html
    ...
    <script defer src="https://unpkg.com/@alpinejs/ui@3.13.7-beta.0/dist/cdn.min.js"></script> <!-- [tl! add] -->
</head>
```

Catatan: pastikan untuk menyertakan versi terbaru dari plugin ini, yang dapat Anda temukan di [halaman dokumentasi komponen apa pun](https://alpinejs.dev/component/headless-dialog/docs).