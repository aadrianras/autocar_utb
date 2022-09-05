import { useRouter } from 'next/router';
import { useContext } from 'react';
import { auth, db } from '../config/firebase';
import { GlobalContext, MyContextState, User } from '../pages/_app';

const useAuth = async () => {
  const router = useRouter();
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  await auth.onAuthStateChanged(async (user) => {
    if (!user && router.pathname !== '/login') {
      router.push('/');
      return;
    }
    if(user && !myContext?.user) {
      const dbUser = await db.collection('users').doc(user?.uid).get();
      const dataUser = (await dbUser.data()) as Partial<User>;
      if (!dataUser) throw new Error('Error while loading');
      //Send authenticated user to the context
      setMyContext({
        ...myContext,
        user: {
          uid: user?.uid || '',
          job: dataUser?.job || '',
          name: dataUser?.name || '',
          lastname: dataUser?.lastname || '',
          phone: dataUser?.phone || 0,
          role: dataUser?.role || 'editor',
        },
      });
    }
    //This part needs to be specific for each role
    if(user && router.pathname === '/login') {
      router.push('/dashboard/inventory');
    }
  });
};

export default useAuth;
