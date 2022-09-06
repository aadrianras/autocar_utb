import InventoryHeader from "../../../components/Inventory/Header";
import ProviderTable from "../../../components/Inventory/ProviderTable";
import MenuLayout from "../../../components/MenuLayout/MenuLayout";



const Providers = () => {

    return (
      <MenuLayout>
        <>
          <InventoryHeader />
          <ProviderTable />
        </>
      </MenuLayout>
    );
}

export default Providers;