export const IsDevelopmentNodeEnv = process.env.NODE_ENV === 'development'
export const hostApi = IsDevelopmentNodeEnv ? 'http://172.20.10.3:3000/api/v1' : ''
export const portApi = process.env.NODE_ENV === 'development' ? 8080 : ''
// export const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}/api`;
export const baseURLApi = `${process.env.NEXT_PUBLIC_BASE_URL}:3000/api/v1/`
export const baseImageURLApi = `${process.env.NEXT_PUBLIC_BASE_URL}:9000/`

export const baseCentrifugoUrlURLApi = `${process.env.NEXT_PUBLIC_CENTRIFUGO_URL}`

export const localStorageDarkModeKey = 'darkMode'

export const localStorageStyleKey = 'style'

export const containerMaxW = 'xl:mx-auto'

export const appTitle = 'created by Flatlogic generator!'

export const getPageTitle = (currentPageTitle: string) => `${currentPageTitle} — ${appTitle}`
