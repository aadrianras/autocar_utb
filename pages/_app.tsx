import '../styles/globals.css';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../theme/light';
import MainLayout from '../components/MainLayout/MainLayout';
import type { AppProps } from 'next/app';
import { Car, Client, Provider, PurchaseOrder, ReceptionOrder, RepairedCar, SaleOrder, User } from '../types/firestore.d';

export interface MyContext {
  user: User | null;
  providers: Provider[];
  purchaseOrders: PurchaseOrder[];
  users: User[];
  receptionOrders: ReceptionOrder[],
  saleOrders: SaleOrder[];
  repairedCars: RepairedCar[];
  cars: Car[];
  clients: Client[];
  snackbar: Snackbar;
}

export interface Snackbar {
  open: boolean;
  msg: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

export interface MyContextState {
  myContext: MyContext;
  setMyContext: Dispatch<SetStateAction<MyContext>>;
}

export const GlobalContext = createContext<MyContextState>({
  myContext: {
    user: null,
    providers: [],
    purchaseOrders: [],
    users: [],
    receptionOrders: [],
    saleOrders: [],
    repairedCars: [],
    cars: [],
    clients: [],
    snackbar: {
      open: false,
      msg: '',
      severity: 'info',
    },
  },
  setMyContext: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [myContext, setMyContext] = useState<MyContext>({
    user: null,
    providers: [],
    purchaseOrders: [],
    users: [],
    receptionOrders: [],
    saleOrders: [],
    cars: [],
    repairedCars: [],
    clients: [],
    snackbar: {
      open: false,
      msg: '',
      severity: 'info',
    },
  });

  return (
    <GlobalContext.Provider value={{ myContext, setMyContext }}>
      <ThemeProvider theme={lightTheme}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </GlobalContext.Provider>
  );
}

export default MyApp;
