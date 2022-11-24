import 'moment/locale/es';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { useContext, useState, useEffect } from 'react';
import moment from 'moment';


const InventoryTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  return (
    <Box p="1rem 1rem 2rem 1rem" sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
      <Typography variant="h4" mb="1rem">
        Inventario de vehículo
      </Typography>
      <DataGrid
        rows={myContext.cars || []}
        columns={getColumns()}
        autoHeight
      />
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
    field: 'name',
    headerName: 'Modelo',
    flex: 2,
  },
  {
    field: 'company',
    headerName: 'Marca',
    flex: 1,
  },
  {
    field: 'edition',
    headerName: 'Edición',
    flex: 1,
  },
  {
    field: 'type',
    headerName: 'Tipo',
    flex: 1,
  },
  {
    field: 'cc',
    headerName: 'cc',
    flex: 1,
  },
  {
    field: 'hp',
    headerName: 'HP',
    flex: 1,
  },
  {
    field: 'color',
    headerName: 'Color',
    flex: 1,
  },
  {
    field: 'doors',
    headerName: 'Puertas',
    flex: 1,
  },
  {
    field: 'fuel',
    headerName: 'Combustible',
    flex: 1,
  },
  {
    field: 'year',
    headerName: 'Año',
    flex: 1,
  },
  {
    field: 'quantity',
    headerName: 'Stock',
    flex: 1,
  },
  {
    field: 'price',
    headerName: 'Precio Unitario ($us)',
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

export default InventoryTable;