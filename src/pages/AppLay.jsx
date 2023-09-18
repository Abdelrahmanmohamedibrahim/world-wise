import styles from "./AppLayout.module.css";
import SideBar from "../components/SideBar";
import Map from "../components/Map";
import User from "../components/User";
function AppLay() {
  return (
    <div className={styles.app}>
      <SideBar />
      <Map />
      <User />
    </div>
  );
}

export default AppLay;
