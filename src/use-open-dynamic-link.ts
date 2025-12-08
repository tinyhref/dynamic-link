import { useCallback, useEffect, useMemo } from 'react';

import type { IProps } from './types';

interface IParams {
  targetUrl?: string
  isMainDomain?: boolean
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

export function getLink(domainUrl: string, params?: IParams) {
  if (params?.isMainDomain) {
    const url = `${domainUrl.replace(/\/+$/, '')}${window.location.pathname}${window.location.search}`;

    const urlObj = new URL(url);
    urlObj.searchParams.delete('isOpenStore');

    return urlObj.toString();
  }

  let realLink: string;
  const targetUrl = params?.targetUrl;

  if (targetUrl) {
    realLink = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}link=${encodeURIComponent(window.location.href)}`
  } else {
    if (domainUrl) {
      realLink = `${domainUrl.replace(/\/+$/, '')}${window.location.pathname}${window.location.search}`
    } else {
      realLink = window.location.href
    }
  }

  if (realLink.includes('isOpenStore=true')) {
    return realLink
  }

  return `${realLink}${realLink.includes('?') ? '&' : '?'}isOpenStore=true`
}

export const useOpenDynamicLink = (props: IProps) => {
  const {
    subdomainUrl,
    appStoreUrl,
    googlePlayUrl,
    domainUrl,
    fallbackUrl,
    platform = {},
    timeout = 100,
    onOpenStore
  } = props;

  const handleOpenDynamicLink = useCallback((params?: IParams) => {
    const fullLink = getLink(subdomainUrl, params);

    window.open(fullLink);
  }, [subdomainUrl]);

  const handleOpenStore = useCallback(() => {
    const userAgent = props?.userAgent || window.navigator.userAgent;
    let storeLink: string = fallbackUrl;
    let redirectToUrl: string = '';

    if (/iPhone|iPad|iPod/i.test(userAgent) || platform?.isIOS || platform?.isIpad) {
      storeLink = appStoreUrl;

      if (domainUrl) {
        redirectToUrl = getLink(domainUrl, { isMainDomain: true });
      }
    }

    if (/Android/i.test(userAgent) || platform?.isAndroid) {
      storeLink = googlePlayUrl;

      if (domainUrl) {
        redirectToUrl = getLink(domainUrl, { isMainDomain: true });
      }
    }

    if (redirectToUrl) {
      onOpenStore?.({ link: redirectToUrl });
    }

    if (storeLink) {
      window.location.href = storeLink;
    }

    if (redirectToUrl) {
      setTimeout(() => {
        window.location.href = redirectToUrl
      }, timeout)
    }
  }, []);

  const isOpenStore = useMemo(() => {
    return Boolean(getQueryParam('isOpenStore'))
  }, []);

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