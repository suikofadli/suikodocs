---
title: Asset Versioning
---

# Asset Versioning

Salah satu tantangan umum saat membangun single-page apps adalah me-refresh asset situs ketika telah berubah. Untungnya, Inertia mempermudah ini dengan secara opsional melacak versi saat ini dari asset situs Anda. Ketika sebuah asset berubah, Inertia akan secara otomatis membuat kunjungan halaman penuh sebagai ganti kunjungan XHR pada permintaan berikutnya.

## Konfigurasi

Untuk mengaktifkan refresh asset otomatis, Anda perlu memberi tahu Inertia versi saat ini dari asset Anda. Ini bisa berupa string apa pun (huruf, angka, atau file hash), asalkan berubah ketika asset Anda telah diperbarui.

Biasanya, versi asset aplikasi Anda dapat ditentukan dalam metode `version` dari middleware Inertia `HandleInertiaRequests`.

Laravel:

```php
class HandleInertiaRequests extends Middleware
{
    public function version(Request $request)
    {
        return parent::version($request);
    }
}
```

Sebagai alternatif, versi asset dapat disediakan secara manual menggunakan metode `Inertia::version()`.

Laravel:

```php
use Inertia\Inertia;
Inertia::version($version);
Inertia::version(fn () => $version); // Secara malas...
```

## Cache busting

Refresh asset di Inertia bekerja dengan asumsi bahwa kunjungan halaman penuh akan memicu asset Anda untuk dimuat ulang. Namun, Inertia tidak benar-benar melakukan apa pun untuk memaksa ini. Biasanya ini dilakukan dengan beberapa bentuk cache busting. Misalnya, menambahkan parameter query versi ke akhir URL asset Anda.

Dengan integrasi Vite Laravel, versioning asset dilakukan secara otomatis. Jika Anda menggunakan Laravel Mix, Anda dapat melakukan ini secara otomatis dengan mengaktifkan [versioning](https://laravel.com/docs/mix#versioning-and-cache-busting) di file `webpack.mix.js` Anda.

## Refresh manual

Jika Anda ingin mengambil refresh asset di bawah kendali Anda, Anda dapat mengembalikan nilai tetap dari metode `version` di middleware `HandleInertiaRequests`. Ini menonaktifkan versioning asset otomatis Inertia.

Misalnya, jika Anda ingin memberi tahu pengguna ketika versi baru dari frontend Anda tersedia, Anda masih dapat mengekspos versi asset aktual ke frontend dengan memasukkannya sebagai [shared data](/shared-data).

```php
class HandleInertiaRequests extends Middleware
{
    public function version(Request $request)
    {
        return null;
    }

    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'version' => parent::version($request),
        ]);
    }
}
```

Di frontend, Anda dapat memantau properti `version` dan menampilkan notifikasi ketika versi baru terdeteksi.