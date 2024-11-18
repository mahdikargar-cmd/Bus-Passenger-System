import React, {useEffect, useState} from 'react';
import axios from "axios";
import api from "../../../Services/Api";

export const StatusTicket = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const [buses, setBuses] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
    }, []);
    const fetchCities = async () => {
        try {
            const response = await api.get('destination');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await api.get('Route');
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching routes', error);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.get('bus');
            setBuses(response.data);
            setCooperatives(response.data);
        } catch (error) {
            console.error('Error fetching buses', error);
        }
    };

    const handleFetchTickets = async () => {
        try {
            console.log(`Fetching tickets for ticket number: ${ticketNumber}`);
            const response = await axios.get(`http://localhost:5000/tickets/number/${ticketNumber}`);
            console.log('Fetched tickets:', response.data);
            setTickets(Array.isArray(response.data) ? response.data : [response.data]);
            setMessage('');
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setMessage(error.response ? error.response.data.message : 'Error fetching tickets');
            setTickets([]);
        }
    };
    const handlePrint = () => {
        window.print();
    };
    const getCompanyNameById = (id) => {
        const company = buses.find((company) => company._id === id);
        return company ? company.companyName : 'Unknown';
    };

    const getBusNameById = (id) => {
        const bus = buses.find((bus) => bus._id === id);
        return bus ? bus.busName : 'Unknown';
    };

    const getRouteNameById = (id) => {
        const route = routes.find((route) => route._id === id);
        const origin = cities.find((c) => c._id === route.origin)?.Cities;
        const destination = cities.find((c) => c._id === route.destination)?.Cities;
        return route ? `${origin} به ${destination} ` : 'Unknown';
    };

    const getServiceOptionsByIds = (ids) => {
        return ids.map((id) => {
            const service = buses.find((service) => service._id === id);
            return service ? service.facilities : 'Unknown';
        });
    };
    return (
        <div className="grid grid-cols-12 place-items-center mt-[50px]">
            <div className="col-span-12 w-[800px] bg-white-blue dark:bg-dark-blue dark:text-white h-[50vh] rounded-3xl">
                <div className="flex justify-center">
                    <h1 className="font-semibold flex justify-center text-[22px] mt-3 bg-orange-500 p-2 rounded h-[50px] w-[300px] text-white">
                        استعلام با شماره بلیط
                    </h1>
                </div>
                <div className="flex justify-center mt-10 ">
                    <input
                        type="text"
                        className="text-black rounded p-2 ml-2"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value)}
                        placeholder="شماره بلیط را وارد کنید"
                    />
                    <button className="bg-green-300 ml-2 rounded p-1" onClick={handleFetchTickets}>
                        جستجو
                    </button>
                    {message && <p>{message}</p>}
                </div>
                <div>
                    <p className="flex justify-center mt-24 text-white">
                        لطفاً شماره بلیط 12 کاراکتری (شامل رقم، حروف و خط تیره) خود را وارد نمایید.
                    </p>
                </div>
            </div>

            <div className={'col-span-12'}>
                {Array.isArray(tickets) && tickets.map(ticket => (
                    <div key={ticket._id}>

                        <div className="print-ticket-container bg-white m-8 rounded dark:bg-dark-blue">
                            <div className={'flex justify-center mt-5 pt-5'}>

                            </div>
                            <div className="ticket-info font-serif text-[20px] grid grid-cols-12 p-5 dark:text-white">
                                <div className={'col-span-6'}>
                                    <p>شماره بلیط: {ticket.ticketNumber}</p>
                                    <p>نام: {ticket.firstName}</p>
                                    <p>نام خانوادگی: {ticket.lastName}</p>
                                    <p>شماره تلفن: {ticket.phone}</p>
                                    <p>کدملی: {ticket.nationalCode}</p>
                                    <p>تاریخ تولد: {ticket.birthDate}</p>
                                    <p>جنسیت: {ticket.gender}</p>
                                    <p>شماره صندلی: {ticket.seatNumber}</p>
                                    <h2>جزئیات سرویس</h2>
                                    <p>نام شرکت: {getCompanyNameById(ticket.serviceDetails.CompanyName)}</p>
                                </div>
                                <div className={'col-span-6'}>
                                    <p>نام اتوبوس: {getBusNameById(ticket.serviceDetails.busName)}</p>
                                    <p>نوع اتوبوس: {ticket.serviceDetails.BusType}</p>
                                    <p>مسیر انتخاب شده: {getRouteNameById(ticket.serviceDetails.SelectedRoute)}</p>
                                    <p>تاریخ حرکت: {ticket.serviceDetails.movementDate}</p>
                                    <p>زمان حرکت: {ticket.serviceDetails.movementTime}</p>
                                    <p>ظرفیت صندلی‌ها: {ticket.serviceDetails.ChairCapacity}</p>
                                    <p>قیمت بلیط: {ticket.serviceDetails.ticketPrice}</p>
                                    <p>گزینه‌های
                                        سرویس: {getServiceOptionsByIds(ticket.serviceDetails.ServicesOption)}</p>
                                </div>
                            </div>
                            <div className={'flex justify-center'}>
                                <button className={'bg-green-400 p-2 rounded mb-5'} onClick={handlePrint}>
                                    چاپ بلیط
                                </button>
                            </div>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default StatusTicket;
