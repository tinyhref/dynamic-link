import { IOptions } from './types';

interface IParams {
  targetUrl?: string
  isMainDomain?: boolean
  queryKey?: string
}

export function getQueryParam(key: string | undefined, url?: string) {
  if (!key) {
    return null;
  }

  if (!url) {
    url = window.location.href
  }

  try {
    return new URL(url).searchParams.get(key);
  } catch (e) {
    return null;
  }
}

export function getLink(domainUrl: string | undefined, params?: IParams) {
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

class DynamicLinkClass {
  private static sdk: DynamicLinkClass | undefined;
  private subdomainUrl: IOptions['subdomainUrl'] | undefined;
  private appStoreUrl: IOptions['appStoreUrl'] | undefined;
  private googlePlayUrl: IOptions['googlePlayUrl'] | undefined;
  private fallbackUrl: IOptions['fallbackUrl'] | undefined;
  private originUrl: IOptions['originUrl'];
  private userAgent: IOptions['userAgent'];
  private platform: IOptions['platform'];
  private timeout: IOptions['timeout'];
  private queryKey: IOptions['queryKey'];
  private onOpenStore: IOptions['onOpenStore'];

  static instance() {
    if (!this.sdk) {
      this.sdk = new DynamicLinkClass();
    }
    return this.sdk;
  }

  constructor(opts?: IOptions) {
    if (opts) {
      this.init?.(opts);
    }
  }

  init({
    subdomainUrl,
    appStoreUrl,
    googlePlayUrl,
    fallbackUrl,
    originUrl,
    userAgent,
    platform = {},
    timeout = 100,
    queryKey = 'openStore',
    onOpenStore
  }: IOptions) {
    this.subdomainUrl = subdomainUrl;
    this.appStoreUrl = appStoreUrl;
    this.googlePlayUrl = googlePlayUrl;
    this.fallbackUrl = fallbackUrl;
    this.userAgent = userAgent;
    this.originUrl = originUrl;
    this.platform = platform;
    this.timeout = timeout;
    this.queryKey = queryKey;
    this.onOpenStore = onOpenStore;
  }

  openStore() {
    const userAgent = this?.userAgent || window.navigator.userAgent;
    let storeLink: string | undefined = this.fallbackUrl;
    let redirectToUrl: string = '';

    if (!this.originUrl) {
      this.originUrl = getQueryParam('origin') || '';
    }

    if (/iPhone|iPad|iPod/i.test(userAgent) || this.platform?.isIOS || this.platform?.isIpad) {
      storeLink = this.appStoreUrl;

      redirectToUrl = getLink(this.originUrl, { isMainDomain: true, queryKey: this.queryKey });
    }

    if (/Android/i.test(userAgent) || this.platform?.isAndroid) {
      storeLink = this.googlePlayUrl;

      redirectToUrl = getLink(this.originUrl, { isMainDomain: true, queryKey: this.queryKey });
    }

    if (redirectToUrl) {
      this.onOpenStore?.({ link: redirectToUrl });
    }

    if (storeLink) {
      window.location.href = storeLink;
    }

    if (redirectToUrl) {
      setTimeout(() => {
        window.location.href = redirectToUrl
      }, this.timeout)
    }
  }

  openLink(params: IParams) {
    window.location.href = getLink(this.subdomainUrl, { ...params, queryKey: this.queryKey });
  }

  listener() {
    const isOpenStore = Boolean(getQueryParam(this.queryKey));

    if (isOpenStore) {
      this.openStore();
    }
  }
}

export const DynamicLinkSDK = DynamicLinkClass.instance()

export default DynamicLinkSDK
