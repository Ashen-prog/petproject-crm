import { useSelector, useDispatch } from "react-redux";
import { setCurrentDate } from "../../store/dateSlice";
import { logout } from "../../store/AuthSlice";
import { showDemoModal } from "../../store/modalSlice";
import { useNavigate } from "react-router-dom";
import styles from "./WS_Header.module.css";

const WS_Header = () => {
  const currentDateTimestamp = useSelector((state) => state.date.currentDate);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Конвертируем timestamp в Date только когда нужно
  const currentDate = new Date(currentDateTimestamp);

  const handleDateChange = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    // Передаем timestamp в экшен
    dispatch(setCurrentDate(newDate.getTime()));
  };

  const handleToday = () => {
    // Используем Date.now() вместо new Date()
    dispatch(setCurrentDate(Date.now()));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleAddEmployeeClick = () => {
    dispatch(showDemoModal());
  };

  return (
    <div className={styles.WS_Header}>
      <div className={styles.dateControls}>
        <button onClick={() => handleDateChange(-1)}>←</button>
        <button onClick={handleToday}>Сегодня</button>
        <button onClick={() => handleDateChange(1)}>→</button>
        <div className={styles.WS_Header__date}>
          {currentDate.toLocaleDateString()}
        </div>
      </div>
      <div className={styles.headerControls}>
        <button 
          className={styles.addEmployeeButton} 
          onClick={handleAddEmployeeClick}
        >
          Добавить сотрудника
        </button>
        <button 
          className={styles.logoutButton} 
          onClick={handleLogout}
        >
          Выход
        </button>
      </div>
    </div>
  );
};

export default WS_Header;
