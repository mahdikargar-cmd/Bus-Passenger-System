        import React, { useState, useEffect } from 'react';
        import axios from 'axios';
        import { useParams, useNavigate } from 'react-router-dom';
        import { useForm } from 'react-hook-form';
        import './style.css';
        import { Header } from '../Main-page/Header/Header';
        import { Footer } from '../Main-page/Footer/Footer';

        const ServiceDetail = () => {
            const { serviceId } = useParams();
            const navigate = useNavigate();
            const [service, setService] = useState(null);
            const [seatStatuses, setSeatStatuses] = useState([]);
            const [selectedSeat, setSelectedSeat] = useState(null);
            const { register, handleSubmit, formState: { errors } } = useForm();

            useEffect(() => {
                console.log("Service ID:", serviceId);  // Add this line to log the serviceId
                if (serviceId) {

                    fetchServiceDetails();
                    fetchSeatStatuses();
                }
            }, [serviceId]);

            const fetchServiceDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/services/${serviceId}`);
                    setService(response.data);
                } catch (error) {
                    console.error("Error fetching service details", error);
                }
            };

            const fetchSeatStatuses = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/seats/${serviceId}`);
                    setSeatStatuses(response.data);
                } catch (error) {
                    console.error("Error fetching seat statuses", error);
                }
            };

            const getSeatClassName = (index) => {
                const seatStatus = seatStatuses.find(seat => seat.seatNumber === index + 1);
                if (seatStatus && seatStatus.isOccupied) {
                    return 'bg-red-600';
                }
                return selectedSeat === index + 1 ? 'bg-green-600' : 'bg-blue-600';
            };

            const onSubmit = async (data) => {
                const ticketNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
                const ticketData = {
                    ...data,
                    seatNumber: selectedSeat,
                    serviceDetails: {
                        ...service,
                        serviceId: serviceId // Add serviceId here
                    },
                    ticketNumber
                };

                try {
                    await axios.patch(`http://localhost:5000/seats/${serviceId}/${selectedSeat}`, { isOccupied: true, ticketNumber });
                    localStorage.setItem('ticketData', JSON.stringify(ticketData));
                    navigate('/confirm');
                } catch (error) {
                    console.error('Error updating seat status', error);
                }
            };

            if (!service) {
                return <div>Loading...</div>;
            }

            return (
                <div>
                    <Header />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12 mb-10">
                            <div className="col-span-6 flex flex-col justify-center items-center mt-20 m-5 h-96 bg-white-blue dark:bg-dark-blue rounded-2xl">
                                <div className="grid grid-cols-12">
                                    <div className="m-2 col-span-6">
                                        <input type="text" className="placeholder:p-3 rounded" placeholder="نام" {...register('firstName', { required: true })} />
                                        {errors.firstName && <span>این فیلد الزامی است</span>}
                                    </div>
                                    <div className="m-2 col-span-6">
                                        <input className="placeholder:p-3 rounded" placeholder="نام خانوادگی" type="text" {...register('lastName', { required: true })} />
                                        {errors.lastName && <span>این فیلد الزامی است</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 p-5">
                                    <div className="m-2 col-span-6 ">
                                        <input className="placeholder:p-3 rounded" placeholder="شماره تلفن" type="text" {...register('phone', { required: true })} />
                                        {errors.phone && <span>این فیلد الزامی است</span>}
                                    </div>
                                    <div className="m-2 col-span-6">
                                        <input className="placeholder:p-3 rounded" placeholder="کدملی" type="text" {...register('nationalCode', { required: true })} />
                                        {errors.nationalCode && <span>این فیلد الزامی است</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-12">
                                    <div className="m-2 col-span-6">
                                        <input className="placeholder:p-3 rounded" placeholder="تاریخ تولد" type="text" {...register('birthDate', { required: true })} />
                                        {errors.birthDate && <span>این فیلد الزامی است</span>}
                                    </div>
                                    <div className="m-2 col-span-6">
                                        <select className="w-full rounded" {...register('gender', { required: true })}>
                                            <option value="مرد">مرد</option>
                                            <option value="زن">زن</option>
                                        </select>
                                        {errors.gender && <span>این فیلد الزامی است</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6">
                                <div className="bg-white-blue dark:bg-dark-blue rounded-2xl flex flex-col justify-center items-center mt-20 m-5 h-96">
                                    <div className="mb-5">
                                        <h1 className="text-white flex">تعداد صندلی‌ها: {service.ChairCapacity}</h1>
                                    </div>
                                    <div className="bg-gray grid grid-flow-col grid-rows-3 p-2 gap-10">
                                        {[...Array(service.ChairCapacity)].map((_, index) => (
                                            <div
                                                key={index}
                                                className={`w-[20px] flex justify-center rounded text-white ${getSeatClassName(index)}`}
                                                onClick={() => setSelectedSeat(index + 1)}
                                            >
                                                {index + 1}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <button className="bg-green-600 dark:text-black rounded text-white p-1 mt-10" type="submit" disabled={!selectedSeat}>مرحله بعد</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <Footer />
                </div>
            );
        };

        export default ServiceDetail;
