import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Admindashboard from './pages/Admindashboard/Admindashboard';
import Studentdashboard from './pages/Studentdashboard/Studentdashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App">
       <ToastContainer />
     <Header/>
     <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>}/>
      <Route path='/studentdashboard' element={<Studentdashboard/>} />
      <Route path='/admindashboard' element={<Admindashboard/>}/>
     </Routes>
    </div>
  );
}

export default App;