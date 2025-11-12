---
sidebar_position: 11
---

# Testing

## Membuat tes pertama Anda

Dengan menambahkan flag `--test` ke perintah `make:livewire`, Anda dapat menghasilkan file tes bersama dengan komponen:

```shell
php artisan make:livewire create-post --test
```

Selain menghasilkan file komponen itu sendiri, perintah di atas juga akan menghasilkan file tes berikut `tests/Feature/Livewire/CreatePostTest.php`:

Jika Anda ingin membuat tes [Pest PHP](https://pestphp.com/) tes, Anda dapat memberikan opsi `--pest` ke perintah make:livewire:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_renders_successfully()
    {
        Livewire::test(CreatePost::class)
            ->assertStatus(200);
    }
}
```

Tentu saja, Anda selalu dapat membuat file-file ini secara manual atau bahkan menggunakan utilitas pengujian Livewire di dalam tes PHPUnit yang sudah ada di aplikasi Laravel Anda.

Sebelum membaca lebih lanjut, Anda mungkin ingin memfamiliarisikan [fitur pengujian bawaan Laravel](https://laravel.com/docs/testing).

## Menguji halaman yang berisi komponen

Tes Livewire paling sederhana yang dapat Anda tulis adalah menegaskan bahwa endpoint tertentu di aplikasi Anda menyertakan dan berhasil me-render komponen Livewire tertentu.

Livewire menyediakan metode `assertSeeLivewire()` yang dapat digunakan dari tes Laravel apa pun:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_component_exists_on_the_page()
    {
        $this->get('/posts/create')
            ->assertSeeLivewire(CreatePost::class);
    }
}
```

> [!tip] Ini disebut tes asap
> Tes asap adalah tes yang luas yang memastikan tidak ada masalah katalis di aplikasi Anda. Meskipun tampak seperti tes yang tidak layak ditulis, pound for pound, ini adalah beberapa tes paling berharga yang dapat Anda tulis karena memerlukan sangat sedikit pemelihara dan memberikan Anda tingkat kepercaya dasar bahwa aplikasi Anda akan berhasil dirender dengan tidak ada kesalahan besar.

## Menguji tampilan

Livewire menyediakan utilitas sederhana namun kuat untuk mengesistir keberadaan teks dalam output yang di-render komponen: `assertSee()`.

Di bawah ini adalah contoh penggunaan `assertSee()` untuk memastikan semua posting dalam database ditampilkan di halaman:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_displays_posts()
    {
        Post::factory()->make(['title' => 'On bathing well']);
        Post::factory()->make(['title' => 'There\'s no time like bathtime']);

        Livewire::test(ShowPosts::class)
            ->assertSee('On bathing well')
            ->assertSee('There\'s no time like bathtime');
    }
}
```

### Mengesahkan data dari tampilan

Selain mengesahkan output dari tampilan yang di-render, terkadang membantu untuk menguji data yang diteruskan ke tampilan.

Berikut adalah tes yang sama seperti di atas, tetapi menguji data tampilan daripada dari `mount()` metode:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_displays_all_posts()
    {
        Post::factory()->make(['title' => 'On bathing well']);
        Post::factory()->make(['title' => 'The bathtub is my sanctuary']);

        Livewire::test(ShowPosts::class)
            ->assertViewHas('posts', function ($posts) {
                return count($posts) == 2;
            });
    }
}
```

Seperti yang Anda lihat, `assertViewHas()` memberikan kontrol atas assersi apa pun yang Anda buat terhadap data yang ditentukan.

Jika Anda lebih suka membuat assersi sederhana, seperti memastikan bahwa sepotongan data tampilan cocok dengan nilai tertentu, Anda dapat meneruskan nilai secara langsung sebagai argumen kedua yang diberikan ke metode `assertViewHas()`:

```php
$this->assertViewHas('postCount', 3)
```

## Mengatur pengguna yang diautentukan

Sebagian besar aplikasi web memerlukan pengguna untuk login sebelum menggunakannya. Alih-alih mengautentikasi pengguna palsu di awal tes Anda, Livewire menyediakan metode `actingAs()`.

Di bawah ini adalah contoh tes di mana beberapa pengguna memiliki posting, namun pengguna yang diautentukan hanya dapat melihat posting mereka sendiri:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\User;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_user_only_sees_their_own_posts()
    {
        $user = User::factory()
            ->has(Post::factory()->count(3))
            ->create();

        $stranger = User::factory()
            ->has(Post::factory()->count(2))
            ->create();

        Livewire::actingAs($user)
            ->test(ShowPosts::class)
            ->assertViewHas('posts', function ($posts) {
                return count($posts) == 3;
            });
    }
}
```

## Menguji properti

Livewire juga menyediakan utilitas pengujian yang berguna untuk mengatur dan mengasertikan properti dalam komponen Anda.

Properti komponen biasanya diperbarui dalam aplikasi saat pengguna berinteraksi dengan input form yang berisi `wire:model`. Tapi, karena tes tidak biasanya mengetik ke browser aktual, Livewire memungkinkan Anda untuk mengatur properti langsung menggunakan metode `set()`.

Di bawah ini adalah contoh penggunaan `set()` untuk memperbarui properti `$title` dari komponen `CreatePost`:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_can_set_title()
    {
        Livewire::test(CreatePost::class)
            ->set('title', 'Confessions of a serial soaker')
            ->assertSet('title', 'Confessions of a serial soaker');
    }
}
```

### Menginisialisasi properti

Sering kali, komponen Livewire menerima data yang diteruskan dari komponen induk atau parameter rute. Karena komponen Livewire diuji secara terisolasi, Anda dapat secara manual meneruskan data ke dalamnya menggunakan parameter kedua dari metode `Livewire::test()`:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\UpdatePost;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class UpdatePostTest extends TestCase
{
    public function test_title_field_is_populated()
    {
        $post = Post::factory()->make([
            'title' => 'Top ten bath bombs',
        ]);

        Livewire::test(UpdatePost::class, ['post' => $post])
            ->assertSet('title', 'Top ten bath bombs');
    }
}
```

Komponen yang sedang diuji (`UpdatePost`) akan menerima `$post` melalui metode `mount()`-nya. Mari kita lihat sumber untuk `UpdatePost` untuk melihat gambar yang lebih jelas tentang fitur ini:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
	public Post $post;

    public $title = '';

    public function mount(Post $post)
    {
		$this->post = $post;
		$this->title = $post->title;
	// ...
    }
}
```

### Mengatur parameter URL

Jika komponen Livewire Anda bergantung pada parameter kueri tertentu di URL halaman tempatnya dimuat, Anda dapat menggunakan metode `withQueryParams()` untuk mengatur parameter kueri secara manual untuk tes Anda.

Di bawah ini adalah komponen `SearchPosts` dasar yang menggunakan [fitur URL Livewire](https://laravel.com/docs/url) untuk menyimpan dan melacak kueri pencarian saat ini dalam string kueri:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Url;
use App\Models\Post;

class SearchPosts extends Component
{
    #[Url] // [tl! highlight]
    public $search = '';

    public function render()
    {
        return view('livewire.search-posts', [
            'posts' => Post::search($this->search)->get(),
        ]);
    }
}
```

Seperti yang Anda lihat, properti `$search` di atas menggunakan atribut `#[Url]` untuk menandakan bahwa nilainya harus disimpan di URL.

Di bawah ini adalah contoh bagaimana Anda mensimulasikan skenario memuat halaman ini dengan parameter kueri spesifik:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\SearchPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class SearchPostsTest extends TestCase
{
    public function test_can_search_posts_via_url_query_string()
    {
        Post::factory()->create(['title' => 'Testing the first water-proof hair dryer']);
        Post::factory()->create(['title' => 'Rubber duckies that actually float']);

        Livewire::withQueryParams(['search' => 'hair'])
            ->test(SearchPosts::class)
            ->assertSee('Testing the first')
            ->assertDontSee('Rubber duckies');
    }
}
```

### Mengatur cookies

Jika komponen Livewire Anda bergantung pada cookies, Anda dapat menggunakan metode `withCookie()` atau `withCookies()` untuk mengatur cookies secara manual untuk tes Anda.

Di bawah ini adalah komponen `Cart` dasar yang memuat token diskon dari cookie pada mount:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Url;
use App\Models\Post;

class Cart extends Component
{
    public $discountToken;

    public function mount()
    {
        $this->discountToken = request()->cookie('discountToken');
    }
}
```

Seperti yang Anda lihat, properti `$discountToken` di atas mendapatkan nilainnya dari cookie di permintaan.

Di bawah ini adalah contoh bagaimana Anda mensimulasikan skenario membuat halaman ini dengan cookies:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\Cart;
use Livewire\Livewire;
use Tests\TestCase;

class CartTest extends TestCase
{
    public function test_can_load_discount_token_from_a_cookie()
    {
        Livewire::withCookies(['discountToken' => 'CALEB2023'])
            ->test(Cart::class)
            ->assertSet('discountToken', 'CALEB2023');
    }
}
```

## Memanggil aksi

Aksi Livewire biasanya dipanggil dari frontend menggunakan sesuatu seperti `wire:click`. Karena tes komponen Livewire tidak menggunakan browser aktual, Anda sebagai gantinya dapat memicu aksi dalam tes Anda menggunakan metode `call()`.

Di bawah ini adalah contoh komponen `CreatePost` menggunakan metode `call()` untuk memicu aksi `save()`:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_can_create_post()
    {
        $this->assertEquals(0, Post::count());

        Livewire::test(CreatePost::class)
            ->set('title', 'Wrinkly fingers? Try this one weird trick')
            ->set('content', '...')
            ->call('save');

        $this->assertEquals(1, Post::count());
    }
}
```

Pada tes di atas, kami menyatakan bahwa memanggil `save()` membuat posting baru di database.

Anda juga dapat meneruskan parameter ke aksi dengan meneruskan parameter tambahan ke metode `call()`:

```php
->call('deletePost', $postId);
```

### Validasi

Untuk menguji bahwa error validasi telah dilempar, Anda dapat menggunakan metode `assertHasErrors()`:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_title_field_is_required()
    {
        Livewire::test(CreatePost::class)
            ->set('title', '')
            ->call('save')
            ->assertHasErrors('title');
    }
}
```

Jika Anda ingin menguji bahwa aturan validasi tertentu telah gagal, Anda dapat meneruskan array aturan:

```php
$this->assertHasErrors(['title' => ['required']]);
```

Atau jika Anda lebih suka menguji pesan validasi ada, Anda dapat melakukannya seperti ini:

```php
$this->assertHasErrors(['title' => ['The title field is required.']);
```

### Otorisasi

Mengotorisasi aksi yang mengandalkan input yang tidak tepercaya di komponen Livewire adalah [esensial](/docs/properties#authorizing-the-input). Livewire menyediakan metode `assertUnauthorized()` dan `assertForbidden()` untuk memastikan bahwa pemeriksaan atau otorisasi telah gagal:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\UpdatePost;
use Livewire\Livewire;
use App\Models\User;
use App\Models\Post;
use Tests\TestCase;

class UpdatePostTest extends TestCase
{
    public function test_cant_update_another_users_post()
    {
        $user = User::factory()->create();
        $stranger = User::factory()->create();

        $post = Post::factory()->for($stranger)->create();

        Livewire::actingAs($user)
            ->test(UpdatePost::class, ['post' => $post])
            ->set('title', 'Living the lavender life')
            ->call('save')
            ->assertUnauthorized();

        Livewire::actingAs($user)
            ->test(UpdatePost::class, ['post' => $post])
            ->set('title', 'Living the lavender life')
            ->call('save')
            ->assertForbidden();
    }
}
```

Jika Anda lebih suka, Anda juga dapat menguji untuk kode status eksplisit yang aksi di komponen Anda mungkin telah memicu respons menggunakan `assertStatus()`:

```php
->assertStatus(401); // Unauthorized
->assertStatus(403); // Forbidden
```

### Redirect

Anda dapat menguji bahwa aksi Livewire melakukan redirect menggunakan metode `assertRedirect()`:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_redirected_to_all_posts_after_creating_a_post()
    {
        Livewire::test(CreatePost::class)
            ->set('title', 'Using a loofah doesn\'t make you aloof...ugh')
            ->set('content', '...')
            ->call('save')
            ->assertRedirect('/posts');
    }
}
```

Sebagai tambahan kenyamanan, Anda dapat menguji bahwa pengguna dialihkan ke komponen halaman tertentu sebagai ganti URL yang dikode keras:

```php
->assertRedirect(CreatePost::class);
```

### Events

Untuk menguji bahwa event telah dikirim dari dalam komponen Anda, Anda dapat menggunakan metode `->assertDispatched()`:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_creating_a_post_dispatches_event()
    {
        Livewire::test(CreatePost::class)
            ->set('title', 'Top 100 bubble bath brands')
            ->set('content', '...')
            ->call('save')
            ->assertDispatched('post-created');
    }
}
```

Sering kali membantu untuk menguji bahwa dua komponen dapat berkomunikasi satu sama lain dengan mengirim dan mendengarkan events. Menggunakan metode `dispatch()`, mari kita simulasi komponen `CreatePost` yang mengirimkan event `create-post`. Kemudian, kita akan menyatakan bahwa komponen `PostCountBadge`, yang mendengarkan event itu, memperbarui hitungan posting dengan tepat:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\PostCountBadge;
use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class PostCountBadgeTest extends TestCase
{
    public function test_post_count_is_updated_when_event_is_dispatched()
    {
        $badge = Livewire::test(PostCountBadge::class)
            ->assertSee("0");

        Livewire::test(CreatePost::class)
            ->set('title', 'Tear-free: the greatest lie ever told')
            ->set('content', '...')
            ->call('save')
            ->assertDispatched('post-created');

        $badge->dispatch('post-created')
            ->assertSee("1");
    }
}
```

Terkadang membantu untuk menguji bahwa event telah dikirim dengan satu atau lebih parameter. Mari kita lihat komponen `ShowPosts` yang mengirimkan event bernama `banner-message` dengan parameter yang disebut `message`:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_notification_is_dispatched_when_deleting_a_post()
    {
        Livewire::test(ShowPosts::class)
            ->call('delete', postId: 3)
            ->assertDispatched('notify',
                message: 'The post was deleted',
            );
    }
}
```

Jika komponen Anda mengirimkan event yang nilai parameter harus diasumsikan secara bersyarat, Anda dapat meneruskan closure sebagai argumen kedua ke metode `assertDispatched` seperti di bawah. Ini menerima nama event sebagai argumen pertama, dan array yang berisi parameter sebagai argumen kedua. Pastikan closure mengembalikan boolean.

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_notification_is_dispatched_when_deleting_a_post()
    {
        Livewire::test(ShowPosts::class)
            ->call('delete', postId: 3)
            ->assertDispatched('notify', function($eventName, $params) {
                return ($params['message'] ?? '') === 'The post was deleted';
            });
    }
}
```

## Semua utilitas pengujian yang tersedia

Livewire menyediakan lebih banyak utilitas pengujian. Di bawah ini adalah daftar lengkap setiap metode pengujian yang tersedia untuk Anda, dengan deskripsi singkat tentang bagaimana penggunaannya:

### Metode pengaturan
| Method                                                  | Description                                                                                                      |
|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `Livewire::test(CreatePost::class)`                      | Test the `CreatePost` component |
| `Livewire::test(UpdatePost::class, ['post' => $post])`                      | Test the `UpdatePost` component with the `post` parameter (To be received through the `mount()` method) |
| `Livewire::actingAs($user)`                      | Set the provided user as the session's authenticated user |
| `Livewire::withQueryParams(['search' => '...'])`                      | Set the test's `search` URL query parameter to the provided value (ex. `?search=...`). Typically in the context of a property using Livewire's [`#[Url]` attribute](/docs/url) |
| `Livewire::withCookie('color', 'blue')`                      | Set the test's `color` cookie to the provided value (`blue`). |
| `Livewire::withCookies(['color' => 'blue', 'name' => 'Taylor'])`                      | Set the test's `color` and `name` cookies to the provided values (`blue`, `Taylor`). |
| `Livewire::withHeaders(['X-COLOR' => 'blue', 'X-NAME' => 'Taylor'])`                      | Set the test's `X-COLOR` and `X-NAME` headers to the provided values (`blue`, `Taylor`). |
| `Livewire::withoutLazyLoading()`                      | Disable lazy loading in this and all child components under test. |

### Berinteraksi dengan komponen
| Method                                                  | Description                                                                                                      |
|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `set('title', '...')`                      | Set the `title` property to the provided value |
| `set(['title' => ' ... '])`                      | Set multiple component properties using an associative array |
| `toggle('sortAsc')`                      | Toggle the `sortAsc` property between `true` and `false`  |
| `call('save')`                      | Call the `save` action / method |
| `call('remove', $post->id)`                      | Call the `remove` method and pass the `$post->id` as the first parameter (Accepts subsequent parameters as well) |
| `refresh()`                      | Trigger a component re-render |
| `dispatch('post-created')`                      | Dispatch the `post-created` event from the component |
| `dispatch('post-created', postId: $post->id)`                      | Dispatch the `post-created` event with `$post->id` as an additional parameter (`$event.detail` from Alpine) |

### Asersi
| Method                                                | Description                                                                                                                                                                          |
|-------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `assertSet('title', '...')`                           | Assert that the `title` property is set to the provided value                                                                                                                        |
| `assertNotSet('title', '...')`                        | Assert that the `title` property is not set to the provided value                                                                                                                    |
| `assertSetStrict('title', '...')`                     | Assert that the `title` property is set to the provided value using a strict comparison                                                                                                                        |
| `assertNotSetStrict('title', '...')`                  | Assert that `date`'s raw / dehydrated value is not equal to the provided value                                                                                                       |
| `assertReturned('...')`                               | Assert that the previous `->call(...)` returned a given value
| `assertCount('posts', 3)`                             | Assert that the `posts` property is an array-like value with `3` items in it                                                                                                         |
| `assertSnapshotSet('date', '08/26/1990')`             | Assert that the `date` property's raw / dehydrated value (from JSON) is set to `08/26/1990`. Alternative to asserting the hydrated `DateTime` instance in the case of `date` |
| `assertSnapshotNotSet('date', '08/26/1990')`          | Assert that `date`'s raw / dehydrated value is not equal to the provided value                                                                                                       |
| `assertSee($post->title)`                             | Assert that the rendered HTML of the component contains the provided value                                                                                                           |
| `assertDontSee($post->title)`                         | Assert that the rendered HTML does not contain the provided value                                                                                                                    |
| `assertSeeHtml('<div>...</div>')`                     | Assert the provided string literal is contained in the rendered HTML without escaping the HTML characters (unlike `assertSee`, which does escape the characters by default)                                                    |
| `assertDontSeeHtml('<div>...</div>')`                 | Assert that the provided string is contained in the rendered HTML                                                                                                                         |
| `assertSeeText($post->title)`                         | Assert that the provided string is contained within the rendered HTML text. The rendered content will be passed to the `strip_tags` PHP function before the assertion is made                                                          |
| `assertDontSeeText($post->title)`                     | Assert that the provided string is not contained within the rendered HTML text. The rendered content will be passed to the `strip_tags` PHP function before the assertion is made                                                          |
| `assertSeeInOrder(['...', '...'])`                    | Assert that the provided strings appear in order in the rendered HTML output of the component                                                                                        |
| `assertSeeHtmlInOrder([$firstString, $secondString])` | Assert that the HTML strings appear in order in the rendered output of the component                                                                                        |
| `assertDispatched('post-created')`                    | Assert that the given event has been dispatched by the component                                                                                                                     |
| `assertNotDispatched('post-created')`                 | Assert that the given event has not been dispatched by the component                                                                                                                 |
| `assertHasErrors('title')`                            | Assert that validation has failed for the `title` property                                                                                                                           |
| `assertHasErrors(['title' => ['required', 'min:6']])`   | Assert that the provided validation rules have failed for the `title` property                                                                                                            |
| `assertHasNoErrors('title')`                          | Assert that there are no validation errors for the `title` property                                                                                                                  |
| `assertHasNoErrors(['title' => ['required', 'min:6']]) | Assert that the provided validation rules haven't failed for the `title` property                                    |
| `assertRedirect()`                                    | Assert that a redirect has been triggered from within the component                                                                                                                  |
| `assertRedirect('/posts')`                            | Assert the component triggered a redirect to the `/posts` endpoint                                                                                                                   |
| `assertRedirect(ShowPosts::class)`                    | Assert that the component triggered a redirect to the `ShowPosts` component                                                                                                          |
| `assertNoRedirect()`                                  | Assert that no redirect has been triggered                                                                                                                                           |
| `assertViewHas('posts')`                              | Assert that the `render()` method has passed a `posts` item to the view                                                                                                         |
| `assertViewHas('postCount', 3)`                       | Assert that a `postCount` variable has been passed to the view with a value of `3`                                                                                                   |
| `assertViewHas('posts', function ($posts) { ... })`   | Assert that `posts` view data exists and that it passes any assertions declared in the provided callback                                                                         |
| `assertViewIs('livewire.show-posts')`                 | Assert that the component's render method returned the provided view name                                                                                                            |
| `assertFileDownloaded()`                              | Assert that a file download has been triggered                                                                                                                                       |
| `assertFileDownloaded($filename)`                     | Assert that a file download matching the provided file name has been triggered                                                                                                       |
| `assertNoFileDownloaded()`                            | Assert that no file download has been triggered                                                                                                                                       |
| `assertUnauthorized()`                                | Assert that an authorization exception has been thrown within the component (status code: 401)                                                                                       |
| `assertForbidden()`                                   | Assert that an error response was triggered with the status code: 403                                                                                                                |
| `assertStatus(500)`                                   | Assert that the latest response matches the provided status code                                                                                                                     |
| `assertRedirectToRoute('name', ['parameters'])       | Assert that the component triggered a redirect to the given route                                                                                                                    |
| `assertNoRedirect()`                                  | Assert that no redirect has been triggered                                                                           |

---

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>