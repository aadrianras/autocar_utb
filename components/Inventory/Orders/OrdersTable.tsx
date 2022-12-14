import 'moment/locale/es';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { PurchaseOrder } from '../../../types/firestore';
import { useContext, useState, useEffect } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import moment from 'moment';
import EditOrder from './EditOrder';
import { DataTablePurchaseOrder } from '../../../types/PurchaseOrder';
import ShowOrder from './ShowOrder';

const OrdersTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const [purchaseOrderId, setPurchaseOrderId] = useState<string | null>(null);
  const [purchaseOrderIdShow, setPurchaseOrderIdShow] = useState<string | null>(null);
  const [dataPurchaseOrders, setDataPurchaseOrders] = useState<DataTablePurchaseOrder[]>([]);
  const handleEditPurchaseOrder = (order: DataTablePurchaseOrder) => {
    setPurchaseOrderId(order.id);
  };

  useEffect(() => {
    const formatedData: DataTablePurchaseOrder[] = myContext.purchaseOrders.map((purchaseOrder: PurchaseOrder) => {
      const company = myContext.providers.find((provider) => provider.id === purchaseOrder.providerId)?.company;
      const createdByUser = myContext.users.find((user) => user.uid === purchaseOrder.createdBy);
      const createdBy = `${createdByUser?.name} ${createdByUser?.lastname}`;

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

  return (
    <Box p="1rem 1rem 2rem 1rem" sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
      <Typography variant="h4" mb="1rem">
        Ordenes de compra
      </Typography>
      <DataGrid
        rows={dataPurchaseOrders}
        columns={getColumns(handleEditPurchaseOrder, myContext?.user?.role)}
        onCellDoubleClick={((params) => setPurchaseOrderIdShow(params.row.id))}
        autoHeight
      />
      <EditOrder purchaseOrderId={purchaseOrderId} setPurchaseOrderId={setPurchaseOrderId} />
      <ShowOrder purchaseOrderId={purchaseOrderIdShow} setPurchaseOrderId={setPurchaseOrderIdShow} />
    </Box>
  );
};

const getColumns = (
  handleEditPurchaseOrder: (order: DataTablePurchaseOrder) => void,
  role: 'admin' | 'editor' | undefined
): GridColDef[] => [
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
    headerName: 'Fecha de creaci??n',
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
    renderCell({ row }: { row: DataTablePurchaseOrder }) {
      let text: string = '';
      let bgcolor: string = '';
      if (row.status === 'pending') {
        text = 'Pendiente';
        bgcolor = '#F2DF3A';
      }
      if (row.status === 'approved') {
        text = 'Aprobada';
        bgcolor = '#7DCE13';
      }
      if (row.status === 'rejected') {
        text = 'Rechazada';
        bgcolor = '#CC3636';
      }

      return (
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
          sx={{ bgcolor, borderRadius: '1rem', maxWidth: '7rem' }}
        >
          <Typography variant="caption" sx={{ color: '#fff' }}>
            {text}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'edit',
    headerName: ' ',
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    minWidth: 60,
    width: 60,
    renderCell({ row }: { row: DataTablePurchaseOrder }) {
      if(role === 'editor') return
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

export default OrdersTable;
