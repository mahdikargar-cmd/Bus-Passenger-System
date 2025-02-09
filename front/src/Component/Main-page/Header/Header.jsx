import React, { useState } from 'react';
import { GrMenu } from 'react-icons/gr';
import { MdCancel } from 'react-icons/md';
import './Header.css';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import useDarkSide from '../../theme/useDarkSide';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(colorTheme === 'light');
    const { user, logout } = useAuth();

    const toggleDarkMode = (checked) => {
        setTheme(colorTheme);
        setDarkSide(checked);
    };

    const [navRes, setNavRes] = useState(false);
    const toggleMenu = () => setNavRes(!navRes);

    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md dark:bg-gray-900 dark:text-white z-50">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-blue-600 dark:text-white">سفرینو</h1>

                {/* Navigation Links for Desktop */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="hover:text-blue-600 ml-4 transition-colors">صفحه اصلی</Link>
                    {user ? (
                        <>
                            <Link to="/userPanel" className="hover:text-blue-600 transition-colors">پنل من</Link>
                            <button onClick={logout} className="hover:text-red-500 transition-colors">خروج</button>
                        </>
                    ) : (
                        <>
                            <Link to="/Login" className="hover:text-blue-600 transition-colors">ورود</Link>
                            <Link to="/SignUp" className="hover:text-blue-600 transition-colors">ثبت نام</Link>
                        </>
                    )}
                </div>

                {/* Dark Mode Toggle */}
                <DarkModeSwitch
                    checked={darkSide}
                    onChange={toggleDarkMode}
                    size={30}
                    className="ml-4"
                />

                {/* Mobile Menu Toggle Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-2xl text-gray-700 dark:text-white">
                        {navRes ? <MdCancel size={24} /> : <GrMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {navRes && (
                <div className="md:hidden bg-gray-100 dark:bg-gray-800 text-center py-6 space-y-4">
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
            )}
        </div>
    );
};
