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
    </Stack>
  );
};


export default SellsHeader;
