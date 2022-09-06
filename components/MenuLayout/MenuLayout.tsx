import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import Grid from '@mui/material/Unstable_Grid2';
import GroupsIcon from '@mui/icons-material/Groups';
import Image from 'next/image';
import InventoryIcon from '@mui/icons-material/Inventory';
import Link from 'next/link';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Stack from '@mui/material/Stack';

const MenuLayout = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();

  return (
    <Grid height="100%" width="100%" bgcolor="secondary" container>
      <Grid width="60px" height="100%" bgcolor="primary.main">
        <Stack justifyContent="space-between" gap="2rem">
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
        </Stack>
      </Grid>
      <Grid xs>{children}</Grid>
    </Grid>
  );
};

const pages = [
  { name: 'Compras', icon: InventoryIcon, url: '/dashboard/inventory' },
  { name: 'Ventas', icon: ReceiptIcon, url: '/dashboard/sells' },
  { name: 'Taller', icon: CarRepairIcon, url: '/dashboard/repair' },
  { name: 'RRHH', icon: GroupsIcon, url: '/dashboard/hr' },
];

export default MenuLayout;
