---
sidebar_position: 8
---

# Events

Livewire menawarkan sistem event yang kuat yang dapat Anda gunakan untuk berkomunikasi antara komponen yang berbeda di halaman. Karena menggunakan browser events di balik layar, Anda juga dapat menggunakan sistem event Livewire untuk berkomunikasi dengan komponen Alpine atau bahkan JavaScript vanilla biasa.

Untuk memicu event, Anda dapat menggunakan metode `dispatch()` dari mana saja di dalam komponen Anda dan mendengarkan event tersebut dari komponen lain apa pun di halaman.

## Mengirimkan events

Untuk mengirimkan event dari komponen Livewire, Anda dapat memanggil metode `dispatch()`, meneruskannya nama event dan data tambahan apa pun yang ingin Anda kirim bersama event.

Di bawah ini adalah contoh mengirimkan event `post-created` dari komponen `CreatePost`:

```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created'); // [tl! highlight]
    }
}
```

Pada contoh ini, ketika metode `dispatch()` dipanggil, event `post-created` akan dikirimkan, dan setiap komponen lain di halaman yang mendengarkan event ini akan diberitahu.

Anda dapat meneruskan data tambahan dengan event dengan meneruskan data sebagai parameter kedua ke metode `dispatch()`:

```php
$this->dispatch('post-created', title: $post->title);
```

## Mendengarkan events

Untuk mendengarkan event di komponen Livewire, tambahkan atribut `#[On]` di atas metode yang ingin Anda panggil ketika event tertentu dikirim:

> [!warning] Pastikan Anda mengimpor kelas atribut
> Pastikan Anda mengimpor kelas atribut apa pun. Misalnya, atribut `#[On()]` di bawah ini memerlukan import berikut `use Livewire\Attributes\On;`.

```php
use Livewire\Component;
use Livewire\Attributes\On; // [tl! highlight]

class Dashboard extends Component
{
	#[On('post-created')] // [tl! highlight]
    public function updatePostList($title)
    {
		// ...
    }
}
```

Sekarang, ketika event `post-created` dikirim dari `CreatePost`, permintaan jaringan akan dipicu dan aksi `updatePostList()` akan dipanggil.

Seperti yang Anda lihat, data tambahan yang dikirim dengan event akan disediakan ke aksi sebagai argumen pertamanya.

### Mendengarkan nama event dinamis

Terkadang, Anda mungkin ingin menghasilkan nama event listener secara dinamis pada waktu proses menggunakan data dari komponen Anda.

Misalnya, jika Anda ingin membatasi event listener ke model Eloquent tertentu, Anda dapat menambahkan ID model ke nama event saat mengirimkan seperti ini:

```php
use Livewire\Component;

class UpdatePost extends Component
{
    public function update()
    {
        // ...

        $this->dispatch("post-updated.{$post->id}"); // [tl! highlight]
    }
}
```

Dan kemudian mendengarkan model tersebut:

```php
use Livewire\Component;
use App\Models\Post;
use Livewire\Attributes\On; // [tl! highlight]

class ShowPost extends Component
{
    public Post $post;

	#[On('post-updated.{post.id}')] // [tl! highlight]
    public function refreshPost()
    {
		// ...
    }
}
```

Jika model `$post` di atas memiliki ID `3`, metode `refreshPost()` hanya akan dipicu oleh event bernama: `post-updated.3`.

### Mendengarkan events dari komponen anak tertentu

Livewire memungkinkan Anda untuk mendengarkan event langsung pada komponen anak individu di template Blade Anda seperti ini:

```php
<div>
    <livewire:edit-post @saved="$refresh">

    <!-- ... -->
</div>
```

Pada skenario di atas, jika komponen anak `edit-post` mengirimkan event `saved`, `$refresh` induk akan dipanggil dan induk akan disegarkan.

Alih-alih meneruskan `$refresh`, Anda dapat meneruskan metode apa pun yang biasanya Anda teruskan ke sesuatu seperti `wire:click`. Berikut adalah contoh memanggil metode `close()` yang mungkin melakukan sesuatu seperti menutup dialog modal:

```php
<livewire:edit-post @saved="close">
```

Jika anak mengirimkan parameter bersama dengan permintaan, misalnya `$this->dispatch('saved', postId: 1)`, Anda dapat meneruskan nilai-nilai tersebut ke metode induk menggunakan sintaks berikut:

```php
<livewire:edit-post @saved="close($event.detail.postId)">
```

## Menggunakan JavaScript untuk berinteraksi dengan events

Sistem event Livewire menjadi jauh lebih kuat ketika Anda berinteraksi dengannya dari JavaScript di dalam aplikasi Anda. Ini membuka kemampuan untuk JavaScript lain apa pun di aplikasi Anda untuk berkomunikasi dengan komponen Livewire di halaman.

### Mendengarkan events di dalam skrip komponen

Anda dapat dengan mudah mendengarkan event `post-created` di dalam template komponen Anda dari directive `@script` seperti ini:

```html
@script
<script>
    $wire.on('post-created', () => {
        //
    });
</script>
@endscript
```

Cuplikan di atas akan mendengarkan `post-created` dari komponen tempatnya terdaftar. Jika komponen tidak lagi ada di halaman, event listener tidak akan lagi dipicu.

[Baca lebih lanjut tentang menggunakan JavaScript di dalam komponen Livewire Anda →](/docs/javascript#using-javascript-in-livewire-components)

### Mengirimkan events dari skrip komponen

Selain itu, Anda dapat mengirimkan event dari dalam `@script` komponen seperti ini:

```html
@script
<script>
    $wire.dispatch('post-created');
</script>
@endscript
```

Ketika `@script` di atas dijalankan, event `post-created` akan dikirimkan ke komponen tempatnya didefinisikan.

Untuk mengirimkan event hanya ke komponen tempat skrip berada dan bukan komponen lain di halaman (mencegah event "menggelembung" ke atas), Anda dapat menggunakan `dispatchSelf()`:

```js
$wire.dispatchSelf('post-created');
```

Anda dapat meneruskan parameter tambahan apa pun ke event dengan meneruskan objek sebagai argumen kedua ke `dispatch()`:

```html
@script
<script>
    $wire.dispatch('post-created', { refreshPosts: true });
</script>
@endscript
```

Anda sekarang dapat mengakses parameter event tersebut baik dari kelas Livewire Anda maupun JavaScript event listener lainnya.

Berikut adalah contoh menerima parameter `refreshPosts` dalam kelas Livewire:

```php
use Livewire\Attributes\On;

// ...

#[On('post-created')]
public function handleNewPost($refreshPosts = false)
{
    //
}
```

Anda juga dapat mengakses parameter `refreshPosts` dari JavaScript event listener dari properti `detail` event:

```html
@script
<script>
    $wire.on('post-created', (event) => {
        let refreshPosts = event.detail.refreshPosts

        // ...
    });
</script>
@endscript
```

[Baca lebih lanjut tentang menggunakan JavaScript di dalam komponen Livewire Anda →](/docs/javascript#using-javascript-in-livewire-components)

### Mendengarkan Livewire events dari JavaScript global

Sebagai alternatif, Anda dapat mendengarkan Livewire events secara global menggunakan `Livewire.on` dari skrip apa pun di aplikasi Anda:

```html
<script>
    document.addEventListener('livewire:init', () => {
       Livewire.on('post-created', (event) => {
           //
       });
    });
</script>
```

Cuplikan di atas akan mendengarkan event `post-created` yang dikirim dari komponen apa pun di halaman.

Jika Anda ingin menghapus event listener ini karena alasan apa pun, Anda dapat melakukannya menggunakan fungsi `cleanup` yang dikembalikan:

```html
<script>
    document.addEventListener('livewire:init', () => {
        let cleanup = Livewire.on('post-created', (event) => {
            //
        });

        // Memanggil "cleanup()" akan membatalkan pendaftaran event listener di atas...
        cleanup();
    });
</script>
```

## Events di Alpine

Karena Livewire events adalah browser events biasa di balik layar, Anda dapat menggunakan Alpine untuk mendengarkannya atau bahkan mengirimkannya.

### Mendengarkan Livewire events di Alpine

Misalnya, kita dapat dengan mudah mendengarkan event `post-created` menggunakan Alpine:

```php
<div x-on:post-created="..."></div>
```

Cuplikan di atas akan mendengarkan event `post-created` dari komponen Livewire apa pun yang merupakan anak dari elemen HTML tempat directive `x-on` ditetapkan.

Untuk mendengarkan event dari komponen Livewire apa pun di halaman, Anda dapat menambahkan `.window` ke listener:

```php
<div x-on:post-created.window="..."></div>
```

Jika Anda ingin mengakses data tambahan yang dikirim dengan event, Anda dapat melakukannya menggunakan `$event.detail`:

```php
<div x-on:post-created="notify('New post: ' + $event.detail.title)"></div>
```

Dokumentasi Alpine menyediakan informasi lebih lanjut tentang [mendengarkan events](https://alpinejs.dev/directives/on).

### Mengirimkan Livewire events dari Alpine

Event apa pun yang dikirim dari Alpine mampu disadap oleh komponen Livewire.

Misalnya, kita dapat dengan mudah mengirim event `post-created` dari Alpine:

```php
<button @click="$dispatch('post-created')">...</button>
```

Seperti metode `dispatch()` Livewire, Anda dapat meneruskan data tambahan bersama event dengan meneruskan data sebagai parameter kedua ke metode:

```php
<button @click="$dispatch('post-created', { title: 'Post Title' })">...</button>
```

Untuk mempelajari lebih lanjut tentang mengirimkan events menggunakan Alpine, konsultasikan [Dokumentasi Alpine](https://alpinejs.dev/magics/dispatch).

> [!tip] Anda mungkin tidak memerlukan events
> Jika Anda menggunakan events untuk memanggil perilaku pada induk dari anak, Anda sebagai gantinya dapat memanggil aksi langsung dari anak menggunakan `$parent` di template Blade Anda. Misalnya:
>
> ```php
> <button wire:click="$parent.showCreatePostForm()">Create Post</button>
> ```
>
> [Pelajari lebih lanjut tentang $parent](/docs/nesting#directly-accessing-the-parent-from-the-child).

## Mengirimkan langsung ke komponen lain

Jika Anda ingin menggunakan events untuk berkomunikasi langsung antara dua komponen di halaman, Anda dapat menggunakan pengubah `dispatch()->to()`.

Di bawah ini adalah contoh komponen `CreatePost` mengirimkan event `post-created` langsung ke komponen `Dashboard`, melewati komponen lain yang mendengarkan event tertentu tersebut:

```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created')->to(Dashboard::class);
    }
}
```

## Mengirimkan event komponen ke dirinya sendiri

Menggunakan pengubah `dispatch()->self()`, Anda dapat membatasi event hanya untuk disadap oleh komponen tempat event itu dipicu:

```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created')->self();
    }
}
```

## Mengirimkan events dari template Blade

Anda dapat mengirimkan events langsung dari template Blade Anda menggunakan fungsi JavaScript `$dispatch`. Ini berguna ketika Anda ingin memicu event dari interaksi pengguna, seperti klik tombol:

```php
<button wire:click="$dispatch('show-post-modal', { id: {{ $post->id }} })">
    EditPost
</button>
```

Pada contoh ini, ketika tombol diklik, event `show-post-modal` akan dikirim dengan data yang ditentukan.

Jika Anda ingin mengirimkan event langsung ke komponen lain, Anda dapat menggunakan fungsi JavaScript `$dispatchTo()`:

```php
<button wire:click="$dispatchTo('posts', 'show-post-modal', { id: {{ $post->id }} })">
    EditPost
</button>
```

Pada contoh ini, ketika tombol diklik, event `show-post-modal` akan dikirim langsung ke komponen `Posts`.

## Testing events yang dikirim

Untuk menguji events yang dikirim oleh komponen Anda, gunakan metode `assertDispatched()` dalam tes Livewire Anda. Metode ini memeriksa bahwa event tertentu telah dikirim selama siklus hidup komponen:

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Livewire\CreatePost;
use Livewire\Livewire;

class CreatePostTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_dispatches_post_created_event()
    {
        Livewire::test(CreatePost::class)
            ->call('save')
            ->assertDispatched('post-created');
    }
}
```

Pada contoh ini, tes memastikan bahwa event `post-created` dikirim dengan data yang ditentukan ketika metode `save()` dipanggil pada komponen `CreatePost`.

### Testing Event Listeners

Untuk menguji event listeners, Anda dapat mengirimkan events dari lingkungan tes dan menyatakan bahwa aksi yang diharapkan dilakukan sebagai respons terhadap event:

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Livewire\Dashboard;
use Livewire\Livewire;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_updates_post_count_when_a_post_is_created()
    {
        Livewire::test(Dashboard::class)
            ->assertSee('Posts created: 0')
            ->dispatch('post-created')
            ->assertSee('Posts created: 1');
    }
}
```

Pada contoh ini, tes mengirimkan event `post-created`, kemudian memeriksa bahwa komponen `Dashboard` menangani event dengan benar dan menampilkan hitungan yang diperbarui.

## Events real-time menggunakan Laravel Echo

Livewire berpasangan dengan baik dengan [Laravel Echo](https://laravel.com/docs/broadcasting#client-side-installation) untuk menyediakan fungsionalitas real-time di halaman web Anda menggunakan WebSockets.

> [!warning] Menginstal Laravel Echo adalah prasyarat
> Fitur ini mengasumsikan Anda telah menginstal Laravel Echo dan objek `window.Echo` tersedia secara global di aplikasi Anda. Untuk informasi lebih lanjut tentang menginstal echo, lihat [Dokumentasi Laravel Echo](https://laravel.com/docs/broadcasting#client-side-installation).

### Mendengarkan Echo events

Bayangkan Anda memiliki event di aplikasi Laravel Anda bernama `OrderShipped`:

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;

    public function broadcastOn()
    {
        return new Channel('orders');
    }
}
```

Anda mungkin mengirimkan event ini dari bagian lain aplikasi Anda seperti ini:

```php
use App\Events\OrderShipped;

OrderShipped::dispatch();
```

Jika Anda mendengarkan event ini di JavaScript hanya menggunakan Laravel Echo, itu akan terlihat seperti ini:

```js
Echo.channel('orders')
    .listen('OrderShipped', e => {
        console.log(e.order)
    })
```

Dengan asumsi Anda telah menginstal dan mengkonfigurasi Laravel Echo, Anda dapat mendengarkan event ini dari dalam komponen Livewire.

Di bawah ini adalah contoh komponen `OrderTracker` yang mendengarkan event `OrderShipped` untuk menunjukkan kepada pengguna indikasi visual dari pesanan baru:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\On; // [tl! highlight]
use Livewire\Component;

class OrderTracker extends Component
{
    public $showNewOrderNotification = false;

    #[On('echo:orders,OrderShipped')]
    public function notifyNewOrder()
    {
        $this->showNewOrderNotification = true;
    }

    // ...
}
```

Jika Anda memiliki Echo channels dengan variabel yang tertanam di dalamnya (seperti Order ID), Anda dapat mendefinisikan listener melalui metode `getListeners()` sebagai ganti atribut `#[On]`:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\On; // [tl! highlight]
use Livewire\Component;
use App\Models\Order;

class OrderTracker extends Component
{
    public Order $order;

    public $showOrderShippedNotification = false;

    public function getListeners()
    {
        return [
            "echo:orders.{$this->order->id},OrderShipped" => 'notifyShipped',
        ];
    }

    public function notifyShipped()
    {
        $this->showOrderShippedNotification = true;
    }

    // ...
}
```

Atau, jika Anda lebih suka, Anda dapat menggunakan sintaks nama event dinamis:

```php
#[On('echo:orders.{order.id},OrderShipped')]
public function notifyNewOrder()
{
    $this->showNewOrderNotification = true;
}
```

Jika Anda perlu mengakses payload event, Anda dapat melakukannya melalui parameter `$event` yang diteruskan:

```php
#[On('echo:orders.{order.id},OrderShipped')]
public function notifyNewOrder($event)
{
    $order = Order::find($event['orderId']);

    //
}
```

### Private & presence channels

Anda juga dapat mendengarkan events yang disiarkan ke private dan presence channels:

> [!info]
> Sebelum melanjutkan, pastikan Anda telah mendefinisikan <a href="https://laravel.com/docs/master/broadcasting#defining-authorization-callbacks">Authentication Callbacks</a> untuk broadcast channels Anda.

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class OrderTracker extends Component
{
    public $showNewOrderNotification = false;

    public function getListeners()
    {
        return [
            // Public Channel
            "echo:orders,OrderShipped" => 'notifyNewOrder',

            // Private Channel
            "echo-private:orders,OrderShipped" => 'notifyNewOrder',

            // Presence Channel
            "echo-presence:orders,OrderShipped" => 'notifyNewOrder',
            "echo-presence:orders,here" => 'notifyNewOrder',
            "echo-presence:orders,joining" => 'notifyNewOrder',
            "echo-presence:orders,leaving" => 'notifyNewOrder',
        ];
    }

    public function notifyNewOrder()
    {
        $this->showNewOrderNotification = true;
    }
}
```