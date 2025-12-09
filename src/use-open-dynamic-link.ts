import { useCallback, useEffect, useMemo } from 'react';

import type { IProps } from './types';

interface IParams {
  targetUrl?: string
  isMainDomain?: boolean
  queryKey?: string
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
  const queryKey = params?.queryKey!;

  if (params?.isMainDomain) {
    if (!domainUrl) {
      return ''
    }

    const url = `${domainUrl.replace(/\/+$/, '')}${window.location.pathname}${window.location.search}`;

    if (!queryKey) {
      return url
    }

    const urlObj = new URL(url);
    urlObj.searchParams.delete(queryKey);
    urlObj.searchParams.delete('origin');

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

  if (realLink.includes(`${queryKey}=1`)) {
    return realLink
  }

  return `${realLink}${realLink.includes('?') ? '&' : '?'}${queryKey}=1&origin=${window.location.origin}`
}

export const useOpenDynamicLink = (props: IProps) => {
  const {
    subdomainUrl,
    appStoreUrl,
    googlePlayUrl,
    fallbackUrl,
    platform = {},
    timeout = 100,
    queryKey = 'openStore',
    onOpenStore
  } = props;

  let originUrl = props?.originUrl;

  const handleOpenDynamicLink = useCallback((params?: IParams) => {
    const fullLink = getLink(subdomainUrl, { ...params, queryKey });

    window.open(fullLink);
  }, [subdomainUrl, queryKey]);

  const handleOpenStore = useCallback(() => {
    const userAgent = props?.userAgent || window.navigator.userAgent;
    let storeLink: string = fallbackUrl;
    let redirectToUrl: string = '';

    if (!originUrl) {
      originUrl = getQueryParam('origin') || '';
    }

    if (/iPhone|iPad|iPod/i.test(userAgent) || platform?.isIOS || platform?.isIpad) {
      storeLink = appStoreUrl;

      redirectToUrl = getLink(originUrl, { isMainDomain: true, queryKey });
    }

    if (/Android/i.test(userAgent) || platform?.isAndroid) {
      storeLink = googlePlayUrl;

      redirectToUrl = getLink(originUrl, { isMainDomain: true, queryKey });
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
  }, [queryKey]);

  const isOpenStore = useMemo(() => {
    return Boolean(getQueryParam(queryKey))
  }, [queryKey]);

  useEffect(() => {
    if (isOpenStore) {
      handleOpenStore();
    }
  }, [isOpenStore]);

  return {
    link: getLink(subdomainUrl, { queryKey }),
    openDynamicLink: handleOpenDynamicLink,
    openStore: handleOpenStore
  }
};

export default useOpenDynamicLink