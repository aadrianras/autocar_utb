import { useRouter } from 'next/router';
import { useContext } from 'react';
import { auth, fs } from '../config/firebase';
import { GlobalContext, MyContextState } from '../pages/_app';

const useAuth = async () => {
  const router = useRouter();
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
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

      if (!dbUser || !dbProviders || !dbUsers || !dbPurchaseOrders) throw new Error('Error while loading');
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
        users: dbUsers
      });
    }
    //This part needs to be specific for each role
    if (user && router.pathname === '/login') {
      router.push('/dashboard/inventory');
    }
  });
};

export default useAuth;
