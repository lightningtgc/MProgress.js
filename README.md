MProgress.js
============

Google Material Design Progress Linear bar.

It using CSS3 and pure js, and it's not depend on any library.

## Types and preview

Type 1. `Determinate`

<img src="https://raw.githubusercontent.com/lightningtgc/MProgress.js/gh-pages/styles/images/determinate.gif" />

Type 2. `Indeterminate`

<img src="https://raw.githubusercontent.com/lightningtgc/MProgress.js/gh-pages/styles/images/indeterminate.gif" />

Type 3. `Buffer`

<img src="https://raw.githubusercontent.com/lightningtgc/MProgress.js/gh-pages/styles/images/buffer.gif" />

Type 4. `Query Indeterminate and  Determinate`

<img src="https://raw.githubusercontent.com/lightningtgc/MProgress.js/gh-pages/styles/images/query.gif" />


Or you can see all types together:

[Vedio：Material Progress & activity](http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0B0NGgBg38lWWYmNmallST001a1k/components-progressactivity-typesofindicators-061101_Linear_Sheet_xhdpi_003.webm)


## How to start

#### Install it

Including [mprogress.js] and [mprogress.css] into your target html file.

```html
<link rel='stylesheet' href='mprogress.css'/>

<script src='mprogress.js'></script>
```

## Basic usage

Example for the `Determinate` type

1.Instantiation:

```js
var mprogress = new Mprogress();
```

2.Show and start the bar by using:

```js
mprogress.start();
```

Or you can just use `the following code` to replace step 1 and 2:

```js
var mprogress = new Mprogress('start');
```

3.Finish the loading and hide it :

```js
mprogress.end();
```

## Advanced usage





