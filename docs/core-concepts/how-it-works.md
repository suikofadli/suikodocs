---
sidebar_position: 2
---

# Cara Kerja

Dengan Inertia Anda membangun aplikasi seperti biasanya dengan framework server-side pilihan Anda. Gunakan fungsionalitas yang ada untuk routing, controllers, middleware, autentikasi, otorisasi, pengambilan data, dan lainnya.

Inertia mengganti layer view aplikasi Anda. Bukan menggunakan server-side rendering via PHP atau Ruby template, view yang dikembalikan adalah JavaScript page components. Ini memungkinkan Anda membangun seluruh frontend menggunakan React, Vue, atau Svelte, sambil tetap menikmati produktivitas Laravel atau framework server-side pilihan Anda.

Sederhananya, membuat frontend di JavaScript saja tidak memberi Anda pengalaman single-page application. Jika Anda mengklik link, browser akan melakukan full page visit, yang menyebabkan client-side framework Anda reboot pada page load berikutnya. Ini tempat Inertia mengubah semuanya.

Pada intinya, Inertia adalah client-side routing library. Ini memungkinkan page visits tanpa full page reload. Dilakukan menggunakan `<Link>` component, wrapper ringkas di sekitar anchor link biasa. Saat Anda klik Inertia link, Inertia memblokir klik dan melakukan visit via XHR. Anda bahkan bisa melakukan ini secara terprogram di JavaScript menggunakan `router.visit()`.

Saat Inertia melakukan XHR visit, server mendeteksi itu adalah Inertia visit dan, bukannya mengembalikan full HTML response, server mengembalikan JSON response dengan JavaScript page component name dan data (props). Inertia kemudian secara dinamis mengganti page component sebelumnya dengan page component baru dan memperbarui browser's history state.

**Hasil akhirnya adalah pengalaman single-page yang mulus dan smooth.** 🎉