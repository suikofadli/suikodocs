---
sidebar_position: 51
---

# Synthesizers

Karena komponen Livewire di-dehydrate (diserialisasi) menjadi JSON, kemudian di-hydrate (dideserialisasi) kembali menjadi komponen PHP di antara request, properti mereka perlu dapat diserialisasi JSON.

Secara native, PHP dengan mudah menserialisasi sebagian besar nilai primitif menjadi JSON. Namun, agar komponen Livewire dapat mendukung tipe properti yang lebih canggih (seperti model, collection, instance carbon, dan stringable), diperlukan sistem yang lebih kuat.

Oleh karena itu, Livewire menyediakan titik ekstensi yang disebut "Synthesizers" yang memungkinkan pengguna untuk mendukung tipe properti kustom apa pun yang mereka inginkan.

> [!tip] Pastikan Anda memahami hidrasi terlebih dahulu
> Sebelum menggunakan Synthesizers, akan sangat membantu jika Anda memahami sepenuhnya sistem hidrasi Livewire. Anda dapat mempelajari lebih lanjut dengan membaca [dokumentasi hidrasi](/docs/hydration).

## Memahami Synthesizers

Sebelum mengeksplorasi pembuatan Synthesizers kustom, mari kita pertama lihat Synthesizer internal yang digunakan Livewire untuk mendukung [Laravel Stringables](https://laravel.com/docs/strings).

Misalkan aplikasi Anda mengandung komponen `CreatePost` berikut:

```php
class CreatePost extends Component
{
    public $title = '';
}
```

Di antara request, Livewire mungkin menserialisasi status komponen ini menjadi objek JSON seperti berikut:

```js
state: { title: '' },
```

Sekarang, pertimbangkan contoh yang lebih canggih di mana nilai properti `$title` adalah stringable instead of plain string:

```php
class CreatePost extends Component
{
    public $title = '';

    public function mount()
    {
        $this->title = str($this->title);
    }
}
```

JSON yang di-dehydrate yang mewakili status komponen ini sekarang mengandung [metadata tuple](/docs/hydration#deeply-nested-tuples) instead of plain empty string:

```js
state: { title: ['', { s: 'str' }] },
```

Livewire sekarang dapat menggunakan tuple ini untuk menghidrasi properti `$title` kembali menjadi stringable pada request berikutnya.

Sekarang setelah Anda melihat efek dari luar ke dalam dari Synthesizers, berikut adalah kode sumber aktual untuk synth stringable internal Livewire:

```php
use Illuminate\Support\Stringable;

class StringableSynth extends Synth
{
    public static $key = 'str';

    public static function match($target)
    {
        return $target instanceof Stringable;
    }

    public function dehydrate($target)
    {
        return [$target->__toString(), []];
    }

    public function hydrate($value)
    {
        return str($value);
    }
}
```

Mari kita uraikan ini bagian per bagian.

Pertama adalah properti `$key`:

```php
public static $key = 'str';
```

Setiap synth harus mengandung properti statis `$key` yang digunakan Livewire untuk mengkonversi [metadata tuple](/docs/hydration#deeply-nested-tuples) seperti `['', { s: 'str' }]` kembali menjadi stringable. Seperti yang mungkin Anda perhatikan, setiap metadata tuple memiliki kunci `s` yang mereferensikan kunci ini.

Sebaliknya, ketika Livewire mendehidrasi properti, ia akan menggunakan fungsi statis `match()` dari synth untuk mengidentifikasi apakah Synthesizer tertentu ini adalah kandidat yang baik untuk mendehidrasi properti saat ini (`$target` adalah nilai saat ini dari properti):

```php
public static function match($target)
{
    return $target instanceof Stringable;
}
```

Jika `match()` mengembalikan true, metode `dehydrate()` akan digunakan untuk mengambil nilai PHP properti sebagai input dan mengembalikan tuple [metadata](/docs/hydration#deeply-nested-tuples) yang dapat di-JSON:

```php
public function dehydrate($target)
{
    return [$target->__toString(), []];
}
```

Sekarang, di awal request berikutnya, setelah Synthesizer ini dicocokkan oleh kunci `{ s: 'str' }` dalam tuple, metode `hydrate()` akan dipanggil dan diberikan representasi JSON mentah dari properti dengan ekspektasi bahwa ia mengembalikan nilai yang sepenuhnya kompatibel dengan PHP untuk ditetapkan ke properti.

```php
public function hydrate($value)
{
    return str($value);
}
```

## Mendaftarkan Synthesizer kustom

Untuk mendemonstrasikan bagaimana Anda dapat membuat Synthesizer Anda sendiri untuk mendukung properti kustom, kita akan menggunakan komponen `UpdateProperty` berikut sebagai contoh:

```php
class UpdateProperty extends Component
{
    public Address $address;

    public function mount()
    {
        $this->address = new Address();
    }
}
```

Berikut adalah sumber untuk kelas `Address`:

```php
namespace App\Dtos\Address;

class Address
{
    public $street = '';
    public $city = '';
    public $state = '';
    public $zip = '';
}
```

Untuk mendukung properti bertipe `Address`, kita dapat menggunakan Synthesizer berikut:

```php
use App\Dtos\Address;

class AddressSynth extends Synth
{
    public static $key = 'address';

    public static function match($target)
    {
        return $target instanceof Address;
    }

    public function dehydrate($target)
    {
        return [[
            'street' => $target->street,
            'city' => $target->city,
            'state' => $target->state,
            'zip' => $target->zip,
        ], []];
    }

    public function hydrate($value)
    {
        $instance = new Address;

        $instance->street = $value['street'];
        $instance->city = $value['city'];
        $instance->state = $value['state'];
        $instance->zip = $value['zip'];

        return $instance;
    }
}
```

Untuk membuatnya tersedia secara global di aplikasi Anda, Anda dapat menggunakan metode `propertySynthesizer` Livewire untuk mendaftarkan synthesizer dari metode boot service provider Anda:

```php
class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Livewire::propertySynthesizer(AddressSynth::class);
    }
}
```

## Mendukung data binding

Menggunakan contoh `UpdateProperty` dari atas, kemungkinan besar Anda ingin mendukung binding `wire:model` langsung ke properti dari objek `Address`. Synthesizers memungkinkan Anda untuk mendukung ini menggunakan metode `get()` dan `set()`:

```php
use App\Dtos\Address;

class AddressSynth extends Synth
{
    public static $key = 'address';

    public static function match($target)
    {
        return $target instanceof Address;
    }

    public function dehydrate($target)
    {
        return [[
            'street' => $target->street,
            'city' => $target->city,
            'state' => $target->state,
            'zip' => $target->zip,
        ], []];
    }

    public function hydrate($value)
    {
        $instance = new Address;

        $instance->street = $value['street'];
        $instance->city = $value['city'];
        $instance->state = $value['state'];
        $instance->zip = $value['zip'];

        return $instance;
    }

    public function get(&$target, $key) // [tl! highlight:8]
    {
        return $target->{$key};
    }

    public function set(&$target, $key, $value)
    {
        $target->{$key} = $value;
    }
}
```