import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {createRoot} from "react-dom/client";
import {AuthProvider} from "./Component/contexts/AuthContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
    <BrowserRouter>
            <React.StrictMode>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </React.StrictMode>,
    </BrowserRouter>
);
reportWebVitals();
