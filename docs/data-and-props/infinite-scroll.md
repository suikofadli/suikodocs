---
sidebar_position: 8
---

# Infinite Scroll

Infinite scroll secara otomatis memuat lebih banyak konten saat pengguna scroll, menggantikan paginasi tradisional. Ini bekerja dengan baik untuk antarmuka chat, social feeds, photo grids, dan product listings.

## Konfigurasi Server-side

Gunakan `Inertia::scroll()` saat mengembalikan data yang dipaginasi:

```php
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => Inertia::scroll(fn () => User::paginate())
    ]);
});
```

## Implementasi Client-side

Vue:
```markup
<InfiniteScroll data="users">
    <div v-for="user in users.data" :key="user.id">
        {{ user.name }}
    </div>
</InfiniteScroll>
```

React:
```jsx
<InfiniteScroll data="users">
    {users.data.map(user => (
        <div key={user.id}>
            {user.name}
        </div>
    ))}
</InfiniteScroll>
```

Svelte:
```jsx
<InfiniteScroll data="users">
    {#each users.data as user (user.id)}
        <div>{user.name}</div>
    {/each}
</InfiniteScroll>
```

## Fitur Utama

- **Loading Buffer**: Kontrol kapan konten mulai dimuat dengan jarak buffer
- **URL Synchronization**: Perbarui URL browser dengan nomor halaman saat pengguna scroll
- **Resetting**: Hapus data saat filter berubah menggunakan opsi reset
- **Loading Direction**: Kontrol loading dengan `only-next`, `only-previous`, atau kedua arah
- **Reverse Mode**: Untuk antarmuka chat di mana konten terbaru ada di bagian bawah
- **Manual Mode**: Nonaktifkan loading otomatis dan kontrol melalui slots
- **Custom Element**: Render sebagai elemen HTML apa pun menggunakan prop `as`
- **Element Targeting**: Tentukan elemen mana yang berisi item data
- **Scroll Containers**: Bekerja dengan container yang dapat di-scroll apa pun
- **Multiple Scroll Containers**: Gunakan nama halaman kustom untuk mencegah konflik

Komponen `<InfiniteScroll>` menggunakan intersection observers untuk mendeteksi ketika pengguna mendekati akhir konten dan secara otomatis memicu permintaan untuk lebih banyak data.