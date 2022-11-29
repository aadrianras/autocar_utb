
import { Typography } from '@mui/material';
import MenuLayout from '../../../components/MenuLayout/MenuLayout';
import SellsHeader from '../../../components/sells/Header';
import NewOrders from '../../../components/sells/Orders/NewOrders';

const Sells = () => {
    return (
      <MenuLayout>
      <>
        <SellsHeader />
        <NewOrders/>
      </>
    </MenuLayout>
    );
}

export default Sells;