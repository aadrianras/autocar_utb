import { Button, IconButton, Modal, Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { SaleOrder } from '../../../types/firestore';
import CloseIcon from '@mui/icons-material/Close';
import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';

const DeleteOrder = ({ isDeleteModalOpen, setIsDeleteModalOpen, saleOrder, setSaleOrder }: Props) => {
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [loading, setLoading] = useState<boolean>(false);
  const handleClose = () => {
    setIsDeleteModalOpen(false);
    setSaleOrder(null);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const deleteSaleOrder = await fs.saleOrder.delete(saleOrder?.id || '');
      if (!deleteSaleOrder) throw new Error('Error while deleting client');

      const dbSaleOrders = await fs.saleOrder.getAll();
      if (!dbSaleOrders) throw new Error('Error while deleting client');

      //Display success message
      setMyContext({
        ...myContext,
        saleOrders: dbSaleOrders,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Orden de venta eliminada correctamente.',
        },
      });
    } catch (error) {
      console.log({ error });
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al eliminar la orden de venta.',
        },
      });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Modal
      open={isDeleteModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Stack gap="1rem" bgcolor="#fff" borderRadius=".25rem" p="2rem" maxWidth="40rem">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ¿Deseas eliminar la orden de venta?
          </Typography>
          <IconButton aria-label="Cerrar eliminar" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography id="modal-modal-description">
          {`Esta a punto de eliminar definitivamente la infomación de la orden de venta, ¿Estas seguro?`}
        </Typography>
        <Stack direction="row" gap="1rem">
          <Button disabled={loading} variant="contained" size="large" type="submit" onClick={handleSubmit}>
            {loading ? 'Eliminando...' : 'Si, eliminar'}
          </Button>
          <Button disabled={loading} variant="outlined" size="large" type="submit" onClick={handleClose}>
            No, cancelar
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

interface Props {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
  saleOrder: SaleOrder | null;
  setSaleOrder: Dispatch<SetStateAction<SaleOrder | null>>;
}

export default DeleteOrder;
