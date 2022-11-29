import { Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SellsHeader = () => {
  const router = useRouter();

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="1rem"
      sx={{ minHeight: '60px', heigth: '60px', width: '100%', px: '1rem', borderBottom: '1px solid #c4c4c4' }}
    >
      <Link href="/dashboard/sells">
        <a>
          <Typography
            sx={{
              cursor: 'pointer',
              fontWeight: router.asPath === '/dashboard/sells' ? 'bold' : '400',
            }}
            variant="body1"
          >
            Ventas
          </Typography>
        </a>
      </Link>
      <Link href="/dashboard/sells/clients">
        <a>
          <Typography
            sx={{
              cursor: 'pointer',
              fontWeight: router.asPath === '/dashboard/sells/clients' ? 'bold' : '400',
            }}
            variant="body1"
          >
            Clientes
          </Typography>
        </a>
      </Link>
    </Stack>
  );
};


export default SellsHeader;
