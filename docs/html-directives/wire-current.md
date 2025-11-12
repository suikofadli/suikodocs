---
sidebar_position: 32
---

# wire:current

Direktif `wire:current` memungkinkan Anda untuk dengan mudah mendeteksi dan memberi gaya pada link yang sedang aktif di halaman.

Berikut adalah contoh sederhana menambahkan `wire:current` ke link di navbar sehingga link yang sedang aktif memiliki ketebalan font yang lebih tebal:

```blade
<nav>
    <a href="/dashboard" ... wire:current="font-bold text-zinc-800">Dashboard</a>
    <a href="/posts" ... wire:current="font-bold text-zinc-800">Posts</a>
    <a href="/users" ... wire:current="font-bold text-zinc-800">Users</a>
</nav>
```

Sekarang ketika pengguna mengunjungi `/posts`, link "Posts" akan memiliki gaya font yang lebih tebal daripada link lainnya.

Anda harus tahu bahwa `wire:current` berfungsi langsung dengan link `wire:navigate` dan perubahan halaman.

## Pencocokan eksak

Secara default, `wire:current` menggunakan strategi pencocokan parsial, artinya akan diterapkan jika link dan halaman saat ini berbagi bagian awal dari path URL.

Misalnya, jika link adalah `/posts`, dan halaman saat ini adalah `/posts/1`, direktif `wire:current` akan diterapkan.

Jika Anda ingin menggunakan pencocokan eksak, Anda dapat menambahkan modifier `.exact` ke direktif.

Berikut adalah contoh di mana Anda mungkin ingin menggunakan pencocokan eksak untuk mencegah link "Dashboard" disorot ketika pengguna mengunjungi `/posts`:

```blade
<nav>
    <a href="/" wire:current.exact="font-bold">Dashboard</a>
</nav>
```

## Pencocokan ketat

Secara default, `wire:current` akan menghapus trailing slash (`/`) dari perbandingannya.

Jika Anda ingin menonaktifkan perilaku ini dan memaksa perbandingan string path yang ketat, Anda dapat menambahkan modifier `.strict`:

```blade
<nav>
    <a href="/posts/" wire:current.strict="font-bold">Dashboard</a>
</nav>
```

## Pemecahan masalah

Jika `wire:current` tidak mendeteksi link saat ini dengan benar, pastikan hal berikut:

* Anda memiliki setidaknya satu komponen Livewire di halaman, atau telah men-hardcode `@livewireScripts` di layout Anda
* Anda memiliki atribut `href` pada link.