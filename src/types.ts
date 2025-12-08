export interface IPlatform {
  isIOS?: boolean
  isIpad?: boolean
  isAndroid?: boolean
}

export interface IProps {
  appStoreUrl: string
  googlePlayUrl: string
  fallbackUrl: string
  timeout?: number | null
  userAgent?: string
  platform?: IPlatform
}