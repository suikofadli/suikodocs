---
sidebar_position: 30
---

# wire:loading

Loading indicators adalah bagian penting dari membuat antarmuka pengguna yang baik. Mereka memberikan umpan balik visual kepada pengguna ketika request sedang dibuat ke server, sehingga mereka tahu bahwa mereka sedang menunggu proses untuk selesai.

## Penggunaan dasar

Livewire menyediakan sintaks yang sederhana namun sangat kuat untuk mengontrol loading indicators: `wire:loading`. Menambahkan `wire:loading` ke elemen apa pun akan menyembunyikannya secara default (menggunakan `display: none` dalam CSS) dan menampilkannya ketika request dikirim ke server.

Berikut adalah contoh dasar form komponen `CreatePost` dengan `wire:loading` digunakan untuk beralih pesan loading:

```php
<form wire:submit="save">
    <!-- ... -->

    <button type="submit">Save</button>

    <div wire:loading> <!-- [tl! highlight:2] -->
        Saving post...
    </div>
</form>
```

Ketika pengguna menekan "Save", pesan "Saving post..." akan muncul di bawah tombol while action "save" sedang dieksekusi. Pesan akan menghilang ketika respons diterima dari server dan diproses oleh Livewire.

### Menghapus elemen

Sebagai alternatif, Anda dapat menambahkan `.remove` untuk efek sebaliknya, menampilkan elemen secara default dan menyembunyikannya selama request ke server:

```php
<div wire:loading.remove>...</div>
```

## Beralih class

Selain mengalihkan visibilitas seluruh elemen, seringkali berguna untuk mengubah styling elemen yang ada dengan mengalihkan class CSS on dan off selama request ke server. Teknik ini dapat digunakan untuk hal-hal seperti mengubah warna latar belakang, menurunkan opacity, memicu animasi spinning, dan lainnya.

Berikut adalah contoh sederhana menggunakan class [Tailwind](https://tailwindcss.com/) `opacity-50` untuk membuat tombol "Save" lebih pucat saat form sedang dikirimkan:

```php
<button wire:loading.class="opacity-50">Save</button>
```

Seperti mengalihkan elemen, Anda dapat melakukan operasi class sebaliknya dengan menambahkan `.remove` ke direktif `wire:loading`. Pada contoh di bawah, class `bg-blue-500` tombol akan dihapus ketika tombol "Save" ditekan:

```php
<button class="bg-blue-500" wire:loading.class.remove="bg-blue-500">
    Save
</button>
```

## Beralih atribut

Secara default, ketika form dikirim, Livewire akan secara otomatis menonaktifkan tombol submit dan menambahkan atribut `readonly` ke setiap elemen input saat form sedang diproses.

Namun, selain perilaku default ini, Livewire menawarkan modifier `.attr` untuk memungkinkan Anda beralih atribut lain pada elemen atau beralih atribut pada elemen yang di luar form:

```php
<button
    type="button"
    wire:click="remove"
    wire:loading.attr="disabled"
>
    Remove
</button>
```

Karena tombol di atas bukan tombol submit, tombol itu tidak akan dinonaktifkan oleh perilaku penanganan form default Livewire ketika ditekan. Sebagai gantinya, kami secara manual menambahkan `wire:loading.attr="disabled"` untuk mencapai perilaku ini.

## Menargetkan action spesifik

Secara default, `wire:loading` akan dipicu setiap kali komponen membuat request ke server.

Namun, dalam komponen dengan beberapa elemen yang dapat memicu request server, Anda harus mempersempit loading indicators Anda ke action individu.

Misalnya, pertimbangkan form "Save post" berikut. Selain tombol "Save" yang mengirimkan form, mungkin juga ada tombol "Remove" yang mengeksekusi action "remove" pada komponen.

Dengan menambahkan `wire:target` ke elemen `wire:loading` berikut, Anda dapat menginstruksikan Livewire untuk hanya menampilkan pesan loading ketika tombol "Remove" diklik:

```php
<form wire:submit="save">
    <!-- ... -->

    <button type="submit">Save</button>

    <button type="button" wire:click="remove">Remove</button>

    <div wire:loading wire:target="remove">  <!-- [tl! highlight:2] -->
        Removing post...
    </div>
</form>
```

Ketika tombol "Remove" di atas ditekan, pesan "Removing post..." akan ditampilkan kepada pengguna. Namun, pesan tidak akan ditampilkan ketika tombol "Save" ditekan.

### Menargetkan multiple action

Anda mungkin menemukan diri Anda dalam situasi di mana Anda ingin `wire:loading` merespons beberapa, tetapi tidak semua, action pada halaman. Dalam kasus ini Anda dapat memasukkan beberapa action ke `wire:target` dipisahkan oleh koma. Misalnya:

```php
<form wire:submit="save">
    <input type="text" wire:model.blur="title">

    <!-- ... -->

    <button type="submit">Save</button>

    <button type="button" wire:click="remove">Remove</button>

    <div wire:loading wire:target="save, remove">  <!-- [tl! highlight:2] -->
        Updating post...
    </div>
</form>
```

Loading indicator ("Updating post...") sekarang hanya akan ditampilkan ketika tombol "Remove" atau "Save" ditekan, dan tidak ketika field `$title` sedang dikirim ke server.

### Menargetkan parameter action

Dalam situasi di mana action yang sama dipicu dengan parameter yang berbeda dari beberapa tempat pada halaman, Anda dapat mempersempit `wire:target` ke action tertentu dengan memasukkan parameter tambahan. Misalnya, pertimbangkan skenario berikut di mana tombol "Remove" ada untuk setiap post pada halaman:

```php
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h2>{{ $post->title }}</h2>

            <button wire:click="remove({{ $post->id }})">Remove</button>

            <div wire:loading wire:target="remove({{ $post->id }})">  <!-- [tl! highlight:2] -->
                Removing post...
            </div>
        </div>
    @endforeach
</div>
```

Tanpa memasukkan `{{ $post->id }}` ke `wire:target="remove"`, pesan "Removing post..." akan muncul ketika tombol mana pun pada halaman diklik.

Namun, karena kami memasukkan parameter unik ke setiap instance `wire:target`, Livewire hanya akan menampilkan pesan loading ketika parameter yang cocok dilewatkan ke action "remove".

### Menargetkan update properti

Livewire juga memungkinkan Anda menargetkan update properti komponen spesifik dengan memasukkan nama properti ke direktif `wire:target`.

Pertimbangkan contoh berikut di mana input form bernama `username` menggunakan `wire:model.live` untuk validasi real-time saat pengguna mengetik:

```php
<form wire:submit="save">
    <input type="text" wire:model.live="username">
    @error('username') <span>{{ $message }}</span> @enderror

    <div wire:loading wire:target="username"> <!-- [tl! highlight:2] -->
        Checking availability of username...
    </div>

    <!-- ... -->
</form>
```

Pesan "Checking availability..." akan muncul ketika server diperbarui dengan username baru saat pengguna mengetik ke field input.

### Mengecualikan target loading spesifik

Terkadang Anda mungkin ingin menampilkan loading indicator untuk setiap request Livewire KECUALI properti atau action tertentu. Dalam kasus ini Anda dapat menggunakan modifier `wire:target.except` seperti ini:

```php
<div wire:loading wire:target.except="download">...</div>
```

Loading indicator di atas sekarang akan ditampilkan untuk setiap request update Livewire pada komponen KECUALI action "download".

## Menyesuaikan properti display CSS

Ketika `wire:loading` ditambahkan ke elemen, Livewire memperbarui properti CSS `display` elemen untuk menampilkan dan menyembunyikan elemen. Secara default, Livewire menggunakan `none` untuk menyembunyikan dan `inline-block` untuk menampilkan.

Jika Anda mengalihkan elemen yang menggunakan nilai display selain `inline-block`, seperti `flex` pada contoh berikut, Anda dapat menambahkan `.flex` ke `wire:loading`:

```php
<div class="flex" wire:loading.flex>...</div>
```

Di bawah ini adalah daftar lengkap nilai display yang tersedia:

```php
<div wire:loading.inline-flex>...</div>
<div wire:loading.inline>...</div>
<div wire:loading.block>...</div>
<div wire:loading.table>...</div>
<div wire:loading.flex>...</div>
<div wire:loading.grid>...</div>
```

## Menunda loading indicator

Pada koneksi cepat, update sering terjadi begitu cepat sehingga loading indicators hanya berkedip sebentar di layar sebelum dihapus. Dalam kasus ini, indicator lebih menjadi gangguan daripada bantuan yang berguna.

Untuk alasan ini, Livewire menyediakan modifier `.delay` untuk menunda penampilan indicator. Misalnya, jika Anda menambahkan `wire:loading.delay` ke elemen seperti ini:

```php
<div wire:loading.delay>...</div>
```

Elemen di atas hanya akan muncul jika request memakan waktu lebih dari 200 milidetik. Pengguna tidak akan pernah melihat indicator jika request selesai sebelum itu.

Untuk menyesuaikan jumlah waktu untuk menunda loading indicator, Anda dapat menggunakan salah satu alias interval berguna Livewire:

```php
<div wire:loading.delay.shortest>...</div> <!-- 50ms -->
<div wire:loading.delay.shorter>...</div>  <!-- 100ms -->
<div wire:loading.delay.short>...</div>    <!-- 150ms -->
<div wire:loading.delay>...</div>          <!-- 200ms -->
<div wire:loading.delay.long>...</div>     <!-- 300ms -->
<div wire:loading.delay.longer>...</div>   <!-- 500ms -->
<div wire:loading.delay.longest>...</div>  <!-- 1000ms -->
```