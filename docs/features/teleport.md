---
sidebar_position: 26
---

# Teleport

Livewire memungkinkan Anda untuk _teleport_ bagian dari template Anda ke bagian lain dari DOM di halaman secara menyeluruh.

Ini berguna untuk hal-hal seperti dialog bersarang. Saat menyarangkan satu dialog di dalam dialog lainnya, z-index dari modal induk diterapkan pada modal bersarang. Ini dapat menyebabkan masalah dengan styling backdrop dan overlay. Untuk menghindari masalah ini, Anda dapat menggunakan direktif `@teleport` Livewire untuk merender setiap modal bersarang sebagai saudara kandung di DOM yang dirender.

Fungsionalitas ini didukung oleh [direktif `x-teleport` Alpine](https://alpinejs.dev/directives/teleport).

## Penggunaan dasar

Untuk _teleport_ sebagian template Anda ke bagian lain dari DOM, Anda dapat membungkusnya dalam direktif `@teleport` Livewire.

Di bawah ini adalah contoh penggunaan `@teleport` untuk merender konten dialog modal di akhir elemen `<body>` pada halaman:

```php
<div>
    <!-- Modal -->
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle Modal</button>

        @teleport('body')
            <div x-show="open">
                Modal contents...
            </div>
        @endteleport
    </div>
</div>
```

> [!info]
> Selector `@teleport` dapat berupa string apa pun yang biasanya Anda berikan ke sesuatu seperti `document.querySelector()`.
>
> Anda dapat mempelajari lebih lanjut tentang `document.querySelector()` dengan berkonsultasi pada [dokumentasi MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).

Sekarang, ketika template Livewire di atas dirender di halaman, bagian _konten_ dari modal akan dirender di akhir `<body>`:

```html
<body>
    <!-- ... -->

    <div x-show="open">
        Modal contents...
    </div>
</body>
```

> [!warning] Anda harus teleport di luar komponen
> Livewire hanya mendukung teleport HTML di luar komponen Anda. Sebagai contoh, teleport modal ke tag `<body>` tidak masalah, tetapi teleportnya ke elemen lain dalam komponen Anda tidak akan berhasil.

> [!warning] Teleport hanya bekerja dengan elemen root tunggal
> Pastikan Anda hanya menyertakan elemen root tunggal di dalam pernyataan `@teleport` Anda.