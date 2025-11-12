---
sidebar_position: 15
---

# Validation

Livewire bertujuan untuk membuat validasi input pengguna dan memberikan mereka umpan balik senyaman mungkin. Dengan membangun di atas fitur validasi Laravel, Livewire memanfaatkan pengetahuan Anda yang ada sambil juga menyediakan fitur tambahan yang kuat seperti validasi real-time.

Berikut adalah contoh komponen `CreatePost` yang mendemonstrasikan alur kerja validasi yang paling dasar di Livewire:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    public function save()
    {
        $validated = $this->validate([ // [tl! highlight:3]
			'title' => 'required|min:3',
			'content' => 'required|min:3',
        ]);

		Post::create($validated);

		return redirect()->to('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save">
	<input type="text" wire:model="title">
    <div>@error('title') {{ $message }} @enderror</div>

	<textarea wire:model="content"></textarea>
    <div>@error('content') {{ $message }} @enderror</div>

	<button type="submit">Save</button>
</form>
```

Seperti yang Anda lihat, Livewire menyediakan metode `validate()` yang dapat Anda panggil untuk memvalidasi properti komponen Anda. Metode ini mengembalikan set data yang divalidasi yang kemudian dapat Anda sisipkan dengan aman ke dalam database.

Di frontend, Anda dapat menggunakan direktif Blade Laravel yang ada untuk menampilkan pesan validasi kepada pengguna Anda.

Untuk informasi lebih lanjut, lihat [dokumentasi Laravel tentang rendering error validasi di Blade](https://laravel.com/docs/blade#validation-errors).

## Atribut validasi

Jika Anda lebih suka menggabungkan aturan validasi komponen dengan properti secara langsung, Anda dapat menggunakan atribut `#[Validate]` Livewire.

Dengan mengaitkan aturan validasi dengan properti menggunakan `#[Validate]`, Livewire akan secara otomatis menjalankan aturan validasi properti sebelum setiap update. Namun, Anda masih harus menjalankan `$this->validate()` sebelum menyimpan data ke database sehingga properti yang belum diperbarui juga divalidasi.

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3')] // [tl! highlight]
	public $title = '';

    #[Validate('required|min:3')] // [tl! highlight]
    public $content = '';

    public function save()
    {
        $this->validate();

		Post::create([
            'title' => $this->title,
            'content' => $this->content,
		]);

		return redirect()->to('/posts');
    }

    // ...
}
```

> [!info] Atribut validasi tidak mendukung objek Rule
> PHP Attributes dibatasi pada sintaks tertentu seperti string dan array biasa. Jika Anda menemukan diri Anda ingin menggunakan sintaks run-time seperti objek Rule Laravel (`Rule::exists(...)`) Anda seharusnya [mendefinisikan metode `rules()`](#defining-a-rules-method) di komponen Anda.
>
> Pelajari lebih lanjut dalam dokumentasi tentang [menggunakan objek Rule Laravel dengan Livewire](#using-laravel-rule-objects).

Jika Anda lebih suka kontrol lebih besar atas kapan properti divalidasi, Anda dapat meneruskan parameter `onUpdate: false` ke atribut `#[Validate]`. Ini akan menonaktifkan validasi otomatis apa pun dan sebagai gantinya mengasumsikan Anda ingin memvalidasi properti secara manual menggunakan metode `$this->validate()`:

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3', onUpdate: false)]
	public $title = '';

    #[Validate('required|min:3', onUpdate: false)]
    public $content = '';

    public function save()
    {
        $validated = $this->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }

    // ...
}
```

### Nama atribut kustom

Jika Anda ingin menyesuaikan nama atribut yang disuntikkan ke dalam pesan validasi, Anda dapat melakukannya menggunakan parameter `as:`:

```php
use Livewire\Attributes\Validate;

#[Validate('required', as: 'date of birth')]
public $dob;
```

Ketika validasi gagal pada potongan di atas, Laravel akan menggunakan "date of birth" sebagai ganti "dob" sebagai nama field dalam pesan validasi. Pesan yang dihasilkan akan menjadi "The date of birth field is required" sebagai ganti "The dob field is required".

### Pesan validasi kustom

Untuk melewati pesan validasi Laravel dan menggantinya dengan pesan Anda sendiri, Anda dapat menggunakan parameter `message:` dalam atribut `#[Validate]`:

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: 'Please provide a post title')]
public $title;
```

Sekarang, ketika validasi gagal untuk properti ini, pesannya akan menjadi "Please provide a post title" sebagai ganti "The title field is required".

Jika Anda ingin menambahkan pesan yang berbeda untuk aturan yang berbeda, Anda dapat memberikan beberapa atribut `#[Validate]`:

```php
#[Validate('required', message: 'Please provide a post title')]
#[Validate('min:3', message: 'This title is too short')]
public $title;
```

### Menolak lokalisasi

Secara default, pesan aturan dan atribut Livewire dilokalkan menggunakan helper translate Laravel: `trans()`.

Anda dapat menolak lokalisasi dengan meneruskan parameter `translate: false` ke atribut `#[Validate]`:

```php
#[Validate('required', message: 'Please provide a post title', translate: false)]
public $title;
```

### Key kustom

Saat menerapkan aturan validasi langsung ke properti menggunakan atribut `#[Validate]`, Livewire mengasumsikan kunci validasi harus menjadi nama properti itu sendiri. Namun, ada saat-saat ketika Anda mungkin ingin menyesuaikan kunci validasi.

Misalnya, Anda mungkin ingin menyediakan aturan validasi terpisah untuk properti array dan anak-anaknya. Dalam hal ini, alih-alih meneruskan aturan validasi sebagai argumen pertama ke atribut `#[Validate]`, Anda dapat meneruskan array pasangan key-value sebagai gantinya:

```php
#[Validate([
    'todos' => 'required',
    'todos.*' => [
        'required',
        'min:3',
        new Uppercase,
    ],
])]
public $todos = [];
```

Sekarang, ketika pengguna memperbarui `$todos`, atau metode `validate()` dipanggil, kedua aturan validasi ini akan diterapkan.

## Objek Form

Saat lebih banyak properti dan aturan validasi ditambahkan ke komponen Livewire, komponen dapat mulai terasa terlalu ramai. Untuk mengurangi rasa sakit ini dan juga menyediakan abstraksi yang bermanfaat untuk penggunaan kembali kode, Anda dapat menggunakan *Objek Form* Livewire untuk menyimpan properti dan aturan validasi Anda.

Di bawah ini adalah contoh `CreatePost` yang sama, tetapi sekarang properti dan aturan telah diekstrak ke objek form khusus bernama `PostForm`:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:3')]
	public $title = '';

    #[Validate('required|min:3')]
    public $content = '';
}
```

`PostForm` di atas sekarang dapat didefinisikan sebagai properti pada komponen `CreatePost`:

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public PostForm $form;

    public function save()
    {
		Post::create(
    		$this->form->all()
    	);

		return redirect()->to('/posts');
    }

    // ...
}
```

Seperti yang Anda lihat, alih-alih mendaftar setiap properti secara individual, kita dapat mengambil semua nilai properti menggunakan metode `->all()` pada objek form.

Juga, saat mereferensikan nama properti dalam template, Anda harus menambahkan `form.` ke setiap instance:

```blade
<form wire:submit="save">
	<input type="text" wire:model="form.title">
    <div>@error('form.title') {{ $message }} @enderror</div>

	<textarea wire:model="form.content"></textarea>
    <div>@error('form.content') {{ $message }} @enderror</div>

	<button type="submit">Save</button>
</form>
```

Saat menggunakan objek form, validasi atribut `#[Validate]` akan dijalankan setiap kali properti diperbarui. Namun, jika Anda menonaktifkan perilaku ini dengan menentukan `onUpdate: false` pada atribut, Anda dapat menjalankan validasi objek form secara manual menggunakan `$this->form->validate()`:

```php
public function save()
{
    Post::create(
        $this->form->validate()
    );

    return redirect()->to('/posts');
}
```

Objek form adalah abstraksi yang berguna untuk sebagian besar dataset yang lebih besar dan berbagai fitur tambahan yang membuatnya bahkan lebih kuat. Untuk informasi lebih lanjut, lihat [dokumentasi objek form](/docs/forms#extracting-a-form-object) yang komprehensif.

## Validasi real-time

Validasi real-time adalah istilah yang digunakan untuk ketika Anda memvalidasi input pengguna saat mereka mengisi form, alih-alih menunggu pengiriman form.

Dengan menggunakan atribut `#[Validate]` langsung pada properti Livewire, setiap kali permintaan jaringan dikirim untuk memperbarui nilai properti di server, aturan validasi yang disediakan akan diterapkan.

Ini berarti untuk memberikan pengalaman validasi real-time kepada pengguna Anda pada input tertentu, tidak diperlukan pekerjaan backend tambahan. Satu-satunya hal yang diperlukan adalah menggunakan `wire:model.live` atau `wire:model.blur` untuk menginstruksikan Livewire untuk memicu permintaan jaringan saat field diisi.

Dalam contoh di bawah, `wire:model.blur` telah ditambahkan ke input teks. Sekarang, ketika pengguna mengetik di field dan kemudian menekan tab atau mengklik jauh dari field, permintaan jaringan akan dipicu dengan nilai yang diperbarui dan aturan validasi akan dijalankan:

```blade
<form wire:submit="save">
    <input type="text" wire:model.blur="title">

    <!-- -->
</form>
```

Jika Anda menggunakan metode `rules()` untuk mendeklarasikan aturan validasi untuk properti sebagai ganti atribut `#[Validate]`, Anda masih dapat menyertakan atribut #[Validate] tanpa parameter untuk mempertahankan perilaku memvalidasi real-time:

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate] // [tl! highlight]
	public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => 'required|min:5',
            'content' => 'required|min:5',
        ];
    }

    public function save()
    {
        $validated = $this->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }
```

Sekarang, dalam contoh di atas, meskipun `#[Validate]` kosong, itu akan memberitahu Livewire untuk menjalankan validasi field yang disediakan oleh `rules()` setiap kali properti diperbarui.

## Menyesuaikan pesan error

Out-of-the-box, Laravel menyediakan pesan validasi yang masuk akal seperti "The title field is required." jika properti `$title` memiliki aturan `required` yang melekat padanya.

Namun, Anda mungkin perlu menyesuaikan bahasa dari pesan error ini untuk lebih cocok dengan aplikasi Anda dan penggunanya.

### Nama atribut kustom

Terkadang properti yang Anda validasi memiliki nama yang tidak cocok untuk ditampilkan kepada pengguna. Misalnya, jika Anda memiliki field database di aplikasi Anda bernama `dob` yang berarti "Date of birth", Anda ingin menampilkan kepada pengguna Anda "The date of birth field is required" sebagai ganti "The dob field is required".

Livewire memungkinkan Anda untuk menentukan nama alternatif untuk properti menggunakan parameter `as:`:

```php
use Livewire\Attributes\Validate;

#[Validate('required', as: 'date of birth')]
public $dob = '';
```

Sekarang, jika aturan validasi `required` gagal, pesan error akan menyatakan "The date of birth field is required." sebagai ganti "The dob field is required.".

### Pesan kustom

Jika menyesuaikan nama properti tidak cukup, Anda dapat menyesuaikan seluruh pesan validasi menggunakan parameter `message:`:

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: 'Please fill out your date of birth.')]
public $dob = '';
```

Jika Anda memiliki beberapa aturan untuk menyesuaikan pesannya, disarankan agar Anda menggunakan atribut `#[Validate]` yang sepenuhnya terpisah untuk setiap aturan, seperti ini:

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: 'Please enter a title.')]
#[Validate('min:5', message: 'Your title is too short.')]
public $title = '';
```

Jika Anda ingin menggunakan sintaks array atribut `#[Validate]` sebagai gantinya, Anda dapat menentukan atribut dan pesan kustom seperti ini:

```php
use Livewire\Attributes\Validate;

#[Validate([
    'titles' => 'required',
    'titles.*' => 'required|min:5',
], message: [
    'required' => 'The :attribute is missing.',
    'titles.required' => 'The :attribute are missing.',
    'min' => 'The :attribute is too short.',
], attribute: [
    'titles.*' => 'title',
])]
public $titles = [];
```

## Mendefinisikan metode `rules()`

Sebagai alternatif untuk atribut `#[Validate]` Livewire, Anda dapat mendefinisikan metode di komponen Anda yang disebut `rules()` dan mengembalikan daftar field dan aturan validasi yang sesuai. Ini dapat membantu jika Anda mencoba menggunakan sintaks run-time yang tidak didukung dalam PHP Attributes, misalnya, objek aturan Laravel seperti `Rule::password()`.

Aturan ini kemudian akan diterapkan ketika Anda menjalankan `$this->validate()` di dalam komponen. Anda juga dapat mendefinisikan fungsi `messages()` dan `validationAttributes()`.

Berikut adalah contohnya:

```php
use Livewire\Component;
use App\Models\Post;
use Illuminate\Validation\Rule;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    protected function rules() // [tl! highlight:6]
    {
        return [
            'title' => Rule::exists('posts', 'title'),
            'content' => 'required|min:3',
        ];
    }

    protected function messages() // [tl! highlight:6]
    {
        return [
            'content.required' => 'The :attribute are missing.',
            'content.min' => 'The :attribute is too short.',
        ];
    }

    protected function validationAttributes() // [tl! highlight:6]
    {
        return [
            'content' => 'description',
        ];
    }

    public function save()
    {
        $this->validate();

		Post::create([
            'title' => $this->title,
            'content' => $this->content,
		]);

		return redirect()->to('/posts');
    }

    // ...
}
```

> [!warning] Metode `rules()` tidak memvalidasi pada update data
> Saat mendefinisikan aturan melalui metode `rules()`, Livewire HANYA akan menggunakan aturan validasi ini untuk memvalidasi properti saat Anda menjalankan `$this->validate()`. Ini berbeda dari atribut `#[Validate]` standar yang diterapkan setiap kali field diperbarui melalui sesuatu seperti `wire:model`. Untuk menerapkan aturan validasi ini ke properti setiap kali diperbarui, Anda masih dapat menggunakan `#[Validate]` tanpa parameter tambahan.

> [!warning] Jangan konflik dengan mekanisme Livewire
> Saat menggunakan utilitas validasi Livewire, komponen Anda **seharusnya tidak** memiliki properti atau metode bernama `rules`, `messages`, `validationAttributes` atau `validationCustomValues`, kecuali jika Anda menyesuaikan proses validasi. Jika tidak, itu akan konflik dengan mekanisme Livewire.

## Menggunakan objek Rule Laravel

Objek `Rule` Laravel adalah cara yang sangat kuat untuk menambahkan perilaku validasi lanjutan ke form Anda.

Berikut adalah contoh penggunaan objek Rule bersamaan dengan metode `rules()` Livewire untuk mencapai validasi yang lebih canggih:

```php
<?php

namespace App\Livewire;

use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class UpdatePost extends Form
{
    public ?Post $post;

    public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => [
                'required',
                Rule::unique('posts')->ignore($this->post), // [tl! highlight]
            ],
            'content' => 'required|min:5',
        ];
    }

    public function mount()
    {
        $this->title = $this->post->title;
        $this->content = $this->post->content;
    }

    public function update()
    {
        $this->validate(); // [tl! highlight]

        $this->post->update($this->all());

        $this->reset();
    }

    // ...
}
```

## Mengontrol error validasi secara manual

Utilitas validasi Livewire harus menangani skenario validasi yang paling umum; namun, ada saat-saat ketika Anda mungkin ingin kontrol penuh atas pesan validasi di komponen Anda.

Di bawah ini adalah semua metode yang tersedia untuk memanipulasi error validasi di komponen Livewire Anda:

Metode | Deskripsi
--- | ---
`$this->addError([key], [message])` | Tambahkan pesan validasi secara manual ke error bag
`$this->resetValidation([?key])` | Reset error validasi untuk kunci yang disediakan, atau reset semua error jika tidak ada kunci yang disediakan
`$this->getErrorBag()` | Ambil error bag Laravel yang mendasari yang digunakan dalam komponen Livewire

> [!info] Menggunakan `$this->addError()` dengan Objek Form
> Saat menambahkan error secara manual menggunakan `$this->addError` di dalam objek form, kunci akan secara otomatis diawali dengan nama properti yang diassign form di komponen induk. Misalnya, jika di Komponen Anda Anda menetapkan form ke properti yang disebut `$data`, kunci akan menjadi `data.key`.

## Mengakses instance validator

Terkadang Anda mungkin ingin mengakses instance Validator yang digunakan Livewire secara internal dalam metode `validate()`. Ini memungkinkan menggunakan metode `withValidator`. Closure yang Anda berikan menerima validator yang sepenuhnya dikonstruksi sebagai argumen, memungkinkan Anda untuk memanggil salah satu metodenya sebelum aturan validasi benar-benar dievaluasi.

Di bawah ini adalah contoh intersepsi validator internal Livewire untuk secara manual memeriksa kondisi dan menambahkan pesan validasi tambahan:

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3')]
	public $title = '';

    #[Validate('required|min:3')]
    public $content = '';

    public function boot()
    {
        $this->withValidator(function ($validator) {
            $validator->after(function ($validator) {
                if (str($this->title)->startsWith('"')) {
                    $validator->errors()->add('title', 'Titles cannot start with quotations');
                }
            });
        });
    }

    public function save()
    {
		Post::create($this->all());

		return redirect()->to('/posts');
    }

    // ...
}
```

## Menggunakan validator kustom

Jika Anda ingin menggunakan sistem validasi Anda sendiri di Livewire, itu bukan masalah. Livewire akan menangkap pengecualian `ValidationException` apa pun yang dilempar di dalam komponen dan menyediakan error ke view seolah-olah Anda menggunakan metode `validate()` Livewire sendiri.

Di bawah ini adalah contoh komponen `CreatePost`, tetapi alih-alih menggunakan fitur validasi Livewire, validator yang sepenuhnya kustom sedang dibuat dan diterapkan ke properti komponen:

```php
use Illuminate\Support\Facades\Validator;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    public function save()
    {
        $validated = Validator::make(
            // Data to validate...
            ['title' => $this->title, 'content' => $this->content],

            // Validation rules to apply...
            ['title' => 'required|min:3', 'content' => 'required|min:3'],

            // Custom validation messages...
            ['required' => 'The :attribute field is required'],
         )->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }

    // ...
}
```

## Menguji validasi

Livewire menyediakan utilitas pengujian yang berguna untuk skenario validasi, seperti metode `assertHasErrors()`.

Di bawah ini adalah kasus uji dasar yang memastikan error validasi dilempar jika tidak ada input yang diatur untuk properti `title`:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_cant_create_post_without_title()
    {
        Livewire::test(CreatePost::class)
            ->set('content', 'Sample content...')
            ->call('save')
            ->assertHasErrors('title');
    }
}
```

Selain menguji kehadiran error, `assertHasErrors` memungkinkan Anda untuk mempersempit assertion ke aturan tertentu dengan meneruskan aturan untuk assert sebagai argumen kedua ke metode:

```php
public function test_cant_create_post_with_title_shorter_than_3_characters()
{
    Livewire::test(CreatePost::class)
        ->set('title', 'Sa')
        ->set('content', 'Sample content...')
        ->call('save')
        ->assertHasErrors(['title' => ['min:3']]);
}
```

Anda juga dapat mengassert kehadiran error validasi untuk beberapa properti pada saat yang sama:

```php
public function test_cant_create_post_without_title_and_content()
{
    Livewire::test(CreatePost::class)
        ->call('save')
        ->assertHasErrors(['title', 'content']);
}
```

Untuk informasi lebih lanjut tentang utilitas pengujian lain yang disediakan oleh Livewire, lihat [dokumentasi pengujian](/docs/testing).

## Atribut `[#Rule]` yang tidak digunakan lagi

Ketika Livewire v3 pertama kali diluncurkan, ia menggunakan istilah "Rule" sebagai ganti "Validate" untuk atribut validasinya (`#[Rule]`).

Karena konflik penamaan dengan objek rule Laravel, ini sejak itu diubah menjadi `#[Validate]`. Keduanya didukung di Livewire v3, namun disarankan agar Anda mengubah semua kemunculan `#[Rule]` dengan `#[Validate]` untuk tetap terkini.