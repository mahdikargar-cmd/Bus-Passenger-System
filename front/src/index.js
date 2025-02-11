import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, HashRouter} from 'react-router-dom';
import {createRoot} from "react-dom/client";
import {AuthProvider} from "./Component/AuthContext/AuthContext";
import {Header} from "./Component/Main-page/Header/Header";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
    <HashRouter>
            <React.StrictMode>
                <AuthProvider>
                    <Header />
                    <App/>
                </AuthProvider>
            </React.StrictMode>,
    </HashRouter>
);
reportWebVitals();
