import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Car, Provider, PurchaseOrder, ReceptionOrder, User } from '../types/firestore';

const config = {
  apiKey: 'AIzaSyC6IJpnB5VttmjmG6T4OtwyCDCPV_bn18I',
  authDomain: 'autocar-utb.firebaseapp.com',
  projectId: 'autocar-utb',
  storageBucket: 'autocar-utb.appspot.com',
  messagingSenderId: '1008389320290',
  appId: '1:1008389320290:web:6b5885340069f6cc6b6b3b',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.firestore();

const fs = {
  user: {
    getAll: async function (): Promise<User[]> {
      try {
        const users = await (
          await db.collection('users').get()
        ).docs.map((doc): User => ({ uid: doc.id, ...doc.data() } as User));
        return users;
      } catch (error) {
        console.log({ error });
        return [];
      }
    },
    get: async function (uid: string): Promise<User | null> {
      try {
        const user = (await (await db.collection('users').doc(uid).get()).data()) as Partial<User>;
        return { uid, ...user } as User;
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
    login: async function (user: string, password: string): Promise<User | null> {
      try {
        //Check id user and password are valid
        const userUID = await (await auth.signInWithEmailAndPassword(user, password))?.user?.uid;
        //Get the user
        const dbUser = (await (await db.collection('users').doc(userUID).get()).data()) as Partial<User>;
        return { uid: userUID, ...dbUser } as User;
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
    logout: async function () {
      try {
        const logout = await auth.signOut();
        return logout;
      } catch (error) {
        console.log({ error });
        if (error instanceof Error) throw error;
      }
    },
  },
  providers: {
    getAll: async function (): Promise<Provider[]> {
      try {
        const providers = await (
          await db.collection('providers').get()
        ).docs.map((doc): Provider => ({ id: doc.id, ...doc.data() } as Provider));
        return providers;
      } catch (error) {
        console.log({ error });
        return [];
      }
    },
    create: async function (data: Partial<Provider>): Promise<Provider | null> {
      try {
        const newProvider = await db.collection('providers').add(data);
        const providerId = await newProvider.id;
        return { id: providerId, ...data } as Provider;
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
    update: async function (data: Provider) {
      try {
        await db.collection('providers').doc(data.id).update(data);
        return true;
      } catch (error) {
        console.log({ error });
        return false;
      }
    },
  },
  purchaseOrders: {
    getAll: async function (): Promise<PurchaseOrder[]> {
      try {
        const purchaseOrders = await (
          await db.collection('purchaseOrders').get()
        ).docs.map((doc): PurchaseOrder => ({ id: doc.id, ...doc.data() } as PurchaseOrder));
        return purchaseOrders;
      } catch (error) {
        console.log({ error });
        return [];
      }
    },
    create: async function (data: Partial<PurchaseOrder>): Promise<PurchaseOrder | null> {
      try {
        const newPurchaseOrder = await db.collection('purchaseOrders').add(data);
        const newPurchaseOrderId = await newPurchaseOrder.id;
        return { id: newPurchaseOrderId, ...data } as PurchaseOrder;
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
    update: async function (data: Partial<PurchaseOrder>): Promise<PurchaseOrder | null> {
      try {
        const updatedOrder = await db.collection('purchaseOrders').doc(data.id).update(data);
        const updatedOrderId = await updatedOrder;
        return { id: updatedOrderId, ...data } as PurchaseOrder;
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
  },
  receptionOrders: {
    create: async function (data: Partial<ReceptionOrder>): Promise<ReceptionOrder | null> {
      try {
        const newReceptionOrder = await db.collection('receptionOrder').add(data);
        const newReceptionOrderId = await newReceptionOrder.id;
        return { id: newReceptionOrderId, ...data } as ReceptionOrder;
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
    getAll: async function (): Promise<ReceptionOrder[]> {
      try {
        const receptionOrders = await (
          await db.collection('receptionOrder').get()
        ).docs.map((doc): ReceptionOrder => ({ id: doc.id, ...doc.data() } as ReceptionOrder));
        return receptionOrders;
      } catch (error) {
        console.log({ error });
        return [];
      }
    },
  },
  cars: {
    create: async function (data: Partial<Car>): Promise<Car | null> {
      try {
        const newCar = await db.collection('cars').add(data);
        const newCarId = await newCar.id;
        return { id: newCarId, ...data } as Car;
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
    getAll: async function (): Promise<Car[]> {
      try {
        const cars = await (
          await db.collection('cars').get()
        ).docs.map((doc): Car => ({ id: doc.id, ...doc.data() } as Car));
        return cars;
      } catch (error) {
        console.log({ error });
        return [];
      }
    },
    update: async function (id: string, data: Partial<Car>): Promise<Car | null> {
      try {
        const updatedCar = await db.collection('cars').doc(id).update(data);
        const updatedOrderCar = await updatedCar;
        return { id: updatedOrderCar, ...data } as Car;
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
  }
};

export { fs, auth };
