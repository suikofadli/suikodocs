---
sidebar_position: 14
---

# Lazy

Livewire memungkinkan Anda untuk *lazy load* komponen yang sebaliknya akan memperlambat *loading halaman awal*.

Misalnya, bayangkan Anda memiliki komponen `Revenue` yang berisi *query database* yang lambat di `mount()`:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount()
    {
        // Slow database query...
        $this->amount = Transaction::monthToDate()->sum('amount');
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

```blade
<div>
    Revenue this month: {{ $amount }}
</div>
```

Tanpa *lazy loading*, komponen ini akan menunda *loading* seluruh *halaman* dan membuat seluruh *aplikasi* Anda terasa lambat.

Untuk mengaktifkan *lazy loading*, Anda dapat meneruskan parameter `lazy` ke dalam *komponen*:

```blade
<livewire:revenue lazy />
```

Sekarang, alih-alih memuat *komponen* segera, Livewire akan melewati *komponen* ini, memuat *halaman* tanpanya. Kemudian, ketika *komponen* terlihat di *viewport*, Livewire akan membuat *permintaan jaringan* untuk memuat *komponen* ini sepenuhnya di *halaman*.

> [!info] *Lazy requests* diisolasi secara default
> Tidak seperti *permintaan jaringan* lainnya di Livewire, *update lazy loading* diisolasi satu sama lain saat dikirim ke *server*. Ini menjaga *lazy loading* tetap cepat, dengan memuat setiap *komponen* secara *paralel* saat *halaman* dimuat. [Baca selengkapnya tentang menonaktifkan perilaku ini di sini →](#disabling-request-isolation)

## Rendering *placeholder HTML*

Secara *default*, Livewire akan menyisipkan `<div></div>` kosong untuk *komponen* Anda sebelum sepenuhnya dimuat. Karena *komponen* awalnya tidak akan terlihat oleh *user*, ini bisa mengejutkan ketika *komponen* tiba-tiba muncul di *halaman*.

Untuk memberi sinyal kepada *user* Anda bahwa *komponen* sedang dimuat, Anda dapat mendefinisikan metode `placeholder()` untuk merender *HTML placeholder* apa pun yang Anda suka, termasuk *loading spinners* dan *skeleton placeholders*:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount()
    {
        // Slow database query...
        $this->amount = Transaction::monthToDate()->sum('amount');
    }

    public function placeholder()
    {
        return <<<'HTML'
        <div>
            <!-- Loading spinner... -->
            <svg>...</svg>
        </div>
        HTML;
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

Karena *komponen* di atas menentukan "*placeholder*" dengan mengembalikan *HTML* dari metode `placeholder()`, *user* akan melihat *SVG loading spinner* di *halaman* sampai *komponen* sepenuhnya dimuat.

> [!warning] *Placeholder* dan *komponen* harus memiliki *tipe elemen* yang sama
> Misalnya, jika *tipe elemen root placeholder* Anda adalah 'div,' *komponen* Anda juga harus menggunakan *elemen* 'div'.

### Rendering *placeholder* melalui *view*

Untuk *loader* yang lebih kompleks (seperti *skeleton*), Anda dapat mengembalikan `view` dari `placeholder()` mirip dengan `render()`.

```php
public function placeholder(array $params = [])
{
    return view('livewire.placeholders.skeleton', $params);
}
```

Parameter apa pun dari *komponen* yang di-*load* secara lambat akan tersedia sebagai argumen `$params` yang diteruskan ke metode `placeholder()`.

## *Lazy loading* di luar *viewport*

Secara *default*, *komponen* yang di-*load* secara lambat tidak dimuat sepenuhnya hingga mereka memasuki *viewport browser*, misalnya ketika *user* menggulir ke salah satunya.

Jika Anda lebih suka me-*load* semua *komponen* di *halaman* secara lambat segera setelah *halaman* dimuat, tanpa menunggu mereka memasuki *viewport*, Anda dapat melakukannya dengan meneruskan "on-load" ke parameter `lazy`:

```blade
<livewire:revenue lazy="on-load" />
```

Sekarang *komponen* ini akan dimuat setelah *halaman* siap tanpa menunggu berada di dalam *viewport*.

## Melewatkan *props*

Secara umum, Anda dapat memperlakukan *komponen* `lazy` sama seperti *komponen normal*, karena Anda masih dapat meneruskan *data* ke dalamnya dari luar.

Misalnya, ini adalah *skenario* di mana Anda mungkin meneruskan *interval waktu* ke *komponen* `Revenue` dari *komponen induk*:

```blade
<input type="date" wire:model="start">
<input type="date" wire:model="end">

<livewire:revenue lazy :$start :$end />
```

Anda dapat menerima *data* ini di `mount()` seperti *komponen* lainnya:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount($start, $end)
    {
        // Expensive database query...
        $this->amount = Transactions::between($start, $end)->sum('amount');
    }

    public function placeholder()
    {
        return <<<'HTML'
        <div>
            <!-- Loading spinner... -->
            <svg>...</svg>
        </div>
        HTML;
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

Namun, tidak seperti *loading komponen normal*, *komponen* `lazy` harus *serialize* atau "*dehydrate*" *properti* yang diteruskan dan menyimpannya sementara di *client-side* hingga *komponen* sepenuhnya dimuat.

Misalnya, Anda mungkin ingin meneruskan *model Eloquent* ke *komponen* `Revenue` seperti ini:

```blade
<livewire:revenue lazy :$user />
```

Dalam *komponen normal*, *PHP in-memory* `$user` *model* yang sebenarnya akan diteruskan ke metode `mount()` dari `Revenue`. Namun, karena kita tidak akan menjalankan `mount()` sampai *permintaan jaringan* berikutnya, Livewire akan secara internal *serialize* `$user` ke *JSON* dan kemudian meng-*query ulang* dari *database* sebelum *permintaan* berikutnya ditangani.

Biasanya, *serialisasi* ini tidak boleh menyebabkan perbedaan *perilaku* apa pun dalam *aplikasi* Anda.

## *Lazy load* secara *default*

Jika Anda ingin menegakkan bahwa semua *penggunaan komponen* akan di-*load* secara lambat, Anda dapat menambahkan *atribut* `#[Lazy]` di atas *kelas komponen*:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Lazy;

#[Lazy]
class Revenue extends Component
{
    // ...
}
```

Jika Anda ingin mengesampingkan *lazy loading*, Anda dapat mengatur parameter `lazy` ke `false`:

```blade
<livewire:revenue :lazy="false" />
```

### Menonaktifkan *request isolation*

Jika ada beberapa *komponen* yang di-*load* secara lambat di *halaman*, setiap *komponen* akan membuat *permintaan jaringan independen*, alih-alih setiap *update lazy* dibundel dalam *permintaan tunggal*.

Jika Anda ingin menonaktifkan *perilaku isolasi* ini dan sebaliknya membundel semua *update* bersama dalam *permintaan jaringan tunggal*, Anda dapat melakukannya dengan parameter `isolate: false`:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Lazy;

#[Lazy(isolate: false)] // [tl! highlight]
class Revenue extends Component
{
    // ...
}
```

Sekarang, jika ada sepuluh *komponen* `Revenue` di *halaman* yang sama, ketika *halaman* dimuat, semua sepuluh *update* akan dibundel dan dikirim ke *server* sebagai *permintaan jaringan tunggal*.

## *Lazy loading halaman penuh*

Anda mungkin ingin me-*load* *komponen Livewire halaman penuh* secara lambat. Anda dapat melakukan ini dengan memanggil `->lazy()` pada *route* seperti ini:

```php
Route::get('/dashboard', \App\Livewire\Dashboard::class)->lazy();
```

Atau alternatifnya, jika ada *komponen* yang di-*load* secara lambat secara *default*, dan Anda ingin keluar dari *lazy-loading*, Anda dapat menggunakan parameter `enabled: false` berikut:

```php
Route::get('/dashboard', \App\Livewire\Dashboard::class)->lazy(enabled: false);
```

## *View placeholder default*

Jika Anda ingin mengatur *view placeholder default* untuk semua *komponen* Anda, Anda dapat melakukannya dengan mereferensikan *view* di *file config* `/config/livewire.php`:

```php
'lazy_placeholder' => 'livewire.placeholder',
```

Sekarang, ketika *komponen* di-*load* secara lambat dan tidak ada `placeholder()` yang didefinisikan, Livewire akan menggunakan *Blade view* yang dikonfigurasi (`livewire.placeholder` dalam hal ini.)

## Menonaktifkan *lazy loading* untuk *tes*

Saat menguji *unit* *komponen lazy*, atau *halaman* dengan *komponen lazy bersarang*, Anda mungkin ingin menonaktifkan *perilaku "lazy"* sehingga Anda dapat meng-*assert* *perilaku rendered akhir*. Jika tidak, *komponen* tersebut akan dirender sebagai *placeholder* selama *tes* Anda.

Anda dapat dengan mudah menonaktifkan *lazy loading* menggunakan *helper testing* `Livewire::withoutLazyLoading()` seperti ini:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\Dashboard;
use Livewire\Livewire;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    public function test_renders_successfully()
    {
        Livewire::withoutLazyLoading() // [tl! highlight]
            ->test(Dashboard::class)
            ->assertSee(...);
    }
}
```

Sekarang, ketika *komponen dashboard* dirender untuk *tes* ini, itu akan melewati rendering `placeholder()` dan sebaliknya merender *komponen penuh* seolah-olah *lazy loading* tidak diterapkan sama sekali.