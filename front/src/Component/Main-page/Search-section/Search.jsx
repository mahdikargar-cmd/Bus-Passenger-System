import React, {useEffect, useState} from 'react';
import {CgArrowsExchangeAlt} from "react-icons/cg";
import './serach.css';
import api from "../../../Services/Api";
import {useNavigate} from "react-router-dom";

export const Search = () => {
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await api.get("destination");
                setDestinations(response.data);
            } catch (error) {
                console.error("Error fetching destinations:", error);
            }
        };

        fetchDestinations();
    }, []);

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [originId, setOriginId] = useState('');
    const [destinationId, setDestinationId] = useState('');
    const [showCities, setShowCities] = useState(false);
    const [selectedInput, setSelectedInput] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputClick = (inputType) => {
        setSelectedInput(inputType);
        setShowCities(true);
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
    };

    const handleSearchClick = () => {
        navigate(`/services?origin=${originId}&destination=${destinationId}`);
    };

    const filteredCities = destinations.filter(city =>
        city.Cities.includes(searchTerm)
    );

    return (
        <div className="search-container mb-96">
            <div className="search">
                <h1>خرید بلیط اتوبوس</h1>
                <div className="destination">
                    <form>
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12 md:col-span-4 flex justify-center">
                                <input
                                    type="search"
                                    value={origin}
                                    onClick={() => handleInputClick('origin')}
                                    placeholder="مبدا را انتخاب کنید"
                                    className="placeholder:p-2 p-2 rounded text-black"
                                />
                                {showCities && selectedInput === 'origin' && (
                                    <ul className="city-list">
                                        {filteredCities.map(city => (
                                            <li key={city._id} onClick={() => handleCityClick(city)}>{city.Cities}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="col-span-12 md:col-span-4 flex justify-center">
                                <button type="button"><CgArrowsExchangeAlt className="m-0 rounded" size={30}/></button>
                            </div>
                            <div className="col-span-12 md:col-span-4 flex justify-center">
                                <input
                                    type="search"
                                    value={destination}
                                    onClick={() => handleInputClick('destination')}
                                    placeholder="مقصد را انتخاب کنید"
                                    className="placeholder:p-2 p-2 rounded text-black"
                                />
                                {showCities && selectedInput === 'destination' && (
                                    <ul className="city-list">
                                        {filteredCities.map(city => (
                                            <li key={city._id} onClick={() => handleCityClick(city)}>{city.Cities}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-6 flex justify-center">
                            <button type="button" className="bg-orange-500 mt-8 pr-12 pl-12 pt-1 pb-1 rounded"
                                    onClick={handleSearchClick}>جستجو
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Search;
