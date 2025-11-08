---
sidebar_position: 3
---

# Protokol

Halaman ini berisi spesifikasi detail dari protokol Inertia. Pastikan untuk membaca halaman [cara kerja](/how-it-works) terlebih dahulu untuk gambaran umum tingkat tinggi.

## Response HTML

Permintaan pertama ke aplikasi Inertia adalah permintaan browser halaman penuh yang biasa, tanpa header atau data Inertia khusus. Untuk permintaan ini, server mengembalikan dokumen HTML penuh.

Response HTML ini mencakup aset situs (CSS, JavaScript) serta `<div>` root di dalam body halaman. `<div>` root berfungsi sebagai titik mount untuk aplikasi client-side, dan menyertakan atribut `data-page` dengan objek [halaman](#objek-halaman) yang di-encode JSON untuk halaman awal. Inertia menggunakan informasi ini untuk menjalankan framework client-side Anda dan menampilkan komponen halaman awal.

```html
<html>
<head>
<title>Aplikasi saya</title>
<link href="/css/app.css" rel="stylesheet">
<script src="/js/app.js" defer></script>
</head>
<body>
<div id="app" data-page='{"component":"Event","props":{"event":{"id":80,"title":"Pesta ulang tahun","start_date":"2019-06-02","description":"Datang dan rayakan pesta ulang tahun ke-36 Jonathan!"}},"url":"/events/80","version":"c32b8e4965f418ad16eaebba1d4e960f"}'></div>
</body>
</html>
```

Meskipun response awal adalah HTML, Inertia tidak melakukan server-side rendering pada komponen halaman JavaScript.

## Response Inertia

Setelah aplikasi Inertia dijalankan, semua permintaan selanjutnya ke situs dilakukan melalui XHR dengan header `X-Inertia` diatur ke `true`. Header ini menunjukkan bahwa permintaan dibuat oleh Inertia dan bukan kunjungan halaman penuh standar.

Ketika server mendeteksi header `X-Inertia`, alih-alih merespons dengan dokumen HTML penuh, server mengembalikan response JSON dengan objek [halaman](#objek-halaman) yang di-encode.

```json
{
    "component": "Event",
    "props": {
        "event": {
            "id": 80,
            "title": "Pesta ulang tahun",
            "start_date": "2019-06-02",
            "description": "Datang dan rayakan pesta ulang tahun ke-36 Jonathan!"
        }
    },
    "url": "/events/80",
    "version": "6b16b94d7c51cbe5b1fa42aac98241d5",
    "encryptHistory": true,
    "clearHistory": false
}
```

## Header permintaan

Header berikut secara otomatis dikirim oleh Inertia saat melakukan permintaan. Anda tidak perlu mengatur ini secara manual, mereka ditangani oleh adapter client-side Inertia.

1. **X-Inertia:** Diatur ke `true` untuk menunjukkan ini adalah permintaan Inertia.
2. **X-Requested-With:** Diatur ke `XMLHttpRequest` pada semua permintaan Inertia.
3. **Accept:** Diatur ke `text/html, application/xhtml+xml` untuk menunjukkan tipe response yang dapat diterima.
4. **X-Inertia-Version:** Versi aset saat ini untuk memeriksa ketidakcocokan aset.
5. **Purpose:** Diatur ke `prefetch` saat melakukan permintaan [prefetch](/prefetching).
6. **X-Inertia-Partial-Component:** Nama komponen untuk [reload parsial](/partial-reloads).
7. **X-Inertia-Partial-Data:** Daftar yang dipisahkan koma dari props yang akan disertakan dalam reload parsial.
8. **X-Inertia-Partial-Except:** Daftar yang dipisahkan koma dari props yang akan dikecualikan dalam reload parsial.
9. **X-Inertia-Reset:** Daftar yang dipisahkan koma dari props yang akan direset pada navigasi.
10. **Cache-Control:** Diatur ke `no-cache` untuk permintaan reload untuk mencegah penyajian konten yang basi.
11. **X-Inertia-Error-Bag:** Menentukan error bag mana yang akan digunakan untuk [error validasi](/validation).
12. **X-Inertia-Infinite-Scroll-Merge-Intent:** Menunjukkan apakah data yang diminta harus ditambahkan atau di-prepend saat menggunakan [Infinite scroll](/infinite-scroll).

## Header response

Header berikut harus dikirim oleh adapter server-side Anda dalam response Inertia. Jika Anda menggunakan adapter server-side resmi, ini ditangani secara otomatis.

1. **X-Inertia:** Diatur ke `true` untuk mengkonfirmasi ini adalah response Inertia.
2. **X-Inertia-Location:** Digunakan untuk redirect eksternal ketika response `409 Conflict` dikembalikan karena ketidakcocokan versi aset.
3. **Vary:** Diatur ke `X-Inertia` untuk membantu browser membedakan dengan benar antara response HTML dan JSON. Header ini harus disertakan pada response HTML dan JSON untuk mencegah browser menampilkan konten JSON alih-alih HTML yang dirender atau memicu penanganan error Inertia untuk kunjungan halaman normal. Beberapa browser memerlukan header ini pada semua response, termasuk redirect yang mengarah ke endpoint Inertia.

## Objek halaman

Inertia berbagi data antara server dan client melalui objek halaman. Objek ini mencakup informasi yang diperlukan untuk merender komponen halaman, memperbarui state history browser, dan melacak versi aset situs. Objek halaman dapat menyertakan properti berikut:

1. **component:** Nama komponen halaman JavaScript.
2. **props:** Props halaman (data).
3. **url:** URL halaman.
4. **version:** Versi aset saat ini.
5. **encryptHistory:** Apakah akan mengenkripsi state history halaman saat ini.
6. **clearHistory:** Apakah akan membersihkan state history terenkripsi apa pun.
7. **mergeProps:** Array kunci prop yang harus digabungkan (ditambahkan) selama navigasi. Lihat dokumentasi [menggabungkan props](/merging-props) untuk detailnya.
8. **prependProps:** Array kunci prop yang harus di-prepend selama navigasi.
9. **deepMergeProps:** Array kunci prop yang harus digabungkan secara mendalam selama navigasi.
10. **matchPropsOn:** Array kunci prop yang digunakan untuk pencocokan saat menggabungkan props.
11. **scrollProps:** Konfigurasi untuk perilaku penggabungan prop infinite scroll.
12. **deferredProps:** Konfigurasi untuk lazy loading props di client-side. Lihat dokumentasi [deferred props](/deferred-props) untuk detailnya.

Pada kunjungan halaman penuh standar, objek halaman di-encode JSON ke dalam atribut `data-page` di `<div>` root. Pada kunjungan Inertia, objek halaman dikembalikan sebagai payload JSON.

### Objek halaman dasar

Objek halaman minimal berisi properti inti.

```json
{
    "component": "User/Edit",
    "props": {
        "user": {
            "name": "Jonathan"
        }
    },
    "url": "/user/123",
    "version": "6b16b94d7c51cbe5b1fa42aac98241d5",
    "clearHistory": false,
    "encryptHistory": false
}
```

### Objek halaman dengan deferred props

Saat menggunakan deferred props, objek halaman menyertakan konfigurasi `deferredProps`. Perhatikan bahwa deferred props tidak disertakan dalam props awal karena dimuat dalam permintaan berikutnya.

```json
{
    "component": "Posts/Index",
    "props": {
        "user": {
            "name": "Jonathan"
        }
    },
    "url": "/posts",
    "version": "6b16b94d7c51cbe5b1fa42aac98241d5",
    "clearHistory": false,
    "encryptHistory": false,
    "deferredProps": {
        "default": ["comments", "analytics"],
        "sidebar": ["relatedPosts"]
    }
}
```

### Objek halaman dengan merge props

Saat menggunakan merge props, konfigurasi tambahan disertakan.

```json
{
    "component": "Feed/Index",
    "props": {
        "user": {
            "name": "Jonathan"
        },
        "posts": [
            {"id": 1, "title": "Postingan Pertama"}
        ],
        "notifications": [
            {"id": 2, "message": "Komentar baru"}
        ],
        "conversations": {
            "data": [
                {"id": 1, "title": "Obrolan Dukungan", "participants": ["John", "Jane"]}
            ]
        }
    },
    "url": "/feed",
    "version": "6b16b94d7c51cbe5b1fa42aac98241d5",
    "clearHistory": false,
    "encryptHistory": false,
    "mergeProps": ["posts"],
    "prependProps": ["notifications"],
    "deepMergeProps": ["conversations"],
    "matchPropsOn": ["posts.id", "notifications.id", "conversations.data.id"]
}
```

### Objek halaman dengan scroll props

Saat menggunakan [Infinite scroll](/infinite-scroll), objek halaman menyertakan konfigurasi `scrollProps`.

```json
{
    "component": "Posts/Index",
    "props": {
        "posts": {
            "data": [
                {"id": 1, "title": "Postingan Pertama"},
                {"id": 2, "title": "Postingan Kedua"}
            ]
        }
    },
    "url": "/posts?page=1",
    "version": "6b16b94d7c51cbe5b1fa42aac98241d5",
    "clearHistory": false,
    "encryptHistory": false,
    "mergeProps": ["posts.data"],
    "scrollProps": {
        "posts": {
            "pageName": "page",
            "previousPage": null,
            "nextPage": 2,
            "currentPage": 1
        }
    }
}
```

## Versi aset

Salah satu tantangan umum dengan single-page apps adalah menyegarkan aset situs saat telah berubah. Inertia mempermudah ini dengan secara opsional melacak versi saat ini dari aset situs. Jika aset berubah, Inertia akan secara otomatis melakukan kunjungan halaman penuh alih-alih kunjungan XHR.

Objek [halaman](#objek-halaman) Inertia menyertakan identifier `version`. Identifier versi ini diatur server-side dan dapat berupa angka, string, hash file, atau nilai lain yang mewakili versi "saat ini" dari aset situs Anda, selama nilai berubah saat aset situs telah diperbarui.

Setiap kali permintaan Inertia dibuat, Inertia akan menyertakan versi aset saat ini dalam header `X-Inertia-Version`. Ketika server menerima permintaan, server membandingkan versi aset yang disediakan dalam header `X-Inertia-Version` dengan versi aset saat ini. Ini biasanya ditangani dalam lapisan middleware dari framework server-side Anda.

Jika versi aset sama, permintaan hanya berlanjut seperti yang diharapkan. Namun, jika versi aset berbeda, server segera mengembalikan response `409 Conflict`, dan menyertakan URL dalam header `X-Inertia-Location`. Header ini diperlukan, karena redirect server-side mungkin telah terjadi. Ini memberi tahu Inertia apa URL tujuan akhir yang dimaksud.

Perhatikan, response `409 Conflict` hanya dikirim untuk permintaan `GET`, dan tidak untuk permintaan `POST/PUT/PATCH/DELETE`. Namun demikian, mereka akan dikirim jika terjadi redirect `GET` setelah salah satu permintaan ini.

Jika data sesi "flash" ada saat terjadi response `409 Conflict`, adapter framework server-side Inertia akan otomatis mem-flash ulang data ini.

Anda dapat membaca lebih lanjut tentang ini di halaman [versi aset](/asset-versioning).

## Reload parsial

Saat membuat permintaan Inertia, opsi reload parsial memungkinkan Anda untuk meminta subset dari props (data) dari server pada kunjungan berikutnya ke komponen halaman yang *sama*. Ini dapat menjadi optimasi kinerja yang membantu jika dapat diterima bahwa beberapa data halaman menjadi basi. Lihat dokumentasi [reload parsial](/partial-reloads) untuk detailnya.

Ketika permintaan reload parsial dibuat, Inertia menyertakan dua header tambahan dengan permintaan: `X-Inertia-Partial-Data` dan `X-Inertia-Partial-Component`.

Header `X-Inertia-Partial-Data` adalah daftar yang dipisahkan koma dari kunci props (data) yang diinginkan yang harus dikembalikan.

Header `X-Inertia-Partial-Component` menyertakan nama komponen yang sedang dimuat ulang secara parsial. Ini diperlukan, karena reload parsial hanya berfungsi untuk permintaan yang dibuat ke komponen halaman yang sama. Jika tujuan akhir berbeda karena alasan tertentu (misalnya pengguna telah logout dan sekarang berada di halaman login), maka tidak ada reload parsial yang akan terjadi.

```json
{
    "component": "Events",
    "props": {
        "auth": {...},
        // TIDAK disertakan
        "categories": [...], // TIDAK disertakan
        "events": [...]      // disertakan
    },
    "url": "/events/80",
    "version": "6b16b94d7c51cbe5b1fa42aac98241d5"
}
```

## Kode status HTTP

Inertia menggunakan kode status HTTP tertentu untuk menangani skenario yang berbeda.

1. **200 OK:** Response sukses standar untuk response HTML dan JSON Inertia.
2. **302 Found:** Response redirect standar. Adapter server-side Inertia secara otomatis mengubah ini menjadi `303 See Other` ketika dikembalikan setelah permintaan `PUT`, `PATCH`, atau `DELETE`.
3. **303 See Other:** Digunakan untuk redirect setelah permintaan non-GET. Kode status ini memberi tahu browser untuk membuat permintaan `GET` ke URL redirect, mencegah pengiriman formulir duplikat yang dapat terjadi jika browser mengulangi metode permintaan asli.
4. **409 Conflict:** Dikembalikan ketika ada ketidakcocokan versi aset atau untuk redirect eksternal. Untuk ketidakcocokan aset, ini memicu reload halaman penuh. Untuk redirect eksternal, response menyertakan header `X-Inertia-Location` dan memicu redirect `window.location` di client-side.