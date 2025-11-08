---
title: History Encryption
---

# History Encryption

Bayangkan skenario di mana pengguna Anda diautentikasi, menjelajahi informasi istimewa di situs Anda, lalu keluar. Jika mereka menekan tombol kembali, mereka masih dapat melihat informasi istimewa yang disimpan di state riwayat jendela. Ini adalah risiko keamanan. Untuk mencegah hal ini, Inertia.js menyediakan fitur enkripsi riwayat.

## Cara kerja

Saat Anda menginstruksikan Inertia untuk mengenkripsi riwayat aplikasi Anda, ini menggunakan [`crypto` api](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) bawaan browser untuk mengenkripsi data halaman saat ini sebelum mendorongnya ke state riwayat. Kami menyimpan kunci yang sesuai di sesi penyimpanan browser. Saat pengguna menavigasi kembali ke halaman, kami mendekripsi data menggunakan kunci yang disimpan di sesi penyimpanan.

Setelah Anda menginstruksikan Inertia untuk menghapus state riwayat Anda, kami cukup menghapus kunci yang ada dari sesi penyimpanan dan menggulirkan yang baru. Jika kami mencoba mendekripsi state riwayat dengan kunci baru, itu akan gagal dan Inertia akan membuat request segar kembali ke server Anda untuk data halaman.

Enkripsi riwayat bergantung pada `window.crypto.subtle` yang hanya tersedia di lingkungan aman (situs dengan SSL diaktifkan).

## Ikut serta

Enkripsi riwayat adalah fitur opsional. Ada beberapa metode untuk mengaktifkannya:

### Enkripsi global

Jika Anda ingin mengaktifkan enkripsi riwayat secara global, atur nilai config `inertia.history.encrypt` ke `true`.

Anda dapat memilih untuk tidak mengenkripsi halaman tertentu dengan memanggil metode `Inertia::encryptHistory()` sebelum mengembalikan respons.

Laravel:

```php
Inertia::encryptHistory(false);
```

### Enkripsi per-request

Untuk mengenkripsi riwayat request individual, cukup panggil metode `Inertia::encryptHistory()` sebelum mengembalikan respons.

Laravel:

```php
Inertia::encryptHistory();
```

### Middleware enkripsi

Untuk mengenkripsi grup route, Anda dapat menggunakan middleware `EncryptHistory` yang disertakan Inertia.

Laravel:

```php
Route::middleware([Inertia\Middleware\EncryptHistory::class])->get('/', function() {
    //
});
Route::middleware(['inertia::encrypt'])->get('/', function() {
    //
});
```

## Menghapus riwayat

Untuk menghapus state riwayat, Anda dapat memanggil metode `Inertia::clearHistory()` sebelum mengembalikan respons.

Laravel:

```php
Inertia::clearHistory();
```

Setelah respons dirender di klien, kunci enkripsi akan diputar, membuat state riwayat sebelumnya tidak dapat dibaca.

Anda juga dapat menghapus riwayat di sisi klien dengan memanggil `router.clearHistory()`.