import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import styles from "./WS_Body.module.css";

const WS_Body = (props) => {
  return (
    <div className={styles.WsBody}>
      <SideBar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default WS_Body;
