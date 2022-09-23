import { Dispatch, SetStateAction } from 'react';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { Car } from '../../../types/firestore';
import { useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import moment from 'moment';
import 'moment/locale/es';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const ShowOrder = ({ receptionOrderId, setReceptionOrderId }: Props) => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const receptionOrder = myContext.receptionOrders.find((order) => order.id === receptionOrderId);
  const handleClose = () => {
    setReceptionOrderId(null);
  };

  return (
    <Modal
      open={!!receptionOrderId}
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
              {`Orden de compra # ${receptionOrder?.id}`}
            </Typography>
            <Typography variant="body1">{moment(receptionOrder?.date).locale('es').format('LLL')}</Typography>
          </Stack>
          <IconButton aria-label="Cerrar editar order de compra" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack alignItems="stretch" gap="1rem">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography variant="h5" sx={{ flex: '1 1 50%' }}>
              {myContext.providers.find((provider) => provider.id === receptionOrder?.providerId)?.company}
            </Typography>
          </Stack>
          <DataGrid
            rows={receptionOrder?.cars || []}
            getRowId={(row: Car) => row.name}
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
    field: 'cc',
    headerName: 'cc',
    flex: 1,
  },
  {
    field: 'fuel',
    headerName: 'Combustible',
    flex: 1,
  },
  {
    field: 'color',
    headerName: 'Color',
    flex: 1,
  },
  {
    field: 'type',
    headerName: 'Tipo',
    flex: 1,
  },
  {
    field: 'year',
    headerName: 'Año',
    flex: 1,
  },
  {
    field: 'quantity',
    headerName: 'Cantidad',
    flex: 1,
  },
];

interface Props {
  receptionOrderId: string | null;
  setReceptionOrderId: Dispatch<SetStateAction<string | null>>;
}

export default ShowOrder;
