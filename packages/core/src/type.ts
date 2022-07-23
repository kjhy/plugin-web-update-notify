export interface Options {
  // polling interval（ms）, default 10*60*1000
  checkInterval?: number

  // whether to output version in console
  logVersion?: boolean
  customNotifyHTML?: string
  notifyProps?: NotifyProps
  hiddenDefaultNotify?: boolean
}

interface NotifyProps {
  title?: string
  description?: string
  buttonText?: string
}
