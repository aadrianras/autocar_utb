import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material'
import lightTheme from '../theme/light'
import { createContext, Dispatch, SetStateAction, useState } from 'react'
import MainLayout from '../components/MainLayout/MainLayout'

export interface MyContext {
  user: User | null,
  snackbar: Snackbar
}

export interface Snackbar {
  open: boolean,
  msg: string,
  severity: 'error' | 'warning' | 'info' | 'success'
}

export interface User {
  uid: string,
  name: string,
  lastname: string,
  job: string,
  phone: number,
  role: 'admin' | 'editor'
}

export interface MyContextState {
  myContext: MyContext,
  setMyContext: Dispatch<SetStateAction<MyContext>>
}

export const GlobalContext = createContext<MyContextState>({myContext: {
    user: null,
    snackbar: {
      open: false,
      msg: '',
      severity: 'info'
    }
  }, setMyContext: () => {}})

function MyApp({ Component, pageProps }: AppProps) {
  const [myContext, setMyContext] = useState<MyContext>({
    user: null,
    snackbar: {
      open: false,
      msg: '',
      severity: 'info'
    }
  })

  return (
    <GlobalContext.Provider value={{myContext, setMyContext}}>
      <ThemeProvider theme={lightTheme}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </GlobalContext.Provider>
  )
}

export default MyApp
