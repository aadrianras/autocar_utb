import { fs } from '../../../config/firebase';
import { Dispatch, SetStateAction } from 'react';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { OrderedCars } from '../../../types/firestore';
import { useState, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import 'moment/locale/es';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
];

const EditOrder = ({ purchaseOrderId, setPurchaseOrderId }: Props) => {
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const purchaseOrder = myContext.purchaseOrders.find((order) => order.id === purchaseOrderId);
  const [status, setStatus] = useState<'pending' | 'rejected' | 'approved' | undefined>(purchaseOrder?.status);
  const handleClose = () => {
    setPurchaseOrderId(null);
  };
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: SelectChangeEvent) => {
    setLoading(true);
    const newStatus = event.target.value as 'pending';
    try {
      const updatedPurchaseOrder = await fs.purchaseOrders.update({ id: purchaseOrder?.id, status: newStatus });
      const dbPurchaseOrders = await fs.purchaseOrders.getAll();
      setStatus(newStatus);
      if (!updatedPurchaseOrder || !dbPurchaseOrders) throw new Error('Error while getting data');
      //Display success message
      setMyContext({
        ...myContext,
        purchaseOrders: dbPurchaseOrders,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Orden de compra actulizada correctamente.',
        },
      });
      //Close modal
      handleClose();
    } catch (error) {
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al actualizar la orden, revisa tu datos.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

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
          <Stack direction="row" alignItems="center" gap=".5rem">
            {loading && <CircularProgress size="2rem" />}
            <IconButton
              aria-label="Cerrar editar order de compra"
              onClick={handleClose}
              sx={{ borderRadius: '.25rem' }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Stack alignItems="stretch" gap="1rem">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography variant="h5" sx={{ flex: '1 1 50%' }}>
              {myContext.providers.find((provider) => provider.id === purchaseOrder?.providerId)?.company}
            </Typography>
            <FormControl size="small" sx={{ flex: '1 1 50%' }}>
              <InputLabel id="purchase-order-status-label-id">Estado</InputLabel>
              <Select
                disabled={loading}
                name="status"
                labelId="purchase-order-status-label-id"
                id="purchase-order-status-id"
                value={statusOptions.find((option) => option.value === status)?.value}
                label="Estado"
                onChange={handleSubmit}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecciona el estado de la order</FormHelperText>
            </FormControl>
          </Stack>
          <DataGrid
            rows={purchaseOrder?.orderedCars || []}
            getRowId={(row: OrderedCars) => row.name}
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

export default EditOrder;
