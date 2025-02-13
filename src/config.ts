export const hostApi =
  process.env.NODE_ENV === 'development' ? 'http://172.20.10.3:3000/api/v1' : ''
export const portApi = process.env.NODE_ENV === 'development' ? 8080 : ''
// export const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}/api`;
// export const baseURLApi = `http://185.208.207.175:3000/api/v1/`
// export const baseURLApi = `http://185.208.207.175:3000/api/v1/`
// export const baseURLApi = `http://192.168.31.19:3000/api/v1/`
export const baseURLApi = `http://41.216.181.33:3000/api/v1/`
export const baseImageURLApi = `http://41.216.181.33:9000/`

export const localStorageDarkModeKey = 'darkMode'

export const localStorageStyleKey = 'style'

export const containerMaxW = 'xl:max-w-6xl xl:mx-auto'

export const appTitle = 'created by Flatlogic generator!'

export const getPageTitle = (currentPageTitle: string) => `${currentPageTitle} — ${appTitle}`
