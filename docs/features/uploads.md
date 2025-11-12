---
sidebar_position: 16
---

# Upload

Livewire menawarkan dukungan yang kuat untuk mengunggah file dalam komponen Anda.

Pertama, tambahkan trait `WithFileUploads` ke komponen Anda. Setelah trait ini ditambahkan ke komponen, Anda dapat menggunakan `wire:model` pada input file seolah-olah itu adalah tipe input lainnya dan Livewire akan menangani sisanya.

Berikut adalah contoh komponen sederhana yang menangani pengunggahan foto:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhoto extends Component
{
    use WithFileUploads;

    #[Validate('image|max:1024')] // 1MB Max
    public $photo;

    public function save()
    {
        $this->photo->store(path: 'photos');
    }
}
```

```blade
<form wire:submit="save">
    <input type="file" wire:model="photo">

    @error('photo') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

> [!warning] Metode "upload" telah dicadangkan
> Perhatikan contoh di atas menggunakan metode "save" sebagai ganti metode "upload". Ini adalah "gotcha" yang umum. Istilah "upload" dicadangkan oleh Livewire. Anda tidak dapat menggunakannya sebagai nama metode atau properti dalam komponen Anda.

Dari perspektif pengembang, menangani input file tidak berbeda dengan menangani tipe input lainnya: Tambahkan `wire:model` ke tag `<input>` dan semuanya akan ditangani untuk Anda.

Namun, ada lebih banyak hal yang terjadi di balik layar untuk membuat upload file bekerja di Livewire. Berikut adalah sekilas tentang apa yang terjadi ketika pengguna memilih file untuk diunggah:

1. Ketika file baru dipilih, JavaScript Livewire membuat permintaan awal ke komponen di server untuk mendapatkan URL "signed" upload sementara.
2. Setelah URL diterima, JavaScript melakukan "upload" aktual ke URL yang ditandatangani, menyimpan upload di direktori sementara yang ditunjuk oleh Livewire dan mengembalikan ID hash unik file sementara yang baru.
3. Setelah file diunggah dan ID hash unik dihasilkan, JavaScript Livewire membuat permintaan akhir ke komponen di server, memberitahu untuk "set" properti publik yang diinginkan ke file sementara yang baru.
4. Sekarang, properti publik (dalam hal ini `$photo`) diatur ke unggahan file sementara dan siap untuk disimpan atau divalidasi kapan saja.

## Menyimpan file yang diunggah

Contoh sebelumnya mendemonstrasikan skenario penyimpanan yang paling dasar: memindahkan file yang diunggah sementara ke direktori "photos" pada disk filesystem default aplikasi.

Namun, Anda mungkin ingin mengkustomisasi nama file dari file yang disimpan atau bahkan menentukan disk penyimpanan "spesifik" untuk menyimpan file (seperti S3).

> [!tip] Nama file asli
> Anda dapat mengakses nama file asli dari unggahan sementara, dengan memanggil metode `->getClientOriginalName()`-nya.

Livewire menghormati API yang sama yang digunakan Laravel untuk menyimpan file yang diunggah, jadi silakan berkonsultasi dengan [dokumentasi upload file Laravel](https://laravel.com/docs/filesystem#file-uploads). Namun, di bawah ini adalah beberapa skenario penyimpanan umum dan contohnya:

```php
public function save()
{
    // Simpan file di direktori "photos" dari disk filesystem default
    $this->photo->store(path: 'photos');

    // Simpan file di direktori "photos" di disk "s3" yang dikonfigurasi
    $this->photo->store(path: 'photos', options: 's3');

    // Simpan file di direktori "photos" dengan nama file "avatar.png"
    $this->photo->storeAs(path: 'photos', name: 'avatar');

    // Simpan file di direktori "photos" di disk "s3" yang dikonfigurasi dengan nama file "avatar.png"
    $this->photo->storeAs(path: 'photos', name: 'avatar', options: 's3');

    // Simpan file di direktori "photos", dengan visibilitas "public" di disk "s3" yang dikonfigurasi
    $this->photo->storePublicly(path: 'photos', options: 's3');

    // Simpan file di direktori "photos", dengan nama "avatar.png", dengan visibilitas "public" di disk "s3" yang dikonfigurasi
    $this->photo->storePubliclyAs(path: 'photos', name: 'avatar', options: 's3');
}
```

## Menangani multiple file

Livewire secara otomatis menangani multiple file upload dengan mendeteksi atribut `multiple` pada tag `<input>`.

Misalnya, di bawah ini adalah komponen dengan properti array bernama `$photos`. Dengan menambahkan `multiple` ke input file form, Livewire akan otomatis menambahkan file baru ke array ini:

```php
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhotos extends Component
{
    use WithFileUploads;

    #[Validate(['photos.*' => 'image|max:1024'])]
    public $photos = [];

    public function save()
    {
        foreach ($this->photos as $photo) {
            $photo->store(path: 'photos');
        }
    }
}
```

```blade
<form wire:submit="save">
    <input type="file" wire:model="photos" multiple>

    @error('photos.*') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

## Validasi file

Seperti yang telah kita diskusikan, memvalidasi upload file dengan Livewire sama dengan menangani upload file dari controller Laravel standar.

> [!warning] Pastikan S3 dikonfigurasi dengan benar
> Banyak aturan validasi yang berkaitan dengan file memerlukan akses ke file. Ketika [mengunggah langsung ke S3](#uploading-directly-to-amazon-s3), aturan validasi ini akan gagal jika objek file S3 tidak dapat diakses secara publik.

Untuk informasi lebih lanjut tentang validasi file, konsultasikan [dokumentasi validasi file Laravel](https://laravel.com/docs/validation#available-validation-rules).

## URL preview sementara

Setelah pengguna memilih file, Anda biasanya harus menunjukkan preview file tersebut sebelum mereka mengirimkan form dan menyimpan file.

Livewire membuat ini trivial dengan menggunakan metode `->temporaryUrl()` pada file yang diunggah.

> [!info] URL sementara dibatasi untuk gambar
> Untuk alasan keamanan, URL preview sementara hanya didukung pada file dengan tipe MIME gambar.

Mari kita jelajahi contoh upload file dengan preview gambar:

```php
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhoto extends Component
{
    use WithFileUploads;

    #[Validate('image|max:1024')]
    public $photo;

    // ...
}
```

```blade
<form wire:submit="save">
    @if ($photo) <!-- [tl! highlight:2] -->
        <img src="{{ $photo->temporaryUrl() }}">
    @endif

    <input type="file" wire:model="photo">

    @error('photo') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

Seperti yang telah dibahas sebelumnya, Livewire menyimpan file sementara di direktori non-publik; oleh karena itu, biasanya tidak ada cara sederhana untuk mengekspos URL publik sementara ke pengguna Anda untuk preview gambar.

Namun, Livewire memecahkan masalah ini dengan menyediakan URL yang ditandatangani sementara yang berpura-pura menjadi gambar yang diunggah sehingga halaman Anda dapat menunjukkan preview gambar kepada pengguna Anda.

URL ini dilindungi dari menunjukkan file di direktori di atas direktori sementara. Dan, karena ditandatangani, pengguna tidak dapat menyalahgunakan URL ini untuk preview file lain di sistem Anda.

> [!tip] URL signed sementara S3
> Jika Anda mengonfigurasi Livewire untuk menggunakan S3 untuk penyimpanan file sementara, memanggil `->temporaryUrl()` akan menghasilkan URL yang ditandatangani sementara ke S3 langsung sehingga preview gambar tidak dimuat dari server aplikasi Laravel Anda.

## Menguji upload file

Anda dapat menggunakan helper pengujian upload file Laravel yang ada untuk menguji upload file.

Di bawah ini adalah contoh lengkap pengujian komponen `UploadPhoto` dengan Livewire:

```php
<?php

namespace Tests\Feature\Livewire;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Livewire\UploadPhoto;
use Livewire\Livewire;
use Tests\TestCase;

class UploadPhotoTest extends TestCase
{
    public function test_can_upload_photo()
    {
        Storage::fake('avatars');

        $file = UploadedFile::fake()->image('avatar.png');

        Livewire::test(UploadPhoto::class)
            ->set('photo', $file)
            ->call('upload', 'uploaded-avatar.png');

        Storage::disk('avatars')->assertExists('uploaded-avatar.png');
    }
}
```

Di bawah ini adalah contoh komponen `UploadPhoto` yang diperlukan untuk membuat tes sebelumnya lulus:

```php
use Livewire\Component;
use Livewire\WithFileUploads;

class UploadPhoto extends Component
{
    use WithFileUploads;

    public $photo;

    public function upload($name)
    {
        $this->photo->storeAs('/', $name, disk: 'avatars');
    }

    // ...
}
```

Untuk informasi lebih lanjut tentang pengujian upload file, silakan konsultasikan [dokumentasi pengujian upload file Laravel](https://laravel.com/docs/http-tests#testing-file-uploads).

## Mengunggah langsung ke Amazon S3

Seperti yang telah dibahas sebelumnya, Livewire menyimpan semua upload file di direktori sementara hingga pengembang menyimpan file secara permanen.

Secara default, Livewire menggunakan konfigurasi disk filesystem default (biasanya `local`) dan menyimpan file dalam direktori `livewire-tmp/`.

Akibatnya, upload file selalu menggunakan server aplikasi Anda, bahkan jika Anda memilih untuk menyimpan file yang diunggah di bucket S3 nanti.

Jika Anda ingin melewati server aplikasi Anda dan sebagai gantinya menyimpan upload sementara Livewire di bucket S3, Anda dapat mengkonfigurasi perilaku itu di file konfigurasi `config/livewire.php` aplikasi Anda. Pertama, set `livewire.temporary_file_upload.disk` ke `s3` ( atau disk kustom lain yang menggunakan driver `s3` ):

```php
return [
    // ...
    'temporary_file_upload' => [
        'disk' => 's3',
        // ...
    ],
];
```

Sekarang, ketika pengguna mengunggah file, file tidak akan pernah benar-benar disimpan di server Anda. Sebaliknya, akan diunggah langsung ke bucket S3 Anda dalam sub-direktori `livewire-tmp/`.

> [!info] Mempublikasikan file konfigurasi Livewire
> Sebelum mengkustomisasi disk upload file, Anda harus terlebih dahulu mempublikasikan file konfigurasi Livewire ke direktori `/config` aplikasi Anda dengan menjalankan perintah berikut:
> ```shell
> php artisan livewire:publish --config
> ```

### Mengkonfigurasi pembersihan file otomatis

Direktori upload sementara Livewire akan cepat terisi dengan file; oleh karena itu, penting untuk mengkonfigurasi S3 untuk membersihkan file yang lebih dari 24 jam.

Untuk mengkonfigurasi perilaku ini, jalankan perintah Artisan berikut dari lingkungan yang menggunakan bucket S3 untuk upload file:

```shell
php artisan livewire:configure-s3-upload-cleanup
```

Sekarang, file sementara apa pun yang lebih dari 24 jam akan dibersihkan oleh S3 secara otomatis.

> [!info]
> Jika Anda tidak menggunakan S3 untuk penyimpanan file, Livewire akan menangani pembersihan file secara otomatis dan tidak perlu menjalankan perintah di atas.

## Indikator loading

Meskipun `wire:model` untuk upload file bekerja secara berbeda dari tipe input `wire:model` lainnya di bawah tenda, antarmuka untuk menunjukkan indikator loading tetap sama.

Anda dapat menampilkan indikator loading yang terbatas pada upload file seperti ini:

```blade
<input type="file" wire:model="photo">

<div wire:loading wire:target="photo">Uploading...</div>
```

Sekarang, saat file diunggah, pesan "Uploading..." akan ditampilkan dan kemudian disembunyikan ketika upload selesai.

Untuk informasi lebih lanjut tentang status loading, periksa dokumentasi [status loading](/docs/wire-loading) kami yang komprehensif.

## Indikator progress

Setiap operasi upload file Livewire mengirimkan event JavaScript pada elemen `<input>` yang sesuai, memungkinkan JavaScript kustom untuk mencegat event:

Event | Deskripsi
--- | ---
`livewire-upload-start` | Dikirim ketika upload dimulai
`livewire-upload-finish` | Dikirim jika upload berhasil diselesaikan
`livewire-upload-cancel` | Dikirim jika upload dibatalkan sebelum waktunya
`livewire-upload-error` | Dikirim jika upload gagal
`livewire-upload-progress` | Event yang berisi persentase progress upload saat upload berlangsung

Di bawah ini adalah contoh membungkus upload file Livewire dalam komponen Alpine untuk menampilkan progress bar upload:

```blade
<form wire:submit="save">
    <div
        x-data="{ uploading: false, progress: 0 }"
        x-on:livewire-upload-start="uploading = true"
        x-on:livewire-upload-finish="uploading = false"
        x-on:livewire-upload-cancel="uploading = false"
        x-on:livewire-upload-error="uploading = false"
        x-on:livewire-upload-progress="progress = $event.detail.progress"
    >
        <!-- File Input -->
        <input type="file" wire:model="photo">

        <!-- Progress Bar -->
        <div x-show="uploading">
            <progress max="100" x-bind:value="progress"></progress>
        </div>
    </div>

    <!-- ... -->
</form>
```

## Membatalkan upload

Jika upload memakan waktu lama, pengguna mungkin ingin membatalkannya. Anda dapat menyediakan fungsionalitas ini dengan fungsi `$cancelUpload()` JavaScript Livewire.

Berikut adalah contoh membuat tombol "Cancel Upload" dalam komponen Livewire menggunakan `wire:click` untuk menangani event klik:

```blade
<form wire:submit="save">
    <!-- File Input -->
    <input type="file" wire:model="photo">

    <!-- Cancel upload button -->
    <button type="button" wire:click="$cancelUpload('photo')">Cancel Upload</button>

    <!-- ... -->
</form>
```

Ketika "Cancel upload" ditekan, permintaan upload file akan dibatalkan dan input file akan dihapus. Pengguna sekarang dapat mencoba upload lain dengan file yang berbeda.

Sebagai alternatif, Anda dapat memanggil `cancelUpload(...)` dari Alpine seperti ini:

```blade
<button type="button" x-on:click="$wire.cancelUpload('photo')">Cancel Upload</button>
```

## API upload JavaScript

Mengintegrasikan dengan library upload file pihak ketiga seringkali memerlukan lebih banyak kontrol daripada elemen `<input type="file" wire:model="...">` sederhana.

Untuk skenario ini, Livewire mengekspos fungsi JavaScript khusus.

Fungsi-fungsi ini ada pada objek komponen JavaScript, yang dapat diakses menggunakan objek `$wire` yang nyaman dari Livewire dari dalam template komponen Livewire Anda:

```blade
@script
<script>
    let file = $wire.el.querySelector('input[type="file"]').files[0]

    // Upload a file...
    $wire.upload('photo', file, (uploadedFilename) => {
        // Success callback...
    }, () => {
        // Error callback...
    }, (event) => {
        // Progress callback...
        // event.detail.progress contains a number between 1 and 100 as the upload progresses
    }, () => {
        // Cancelled callback...
    })

    // Upload multiple files...
    $wire.uploadMultiple('photos', [file], successCallback, errorCallback, progressCallback, cancelledCallback)

    // Remove single file from multiple uploaded files...
    $wire.removeUpload('photos', uploadedFilename, successCallback)

    // Cancel an upload...
    $wire.cancelUpload('photos')
</script>
@endscript
```

## Konfigurasi

Karena Livewire menyimpan semua upload file sementara sebelum pengembang dapat memvalidasi atau menyimpannya, Livewire mengasumsikan beberapa perilaku penanganan default untuk semua upload file.

### Validasi global

Secara default, Livewire akan memvalidasi semua upload file sementara dengan aturan berikut: `file|max:12288` (Harus file kurang dari 12MB).

Jika Anda ingin mengkustomisasi aturan ini, Anda dapat melakukannya di dalam file `config/livewire.php` aplikasi Anda:

```php
'temporary_file_upload' => [
    // ...
    'rules' => 'file|mimes:png,jpg,pdf|max:102400', // (100MB max, and only accept PNGs, JPEGs, and PDFs)
],
```

### Middleware global

Endpoint upload file sementara ditetapkan middleware throttling secara default. Anda dapat mengkustomisasi middleware apa yang digunakan endpoint ini melalui opsi konfigurasi berikut:

```php
'temporary_file_upload' => [
    // ...
    'middleware' => 'throttle:5,1', // Only allow 5 uploads per user per minute
],
```

### Direktori upload sementara

File sementara diunggah ke direktori `livewire-tmp/` disk yang ditentukan. Anda dapat mengkustomisasi direktori ini melalui opsi konfigurasi berikut:

```php
'temporary_file_upload' => [
    // ...
    'directory' => 'tmp',
],
```