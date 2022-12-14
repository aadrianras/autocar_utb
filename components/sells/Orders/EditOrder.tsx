import { OrderedCarForSale, SaleOrder } from '../../../types/firestore';
import { Divider, FormHelperText } from '@mui/material';
import { fs } from '../../../config/firebase';
import { GlobalContext, MyContextState } from '../../../pages/_app';
import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
import 'moment/locale/es';
import moment from 'moment';

const NewOrders = ({ isEditModalOpen, setIsEditModalOpen, saleOrder, setSaleOrder }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [form, setForm] = useState<SaleOrder>({
    id: saleOrder?.id || '',
    clientId: saleOrder?.clientId || '',
    date: saleOrder?.date || '',
    cars: saleOrder?.cars || [],
    total: saleOrder?.total || 0,
    invoice: saleOrder?.invoice || '',
    status: saleOrder?.status || 'pending',
  });

  useEffect(() => {
    if (saleOrder) {
      setForm({
        id: saleOrder?.id || '',
        clientId: saleOrder?.clientId || '',
        date: saleOrder?.date || '',
        cars: saleOrder?.cars || [],
        total: saleOrder?.total || 0,
        invoice: saleOrder?.invoice || '',
        status: saleOrder?.status || 'pending',
      });
    } else {
      setForm({
        id: '',
        clientId: '',
        date: '',
        cars: [],
        total: 0,
        invoice: '',
        status: 'pending',
      });
    }
  }, [saleOrder]);

  const handleClose = () => {
    //Reset form
    setForm({
      clientId: '',
      date: '',
      cars: [defaultCar],
      total: 0,
      invoice: '',
      status: 'pending',
    });
    setSaleOrder(null);
    setIsEditModalOpen(false);
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
      const newSaleOrder = await fs.saleOrder.update(form);
      const dbSaleOrders = await fs.saleOrder.getAll();
      if (!newSaleOrder || !dbSaleOrders) throw new Error('Error while creating client');
      //Reset form
      setForm({
        clientId: '',
        date: '',
        cars: [defaultCar],
        total: 0,
        invoice: '',
        status: 'pending',
      });
      //Display success message
      setMyContext({
        ...myContext,
        saleOrders: dbSaleOrders,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Orden de venta actualizada correctamente.',
        },
      });
      //Close providers modal
      setSaleOrder(null);
      setIsEditModalOpen(false);
    } catch (error) {
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al actualizar la order de venta, revisa tu datos.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
              defaultValue={moment(saleOrder?.date).locale('es').format('LLL')}
              label="Fecha de creaci??n"
              helperText="Fecha de creaci??n de la order de compra"
              variant="outlined"
              size="small"
              required
              disabled
            />
            <FormControl size="small" fullWidth>
              <InputLabel id="status-select-label-id">Estado</InputLabel>
              <Select
                labelId="status-select-label-id"
                id="status-select-id"
                value={form.status || ''}
                label="Estado"
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as any }))}
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="completed">Completada</MenuItem>
                <MenuItem value="rejected">Rechazada</MenuItem>
              </Select>
              <FormHelperText>Selecciona al cliente</FormHelperText>
            </FormControl>
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
              {loading ? <CircularProgress size="1.9rem" sx={{ color: '#fff' }} /> : 'Editar'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};

const OrderedCar = ({ car, idx, setForm }: OrderedCarProps) => {
  const { myContext } = useContext<MyContextState>(GlobalContext);

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
          {myContext.cars.map((car) => (
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
          inputProps={{ min: 0 }}
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

interface Props {
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
  saleOrder: SaleOrder | null;
  setSaleOrder: Dispatch<SetStateAction<SaleOrder | null>>;
}

interface OrderedCarProps {
  car: OrderedCarForSale;
  idx: number;
  setForm: React.Dispatch<React.SetStateAction<SaleOrder>>;
}

export default NewOrders;
