import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, addEmployee, deleteEmployee, addEmployeeLocal, deleteEmployeeLocal } from "../store/employeesSlice";

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.items);
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState("");

  useEffect(() => {
    // Загружаем сотрудников только если есть токен (не демо-режим)
    if (token) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, token]);

  const handleAdd = () => {
    if (name.trim()) {
      if (token) {
        // Если есть токен - отправляем на сервер
        dispatch(addEmployee({ name }));
      } else {
        // Демо-режим - добавляем локально
        dispatch(addEmployeeLocal({ name }));
      }
      setName("");
    }
  };

  const handleDelete = (id) => {
    if (token) {
      // Если есть токен - удаляем на сервере
      dispatch(deleteEmployee(id));
    } else {
      // Демо-режим - удаляем локально
      dispatch(deleteEmployeeLocal(id));
    }
  };

  return (
    <div>
      <h2>Сотрудники</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
      <button onClick={handleAdd}>Добавить</button>      <ul>
        {employees.map((e) => (
          <li key={e.id}>
            {e.name}
            <button onClick={() => handleDelete(e.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeesPage;
