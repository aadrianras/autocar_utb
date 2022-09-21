import 'moment/locale/es';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { Provider, PurchaseOrder } from '../../../types/firestore';
import { useContext, useState, useEffect } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import moment from 'moment';

const OrdersTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [purchaseOrder, setPurchaseOrder] = useState<Provider | null>(null);
  const [dataPurchaseOrders, setDataPurchaseOrders] = useState<DataTablePurchaseOrder[]>([]);
  const handleEditProvider = (provider: Provider) => {
    setIsEditModalOpen(true);
    setPurchaseOrder(provider);
  };

  useEffect(() => {
    const formatedData: DataTablePurchaseOrder[] = myContext.purchaseOrders.map((purchaseOrder: PurchaseOrder) => {
      const company = myContext.providers.find((provider) => provider.id === purchaseOrder.providerId)?.company;
      const createdByUser = myContext.users.find((user) => user.uid === purchaseOrder.createdBy);
      const createdBy = `${createdByUser?.name} ${createdByUser?.lastname}`;
      console.log(purchaseOrder.date)
      return {
        id: purchaseOrder.id,
        company,
        createdBy,
        status: purchaseOrder.status,
        date: moment(purchaseOrder.date).locale('es').format('LLL'),
      } as DataTablePurchaseOrder;
    });
    setDataPurchaseOrders(formatedData);
  }, [myContext]);

  console.log({ myContext });

  return (
    <Box p="1rem 1rem 2rem 1rem" sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
      <Typography variant="h4" mb="1rem">
        Ordenes de compra
      </Typography>
      <DataGrid rows={dataPurchaseOrders} columns={getColumns(handleEditProvider)} autoHeight/>
      {/* <EditProvider
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        provider={purchaseOrder}
        setProvider={setPurchaseOrder}
      /> */}
    </Box>
  );
};

const getColumns = (handleEditPurchaseOrder: (provider: Provider) => void): GridColDef[] => [
  {
    field: 'id',
    headerName: 'Id',
    flex: 1,
  },
  {
    field: 'company',
    headerName: 'Proveedor',
    flex: 1,
  },
  {
    field: 'date',
    headerName: 'Fecha de creación',
    flex: 1,
  },
  {
    field: 'createdBy',
    headerName: 'Creador',
    flex: 1,
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
    renderCell({ row }: { row: Provider }) {
      return (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <IconButton sx={{ borderRadius: '.25rem' }} onClick={() => handleEditPurchaseOrder(row)}>
            <EditRoundedIcon />
          </IconButton>
        </Box>
      );
    },
  },
];

interface DataTablePurchaseOrder {
  id: string;
  company: string;
  date: string;
  createdBy: string;
  status: 'pending' | 'rejected' | 'approved';
}

export default OrdersTable;
