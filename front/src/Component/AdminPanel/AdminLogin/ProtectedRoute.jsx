import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext'; // فرض بر این است که AuthContext ساخته شده

const ProtectedRoute = ({ element: Element, ...rest }) => {
    const { user } = useAuth(); // وضعیت ورود کاربر را از context می‌خوانیم

    // اگر کاربر لاگین نکرده باشد، به صفحه ورود هدایت می‌شود
    return (
        <Route
            {...rest}
            element={user ? <Element /> : <Navigate to="/adminLogin" />}
        />
    );
};

export default ProtectedRoute;
