import React, { useState } from 'react';
import { GrMenu } from 'react-icons/gr';
import { MdCancel } from 'react-icons/md';
import './Header.css';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import useDarkSide from '../../theme/useDarkSide';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';

export const Header = () => {
    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(colorTheme === 'light');
    const { user, logout } = useAuth();
    const [navRes, setNavRes] = useState(false);

    const toggleDarkMode = (checked) => {
        setTheme(checked ? 'dark' : 'light'); // Fix theme logic
        setDarkSide(checked);
    };

    const toggleMenu = () => setNavRes(!navRes);

    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md dark:bg-gray-900 dark:text-white z-50">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo */}
                <h1 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-white">سفرینو</h1>

                {/* Navigation Links for Desktop */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="hover:text-blue-600 transition-colors">صفحه اصلی</Link>

                    {user ? (
                        <>
                            <Link to="/userPanel" className="hover:text-blue-600 transition-colors">پنل من</Link>
                            <button onClick={logout} className="text-red-500 hover:text-red-600 transition-colors">خروج</button>
                        </>
                    ) : (
                        <>
                            <Link to="/Login" className="hover:text-blue-600 transition-colors">ورود</Link>
                            <Link to="/SignUp" className="hover:text-blue-600 transition-colors">ثبت نام</Link>
                        </>
                    )}
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center">
                    <DarkModeSwitch
                        checked={darkSide}
                        onChange={toggleDarkMode}
                        size={30}
                        className="ml-4"
                    />

                    {/* Mobile Menu Toggle Button */}
                    <button onClick={toggleMenu} className="md:hidden text-2xl text-gray-700 dark:text-white">
                        {navRes ? <MdCancel size={24} /> : <GrMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`absolute top-14 left-0 w-full bg-gray-100 dark:bg-gray-800 text-center transition-all duration-300 ${
                    navRes ? 'h-auto py-6 opacity-100' : 'h-0 opacity-0 overflow-hidden'
                }`}
            >
                <Link to="/" className="block py-2 hover:text-blue-600 transition-colors">صفحه اصلی</Link>

                {user ? (
                    <>
                        <Link to="/userPanel" className="block py-2 hover:text-blue-600 transition-colors">پنل من</Link>
                        <button onClick={logout} className="block py-2 text-red-500 hover:text-red-600 transition-colors">خروج</button>
                    </>
                ) : (
                    <>
                        <Link to="/Login" className="block py-2 hover:text-blue-600 transition-colors">ورود</Link>
                        <Link to="/SignUp" className="block py-2 hover:text-blue-600 transition-colors">ثبت نام</Link>
                    </>
                )}
            </div>
        </div>
    );
};
