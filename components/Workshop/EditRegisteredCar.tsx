import { useState, useContext, Dispatch, SetStateAction, useEffect } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GlobalContext, MyContextState } from '../../pages/_app';
import { RepairedCar } from '../../types/firestore';
import { fs } from '../../config/firebase';
import { Divider } from '@mui/material';
import 'moment/locale/es';
import moment from 'moment';
moment.locale('es');

const EditRegisteredCar = ({ isEditModalOpen, setIsEditModalOpen, repairedCar, setRepairedCar }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { myContext, setMyContext } = useContext<MyContextState>(GlobalContext);
  const [form, setForm] = useState<RepairedCar>(defaultCar);

  useEffect(() => {
    if (repairedCar?.id && repairedCar?.id !== form?.id) {
      setForm({
        id: repairedCar?.id || '',
        firstName: repairedCar?.firstName || '',
        lastName: repairedCar?.lastName || '',
        contactPhone: repairedCar?.contactPhone || '',
        carBrand: repairedCar?.carBrand || '',
        carModel: repairedCar?.carModel || '',
        carPlate: repairedCar?.carPlate || '',
        details: repairedCar?.details || '',
        receptionDate: repairedCar?.receptionDate || '',
        returnDate: repairedCar?.returnDate || '',
        status: repairedCar?.status || 'received',
        repairs: repairedCar?.repairs || [],
      });
    }
  }, [repairedCar]);

  const handleClose = () => {
    //Reset form
    setForm(defaultCar);
    setIsEditModalOpen(false);
    setRepairedCar(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (
      !form.status ||
      !form.firstName ||
      !form.lastName ||
      !form.contactPhone ||
      !form.carModel ||
      !form.carBrand ||
      !form.carPlate
    ) {
      setMyContext({
        ...myContext,
        snackbar: { open: true, msg: 'Debes llenar correctamente todos los campos.', severity: 'warning' },
      });
      setLoading(false);
      return;
    }

    try {
      const newRepairedCar = await fs.repairedCar.update(form);
      const dbRepairedCars = await fs.repairedCar.getAll();
      if (!newRepairedCar || !dbRepairedCars) throw new Error('Error while updating register');
      //Reset form
      setForm(defaultCar);
      //Display success message
      setMyContext({
        ...myContext,
        repairedCars: dbRepairedCars,
        snackbar: {
          open: true,
          severity: 'success',
          msg: 'Vehiculo actualizado.',
        },
      });
      //Close providers modal
      handleClose();
    } catch (error) {
      setMyContext({
        ...myContext,
        snackbar: {
          open: true,
          severity: 'error',
          msg: 'Ocurrio un problema al actualizar el vehiculo, revisa tu datos.',
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
          maxWidth: '60rem',
          overflowY: 'auto',
          height: { xs: '100%', md: 'max-content' },
          maxHeight: { xs: '100%', md: '90%' },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar recepción de vehículo
          </Typography>
          <IconButton aria-label="Cerrar registro de vehiculo" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <form>
          <Stack alignItems="stretch" gap="1rem">
            <Typography id="date" variant="body1">
              {`Fecha de recepcion: ${moment().format('LLL')}`}
            </Typography>

            <Divider variant="middle" textAlign="left">
              PROPIETARIO
            </Divider>

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap=".5rem">
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
              <TextField
                id="contactPhone"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                label="Teléfono"
                variant="outlined"
                size="small"
                error={form?.contactPhone?.length > 0 && !/[0-9]/.test(form.contactPhone)}
                required
                fullWidth
              />
            </Stack>

            <Divider variant="middle" textAlign="left">
              VEHICULO
            </Divider>

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap=".5rem">
              <TextField
                id="carModel"
                name="carModel"
                value={form.carModel}
                onChange={handleChange}
                label="Modelo de vehículo"
                variant="outlined"
                size="small"
                required
                fullWidth
              />
              <TextField
                id="carBrand"
                name="carBrand"
                value={form.carBrand}
                onChange={handleChange}
                label="Fabricante"
                variant="outlined"
                size="small"
                required
                fullWidth
              />
              <TextField
                id="carPlate"
                name="carPlate"
                value={form.carPlate}
                onChange={handleChange}
                label="Placa del vehículo"
                variant="outlined"
                size="small"
                required
                fullWidth
              />
            </Stack>

            <Divider variant="middle" textAlign="left">
              EXTRA
            </Divider>

            <TextField
              id="details"
              name="details"
              value={form.details}
              onChange={handleChange}
              label="Observaciones"
              variant="outlined"
              size="small"
              multiline
              rows={4}
              fullWidth
            />

            <Button variant="contained" sx={{ marginRight: 'auto', width: '12rem' }} onClick={handleSubmit}>
              {loading ? <CircularProgress size="1.9rem" sx={{ color: '#fff' }} /> : 'Registrar'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};

const defaultCar: RepairedCar = {
  carBrand: '',
  carModel: '',
  carPlate: '',
  contactPhone: '',
  details: '',
  firstName: '',
  lastName: '',
  receptionDate: moment().format('LLL'),
  repairs: [],
  returnDate: null,
  status: 'received',
};

interface Props {
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
  repairedCar: RepairedCar | null;
  setRepairedCar: Dispatch<SetStateAction<RepairedCar | null>>;
}

export default EditRegisteredCar;
