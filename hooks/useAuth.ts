import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { auth, fs } from '../config/firebase';
import { GlobalContext, MyContextState } from '../pages/_app';

const useAuth = async () => {
  const router = useRouter();
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  useEffect(() => {
    (async function (){
      await auth.onAuthStateChanged(async (user) => {
        if (!user && router.pathname !== '/login') {
          router.push('/');
          return;
        }
        if (user && !myContext?.user) {
          const dbUser = await fs.user.get(user?.uid);
          const dbProviders = await fs.providers.getAll();
          const dbPurchaseOrders = await fs.purchaseOrders.getAll();
          const dbUsers = await fs.user.getAll();
          const dbReceptionOrders = await fs.receptionOrders.getAll();
          const dbCars = await fs.cars.getAll()
          const dbClients = await fs.client.getAll();
          const dbSaleOrders = await fs.saleOrder.getAll();
    
          if (!dbUser || !dbProviders || !dbUsers || !dbPurchaseOrders || !dbReceptionOrders || !dbClients || !dbSaleOrders) throw new Error('Error while loading');
          //Send authenticated user to the context
          setMyContext({
            ...myContext,
            user: {
              uid: user?.uid || '',
              job: dbUser?.job || '',
              name: dbUser?.name || '',
              lastname: dbUser?.lastname || '',
              phone: dbUser?.phone || 0,
              role: dbUser?.role || 'editor',
            },
            providers: dbProviders,
            purchaseOrders: dbPurchaseOrders,
            users: dbUsers,
            receptionOrders: dbReceptionOrders,
            saleOrders: dbSaleOrders,
            cars: dbCars,
            clients: dbClients
          });
        }
        //This part needs to be specific for each role
        if (user && router.pathname === '/login') {
          router.push('/dashboard/inventory');
        }
      });
    })()
  },[])
  
};

export default useAuth;
