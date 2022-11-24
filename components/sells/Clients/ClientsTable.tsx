import { Box, IconButton, Typography } from '@mui/material';
import { Client } from '../../../types/firestore';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { useContext, useState } from 'react';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditClient from './EditClient';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteClient from './DeleteClient';

const ClientsTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [client, setClient] = useState<Client | null>(null);
  const handleEditClient = (client: Client) => {
    setIsEditModalOpen(true);
    setClient(client);
  };

  const handleDelete = (client: Client) => {
    setClient(client)
    setIsDeleteModalOpen(true)
  };

  return (
    <Box p="1rem 1rem 2rem 1rem" sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
      <Typography variant="h4" mb="1rem">
        Clientes
      </Typography>
      <DataGrid rows={myContext.clients} columns={getColumns(handleEditClient, handleDelete)} autoHeight />
      <EditClient
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        client={client}
        setClient={setClient}
      />
      <DeleteClient
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        client={client}
        setClient={setClient}
      />
    </Box>
  );
};

const getColumns = (
  handleEditClient: (client: Client) => void,
  handleDelete: (client: Client) => void
): GridColDef[] => [
  {
    field: 'firstName',
    headerName: 'Nombre',
    flex: 1,
  },
  {
    field: 'lastName',
    headerName: 'Apellido',
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Correo electrónico',
    flex: 0.5,
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
    field: 'invoiceName',
    headerName: 'Razon social',
    flex: 0.5,
  },
  {
    field: 'invoiceNumber',
    headerName: 'NIT',
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
    renderCell({ row }: { row: Client }) {
      return (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <IconButton sx={{ borderRadius: '.25rem' }} onClick={() => handleEditClient(row)}>
            <EditRoundedIcon />
          </IconButton>
        </Box>
      );
    },
  },
  {
    field: 'delete',
    headerName: ' ',
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    minWidth: 60,
    width: 60,
    renderCell({ row }: { row: Client }) {
      return (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <IconButton sx={{ borderRadius: '.25rem' }} onClick={() => handleDelete(row)}>
            <DeleteRoundedIcon />
          </IconButton>
        </Box>
      );
    },
  },
];

export default ClientsTable;
