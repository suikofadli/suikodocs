---
sidebar_position: 38
---

# wire:poll

Polling adalah teknik yang digunakan dalam aplikasi web untuk "poll" server (mengirim request secara teratur) untuk pembaruan. Ini adalah cara sederhana untuk menjaga hal agar tetap up-to-date tanpa memerlukan teknologi yang lebih canggih seperti [WebSockets](/docs/events#real-time-events-using-laravel-echo).

## Penggunaan dasar

Menggunakan polling di dalam Livewire semudah menambahkan `wire:poll` ke elemen.

Di bawah ini adalah contoh komponen `SubscriberCount` yang menunjukkan jumlah subscriber pengguna:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class SubscriberCount extends Component
{
    public function render()
    {
        return view('livewire.subscriber-count', [
            'count' => Auth::user()->subscribers->count(),
        ]);
    }
}
```

```blade
<div wire:poll> <!-- [tl! highlight] -->
    Subscribers: {{ $count }}
</div>
```

Normalnya, komponen ini akan menunjukkan jumlah subscriber untuk pengguna dan tidak pernah diperbarui sampai halaman di-refresh. Namun, karena `wire:poll` pada template komponen, komponen ini sekarang akan me-refresh dirinya sendiri setiap `2.5` detik, menjaga jumlah subscriber tetap up-to-date.

Anda juga dapat menentukan tindakan untuk dijalankan pada interval polling dengan meneruskan nilai ke `wire:poll`:

```blade
<div wire:poll="refreshSubscribers">
    Subscribers: {{ $count }}
</div>
```

Sekarang, metode `refreshSubscribers()` pada komponen akan dipanggil setiap `2.5` detik.

## Kontrol timing

Kekurangan utama polling adalah dapat menggunakan sumber daya yang intensif. Jika Anda memiliki seribu pengunjung di halaman yang menggunakan polling, seribu request jaringan akan dipicu setiap `2.5` detik.

Cara terbaik untuk mengurangi request dalam skenario ini adalah dengan membuat interval polling lebih panjang.

Anda dapat mengontrol seberapa sering komponen akan melakukan poll dengan menambahkan durasi yang diinginkan ke `wire:poll` seperti ini:

```blade
<div wire:poll.15s> <!-- Dalam detik... -->

<div wire:poll.15000ms> <!-- Dalam milidetik... -->
```

## Throttling di latar belakang

Untuk lebih mengurangi request server, Livewire secara otomatis melakukan throttle polling ketika halaman ada di latar belakang. Misalnya, jika pengguna menjaga halaman terbuka di tab browser yang berbeda, Livewire akan mengurangi jumlah request polling sebesar 95% sampai pengguna mengunjungi kembali tab tersebut.

Jika Anda ingin keluar dari perilaku ini dan tetap melakukan polling terus-menerus, bahkan ketika tab ada di latar belakang, Anda dapat menambahkan modifier `.keep-alive` ke `wire:poll`:

```blade
<div wire:poll.keep-alive>
```

##  Throttling viewport

Langkah lain yang dapat Anda ambil untuk hanya melakukan polling jika perlu, adalah dengan menambahkan modifier `.visible` ke `wire:poll`. Modifier `.visible` menginstruksikan Livewire untuk hanya melakukan poll komponen ketika visible di halaman:

```blade
<div wire:poll.visible>
```

Jika komponen yang menggunakan `wire:visible` ada di bagian bawah halaman yang panjang, komponen tidak akan mulai melakukan polling sampai pengguna scroll ke viewport. Ketika pengguna scroll pergi, komponen akan berhenti melakukan polling lagi.