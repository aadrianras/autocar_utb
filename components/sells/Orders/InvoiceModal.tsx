import 'moment/locale/es';
import { IconButton, Modal, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';
import { SaleOrder } from '../../../types/firestore';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { useContext } from 'react';
import moment from 'moment';
import Divider from '@mui/material/Divider';

const InvoiceModal = ({ isInvoiceModalOpen, setIsInvoiceModalOpen, saleOrder, setSaleOrder }: Props) => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const client = myContext.clients.find((client) => client.id === saleOrder?.clientId);

  const handleClose = () => {
    setIsInvoiceModalOpen(false);
    setSaleOrder(null);
  };

  return (
    <Modal
      open={isInvoiceModalOpen}
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
          maxWidth: '40rem',
          overflowY: 'auto',
          height: { xs: '100%', md: 'max-content' },
          maxHeight: { xs: '100%', md: '90%' },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Resumen de venta
          </Typography>
          <IconButton aria-label="Cerrar nueva venta" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        {saleOrder?.status === 'pending' && (
          <Typography id="modal-modal-title" variant="body1" component="h2">
            {`Factura # ${saleOrder.invoice} - (Pendiente)`}
          </Typography>
        )}

        {saleOrder?.status === 'completed' && (
          <Typography id="modal-modal-title" variant="body1" component="h2">
            {`Factura # ${saleOrder.invoice}`}
          </Typography>
        )}
        {saleOrder?.status === 'rejected' && (
          <Typography id="modal-modal-title" variant="body1" component="h2">
            Orden rechazada
          </Typography>
        )}
        <Typography id="modal-modal-title" variant="body1" component="h2">
          {`Cliente: ${client?.firstName} ${client?.lastName} - Telf. ${client?.contactPhone}`}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Typography id="modal-modal-title" variant="body1" component="h2">
            {`Razon social: ${client?.invoiceName}`}
          </Typography>
          <Typography id="modal-modal-title" variant="body1" component="h2">
            {`NIT: ${client?.invoiceNumber}`}
          </Typography>
        </Stack>

        <Typography id="modal-modal-title" variant="caption" component="h2">
          {`Venta realizada el ${moment(saleOrder?.date).format('LLLL')}`}
        </Typography>
        <Divider />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Detalle
        </Typography>
        {saleOrder?.cars.map((car, idx) => {
          const dbCar = myContext.cars.find((c) => c.id === car.carId);

          return (
            <Typography key={idx} id="modal-modal-title" variant="body1" component="h2">
              {`${idx + 1}.- ${dbCar?.name} año ${dbCar?.year} - ${car.quantity} unidades - $us ${car.subTotal}`}
            </Typography>
          );
        })}
        <Divider />
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'right' }}>
          {`Total en $us ${saleOrder?.total}`}
        </Typography>
      </Stack>
    </Modal>
  );
};

interface Props {
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: Dispatch<SetStateAction<boolean>>;
  saleOrder: SaleOrder | null;
  setSaleOrder: Dispatch<SetStateAction<SaleOrder | null>>;
}

export default InvoiceModal;
