import React, { useState } from 'react';
import { Header } from "../Main-page/Header/Header";
import { Footer } from "../Main-page/Footer/Footer";
import { TicketInquiry } from "./TicketInquiry/TicketInquiry";
import { StatusTicket } from "./StatusTicket/StatusTicket";
import {UserTicket} from "./userTicket/UserTicket";

export const UserPanel = () => {
    const [activeComponent, setActiveComponent] = useState("ticketInquiry");

    const info = [
        {
            text: "استرداد بلیط ",
            id: 1,
            link: "/ticketInquiry",
            component: "ticketInquiry",
        },
        {
            text: "استعلام بلیط ",
            id: 2,
            link: "/status",
            component: "status",
        },
        {
            text: " بلیط های من ",
            id: 2,
            link: "/userTicket",
            component: "userTicket",
        },
    ];

    const renderComponent = () => {
        switch (activeComponent) {
            case "ticketInquiry":
                return <TicketInquiry />;
            case "status":
                return <StatusTicket />;
            case "userTicket":
                return <UserTicket/>
            default:
                return null;
        }
    };

    return (
        <>
            <Header />
            <div className="grid grid-cols-12 mb-14 mt-14">
                {info.map((item) => (
                    <div key={item.id} className=" col-span-1 m-2">
                        <div className="rounded p-2 bg-white dark:bg-dark-blue dark:text-white">
                            <button onClick={() => setActiveComponent(item.component)} className="shadow w-full">
                                {item.text}
                            </button>
                        </div>
                    </div>
                ))}
                <div className="col-span-10 m-2 rounded flex justify-center mr-56 ">
                    {renderComponent()}
                </div>
            </div>
            <Footer />
        </>
    );
};
