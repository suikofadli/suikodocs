---
sidebar_position: 7
---

# Load When Visible

Inertia mendukung lazy loading data pada scroll menggunakan Intersection Observer API. Komponen `WhenVisible` memuat data ketika elemen menjadi terlihat di viewport.

## Basic usage

Komponen menerima prop `data` yang menentukan prop mana yang akan dimuat dan prop `fallback` untuk status loading.

Vue:
```markup
<WhenVisible data="permissions">
<template #fallback><div>Loading...</div></template>
<div v-for="permission in permissions"><!-- ... --></div>
</WhenVisible>
```

React:
```jsx
<WhenVisible data="permissions" fallback={() => <div>Loading...</div>}>
<PermissionsChildComponent />
</WhenVisible>
```

## Loading multiple props

Sediakan array ke prop `data`:

```jsx
<WhenVisible data={['teams', 'users']} fallback={() => <div>Loading...</div>}>
<ChildComponent />
</WhenVisible>
```

## Loading before visible

Gunakan prop `buffer` untuk mulai memuat sebelum elemen terlihat (dalam piksel):

```jsx
<WhenVisible data="permissions" buffer={500}>
<PermissionsChildComponent />
</WhenVisible>
```

## Custom wrapper

Ubah elemen wrapper dengan prop `as`:

```jsx
<WhenVisible data="products" as="span">
<!-- ... -->
</WhenVisible>
```

## Always trigger

Prop `always` memicu loading data setiap kali elemen menjadi terlihat:

```jsx
<WhenVisible data="products" always>
<!-- ... -->
</WhenVisible>
```