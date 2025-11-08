# Inertia.js Indonesia - Dokumentasi Bahasa Indonesia

Website dokumentasi **Inertia.js** dalam bahasa Indonesia, dibangun dengan [Docusaurus](https://docusaurus.io/).

## 🚀 Tentang Project

Inertia.js Indonesia adalah dokumentasi resmi Inertia.js yang diterjemahkan dan dilokalkan untuk komunitas developer Indonesia. Project ini bertujuan untuk:

- 📚 Memberikan dokumentasi lengkap dalam bahasa Indonesia
- 🌟 Membantu developer Indonesia mempelajari Inertia.js dengan mudah
- 🤖 Membangun komunitas Inertia.js di Indonesia
- 📖 Menyediakan tutorial dan contoh kasus nyata

## ✨ Fitur Utama

- 🎨 **Desain Modern** - Tampilan yang terinspirasi dari website Inertia.js official
- 🌙 **Dark Mode** - Support untuk dark/light theme
- 🔍 **Pencarian** - Built-in search functionality
- 📱 **Responsive** - Mobile-friendly design
- ⚡ **Fast Loading** - Optimized performance
- 📝 **Blog** - Artikel dan tutorial terbaru
- 🎯 **SEO Friendly** - Optimized untuk search engines

## 🛠 Tech Stack

- **Framework**: Docusaurus 3.9.2
- **Styling**: Custom CSS dengan CSS Variables
- **Typography**: Inter & JetBrains Mono
- **Icons**: Custom SVG
- **Deployment**: Vercel (recommended)

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/nandayonah/inertiajs-id.git
cd inertiajs-id

# Install dependencies
npm install

# atau menggunakan yarn
yarn install
```

## 🚀 Local Development

```bash
# Start development server
npm start

# atau dengan yarn
yarn start
```

Akses website di http://localhost:3000

## 🏗 Build

```bash
# Build untuk production
npm run build

# Build dan preview
npm run build && npm run serve
```

## 📂 Struktur Project

```
inertiajs-id/
├── docs/                 # Dokumentasi utama
│   ├── intro.md         # Pengenalan Inertia.js
│   ├── installation.md  # Panduan instalasi
│   ├── quick-start.md   # Quick start guide
│   └── concepts/        # Konsep dasar
├── blog/                 # Artikel blog
├── src/
│   ├── css/            # Custom styling
│   └── pages/          # Custom pages
├── static/              # Static assets
├── docusaurus.config.ts # Konfigurasi Docusaurus
└── sidebars.ts          # Sidebar configuration
```

## 📝 Kontribusi

Kami sangat terbuka untuk kontribusi dari komunitas! Cara berkontribusi:

### 1. Fork Repository

Fork project ini ke GitHub Anda.

### 2. Clone dan Setup

```bash
git clone https://github.com/YOUR_USERNAME/inertiajs-id.git
cd inertiajs-id
npm install
```

### 3. Buat Branch Baru

```bash
git checkout -b feature/nama-fitur
```

### 4. Lakukan Perubahan

- Edit dokumentasi yang ingin diperbaiki
- Tambah dokumentasi baru
- Fix typo atau grammar
- Improve styling atau functionality

### 5. Test Perubahan

```bash
npm start
```

Pastikan semua perubahan berjalan dengan baik.

### 6. Submit Pull Request

Push ke fork Anda dan buat Pull Request ke repository utama.

## 📋 Guidelines Kontribusi

### 📝 Dokumentasi

- Gunakan bahasa Indonesia yang baik dan benar
- Format markdown harus konsisten
- Include code examples yang relevan
- Add proper headings dan navigation

### 🎨 Styling

- Ikuti design system yang sudah ada
- Gunakan CSS variables untuk consistency
- Pastikan responsive design
- Test di berbagai browser

### 🔧 Technical

- Code harus clean dan readable
- Ikuti best practices Docusaurus
- Test semua perubahan
- Document changes yang signifikan

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository ke Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy otomatis setiap push ke main branch

### GitHub Pages

```bash
# Deploy ke GitHub Pages
npm run deploy

# Atau dengan SSH
USE_SSH=true npm run deploy
```

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Add redirects untuk SPA support

## 📊 Analytics dan Monitoring

Website dilengkapi dengan:

- Google Analytics (opsional)
- Performance monitoring
- Error tracking
- User behavior analytics

## 🤝 Komunitas

Bergabung dengan komunitas Inertia.js Indonesia:

- 📧 Email: inertiajs-indonesia@example.com
- 💬 Discord: [Link Discord Server]
- 🐦 Twitter: @inertiajs_id
- 📱 Telegram: Inertia.js Indonesia

## 📄 License

Project ini dilisensikan under [MIT License](LICENSE).

## 🙏 Credits

- [Inertia.js](https://inertiajs.com/) - Framework yang didokumentasikan
- [Docusaurus](https://docusaurus.io/) - Documentation framework
- [Komunitas Indonesia](https://github.com/nandayonah/inertiajs-id/graphs/contributors) - Kontributor

## 📞 Contact

- **Maintainer**: Nanda Yonah
- **Email**: nandayonah@example.com
- **GitHub**: @nandayonah
- **Website**: https://inertiajs-id.vercel.app

---

⭐ Jika Anda menemukan dokumentasi ini helpful, jangan lupa untuk memberikan star ke repository ini!
