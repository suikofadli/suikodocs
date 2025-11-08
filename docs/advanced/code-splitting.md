---
title: Code Splitting
---

# Code Splitting

Code splitting memecah berbagai halaman aplikasi Anda menjadi bundle yang lebih kecil, yang kemudian dimuat sesuai permintaan saat mengunjungi halaman baru. Ini dapat secara signifikan mengurangi ukuran bundle JavaScript awal yang dimuat oleh browser, meningkatkan waktu untuk render pertama.

Meskipun code splitting membantu untuk proyek yang sangat besar, hal ini memerlukan permintaan tambahan saat mengunjungi halaman baru. Secara umum, jika Anda dapat menggunakan satu bundle, aplikasi Anda akan terasa lebih responsif.

Untuk mengaktifkan code splitting, Anda perlu mengubah callback `resolve` dalam konfigurasi `createInertiaApp()`, dan cara Anda melakukannya berbeda tergantung pada bundler mana yang Anda gunakan.

## Menggunakan Vite

Vite mengaktifkan code splitting (atau lazy-loading seperti yang mereka sebut) secara default saat menggunakan fungsi `import.meta.glob()` mereka, jadi cukup hapus opsi `{ eager: true }` atau atur ke `false` untuk menonaktifkan eager loading.

Vue:

```diff
resolve: name => {
-   const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
-   return pages[`./Pages/${name}.vue`]
+   const pages = import.meta.glob('./Pages/**/*.vue')
+   return pages[`./Pages/${name}.vue`]()
},
```

React:

```diff
resolve: name => {
-   const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
-   return pages[`./Pages/${name}.jsx`]
+   const pages = import.meta.glob('./Pages/**/*.jsx')
+   return pages[`./Pages/${name}.jsx`]()
},
```

Svelte:

```diff
resolve: name => {
-   const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
-   return pages[`./Pages/${name}.svelte`]
+   const pages = import.meta.glob('./Pages/**/*.svelte')
+   return pages[`./Pages/${name}.svelte`]()
},
```

## Menggunakan Webpack

Untuk menggunakan code splitting dengan Webpack, Anda pertama perlu mengaktifkan [dynamic imports](https://github.com/tc39/proposal-dynamic-import) melalui plugin Babel. Mari kita instal sekarang.

```bash
npm install @babel/plugin-syntax-dynamic-import
```

Selanjutnya, buat file `.babelrc` di proyek Anda dengan konfigurasi berikut:

```json
{
    "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

Jika Anda menggunakan Laravel Mix, plugin Babel dynamic imports sudah diinstal dan dikonfigurasi, dan Anda dapat melewati langkah-langkah ini. Kami merekomendasikan menggunakan Laravel Mix 6 atau yang lebih baru, karena ada masalah yang diketahui dengan versi yang lebih lama.

Terakhir, perbarui callback `resolve` dalam kode inisialisasi aplikasi Anda untuk menggunakan `import` sebagai ganti `require`.

Vue:

```diff
- resolve: name => require(`./Pages/${name}`),
+ resolve: name => import(`./Pages/${name}`),
```

React:

```diff
- resolve: name => require(`./Pages/${name}`),
+ resolve: name => import(`./Pages/${name}`),
```

Svelte:

```diff
- resolve: name => require(`./Pages/${name}.svelte`),
+ resolve: name => import(`./Pages/${name}.svelte`),
```

Anda juga harus mempertimbangkan untuk menggunakan cache busting untuk memaksa browser memuat versi terbaru dari asset Anda. Untuk melakukan ini, tambahkan konfigurasi berikut ke file konfigurasi webpack Anda.

```js
output: {
    chunkFilename: 'js/[name].js?id=[chunkhash]',
}
```