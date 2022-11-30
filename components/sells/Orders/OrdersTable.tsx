import { Box, IconButton, Typography } from '@mui/material';
import { SaleOrder } from '../../../types/firestore';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GlobalContext, MyContext, MyContextState } from '../../../pages/_app';
import { useContext, useState } from 'react';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOrder from './DeleteOrder';


const OrdersTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  console.log({myContext})
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
      <DataGrid rows={myContext.saleOrders} columns={getColumns(myContext, handleEditOrder, handleDelete)} autoHeight />
      {/* <EditClient
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        client={saleOrder}
        setClient={setSaleOrder}
      /> */}
      <DeleteOrder
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        saleOrder={saleOrder}
        setSaleOrder={setSaleOrder}
      />
    </Box>
  );
};

const getColumns = (
  myContext: MyContext,
  handleEditClient: (saleOrder: SaleOrder) => void,
  handleDelete: (saleOrder: SaleOrder) => void
): GridColDef[] => [
  {
    field: 'client',
    headerName: 'Cliente',
    flex: 1,
    renderCell({ row }: { row: SaleOrder }) {
      const client = myContext.clients.find(client => client.id === row.clientId)
      return (<Typography variant='body1'>{`${client?.firstName} ${client?.lastName}`}</Typography>
      );
    },
  },
  {
    field: 'invoiceName',
    headerName: 'Razon social',
    flex: 1,
    renderCell({ row }: { row: SaleOrder }) {
      const client = myContext.clients.find(client => client.id === row.clientId)
      return (<Typography variant='body1'>{client?.invoiceName}</Typography>
      );
    },
  },
  {
    field: 'invoiceNumber',
    headerName: 'NIT',
    flex: 1,
    renderCell({ row }: { row: SaleOrder }) {
      const client = myContext.clients.find(client => client.id === row.clientId)
      return (<Typography variant='body1'>{client?.invoiceNumber}</Typography>
      );
    },
  },
  {
    field: 'date',
    headerName: 'Fecha de venta',
    flex: 1,
  },
  {
    field: 'totalCars',
    headerName: 'Cantidad',
    flex: .5,
    renderCell({ row }: { row: SaleOrder }) {
      const cantidad = row.cars.reduce((acc, cur) => acc + cur.quantity, 0)
      return (<Typography variant='body1'>{cantidad}</Typography>
      );
    },
  },
  {
    field: 'total',
    headerName: 'Total',
    flex: 0.5,
  },
  {
    field: 'status',
    headerName: 'Estado',
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
