import { Outlet } from "react-router-dom";
import Header from '../../../pages/header/Header';
// import "./Layout.css";

export default function Layout() {
  return (
    <>
      <Header />
       <div className="wrapper">
        <Outlet />
      </div>
      {/* xceft */}
    </>
  );
}
