import { useCallback, useEffect, useMemo } from 'react';

import type { IProps } from './types';

interface IParams {
  link?: string
}

function getParameterByName(name: string, url?: string) {
  if (!url) {
    url = window.location.href
  }

  name = name.replace(/[\[\]]/g, '\\$&');

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);

  if (!results) {
    return null
  }

  if (!results[2]) {
    return ''
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getLink(link?: string) {
  const realLink = link || window.location.href;

  return `${realLink}${realLink.includes('?') ? '&' : '?'}isOpenStore=true`
}

export const useOpenDynamicLink = (props: IProps) => {
  const {
    appStoreUrl,
    googlePlayUrl,
    fallbackUrl,
    timeout = 200,
    platform = {}
  } = props;
  const handleOpenDynamicLink = useCallback((params: IParams = {}) => {
    const fullLink = getLink(params?.link);

    window.open(fullLink);
  }, [])

  const handleOpenStore = useCallback(() => {
    const userAgent = props?.userAgent || window.navigator.userAgent;
    let storeLink: string = fallbackUrl;

    if (/iPhone|iPad|iPod/i.test(userAgent) || platform?.isIOS || platform?.isIpad) {
      storeLink = appStoreUrl;
    }

    if (/Android/i.test(userAgent) || platform?.isAndroid) {
      storeLink = googlePlayUrl;
    }

    if (storeLink) {
      if (timeout) {
        setTimeout(() => {
          window.location.href = storeLink;
        }, timeout)
        return
      }

      window.location.href = storeLink;
    }
  }, [])

  const isOpenStore = useMemo(() => {
    return Boolean(getParameterByName('isOpenStore'))
  }, [])

  useEffect(() => {
    if (isOpenStore) {
      handleOpenStore();
    }
  }, [isOpenStore]);

  return {
    link: getLink(),
    openDynamicLink: handleOpenDynamicLink,
    openStore: handleOpenStore
  }
};

export default useOpenDynamicLink