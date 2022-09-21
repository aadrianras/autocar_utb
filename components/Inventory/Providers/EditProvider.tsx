import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { Provider } from '../../../types/firestore';
import { useState, useContext, Dispatch, SetStateAction, useEffect } from 'react';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
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

const EditProvider = ({ isEditModalOpen, setIsEditModalOpen, provider, setProvider }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [form, setForm] = useState<Provider>({
    id: provider?.id || '',
    address: provider?.address || '',
    contactName: provider?.contactName || '',
    city: provider?.city || cities[0],
    company: provider?.company || '',
    contactPhone: provider?.contactPhone || '',
  });

  const handleClose = () => {
    setProvider(null);
    //Reset form
    setForm({
      id: '',
      address: '',
      contactName: '',
      city: cities[0],
      company: '',
      contactPhone: '',
    });
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (provider?.id && provider?.id !== form?.id) {
      setForm({
        id: provider?.id || '',
        address: provider?.address || '',
        contactName: provider?.contactName || '',
        city: provider?.city || cities[0],
        company: provider?.company || '',
        contactPhone: provider?.contactPhone || '',
      });
    }
  }, [provider]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setForm({ ...form, city: event.target.value as string });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const editedProvider = await fs.providers.update(form);
      const dbProviders = await fs.providers.getAll();
      if (!editedProvider || !dbProviders) throw new Error('Error while updating context');
      //Reset form
      setForm({
        id: '',
        address: '',
        contactName: '',
        city: cities[0],
        company: '',
        contactPhone: '',
      });
      //Display success message
      setMyContext({
        ...myContext,
        providers: dbProviders,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Proveedor actualizado correctamente.',
        },
      });
      setProvider(null);
      //Close providers modal
      setIsEditModalOpen(false);
    } catch (error) {
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al actualizado al proveedor, revisa tu datos.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={isEditModalOpen && provider !== null}
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
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editar proveedor
            </Typography>
            <IconButton aria-label="Cerrar nuevo proveedor" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <form>
            <Stack alignItems="stretch" gap="1rem">
              <TextField
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                label="Compañia"
                helperText="Nombre comercial / Razon Social"
                variant="outlined"
                size="small"
                required
              />
              <TextField
                id="contactName"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                label="Encargado"
                helperText="Ingresa el nombre de la persona encargada"
                variant="outlined"
                size="small"
                required
              />
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
                  value={cities.find((city) => city === form.city)}
                  label="Ciudad"
                  onChange={handleSelectChange}
                >
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" sx={{ marginRight: 'auto', width: '12rem' }} onClick={handleSubmit}>
                {loading ? <CircularProgress size='1.9rem' sx={{ color: '#fff' }} /> : 'Editar'}
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
  provider: Provider | null;
  setProvider: Dispatch<SetStateAction<Provider | null>>;
}

const cities = ['La Paz', 'Cochabamba', 'Santa Cruz'];

export default EditProvider;
