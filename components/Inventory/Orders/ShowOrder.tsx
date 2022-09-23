import { fs } from '../../../config/firebase';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { OrderedCar } from '../../../types/firestore';
import { useState, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import 'moment/locale/es';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const ShowOrder = ({ purchaseOrderId, setPurchaseOrderId }: Props) => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const purchaseOrder = myContext.purchaseOrders.find((order) => order.id === purchaseOrderId);
  const handleClose = () => {
    setPurchaseOrderId(null);
  };
  const [textStatus, setTextStatus] = useState<string>('');
  useEffect(() => {
    if (purchaseOrder?.status === 'pending') setTextStatus('Pendiente');
    if (purchaseOrder?.status === 'approved') setTextStatus('Aprobada');
    if (purchaseOrder?.status === 'rejected') setTextStatus('Rechazada');
  }, [purchaseOrder?.status]);

  return (
    <Modal
      open={!!purchaseOrderId}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Stack
        alignItems="stretch"
        gap="1rem"
        sx={{
          backgroundColor: '#fff',
          padding: 'clamp(.5rem, 2.5vw, 3rem)',
          borderRadius: '.25rem',
          width: '100%',
          maxWidth: '60rem',
          overflowY: 'auto',
          maxHeight: '100%',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {`Orden de compra # ${purchaseOrder?.id}`}
            </Typography>
            <Typography variant="body1">{moment(purchaseOrder?.date).locale('es').format('LLL')}</Typography>
          </Stack>
          <IconButton aria-label="Cerrar editar order de compra" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack alignItems="stretch" gap="1rem">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography variant="h5" sx={{ flex: '1 1 50%' }}>
              {myContext.providers.find((provider) => provider.id === purchaseOrder?.providerId)?.company}
            </Typography>
            <Typography variant="h5" sx={{ flex: '1 1 50%' }}>
              {`Estado: ${textStatus}`}
            </Typography>
          </Stack>
          <DataGrid
            rows={purchaseOrder?.orderedCars || []}
            getRowId={(row: OrderedCar) => row.name}
            columns={getColumns()}
            autoHeight
            hideFooter
          />
        </Stack>
      </Stack>
    </Modal>
  );
};

const getColumns = (): GridColDef[] => [
  {
    field: 'name',
    headerName: 'Nombre',
    flex: 1,
  },
  {
    field: 'detail',
    headerName: 'Detalle',
    flex: 1,
  },
  {
    field: 'year',
    headerName: 'Año',
    flex: 0.5,
  },
  {
    field: 'quantity',
    headerName: 'Cantidad',
    flex: 0.5,
  },
];

interface Props {
  purchaseOrderId: string | null;
  setPurchaseOrderId: Dispatch<SetStateAction<string | null>>;
}

export default ShowOrder;
