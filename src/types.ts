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
  originUrl?: string
  userAgent?: string
  platform?: IPlatform
  timeout?: number
  queryKey?: string
  onOpenStore?: (params: { link: string }) => void
}