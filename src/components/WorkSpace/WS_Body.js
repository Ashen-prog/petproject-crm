import Journal from "./Journal";
import SideBar from "../SideBar/SideBar";
import styles from "./WS_Body.module.css";

const WS_Body = (props) => {
  return (
    <div className={styles.WsBody}>
      <SideBar />
      <Journal />
    </div>
  );
};

export default WS_Body;
