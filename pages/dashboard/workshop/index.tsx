import MenuLayout from "../../../components/MenuLayout/MenuLayout";
import Header from "../../../components/Workshop/Header";
import RegisterCar from "../../../components/Workshop/RegisterCar";
import WorkshopTable from "../../../components/Workshop/WorkshopTable";

const Workshop = () => {
  return (
    <MenuLayout>
      <>
        <Header/>
        <WorkshopTable/>
        <RegisterCar/>
      </>
    </MenuLayout>
  );
}

export default Workshop;