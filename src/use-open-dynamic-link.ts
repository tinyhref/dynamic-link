import { useCallback, useEffect, useMemo } from 'react';

import type { IProps } from './types';

interface IParams {
  targetUrl?: string
}

function getQueryParam(key: string, url?: string) {
  if (!url) {
    url = window.location.href
  }

  try {
    return new URL(url).searchParams.get(key);
  } catch (e) {
    return null;
  }
}

export function getLink(subdomainUrl: string, params?: IParams) {
  let realLink: string;
  const targetUrl = params?.targetUrl;

  if (targetUrl) {
    realLink = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}link=${encodeURIComponent(window.location.href)}`
  } else {
    if (subdomainUrl) {
      realLink = `${subdomainUrl.replace(/\/+$/, '')}${window.location.pathname}${window.location.search}`
    } else {
      realLink = window.location.href
    }
  }

  return `${realLink}${realLink.includes('?') ? '&' : '?'}isOpenStore=true`
}

export const useOpenDynamicLink = (props: IProps) => {
  const {
    subdomainUrl,
    appStoreUrl,
    googlePlayUrl,
    fallbackUrl,
    platform = {}
  } = props;
  const handleOpenDynamicLink = useCallback((params?: IParams) => {
    const fullLink = getLink(subdomainUrl, params);

    window.open(fullLink);
  }, [subdomainUrl])

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
      window.location.href = storeLink;
    }
  }, [])

  const isOpenStore = useMemo(() => {
    return Boolean(getQueryParam('isOpenStore'))
  }, [])

  useEffect(() => {
    if (isOpenStore) {
      handleOpenStore();
    }
  }, [isOpenStore]);

  return {
    link: getLink(subdomainUrl),
    openDynamicLink: handleOpenDynamicLink,
    openStore: handleOpenStore
  }
};

export default useOpenDynamicLink