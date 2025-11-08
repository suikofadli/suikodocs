---
title: Authorization
---

# Authorization

Saat menggunakan Inertia, otorisasi paling baik ditangani di sisi server dalam kebijakan otorisasi aplikasi Anda. Namun, Anda mungkin bertanya-tanya bagaimana melakukan pemeriksaan terhadap kebijakan otorisasi Anda dari dalam komponen halaman Inertia Anda karena Anda tidak akan memiliki akses ke helper sisi server dari framework Anda.

Pendekatan termudah untuk menyelesaikan masalah ini adalah dengan meneruskan hasil pemeriksaan otorisasi Anda sebagai props ke komponen halaman Anda.

Laravel:

```php
class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'can' => [
                'create_user' => Auth::user()->can('create', User::class),
            ],
            'users' => User::all()->map(function ($user) {
                return [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'can' => [
                        'edit_user' => Auth::user()->can('edit', $user),
                    ]
                ];
            }),
        ]);
    }
}
```