import { useContext, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, Typography } from '@mui/material';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { Provider } from '../../../types/firestore';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditProvider from './EditProvider';

const ProvidersTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const handleEditProvider = (provider: Provider) => {
    setIsEditModalOpen(true);
    setProvider(provider);
  };

  return (
    <Box p="1rem 1rem 2rem 1rem" sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
      <Typography variant="h4" mb="1rem">
        Proveedores
      </Typography>
      <DataGrid rows={myContext.providers} columns={getColumns(handleEditProvider)} autoHeight />
      <EditProvider
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        provider={provider}
        setProvider={setProvider}
      />
    </Box>
  );
};

const getColumns = (handleEditProvider: (provider: Provider) => void): GridColDef[] => [
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
    headerName: 'Teléfono',
    flex: .5,
  },
  {
    field: 'address',
    headerName: 'Dirección',
    flex: 1,
  },
  {
    field: 'city',
    headerName: 'Ciudad',
    flex: 0.5,
  },
  {
    field: 'edit',
    headerName: ' ',
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    minWidth: 60,
    width: 60,
    renderCell({ row }: { row: Provider }) {
      return (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <IconButton sx={{ borderRadius: '.25rem' }} onClick={() => handleEditProvider(row)}>
            <EditRoundedIcon />
          </IconButton>
        </Box>
      );
    },
  },
];

export default ProvidersTable;
