---
sidebar_position: 43
---

# wire:stream

Livewire memungkinkan Anda untuk streaming konten ke halaman web sebelum request selesai melalui API `wire:stream`. Ini adalah fitur yang sangat berguna untuk hal-hal seperti chat-bot AI yang streaming respons saat mereka dibuat.

> [!warning] Tidak kompatibel dengan Laravel Octane
> Livewire saat ini tidak mendukung penggunaan `wire:stream` dengan Laravel Octane.

Untuk mendemonstrasikan fungsionalitas paling dasar dari `wire:stream`, di bawah ini adalah komponen CountDown sederhana yang ketika tombol ditekan menampilkan hitungan mundur kepada pengguna dari "3" hingga "0":

```php
use Livewire\Component;

class CountDown extends Component
{
    public $start = 3;

    public function begin()
    {
        while ($this->start >= 0) {
            // Stream hitungan saat ini ke browser...
            $this->stream(  // [tl! highlight:4]
                to: 'count',
                content: $this->start,
                replace: true,
            );

            // Jeda selama 1 detik antar angka...
            sleep(1);

            // Kurangi penghitung...
            $this->start = $this->start - 1;
        };
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <button wire:click="begin">Start count-down</button>

            <h1>Count: <span wire:stream="count">{{ $start }}</span></h1> <!-- [tl! highlight] -->
        </div>
        HTML;
    }
}
```

Berikut ini yang terjadi dari perspektif pengguna ketika mereka menekan "Start count-down":
* "Count: 3" ditampilkan di halaman
* Mereka menekan tombol "Start count-down"
* Satu detik berlalu dan "Count: 2" ditampilkan
* Proses ini berlanjut hingga "Count: 0" ditampilkan

Semua hal di atas terjadi saat satu request jaringan keluar ke server.

Berikut ini yang terjadi dari perspektif sistem ketika tombol ditekan:
* Request dikirim ke Livewire untuk memanggil metode `begin()`
* Metode `begin()` dipanggil dan loop `while` dimulai
* `$this->stream()` dipanggil dan segera memulai "streamed response" ke browser
* Browser menerima streamed response dengan instruksi untuk menemukan elemen dalam komponen dengan `wire:stream="count"`, dan mengganti kontennya dengan payload yang diterima ("3" dalam kasus angka streaming pertama)
* Metode `sleep(1)` menyebabkan server hang selama satu detik
* Loop `while` diulang dan proses streaming angka baru setiap detik berlanjut hingga kondisi `while` salah
* Ketika `begin()` selesai berjalan dan semua hitungan telah di-stream ke browser, Livewire menyelesaikan request lifecycle-nya, merender komponen dan mengirim respons akhir ke browser

## Streaming respons chat-bot

Use case umum untuk `wire:stream` adalah streaming respons chat-bot saat diterima dari API yang mendukung respons streaming (seperti [ChatGPT OpenAI](https://chat.openai.com/)).

Di bawah ini adalah contoh penggunaan `wire:stream` untuk mencapai antarmuka seperti ChatGPT:

```php
use Livewire\Component;

class ChatBot extends Component
{
    public $prompt = '';

    public $question = '';

    public $answer = '';

    function submitPrompt()
    {
        $this->question = $this->prompt;

        $this->prompt = '';

        $this->js('$wire.ask()');
    }

    function ask()
    {
        $this->answer = OpenAI::ask($this->question, function ($partial) {
            $this->stream(to: 'answer', content: $partial); // [tl! highlight]
        });
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <section>
                <div>ChatBot</div>

                @if ($question)
                    <article>
                        <hgroup>
                            <h3>User</h3>
                            <p>{{ $question }}</p>
                        </hgroup>

                        <hgroup>
                            <h3>ChatBot</h3>
                            <p wire:stream="answer">{{ $answer }}</p> <!-- [tl! highlight] -->
                        </hgroup>
                    </article>
                @endif
            </section>

            <form wire:submit="submitPrompt">
                <input wire:model="prompt" type="text" placeholder="Send a message" autofocus>
            </form>
        </div>
        HTML;
    }
}
```

Berikut ini yang terjadi dalam contoh di atas:
* Pengguna mengetik di field teks berlabel "Send a message" untuk menanyakan chat-bot pertanyaan.
* Mereka menekan tombol [Enter].
* Request jaringan dikirim ke server, mengatur pesan ke properti `$question`, dan membersihkan properti `$prompt`.
* Respons dikirim kembali ke browser dan input dibersihkan. Karena `$this->js('...')` dipanggil, request baru dipicu ke server memanggil metode `ask()`.
* Metode `ask()` memanggil ChatBot API dan menerima streamed response partials melalui parameter `$partial` dalam callback.
* Setiap `$partial` di-stream ke browser ke elemen `wire:stream="answer"` di halaman, menampilkan jawaban yang secara bertahap terungkap kepada pengguna.
* Ketika seluruh respons diterima, request Livewire selesai dan pengguna menerima respons lengkap.

## Replace vs. append

Ketika streaming konten ke elemen menggunakan `$this->stream()`, Anda dapat memberi tahu Livewire untuk mengganti konten elemen target dengan konten yang di-stream atau menambahkannya ke konten yang sudah ada.

Mengganti atau menambahkan keduanya diinginkan tergantung pada skenario. Misalnya, saat streaming respons dari chatbot, biasanya appending diinginkan (dan oleh karena itu adalah default). Namun, saat menunjukkan sesuatu seperti hitungan mundur, replacing lebih cocok.

Anda dapat mengkonfigurasi keduanya dengan meneruskan parameter `replace:` ke `$this->stream` dengan nilai boolean:

```php
// Append konten...
$this->stream(to: 'target', content: '...');

// Replace konten...
$this->stream(to: 'target', content: '...', replace: true);
```

Append/replace juga dapat ditentukan di level elemen target dengan menambahkan atau menghapus modifier `.replace`:

```blade
// Append konten...
<div wire:stream="target">

// Replace konten...
<div wire:stream.replace="target">
```