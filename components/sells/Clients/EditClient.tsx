import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { Client } from '../../../types/firestore';
import { useState, useContext, Dispatch, SetStateAction, useEffect } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Fab, FormHelperText, Tooltip } from '@mui/material';

const EditClient = ({ isEditModalOpen, setIsEditModalOpen, client, setClient }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [form, setForm] = useState<Client>({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    email: client?.email || '',
    city: client?.city || '',
    address: client?.address || '',
    invoiceName: client?.invoiceName || '',
    invoiceNumber: client?.invoiceNumber || '',
    contactPhone: client?.contactPhone || '',
  });

  const handleClose = () => {
    setClient(null);
    //Reset form
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      city: '',
      address: '',
      invoiceName: '',
      invoiceNumber: '',
      contactPhone: '',
    });
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (client?.id && client?.id !== form?.id) {
      setForm({
        id: client?.id || '',
        firstName: client?.firstName || '',
        lastName: client?.lastName || '',
        email: client?.email || '',
        city: client?.city || '',
        address: client?.address || '',
        invoiceName: client?.invoiceName || '',
        invoiceNumber: client?.invoiceNumber || '',
        contactPhone: client?.contactPhone || '',
      });
    }
  }, [client, form?.id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setForm({ ...form, city: event.target.value as string });
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.city ||
      !form.address ||
      !form.invoiceName ||
      !form.invoiceNumber ||
      !form.contactPhone
    ) {
      setMyContext({
        ...myContext,
        snackbar: { open: true, msg: 'Debes llenar correctamente todos los campos.', severity: 'warning' },
      });
      setLoading(false);
      return;
    }

    try {
      const newClient = await fs.client.update(form);
      const dbClients = await fs.client.getAll();
      if (!newClient || !dbClients) throw new Error('Error while updating client');
      //Reset form
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        address: '',
        invoiceName: '',
        invoiceNumber: '',
        contactPhone: '',
      });
      //Display success message
      setMyContext({
        ...myContext,
        clients: dbClients,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Cliente actualizado correctamente.',
        },
      });
      //Close providers modal
      setIsEditModalOpen(false);
    } catch (error) {
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al actualizar al cliente, revisa tu datos.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Agregar nuevo cliente" placement="left">
        <Fab
          color="primary"
          aria-label="new provider"
          onClick={() => setIsEditModalOpen(true)}
          sx={{ position: 'absolute', bottom: '2rem', right: '2rem' }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Modal
        open={isEditModalOpen}
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
            maxWidth: '35rem',
            overflowY: 'auto',
            height: '100%',
            maxHeight: '90%',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Nuevo cliente
            </Typography>
            <IconButton aria-label="Cerrar nuevo cliente" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <form>
            <Stack alignItems="stretch" gap="1rem">
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap=".5rem">
                <TextField
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  label="Nombre"
                  helperText="Nombre del cliente"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                />
                <TextField
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  label="Apellido"
                  helperText="Apellido del cliente"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                />
              </Stack>
              <TextField
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                label="Correo electrónico"
                helperText="Ingresa el correo para contactar al cliente"
                variant="outlined"
                size="small"
                required
              />
              <TextField
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                label="Direccion"
                helperText="Ingresa la dirección de la oficina central"
                variant="outlined"
                size="small"
                required
              />
              <FormControl size="small" fullWidth>
                <InputLabel id="city-select-label-id">Ciudad</InputLabel>
                <Select
                  labelId="city-select-label-id"
                  id="city-select-id"
                  value={cities.find((city) => city === form.city) || ''}
                  label="Ciudad"
                  onChange={handleSelectChange}
                >
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Selecciona la ciudad del cliente</FormHelperText>
              </FormControl>
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap=".5rem">
                <TextField
                  id="invoiceName"
                  name="invoiceName"
                  value={form.invoiceName}
                  onChange={handleChange}
                  label="Razon social | Nombre NIT"
                  helperText="Nombre para la factura"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                />
                <TextField
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={handleChange}
                  label="NIT"
                  helperText="Numero de NIT para la factura"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                />
              </Stack>
              <TextField
                id="contactPhone"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                label="Teléfono"
                helperText="Ingresa el teléfono para contactar a la compañia"
                variant="outlined"
                size="small"
                error={form?.contactPhone?.length > 0 && !/[0-9]/.test(form.contactPhone)}
                required
              />
              <Button variant="contained" sx={{ marginRight: 'auto', width: '12rem' }} onClick={handleSubmit}>
                {loading ? <CircularProgress size="1.9rem" sx={{ color: '#fff' }} /> : 'Registrar'}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </>
  );
};

interface Props {
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
  client: Client | null;
  setClient: Dispatch<SetStateAction<Client | null>>;
}

const cities = ['La Paz', 'Cochabamba', 'Santa Cruz'];

export default EditClient;
