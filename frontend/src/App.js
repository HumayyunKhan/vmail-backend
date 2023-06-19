import logo from './logo.svg';
import './App.css';
import FileHandler from './Pages/dragnDrop';
import AppRoutes from './Routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
<BrowserRouter>
<AppRoutes/>
</BrowserRouter>
  );
}

export default App;
