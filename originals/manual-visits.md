# Manual visits

In addition to [creating links](/links), it's also possible to manually make Inertia visits / requests programmatically via JavaScript. This is accomplished via the `router.visit()` method.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.visit(url, {
method: 'get',
data: {},
replace: false,
preserveState: false,
preserveScroll: false,
only: [],
except: [],
headers: {},
errorBag: null,
forceFormData: false,
queryStringArrayFormat: 'brackets',
async: false,
showProgress: true,
fresh: false,
reset: [],
preserveUrl: false,
prefetch: false,
viewTransition: false,
onCancelToken: cancelToken => {},
onCancel: () => {},
onBefore: visit => {},
onStart: visit => {},
onProgress: progress => {},
onSuccess: page => {},
onError: errors => {},
onFinish: visit => {},
onPrefetching: () => {},
onPrefetched: () => {},
})
```

React:

```js
import { router } from '@inertiajs/react'
router.visit(url, {
method: 'get',
data: {},
replace: false,
preserveState: false,
preserveScroll: false,
only: [],
except: [],
headers: {},
errorBag: null,
forceFormData: false,
queryStringArrayFormat: 'brackets',
async: false,
showProgress: true,
fresh: false,
reset: [],
preserveUrl: false,
prefetch: false,
viewTransition: false,
onCancelToken: cancelToken => {},
onCancel: () => {},
onBefore: visit => {},
onStart: visit => {},
onProgress: progress => {},
onSuccess: page => {},
onError: errors => {},
onFinish: visit => {},
onPrefetching: () => {},
onPrefetched: () => {},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.visit(url, {
method: 'get',
data: {},
replace: false,
preserveState: false,
preserveScroll: false,
only: [],
except: [],
headers: {},
errorBag: null,
forceFormData: false,
queryStringArrayFormat: 'brackets',
async: false,
showProgress: true,
fresh: false,
reset: [],
preserveUrl: false,
prefetch: false,
viewTransition: false,
onCancelToken: cancelToken => {},
onCancel: () => {},
onBefore: visit => {},
onStart: visit => {},
onProgress: progress => {},
onSuccess: page => {},
onError: errors => {},
onFinish: visit => {},
onPrefetching: () => {},
onPrefetched: () => {},
})
```

However, it's generally more convenient to use one of Inertia's shortcut request methods. These methods share all the same options as `router.visit()`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Uses the current URL
```

React:

```js
import { router } from '@inertiajs/react'
router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Uses the current URL
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Uses the current URL
```

The `reload()` method is a convenient, shorthand method that automatically visits the current page with `preserveState` and `preserveScroll` both set to `true`, making it the perfect method to invoke when you just want to reload the current page's data.

## Method

When making manual visits, you may use the `method` option to set the request's HTTP method to `get`, `post`, `put`, `patch` or `delete`. The default method is `get`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.visit(url, { method: 'post' })
```

React:

```js
import { router } from '@inertiajs/react'
router.visit(url, { method: 'post' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.visit(url, { method: 'post' })
```

Uploading files via `put` or `patch` is not supported in Laravel. Instead, make the request via `post`, including a `_method` field set to `put` or `patch`. This is called [form method spoofing](https://laravel.com/docs/routing#form-method-spoofing).

## Wayfinder

<minimumversion version="2.1.2"></minimumversion>When using [Wayfinder](https://github.com/laravel/wayfinder), you can pass the resulting object directly to any router method. The router will infer the HTTP method and URL from the Wayfinder object.

Vue:

```js
import { router } from '@inertiajs/vue3'
import { show } from 'App/Http/Controllers/UserController'
router.visit(show(1))
router.post(store())
router.delete(destroy(1))
```

React:

```js
import { router } from '@inertiajs/react'
import { show } from 'App/Http/Controllers/UserController'
router.visit(show(1))
router.post(store())
router.delete(destroy(1))
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
import { show } from 'App/Http/Controllers/UserController'
router.visit(show(1))
router.post(store())
router.delete(destroy(1))
```

If you provide both a Wayfinder object and specify the `method` option, the `method`option will take precedence.

Vue:

```js
import { router } from '@inertiajs/vue3'
import { update } from 'App/Http/Controllers/UserController'
router.visit(update(1), { method: 'patch' })
```

React:

```js
import { router } from '@inertiajs/react'
import { update } from 'App/Http/Controllers/UserController'
router.visit(update(1), { method: 'patch' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
import { update } from 'App/Http/Controllers/UserController'
router.visit(update(1), { method: 'patch' })
```

## Data

You may use the `data` option to add data to the request.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.visit('/users', {
method: 'post',
data: {
name: 'John Doe',
email: 'john.doe@example.com',
},
})
```

React:

```js
import { router } from '@inertiajs/react'
router.visit('/users', {
method: 'post',
data: {
name: 'John Doe',
email: 'john.doe@example.com',
},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.visit('/users', {
method: 'post',
data: {
name: 'John Doe',
email: 'john.doe@example.com',
},
})
```

For convenience, the `get()`, `post()`, `put()`, and `patch()`methods all accept `data` as their second argument.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post('/users', {
name: 'John Doe',
email: 'john.doe@example.com',
})
```

React:

```js
import { router } from '@inertiajs/react'
router.post('/users', {
name: 'John Doe',
email: 'john.doe@example.com',
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post('/users', {
name: 'John Doe',
email: 'john.doe@example.com',
})
```

## Custom headers

The `headers` option allows you to add custom headers to a request.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post('/users', data, {
headers: {
'Custom-Header': 'value',
},
})
```

React:

```js
import { router } from '@inertiajs/react'
router.post('/users', data, {
headers: {
'Custom-Header': 'value',
},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post('/users', data, {
headers: {
'Custom-Header': 'value',
},
})
```

The headers Inertia uses internally to communicate its state to the server take priority and therefore cannot be overwritten.

## Global visit options

You may configure a `visitOptions` callback when [initializing your Inertia app](/client-side-setup#configuring-defaults) to modify visit options globally for every request. The callback receives the target URL and the current visit options, and should return an object with any options you want to override.

Vue:

```js
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
createInertiaApp({
// ...
defaults: {
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

React:

```jsx
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
createInertiaApp({
// ...
defaults: {
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

Svelte:

```js
import { createInertiaApp } from '@inertiajs/svelte'
createInertiaApp({
// ...
defaults: {
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

## File uploads

When making visits / requests that include files, Inertia will automatically convert the request data into a `FormData` object. If you would like the request to always use a `FormData` object, you may use the `forceFormData` option.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post('/companies', data, {
forceFormData: true,
})
```

React:

```js
import { router } from '@inertiajs/react'
router.post('/companies', data, {
forceFormData: true,
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post('/companies', data, {
forceFormData: true,
})
```

For more information on uploading files, check out the dedicated [file uploads](/file-uploads)documentation.

## Browser history

When making visits, Inertia automatically adds a new entry into the browser history. However, it's also possible to replace the current history entry by setting the `replace` option to `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.get('/users', { search: 'John' }, { replace: true })
```

React:

```js
import { router } from '@inertiajs/react'
router.get('/users', { search: 'John' }, { replace: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.get('/users', { search: 'John' }, { replace: true })
```

Visits made to the same URL automatically set `replace` to `true`.

## Client side visits

You can use the `router.push` and `router.replace` method to make client-side visits. This method is useful when you want to update the browser's history without making a server request.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.push({
url: '/users',
component: 'Users',
props: { search: 'John' },
clearHistory: false,
encryptHistory: false,
preserveScroll: false,
preserveState: false,
errorBag: null,
onSuccess: (page) => {},
onError: (errors) => {},
onFinish: (visit) => {},
})
```

React:

```js
import { router } from '@inertiajs/react'
router.push({
url: '/users',
component: 'Users',
props: { search: 'John' },
clearHistory: false,
encryptHistory: false,
preserveScroll: false,
preserveState: false,
errorBag: null,
onSuccess: (page) => {},
onError: (errors) => {},
onFinish: (visit) => {},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.push({
url: '/users',
component: 'Users',
props: { search: 'John' },
clearHistory: false,
encryptHistory: false,
preserveScroll: false,
preserveState: false,
errorBag: null,
onSuccess: (page) => {},
onError: (errors) => {},
onFinish: (visit) => {},
})
```

All of the parameters are optional. By default, all passed paramaters (except `errorBag`) will be merged with the current page. This means you are responsible for overriding the current page's URL, component, and props.

If you need access to the current page's props, you can pass a function to the props option. This function will receive the current page's props as an argument and should return the new props.

The `errorBag` option allows you to specify which error bag to use when handling validation errors in the `onError` callback.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.push({ url: '/users', component: 'Users' })
router.replace({
props: (currentProps) => ({ ...currentProps, search: 'John' })
})
```

React:

```js
import { router } from '@inertiajs/react'
router.push({ url: '/users', component: 'Users' })
router.replace({
props: (currentProps) => ({ ...currentProps, search: 'John' })
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.push({ url: '/users', component: 'Users' })
router.replace({
props: (currentProps) => ({ ...currentProps, search: 'John' })
})
```

Make sure that any route you push on the client side is also defined on the server side. If the user refreshes the page, the server will need to know how to render the page.

### Prop helpers

Inertia provides three helper methods for updating page props without making server requests. These methods are shortcuts to `router.replace()` and automatically set `preserveScroll` and `preserveState` to `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'
// Replace a prop value...
router.replaceProp('user.name', 'Jane Smith')
// Append to an array prop...
router.appendToProp('messages', { id: 4, text: 'New message' })
// Prepend to an array prop...
router.prependToProp('tags', 'urgent')
```

React:

```js
import { router } from '@inertiajs/react'
// Replace a prop value...
router.replaceProp('user.name', 'Jane Smith')
// Append to an array prop...
router.appendToProp('messages', { id: 4, text: 'New message' })
// Prepend to an array prop...
router.prependToProp('tags', 'urgent')
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
// Replace a prop value...
router.replaceProp('user.name', 'Jane Smith')
// Append to an array prop...
router.appendToProp('messages', { id: 4, text: 'New message' })
// Prepend to an array prop...
router.prependToProp('tags', 'urgent')
```

All three methods support dot notation for nested props and can accept a callback function that receives the current value as the first argument and the current page props as the second argument.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.prependToProp('notifications', (current, props) => {
return {
id: Date.now(),
message: \`Hello \${props.user.name}\
```

React:

```js
import { router } from '@inertiajs/react'
router.prependToProp('notifications', (current, props) => {
return {
id: Date.now(),
message: \`Hello \${props.user.name}\
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.prependToProp('notifications', (current, props) => {
return {
id: Date.now(),
message: \`Hello \${props.user.name}\
```

## State preservation

By default, page visits to the same page create a fresh page component instance. This causes any local state, such as form inputs, scroll positions, and focus states to be lost.

However, in some situations, it's necessary to preserve the page component state. For example, when submitting a form, you need to preserve your form data in the event that form validation fails on the server.

For this reason, the `post`, `put`, `patch`, `delete`, and `reload` methods all set the `preserveState` option to `true` by default.

You can instruct Inertia to preserve the component's state when using the `get` method by setting the `preserveState` option to `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.get('/users', { search: 'John' }, { preserveState: true })
```

React:

```js
import { router } from '@inertiajs/react'
router.get('/users', { search: 'John' }, { preserveState: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.get('/users', { search: 'John' }, { preserveState: true })
```

If you'd like to only preserve state if the response includes validation errors, set the `preserveState` option to "errors".

Vue:

```js
import { router } from '@inertiajs/vue3'
router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

React:

```js
import { router } from '@inertiajs/react'
router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

You can also lazily evaluate the `preserveState` option based on the response by providing a callback.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post('/users', data, {
preserveState: (page) => page.props.someProp === 'value',
})
```

React:

```js
import { router } from '@inertiajs/react'
router.post('/users', data, {
preserveState: (page) => page.props.someProp === 'value',
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post('/users', data, {
preserveState: (page) => page.props.someProp === 'value',
})
```

## Scroll preservation

When navigating between pages, Inertia mimics default browser behavior by automatically resetting the scroll position of the document body (as well as any [scroll regions](/scroll-management#scroll-regions)you've defined) back to the top of the page.

You can disable this behavior by setting the `preserveScroll` option to `true`.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.visit(url, { preserveScroll: true })
```

React:

```js
import { router } from '@inertiajs/react'
router.visit(url, { preserveScroll: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.visit(url, { preserveScroll: true })
```

If you'd like to only preserve the scroll position if the response includes validation errors, set the `preserveScroll` option to "errors".

Vue:

```js
import { router } from '@inertiajs/vue3'
router.visit(url, { preserveScroll: 'errors' })
```

React:

```js
import { router } from '@inertiajs/react'
router.visit(url, { preserveScroll: 'errors' })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.visit(url, { preserveScroll: 'errors' })
```

You can also lazily evaluate the `preserveScroll` option based on the response by providing a callback.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post('/users', data, {
preserveScroll: (page) => page.props.someProp === 'value',
})
```

React:

```js
import { router } from '@inertiajs/react'
router.post('/users', data, {
preserveScroll: (page) => page.props.someProp === 'value',
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post('/users', data, {
preserveScroll: (page) => page.props.someProp === 'value',
})
```

For more information regarding this feature, please consult the [scroll management](/scroll-management) documentation.

## Partial reloads

The `only` option allows you to request a subset of the props (data) from the server on subsequent visits to the same page, thus making your application more efficient since it does not need to retrieve data that the page is not interested in refreshing.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.get('/users', { search: 'John' }, { only: ['users'] })
```

React:

```js
import { router } from '@inertiajs/react'
router.get('/users', { search: 'John' }, { only: ['users'] })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.get('/users', { search: 'John' }, { only: ['users'] })
```

For more information on this feature, please consult the [partial reloads](/partial-reloads)documentation.

## View transitions

You may enable [View transitions](/view-transitions) for a visit by setting the `viewTransition` option to `true`. This will use the browser's View Transitions API to animate the page transition.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.visit('/another-page', { viewTransition: true })
```

React:

```js
import { router } from '@inertiajs/react'
router.visit('/another-page', { viewTransition: true })
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.visit('/another-page', { viewTransition: true })
```

## Visit cancellation

You can cancel a visit using a cancel token, which Inertia automatically generates and provides via the `onCancelToken()` callback prior to making the visit.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post('/users', data, {
onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})
// Cancel the visit...
this.cancelToken.cancel()
```

React:

```js
import { router } from '@inertiajs/react'
router.post('/users', data, {
onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})
// Cancel the visit...
this.cancelToken.cancel()
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post('/users', data, {
onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})
// Cancel the visit...
this.cancelToken.cancel()
```

The `onCancel()` and `onFinish()` event callbacks will be executed when a visit is cancelled.

## Event callbacks

In addition to Inertia's [global events](/events), Inertia also provides a number of per-visit event callbacks.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post('/users', data, {
onBefore: (visit) => {},
onStart: (visit) => {},
onProgress: (progress) => {},
onSuccess: (page) => {},
onError: (errors) => {},
onCancel: () => {},
onFinish: visit => {},
onPrefetching: () => {},
onPrefetched: () => {},
})
```

React:

```js
import { router } from '@inertiajs/react'
router.post('/users', data, {
onBefore: (visit) => {},
onStart: (visit) => {},
onProgress: (progress) => {},
onSuccess: (page) => {},
onError: (errors) => {},
onCancel: () => {},
onFinish: visit => {},
onPrefetching: () => {},
onPrefetched: () => {},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post('/users', data, {
onBefore: (visit) => {},
onStart: (visit) => {},
onProgress: (progress) => {},
onSuccess: (page) => {},
onError: (errors) => {},
onCancel: () => {},
onFinish: visit => {},
onPrefetching: () => {},
onPrefetched: () => {},
})
```

Returning `false` from the `onBefore()` callback will cause the visit to be cancelled.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.delete(\`/users/\${user.id}\
```

React:

```js
import { router } from '@inertiajs/react'
router.delete(\`/users/\${user.id}\
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.delete(\`/users/\${user.id}\
```

It's also possible to return a promise from the `onSuccess()` and `onError()` callbacks. When doing so, the "finish" event will be delayed until the promise has resolved.

Vue:

```js
import { router } from '@inertiajs/vue3'
router.post(url, {
onSuccess: () => {
return Promise.all([
this.firstTask(),
this.secondTask()
])
}
onFinish: visit => {
// Not called until firstTask() and secondTask() have finished
},
})
```

React:

```js
import { router } from '@inertiajs/react'
router.post(url, {
onSuccess: () => {
return Promise.all([
this.firstTask(),
this.secondTask()
])
}
onFinish: visit => {
// Not called until firstTask() and secondTask() have finished
},
})
```

Svelte:

```js
import { router } from '@inertiajs/svelte'
router.post(url, {
onSuccess: () => {
return Promise.all([
this.firstTask(),
this.secondTask()
])
}
onFinish: visit => {
// Not called until firstTask() and secondTask() have finished
},
})
```