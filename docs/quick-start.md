---
sidebar_position: 3
---

# Quick Start

Mari kita buat aplikasi Inertia.js pertama Anda! Panduan ini akan membuat simple contact form dengan Laravel + React.

## Project Setup

### 1. Install Laravel

```bash
composer create-project laravel/laravel inertia-quick-start
cd inertia-quick-start
```

### 2. Install Inertia.js Dependencies

```bash
# Install React adapter
npm install @inertiajs/react

# Install Progress bar
npm install @inertiajs/progress

# Install server-side adapter
composer require inertiajs/inertia-laravel

# Install Ziggy untuk URL generation
composer require tightenco/ziggy
npm install ziggy-js
```

### 3. Setup Inertia Middleware

```bash
php artisan inertia:middleware
```

Register middleware di `app/Http/Kernel.php`:

```php
protected $middlewareGroups = [
    'web' => [
        // ... other middleware
        \App\Http\Middleware\HandleInertiaRequests::class,
    ],
];
```

### 4. Setup Root Template

Buat file `resources/views/app.blade.php`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name') }}</title>
    @vite(['resources/js/app.js', 'resources/css/app.css'])
    @routes
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

### 5. Setup React App

Edit `resources/js/app.js`:

```jsx
import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { InertiaProgress } from '@inertiajs/progress'

InertiaProgress.init()

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

### 6. Update Vite Configuration

Edit `vite.config.js`:

```js
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

## Build Contact Form App

### 7. Create Pages Directory

```bash
mkdir -p resources/js/Pages
```

### 8. Create HomePage

Buat `resources/js/Pages/Home.jsx`:

```jsx
import React from 'react'
import { Link } from '@inertiajs/react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Inertia.js Quick Start
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Selamat Datang!
          </h2>
          <p className="text-gray-600 mb-6">
            Ini adalah aplikasi contact form sederhana yang dibuat dengan Inertia.js.
          </p>

          <Link
            href="/contact"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Contact Form →
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### 9. Create ContactPage

Buat `resources/js/Pages/Contact.jsx`:

```jsx
import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'

export default function Contact({ errors = {} }) {
  const { data, setData, post, processing, recentlySuccessful } = useForm({
    name: '',
    email: '',
    message: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    post('/contact')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            ← Kembali ke Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Contact Form
          </h1>

          {recentlySuccessful && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Pesan Anda telah terkirim!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Nama
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama Anda"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                Pesan
              </label>
              <textarea
                id="message"
                value={data.message}
                onChange={e => setData('message', e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tulis pesan Anda..."
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

### 10. Setup Routes

Edit `routes/web.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ContactController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/contact', [ContactController::class, 'create'])->name('contact.create');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
```

### 11. Create Controllers

Buat `app/Http/Controllers/HomeController.php`:

```php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'appName' => config('app.name')
        ]);
    }
}
```

Buat `app/Http/Controllers/ContactController.php`:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function create()
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Simpan contact ke database atau kirim email
        // Untuk demo, kita hanya redirect dengan success message

        return back()
            ->with('success', 'Pesan Anda telah terkirim!');
    }
}
```

### 12. Setup Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Edit `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edit `resources/css/app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Run Your App

### 13. Start Development Server

```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite
npm run dev
```

### 14. Test Your App

1. Buka `http://localhost:8000`
2. Anda akan melihat homepage dengan tombol ke contact form
3. Klik tombol "Contact Form"
4. Isi form dan submit
5. Anda akan melihat success message tanpa page reload!

## What Just Happened?

- ✅ **Inertia.js** handled navigation between pages tanpa full page reload
- ✅ **Form submission** menggunakan AJAX request
- ✅ **Validation errors** ditampilkan tanpa reload
- ✅ **Success messages** muncul secara dinamis
- ✅ **Progress bar** otomatis muncul saat loading

## Next Steps

- [Data Sharing](/docs/concepts/data-sharing) - Bagikan data global
- [Form Handling](/docs/guide/forms) - Form patterns advance
- [Routing](/docs/concepts/routing) - Konsep routing Inertia.js
- [Testing](/docs/advanced/testing) - Test aplikasi Inertia.js

:::tip Tips Pro
Gunakan React DevTools dan Inertia.js DevTools untuk debugging aplikasi Anda!
:::

Selamat! Anda telah berhasil membuat aplikasi Inertia.js pertama Anda. 🎉