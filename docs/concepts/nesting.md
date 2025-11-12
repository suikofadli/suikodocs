# Nesting

Livewire memungkinkan Anda untuk *menyarangkan* (*nested*) komponen Livewire tambahan di dalam *parent component*. Fitur ini sangat kuat, karena memungkinkan Anda untuk menggunakan kembali dan mengkapsulasi perilaku dalam komponen Livewire yang dibagikan di seluruh aplikasi Anda.

> [!warning] Anda mungkin tidak memerlukan komponen Livewire
> Sebelum Anda mengekstrak bagian dari template Anda menjadi komponen Livewire yang bersarang, tanyakan pada diri sendiri: Apakah konten dalam komponen ini perlu menjadi "*live*"? Jika tidak, kami sarankan Anda membuat [*Blade component*](https://laravel.com/docs/blade#components) sederhana sebagai gantinya. Hanya buat komponen Livewire jika komponen mendapat manfaat dari sifat *dynamic* Livewire atau jika ada manfaat performa langsung.

Konsultasi [pemeriksaan teknis mendalam tentang penyarangan komponen Livewire](/docs/understanding-nesting) kami untuk informasi lebih lanjut tentang performa, implikasi penggunaan, dan batasan komponen Livewire yang bersarang.

## *Nesting Components*

Untuk *menyarangkan* komponen Livewire dalam *parent component*, cukup sertakan dalam *view Blade* komponen induk. Di bawah ini adalah contoh *parent component* `Dashboard` yang berisi komponen `TodoList` yang bersarang:

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

```blade
<div>
    <h1>Dashboard</h1>

    <livewire:todo-list /> <!-- [tl! highlight] -->
</div>
```

Pada render awal halaman ini, komponen `Dashboard` akan menemukan `<livewire:todo-list />` dan merendernya di tempat. Pada permintaan jaringan berikutnya ke `Dashboard`, komponen `todo-list` yang bersarang akan melewatkan rendering karena sekarang ini adalah komponen independen sendiri di halaman. Untuk informasi lebih lanjut tentang konsep teknis di balik penyarangan dan rendering, konsultasi dokumentasi kami mengapa [komponen yang bersarang adalah "pulau-pulau"](/docs/understanding-nesting#every-component-is-an-island).

Untuk informasi lebih lanjut tentang sintaks untuk rendering komponen, konsultasi dokumentasi kami tentang [Rendering Komponen](/docs/components#rendering-components).

## *Passing Props to Children*

Melewatkan data dari *parent component* ke *child component* sangat mudah. Faktanya, ini sangat mirip dengan melewatkan *props* ke [*Blade component*](https://laravel.com/docs/blade#components) yang khas.

Sebagai contoh, mari kita lihat komponen `TodoList` yang melewatkan koleksi `$todos` ke *child component* yang disebut `TodoCount`:

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

```blade
<div>
    <livewire:todo-count :todos="$todos" />

    <!-- ... -->
</div>
```

Seperti yang Anda lihat, kami melewatkan `$todos` ke `todo-count` dengan sintaks: `:todos="$todos"`.

Sekarang bahwa `$todos` telah dilewatkan ke *child component*, Anda dapat menerima data tersebut melalui metode `mount()` *child component*:

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

> [!tip] Hapus `mount()` sebagai alternatif yang lebih singkat
> Jika metode `mount()` pada contoh di atas terasa seperti kode boilerplate yang berlebihan bagi Anda, metode tersebut dapat dihilangkan selama nama properti dan parameter cocok:
> ```php
> public $todos; // [tl! highlight]
> ```

### *Passing Static Props*

Pada contoh sebelumnya, kami melewatkan *props* ke *child component* kami menggunakan sintaks *props dinamis* Livewire, yang mendukung ekspresi PHP seperti:

```blade
<livewire:todo-count :todos="$todos" />
```

Namun, terkadang Anda ingin melewatkan komponen nilai statis sederhana seperti *string*. Dalam kasus ini, Anda dapat menghilangkan titik dua dari awal pernyataan:

```blade
<livewire:todo-count :todos="$todos" label="Todo Count:" />
```

Nilai *boolean* dapat diberikan ke komponen hanya dengan menentukan kunci. Sebagai contoh, untuk melewatkan variabel `$inline` dengan nilai `true` ke komponen, kami dapat menempatkan `inline` pada tag komponen:

```blade
<livewire:todo-count :todos="$todos" inline />
```

### *Shortened Attribute Syntax*

Ketika melewatkan variabel PHP ke dalam komponen, nama variabel dan nama *props* sering kali sama. Untuk menghindari menulis nama dua kali, Livewire memungkinkan Anda untuk memberikan awalan variabel dengan titik dua:

```blade
<livewire:todo-count :todos="$todos" /> <!-- [tl! remove] -->

<livewire:todo-count :$todos /> <!-- [tl! add] -->
```

## *Rendering Children in a Loop*

Ketika *rendering child component* dalam *loop*, Anda harus menyertakan nilai `key` unik untuk setiap iterasi.

*Key* komponen adalah cara Livewire melacak setiap komponen pada *render* berikutnya, terutama jika komponen telah dirender sebelumnya atau jika beberapa komponen telah diatur ulang pada halaman.

Anda dapat menentukan *key* komponen dengan menentukan *prop* `:key` pada *child component*:

```blade
<div>
    <h1>Todos</h1>

    @foreach ($todos as $todo)
        <livewire:todo-item :$todo :key="$todo->id" />
    @endforeach
</div>
```

Seperti yang Anda lihat, setiap komponen anak akan memiliki kunci unik yang diatur ke ID setiap `$todo`. Ini memastikan kunci akan unik dan dilacak jika todos diatur ulang.

> [!warning] Kunci tidak opsional
> Jika Anda telah menggunakan kerangka kerja frontend seperti Vue atau Alpine, Anda terbiasa menambahkan kunci ke elemen bersarang dalam loop. Namun, dalam kerangka kerja tersebut, kunci tidak _wajib_, artinya item akan dirender, tetapi pengaturan ulang mungkin tidak dilacak dengan benar. Namun, Livewire lebih bergantung pada kunci dan akan berperilaku salah tanpanya.

## *Reactive Props*

Pengembang baru di Livewire mengharapkan *props* menjadi "*reactive*" secara default. Dengan kata lain, mereka mengharapkan bahwa ketika *parent* mengubah nilai *prop* yang dilewatkan ke *child component*, *child component* akan otomatis diperbarui. Namun, secara default, *props Livewire* tidak *reactive*.

Ketika menggunakan Livewire, [setiap komponen adalah pulau](/docs/understanding-nesting#every-component-is-an-island). Ini berarti bahwa ketika pembaruan dipicu pada *parent* dan *permintaan jaringan* dikirim, hanya *state parent component* yang dikirim ke *server* untuk dirender ulang - bukan *state child component*. Niat di balik perilaku ini adalah hanya mengirim jumlah data minimal bolak-balik antara *server* dan *klien*, membuat pembaruan seefektif mungkin.

Tetapi, jika Anda ingin atau membutuhkan prop menjadi reaktif, Anda dapat dengan mudah mengaktifkan perilaku ini menggunakan parameter atribut `#[Reactive]`.

Sebagai contoh, di bawah ini adalah *template* *parent component* `TodoList`. Di dalamnya, ia merender komponen `TodoCount` dan melewatkan daftar *todos* saat ini:

```blade
<div>
    <h1>Todos:</h1>

    <livewire:todo-count :$todos />

    <!-- ... -->
</div>
```

Sekarang mari kita tambahkan `#[Reactive]` ke prop `$todos` dalam komponen `TodoCount`. Setelah kami melakukannya, todos yang ditambahkan atau dihapus dalam komponen induk akan otomatis memicu pembaruan dalam komponen `TodoCount`:

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

Properti reaktif adalah fitur yang sangat kuat, membuat Livewire lebih mirip dengan pustaka komponen frontend seperti Vue dan React. Tetapi, penting untuk memahami implikasi performa dari fitur ini dan hanya menambahkan `#[Reactive]` ketika masuk akal untuk skenario tertentu Anda.

## *Binding to Child Data Using `wire:model`*

Pola kuat lainnya untuk berbagi *state* antara *parent component* dan *child component* adalah menggunakan `wire:model` langsung pada *child component* melalui fitur `Modelable` Livewire.

Perilaku ini sangat umum dibutuhkan ketika mengekstrak *elemen input* ke komponen Livewire yang didedikasikan sambil tetap mengakses *state* dalam *parent component*.

Di bawah ini adalah contoh *parent component* `TodoList` yang berisi *property* `$todo` yang melacak *todo* saat ini yang akan ditambahkan oleh *user*:

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

Di bawah ini adalah komponen `TodoInput` dengan atribut `#[Modelable]` ditambahkan di atas properti `$value` untuk memberi sinyal kepada Livewire bahwa jika `wire:model` dideklarasikan pada komponen oleh induk, ia harus mengikat ke properti ini:

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

Sekarang komponen induk `TodoList` dapat memperlakukan `TodoInput` seperti elemen input lainnya dan mengikat langsung ke nilainya menggunakan `wire:model`.

> [!warning]
> Saat ini Livewire hanya mendukung satu atribut `#[Modelable]`, jadi hanya yang pertama yang akan diikat.

## *Listening for Events from Children*

Teknik komunikasi *parent-child* yang kuat lainnya adalah sistem *event* Livewire, yang memungkinkan Anda untuk mengirim *event* di *server* atau *klien* yang dapat dicegat oleh komponen lain.

[Dokumentasi lengkap kami tentang sistem event Livewire](/docs/events) memberikan informasi lebih detail tentang event, tetapi di bawah kami akan membahas contoh sederhana menggunakan event untuk memicu pembaruan dalam komponen induk.

Pertimbangkan komponen `TodoList` dengan fungsionalitas untuk menampilkan dan menghapus *todos*:

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

```blade
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

Setelah atribut ditambahkan ke aksi, Anda dapat mengirim event `remove-todo` dari komponen anak `TodoList`:

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

Sekarang ketika tombol "Remove" diklik dalam `TodoItem`, komponen induk `TodoList` akan mencegat event yang dikirim dan melakukan penghapusan todo.

Setelah todo dihapus dalam induk, daftar akan dirender ulang dan anak yang mengirim event `remove-todo` akan dihapus dari halaman.

### *Improving Performance by Dispatching Client-Side*

Meskipun contoh di atas berfungsi, dibutuhkan dua *permintaan jaringan* untuk melakukan satu *aksi*:

1. *Permintaan jaringan* pertama dari komponen `TodoItem` memicu aksi `remove`, mengirim *event* `remove-todo`.
2. *Permintaan jaringan* kedua adalah setelah *event* `remove-todo` dikirim di *sisi klien* dan dicegat oleh `TodoList` untuk memanggil aksi `remove`-nya.

Anda dapat menghindari permintaan pertama sama sekali dengan mengirim *event* `remove-todo` langsung di *sisi klien*. Di bawah ini adalah komponen `TodoItem` yang diperbarui yang tidak memicu *permintaan jaringan* saat mengirim *event* `remove-todo`:

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

Sebagai aturan umum, selalu lebih baik mengirim di sisi klien jika memungkinkan.

## Mengakses induk langsung dari anak

Komunikasi event menambahkan lapisan indirection. Induk dapat mendengarkan event yang tidak pernah dikirim dari anak, dan anak dapat mengirim event yang tidak pernah dicegat oleh induk.

Indirection ini terkadang diinginkan; namun, dalam kasus lain Anda mungkin lebih suka mengakses komponen induk langsung dari komponen anak.

Livewire memungkinkan Anda untuk mencapai ini dengan menyediakan variabel magic `$parent` ke template Blade Anda yang dapat Anda gunakan untuk mengakses aksi dan properti langsung dari anak. Berikut adalah template `TodoItem` di atas yang ditulis ulang untuk memanggil aksi `remove()` langsung pada induk melalui variabel magic `$parent`:

```php
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="$parent.remove({{ $todo->id }})">Remove</button>
</div>
```

Event dan komunikasi induk langsung adalah beberapa cara untuk berkomunikasi bolak-balik antara komponen induk dan anak. Memahami trade-off mereka memungkinkan Anda membuat keputusan yang lebih informasi tentang pola mana yang akan digunakan dalam skenario tertentu.

## Komponen anak dinamis

Terkadang, Anda mungkin tidak tahu komponen anak mana yang harus dirender pada halaman hingga runtime. Oleh karena itu, Livewire memungkinkan Anda memilih komponen anak saat runtime melalui `<livewire:dynamic-component ...>`, yang menerima prop `:is`:

```php
<livewire:dynamic-component :is="$current" />
```

Komponen anak dinamis berguna dalam berbagai skenario berbeda, tetapi di bawah ini adalah contoh rendering langkah-langkah berbeda dalam formulir multi-langkah menggunakan komponen dinamis:

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

Sekarang, jika prop `$current` komponen `Steps` diatur ke "step-one", Livewire akan merender komponen bernama "step-one" seperti:

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
> Jangan lupa untuk memberikan setiap komponen anak kunci unik. Meskipun Livewire secara otomatis menghasilkan kunci untuk `<livewire:dynamic-child />` dan `<livewire:is />`, kunci yang sama akan berlaku untuk _semua_ komponen anak Anda, artinya render berikutnya akan dilewati.
>
> Lihat [memaksa komponen anak untuk render ulang](#forcing-a-child-component-to-re-render) untuk pemahaman lebih dalam tentang bagaimana kunci mempengaruhi rendering komponen.

## Komponen rekursif

Meskipun jarang dibutuhkan oleh sebagian besar aplikasi, komponen Livewire mungkin disarangkan secara rekursif, artinya komponen induk merender dirinya sendiri sebagai anak.

Bayangkan survei yang berisi komponen `SurveyQuestion` yang dapat memiliki sub-pertanyaan yang melekat pada dirinya sendiri:

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
> Tentu saja, aturan standar rekursi berlaku untuk komponen rekursif. Yang paling penting, Anda harus memiliki logika dalam template Anda untuk memastikan template tidak berulang tanpa batas. Pada contoh di atas, jika `$subQuestion` berisi pertanyaan asli sebagai `$subQuestion`-nya sendiri, loop tak terbatas akan terjadi.

## Memaksa komponen anak untuk render ulang

Di balik layar, Livewire menghasilkan kunci untuk setiap komponen Livewire yang bersarang dalam template-nya.

Sebagai contoh, pertimbangkan komponen `todo-count` yang bersarang berikut:

```php
<div>
    <livewire:todo-count :$todos />
</div>
```

Livewire secara internal menempelkan kunci string acak ke komponen seperti:

```php
<div>
    <livewire:todo-count :$todos key="lska" />
</div>
```

Ketika komponen induk merender dan menemukan komponen anak seperti di atas, ia menyimpan kunci dalam daftar anak yang melekat pada induk:

```php
'children' => ['lska'],
```

Livewire menggunakan daftar ini sebagai referensi pada render berikutnya untuk mendeteksi apakah komponen anak telah dirender pada permintaan sebelumnya. Jika telah dirender, komponen dilewati. Ingat, [komponen yang bersarang adalah pulau-pulau](/docs/understanding-nesting#every-component-is-an-island). Namun, jika kunci anak tidak ada dalam daftar, artinya belum dirender, Livewire akan membuat instance baru dari komponen dan merendernya di tempat.

Nuansa ini semua adalah perilaku di balik layar yang tidak perlu diketahui oleh sebagian besar pengguna; namun, konsep menetapkan kunci pada anak adalah alat yang kuat untuk mengontrol rendering anak.

Menggunakan pengetahuan ini, jika Anda ingin memaksa komponen untuk render ulang, Anda dapat mengubah kuncinya.

Di bawah ini adalah contoh di mana kami mungkin ingin menghancurkan dan menginisialisasi ulang komponen `todo-count` jika `$todos` yang dilewatkan ke komponen diubah:

```php
<div>
    <livewire:todo-count :todos="$todos" :key="$todos->pluck('id')->join('-')" />
</div>
```

Seperti yang Anda lihat di atas, kami menghasilkan string `:key` dinamis berdasarkan konten `$todos`. Dengan cara ini, komponen `todo-count` akan merender dan ada secara normal sampai `$todos` sendiri berubah. Pada saat itu, komponen akan diinisialisasi ulang sepenuhnya dari awal, dan komponen lama akan dibuang.