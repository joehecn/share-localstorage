# share-localstorage

``` html
<head>
  <script src="https://cdn.jsdelivr.net/npm/share-localstorage@1.0.0"></script>
</head>

<body>
  <script>
    window.shareLocalstorage
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
shareLocalstorage.init().then(() => {
  shareLocalstorage.setItem('test4', 'test4').then(set => {
    console.log({ set })
    shareLocalstorage.getItem('test4').then(get => {
      console.log({ get })
      shareLocalstorage.removeItem('test4').then(remove => console.log({ remove }))
      shareLocalstorage.destory()
    })
  })
})
```