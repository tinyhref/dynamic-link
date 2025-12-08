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
  userAgent?: string
  platform?: IPlatform
}