import { Car, OrderedCarForSale, SaleOrder } from '../../../types/firestore';
import { Divider, FormHelperText } from '@mui/material';
import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { useState, useContext, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import 'moment/locale/es';
import { format } from 'path';

const NewOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [form, setForm] = useState<SaleOrder>({
    clientId: '',
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
    cars: [defaultCar],
    total: 0,
    invoice: uuidv4(),
    status: 'pending',
  });

  const handleClose = () => {
    //Reset form
    setForm({
      clientId: '',
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      cars: [defaultCar],
      total: 0,
      invoice: uuidv4(),
      status: 'pending',
    });
    setIsModalOpen(false);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setForm({ ...form, clientId: event.target.value as string });
  };

  useEffect(() => {
    const total: number = form.cars.reduce((acc, cur) => acc + cur.subTotal, 0);
    setForm((prev) => ({ ...prev, total }));
  }, [form.cars]);

  const handleSubmit = async () => {
    setLoading(true);

    if (!form.clientId || !form.date || !form.cars || !form.total || !form.invoice || !form.status) {
      setMyContext({
        ...myContext,
        snackbar: { open: true, msg: 'Debes llenar correctamente todos los campos.', severity: 'warning' },
      });
      setLoading(false);
      return;
    }

    try {
      const newSaleOrder = await fs.saleOrder.create(form);
      const dbSaleOrders = await fs.saleOrder.getAll();

      if (newSaleOrder?.cars?.length) {
        for (let i = 0; i < newSaleOrder?.cars?.length; i++) {
          const car: Car | undefined = myContext.cars.find((c) => c?.id === newSaleOrder.cars[i].carId);
          if (car) {
            const stock = car?.quantity || 0;
            const result = stock - newSaleOrder.cars[i].quantity < 0 ? 0 : stock - newSaleOrder.cars[i].quantity;

            await fs.cars.update(car?.id as string, { ...car, quantity: result });
          }
        }
      }

      const dbCars = await fs.cars.getAll();

      if (!newSaleOrder || !dbSaleOrders || !dbCars) throw new Error('Error while creating client');
      //Reset form
      setForm({
        clientId: '',
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        cars: [defaultCar],
        total: 0,
        invoice: uuidv4(),
        status: 'pending',
      });
      //Display success message
      setMyContext({
        ...myContext,
        saleOrders: dbSaleOrders,
        cars: dbCars,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Orden de venta creada correctamente.',
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
          msg: 'Ocurrio un problema al crear la order de venta, revisa tu datos.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Agregar nueva venta" placement="left">
        <Fab
          color="primary"
          aria-label="new sale order"
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
            overflowY: 'auto',
            height: { xs: '100%', md: 'max-content' },
            maxHeight: { xs: '100%', md: '90%' },
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Nueva orden de venta
            </Typography>
            <IconButton aria-label="Cerrar nueva venta" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <form>
            <Stack alignItems="stretch" gap="1rem">
              <TextField
                id="date"
                name="date"
                defaultValue={moment(form.date).locale('es').format('LLL')}
                label="Fecha de creaci??n"
                helperText="Fecha de creaci??n de la order de compra"
                variant="outlined"
                size="small"
                required
                disabled
              />
              <FormControl size="small" fullWidth>
                <InputLabel id="client-select-label-id">Cliente</InputLabel>
                <Select
                  labelId="client-select-label-id"
                  id="client-select-id"
                  value={myContext.clients.find((client) => client.id === form.clientId)?.id || ''}
                  label="Cliente"
                  onChange={handleSelectChange}
                >
                  {myContext.clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {`${client.firstName} ${client.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Selecciona al cliente</FormHelperText>
              </FormControl>

              <Button
                sx={{ marginLeft: 'auto' }}
                onClick={() => {
                  setForm((prev) => ({ ...prev, cars: [...prev.cars, defaultCar] }));
                }}
              >
                + Agregar vehiculo
              </Button>

              {form.cars.map((car, idx) => (
                <OrderedCar key={idx} car={car} idx={idx} setForm={setForm} />
              ))}

              <Divider />

              <TextField
                sx={{ flex: '0 1 auto' }}
                id={`Total`}
                name="Total"
                type="number"
                value={form.total}
                label="Total ($us)"
                variant="outlined"
                size="small"
                disabled
                required
              />

              <Divider />

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

const OrderedCar = ({ car, idx, setForm }: OrderedCarProps) => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const maxQuantity = myContext.cars.find((dbCar) => dbCar.id === car.carId)?.quantity || 0;

  useEffect(() => {
    if (!car.carId || !car.quantity) {
      setForm((prev) => {
        const updatedCars: OrderedCarForSale[] = prev.cars.map((car, j) => {
          if (j === idx) return { ...car, subTotal: 0 };
          return car;
        });
        return { ...prev, cars: updatedCars };
      });
    } else {
      const carPrice: number = myContext?.cars?.find((dbCar) => dbCar?.id === car?.carId)?.price || 1;
      const subTotal = (+carPrice + +carPrice * +car.profit) * car.quantity;
      setForm((prev) => {
        const updatedCars: OrderedCarForSale[] = prev.cars.map((car, j) => {
          if (j === idx) return { ...car, subTotal };
          return car;
        });
        return { ...prev, cars: updatedCars };
      });
    }
  }, [car.carId, car.quantity, car.profit, idx, myContext?.cars, setForm]);

  const handleChange = (event: SelectChangeEvent) => {
    setForm((prev) => {
      const updatedCars: OrderedCarForSale[] = prev.cars.map((car, j) => {
        if (j === idx) return { ...car, carId: event.target.value };
        return car;
      });
      return { ...prev, cars: updatedCars };
    });
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => {
      const updatedCars: OrderedCarForSale[] = prev.cars.map((car, j) => {
        if (j === idx) return { ...car, quantity: +event.target.value } as OrderedCarForSale;
        return car;
      });
      return { ...prev, cars: updatedCars };
    });
  };

  return (
    <Stack sx={{ flexDirection: 'column', gap: '.5rem', flexWrap: 'wrap' }}>
      <FormControl size="small" fullWidth sx={{ flex: '1 0 auto' }}>
        <InputLabel id={`ordered-car-${idx}`}>Vehiculo</InputLabel>
        <Select
          labelId={`ordered-car-${idx}`}
          id={`or-car-${idx}`}
          value={car.carId}
          label="Vehiculo"
          onChange={handleChange}
        >
          {myContext.cars
            .filter((car) => car.quantity > 0)
            .map((car) => (
              <MenuItem key={car.id} value={car.id}>{`${car.name} - ${car.company} - ${car.year}`}</MenuItem>
            ))}
        </Select>
      </FormControl>

      <Stack sx={{ flexDirection: 'row', gap: '.5rem', flexWrap: 'nowrap' }}>
        <TextField
          sx={{ flex: '0 1 auto' }}
          id={`quantity-${idx}`}
          name="quantity"
          value={car.quantity}
          InputProps={{ inputProps: { min: 0, max: maxQuantity } }}
          onChange={handleQuantityChange}
          type="number"
          label="Cantidad"
          variant="outlined"
          size="small"
          required
        />

        <TextField
          sx={{ flex: '0 1 auto' }}
          id={`subTotal-${idx}`}
          name="subTotal"
          type="number"
          value={car.subTotal}
          label="Sub-Total ($us)"
          variant="outlined"
          size="small"
          disabled
          required
        />
      </Stack>
    </Stack>
  );
};

const defaultCar: OrderedCarForSale = {
  carId: '',
  profit: 0.13,
  quantity: 0,
  subTotal: 0,
};

interface OrderedCarProps {
  car: OrderedCarForSale;
  idx: number;
  setForm: React.Dispatch<React.SetStateAction<SaleOrder>>;
}

export default NewOrders;
