import InventoryHeader from "../../../components/Inventory/Header";
import NewProvider from "../../../components/Inventory/Providers/NewProvider";
import ProvidersTable from "../../../components/Inventory/Providers/ProvidersTable";
import MenuLayout from "../../../components/MenuLayout/MenuLayout";




const Providers = () => {

    return (
      <MenuLayout>
        <>
          <InventoryHeader />
          <ProvidersTable />
          <NewProvider />
        </>
      </MenuLayout>
    );
}

export default Providers;