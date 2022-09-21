import InventoryHeader from '../../../components/Inventory/Header';
import NewOrder from '../../../components/Inventory/Orders/NewOrder';
import OrdersTable from '../../../components/Inventory/Orders/OrdersTable';
import MenuLayout from '../../../components/MenuLayout/MenuLayout';

const Orders = () => {
  return (
    <MenuLayout>
      <>
        <InventoryHeader />
        <OrdersTable />
        <NewOrder />
      </>
    </MenuLayout>
  );
};

export default Orders;
