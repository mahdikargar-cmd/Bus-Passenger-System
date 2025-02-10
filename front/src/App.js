import {Route, Routes} from 'react-router-dom';
import {Main} from './Component/Main-page/Main';
import './index.css';
import {SignUp} from './Component/Login-SignUp/SignUp';
import {Login} from './Component/Login-SignUp/Login';
import {TicketInquiry} from './Component/UserPanel/TicketInquiry/TicketInquiry';
import {Services} from './Component/Services/Services';
import ServiceDetail from './Component/ServiceDetail/ServiceDetail';
import {Confirm} from "./Component/Confirm-Information/Confirm";
import {Payment} from "./Component/Payment/Payment";
import TicketDisplay from "./Component/TicketDisplay/TicketDisplay";
import PrintTicket from "./Component/PrintTicket/PrintTicket";
import {AdminLogin} from "./Component/AdminPanel/AdminLogin/AdminLogin";
import {UserPanel} from "./Component/UserPanel/UserPanel";
import NotFound from './Component/404/NotFound';
import ComplaintsManagement from "./Component/AdminPanel/ComplaintsManagement/ComplaintsManagement";
import ProtectedRoute from "./Component/AdminPanel/AdminLogin/ProtectedRoute";
import AdminPanel from "./Component/AdminPanel/AdminPanel";

function App() {
    return (
        <div className='app-container'>
            <Routes>
                <Route path='/' element={<Main/>}/>
                <Route path='/SignUp' element={<SignUp/>}/>
                <Route path='/Login' element={<Login/>}/>
                <Route path='/TicketInquiry' element={<TicketInquiry/>}/>
{/*
                <Route path='/adminPanel' element={<AdminPanel/>}/>
*/}
                <Route path='/userPanel' element={<UserPanel/>}/>
                <Route path='/cooperativeManagement' element={<AdminPanel/>}/>
                <Route path='/services' element={<Services/>}/>
                <Route path='/services/se/:serviceId' element={<ServiceDetail/>}/>
                <Route path={'/confirm'} element={<Confirm/>}/>
                <Route path={'/payment'} element={<Payment/>}/>
                <Route path="/tickets" element={<TicketDisplay/>}/>
                <Route path="/print-ticket" element={<PrintTicket/>}/>
                <Route path='/admin' element={<AdminLogin/>}/>
                <Route path="/services/:serviceId" element={<ServiceDetail/>} />
                <Route path='/ComplaintsManagement' element={<ComplaintsManagement/>}/>

                <Route path='/notfound' element={<NotFound/>}/>
                <Route path='/adminPanel' element={<ProtectedRoute element={<AdminPanel />} />} />
            </Routes>
        </div>
    );
}

export default App;
