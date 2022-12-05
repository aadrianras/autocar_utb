import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useContext, useState } from 'react';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { GlobalContext, MyContextState } from '../../pages/_app';
import { RepairedCar } from '../../types/firestore';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import EditRegisteredCar from './EditRegisteredCar';
import DeleteRegisteredCar from './DeleteRegisterCar';
import MechanicModal from './MechanicModal';

const WorkshopTable = () => {
  const { myContext } = useContext<MyContextState>(GlobalContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isMechanicModalOpen, setIsMechanicModalOpen] = useState<boolean>(false);
  const [repairedCar, setRepairedCar] = useState<RepairedCar | null>(null);

  const handleEditClient = (repairedCar: RepairedCar) => {
    setIsEditModalOpen(true);
    setRepairedCar(repairedCar);
  };

  const handleDelete = (repairedCar: RepairedCar) => {
    setRepairedCar(repairedCar);
    setIsDeleteModalOpen(true);
  };

  const handleReparation = (repairedCar: RepairedCar) => {
    setIsMechanicModalOpen(true);
    setRepairedCar(repairedCar);
  };

  return (
    <Box p="1rem 1rem 2rem 1rem" sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
      <Typography variant="h4" mb="1rem">
        Taller de reparacion
      </Typography>
      <DataGrid rows={myContext.repairedCars} columns={getColumns(handleEditClient, handleDelete, handleReparation)} autoHeight />

      <MechanicModal
        isMechanicModalOpen={isMechanicModalOpen}
        setIsMechanicModalOpen={setIsMechanicModalOpen}
        repairedCar={repairedCar}
        setRepairedCar={setRepairedCar}
      />
      <EditRegisteredCar
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        repairedCar={repairedCar}
        setRepairedCar={setRepairedCar}
      />
      <DeleteRegisteredCar
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        repairedCar={repairedCar}
        setRepairedCar={setRepairedCar}
      />
    </Box>
  );
};

const getColumns = (
  handleEditClient: (repairedCar: RepairedCar) => void,
  handleDelete: (repairedCar: RepairedCar) => void,
  handleReparation: (repairedCar: RepairedCar) => void
): GridColDef[] => [
  {
    field: 'firstName',
    headerName: 'Nombre',
    flex: 1,
  },
  {
    field: 'lastName',
    headerName: 'Apellido',
    flex: 1,
  },
  {
    field: 'contactPhone',
    headerName: 'Teléfono',
    flex: 1,
  },
  {
    field: 'carModel',
    headerName: 'Modelo',
    flex: 1,
  },
  {
    field: 'carBrand',
    headerName: 'Marca',
    flex: 1,
  },
  {
    field: 'carPlate',
    headerName: 'Placa',
    flex: 1,
  },
  {
    field: 'receptionDate',
    headerName: 'Recibido en',
    flex: 1,
  },
  {
    field: 'returnDate',
    headerName: 'Devuelto en',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Estado',
    flex: 1,
    renderCell({ row }: { row: RepairedCar }) {
      let text: string = '';
      let bgcolor: string = '';
      if (row.status === 'received') {
        text = 'Recepcionado';
        bgcolor = '#F2DF3A';
      }
      if (row.status === 'repaired') {
        text = 'Reparado';
        bgcolor = '#8D72E1';
      }
      if (row.status === 'returned') {
        text = 'Devuelto';
        bgcolor = '#7DCE13';
      }

      return (
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
          sx={{ bgcolor, borderRadius: '1rem', maxWidth: '7rem' }}
        >
          <Typography variant="caption" sx={{ color: '#fff' }}>
            {text}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'repair',
    headerName: ' ',
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    minWidth: 60,
    width: 60,
    renderCell({ row }: { row: RepairedCar }) {
      return (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <IconButton sx={{ borderRadius: '.25rem' }} onClick={() => handleReparation(row)}>
            <CarRepairIcon />
          </IconButton>
        </Box>
      );
    },
  },
  {
    field: 'edit',
    headerName: ' ',
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    minWidth: 60,
    width: 60,
    renderCell({ row }: { row: RepairedCar }) {
      return (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <IconButton sx={{ borderRadius: '.25rem' }} onClick={() => handleEditClient(row)}>
            <EditRoundedIcon />
          </IconButton>
        </Box>
      );
    },
  },
  {
    field: 'delete',
    headerName: ' ',
    hideable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    minWidth: 60,
    width: 60,
    renderCell({ row }: { row: RepairedCar }) {
      return (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <IconButton sx={{ borderRadius: '.25rem' }} onClick={() => handleDelete(row)}>
            <DeleteRoundedIcon />
          </IconButton>
        </Box>
      );
    },
  },
];

export default WorkshopTable;
