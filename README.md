# useOpenDynamicLink

##  Installation

```bash
npm install @tinyhref/use-open-dynamic-link
or
yarn add @tinyhref/use-open-dynamic-link
```

## Use It

```js
import React from 'react';
import { useOpenDynamicLink } from '@tinyhref/use-open-dynamic-link';

const { openDynamicLink } = useOpenDynamicLink({
  appStoreUrl: 'https://apps.apple.com/app/apple-store/id1072038396',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=vn.vtv.vtvgo',
  fallbackUrl: 'https://tinyhref.com'
});

<button
  onClick={openDynamicLink}
>
  Open App
</button>
```
