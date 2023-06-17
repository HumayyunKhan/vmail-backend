import { Route, Routes } from "react-router-dom";
import Sidebar from "../Components/SideBar";
import FileHandler from "../Pages/dragnDrop";
import AdminPanel from "../Pages/AdminPanel";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FileHandler/>}/>
      <Route path="admin" element={<AdminPanel/>}/>
    </Routes>
  );
};
export default AppRoutes;