MProgress.js
============

Google Material Design Progress Linear bar.

It using CSS3 and pure js, and it's not depend on any library.

## Types and preview

1. Determinate

2. Indeterminate

3. Buffer

4. Query Indeterminate and  Determinate

Or you can see the video of all types:  [Material Progress & activity](http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0B0NGgBg38lWWYmNmallST001a1k/components-progressactivity-typesofindicators-061101_Linear_Sheet_xhdpi_003.webm)


## How to start

#### Install it

Including [mprogress.js] and [mprogress.css] into your target html file.

```html
<link rel='stylesheet' href='mprogress.css'/>

<script src='mprogress.js'></script>
```

## Basic usage

Example for the type one `Determinate`

1. Instantiation:

```js
var mprogress = new Mprogress();
```

2. Show and start the bar by using:

```js
mprogress.start();
```

Or you can just use `the following code` to replace step 1 and 2:

```js
var mprogress = new Mprogress('start');
```

3. Finish the loading and hide it :

```js
mprogress.end();
```

## Advanced usage





