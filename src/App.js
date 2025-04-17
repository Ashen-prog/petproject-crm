import "./App.css";
import Header from "./components/Header";
import Auth from "./components/Auth";
import React, { Fragment } from "react";
import WorkSpace from "./components/WorkSpace/WorkSpace";
import { useSelector } from "react-redux";
import DemoModal from "./components/UI/DemoModal";

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <Fragment>
      {!isAuth && (
        <div className="Auth">
          <Header />
          <Auth />
        </div>
      )}
      {isAuth && (
        <div className="App">
          <WorkSpace />
        </div>
      )}
      <DemoModal />
    </Fragment>
  );
}

export default App;
