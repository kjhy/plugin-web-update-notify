interface Window {
  // web update event
  webupdatenotify: Event

  // git commit hash or packaging time
  webUpdateNotifyVersion: string

  // 是否已经显示了系统升级提示
  hasShowSystemUpdateNotice_plugin?: boolean
  webUpdateCheck_checkAndNotice: (any) => void
}
