import InventoryHeader from '../../../components/Inventory/Header';
import NewReception from '../../../components/Inventory/Receptions/NewReception';
import ReceptionsTable from '../../../components/Inventory/Receptions/ReceptionsTable';
import MenuLayout from '../../../components/MenuLayout/MenuLayout';

const Receptions = () => {
  return (
    <MenuLayout>
      <>
        <InventoryHeader />
        <ReceptionsTable/>
        <NewReception />
      </>
    </MenuLayout>
  );
};

export default Receptions;
