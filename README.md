# TADA

Lightweight, no dependency library for lazy image load.

## Features

- Uses IntersectionObserver API
- Duplicate element check
- Debounced event handler
- Percentage threshold

## Usage

Use `data-src` attribute for actual image. This attribute name can be changed by calling `Tada.setup` method.
If that attribute is used in non `<img>` tag, image will be background image.

```html
<img src="placeholder.png" data-src="original.png">

<div data-src="background.png"></div>
```

```javascript
/* CSS selector */
Tada.add('ul img')

/* HTML element */
var img = document.createElement('img')
img.setAttribute('src', 'placeholder.png')
img.setAttribute('data-src', 'original.png')

Tada.add(img)

/* In jQuery */
$.fn.tada = function () {
  return this.each(function () {
    Tada.add(this)
  })
}

$('img').tada()
```

### Settings

If you want to change default settings, call `Tada.setup` method before using `Tada.add`.

```javascript
Tada.setup({
  attribute: 'data-src',
  delay: 50,
  threshold: '20%',
  callback: function (element) {
    console.log(element)
  }
})

Tada.add(element)
```

### Options

name | default | unit | description
---- | ------- | ---- | -----------
attribute | `data-src` | | attribute name for image url
delay | `50` | milliseconds | delay for scroll event activation
threshold | `20%` | % or px. px can be omitted | margin for early loading
callback | `function(element) {}` | | callback after image loaded.

## Browser compatibility

Internet Explorer 9+ and other major browsers are supported.
