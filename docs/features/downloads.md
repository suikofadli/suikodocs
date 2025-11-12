---
sidebar_position: 22
---

# Download File

Download file di Livewire bekerja dengan cara yang hampir sama seperti di Laravel itu sendiri. Biasanya, Anda dapat menggunakan utilitas download Laravel apa pun di dalam komponen Livewire, dan seharusnya berfungsi seperti yang diharapkan.

Namun, di balik layar, download file ditangani secara berbeda dari pada aplikasi Laravel standar. Saat menggunakan Livewire, konten file dienkode dengan Base64, dikirim ke frontend, dan didekode kembali ke biner untuk diunduh langsung dari klien.

## Penggunaan dasar

Memicu download file di Livewire sesederhana mengembalikan respons download Laravel standar.

Berikut adalah contoh komponen `ShowInvoice` yang berisi tombol "Download" untuk mengunduh PDF invoice:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Invoice;

class ShowInvoice extends Component
{
    public Invoice $invoice;

    public function mount(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function download()
    {
        return response()->download( // [tl! highlight:2]
            $this->invoice->file_path, 'invoice.pdf'
        );
    }

    public function render()
    {
        return view('livewire.show-invoice');
    }
}
```

```blade
<div>
    <h1>{{ $invoice->title }}</h1>

    <span>{{ $invoice->date }}</span>
    <span>{{ $invoice->amount }}</span>

    <button type="button" wire:click="download">Download</button> <!-- [tl! highlight] -->
</div>
```

Sama seperti di controller Laravel, Anda juga dapat menggunakan facade `Storage` untuk memulai download:

```php
public function download()
{
    return Storage::disk('invoices')->download('invoice.csv');
}
```

## Streaming downloads

Livewire juga dapat melakukan streaming download; namun, mereka tidak benar-benar di-streaming. Download tidak dipicu hingga konten file dikumpulkan dan dikirimkan ke browser:

```php
public function download()
{
    return response()->streamDownload(function () {
        echo '...'; // Echo download contents directly...
    }, 'invoice.pdf');
}
```

## Testing download file

Livewire juga menyediakan metode `->assertFileDownloaded()` untuk dengan mudah menguji bahwa file telah diunduh dengan nama yang diberikan:

```php
use App\Models\Invoice;

public function test_can_download_invoice()
{
    $invoice = Invoice::factory();

    Livewire::test(ShowInvoice::class)
        ->call('download')
        ->assertFileDownloaded('invoice.pdf');
}
```

Anda juga dapat menguji untuk memastikan file tidak diunduh menggunakan metode `->assertNoFileDownloaded()`:

```php
use App\Models\Invoice;

public function test_does_not_download_invoice_if_unauthorised()
{
    $invoice = Invoice::factory();

    Livewire::test(ShowInvoice::class)
        ->call('download')
        ->assertNoFileDownloaded();
}
```