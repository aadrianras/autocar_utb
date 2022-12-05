import { fs } from '../../config/firebase';
import { GlobalContext, MyContextState } from '../../pages/_app';
import {
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import Grid from '@mui/material/Unstable_Grid2';
import GroupsIcon from '@mui/icons-material/Groups';
import Image from 'next/image';
import InventoryIcon from '@mui/icons-material/Inventory';
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Stack from '@mui/material/Stack';

const MenuLayout = ({ children }: { children: JSX.Element }) => {
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Grid id="main-container" height="100%" width="100%" bgcolor="secondary" sx={{ overflow: 'hidden' }} container>
      <Grid width="60px" height="100%" bgcolor="primary.main">
        <Stack justifyContent="space-between" height="100%">
          <Box m="1rem auto 0rem auto" maxWidth="3rem">
            <Image
              src="/images/logo.png"
              alt="logo"
              layout="intrinsic"
              width="842px"
              height="560px"
              style={{ filter: 'invert(1)' }}
            />
          </Box>
          <Stack gap=".5rem" padding="1rem 0.25rem" justifyContent="space-between" height="100%">
            <Stack gap=".5rem" padding="0 .25rem">
              {pages.map((page) => {
                return (
                  <Link href={page.url} key={page.name}>
                    <a>
                      <Stack
                        textAlign="center"
                        alignItems="center"
                        sx={{
                          backgroundColor: router.pathname.includes(page.url) ? 'secondary.main' : 'transparent',
                          padding: '.25rem',
                          borderRadius: '.25rem',
                        }}
                      >
                        <page.icon sx={{ color: '#fff', fontSize: '1.5rem' }} />
                        <Typography variant="caption" sx={{ color: '#fff', fontSize: '.6rem' }}>
                          {page.name}
                        </Typography>
                      </Stack>
                    </a>
                  </Link>
                );
              })}
            </Stack>
            <Stack
              textAlign="center"
              alignItems="center"
              sx={{
                padding: '.25rem',
                borderRadius: '.25rem',
                cursor: 'pointer',
              }}
              onClick={() => setIsLogoutConfirmationOpen(true)}
            >
              <LogoutIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
              <Typography variant="caption" sx={{ color: '#fff', fontSize: '.6rem' }}>
                Logout
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
      <Grid sx={{ height: '100%', width: '100%' }} xs>
        {children}
      </Grid>
      <LogoutConfirmationModal
        isLogoutConfirmationOpen={isLogoutConfirmationOpen}
        setIsLogoutConfirmationOpen={setIsLogoutConfirmationOpen}
      />
    </Grid>
  );
};

const pages = [
  { name: 'Compras', icon: InventoryIcon, url: '/dashboard/inventory' },
  { name: 'Ventas', icon: ReceiptIcon, url: '/dashboard/sells' },
  { name: 'Taller', icon: CarRepairIcon, url: '/dashboard/workshop' },
];

const LogoutConfirmationModal = ({ isLogoutConfirmationOpen, setIsLogoutConfirmationOpen }: ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const handleLogout = async () => {
    try {
      await fs.user.logout();
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Tu sesión fue cerrada correctamente. Adios.',
        },
      });
    } catch (error) {
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un error al cerrar tu sesión, intentalo de nuevo.',
        },
      });
    } finally { 
      setIsLogoutConfirmationOpen(false)
    }
  };
  const handleClose = () => {
    //This validation prevent the closing of the dialog while is fetching the data
    if (!loading) setIsLogoutConfirmationOpen(false);
  };

  return (
    <>
      <Dialog
        open={isLogoutConfirmationOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">¿Deseas cerrar tu sesión?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Esperamos que vuelvas pronto</DialogContentText>
        </DialogContent>
        <DialogActions >
          <Button onClick={() => setIsLogoutConfirmationOpen(false)} disabled={loading} autoFocus>
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error" disabled={loading}>
            {loading ? <CircularProgress size={'18px'} color="error" /> : 'Cerrar sesión'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

type ModalProps = {
  isLogoutConfirmationOpen: boolean;
  setIsLogoutConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default MenuLayout;
