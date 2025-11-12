---
sidebar_position: 36
---

# wire:transition

## Penggunaan dasar

Menampilkan atau menyembunyikan konten di Livewire semudah menggunakan salah satu direktif kondisional Blade seperti `@if`. Untuk meningkatkan pengalaman ini bagi pengguna Anda, Livewire menyediakan direktif `wire:transition` yang memungkinkan Anda untuk mentransisikan elemen kondisional dengan halus masuk dan keluar dari halaman.

Misalnya, di bawah ini adalah komponen `ShowPost` dengan kemampuan untuk mengaktifkan menampilkan komentar:

```php
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public $showComments = false;
}
```

```blade
<div>
    <!-- ... -->

    <button wire:click="$set('showComments', true)">Tampilkan komentar</button>

    @if ($showComments)
        <div wire:transition> <!-- [tl! highlight] -->
            @foreach ($post->comments as $comment)
                <!-- ... -->
            @endforeach
        </div>
    @endif
</div>
```
Karena `wire:transition` telah ditambahkan ke `<div>` yang berisi komentar post, ketika tombol "Tampilkan komentar" ditekan, `$showComments` akan diatur ke `true` dan komentar akan "fade" masuk ke halaman alih-alih muncul secara tiba-tiba.

## Keterbatasan

Saat ini, `wire:transition` hanya didukung pada elemen tunggal di dalam kondisional Blade seperti `@if`. Ini tidak akan berfungsi seperti yang diharapkan ketika digunakan dalam daftar elemen saudara. Misalnya, berikut ini TIDAK akan berfungsi dengan benar:

```blade
<!-- Peringatan: Berikut adalah kode yang tidak akan berfungsi dengan benar -->
<ul>
    @foreach ($post->comments as $comment)
        <li wire:transition wire:key="{{ $comment->id }}">{{ $comment->content }}</li>
    @endforeach
</ul>
```

Jika salah satu elemen komentar `<li>` di atas akan dihapus, Anda akan mengharapkan Livewire untuk mentransisikannya keluar. Namun, karena hambatan dengan mekanisme "morph" Livewire yang mendasarinya, ini tidak akan terjadi. Saat ini tidak ada cara untuk mentransisikan daftar dinamis di Livewire menggunakan `wire:transition`.

## Gaya transisi default

Secara default, Livewire menerapkan transisi CSS opacity dan scale ke elemen dengan `wire:transition`. Berikut adalah pratinjau visual:

```html
<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        Pratinjau transisi <span x-text="show ? 'keluar' : 'masuk →'">masuk</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            &nbsp;
        </div>
    </div>
</div>
```

Transisi di atas menggunakan nilai berikut secara default:

Transisi masuk | Transisi keluar
--- | ---
`duration: 150ms` | `duration: 75ms`
`opacity: [0 - 100]` | `opacity: [100 - 0]`
`transform: scale([0.95 - 1])` | `transform: scale([1 - 0.95])`

## Kustomisasi transisi

Untuk mengkustomisasi CSS yang digunakan Livewire secara internal saat mentransisi, Anda dapat menggunakan kombinasi modifier yang tersedia:

Modifier | Deskripsi
--- | ---
`.in` | Hanya mentransisikan elemen "masuk"
`.out` | Hanya mentransisikan elemen "keluar"
`.duration.[?]ms` | Kustomisasi durasi transisi dalam milidetik
`.duration.[?]s` | Kustomisasi durasi transisi dalam detik
`.delay.[?]ms` | Kustomisasi delay transisi dalam milidetik
`.delay.[?]s` | Kustomisasi delay transisi dalam detik
`.opacity` | Hanya menerapkan transisi opacity
`.scale` | Hanya menerapkan transisi scale
`.origin.[top\|bottom\|left\|right]` | Kustomisasi scale "origin" yang digunakan

Di bawah ini adalah daftar berbagai kombinasi transisi yang dapat membantu untuk memvisualisasikan kustomisasi ini dengan lebih baik:

**Transisi fade-only**

Secara default, Livewire mem-fade dan me-scale elemen saat mentransisi. Anda dapat menonaktifkan scaling dan hanya fade dengan menambahkan modifier `.opacity`. Ini berguna untuk hal-hal seperti mentransisi overlay halaman penuh, di mana menambahkan scale tidak masuk akal.

```html
<div wire:transition.opacity>
```

```html
<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        Pratinjau transisi <span x-text="show ? 'keluar' : 'masuk →'">masuk</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.opacity
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>
```

**Transisi fade-out**

Teknik transisi yang umum adalah menampilkan elemen segera saat mentransisi masuk, dan mem-fade opacity-nya saat mentransisi keluar. Anda akan melihat efek ini pada sebagian besar dropdown dan menu MacOS native. Oleh karena itu ini umumnya diterapkan pada web untuk dropdown, popover, dan menu.

```html
<div wire:transition.out.opacity.duration.200ms>
```

```html
<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        Pratinjau transisi <span x-text="show ? 'keluar' : 'masuk →'">masuk</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.out.opacity.duration.200ms
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>
```

**Transisi origin-top**

Saat menggunakan Livewire untuk mentransisikan elemen seperti menu dropdown, masuk akal untuk scale dari bagian atas menu sebagai origin, alih-alih tengah (default Livewire). Dengan cara ini menu terasa secara visual terikat ke elemen yang memicunya.

```html
<div wire:transition.scale.origin.top>
```

```html
<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        Pratinjau transisi <span x-text="show ? 'keluar' : 'masuk →'">masuk</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.origin.top
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>
```

> [!tip] Livewire menggunakan transisi Alpine di balik layar
> Saat menggunakan `wire:transition` pada elemen, Livewire secara internal menerapkan direktif `x-transition` Alpine. Oleh karena itu Anda dapat menggunakan sebagian besar jika tidak semua sintaks yang biasanya Anda gunakan dengan `x-transition`. Lihat [dokumentasi transisi Alpine](https://alpinejs.dev/directives/transition) untuk semua kemampuannya.