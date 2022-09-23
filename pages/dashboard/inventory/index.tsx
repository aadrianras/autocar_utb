import InventoryHeader from '../../../components/Inventory/Header';
import InventoryTable from '../../../components/Inventory/Inventory/InventoryTable';
import MenuLayout from '../../../components/MenuLayout/MenuLayout';

const Inventory = () => {
  return (
    <MenuLayout>
      <>
        <InventoryHeader />
        <InventoryTable />
      </>
    </MenuLayout>
  );
};

export default Inventory;
