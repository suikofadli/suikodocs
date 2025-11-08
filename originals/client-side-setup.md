# Client-side setup

Once you have your [server-side framework configured](/server-side-setup), you then need to setup your client-side framework. Inertia currently provides support for React, Vue, and Svelte.

## Laravel starter kits

Laravel's [starter kits](https://laravel.com/starter-kits) provide out-of-the-box scaffolding for new Inertia applications. These starter kits are the absolute fastest way to start building a new Inertia project using Laravel and Vue or React. However, if you would like to manually install Inertia into your application, please consult the documentation below.

## Install dependencies

First, install the Inertia client-side adapter corresponding to your framework of choice.

Vue:

```bash
npm install @inertiajs/vue3
```

React:

```bash
npm install @inertiajs/react
```

Svelte:

```bash
npm install @inertiajs/svelte
```

## Initialize the Inertia app

Next, update your main JavaScript file to boot your Inertia app. To accomplish this, we'll initialize the client-side framework with the base Inertia component.

Vue:

```js
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
createInertiaApp({
resolve: name => {
const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
return pages[\`./Pages/\${name}.vue\`]
},
setup({ el, App, props, plugin }) {
createApp({ render: () => h(App, props) })
.use(plugin)
.mount(el)
},
})
```

React:

```jsx
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
createInertiaApp({
resolve: name => {
const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
return pages[\`./Pages/\${name}.jsx\`]
},
setup({ el, App, props }) {
createRoot(el).render(<App {...props} />)
},
})
```

Svelte 4:

```js
import { createInertiaApp } from '@inertiajs/svelte'
createInertiaApp({
resolve: name => {
const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
return pages[\`./Pages/\${name}.svelte\`]
},
setup({ el, App, props }) {
new App({ target: el, props })
},
})
```

Svelte 5:

```js
import { createInertiaApp } from '@inertiajs/svelte'
import { mount } from 'svelte'
createInertiaApp({
resolve: name => {
const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
return pages[\`./Pages/\${name}.svelte\`]
},
setup({ el, App, props }) {
mount(App, { target: el, props })
},
})
```

The `setup` callback receives everything necessary to initialize the client-side framework, including the root Inertia `App` component.

## Configuring defaults

You may pass a `defaults` object to `createInertiaApp()` to configure default settings for various features. You don't have to pass all keys, just the ones you want to tweak.

```js
createInertiaApp({
// ...
defaults: {
form: {
recentlySuccessfulDuration: 5000,
},
prefetch: {
cacheFor: '1m',
hoverDelay: 150,
},
visitOptions: (href, options) => {
return {
headers: {
...options.headers,
'X-Custom-Header': 'value',
},
}
},
},
})
```

The `visitOptions` callback receives the target URL and the current visit options, and should return an object with any options you want to override. For more details on the available configuration options, see the [forms](/forms#form-errors), [prefetching](/prefetching), and [manual visits](/manual-visits#global-visit-options) documentation.

### Updating at runtime

You may also update configuration values at runtime using the exported `config` instance. This is particularly useful when you need to adjust settings based on user preferences or application state.

Vue:

```js
import { config } from '@inertiajs/vue3'
// Set a single value using dot notation...
config.set('form.recentlySuccessfulDuration', 1000)
config.set('prefetch.cacheFor', '5m')
// Set multiple values at once...
config.set({
'form.recentlySuccessfulDuration': 1000,
'prefetch.cacheFor': '5m',
})
```

React:

```js
import { config } from '@inertiajs/react'
// Set a single value using dot notation...
config.set('form.recentlySuccessfulDuration', 1000)
config.set('prefetch.cacheFor', '5m')
// Set multiple values at once...
config.set({
'form.recentlySuccessfulDuration': 1000,
'prefetch.cacheFor': '5m',
})
// Get a configuration value...
const duration = config.get('form.recentlySuccessfulDuration')
```

Svelte:

```js
import { config } from '@inertiajs/svelte'
// Set a single value using dot notation...
config.set('form.recentlySuccessfulDuration', 1000)
config.set('prefetch.cacheFor', '5m')
// Set multiple values at once...
config.set({
'form.recentlySuccessfulDuration': 1000,
'prefetch.cacheFor': '5m',
})
// Get a configuration value...
const duration = config.get('form.recentlySuccessfulDuration')
```

## Resolving components

The `resolve` callback tells Inertia how to load a page component. It receives a page name (string), and returns a page component module. How you implement this callback depends on which bundler (Vite or Webpack) you're using.

Vue:

```js
// Vite
resolve: name => {
const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
return pages[\`./Pages/\${name}.vue\`]
},
// Webpack
resolve: name => require(\`./Pages/\${name}\`),
```

React:

```js
// Vite
resolve: name => {
const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
return pages[\`./Pages/\${name}.jsx\`]
},
// Webpack
resolve: name => require(\`./Pages/\${name}\`),
```

Svelte:

```js
// Vite
resolve: name => {
const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
return pages[\`./Pages/\${name}.svelte\`]
},
// Webpack
resolve: name => require(\`./Pages/\${name}.svelte\`),
```

By default we recommend eager loading your components, which will result in a single JavaScript bundle. However, if you'd like to lazy-load your components, see our [code splitting](/code-splitting) documentation.

## Defining a root element

By default, Inertia assumes that your application's root template has a root element with an `id` of `app`. If your application's root element has a different `id`, you can provide it using the `id` property.

```js
createInertiaApp({
id: 'my-app',
// ...
})
```

If you change the `id` of the root element, be sure to update it [server-side](/server-side-setup#root-template) as well.