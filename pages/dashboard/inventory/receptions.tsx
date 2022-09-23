import InventoryHeader from '../../../components/Inventory/Header';
import NewReception from '../../../components/Inventory/Receptions/NewReception';
import MenuLayout from '../../../components/MenuLayout/MenuLayout';

const Receptions = () => {
  return (
    <MenuLayout>
      <>
        <InventoryHeader />
        <NewReception />
      </>
    </MenuLayout>
  );
};

export default Receptions;
