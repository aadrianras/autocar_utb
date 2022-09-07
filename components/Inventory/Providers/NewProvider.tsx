import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useState, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { Provider } from '../../../types/firestore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { db } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';

const NewProvider = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleClose = () => setIsModalOpen(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [form, setForm] = useState<Provider>({
    id: '',
    address: '',
    contactName: '',
    city: cities[0],
    company: '',
    contactPhone: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setForm({ ...form, city: event.target.value as string });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = {...form}
    delete data.id
    console.log({ data });
    try {
        const newProvider = await db.collection('providers').add(data);
        console.log({ newProvider });
        //Reset form
        setForm({
          id: '',
          address: '',
          contactName: '',
          city: cities[0],
          company: '',
          contactPhone: '',
        });
        //Close providers modal
        setIsModalOpen(false)
        //Display success message
        setMyContext({
          ...myContext,
          snackbar: {
            open: true,
            severity: 'success',
            msg: 'Proveedor creado correctamente.',
          },
        });
    } catch (error) {
        setMyContext({
          ...myContext,
          snackbar: {
            open: true,
            severity: 'error',
            msg: 'Ocurrio un problema al crear al proveedor, revisa tu datos.',
          },
        });
    } finally {
        setLoading(false)
    }
  }

  return (
    <>
      <Tooltip title="Agregar nuevo proveedor" placement="left">
        <Fab
          color="primary"
          aria-label="new provider"
          onClick={() => setIsModalOpen(true)}
          sx={{ position: 'absolute', bottom: '2rem', right: '2rem' }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Modal
        open={isModalOpen}
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
              Nuevo proveedor
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
              <Button variant="contained" sx={{ marginRight: 'auto' }} onClick={handleSubmit}>
                Registrar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </>
  );
};

const cities = ['La Paz', 'Cochabamba', 'Santa Cruz'];

export default NewProvider;
