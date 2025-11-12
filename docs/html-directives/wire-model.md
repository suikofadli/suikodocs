---
sidebar_position: 29
---

# wire:model

Livewire memudahkan untuk mengikat nilai properti komponen dengan input form menggunakan `wire:model`.

Berikut adalah contoh sederhana menggunakan `wire:model` untuk mengikat properti `$title` dan `$content` dengan input form dalam komponen "Create Post":

```php
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title = '';

    public $content = '';

    public function save()
    {
		$post = Post::create([
			'title' => $this->title,
			'content' => $this->content
		]);

        // ...
    }
}
```

```php
<form wire:submit="save">
    <label>
        <span>Title</span>

        <input type="text" wire:model="title"> <!-- [tl! highlight] -->
    </label>

    <label>
        <span>Content</span>

        <textarea wire:model="content"></textarea> <!-- [tl! highlight] -->
    </label>

	<button type="submit">Save</button>
</form>
```

Karena kedua input menggunakan `wire:model`, nilai mereka akan disinkronkan dengan properti server ketika tombol "Save" ditekan.

> [!warning] "Mengapa komponen saya tidak diperbarui secara live saat saya mengetik?"
> Jika Anda mencoba ini di browser dan bingung mengapa judul tidak diperbarui secara otomatis, ini karena Livewire hanya memperbarui komponen ketika "action" dikirimkan—seperti menekan tombol submit—bukan ketika pengguna mengetik di field. Ini mengurangi request jaringan dan meningkatkan performa. Untuk mengaktifkan pembaruan "live" saat pengguna mengetik, Anda dapat menggunakan `wire:model.live` sebagai gantinya. [Pelajari lebih lanjut tentang data binding](/docs/properties#data-binding).

## Menyesuaikan waktu update

Secara default, Livewire hanya akan mengirim request jaringan ketika action dilakukan (seperti `wire:click` atau `wire:submit`), BUKAN ketika input `wire:model` diperbarui.

Ini secara drastis meningkatkan performa Livewire dengan mengurangi request jaringan dan memberikan pengalaman yang lebih halus untuk pengguna Anda.

Namun, ada kalanya di mana Anda ingin memperbarui server lebih sering untuk hal-hal seperti validasi real-time.

### Live updating

Untuk mengirim pembaruan properti ke server saat pengguna mengetik di input-field, Anda dapat menambahkan modifier `.live` ke `wire:model`:

```html
<input type="text" wire:model.live="title">
```

#### Menyesuaikan debounce

Secara default, saat menggunakan `wire:model.live`, Livewire menambahkan debounce 150 milidetik ke update server. Ini berarti jika pengguna terus mengetik, Livewire akan menunggu sampai pengguna berhenti mengetik selama 150 milidetik sebelum mengirim request.

Anda dapat menyesuaikan timing ini dengan menambahkan `.debounce.Xms` ke input. Berikut adalah contoh mengubah debounce menjadi 250 milidetik:

```html
<input type="text" wire:model.live.debounce.250ms="title">
```

### Update pada event "blur"

Dengan menambahkan modifier `.blur`, Livewire hanya akan mengirim request jaringan dengan pembaruan properti ketika pengguna mengklik di luar input, atau menekan tombol tab untuk berpindah ke input berikutnya.

Menambahkan `.blur` berguna untuk skenario di mana Anda ingin memperbarui server lebih sering, tetapi tidak saat pengguna mengetik. Misalnya, validasi real-time adalah kasus umum di mana `.blur` membantu.

```html
<input type="text" wire:model.blur="title">
```

### Update pada event "change"

Ada kalanya perilaku `.blur` tidak persis seperti yang Anda inginkan dan sebagai gantinya `.change`.

Misalnya, jika Anda ingin menjalankan validasi setiap kali input select diubah, dengan menambahkan `.change`, Livewire akan mengirim request jaringan dan memvalidasi properti segera setelah pengguna memilih opsi baru. Berbeda dengan `.blur` yang hanya akan memperbarui server setelah pengguna menab menjauh dari input select.

```html
<select wire:model.change="title">
    <!-- ... -->
</select>
```

Setiap perubahan yang dibuat pada input teks akan secara otomatis disinkronkan dengan properti `$title` dalam komponen Livewire Anda.

## Semua modifier yang tersedia

 Modifier          | Deskripsi
-------------------|-------------------------------------------------------------------------
 `.live`           | Kirim update saat pengguna mengetik
 `.blur`           | Hanya kirim update pada event `blur`
 `.change`         | Hanya kirim update pada event `change`
 `.lazy`           | Alias untuk `.change`
 `.debounce.[?]ms` | Debounce pengiriman update dengan delay milidetik yang ditentukan
 `.throttle.[?]ms` | Throttle update request jaringan dengan interval milidetik yang ditentukan
 `.number`         | Konversi nilai teks input ke `int` di server
 `.boolean`        | Konversi nilai teks input ke `bool` di server
 `.fill`           | Gunakan nilai awal yang disediakan oleh atribut HTML "value" saat halaman dimuat

## Field input

Livewire mendukung sebagian besar elemen input native langsung. Artinya Anda seharusnya dapat menempelkan `wire:model` ke elemen input apa pun di browser dan dengan mudah mengikat properti ke mereka.

Berikut adalah daftar lengkap dari berbagai tipe input yang tersedia dan cara Anda menggunakannya dalam konteks Livewire.

### Input teks

Paling utama, input teks adalah fondasi sebagian besar form. Beginilah cara mengikat properti bernama "title" ke salah satunya:

```php
<input type="text" wire:model="title">
```

### Input textarea

Elemen textarea juga serupa. Cukup tambahkan `wire:model` ke textarea dan nilainya akan terikat:

```php
<textarea type="text" wire:model="content"></textarea>
```

Jika nilai "content" diinisialisasi dengan string, Livewire akan mengisi textarea dengan nilai itu - tidak perlu melakukan hal seperti berikut:

```php
<!-- Peringatan: Snippet ini mendemonstrasikan apa yang TIDAK boleh dilakukan... -->

<textarea type="text" wire:model="content">{{ $content }}</textarea>
```

### Checkboxes

Checkboxes dapat digunakan untuk nilai tunggal, seperti saat mengalihkan properti boolean. Atau, checkboxes dapat digunakan untuk mengalihkan satu nilai dalam grup nilai terkait. Kami akan membahas kedua skenario:

#### Checkbox tunggal

Di akhir form signup, Anda mungkin memiliki checkbox yang memungkinkan pengguna untuk opt-in ke update email. Anda mungkin menyebut properti ini `$receiveUpdates`. Anda dapat dengan mudah mengikat nilai ini ke checkbox menggunakan `wire:model`:

```php
<input type="checkbox" wire:model="receiveUpdates">
```

Sekarang ketika nilai `$receiveUpdates` adalah `false`, checkbox akan tidak dicentang. Tentu saja, ketika nilainya `true`, checkbox akan dicentang.

#### Checkboxes ganda

Sekarang, katakanlah selain memungkinkan pengguna memutuskan untuk menerima update, Anda memiliki properti array di kelas Anda yang disebut `$updateTypes`, memungkinkan pengguna memilih dari berbagai tipe update:

```php
public $updateTypes = [];
```

Dengan mengikat multiple checkboxes ke properti `$updateTypes`, pengguna dapat memilih beberapa tipe update dan mereka akan ditambahkan ke properti array `$updateTypes`:

```php
<input type="checkbox" value="email" wire:model="updateTypes">
<input type="checkbox" value="sms" wire:model="updateTypes">
<input type="checkbox" value="notification" wire:model="updateTypes">
```

Misalnya, jika pengguna mencentang dua kotak pertama tetapi bukan yang ketiga, nilai `$updateTypes` akan menjadi: `["email", "sms"]`

### Radio buttons

Untuk beralih antara dua nilai berbeda untuk satu properti, Anda dapat menggunakan radio buttons:

```php
<input type="radio" value="yes" wire:model="receiveUpdates">
<input type="radio" value="no" wire:model="receiveUpdates">
```

### Select dropdowns

Livewire memudahkan untuk bekerja dengan dropdown `<select>`. Saat menambahkan `wire:model` ke dropdown, nilai yang saat ini dipilih akan terikat ke nama properti yang disediakan dan sebaliknya.

Selain itu, tidak perlu menambahkan `selected` secara manual ke opsi yang akan dipilih - Livewire menangani itu untuk Anda secara otomatis.

Di bawah ini adalah contoh dropdown select yang diisi dengan daftar statis negara bagian:

```php
<select wire:model="state">
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    ...
</select>
```

Ketika negara bagian tertentu dipilih, misalnya, "Alaska", properti `$state` pada komponen akan diatur ke `AK`. Jika Anda lebih suka nilai diatur ke "Alaska" daripada "AK", Anda dapat membiarkan atribut `value=""` dari elemen `<option>` sama sekali.

Seringkali, Anda mungkin membangun opsi dropdown Anda secara dinamis menggunakan Blade:

```php
<select wire:model="state">
    @foreach (\App\Models\State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>
```

Jika Anda tidak memiliki opsi tertentu yang dipilih secara default, Anda mungkin ingin menampilkan opsi placeholder yang dibisukan secara default, seperti "Select a state":

```php
<select wire:model="state">
    <option disabled value="">Select a state...</option>

    @foreach (\App\Models\State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>
```

Seperti yang Anda lihat, tidak ada atribut "placeholder" untuk menu select seperti ada untuk input teks. Sebagai gantinya, Anda harus menambahkan elemen opsi `disabled` sebagai opsi pertama dalam daftar.

### Dropdown select dependen

Terkadang Anda mungkin ingin satu menu select bergantung pada yang lain. Misalnya, daftar kota yang berubah berdasarkan negara bagian yang dipilih.

Sebagian besar, ini berfungsi seperti yang Anda harapkan, namun ada satu gotcha penting: Anda harus menambahkan `wire:key` ke select yang berubah sehingga Livewire menyegarkan nilainya dengan benar ketika opsi berubah.

Berikut adalah contoh dua select, satu untuk negara bagian, satu untuk kota. Ketika select negara bagian berubah, opsi dalam select kota akan berubah dengan benar:

```php
<!-- States select menu... -->
<select wire:model.live="selectedState">
    @foreach (State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>

<!-- Cities dependent select menu... -->
<select wire:model.live="selectedCity" wire:key="{{ $selectedState }}"> <!-- [tl! highlight] -->
    @foreach (City::whereStateId($selectedState->id)->get() as $city)
        <option value="{{ $city->id }}">{{ $city->label }}</option>
    @endforeach
</select>
```

Sekali lagi, satu-satunya hal yang tidak standar di sini adalah `wire:key` yang telah ditambahkan ke select kedua. Ini memastikan bahwa ketika negara bagian berubah, nilai "selectedCity" akan diatur ulang dengan benar.

### Dropdown multi-select

Jika Anda menggunakan menu select "multiple", Livewire berfungsi seperti yang diharapkan. Dalam contoh ini, negara bagian akan ditambahkan ke properti array `$states` ketika mereka dipilih dan dihapus jika mereka tidak dipilih:

```php
<select wire:model="states" multiple>
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    ...
</select>
```

## Lebih dalam

Untuk dokumentasi lebih lengkap tentang penggunaan `wire:model` dalam konteks form HTML, kunjungi [halaman dokumentasi form Livewire](/docs/forms).