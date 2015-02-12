MProgress.js
============

Google Material Design Progress Linear bar.

It uses CSS3 and vanilla JavaScript which doesn't depend on any other libraries.

## Types and preview

Type 1. `Determinate`

<img src="https://raw.githubusercontent.com/lightningtgc/MProgress.js/gh-pages/styles/images/determinate.gif" />

Type 2. `Buffer`

<img src="https://raw.githubusercontent.com/lightningtgc/MProgress.js/gh-pages/styles/images/buffer.gif" />

Type 3. `Indeterminate`

<img src="https://raw.githubusercontent.com/lightningtgc/MProgress.js/gh-pages/styles/images/indeterminate.gif" />

Type 4. `Query Indeterminate and  Determinate`

<img src="https://raw.githubusercontent.com/lightningtgc/MProgress.js/gh-pages/styles/images/query.gif" />


Or you can see all types together:

[Vedio：Material Progress & activity](http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0B0NGgBg38lWWYmNmallST001a1k/components-progressactivity-typesofindicators-061101_Linear_Sheet_xhdpi_003.webm)

### DEMO

[See the Online demo](http://lightningtgc.github.io/MProgress.js/)

## How to start

#### Install it

Include `mprogress.min.js` and `mprogress.min.css` in your target html file.

```html
<link rel='stylesheet' href='mprogress.min.css'/>

<script src='mprogress.min.js'></script>
```

You can also install it via [Bower](https://github.com/bower/bower) or [npm](https://www.npmjs.com/):

```
bower install --save mprogress
```
```
npm install --save mprogress
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
var mprogress = new Mprogress('start');  //start it immediately
```

3.Finish the loading and hide it :

```js
mprogress.end();
```

## Advanced usage

All types have `start` and `end` methods.

#### Type1: Determinate

`Determinate` also has `set` and `inc` methods.

##### set(n)

Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.

eg:
```js
mprogress.set(0.3);
```

##### inc()

Increases by a random amount.

eg:
```js
mprogress.inc(); // Increase the bar with a random amount.
mprogress.inc(0.3); // This will get the current status value and adds 0.3 until status is 0.994
```


#### Type2: Buffer 

Its always used for video loading, and you can use for other case.

Init Type Buffer :

```js
var bufferIntObj = {
  template: 2
};
var bufferProgress = new Mprogress(bufferIntObj);
```

##### Start it:

```js
bufferProgress.start();
```

If you want to start it immediately after instantiating it，you can use:

```js
var bufferIntObj = {
  template: 2, // type number
  start: true  // start it now
};
var bufferProgress = new Mprogress(bufferIntObj);
```

##### End it: 

```js
bufferProgress.end();
```

`Buffer` also has `set` , `inc` and `setBuffer` methods

Type `Buffer` has two progress: main progress and buffer progress.

##### `set(n)` 

Sets the main progress bar status (0,1)

##### `setBuffer(num)` 

Sets the buffer progress bar status (0,1)

##### inc()

Increases by a random amount, including buffer bar.

#### Type3:Indeterminate 

Init Type Indeterminate :

```js
var intObj = {
  template: 3, 
  parent: '#customId' // this option will insert bar HTML into this parent Element 
};
var indeterminateProgress = new Mprogress(intObj);
```

Type Indeterminate just has `start` and `end` methods.

```js
indeterminateProgress.start();

indeterminateProgress.end();
```

#### Type4:Query Indeterminate and Determinate 

Init Type Query :

```js
var intObj = {
  template: 4,
  parent: '#anothercustomId' // to other position
};
var queryProgress = new Mprogress(intObj);
```

Type Query just has `start` and `end` methods.

```js
queryProgress.start();

queryProgress.end();
```

## Configuration

Passing an object(configuration) to instantiated Mprogress

```js
var mp = new Mprogress(configuration);
```

`template`

Set the progress bar type. (default: 1)

```js
var mp = new Mprogress({
  // vaule { 
  //    1: Type Determinate,
  //    2: Buffer,
  //    3: Indeterminate, 
  //    4: Query,
  //  '<div>...</div>': 'yourcustomHTML'
  // }
  template: 2 
});
```

`parent`

Change the parent container where the bar is shown. (default: body)

```js
var mp = new Mprogress({
  parent: '#customContainer' 
});
```

`start`

Start the bar immediately. (default: false)

```js
var mp = new Mprogress({
  template: 4,
  start: true
});
```

For type1 Determinate, you can just use:

```js
var mp = new Mprogress('start');
```

## Advanced Configuration

`trickle`

`trickleRate`

`trickleSpeed`

`minimum`

`easing`

`positionUsing`

`speed`

## Browser Support

Mobile First.

All types work in Chrome and Firefox.

Type Determinate works in all browsers.


## License

[MIT](http://opensource.org/licenses/mit-license.php)  © [gctang](https://github.com/lightningtgc)
