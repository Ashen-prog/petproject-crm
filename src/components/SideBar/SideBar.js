import styles from "./SideBar.module.css";
import Calendar from "./Calendar";
import Menu from "./Menu";
const SideBar = () => {
  return (
    <div className={styles.sideBar}>
      <h2>Демо режим</h2>
      <Calendar />
      <Menu />
    </div>
  );
};

export default SideBar;
