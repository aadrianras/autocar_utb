import { Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const InventoryHeader = () => {
  const router = useRouter();

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="1rem"
      sx={{ minHeight: '60px', heigth: '60px', width: '100%', px: '1rem', borderBottom: '1px solid #c4c4c4' }}
    >
      <Link href="/dashboard/inventory">
        <a>
          <Typography
            sx={{
              cursor: 'pointer',
              fontWeight: router.asPath === '/dashboard/inventory' ? 'bold' : '400',
            }}
            variant="body1"
          >
            Inventario
          </Typography>
        </a>
      </Link>
      <Link href="/dashboard/inventory/orders">
        <a>
          <Typography
            sx={{
              cursor: 'pointer',
              fontWeight: router.asPath === '/dashboard/inventory/orders' ? 'bold' : '400',
            }}
            variant="body1"
          >
            Ordenes de compra
          </Typography>
        </a>
      </Link>
      <Link href="/dashboard/inventory/receptions">
        <a>
          <Typography
            sx={{
              cursor: 'pointer',
              fontWeight: router.asPath === '/dashboard/inventory/receptions' ? 'bold' : '400',
            }}
            variant="body1"
          >
            Recepciones
          </Typography>
        </a>
      </Link>
      <Link href="/dashboard/inventory/providers">
        <a>
          <Typography
            sx={{
              cursor: 'pointer',
              fontWeight: router.asPath === '/dashboard/inventory/providers' ? 'bold' : '400',
            }}
            variant="body1"
          >
            Proveedores
          </Typography>
        </a>
      </Link>
    </Stack>
  );
};


export default InventoryHeader;
