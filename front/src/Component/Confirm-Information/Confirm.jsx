import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Header} from "../Main-page/Header/Header";
import {Footer} from "../Main-page/Footer/Footer";
import api from "../../Services/Api";
import moment from "moment-jalaali";

export const Confirm = () => {
    const [buses, setBuses] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();
    const [ticketData, setTicketData] = useState(null);
    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
    }, []);
    useEffect(() => {
        const data = localStorage.getItem('ticketData');
        if (data) {
            setTicketData(JSON.parse(data));
        }
    }, []);
    const fetchCities = async () => {
        try {
            const response = await api.get("destination");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    };


    const fetchRoutes = async () => {
        try {
            const response = await api.get("Route");
            setRoutes(response.data);
        } catch (error) {
            console.error("Error fetching routes", error);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.get("bus");
            setBuses(response.data);
            setCooperatives(response.data);
        } catch (error) {
            console.error("Error fetching buses", error);
        }
    };


    const handleConfirm = () => {
        navigate('/payment'); // هدایت به صفحه پرداخت
    };

    if (!ticketData) {
        return <div>Loading...</div>;
    }
    const getCompanyNameById = (id) => {
        const company = buses.find(company => company._id === id);
        return company ? company.companyName : 'Unknown';
    };

    const getBusNameById = (id) => {
        const bus = buses.find(bus => bus._id === id);
        return bus ? bus.busName : 'Unknown';
    };

    const getRouteNameById = (id) => {
        const route = routes.find(route => route._id === id);
        if (!route) return 'Unknown';

        const origin = cities.find(c => c._id === route.origin)?.Cities || 'Unknown';
        const destination = cities.find(c => c._id === route.destination)?.Cities || 'Unknown';

        return `${origin} به ${destination}`;
    };

    const formatDate = (date) => {
        return moment(date).format('jYYYY-jMM-jDD');
    };

    const getServiceOptionsByIds = (ids) => {
        return ids.map(id => {
            const service = buses.find(service => service._id === id);
            return service ? service.facilities : 'Unknown';
        });
    };
    return (
        <div>
            <Header/>
            <div className="confirm-container bg-white m-8 rounded dark:bg-dark-blue">
                <div className={'flex justify-center mt-5 pt-5'}>
                    <h1 className={'flex justify-center bg-green-300 w-[100px]'}>تایید اطلاعات</h1>
                </div>
                <div className="ticket-info font-serif text-[20px] grid grid-cols-12 p-5 dark:text-white">
                    <div className={'col-span-6'}>
                        <p>نام: {ticketData.firstName}</p>
                        <p>نام خانوادگی: {ticketData.lastName}</p>
                        <p>شماره تلفن: {ticketData.phone}</p>
                        <p>کدملی: {ticketData.nationalCode}</p>
                        <p>تاریخ تولد: {ticketData.birthDate}</p>
                        <p>جنسیت: {ticketData.gender}</p>
                        <p>شماره صندلی: {ticketData.seatNumber}</p>
                        <h2>جزئیات سرویس</h2>
                        <p>نام شرکت: {getCompanyNameById(ticketData.serviceDetails.CompanyName)}</p>
                    </div>
                    <div className={'col-span-6'}>
                        <p>نام اتوبوس: {getBusNameById(ticketData.serviceDetails.busName)}</p>
                        <p>نوع اتوبوس: {ticketData.serviceDetails.BusType}</p>
                        <p>مسیر انتخاب شده: {getRouteNameById(ticketData.serviceDetails.SelectedRoute)}</p>
                        <p>تاریخ حرکت: {formatDate(ticketData.serviceDetails.movementDate)}</p>
                        <p>زمان حرکت: {ticketData.serviceDetails.movementTime}</p>
                        <p>ظرفیت صندلی‌ها: {ticketData.serviceDetails.ChairCapacity}</p>
                        <p>قیمت بلیط: {ticketData.serviceDetails.ticketPrice}</p>
                        <p>گزینه‌های سرویس: {getServiceOptionsByIds(ticketData.serviceDetails.ServicesOption)}</p>
                    </div>
                </div>
<div className={'flex justify-center '}>
    <button className={'bg-green-400 p-2 rounded mb-5'} onClick={handleConfirm}>تایید و پرداخت</button>

</div>
            </div>
            <Footer/>
        </div>
    );
};

export default Confirm;
