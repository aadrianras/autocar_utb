import { Box, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  return (
    <Stack justifyContent="center" alignItems="center" height="100%">
      <Box m="auto" maxWidth="30rem">
        <Image src="/images/logo.png" alt="logo" layout="intrinsic" width="842px" height="560px" />
        <Link href="/login">
          <a>Ir a login</a>
        </Link>
      </Box>
    </Stack>
  );
};

export default Home;
