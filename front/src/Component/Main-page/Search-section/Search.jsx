import React, { useEffect, useState } from 'react';
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import api from "../../../Services/Api";
import './serach.css';

export const Search = () => {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [originId, setOriginId] = useState('');
    const [destinationId, setDestinationId] = useState('');
    const [showCities, setShowCities] = useState(false);
    const [selectedInput, setSelectedInput] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const response = await api.get("destination");
                setDestinations(response.data || []);
                setError(null);
            } catch (error) {
                console.error("Error fetching destinations:", error);
                setError("خطا در دریافت لیست شهرها");
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const handleInputClick = (inputType) => {
        setSelectedInput(inputType);
        setShowCities(true);
        setSearchTerm('');
    };

    const handleCityClick = (city) => {
        if (selectedInput === 'origin') {
            setOrigin(city.Cities);
            setOriginId(city._id);
        } else if (selectedInput === 'destination') {
            setDestination(city.Cities);
            setDestinationId(city._id);
        }
        setShowCities(false);
        setSearchTerm('');
    };

    const handleSearchClick = () => {
        if (!originId || !destinationId) {
            alert('لطفا مبدا و مقصد را انتخاب کنید');
            return;
        }
        navigate(`/services?origin=${originId}&destination=${destinationId}`);
    };

    const handleSwapCities = () => {
        setOrigin(destination);
        setDestination(origin);
        setOriginId(destinationId);
        setDestinationId(originId);
    };

    const filteredCities = destinations.filter(city =>
        city.Cities.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white p-6">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-6">خرید بلیط اتوبوس</h1>

            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={origin}
                        onClick={() => handleInputClick('origin')}
                        placeholder="مبدا را انتخاب کنید"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                    />
                    {showCities && selectedInput === 'origin' && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="جستجوی شهر..."
                                className="w-full p-2 border-b"
                            />
                            <ul>
                                {filteredCities.map(city => (
                                    <li
                                        key={city._id}
                                        onClick={() => handleCityClick(city)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {city.Cities}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleSwapCities}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <CgArrowsExchangeAlt size={24} />
                    </button>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={destination}
                        onClick={() => handleInputClick('destination')}
                        placeholder="مقصد را انتخاب کنید"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                    />
                    {showCities && selectedInput === 'destination' && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="جستجوی شهر..."
                                className="w-full p-2 border-b"
                            />
                            <ul>
                                {filteredCities.map(city => (
                                    <li
                                        key={city._id}
                                        onClick={() => handleCityClick(city)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {city.Cities}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        type="button"
                        onClick={handleSearchClick}
                        className="w-full md:w-auto px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                    >
                        جستجو
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            )}

            {error && (
                <div className="text-red-600 text-center py-4">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Search;