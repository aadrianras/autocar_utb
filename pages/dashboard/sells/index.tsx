
import MenuLayout from '../../../components/MenuLayout/MenuLayout';
import SellsHeader from '../../../components/sells/Header';
import NewOrders from '../../../components/sells/Orders/NewOrders';
import OrdersTable from '../../../components/sells/Orders/OrdersTable';

const Sells = () => {
    return (
      <MenuLayout>
      <>
        <SellsHeader />
        <OrdersTable/>
        <NewOrders/>
      </>
    </MenuLayout>
    );
}

export default Sells;