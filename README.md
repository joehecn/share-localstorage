# share-localstorage

``` html
<head>
  <script src="https://cdn.jsdelivr.net/npm/share-localstorage@1.1.1/dist/main.iife.js"></script>
</head>

<body>
  <script>
    console.log(window.shareLocalstorage)
  </script>
</body>
```

``` js
import shareLocalstorage from 'share-localstorage'

or

const shareLocalstorage = require('share-localstorage')
```

## Promise method
- init([src? string])
- destory()
- getItem(keyName string)
- setItem(keyName string, keyValue string)
- removeItem(keyName string)

``` js
shareLocalstorage.init()
  .then(() => {
    return shareLocalstorage.setItem('test5', 'test5')
  })
  .then(set => {
    console.log({ set })
    return shareLocalstorage.getItem('test5')
  })
  .then(get => {
    console.log({ get })
    return shareLocalstorage.removeItem('test5')
  })
  .then(remove => {
    console.log({ remove })
    return shareLocalstorage.getItem('test5')
  })
  .then(get => {
    console.log({ get })
    return shareLocalstorage.destory()
  })
  .catch(console.error)
```