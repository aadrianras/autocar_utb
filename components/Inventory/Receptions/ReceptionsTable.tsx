import 'moment/locale/es';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { PurchaseOrder } from '../../../types/firestore';
import { useContext, useState, useEffect } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import moment from 'moment';



const ReceptionsTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const [dataReceptionOrders, setDataReceptionOrders] = useState<DataReceptionOrder[]>([])
  
  useEffect(() => {
    const formatedData = myContext.receptionOrders.map(order => {
      const company = myContext.providers.find((provider) => provider.id === order.providerId)?.company;
      const createdByUser = myContext.users.find((user) => user.uid === order.createdBy);
      const createdBy = `${createdByUser?.name} ${createdByUser?.lastname}`;
      return {
        id: order.id,
        company,
        createdBy,
        date: moment(order.date).locale('es').format('LLL'),
      } as DataReceptionOrder;
    })
    setDataReceptionOrders(formatedData)

  }, [myContext.receptionOrders])

  return (
    <Box p="1rem 1rem 2rem 1rem" sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
      <Typography variant="h4" mb="1rem">
        Ordenes de recepción
      </Typography>
      <DataGrid
        rows={dataReceptionOrders || []}
        columns={getColumns()}
        // onCellDoubleClick={((params) => setPurchaseOrderIdShow(params.row.id))}
        autoHeight
      />
      {/* <EditOrder purchaseOrderId={purchaseOrderId} setPurchaseOrderId={setPurchaseOrderId} /> */}
      {/* <ShowOrder purchaseOrderId={purchaseOrderIdShow} setPurchaseOrderId={setPurchaseOrderIdShow} /> */}
    </Box>
  );
}

const getColumns = (): GridColDef[] => [
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
  // {
  //   field: 'edit',
  //   headerName: ' ',
  //   hideable: false,
  //   disableColumnMenu: true,
  //   hideSortIcons: true,
  //   minWidth: 60,
  //   width: 60,
  //   renderCell({ row }: { row: DataTablePurchaseOrder }) {
  //     if(role === 'editor') return
  //     return (
  //       <Box display="flex" width="100%" justifyContent="center" alignItems="center">
  //         <IconButton sx={{ borderRadius: '.25rem' }} onClick={() => handleEditReceptionOrder(row)}>
  //           <EditRoundedIcon />
  //         </IconButton>
  //       </Box>
  //     );
  //   },
  // },
];

interface DataReceptionOrder {
  id: string
  company: string
  createdBy: string
  date: string
}

export default ReceptionsTable;