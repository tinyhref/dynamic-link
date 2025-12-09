# DynamicLink

##  Installation

```bash
npm install @tinyhref/dynamic-link
or
yarn add @tinyhref/dynamic-link
```

## Use It

```js
import React from 'react';
import DynamicLink from '@tinyhref/dynamic-link';

const dynamicLinkProps = {
  subdomainUrl: 'https://deeplink.tinyhref.com',
  appStoreUrl: 'https://apps.apple.com/app/apple-store/id1072038396',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=vn.vtv.vtvgo',
  fallbackUrl: 'https://tinyhref.com',
  onOpenStore: ({ link }) => {
    // Handle Clipboard-Based Deferred Deep Linking
  }
};

<DynamicLink
  {...dynamicLinkProps}
>
  Open App
</DynamicLink>
```
or

```js
import React from 'react';
import { useOpenDynamicLink } from '@tinyhref/dynamic-link';

const { link } = useOpenDynamicLink({
  subdomainUrl: 'https://deeplink.tinyhref.com',
  appStoreUrl: 'https://apps.apple.com/app/apple-store/id1072038396',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=vn.vtv.vtvgo',
  fallbackUrl: 'https://tinyhref.com'
});

<a href={link}>
  Open App
</a>
```