---
sidebar_position: 1
---

# Instalasi

Panduan instalasi Inertia.js untuk berbagai kombinasi framework backend dan frontend.

## Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** versi 18.0 atau lebih tinggi
- **Package manager** (npm, yarn, atau pnpm)
- **Framework backend** yang sudah diinstall (Laravel, Rails, Django, dll)
- **Basic knowledge** tentang framework yang Anda gunakan

## Pilih Kombinasi Framework

Pilih kombinasi backend dan frontend framework yang sesuai dengan kebutuhan Anda:

### Laravel + React

```bash
# Install client-side adapter
npm install @inertiajs/react

# Install server-side adapter
composer require inertiajs/inertia-laravel

# Publish Inertia middleware
php artisan inertia:middleware
```

### Laravel + Vue 3

```bash
# Install client-side adapter
npm install @inertiajs/vue3

# Install server-side adapter
composer require inertiajs/inertia-laravel

# Publish Inertia middleware
php artisan inertia:middleware
```

### Rails + React

```bash
# Add to Gemfile
gem 'inertia_rails'

# Install gem
bundle install

# Install client-side adapter
npm install @inertiajs/react
```

### Django + React

```bash
# Install Django package
pip install django-inertia

# Install client-side adapter
npm install @inertiajs/react
```

## Setup Server-side

### Laravel Setup

1. **Buat Inertia middleware:**
```bash
php artisan make:middleware HandleInertiaRequests
```

2. **Register middleware di `app/Http/Kernel.php`:**
```php
protected $middlewareGroups = [
    'web' => [
        // ... middleware lainnya
        \App\Http\Middleware\HandleInertiaRequests::class,
    ],
];
```

3. **Setup root template `resources/views/app.blade.php`:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    @vite(['resources/js/app.js', 'resources/css/app.css'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

### Rails Setup

1. **Setup layout `app/views/layouts/application.html.erb`:**
```erb
<!DOCTYPE html>
<html>
  <head>
    <title><%= yield :page_title %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= vite_client_tag %>
    <%= vite_javascript_tag 'application' %>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <%= inertia_head %>
  </head>
  <body>
    <%= inertia %>
  </body>
</html>
```

## Setup Client-side

### React Setup

1. **Setup entry point `resources/js/app.js`:**
```jsx
import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
```

2. **Vite configuration `vite.config.js`:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    https: true,
    host: 'localhost',
  },
})
```

### Vue 3 Setup

1. **Setup entry point `resources/js/app.js`:**
```js
import { createInertiaApp } from '@inertiajs/vue3'
import { createApp, h } from 'vue'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
    return pages[`./Pages/${name}.vue`]
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
})
```

## Setup Progress Bar

```bash
npm install @inertiajs/progress
```

Tambahkan ke app setup:

```js
// React
import { InertiaProgress } from '@inertiajs/progress'

InertiaProgress.init()

// Vue 3
import { InertiaProgress } from '@inertiajs/progress'

InertiaProgress.init()
```

## Konfigurasi Tambahan

### Laravel Blade Assets

```bash
php artisan inertia:middleware
```

### TypeScript Support

```bash
# Install TypeScript
npm install --save-dev typescript @types/react @types/node

# Create tsconfig.json
npx tsc --init
```

### Vite Configuration

```js
// vite.config.js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
  ],
})
```

## Testing Instalasi

1. **Buat controller sederhana:**
```php
// Laravel example
Route::get('/', function () {
    return inertia('Home', [
        'message' => 'Hello Inertia.js!'
    ]);
});
```

2. **Buat page component:**
```jsx
// resources/js/Pages/Home.jsx
import React from 'react'

export default function Home({ message }) {
  return <div>{message}</div>
}
```

3. **Run development server:**
```bash
npm run dev
php artisan serve
```

4. **Buka browser** dan Anda seharusnya melihat "Hello Inertia.js!"

## Troubleshooting

### Common Issues

:::danger "404 Not Found"
Pastikan root template (`app.blade.php`) sudah dibuat dan Inertia middleware sudah ter-register.
:::

:::danger "Component not found"
Check path di `resolve()` function sesuai dengan struktur file Pages Anda.
:::

:::danger "JavaScript errors"
Verify bahwa semua dependencies sudah terinstall dan Vite configuration sudah benar.
:::

### Debug Mode

Enable debug mode untuk melihat informasi detail:

```php
// Laravel example
'laravel-inertia' => [
    'debug' => env('APP_DEBUG', false),
],
```

## Next Steps

Setelah instalasi berhasil, Anda bisa:

- [Quick Start](/docs/quick-start) - Buat app pertama Anda
- [Konsep Responses](/docs/concepts/responses) - Pahami cara kerja responses
- [Data Sharing](/docs/concepts/data-sharing) - Bagikan data antar halaman