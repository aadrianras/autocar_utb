import MenuLayout from "../../../components/MenuLayout/MenuLayout";
import ClientsTable from "../../../components/sells/Clients/ClientsTable";
import NewClient from "../../../components/sells/Clients/NewClient";
import SellsHeader from "../../../components/sells/Header";

const clients = () => {
  return (
    <MenuLayout>
      <>
        <SellsHeader />
        <ClientsTable />
        <NewClient />
      </>
    </MenuLayout>
  );
}

export default clients;