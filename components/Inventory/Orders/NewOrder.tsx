import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { OrderedCars, Provider, PurchaseOrder } from '../../../types/firestore';
import { useState, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import 'moment/locale/es';

const defaultFormValue: PurchaseOrder = {
  id: '',
  date: new Date(Date.now()),
  createdBy: '',
  providerId: '',
  orderedCars: [{ name: '', detail: '', quantity: 0, year: moment().year() }],
  status: 'pending'
}

const NewOrder = () => {
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleClose = () => {
    setForm(defaultFormValue);
    setIsModalOpen(false)
  };
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<PurchaseOrder>(defaultFormValue);

  const handleNewCar = () => {
    setForm({
      ...form,
      orderedCars: [...form.orderedCars, { name: '', detail: '', quantity: 0, year: moment().year() }],
    });
  };

  const handleCarChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const newOrderedCars = [...form.orderedCars];
    newOrderedCars[idx] = { ...newOrderedCars[idx], [event.target.name]: event.target.value };
    setForm((form) => ({ ...form, orderedCars: newOrderedCars }));
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setForm({ ...form, providerId: event.target.value as string });
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      date: new Date(Date.now()),
      createdBy: myContext.user?.uid,
      orderedCars: form.orderedCars.filter((car) => car.name && car.quantity && car.year),
    };
    delete data.id

    //Data check
    if(!data.providerId) return setMyContext({...myContext, snackbar: {open: true, msg: 'Selecciona un proveedor', severity: 'warning'}})
    if(!data.orderedCars.length) return setMyContext({...myContext, snackbar: {open: true, msg: 'Debes añadir al menos un vehículo con todos los datos', severity: 'warning'}})
    setLoading(true);

    try {
      const newPurchaseOrder = await fs.purchaseOrders.create(data);
      const dbPurchaseOrders = await fs.purchaseOrders.getAll();
      if (!newPurchaseOrder || !dbPurchaseOrders) throw new Error('Error while getting data');
      //Reset form
      setForm(defaultFormValue);
      //Display success message
      setMyContext({
        ...myContext,
        purchaseOrders: dbPurchaseOrders,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Orden creada correctamente.',
        },
      });
      //Close providers modal
      setIsModalOpen(false);
    } catch (error) {
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al crear la orden, revisa tu datos.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Nueva orden de compra" placement="left">
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
            maxWidth: '60rem',
            overflowY: 'auto',
            maxHeight: '100%',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Nueva orden de compra
            </Typography>
            <IconButton aria-label="Cerrar nuevo proveedor" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <form>
            <Stack alignItems="stretch" gap="1rem">
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                <TextField
                  id="date"
                  name="date"
                  defaultValue={moment(form.date).locale('es').format('LLL')}
                  label="Fecha de creación"
                  helperText="Fecha de creación de la order de compra"
                  variant="outlined"
                  size="small"
                  required
                  disabled
                  sx={{ flex: '1 1 50%' }}
                />
                <FormControl size="small" sx={{ flex: '1 1 50%' }}>
                  <InputLabel id="provider-select-id-label">Proveedor</InputLabel>
                  <Select
                    labelId="provider-select-id-label"
                    id="provider-select-id"
                    value={myContext.providers.find((provider) => provider.id === form.providerId)?.id || ''}
                    label="Proveedor"
                    onChange={handleSelectChange}
                  >
                    {myContext.providers.map((provider) => (
                      <MenuItem key={provider.id} value={provider.id}>
                        {provider.company}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Selecciona al proveedor de los vehículos</FormHelperText>
                </FormControl>
              </Stack>
              <Button variant="text" color="secondary" sx={{ marginLeft: 'auto' }} onClick={handleNewCar}>
                Añadir vehículo
              </Button>

              {form.orderedCars.map((car, idx) => (
                <NewCarDetail car={car} idx={idx} key={idx} handleCarChange={handleCarChange} />
              ))}

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

const NewCarDetail = ({ car, idx, handleCarChange }: NewCarDetail) => {
  return (
    <Grid spacing={1} sx={{ border: '1px solid #c4c4c4', p: 2, mb: 1, borderRadius: '.25rem' }} container>
      <Grid xs={6}>
        <TextField
          id="name"
          name="name"
          label="Nombre del modelo"
          helperText="Ingresa el nombre comercial del vehículo"
          value={car.name}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={3}>
        <TextField
          id="year"
          name="year"
          label="Año del modelo"
          helperText="Ingresa el año de creación del modelo"
          value={car.year}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={3}>
        <TextField
          id="quantity"
          name="quantity"
          label="Cantidad"
          helperText="Ingresa el total de vehículos a ordenar"
          value={car.quantity}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12}>
        <TextField
          id="detail"
          name="detail"
          label="Detalle"
          helperText="Ingresa las caracteristicas del vehículo"
          value={car.detail}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          multiline
          fullWidth
          required
        />
      </Grid>
    </Grid>
  );
};

interface NewCarDetail {
  car: OrderedCars;
  idx: number;
  handleCarChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => void;
}

export default NewOrder;
