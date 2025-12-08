export interface IPlatform {
  isIOS?: boolean
  isIpad?: boolean
  isAndroid?: boolean
}

export interface IProps {
  subdomainUrl: string
  appStoreUrl: string
  googlePlayUrl: string
  fallbackUrl: string
  domainUrl?: string
  userAgent?: string
  platform?: IPlatform
  timeout?: number
  onOpenStore?: (params: { link: string }) => void
}