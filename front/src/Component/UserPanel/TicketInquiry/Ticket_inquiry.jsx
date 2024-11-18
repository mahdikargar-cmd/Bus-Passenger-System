import React, {useEffect, useState} from 'react';
import axios from 'axios';
import api from "../../../Services/Api";
import moment from "moment-jalaali";

export const Ticket_inquiry = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const [ticketData, setTicketData] = useState(null);
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
    const formatDate = (date) => {
        return moment(date).format('jYYYY-jMM-jDD');
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
    useEffect(() => {
        const data = localStorage.getItem('ticketData');
        if (data) {
            setTicketData(JSON.parse(data));
        }
    }, []);
    const getCompanyNameById = (id) => {
        const company = buses.find((company) => company._id === id);
        return company ? company.companyName : 'Unknown';
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
    const handleCancel = async () => {
        try {
            console.log(`Cancelling all tickets with ticket number: ${ticketNumber}`);
            const response = await axios.delete(`http://localhost:5000/tickets/number/${ticketNumber}`);
            console.log('Cancellation response:', response.data);
            setMessage(response.data.message);
            setTickets([]);
        } catch (error) {
            console.error('Error cancelling tickets:', error);
            setMessage(error.response ? error.response.data.message : 'Error cancelling tickets');
        }
    };
    return (
        <div className="w-full bg-white-blue rounded text-white dark:bg-dark-blue p-2 flex justify-center">
            <div className="dark:text-white h-80">
                <h1 className="font-semibold mb-10">استرداد بلیط</h1>
                <input
                    className="placeholder:text-black text-black rounded p-2 ml-2"
                    type="text"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    placeholder="شماره بلیط را وارد کنید"
                />
                <button className="bg-green-300 p-2 rounded text-black" onClick={handleFetchTickets}>جستجو</button>
                {message && <p>{message}</p>}
                <ul>
                    {Array.isArray(tickets) && tickets.map(ticket => (
                        <li key={ticket._id}>
                            <p>شماره بلیط: {ticketData.ticketNumber}</p>
                            <p>نام: {ticketData.firstName}</p>
                            <p>نام خانوادگی: {ticketData.lastName}</p>
                            <p>شماره تلفن: {ticketData.phone}</p>
                            <p>کدملی: {ticketData.nationalCode}</p>
                            <p>تاریخ تولد: {ticketData.birthDate}</p>
                            <p>جنسیت: {ticketData.gender}</p>
                            <p>شماره صندلی: {ticketData.seatNumber}</p>
                            <h2>جزئیات سرویس</h2>
                            <p>نام شرکت: {getCompanyNameById(ticketData.serviceDetails.CompanyName)}</p>
                        </li>
                    ))}
                </ul>
                {tickets.length > 0 && (
                    <button className="bg-red-300 text-black p-1" onClick={handleCancel}>استرداد بلیط</button>
                )}
            </div>
        </div>
    );
};

export default Ticket_inquiry;
