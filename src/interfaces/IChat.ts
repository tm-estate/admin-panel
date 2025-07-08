export enum ChatStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}
export interface IChatTab {
  name: string
  link: ChatStatus
}
