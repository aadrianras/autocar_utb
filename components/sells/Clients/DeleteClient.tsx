import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Client } from '../../../types/firestore';
import CloseIcon from '@mui/icons-material/Close';
import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';

const DeleteClient = ({ isDeleteModalOpen, setIsDeleteModalOpen, client, setClient }: Props) => {
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [loading, setLoading] = useState<boolean>(false);
  const handleClose = () => {
    setIsDeleteModalOpen(false);
    setClient(null);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const deleteClient = await fs.client.delete(client?.id || '');
      if (!deleteClient) throw new Error('Error while deleting client');

      const dbClients = await fs.client.getAll();
      if (!dbClients) throw new Error('Error while deleting client');

      //Display success message
      setMyContext({
        ...myContext,
        clients: dbClients,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Cliente eliminado correctamente.',
        },
      });
    } catch (error) {
      console.log({ error });
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al eliminar al cliente.',
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
            ¿Deseas eliminar al cliente?
          </Typography>
          <IconButton aria-label="Cerrar nuevo cliente" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography id="modal-modal-description">
          {`Esta a punto de eliminar definitivamente la infomación del cliente "${client?.firstName} ${client?.lastName}", ¿Estas seguro?`}
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
  client: Client | null;
  setClient: Dispatch<SetStateAction<Client | null>>;
}

export default DeleteClient;
