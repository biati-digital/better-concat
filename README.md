# Better Concat

Concatenate multiple files and folders

## Install
```
$ npm install better-concat
```
```
import concat from 'better-concat'
```

## Usage

### The most simple use
```javascript
await concat({
    files: ['file1.js', 'file2.js', ...],
    out: 'out.js',
})
```

### Concat files and folders
You can pass folders in the files array and those folders will be scanned and all the contained files will be merged respecting the order.
```javascript
await concat({
    files: ['file1.js', 'folder1', 'folder2', 'file2.js', ...],
    out: 'out.js',
})
```

### Exclude certain files
If you pass folders in the files list you can use the exclude option to decide wich files are excluded.
Exclude can be an array of the files to ignore or a function

```javascript
// List example
await concat({
    files: ['file1.js', 'folder1', 'folder2', 'file2.js', ...],
    exclude: ['package.json'],
    out: 'out.js',
})

// Function example
await concat({
    files: ['file1.js', 'folder1', 'folder2', 'file2.js', ...],
    exclude: (file, path) => {
        if (file == 'package.json') {
            return true; //exclude this file
        }
        return false;
    },
    out: 'out.js',
})
```

### Manipulate individual files strings before merge
You can manipulate individual file strings before the string is merged
```javascript
await concat({
    files: ['file1.js', 'folder1', 'folder2', 'file2.js', ...],
    fileStr: (str, path) => {
        if (path.endsWith('package.json')) {
            return str.replace('word', '');
        }
        return str;
    },
    out: 'out.js',
})
```


### Manipulate the complete merged string before it's saved
You can manipulate the merged string with a function.
```javascript
await concat({
    files: ['file1.js', 'folder1', 'folder2', 'file2.js', ...],
    outStr: (str) => {
        return str.replace('word', '');
    },
    out: 'out.js',
})
```

### Prepend and append to the output string
You can prepend or append anything to the merged string
```javascript
await concat({
    files: ['file1.js', 'folder1', 'folder2', 'file2.js', ...],
    prepend: '(function () {\n"use strict";\n\n',
    append: '})();',
    out: 'out.js',
})
```

### Return the merged string
Instead of saving the merged string in a file you can save it in a variable and do whatever you want
```javascript
const concateStr = await concat({
    files: ['file1.js', 'folder1', 'folder2', 'file2.js', ...],
    out: false,
})
```

### All available options
```javascript
const concateStr = await concat({
    files: ['file1.js', 'folder1', ...],
    out: 'path to save the merged file or false',
    exclude: 'list of files to exclude or function',
    invisibles: 'include invisible files if passed folders in files list (false by default)',
    outStr: 'function to manipulate the string before it\'s saved or returned',
    fileStr: 'function to manipulate the string of individual files',
    prepend: 'prepend string to the merged file',
    append: 'append string to the merged file',
    delimiter: 'delimiter used to merge the files, default is \n leave empty to remove all line breaks'
})
```

## If you like this

:star: this repo

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019 biati digital
