import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { Car, ReceptionOrder } from '../../../types/firestore';
import { useState, useContext, SyntheticEvent } from 'react';
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
import Divider from '@mui/material/Divider';
import moment from 'moment';
import 'moment/locale/es';

const emptyReceptionOrder: Partial<ReceptionOrder> = {
  date: Date.now(),
  createdBy: '',
  providerId: '',
};

const emptyCar: Car = {
  year: moment().year(),
  quantity: 0,
  name: '',
  cc: 0,
  company: '',
  edition: '',
  color: '',
  doors: 0,
  hp: 0,
  type: '',
  fuel: '',
  providerId: '',
};

const NewReception = () => {
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleClose = () => {
    setReceptionOrder(emptyReceptionOrder);
    setCars([emptyCar]);
    setIsModalOpen(false);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [receptionOrder, setReceptionOrder] = useState<Partial<ReceptionOrder>>(emptyReceptionOrder);
  const [cars, setCars] = useState<Car[]>([emptyCar]);

  const handleNewCar = () => {
    setCars([...cars, emptyCar]);
  };

  const handleCarChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const newCars = [...cars];
    newCars[idx] = { ...newCars[idx], [event.target.name]: event.target.value };
    setCars(newCars);
  };
  const handleCarTypeChange = (event: SelectChangeEvent, idx: number) => {
    const newCars = [...cars];
    newCars[idx] = { ...newCars[idx], type: event.target.value };
    setCars(newCars);
  }
  const handleProvideChange = (event: SelectChangeEvent) => {
    setReceptionOrder({ ...receptionOrder, providerId: event.target.value as string });
    const carWithNewProviderId = cars.map((car) => ({ ...car, providerId: event.target.value as string }));
    setCars(carWithNewProviderId);
  };


  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const validCars = cars.filter((car) => {
      if (
        !car.cc ||
        !car.color ||
        !car.company ||
        !car.doors ||
        !car.edition ||
        !car.fuel ||
        !car.hp ||
        !car.name ||
        !car.providerId ||
        !car.quantity ||
        !car.type
      )
        return false;
      return true;
    });

    const receptionOrderWithCars = { ...receptionOrder, createdBy: myContext.user?.uid, cars };
    //Data check
    if (!receptionOrder.providerId)
      return setMyContext({
        ...myContext,
        snackbar: { open: true, msg: 'Selecciona un proveedor', severity: 'warning' },
      });
    if (!cars?.length || !validCars.length)
      return setMyContext({
        ...myContext,
        snackbar: { open: true, msg: 'Debes añadir al menos un vehículo con todos los datos', severity: 'warning' },
      });
    setLoading(true);

    try {
      const newReceptionOrder = await fs.receptionOrders.create(receptionOrderWithCars);
      const dbReceptionOrders = await fs.purchaseOrders.getAll();
      if (!newReceptionOrder || !dbReceptionOrders) throw new Error('Error while getting data');

      //Save cars
      for (let i = 0; i < cars.length; i++) {
        await fs.cars.create(cars[i]);
      }

      //Reset form
      setReceptionOrder(emptyReceptionOrder);
      setCars([emptyCar]);
      //Display success message
      setMyContext({
        ...myContext,
        purchaseOrders: dbReceptionOrders,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Orden de recepcion correctamente.',
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
      <Tooltip title="Nueva orden de recepción" placement="left">
        <Fab
          color="primary"
          aria-label="new reception"
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
              Nueva orden de recepción
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
                  defaultValue={moment(receptionOrder.date).locale('es').format('LLL')}
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
                    value={myContext.providers.find((provider) => provider.id === receptionOrder.providerId)?.id || ''}
                    label="Proveedor"
                    onChange={handleProvideChange}
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

              {cars.map((car, idx) => (
                <NewCarDetail car={car} idx={idx} key={idx} handleCarChange={handleCarChange} handleCarTypeChange={handleCarTypeChange}/>
              ))}

              <Button
                type="submit"
                variant="contained"
                sx={{ marginRight: 'auto', width: '12rem' }}
                onClick={handleSubmit}
              >
                {loading ? <CircularProgress size="1.9rem" sx={{ color: '#fff' }} /> : 'Registrar'}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </>
  );
};

const NewCarDetail = ({ car, idx, handleCarChange, handleCarTypeChange }: NewCarDetail) => {

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
      <Grid xs={6}>
        <TextField
          id="company"
          name="company"
          label="Marca del vehículo"
          helperText="Ingresa el nombre comercial de los fabricantes"
          value={car.company}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={3}>
        <TextField
          id="edition"
          name="edition"
          label="Edición"
          helperText="Edición del vehículo"
          value={car.edition}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={3}>
        <FormControl size="small" sx={{width: '100%' }}>
          <InputLabel id="car-type-select-id-label">Tipo</InputLabel>
          <Select
            name='type'
            fullWidth
            labelId="car-type-select-id-label"
            id="car-type-select-id"
            value={types.find((type) => type.value === car.type)?.value || ''}
            label="Proveedor"
            onChange={(event) => handleCarTypeChange(event, idx)}
          >
            {types.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Tipo de vehículo</FormHelperText>
        </FormControl>
      </Grid>
      <Grid xs={3}>
        <TextField
          id="year"
          name="year"
          label="Año del modelo"
          helperText="Año de fabricación"
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
          id="color"
          name="color"
          label="Color"
          helperText="Color exterior"
          value={car.color}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={3}>
        <TextField
          id="doors"
          name="doors"
          label="Cantidad de puertas"
          helperText="Total de puertas"
          value={car.doors}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={3}>
        <TextField
          id="cc"
          name="cc"
          label="Cilindrada"
          helperText="Ingrese la cilindrada"
          value={car.cc}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={3}>
        <TextField
          id="hp"
          name="hp"
          label="Potencia"
          helperText="HP"
          value={car.hp}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={3}>
        <TextField
          id="fuel"
          name="fuel"
          label="Combustible"
          helperText="Tipo de combustible"
          value={car.fuel}
          onChange={(event) => handleCarChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid xs={6}>
        <Divider />
      </Grid>
      <Grid xs={6}>
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
    </Grid>
  );
};

interface NewCarDetail {
  car: Car;
  idx: number;
  handleCarChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => void;
  handleCarTypeChange: (event: SelectChangeEvent<string>, idx: number) => void;
}

const types = [
  { value: 'citycar', label: 'Citycar' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'sport', label: 'Deportivo' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Camioneta' },
];

export default NewReception;
