import Journal from "./Journal";
import SideBar from "../SideBar/SideBar";
import styles from "./WorkspaceBody.module.css";

const WorkspaceBody = (props) => {
  return (
    <div className={styles.WsBody}>
      <SideBar />
      <Journal />
    </div>
  );
};

export default WorkspaceBody;
