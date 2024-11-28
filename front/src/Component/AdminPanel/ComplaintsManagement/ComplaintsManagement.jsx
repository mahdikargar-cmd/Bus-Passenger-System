import React, { useState } from 'react';
import Modal from 'react-modal';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';

const ManageComplaints = ({ complaints, handleAddComplaint, handleDeleteComplaint }) => {
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const { control, handleSubmit, reset } = useForm();

    const openModalHandler = (complaint = null) => {
        setSelectedComplaint(complaint);
        setIsEdit(complaint ? true : false);
        setOpenModal(true);
        if (complaint) {
            reset(complaint);
        }
    };

    const closeModalHandler = () => {
        setOpenModal(false);
        reset();
    };

    const onSubmit = (data) => {
        if (isEdit) {
            // Edit existing complaint
            handleAddComplaint(data, selectedComplaint._id);
        } else {
            // Add new complaint
            handleAddComplaint(data);
        }
        closeModalHandler();
    };

    return (
        <>
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => openModalHandler(null)}
                    className="text-teal-50 hover:bg-green-700 transition-all duration-300 hover:w-[10%] bg-green-500 w-[20%] content-center rounded p-2 pr-3 pl-3"
                >
                    افزودن شکایت جدید
                </button>
            </div>

            <div className="grid grid-cols-12 mt-2 shadow rounded">
                {complaints && complaints.length > 0 ? (
                    complaints.map((complaint, index) => (
                        <div className="flex justify-between m-2 p-2 col-span-12" key={complaint._id}>
                            <div className="col-span-1 ml-10 mr-1"> شماره: {index + 1} </div>
                            <div className="col-span-3 ml-10"> عنوان شکایت: {complaint.title} </div>
                            <div className="col-span-3 ml-10"> تاریخ ثبت: {new Date(complaint.createdAt).toLocaleString("fa-IR")} </div>
                            <div className="col-span-2 ml-10"> وضعیت: {complaint.status} </div>
                            <div className="col-span-1 ml-14 font-semibold text-[22px]">
                                <button onClick={() => openModalHandler(complaint)}>ویرایش</button>
                            </div>
                            <div className="col-span-1 ml-14 font-semibold text-[22px]" onClick={() => handleDeleteComplaint(complaint._id)}>
                                <button>حذف</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-6 p-2 flex justify-between text-black">هیچ شکایتی موجود نیست.</p>
                )}
            </div>


            <Modal
                isOpen={openModal}
                onRequestClose={closeModalHandler}
                className="bg-slate-500 w-[700px] flex justify-center text-white p-4 mt-20 mr-[30%] h-[500px] rounded-lg shadow-xl"
            >
                <div className="bg-white text-black p-6 rounded-lg w-full h-full overflow-auto">
                    <h1 className="mt-4 text-[20px] font-semibold mb-5 text-center text-gray-800">
                        {isEdit ? "ویرایش شکایت" : "ثبت شکایت جدید"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <label className="text-gray-700">عنوان شکایت</label>
                                <Controller
                                    name="title"
                                    control={control}
                                    defaultValue={selectedComplaint?.title || ''}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    )}
                                />
                            </div>

                            <div className="col-span-12">
                                <label className="text-gray-700">توضیحات شکایت</label>
                                <Controller
                                    name="description"
                                    control={control}
                                    defaultValue={selectedComplaint?.description || ''}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="w-full p-2 border border-gray-300 rounded h-32"
                                        />
                                    )}
                                />
                            </div>

                            <div className="col-span-12">
                                <label className="text-gray-700">وضعیت شکایت</label>
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue={selectedComplaint?.status || 'در حال بررسی'}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={[
                                                { value: 'در حال بررسی', label: 'در حال بررسی' },
                                                { value: 'برطرف شده', label: 'برطرف شده' },
                                                { value: 'رد شده', label: 'رد شده' },
                                            ]}
                                            className="text-black"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-12 mt-10 gap-4">
                            <div className="col-span-6 flex justify-center bg-red-600 p-2 rounded hover:bg-red-700 transition-all ease-out">
                                <button type="button" onClick={closeModalHandler} className="text-white font-semibold">لغو</button>
                            </div>
                            <div className="col-span-6 flex justify-center bg-green-600 hover:bg-green-700 transition-all ease-out p-2 rounded">
                                <button type="submit" className="text-white font-semibold">تایید</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default ManageComplaints;
