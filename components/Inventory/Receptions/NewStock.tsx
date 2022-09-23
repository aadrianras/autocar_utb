import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { Stock, ReceptionOrder } from '../../../types/firestore';
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

const emptyStock = { carId: '', quantity: 0 };

const NewStock = () => {
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleClose = () => {
    setNewStock([emptyStock]);
    setIsModalOpen(false);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [receptionOrder, setReceptionOrder] = useState<Partial<ReceptionOrder>>(emptyReceptionOrder);
  const [newStock, setNewStock] = useState<Stock[]>([emptyStock]);
  const handleProvideChange = (event: SelectChangeEvent) => {
    setReceptionOrder({ ...receptionOrder, providerId: event.target.value as string });
  };

  const handleNewCar = () => {
    setNewStock([...newStock, emptyStock]);
  };
  const handleStockChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const updatedStock = [...newStock];
    updatedStock[idx] = { ...updatedStock[idx], [event.target.name]: event.target.value };
    setNewStock(updatedStock);
  };

  const handleCarChange = (event: SelectChangeEvent, idx: number) => {
    const updatedStock = [...newStock];
    updatedStock[idx] = { ...updatedStock[idx], [event.target.name]: event.target.value };
    setNewStock(updatedStock);
  };

  console.log({ newStock });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const receptionOrderWithStock = { ...receptionOrder, createdBy: myContext?.user?.uid, newStock };

    // Data check
    if (!receptionOrder.providerId)
      return setMyContext({
        ...myContext,
        snackbar: { open: true, msg: 'Selecciona un proveedor', severity: 'warning' },
      });
    setLoading(true);

    try {
      const newReceptionOrder = await fs.receptionOrders.create(receptionOrderWithStock);
      const dbReceptionOrders = await fs.receptionOrders.getAll();

      for (let i = 0; i < newStock.length; i++) {
        console.log({stock: newStock[i]?.quantity})
        const currentStock: number =
          Number(myContext?.cars?.find((car) => car?.id === newStock[i]?.carId)?.quantity)
          const _newStock: number = Number(newStock[i]?.quantity)
          const finalStock: number = currentStock + _newStock
        await fs.cars.update(newStock[i].carId, { quantity: finalStock });
      }

      const dbCars = await fs.cars.getAll();
      if (!newReceptionOrder || !dbCars) throw new Error('Error while getting data');

      //Reset form
      setNewStock([emptyStock]);
      //Display success message
      setMyContext({
        ...myContext,
        cars: dbCars,
        receptionOrders: dbReceptionOrders,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Orden de recepcion creada correctamente.',
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
      <Tooltip title="Nuevo registro de Stock" placement="left">
        <Fab
          color="secondary"
          size="small"
          aria-label="new reception"
          onClick={() => setIsModalOpen(true)}
          sx={{ position: 'absolute', bottom: '2rem', right: '6rem' }}
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
                  helperText="Fecha de creación de la order de recepción"
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

              {newStock.map((stock, idx) => (
                <NewStockDetail
                  stock={stock}
                  idx={idx}
                  key={idx}
                  handleStockChange={handleStockChange}
                  handleCarChange={handleCarChange}
                />
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

const NewStockDetail = ({ stock, idx, handleCarChange, handleStockChange }: NewStockDetailI) => {
  const { myContext } = useContext<MyContextState>(GlobalContext);

  return (
    <Grid spacing={1} sx={{ border: '1px solid #c4c4c4', p: 2, mb: 1, borderRadius: '.25rem' }} container>
      <Grid xs={8}>
        <FormControl size="small" sx={{ width: '100%' }}>
          <InputLabel id="car-type-select-id-label">Vehículo</InputLabel>
          <Select
            name="carId"
            fullWidth
            labelId="car-type-select-id-label"
            id="car-type-select-id"
            value={myContext.cars.find((car) => car.id === stock.carId)?.id || ''}
            label="Vehículo"
            onChange={(event) => handleCarChange(event, idx)}
          >
            {myContext.cars.map((car) => (
              <MenuItem key={car.id} value={car.id}>
                {car.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Selecciona un vehículo del inventario</FormHelperText>
        </FormControl>
      </Grid>
      <Grid xs={4}>
        <TextField
          id="quantity"
          name="quantity"
          label="Cantidad"
          helperText="Ingresa el nombre comercial de los fabricantes"
          value={stock.quantity}
          type="number"
          onChange={(event) => handleStockChange(event, idx)}
          variant="outlined"
          size="small"
          fullWidth
          required
        />
      </Grid>
    </Grid>
  );
};

interface NewStockDetailI {
  stock: Stock;
  idx: number;
  handleStockChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => void;
  handleCarChange: (event: SelectChangeEvent<string>, idx: number) => void;
}

export default NewStock;
