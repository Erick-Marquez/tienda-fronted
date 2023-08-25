import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Steps } from 'primereact/steps';
import React, { useState } from 'react';
import styles from './index.module.scss';
import { Chip } from 'primereact/chip';
import { UniqueComponentId } from 'primereact/utils';

const OrdersPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [orderData, setOrderData] = useState({
        first_course_orders: [],
        main_course_orders: [],
    });

    const stepItems = [
        { label: 'Mesa', disabled: false },
        { label: 'Clientes', disabled: orderData.table_id == undefined },
        { label: 'Entradas', disabled: orderData.number_of_customers == undefined },
        { label: 'Fondos', disabled: orderData.number_of_customers == undefined },
        { label: 'Confirmación', disabled: !(orderData.number_of_customers ==  orderData.first_course_orders.length && orderData.number_of_customers == orderData.main_course_orders.length) }
    ]


    const tables = [
        { id: 1, name: "1", is_available: 1 },
        { id: 2, name: "2", is_available: 0 },
        { id: 3, name: "3", is_available: 1 },
        { id: 4, name: "4", is_available: 1 },
        { id: 5, name: "5", is_available: 1 },
        { id: 6, name: "6", is_available: 1 },
        { id: 7, name: "7", is_available: 0 },
        { id: 8, name: "8", is_available: 1 },
        { id: 9, name: "9", is_available: 0 },
        { id: 10, name: "10", is_available: 1 },
    ]

    const numberOfCustomers = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
        { value: 7, label: "7" },
        { value: 8, label: "8" },
        { value: 9, label: "9" },
        { value: 10, label: "10" },
    ]

    const firstCourses = [
        { id: 1, name: "Cazuela", is_available: 1, image: "cazuela.jpg" },
        { id: 2, name: "Salpicón", is_available: 1, image: "salpicon.jpg" },
        { id: 3, name: "Sin entrada", is_available: 1, image: "salpicon.jpg" },
    ]

    const mainCourses = [
        { id: 1, name: "Seco de res con frejoles", is_available: 1, image: "seco-de-res-con-frejoles.jpg" },
        { id: 2, name: "Escabeche de pollo", is_available: 1, image: "escabeche-de-pollo.jpg" },
        { id: 3, name: "Tallarines rojos con pollo", is_available: 1, image: "tallarines-rojo-con-pollo.jpg" },
        { id: 4, name: "Arroz chaufa de pollo", is_available: 1, image: "arroz-chaufa-de-pollo.jpg" }
    ]

    const dataviewGridItem = (data) => {
        const onClickTable = () => {
            setOrderData({
                ...orderData,
                table_id: data.id
            })
            setActiveIndex(1)
        }
        return (
            <div className="col-6 lg:col-2 md:col-4">
                <div className="m-3 lg:m-5">
                    <Button 
                        className="py-4 col-12" 
                        style={{fontSize: "3rem"}} 
                        label={data.name} 
                        disabled={!data.is_available} 
                        severity={data.is_available ? 'success' : 'danger'}
                        onClick={onClickTable}
                    />
                </div>
            </div>
        );
    };

    const dataviewGridCustomer = (data) => {
        const onClickCustomer = () => {
            setOrderData({
                ...orderData,
                number_of_customers: data.value,
                first_course_remaining_clicks: data.value,
                first_course_orders: [],
                main_course_remaining_clicks: data.value,
                main_course_orders: [],
            })
            setActiveIndex(2)
        }
        return (
            <div className="col-6 lg:col-2 md:col-4">
                <div className="m-3 lg:m-5">
                    <Button 
                        className="py-4 col-12" 
                        style={{fontSize: "3rem"}} 
                        label={data.label}
                        onClick={onClickCustomer}
                    />
                </div>
            </div>
        );
    };

    const dataviewGridFirstCourse = (data) => {
        const onClickFirstCourse = () => {
            if (orderData.first_course_remaining_clicks > 0) {
                setOrderData({
                    ...orderData,
                    first_course_remaining_clicks: orderData.first_course_remaining_clicks - 1,
                    first_course_orders: [
                        ...orderData.first_course_orders,
                        {
                            ...data,
                            uuid: UniqueComponentId()
                        }
                    ]
                })
                if (orderData.first_course_remaining_clicks - 1 == 0) {
                    setActiveIndex(3)
                }
            }
        }
        return (
            <div className="col-12 lg:col-4 md:col-4">
                <div className="m-3 lg:m-5">
                    <Button 
                        className={styles['first-course']} 
                        label={data.label} 
                        disabled={!data.is_available}
                        onClick={onClickFirstCourse}
                    >
                        <div className="flex flex-column align-items-center text-center mb-3">
                            <img src={`/demo/images/first-course/${data.image}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                            <div className="text-2xl font-bold">{data.name}</div>
                            <div className="mb-3">{data.description}</div>
                        </div>
                    </Button>
                </div>
            </div>
        );
    };
    const chipsToFirstCourses = () => {
        return orderData.first_course_orders.map((first_course) => (
            <Chip 
                key={first_course.uuid} 
                label={first_course.name} 
                image={`/demo/images/first-course/${first_course.image}`} 
                onRemove={() => {

                    let orderBkp = orderData.first_course_orders

                    let newOrder = orderBkp.filter(fc => fc.uuid != first_course.uuid);

                    setOrderData({
                        ...orderData,
                        first_course_remaining_clicks: orderData.first_course_remaining_clicks + 1,
                        first_course_orders: [
                            ...newOrder,
                        ]
                    })
                }} 
                removable 
            />
        ))
    }

    const dataviewGridMainCourse = (data) => {
        const onClickMainCourse = () => {
            if (orderData.main_course_remaining_clicks > 0) {
                setOrderData({
                    ...orderData,
                    main_course_remaining_clicks: orderData.main_course_remaining_clicks - 1,
                    main_course_orders: [
                        ...orderData.main_course_orders,
                        {
                            ...data,
                            uuid: UniqueComponentId()
                        }
                    ]
                })
                if (orderData.main_course_remaining_clicks - 1 == 0 && orderData.first_course_orders.length == orderData.number_of_customers) {
                    setActiveIndex(4)
                }
            }
        }
        return (
            <div className="col-12 lg:col-4 md:col-4">
                <div className="m-3 lg:m-5">
                    <Button 
                        className={styles['first-course']} 
                        label={data.label} 
                        disabled={!data.is_available}
                        onClick={onClickMainCourse}
                    >
                        <div className="flex flex-column align-items-center text-center mb-3">
                            <img src={`/demo/images/main-course/${data.image}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                            <div className="text-2xl font-bold">{data.name}</div>
                            <div className="mb-3">{data.description}</div>
                        </div>
                    </Button>
                </div>
            </div>
        );
    };

    const chipsToMainCourses = () => {
        return orderData.main_course_orders.map((main_course) => (
            <Chip 
                key={main_course.uuid}
                label={main_course.name}
                image={`/demo/images/main-course/${main_course.image}`}
                onRemove={() => {

                    let orderBkp = orderData.main_course_orders

                    let newOrder = orderBkp.filter(mc => mc.uuid != main_course.uuid);

                    setOrderData({
                        ...orderData,
                        main_course_remaining_clicks: orderData.main_course_remaining_clicks + 1,
                        main_course_orders: [
                            ...newOrder,
                        ]
                    })
                }}
                removable 
            />
        ))
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Steps model={stepItems} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false}/>
                    {activeIndex == 0 ? 
                        <>
                            <h4>Mesas</h4>
                            <DataView value={tables} layout="grid" itemTemplate={dataviewGridItem} className='mt-2'/>
                        </>
                    : activeIndex == 1 ?
                        <>
                            <h4>Clientes</h4>
                            <DataView value={numberOfCustomers} layout="grid" itemTemplate={dataviewGridCustomer} className='mt-2'/>
                        </>
                    : activeIndex == 2 ?
                        <>
                            <h4>Entradas</h4>
                            {chipsToFirstCourses()}
                            <DataView value={firstCourses} layout="grid" itemTemplate={dataviewGridFirstCourse} className='mt-2'/>
                        </>
                    : activeIndex == 3 ?
                        <>
                            <h4>Fondos</h4>
                            {chipsToMainCourses()}
                            <DataView value={mainCourses} layout="grid" itemTemplate={dataviewGridMainCourse} className='mt-2'/>
                        </>
                    : activeIndex == 4 ?
                        <>
                            <h4>Confirmación</h4>
                            <div>
                                <h4>Orden</h4>
                                <h5>Entradas</h5>
                                <ul>
                                    {
                                        orderData.first_course_orders.map((e) => (
                                            <li key={e.uuid}>{e.name}</li>
                                        ))
                                    }
                                </ul>
                                <h5>Fondos</h5>
                                <ul>
                                    {
                                        orderData.main_course_orders.map((e) => (
                                            <li key={e.uuid}>{e.name}</li>
                                        ))
                                    }
                                </ul>
                                <Button label="Confirmar"/>
                            </div>
                        </>
                    :
                        <></>
                    }
                    


                </div>
            </div>
        </div>
    );
};

export default OrdersPage;