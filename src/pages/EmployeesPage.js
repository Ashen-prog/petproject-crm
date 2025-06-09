import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, addEmployee, deleteEmployee } from "../store/employeesSlice";

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.items);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAdd = () => {
    if (name.trim()) {
      dispatch(addEmployee({ name }));
      setName("");
    }
  };

  return (
    <div>
      <h2>Сотрудники</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
      <button onClick={handleAdd}>Добавить</button>
      <ul>
        {employees.map((e) => (
          <li key={e.id}>
            {e.name}
            <button onClick={() => dispatch(deleteEmployee(e.id))}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeesPage;
