import InventoryHeader from '../../../components/Inventory/Header';
import NewOrder from '../../../components/Inventory/Orders/NewOrder';
import MenuLayout from '../../../components/MenuLayout/MenuLayout';

const Orders = () => {
  return (
    <MenuLayout>
      <>
        <InventoryHeader />
        <NewOrder />
      </>
    </MenuLayout>
  );
};

export default Orders;
