# laravel-data-method

Helper for laravel data-method links

## Install

Via npm
```
$ npm install laravel-data-method --save
```

Via bower
```
$ bower install laravel-data-method --save
```

## Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token Important-->
    <meta name="csrf-token" content="FAKETOKEN">

    <title>Laravel Data Method</title>

    <!-- Styles -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" href="node_modules/sweetalert/dist/sweetalert.css">

    <!-- Scripts -->
    <script type="text/javascript" src="node_modules/jquery/dist/jquery.js"></script>
    <script
    type="text/javascript"
    src="node_modules/bootstrap/dist/js/bootstrap.js"></script>
    <script
    type="text/javascript"
    src="node_modules/sweetalert/dist/sweetalert.min.js"></script>
    <script type="text/javascript" src="./dist/data-method.js"></script>

</head>
<body>
    <a
    href="/"
    class="btn btn-primary"
    data-method="POST"
    data-params='{"id": 4}'
    data-confirm="Are you sure?">Submit Me</a>
    <a
    href="/"
    class="btn btn-primary"
    data-method="POST"
    data-confirm="Are you sure?"
    data-title="Please confirm this action"
    data-theme="bootstrap">Submit Me with bootstrap theme</a>
    <a
    href="/"
    class="btn btn-primary"
    data-method="POST"
    data-confirm="Are you sure?"
    data-title="Please confirm this action"
    data-theme="sweetalert">Submit Me with Sweet Alert theme</a>
</body>
</html>
```

## Development

```
$ git clone https://github.com/brexis/laravel-data-method.git
$ cd laravel-data-method
$ npm install gulp-cli -g
$ npm install
$ gulp
```
