---
sidebar_position: 52
---

# Contribution Guide

Halo dan selamat datang di panduan kontribusi Livewire. Dalam panduan ini, kita akan melihat bagaimana Anda dapat berkontribusi pada Livewire dengan mengirimkan fitur baru, memperbaiki test yang gagal, atau menyelesaikan bug.

## Menyiapkan Livewire dan Alpine secara lokal

Untuk berkontribusi, cara termudah adalah memastikan bahwa repository Livewire dan Alpine telah diatur di mesin lokal Anda. Ini akan memungkinkan Anda melakukan perubahan dan menjalankan test suite dengan mudah.

### Forking dan cloning repository

Untuk memulai, langkah pertama adalah fork dan clone repository. Cara termudah untuk melakukannya adalah dengan menggunakan [GitHub CLI](https://cli.github.com/), tetapi Anda juga dapat melakukan langkah-langkah ini secara manual dengan mengklik tombol "Fork" pada [halaman repository](https://github.com/livewire/livewire) GitHub.

```shell
# Fork dan clone Livewire
gh repo fork livewire/livewire --default-branch-only --clone=true --remote=false -- livewire

# Beralih ke direktori kerja livewire
cd livewire

# Install semua dependensi composer
composer install

# Pastikan Dusk dikonfigurasi dengan benar
vendor/bin/dusk-updater detect --no-interaction
```

Untuk mengatur Alpine, pastikan Anda telah menginstal [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), lalu jalankan perintah berikut. Jika Anda lebih suka fork secara manual, Anda dapat mengunjungi [halaman repository](https://github.com/alpinejs/alpine).

```shell
# Fork dan clone Alpine
gh repo fork alpinejs/alpine --default-branch-only --clone=true --remote=false -- alpine

# Beralih ke direktori kerja alpine
cd alpine

# Install semua dependensi npm
npm install

# Build semua paket Alpine
npm run build

# Link semua paket Alpine secara lokal
cd packages/alpinejs && npm link && cd ../../
cd packages/anchor && npm link && cd ../../
cd packages/collapse && npm link && cd ../../
cd packages/csp && npm link && cd ../../
cd packages/docs && npm link && cd ../../
cd packages/focus && npm link && cd ../../
cd packages/history && npm link && cd ../../
cd packages/intersect && npm link && cd ../../
cd packages/mask && npm link && cd ../../
cd packages/morph && npm link && cd ../../
cd packages/navigate && npm link && cd ../../
cd packages/persist && npm link && cd ../../
cd packages/sort && npm link && cd ../../
cd packages/ui && npm link && cd ../../

# Beralih kembali ke direktori kerja livewire
cd ../livewire

# Link semua paket
npm link alpinejs @alpinejs/anchor @alpinejs/collapse @alpinejs/csp @alpinejs/docs @alpinejs/focus @alpinejs/history @alpinejs/intersect @alpinejs/mask @alpinejs/morph @alpinejs/navigate @alpinejs/persist @alpinejs/sort @alpinejs/ui

# Build Livewire
npm run build
```

## Berkontribusi pada Test yang Gagal

Jika Anda menemukan bug dan tidak yakin bagaimana menyelesaikannya, terutama mengingat kompleksitas inti Livewire, Anda mungkin bertanya-tanya harus mulai dari mana. Dalam kasus seperti ini, pendekatan termudah adalah berkontribusi dengan test yang gagal. Dengan cara ini, seseorang yang lebih berpengalaman dapat membantu mengidentifikasi dan memperbaiki bug. Namun demikian, kami merekomendasikan agar Anda juga menjelajahi inti untuk pemahaman yang lebih baik tentang cara kerja Livewire.

Mari kita ambil pendekatan langkah demi langkah.

#### 1. Tentukan di mana menambahkan test Anda

Inti Livewire dibagi menjadi folder yang berbeda, masing-masing sesuai dengan fitur Livewire tertentu. Sebagai contoh:

```shell
src/Features/SupportAccessingParent
src/Features/SupportAttributes
src/Features/SupportAutoInjectedAssets
src/Features/SupportBladeAttributes
src/Features/SupportChecksumErrorDebugging
src/Features/SupportComputed
src/Features/SupportConsoleCommands
src/Features/SupportDataBinding
//...
```

Coba temukan fitur yang terkait dengan bug yang Anda alami. Jika Anda tidak dapat menemukan folder yang sesuai atau jika Anda tidak yakin mana yang harus dipilih, Anda dapat memilih salah satu dan menyebutkan dalam pull request Anda bahwa Anda membutuhkan bantuan untuk menempatkan test dalam set fitur yang benar.

#### 2. Tentukan jenis test

Test suite Livewire terdiri dari dua jenis test:

1. **Unit tests**: Test ini berfokus pada implementasi PHP dari Livewire.
2. **Browser tests**: Test ini menjalankan serangkaian langkah di dalam browser nyata dan menyatakan hasil yang benar. Mereka terutama berfokus pada implementasi JavaScript dari Livewire.

Jika Anda tidak yakin jenis test mana yang harus dipilih atau jika Anda tidak terbiasa menulis test untuk Livewire, Anda dapat memulai dengan browser test. Implementasikan langkah-langkah yang Anda lakukan dalam aplikasi dan browser untuk mereproduksi bug.

Unit tests harus ditambahkan ke file `UnitTest.php`, dan browser tests harus ditambahkan ke `BrowserTest.php`. Jika satu atau kedua file ini tidak ada, Anda dapat membuatnya sendiri.

**Unit test**

```php
use Tests\TestCase;

class UnitTest extends TestCase
{
    public function test_livewire_can_run_action(): void
    {
       // ...
    }
}
```

**Browser test**

```php
use Tests\BrowserTestCase;

class BrowserTest extends BrowserTestCase
{
    public function test_livewire_can_run_action()
    {
        // ...
    }
}
```

> [!tip] Tidak yakin bagaimana menulis test?
> Anda dapat belajar banyak dengan menjelajahi test Unit dan Browser yang ada untuk mempelajari cara penulisan test. Bahkan menyalin dan menempel test yang ada adalah titik awal yang bagus untuk menulis test Anda sendiri.

#### 3. Menyiapkan branch pull request Anda

Setelah Anda menyelesaikan fitur atau test yang gagal, saatnya mengirimkan Pull Request (PR) Anda ke repository Livewire. Pertama, pastikan bahwa Anda mengkomit perubahan Anda ke branch terpisah (hindari menggunakan `main`). Untuk membuat branch baru, Anda dapat menggunakan perintah `git`:

```shell
git checkout -b my-feature
```

Anda dapat memberi nama branch Anda apa saja, tetapi untuk referensi masa depan, membantu menggunakan nama deskriptif yang mencerminkan fitur atau test yang gagal Anda.

Selanjutnya, komit perubahan Anda ke branch Anda. Anda dapat menggunakan `git add .` untuk menyiapkan semua perubahan dan kemudian `git commit -m "Add my feature"` untuk mengkomit semua perubahan dengan pesan komit yang deskriptif.

Namun, branch Anda saat ini hanya tersedia di mesin lokal Anda. Untuk membuat Pull Request, Anda perlu mendorong branch Anda ke repository Livewire yang telah Anda fork menggunakan `git push`.

```shell
git push origin my-feature

Enumerating objects: 13, done.
Counting objects: 100% (13/13), done.
Delta compression using up to 8 threads
Compressing objects: 100% (6/6), done.

To github.com:Username/livewire.git
 * [new branch]        my-feature -> my-feature
```

#### 4. Mengirimkan pull request Anda

Kami hampir selesai! Buka browser web Anda dan navigasikan ke repository Livewire yang telah Anda fork (`https://github.com/<your-username>/livewire`). Di tengah layar Anda, Anda akan melihat notifikasi baru: "**my-feature had recent pushes 1 minute ago**" bersama dengan tombol yang mengatakan "**Compare & pull request**." Klik tombol untuk membuka formulir pull request.

Dalam formulir, berikan judul yang menjelaskan pull request Anda dan kemudian lanjutkan ke bagian deskripsi. Area teks sudah berisi template yang telah ditentukan sebelumnya. Coba jawab setiap pertanyaan:

```
Review the contribution guide first at: https://livewire.laravel.com/docs/contribution-guide

1️⃣ Is this something that is wanted/needed? Did you create a discussion about it first?
Yes, you can find the discussion here: https://github.com/livewire/livewire/discussions/999999

2️⃣ Did you create a branch for your fix/feature? (Main branch PR's will be closed)
Yes, the branch is named `my-feature`

3️⃣ Does it contain multiple, unrelated changes? Please separate the PRs out.
No, the changes are only related to my feature.

4️⃣ Does it include tests? (Required)
Yes

5️⃣ Please include a thorough description (including small code snippets if possible) of the improvement and reasons why it's useful.

These changes will improve memory usage. You can see the benchmark results here:

// ...

```

Semua selesai? Klik pada **Create pull request** 🚀 Selamat! Anda telah berhasil membuat kontribusi pertama Anda 🎉

Para maintainer akan meninjau PR Anda dan mungkin memberikan umpan balik atau meminta perubahan. Silakan berusaha untuk mengatasi umpan balik apa pun sesegera mungkin.

Terima kasih telah berkontribusi pada Livewire!