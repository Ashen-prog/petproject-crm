import { useSelector, useDispatch } from "react-redux";
import { setCurrentDate } from "../../store/dateSlice";
import styles from "./WS_Header.module.css";

const WS_Header = () => {
  const currentDateTimestamp = useSelector((state) => state.date.currentDate);
  const dispatch = useDispatch();

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

  return (
    <div className={styles.WS_Header}>
      <button onClick={() => handleDateChange(-1)}>←</button>
      <button onClick={handleToday}>Сегодня</button>
      <button onClick={() => handleDateChange(1)}>→</button>
      <div className={styles.WS_Header__date}>
        {currentDate.toLocaleDateString()}
      </div>
    </div>
  );
};

export default WS_Header;
