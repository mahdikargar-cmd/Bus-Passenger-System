import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {createRoot} from "react-dom/client";
import {AuthProvider} from "./Component/contexts/AuthContext";
import {Header} from "./Component/Main-page/Header/Header";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
    <BrowserRouter>
            <React.StrictMode>
                <AuthProvider>
                    <Header />
                    <App/>
                </AuthProvider>
            </React.StrictMode>,
    </BrowserRouter>
);
reportWebVitals();
