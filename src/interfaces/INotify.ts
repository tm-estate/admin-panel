export interface INotify {
    showNotification: boolean
    textNotification: string
    typeNotification: 'info' | 'success' | 'warning' | 'error' | 'default'
}
