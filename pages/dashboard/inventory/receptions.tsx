import InventoryHeader from '../../../components/Inventory/Header';
import NewReception from '../../../components/Inventory/Receptions/NewReception';
import NewStock from '../../../components/Inventory/Receptions/NewStock';
import ReceptionsTable from '../../../components/Inventory/Receptions/ReceptionsTable';
import MenuLayout from '../../../components/MenuLayout/MenuLayout';
import Box from '@mui/material/Box';

const Receptions = () => {
  return (
    <MenuLayout>
      <>
        <InventoryHeader />
        <ReceptionsTable />
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <NewReception />
          <NewStock />
        </Box>
      </>
    </MenuLayout>
  );
};

export default Receptions;
