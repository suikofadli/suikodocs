---
sidebar_position: 27
---

# wire:click

Livewire menyediakan direktif `wire:click` yang sederhana untuk memanggil metode komponen (juga dikenal sebagai actions) ketika pengguna mengklik elemen tertentu pada halaman.

Misalnya, diberikan komponen `ShowInvoice` di bawah ini:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Invoice;

class ShowInvoice extends Component
{
    public Invoice $invoice;

    public function download()
    {
        return response()->download(
            $this->invoice->file_path, 'invoice.pdf'
        );
    }
}
```

Anda dapat memicu metode `download()` dari kelas di atas ketika pengguna mengklik tombol "Download Invoice" dengan menambahkan `wire:click="download"`:

```html
<button type="button" wire:click="download"> <!-- [tl! highlight] -->
    Download Invoice
</button>
```

## Menggunakan `wire:click` pada link

Ketika menggunakan `wire:click` pada tag `<a>`, Anda harus menambahkan `.prevent` untuk mencegah penanganan default link di browser. Jika tidak, browser akan mengunjungi link yang disediakan dan memperbarui URL halaman.

```html
<a href="#" wire:click.prevent="...">
```

## Lebih dalam

Direktif `wire:click` hanyalah salah satu dari banyak event listener yang tersedia di Livewire. Untuk dokumentasi lengkap tentang kemampuannya (dan event listener lainnya), kunjungi [halaman dokumentasi actions Livewire](/docs/actions).