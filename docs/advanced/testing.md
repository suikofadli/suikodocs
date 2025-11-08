---
title: Testing
---

# Testing

Ada banyak cara berbeda untuk menguji aplikasi Inertia. Halaman ini memberikan gambaran umum singkat tentang alat yang tersedia.

## End-to-end tests

Salah satu pendekatan populer untuk menguji komponen halaman JavaScript Anda adalah menggunakan alat pengujian end-to-end seperti [Cypress](https://www.cypress.io/) atau [Pest](https://pestphp.com). Ini adalah alat otomasi browser yang memungkinkan Anda menjalankan simulasi nyata dari aplikasi Anda di browser. Tes ini diketahui lebih lambat; namun, karena mereka menguji aplikasi Anda pada lapisan yang sama dengan pengguna akhir Anda, mereka dapat memberikan banyak keyakinan bahwa aplikasi Anda berfungsi dengan benar. Dan, karena tes ini dijalankan di browser, kode JavaScript Anda benar-benar dieksekusi dan diuji juga.

## Client-side unit tests

Pendekatan lain untuk menguji komponen halaman Anda adalah menggunakan framework pengujian unit client-side, seperti [Jest](https://jestjs.io/) atau [Mocha](https://mochajs.org/). Pendekatan ini memungkinkan Anda menguji komponen halaman JavaScript Anda secara terisolasi menggunakan Node.js.

## Endpoint tests

Selain menguji komponen halaman JavaScript Anda, Anda mungkin juga ingin menguji respons Inertia yang dikembalikan oleh framework server-side Anda. Pendekatan populer untuk melakukan ini adalah menggunakan tes endpoint, di mana Anda membuat permintaan ke aplikasi Anda dan memeriksa responsnya. Laravel [menyediakan alat](https://laravel.com/docs/http-tests) untuk menjalankan jenis tes ini.

Namun, untuk membuat proses ini lebih mudah, adapter Laravel Inertia menyediakan alat pengujian HTTP tambahan. Mari kita lihat contohnya.

```php
use Inertia\Testing\AssertableInertia as Assert;

class PodcastsControllerTest extends TestCase
{
    public function test_can_view_podcast()
    {
        $this->get('/podcasts/41')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Podcasts/Show')
                ->has('podcast', fn (Assert $page) => $page
                    ->where('id', $podcast->id)
                    ->where('subject', 'The Laravel Podcast')
                    ->where('description', 'The Laravel Podcast brings you Laravel and PHP development news and discussion.')
                    ->has('seasons', 4)
                    ->has('seasons.4.episodes', 21)
                    ->has('host', fn (Assert $page) => $page
                        ->where('id', 1)
                        ->where('name', 'Matt Stauffer')
                    )
                    ->has('subscribers', 7, fn (Assert $page) => $page
                        ->where('id', 2)
                        ->where('name', 'Claudio Dekker')
                        ->where('platform', 'Apple Podcasts')
                        ->etc()
                        ->missing('email')
                        ->missing('password')
                    )
                )
            );
    }
}
```

Seperti yang Anda lihat dalam contoh di atas, Anda dapat menggunakan metode assertion ini untuk melakukan assertion terhadap konten data yang disediakan untuk respons Inertia. Selain itu, Anda dapat melakukan assertion bahwa data array memiliki panjang tertentu serta melakukan scoping pada assertion Anda.

Anda dapat menggunakan metode `inertiaProps` untuk mengambil props yang dikembalikan dalam respons. Anda dapat mengirimkan kunci untuk mengambil properti tertentu, dan properti bersarang didukung menggunakan notasi "dot".

```php
$response = $this->get('/podcasts/41');

// Mengembalikan semua props...
$response->inertiaProps();

// Mengembalikan properti tertentu...
$response->inertiaProps('podcast');

// Mengembalikan properti bersarang menggunakan notasi "dot"...
$response->inertiaProps('podcast.id');
```

Mari kita telusuri metode `assertInertia` dan assertion yang tersedia secara detail. Pertama, untuk melakukan assertion bahwa respons Inertia memiliki properti, Anda dapat menggunakan metode `has`. Anda dapat menganggap metode ini mirip dengan fungsi `isset` PHP.

```php
$response->assertInertia(fn (Assert $page) => $page
    // Memeriksa properti level-root...
    ->has('podcast')
    // Memeriksa properti bersarang menggunakan notasi "dot"...
    ->has('podcast.id')
);
```

Untuk melakukan assertion bahwa properti Inertia memiliki jumlah item yang ditentukan, Anda dapat menyediakan ukuran yang diharapkan sebagai argumen kedua ke metode `has`.

```php
$response->assertInertia(fn (Assert $page) => $page
    // Memeriksa apakah properti level-root memiliki 7 item...
    ->has('podcasts', 7)
    // Memeriksa properti bersarang menggunakan notasi "dot"...
    ->has('podcast.subscribers', 7)
);
```

Metode `has` juga dapat digunakan untuk melakukan scoping properti untuk mengurangi pengulangan saat melakukan assertion terhadap properti bersarang.

```php
$response->assertInertia(fn (Assert $page) => $page
    // Membuat scope properti level-tunggal...
    ->has('message', fn (Assert $page) => $page
        // Sekarang kita dapat melanjutkan chaining metode...
        ->has('subject')
        ->has('comments', 5)
        // Dan bahkan dapat membuat scope lebih dalam menggunakan notasi "dot"...
        ->has('comments.0', fn (Assert $page) => $page
            ->has('body')
            ->has('files', 1)
            ->has('files.0', fn (Assert $page) => $page
                ->has('url')
            )
        )
    )
);
```

Saat melakukan scoping ke properti Inertia yang merupakan array atau koleksi, Anda juga dapat melakukan assertion bahwa jumlah item tertentu hadir selain melakukan scoping ke item pertama.

```php
$response->assertInertia(fn (Assert $page) => $page
    // Melakukan assertion bahwa ada 5 komentar dan secara otomatis melakukan scoping ke komentar pertama...
    ->has('comments', 5, fn (Assert $page) => $page
        ->has('body')
        // ...
    )
);
```

Untuk melakukan assertion bahwa properti Inertia memiliki nilai yang diharapkan, Anda dapat menggunakan assertion `where`.

```php
$response->assertInertia(fn (Assert $page) => $page
    ->has('message', fn (Assert $page) => $page
        // Melakukan assertion bahwa properti subject cocok dengan pesan yang diberikan...
        ->where('subject', 'This is an example message')
        // Atau, melakukan assertion terhadap nilai yang sangat bersarang...
        ->where('comments.0.files.0.name', 'example-attachment.pdf')
    )
);
```

Metode pengujian Inertia akan secara otomatis gagal ketika Anda tidak berinteraksi dengan setidaknya satu dari props dalam scope. Meskipun ini umumnya berguna, Anda mungkin mengalami situasi di mana Anda bekerja dengan data yang tidak dapat diandalkan (seperti dari feed eksternal), atau dengan data yang benar-benar tidak ingin Anda interaksi untuk menjaga tes Anda tetap sederhana. Untuk situasi ini, metode `etc` ada.

```php
$response->assertInertia(fn (Assert $page) => $page
    ->has('message', fn (Assert $page) => $page
        ->has('subject')
        ->has('comments')
        ->etc()
    )
);
```

Metode `missing` adalah kebalikan tepat dari metode `has`, memastikan bahwa properti tidak ada. Metode ini menjadi pendamping yang hebat untuk metode `etc`.

```php
$response->assertInertia(fn (Assert $page) => $page
    ->has('message', fn (Assert $page) => $page
        ->has('subject')
        ->missing('published_at')
        ->etc()
    )
);
```

### Menguji Partial Reloads

Anda dapat menggunakan metode `reloadOnly` dan `reloadExcept` untuk menguji bagaimana aplikasi Anda merespons [partial reloads](/partial-reloads). Metode ini melakukan permintaan tindak lanjut dan memungkinkan Anda membuat assertion terhadap respons.

```php
$response->assertInertia(fn (Assert $page) => $page
    ->has('orders')
    ->missing('statuses')
    ->reloadOnly('statuses', fn (Assert $reload) => $reload
        ->missing('orders')
        ->has('statuses', 5)
    )
);
```

Sebagai ganti mengirimkan satu prop sebagai string, Anda juga dapat mengirimkan array props ke `reloadOnly` atau `reloadExcept`.

### Menguji Deferred Props

Anda dapat menggunakan metode `loadDeferredProps` untuk menguji bagaimana aplikasi Anda merespons [deferred props](/deferred-props). Metode ini melakukan permintaan tindak lanjut untuk memuat properti yang ditangguhkan dan memungkinkan Anda membuat assertion terhadap respons.

```php
$response->assertInertia(fn (Assert $page) => $page
    ->has('users')
    ->has('roles')
    ->missing('permissions') // Properti ditangguhkan tidak ada dalam respons awal
    ->loadDeferredProps(fn (Assert $reload) => $reload
        ->has('permissions')
        ->where('permissions.0.name', 'edit users')
    )
);
```

Anda juga dapat memuat grup properti yang ditangguhkan tertentu dengan mengirimkan nama grup sebagai argumen pertama ke metode `loadDeferredProps`.

```php
$response->assertInertia(fn (Assert $page) => $page
    ->has('users')
    ->missing('teams')
    ->missing('projects')
    ->loadDeferredProps('attributes', fn (Assert $reload) => $reload
        ->has('teams', 5)
        ->has('projects')
        ->missing('permissions') // Grup berbeda
    )
);
```

Sebagai ganti mengirimkan satu grup sebagai string, Anda juga dapat mengirimkan array grup ke `loadDeferredProps`.

```php
$response->assertInertia(fn (Assert $page) => $page
    ->loadDeferredProps(['default', 'attributes'], fn (Assert $reload) => $reload
        ->has('permissions')
        ->has('teams')
        ->has('projects')
    )
);
```