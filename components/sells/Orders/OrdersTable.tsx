import { Box, IconButton, Typography } from '@mui/material';
import { SaleOrder } from '../../../types/firestore';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { useContext, useState } from 'react';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';


const OrdersTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [saleOrder, setSaleOrder] = useState<SaleOrder | null>(null);
  const handleEditOrder = (saleOrder: SaleOrder) => {
    setIsEditModalOpen(true);
    setSaleOrder(saleOrder);
  };

  const handleDelete = (saleOrder: SaleOrder) => {
    setSaleOrder(saleOrder)
    setIsDeleteModalOpen(true)
  };

  return (
    <Box p="1rem 1rem 2rem 1rem" sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
      <Typography variant="h4" mb="1rem">
        Ventas
      </Typography>
      <DataGrid rows={myContext.clients} columns={getColumns(handleEditOrder, handleDelete)} autoHeight />
      {/* <EditClient
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        client={saleOrder}
        setClient={setSaleOrder}
      />
      <DeleteClient
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        client={saleOrder}
        setClient={setSaleOrder}
      /> */}
    </Box>
  );
};

const getColumns = (
  handleEditClient: (saleOrder: SaleOrder) => void,
  handleDelete: (saleOrder: SaleOrder) => void
): GridColDef[] => [
  {
    field: 'client',
    headerName: 'Cliente',
    flex: 1,
  },
  {
    field: 'invoiceName',
    headerName: 'Razon social',
    flex: 1,
  },
  {
    field: 'invoiceNumber',
    headerName: 'NIT',
    flex: 0.5,
  },
  {
    field: 'totalCars',
    headerName: 'Cantidad',
    flex: 1,
  },
  {
    field: 'date',
    headerName: 'Fecha de venta',
    flex: 0.5,
  },
  {
    field: 'total',
    headerName: 'Total',
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
    renderCell({ row }: { row: SaleOrder }) {
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
    renderCell({ row }: { row: SaleOrder }) {
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

export default OrdersTable;
