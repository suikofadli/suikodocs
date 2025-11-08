---
sidebar_position: 2
---

# Responses

## Membuat responses

Membuat response Inertia sangat sederhana. Untuk memulai, panggil method `Inertia::render()` dalam controller atau route Anda, dengan memberikan nama [komponen halaman JavaScript](/pages) yang ingin Anda render, serta properti (data) apa pun untuk halaman tersebut.

Dalam contoh di bawah, kita akan mengirimkan satu properti (`event`) yang berisi empat atribut (`id`, `title`, `start_date`, dan `description`) ke komponen halaman `Event/Show`.

Laravel:

```php
use Inertia\Inertia;

class EventsController extends Controller
{
    public function show(Event $event)
    {
        return Inertia::render('Event/Show', [
            'event' => $event->only(
                'id',
                'title',
                'start_date',
                'description'
            ),
        ]);

        // Alternatifnya, Anda dapat menggunakan helper inertia()...
        return inertia('Event/Show', [
            'event' => $event->only(
                'id',
                'title',
                'start_date',
                'description'
            ),
        ]);
    }
}
```

Untuk memastikan halaman dimuat dengan cepat, hanya kembalikan data minimum yang diperlukan untuk halaman tersebut. Juga, waspadalah bahwa semua data yang dikembalikan dari controller akan terlihat di sisi klien, jadi pastikan untuk menghilangkan informasi sensitif.

## Properti

Untuk meneruskan data dari server ke komponen halaman Anda, Anda dapat menggunakan properti. Anda dapat meneruskan berbagai jenis nilai sebagai props, termasuk tipe primitif, array, objek, dan beberapa tipe Laravel spesifik yang secara otomatis di-resolve:

Laravel:

```php
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

Inertia::render('Dashboard', [
    // Nilai primitif
    'title' => 'Dashboard',
    'count' => 42,
    'active' => true,

    // Array dan objek
    'settings' => ['theme' => 'dark', 'notifications' => true],

    // Objek Arrayable (Collections, Models, dll.)
    'user' => auth()->user(), // Eloquent model
    'users' => User::all(), // Eloquent collection

    // API Resources
    'profile' => new UserResource(auth()->user()),

    // Objek Responsable
    'data' => new JsonResponse(['key' => 'value']),

    // Closures
    'timestamp' => fn() => now()->timestamp,
]);
```

Objek Arrayable seperti model Eloquent dan koleksi secara otomatis dikonversi menggunakan method `toArray()` mereka. Objek Responsable seperti API resources dan JSON responses di-resolve melalui method `toResponse()` mereka.

## Interface ProvidesInertiaProperty

Saat meneruskan props ke komponen Anda, Anda mungkin ingin membuat kelas kustom yang dapat mengubah dirinya sendiri menjadi format data yang sesuai. Sementara interface `Arrayable` dari Laravel hanya mengubah objek menjadi array, Inertia menawarkan interface `ProvidesInertiaProperty` yang lebih kuat untuk transformasi yang sadar konteks.

Interface ini memerlukan method `toInertiaProperty` yang menerima objek `PropertyContext` yang berisi kunci properti (`$context->key`), semua props untuk halaman (`$context->props`), dan instance request (`$context->request`).

Laravel:

```php
use Inertia\PropertyContext;
use Inertia\ProvidesInertiaProperty;

class UserAvatar implements ProvidesInertiaProperty
{
    public function __construct(protected User $user, protected int $size = 64) {}

    public function toInertiaProperty(PropertyContext $context): mixed
    {
        return $this->user->avatar
            ? Storage::url($this->user->avatar)
            : "https://ui-avatars.com/api/?name={$this->user->name}&size={$this->size}";
    }
}
```

Setelah didefinisikan, Anda dapat menggunakan kelas ini langsung sebagai nilai prop.

Laravel:

```php
Inertia::render('Profile', [
    'user' => $user,
    'avatar' => new UserAvatar($user, 128),
]);
```

`PropertyContext` memberi Anda akses ke kunci properti, yang memungkinkan pola yang kuat seperti menggabungkan dengan data bersama.

Laravel:

```php
use Inertia\Inertia;
use Inertia\PropertyContext;
use Inertia\ProvidesInertiaProperty;

class MergeWithShared implements ProvidesInertiaProperty
{
    public function __construct(protected array $items = []) {}

    public function toInertiaProperty(PropertyContext $context): mixed
    {
        // Akses kunci properti untuk mendapatkan data bersama
        $shared = Inertia::getShared($context->key, []);

        // Gabungkan dengan item baru
        return array_merge($shared, $this->items);
    }
}

// Penggunaan
Inertia::share('notifications', ['Welcome back!']);

return Inertia::render('Dashboard', [
    'notifications' => new MergeWithShared(['New message received']),
    // Hasil: ['Welcome back!', 'New message received']
]);
```

## Interface ProvidesInertiaProperties

Dalam beberapa situasi, Anda mungkin ingin mengelompokkan props terkait bersama-sama untuk penggunaan kembali di berbagai halaman. Anda dapat melakukan ini dengan mengimplementasikan interface `ProvidesInertiaProperties`.

Interface ini memerlukan method `toInertiaProperties` yang mengembalikan array dari pasangan key-value. Method ini menerima objek `RenderContext` yang berisi nama komponen (`$context->component`) dan instance request (`$context->request`).

Laravel:

```php
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Inertia\RenderContext;
use Inertia\ProvidesInertiaProperties;

class UserPermissions implements ProvidesInertiaProperties
{
    public function __construct(#[CurrentUser] protected User $user) {}

    public function toInertiaProperties(RenderContext $context): array
    {
        return [
            'canEdit' => $this->user->can('edit'),
            'canDelete' => $this->user->can('delete'),
            'canPublish' => $this->user->can('publish'),
            'isAdmin' => $this->user->hasRole('admin'),
        ];
    }
}
```

Anda dapat menggunakan kelas prop ini langsung dalam method `render()` dan `with()`.

Laravel:

```php
public function index(UserPermissions $permissions)
{
    return Inertia::render('UserProfile', $permissions);

    // atau...
    return Inertia::render('UserProfile')->with($permissions);
}
```

Anda juga dapat menggabungkan beberapa kelas prop dengan props lainnya dalam array:

Laravel:

```php
public function index(UserPermissions $permissions)
{
    return Inertia::render('UserProfile', [
        'user' => auth()->user(),
        $permissions,
    ]);

    // atau menggunakan method chaining...
    return Inertia::render('UserProfile')
        ->with('user', auth()->user())
        ->with($permissions);
}
```

## Data template root

Ada situasi di mana Anda mungkin ingin mengakses data prop di template Blade root aplikasi Anda. Misalnya, Anda mungkin ingin menambahkan meta description tag, Twitter card meta tags, atau Facebook Open Graph meta tags. Anda dapat mengakses data ini melalui variabel `$page`.

Laravel:

```markup
<meta name="twitter:title" content="{{ $page['props']['event']->title }}">
```

Terkadang Anda bahkan mungkin ingin menyediakan data ke template root yang tidak akan dikirim ke komponen halaman JavaScript Anda. Ini dapat dilakukan dengan memanggil method `withViewData`.

Laravel:

```php
return Inertia::render('Event', ['event' => $event])
    ->withViewData(['meta' => $event->meta]);
```

Setelah memanggil method `withViewData`, Anda dapat mengakses data yang didefinisikan seperti biasa saat mengakses variabel template Blade.

Laravel:

```markup
<meta name="description" content="{{ $meta }}">
```

## Ukuran response maksimum

Untuk mengaktifkan navigasi history di sisi klien, semua response server Inertia disimpan dalam history state browser. Namun, perlu diingat bahwa beberapa browser memberikan batasan ukuran pada berapa banyak data yang dapat disimpan dalam history state.

Misalnya, [Firefox](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) memiliki batasan ukuran 16 MiB dan melempar error `NS_ERROR_ILLEGAL_VALUE` jika Anda melebihi batasan ini. Biasanya, ini jauh lebih banyak data daripada yang akan Anda butuhkan secara praktis saat membangun aplikasi.