---
sidebar_position: 2
---

# Cara Kerja

Dengan *Inertia* Anda membangun aplikasi seperti biasanya dengan *framework server-side* pilihan Anda. Gunakan fungsionalitas yang ada untuk *routing*, *controllers*, *middleware*, *autentikasi*, *otorisasi*, *pengambilan data*, dan lainnya.

*Inertia* mengganti *layer view* aplikasi Anda. Bukan menggunakan *server-side rendering* melalui template *PHP* atau *Ruby*, *view* yang dikembalikan adalah *JavaScript page components*. Ini memungkinkan Anda membangun seluruh *frontend* menggunakan *React*, *Vue*, atau *Svelte*, sambil tetap menikmati produktivitas *Laravel* atau *framework server-side* pilihan Anda.

Seperti yang Anda harapkan, sekadar membuat *frontend* dalam *JavaScript* tidak memberi Anda pengalaman *single-page application*. Jika Anda mengklik *link*, *browser* akan melakukan *full page visit*, yang menyebabkan *client-side framework* Anda *reboot* pada *page load* berikutnya. Di sinilah *Inertia* mengubah semuanya.

Pada intinya, *Inertia* pada dasarnya adalah *client-side routing library*. Ini memungkinkan Anda melakukan *page visits* tanpa memaksa *full page reload*. Ini dilakukan menggunakan komponen `<Link>`, *wrapper ringkas* di sekitar *anchor link* biasa. Saat Anda mengklik *Inertia link*, *Inertia* mengintersepsi klik dan melakukan *visit* melalui *XHR*. Anda bahkan dapat melakukan *visit* ini secara terprogram dalam *JavaScript* menggunakan `router.visit()`.

Saat *Inertia* melakukan *XHR visit*, *server* mendeteksi bahwa itu adalah *Inertia visit* dan, bukannya mengembalikan *full HTML response*, *server* mengembalikan *JSON response* dengan nama *JavaScript page component* dan *data* (*props*). *Inertia* kemudian secara dinamis mengganti *page component* sebelumnya dengan *page component* baru dan memperbarui *browser's history state*.

**Hasil akhirnya adalah pengalaman single-page yang mulus dan smooth.** 🎉

Untuk mempelajari lebih lanjut tentang detail teknis cara kerja *Inertia* di balik layar, lihat halaman [protocol](/the-protocol).