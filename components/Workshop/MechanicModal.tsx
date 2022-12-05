import { useState, useContext, Dispatch, SetStateAction, useEffect, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GlobalContext, MyContextState } from '../../pages/_app';
import { RepairedCar, Repairs } from '../../types/firestore';
import { fs } from '../../config/firebase';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import 'moment/locale/es';
import moment from 'moment';
moment.locale('es');

const MechanicModal = ({ repairedCar, setRepairedCar, isMechanicModalOpen, setIsMechanicModalOpen }: Props) => {
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
    setIsMechanicModalOpen(false);
    setRepairedCar(null);
  };

  const handleNewRepair = () => {
    const repairs: Repairs[] = [...form.repairs, { approved: false, name: '' }];
    setForm((prev) => ({ ...prev, repairs }));
  };

  const handleRepairNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const repairs: Repairs[] = [...form.repairs];
    repairs[idx] = { ...repairs[idx], name: event.target.value };
    setForm((form) => ({ ...form, repairs }));
  };

  const handleRepairCheckboxChange = (value: boolean, idx: number) => {
    const repairs: Repairs[] = [...form.repairs];
    repairs[idx] = { ...repairs[idx], approved: value };
    setForm((prev) => ({ ...prev, repairs }));
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

    if (form.status === 'repaired' && form.repairs.every((repair) => repair.name.length === 0)) {
      setMyContext({
        ...myContext,
        snackbar: { open: true, msg: 'Debes llenar al menos una reparacion', severity: 'warning' },
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
      open={isMechanicModalOpen}
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
            Reparacion de vehiculo
          </Typography>
          <IconButton aria-label="Cerrar registro de vehiculo" onClick={handleClose} sx={{ borderRadius: '.25rem' }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <form>
          <Stack alignItems="stretch" gap="1rem">
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body1" fontWeight="bold">
                  Fecha de reparacion:
                </Typography>
                <Typography variant="body1">{`${moment().format('LLL')}`}</Typography>
              </Stack>

              <FormControl size="small">
                <InputLabel id="purchase-order-status-label-id">Estado</InputLabel>
                <Select
                  disabled={loading}
                  name="status"
                  labelId="purchase-order-status-label-id"
                  id="purchase-order-status-id"
                  value={statusOptions.find((option) => option.value === form.status)?.value}
                  label="Estado"
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      status: event.target.value as 'repaired',
                    }))
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Selecciona el estado de la order</FormHelperText>
              </FormControl>
            </Stack>

            <Divider variant="middle" textAlign="left">
              DETALLE
            </Divider>

            <Stack direction="row" spacing={4}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body1" fontWeight="bold">
                  Cliente:
                </Typography>
                <Typography variant="body1">{`${form.firstName} ${form.lastName}`}</Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="body1" fontWeight="bold">
                  Telefono:
                </Typography>
                <Typography variant="body1">{`${form.contactPhone}`}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={4}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body1" fontWeight="bold">
                  Modelo del vehiculo:
                </Typography>
                <Typography variant="body1">{`${form.carModel}`}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body1" fontWeight="bold">
                  Marca del vehiculo:
                </Typography>
                <Typography variant="body1">{`${form.carBrand}`}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body1" fontWeight="bold">
                  Placa:
                </Typography>
                <Typography variant="body1">{`${form.carPlate}`}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="body1" fontWeight="bold">
                Observaciones:
              </Typography>
              <Typography variant="body1">{`${form.details}`}</Typography>
            </Stack>

            <Divider variant="middle" textAlign="left">
              REPARACIONES
            </Divider>

            <Button
              variant="text"
              sx={{ marginLeft: 'auto', width: '12rem' }}
              onClick={handleNewRepair}
              disabled={loading}
            >
              + Agregar detalle
            </Button>

            {form.repairs.map((repair, idx) => (
              <Stack direction="row" spacing={2} key={idx}>
                <TextField
                  id="name"
                  name="name"
                  value={repair.name}
                  onChange={(event) => handleRepairNameChange(event, idx)}
                  label="Reparacion"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={repair.approved}
                      value={repair.approved}
                      onChange={() => {
                        handleRepairCheckboxChange(!repair.approved, idx);
                      }}
                    />
                  }
                  label="Realizada"
                />
              </Stack>
            ))}

            <Button
              variant="contained"
              sx={{ marginRight: 'auto', width: '12rem' }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size="1.9rem" sx={{ color: '#fff' }} /> : 'Guardar'}
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

const statusOptions = [
  { value: 'received', label: 'Recibida' },
  { value: 'repaired', label: 'Reparada' },
];

interface Props {
  isMechanicModalOpen: boolean;
  setIsMechanicModalOpen: Dispatch<SetStateAction<boolean>>;
  repairedCar: RepairedCar | null;
  setRepairedCar: Dispatch<SetStateAction<RepairedCar | null>>;
}

export default MechanicModal;
