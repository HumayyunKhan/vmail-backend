import { Route, Routes } from "react-router-dom";
import Sidebar from "../Components/SideBar";
import FileHandler from "../Pages/dragnDrop";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FileHandler/>}/>
    </Routes>
  );
};
export default AppRoutes;