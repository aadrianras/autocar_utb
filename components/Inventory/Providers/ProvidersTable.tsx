import { db } from '../../../config/firebase';
import { Provider } from '../../../types/firestore';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const ProvidersTable = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  useEffect(() => {
    (async () => {
      const getProviders = await db.collection('providers').get();
      const data = await getProviders.docs.map((doc): Provider => ({ id: doc.id, ...doc.data() } as Provider));
      setProviders(data);
    })();
  }, []);

  return (
    <Box p="1rem">
      <Typography variant="h4" mb='1rem'>Proveedores</Typography>
      <DataGrid rows={providers} columns={columns} autoHeight />
    </Box>
  );
};

const columns: GridColDef[] = [
  {
    field: 'company',
    headerName: 'Proveedor',
    flex: 1,
  },
  {
    field: 'contactName',
    headerName: 'Contacto',
    flex: 1,
  },
  {
    field: 'contactPhone',
    headerName: 'Telefono',
    flex: 1,
  },
  {
    field: 'city',
    headerName: 'Ciudad',
    flex: 0.5,
  },
  {
    field: 'address',
    headerName: 'Direccion',
    flex: 1,
  },
];

export default ProvidersTable;
