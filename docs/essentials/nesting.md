---
sidebar_position: 10
---

# Nesting

Livewire memungkinkan Anda untuk menyarangkan komponen Livewire tambahan di dalam komponen induk. Fitur ini sangat kuat, karena memungkinkan Anda untuk menggunakan kembali dan mengenkapsulasi perilaku dalam komponen Livewire yang dibagikan di seluruh aplikasi Anda.

> [!warning] Anda mungkin tidak memerlukan komponen Livewire
> Sebelum Anda mengekstrak bagian dari template Anda ke komponen Livewire yang bersarang, tanyakan pada diri sendiri: Apakah konten di komponen ini perlu "live"? Jika tidak, kami sarankan Anda membuat [komponen Blade](https://laravel.com/docs/blade#components) yang sederhana sebagai gantinya. Hanya buat komponen Livewire jika komponen mendapat manfaat dari sifat dinamis Livewire atau jika ada manfaat performa langsung.

Konsultasikan [pemeriksaan teknis mendalam kami tentang penyarangan komponen Livewire](/docs/understanding-nesting) untuk informasi lebih lanjut tentang performa, implikasi penggunaan, dan batasan dari komponen Livewire yang bersarang.

## Menyarangkan komponen

Untuk menyarangkan komponen Livewire dalam komponen induk, cukup sertakan dalam tampilan Blade komponen induk. Di bawah ini adalah contoh komponen induk `Dashboard` yang berisi komponen `TodoList` yang bersarang:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Dashboard extends Component
{
    public function render()
    {
        return view('livewire.dashboard');
    }
}
```

```php
<div>
    <h1>Dashboard</h1>

    <livewire:todo-list /> <!-- [tl! highlight] -->
</div>
```

Pada render awal halaman ini, komponen `Dashboard` akan menemui `<livewire:todo-list />` dan me-rendernya di tempat. Pada permintaan jaringan berikutnya ke `Dashboard`, komponen `todo-list` yang bersarang akan melewati rendering karena sekarang ini adalah komponen independennya sendiri di halaman. Untuk informasi lebih lanjut tentang konsep teknis di balik penyarangan dan rendering, konsultasikan dokumentasi kami tentang mengapa [komponen bersarang adalah "pulau"](https://laravel.com/docs/understanding-nesting#every-component-is-an-island).

Untuk informasi lebih lanjut tentang sintaks untuk me-render komponen, konsultasikan dokumentasi kami tentang [Me-render Komponen](/docs/components#rendering-components).

## Mengirimkan props ke anak

Meneruskan data dari komponen induk ke komponen anak sangat mudah. Faktanya, ini sangat mirip dengan meneruskan props ke [komponen Blade](https://laravel.com/docs/blade#components) yang khas.

Misalnya, mari kita lihat komponen `TodoList` yang meneruskan koleksi `$todos` ke komponen anak yang disebut `TodoCount`:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class TodoList extends Component
{
    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

```php
<div>
    <livewire:todo-count :todos="$todos" />

    <!-- ... -->
</div>
```

Seperti yang Anda lihat, kami meneruskan `$todos` ke `todo-count` dengan sintaks: `:todos="$todos"`.

Sekarang bahwa `$todos` telah diteruskan ke komponen anak, Anda dapat menerima data tersebut melalui metode `mount()` komponen anak:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoCount extends Component
{
    public $todos;

    public function mount($todos)
    {
        $this->todos = $todos;
    }

    public function render()
    {
        return view('livewire.todo-count', [
            'count' => $this->todos->count(),
        ]);
    }
}
```

> [!tip] Hilangkan `mount()` sebagai alternatif yang lebih pendek
> Jika metode `mount()` pada contoh di atas terasa seperti kode boilerplate yang berlebihan bagi Anda, itu dapat dihilangkan selama nama properti dan parameter cocok:
> ```php
> public $todos; // [tl! highlight]
> ```

### Mengirimkan props statis

Pada contoh sebelumnya, kami meneruskan props ke komponen anak kami menggunakan sintaks prop dinamis Livewire, yang mendukung ekspresi PHP seperti ini:

```php
<livewire:todo-count :todos="$todos" />
```

Namun, terkadang Anda mungkin ingin meneruskan nilai statis sederhana seperti string ke komponen. Dalam kasus ini, Anda dapat menghilangkan titik dua dari awal pernyataan:

```php
<livewire:todo-count :todos="$todos" label="Todo Count:" />
```

Nilai boolean dapat diberikan ke komponen hanya dengan menentukan kunci. Misalnya, untuk meneruskan variabel `$inline` dengan nilai `true` ke komponen, kami dapat menempatkan `inline` pada tag komponen:

```php
<livewire:todo-count :todos="$todos" inline />
```

### Sintaks atribut yang dipersingkat

Saat meneruskan variabel PHP ke dalam komponen, nama variabel dan nama properti seringkali sama. Untuk menghindari menulis nama dua kali, Livewire memungkinkan Anda untuk cukup mengawali variabel dengan titik dua:

```php
<livewire:todo-count :todos="$todos" /> <!-- [tl! remove] -->

<livewire:todo-count :$todos /> <!-- [tl! add] -->
```

## Me-render anak dalam loop

Saat me-render komponen anak dalam loop, Anda harus menyertakan nilai `key` unik untuk setiap iterasi.

Kunci komponen adalah cara Livewire melacak setiap komponen pada render berikutnya, terutama jika komponen telah di-render atau jika beberapa komponen telah diatur ulang di halaman.

Anda dapat menentukan kunci komponen dengan menentukan prop `:key` pada komponen anak:

```php
<div>
    <h1>Todos</h1>

    @foreach ($todos as $todo)
        <livewire:todo-item :$todo :key="$todo->id" />
    @endforeach
</div>
```

Seperti yang Anda lihat, setiap komponen anak akan memiliki kunci unik yang diatur ke ID setiap `$todo`. Ini memastikan kunci akan unik dan dilacak jika todos diatur ulang.

> [!warning] Kunci tidak opsional
> Jika Anda telah menggunakan framework frontend seperti Vue atau Alpine, Anda terbiasa menambahkan kunci ke elemen bersarang dalam loop. Namun, dalam framework tersebut, kunci tidak _wajib_, artinya item akan di-render, tetapi pengaturan ulang mungkin tidak dilacak dengan benar. Namun, Livewire lebih bergantung pada kunci dan akan berperilaku salah tanpa mereka.

## Props reaktif

Pengembang baru di Livewire mengharapkan props adalah "reaktif" secara default. Dengan kata lain, mereka mengharapkan bahwa ketika induk mengubah nilai prop yang diteruskan ke komponen anak, komponen anak akan otomatis diperbarui. Namun, secara default, props Livewire tidak reaktif.

Saat menggunakan Livewire, [setiap komponen adalah pulau](https://laravel.com/docs/understanding-nesting#every-component-is-an-island). Ini berarti bahwa ketika update dipicu pada induk dan permintaan jaringan dikirim, hanya status komponen induk yang dikirim ke server untuk di-render ulang - bukan status komponen anak. Niat di balik perilaku ini adalah untuk hanya mengirim jumlah data minimal kembali dan antara server dan klien, membuat pembaruan seberperforma mungkin.

Tapi, jika Anda ingin atau membutuhkan prop untuk menjadi reaktif, Anda dapat dengan mudah mengaktifkan perilaku ini menggunakan parameter atribut `#[Reactive]`.

Misalnya, di bawah ini adalah template komponen induk `TodoList`. Di dalamnya, me-render komponen `TodoCount` dan meneruskan daftar todos saat ini:

```php
<div>
    <h1>Todos:</h1>

    <livewire:todo-count :$todos />

    <!-- ... -->
</div>
```

Sekarang mari kita tambahkan `#[Reactive]` ke prop `$todos` di komponen `TodoCount`. Setelah kita melakukannya, todos apa pun yang ditambahkan atau dihapus di dalam komponen induk akan otomatis memicu update dalam komponen `TodoCount`:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Reactive;
use Livewire\Component;
use App\Models\Todo;

class TodoCount extends Component
{
    #[Reactive] // [tl! highlight]
    public $todos;

    public function render()
    {
        return view('livewire.todo-count', [
            'count' => $this->todos->count(),
        ]);
    }
}
```

Properti reaktif adalah fitur yang sangat kuat, membuat Livewire lebih mirip dengan pustaka komponen frontend seperti Vue dan React. Tapi, penting untuk memahami implikasi performa dari fitur ini dan hanya menambahkan `#[Reactive]` ketika masuk akal untuk skenario tertentu Anda.

## Mengikat ke data anak menggunakan `wire:model`

Pola kuat lain untuk berbagi status antara komponen induk dan anak adalah menggunakan `wire:model` langsung pada komponen anak melalui fitur `Modelable` Livewire.

Perilaku ini sangat umum dibutuhkan saat mengekstrak elemen input ke komponen Livewire khusus sambil tetap mengakses statusnya di komponen induk.

Di bawah ini adalah contoh komponen induk `TodoList` yang berisi properti `$todo` yang melacak todo saat ini yang akan ditambahkan oleh pengguna:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;

class TodoList extends Component
{
    public $todo = '';

    public function add()
    {
        Todo::create([
            'content' => $this->pull('todo'),
        ]);
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

Seperti yang Anda lihat dalam template `TodoList`, `wire:model` digunakan untuk mengikat properti `$todo` langsung ke komponen `TodoInput` yang bersarang:

```php
<div>
    <h1>Todos</h1>

    <livewire:todo-input wire:model="todo" /> <!-- [tl! highlight] -->

    <button wire:click="add">Add Todo</button>

    <div>
        @foreach ($todos as $todo)
            <livewire:todo-item :$todo :key="$todo->id" />
        @endforeach
    </div>
</div>
```

Livewire menyediakan atribut `#[Modelable]` yang dapat Anda tambahkan ke properti komponen anak apa pun untuk membuatnya _modelable_ dari komponen induk.

Di bawah ini adalah komponen `TodoInput` dengan atribut `#[Modelable]` ditambahkan di atas properti `$value` untuk memberi sinyal ke Livewire bahwa jika `wire:model` dideklarasikan pada komponen oleh induk, itu harus mengikat ke properti ini:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Modelable;

class TodoInput extends Component
{
    #[Modelable] // [tl! highlight]
    public $value = '';

    public function render()
    {
        return view('livewire.todo-input');
    }
}
```

```php
<div>
    <input type="text" wire:model="value" >
</div>
```

Sekarang komponen induk `TodoList` dapat memperlakukan `TodoInput` seperti elemen input lain dan mengikat langsung ke nilainya menggunakan `wire:model`.

> [!warning]
> Saat ini Livewire hanya mendukung satu atribut `#[Modelable]`, jadi hanya yang pertama yang akan diikat.

## Mendengarkan events dari anak

Teknik komunikasi induk-anak yang kuat lainnya adalah sistem event Livewire, yang memungkinkan Anda untuk mengirimkan event di server atau klien yang dapat disadap oleh komponen lain.

[Dokumentasi lengkap kami tentang sistem event Livewire](/docs/events) menyediakan informasi lebih rinci tentang events, tetapi di bawah kita akan membahas contoh sederhana menggunakan event untuk memicu update di komponen induk.

Pertimbangkan komponen `TodoList` dengan fungsionalitas untuk menampilkan dan menghapus todos:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;

class TodoList extends Component
{
    public function remove($todoId)
    {
        $todo = Todo::find($todoId);

        $this->authorize('delete', $todo);

        $todo->delete();
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

```php
<div>
    @foreach ($todos as $todo)
        <livewire:todo-item :$todo :key="$todo->id" />
    @endforeach
</div>
```

Untuk memanggil `remove()` dari dalam komponen anak `TodoItem`, Anda dapat menambahkan event listener ke `TodoList` melalui atribut `#[On]`:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;
use Livewire\Attributes\On;

class TodoList extends Component
{
    #[On('remove-todo')] // [tl! highlight]
    public function remove($todoId)
    {
        $todo = Todo::find($todoId);

        $this->authorize('delete', $todo);

        $todo->delete();
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

Setelah atribut ditambahkan ke aksi, Anda dapat mengirimkan event `remove-todo` dari komponen anak `TodoList`:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoItem extends Component
{
    public Todo $todo;

    public function remove()
    {
        $this->dispatch('remove-todo', todoId: $this->todo->id); // [tl! highlight]
    }

    public function render()
    {
        return view('livewire.todo-item');
    }
}
```

```php
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="remove">Remove</button>
</div>
```

Sekarang ketika tombol "Remove" dikliklik di dalam `TodoItem`, komponen induk `TodoList` akan menyadap event yang dikirim dan melakukan penghapusan todo.

Setelah todo dihapus di induk, daftar akan di-render ulang dan anak yang mengirimkan event `remove-todo` akan dihapus dari halaman.

### Meningkatkan performa dengan mengirimkan client-side

Meskipun contoh di atas berfungsi, butuh dua permintaan jaringan untuk melakukan satu tindakan:

1. Permintaan jaringan pertama dari komponen `TodoItem` memicu aksi `remove`, mengirimkan event `remove-todo`.
2. Permintaan jaringan kedua adalah setelah event `remove-todo` dikirim client-side dan disadap oleh `TodoList` untuk memanggil aksi `remove`-nya.

Anda dapat menghindari permintaan pertama sama sekali dengan mengirimkan event `remove-todo` langsung di client-side. Di bawah ini adalah komponen `TodoItem` yang diperbarui yang tidak memicu permintaan jaringan saat mengirimkan event `remove-todo`:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoItem extends Component
{
    public Todo $todo;

    public function render()
    {
        return view('livewire.todo-item');
    }
}
```

```php
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="$dispatch('remove-todo', { todoId: {{ $todo->id }} })">Remove</button>
</div>
```

Sebagai aturan umum, selalu lebih suka mengirimkan client-side jika memungkinkan.

## Mengakses induk langsung dari anak

Komunikasi event menambahkan lapisan indirection. Induk dapat mendengarkan event yang tidak pernah dikirim dari anak, dan anak dapat mengirimkan event yang tidak pernah disadap oleh induk.

Indirection ini kadang-kadang diinginkan; namun, dalam kasus lain, Anda mungkin lebih suka mengakses komponen induk langsung dari komponen anak.

Livewire memungkinkan Anda untuk mencapai ini dengan menyediakan variabel magic `$parent` ke template Blade Anda yang dapat Anda gunakan untuk mengakses aksi dan properti langsung dari anak. Berikut adalah template `TodoItem` di atas yang ditulis ulang untuk memanggil aksi `remove()` langsung pada induk melalui variabel magic `$parent`:

```php
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="$parent.remove({{ $todo->id }})">Remove</button>
</div>
```

Events dan komunikasi induk langsung adalah beberapa cara untuk berkomunikasi bolak-balik antara komponen induk dan anak. Memahami tradeoff mereka memungkinkan Anda membuat keputusan yang lebih informasi tentang pola mana yang akan digunakan dalam skenario tertentu.

## Komponen anak dinamis

Terkadang, Anda mungkin tidak tahu komponen anak mana yang harus di-render di halaman sampai waktu proses. Oleh karena itu, Livewire memungkinkan Anda untuk memilih komponen anak pada waktu proses melalui `<livewire:dynamic-component ...>`, yang menerima prop `:is`:

```php
<livewire:dynamic-component :is="$current" />
```

Komponen anak dinamis berguna dalam berbagai skenario yang berbeda, tetapi di bawah ini adalah contoh me-render langkah berbeda dalam form multi-langkah menggunakan komponen dinamis:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Steps extends Component
{
    public $current = 'step-one';

    protected $steps = [
        'step-one',
        'step-two',
        'step-three',
    ];

    public function next()
    {
        $currentIndex = array_search($this->current, $this->steps);

        $this->current = $this->steps[$currentIndex + 1];
    }

    public function render()
    {
        return view('livewire.todo-list');
    }
}
```

```php
<div>
    <livewire:dynamic-component :is="$current" :key="$current" />

    <button wire:click="next">Next</button>
</div>
```

Sekarang, jika prop `$current` komponen `Steps` diatur ke "step-one", Livewire akan me-render komponen bernama "step-one" seperti ini:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class StepOne extends Component
{
    public function render()
    {
        return view('livewire.step-one');
    }
}
```

Jika Anda lebih suka, Anda dapat menggunakan sintaks alternatif:

```php
<livewire:is :component="$current" :key="$current" />
```

> [!warning]
> Jangan lupa menetapkan setiap komponen anak kunci unik. Meskipun Livewire secara otomatis menghasilkan kunci untuk `<livewire:dynamic-child />` dan `<livewire:is />`, kunci yang sama akan berlaku untuk _semua_ komponen anak Anda, artinya render berikutnya akan dilewati.
>
> Lihat [memaksa komponen anak untuk di-render ulang](#forcing-a-child-component-to-re-render) untuk pemahaman lebih dalam tentang bagaimana kunci memengaruhi rendering komponen.

## Komponen rekursif

Meskipun jarang dibutuhkan oleh sebagian besar aplikasi, komponen Livewire dapat disarangkan secara rekursif, artinya komponen induk me-render dirinya sendiri sebagai anaknya.

Bayangkan survei yang berisi komponen `SurveyQuestion` yang dapat memiliki sub-pertanyaan yang terpasang pada dirinya sendiri:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Question;

class SurveyQuestion extends Component
{
    public Question $question;

    public function render()
    {
        return view('livewire.survey-question', [
            'subQuestions' => $this->question->subQuestions,
        ]);
    }
}
```

```php
<div>
    Question: {{ $question->content }}

    @foreach ($subQuestions as $subQuestion)
        <livewire:survey-question :question="$subQuestion" :key="$subQuestion->id" />
    @endforeach
</div>
```

> [!warning]
> Tentu saja, aturan standar rekursi berlaku untuk komponen rekursif. Yang paling penting, Anda harus memiliki logika dalam template Anda untuk memastikan template tidak rekursif tanpa batas. Pada contoh di atas, jika `$subQuestion` berisi pertanyaan asli sebagai `$subQuestion`-nya sendiri, loop tak terbatas akan terjadi.

## Memaksa komponen anak untuk di-render ulang

Di balik layar, Livewire menghasilkan kunci untuk setiap komponen Livewire yang bersarang dalam template-nya.

Misalnya, pertimbangkan komponen `todo-count` yang bersarang berikut:

```php
<div>
    <livewire:todo-count :$todos />
</div>
```

Livewire secara internal melampirkan kunci string acak ke komponen seperti ini:

```php
<div>
    <livewire:todo-count :$todos key="lska" />
</div>
```

Ketika komponen induk me-render dan menemui komponen anak seperti di atas, ia menyimpan kunci dalam daftar anak yang terpasang ke induk:

```php
'children' => ['lska'],
```

Livewire menggunakan daftar ini untuk referensi pada render berikutnya untuk mendeteksi jika komponen anak telah di-render dalam permintaan sebelumnya. Jika telah di-render, komponen dilewati. Ingat, [komponen bersarang adalah pulau](https://laravel.com/docs/understanding-nesting#every-component-is-an-island). Namun, jika kunci anak tidak ada dalam daftar, artinya belum di-render, Livewire akan membuat instance baru dari komponen dan me-rendernya di tempat.

Nuansa ini semua adalah perilaku di balik layar yang tidak perlu diketahui oleh sebagian besar pengguna; namun, konsep menetapkan kunci pada anak adalah alat yang kuat untuk mengontrol rendering anak.

Menggunakan pengetahuan ini, jika Anda ingin memaksa komponen untuk di-render ulang, Anda dapat mengubah kuncinya.

Di bawah ini adalah contoh di mana kami mungkin ingin menghancurkan dan menginisialisasi ulang komponen `todo-count` jika `$todos` yang diteruskan ke komponen berubah:

```php
<div>
    <livewire:todo-count :todos="$todos" :key="$todos->pluck('id')->join('-')" />
</div>
```

Seperti yang Anda lihat di atas, kami menghasilkan string `:key` dinamis berdasarkan konten `$todos`. Dengan cara ini, komponen `todo-count` akan di-render dan ada sebagai normal sampai `$todos` itu sendiri berubah. Pada titik itu, komponen akan diinisialisasi ulang sepenuhnya dari awal, dan komponen lama akan dibuang.