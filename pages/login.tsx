import { ChangeEvent, FormEvent, ReactElement, useContext, useEffect, useState } from 'react';
import { Typography, Button, Stack, TextField, Box } from '@mui/material';
import { auth, db } from '../config/firebase';
import Head from 'next/head';
import { GlobalContext, MyContextState, User } from './_app';
import Image from 'next/image';
import { useRouter } from 'next/router';

function Login() {
  const router = useRouter()
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);

  const signInWithEmailAndPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const userUID = await (await auth.signInWithEmailAndPassword(user, password))?.user?.uid;
      const dbUser = await db.collection('users').doc(userUID).get();
      const dataUser = (await dbUser.data()) as Partial<User>;
      if (!dataUser) throw new Error('Error while loading');
      //Send authenticated user to the context
      setMyContext({
        ...myContext,
        user: {
          uid: userUID || '',
          job: dataUser?.job || '',
          name: dataUser?.name || '',
          lastname: dataUser?.lastname || '',
          phone: dataUser?.phone || 0,
          role: dataUser?.role || 'editor',
        },
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Iniciaste sesión correctamente',
        },
      })
      router.push('/dashboard/inventory')
    } catch (error) {
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al iniciar tu sesión, revisa tu datos.',
        },
      });
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Aguilar & Venegas</title>
      </Head>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        gap="1rem"
        maxWidth="30rem"
        width="100%"
        height="100%"
        m="0 auto"
      >
        <Box m="0rem auto" maxWidth="15rem">
          <Image src="/images/logo.png" alt="logo" layout="intrinsic" width="842px" height="560px" />
        </Box>
        <Typography variant="body1" textAlign="center">
          Bienvenido al gestor administrativo, ingresa tus datos para continuar
        </Typography>
        <form onSubmit={signInWithEmailAndPassword}>
          <Stack direction="column" justifyContent="strech" gap="1rem">
            <TextField
              type="email"
              id="login-user"
              label="Usuario"
              placeholder="Ingresa tu usuario"
              variant="outlined"
              value={user}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setUser(event.target.value)}
            />
            <TextField
              id="login-passwork"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            />
            <Button disabled={loading} variant="contained" size="large" fullWidth type="submit" onClick={() => {}}>
              {loading ? 'Verificando...' : 'Iniciar sesion'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
}

export default Login;
