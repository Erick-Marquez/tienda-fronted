import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

import { InputNumber } from 'primereact/inputnumber'
import { AutoComplete } from 'primereact/autocomplete'

import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'

import { ConfirmDialog } from 'primereact/confirmdialog'
import { confirmDialog } from 'primereact/confirmdialog'

import { InputTextarea } from "primereact/inputtextarea"

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import { Button } from 'primereact/button'
import { useEventListener } from 'primereact/hooks'
import { ProductService } from '../../services/ProductService'
import { SaleService } from '../../services/SaleService'
import { ticketPdf } from '../../libs/pdf/ticketPdf'
        

const PointOfSalePage = () => {
    const toast = useRef(null)

    const reason = useRef(null)
    const [isVisibleDialogDelete, setIsVisibleDialogDelete] = useState(false)
    const [productDeleted, setProductDeleted] = useState({})

    const [allProducts, setAllProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isVisibleDialogProductWeighable, setIsVisibleDialogProductWeighable] = useState(false)
    const [productWighable, setProductWeighable] = useState({})
    const priceProductWighable = useRef(null)
    const searchingProducts = useRef(null)


    const [products, setProducts] = useState([])
    const [typeOfPayment, setTypeOfPayment] = useState([])


    const [modalPaymentsIsVisible, setModalPaymentsIsVisible] = useState(false)
    const [modalPrintTicketIsVisible, setModalPrintTicketIsVisible] = useState(false)

    const [step, setStep] = useState(1)
    const [bindKey, unbindKey] = useEventListener({
        type: 'keydown',
        listener: (e) => handleKey(e)
    })

    useEffect(() => {
        bindKey()
        return () => unbindKey()
    }, [bindKey, unbindKey])

    function handleKey(e) {
        const fun = {
            1: (e) => step1(e),
            2: (e) => step2(e),
            3: (e) => step3(e),
            4: (e) => step4(e),
        }
        fun[step](e)
    }
    
    function step1(e) {
        if (e.key === 'F2') {
            setModalPaymentsIsVisible(true)
            setStep(2)
        }
    }

    function step2(e) {
        if (['1', '2'].includes(e.key)) {
            setModalPaymentsIsVisible(false)
            setModalPrintTicketIsVisible(true)
            setTypeOfPayment(e.key)
            setStep(3)
        }
    }

    function step3(e) {
        if (e.key === '1') {
            saveSale({ticket: false})
            setModalPrintTicketIsVisible(false)
            setStep(1)
        }
        if (e.key === '2') {
            saveSale({ticket: true})
            setModalPrintTicketIsVisible(false)
            setStep(1)
        }
    }

    function step4(e) {
        
    }

    

    useEffect(() => {
        searchingProducts.current.focus()
        ProductService.getAll()
        .then(data => setAllProducts(data.data.map(p => ({...p, sale_price: parseFloat(p.sale_price)}))))
    }, [])

    function closeSaleProcess() {
        setModalPaymentsIsVisible(false)
        setModalPrintTicketIsVisible(false)

        setStep(1)
    }

    function saveSale({ticket}) {

        const body = {
            type_of_payment_id: typeOfPayment,
            details: products
        }

        SaleService.create(body)
        .then(res => {
            console.log(res);
            toast.current.show({ 
                severity: 'success', 
                summary: 'Confirmado', 
                detail: `Se ha realizado la venta ${res.data.serie.serie}-${res.data.document_number}`, 
                life: 3000
            })
            setProducts([])
            if (ticket) {
                ticketPdf(res.data)
            }
            searchingProducts.current.focus()
        })
        .catch(err => {
            console.log(err);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrio un incoveniente', life: 3000 })
        })
        
    }

    const searchProduct = (event) => {
        let _filteredProducts

        if (!event.query.trim().length) {
            _filteredProducts = [...allProducts]
        }
        else {
            _filteredProducts = allProducts.filter((product) => {
                return product.name.toLowerCase().includes(event.query.toLowerCase()) 
                || product.internal_code.toLowerCase() === event.query.toLowerCase()
            })
        }

        setFilteredProducts(_filteredProducts)
    }

    const onSelectProduct = (event) => {
        setSelectedProduct(null)

        let _products = [...products]
        let _selectedProduct = {...event.value}

        if (_selectedProduct.is_weighable) {
            setIsVisibleDialogProductWeighable(true)
            setProductWeighable(_selectedProduct)
        }
        else {
            let index = _products.findIndex(p => p.internal_code === _selectedProduct.internal_code)
            if (index !== -1) {
                _products[index].quantity += 1
                _products[index].total += _selectedProduct.sale_price
            } else {
                _products.push({
                    ..._selectedProduct,
                    quantity: 1,
                    total: _selectedProduct.sale_price
                })
            }
            setProducts(_products)
        }

        
    }

    const acceptProductWeighable = (event) => {
        event.preventDefault()
        let _products = [...products]
        let _selectedProduct = {...productWighable}

        let index = _products.findIndex(p => p.internal_code === _selectedProduct.internal_code)
        if (index !== -1) {
            _products[index].sale_price += Number(priceProductWighable.current.ariaValueNow)
            _products[index].total += Number(priceProductWighable.current.ariaValueNow)
        } else {
            _products.push({
                ..._selectedProduct,
                quantity: 1,
                sale_price: Number(priceProductWighable.current.ariaValueNow),
                total: Number(priceProductWighable.current.ariaValueNow)
            })
        }
        setProducts(_products)
        setProductWeighable({})
        setIsVisibleDialogProductWeighable(false)
        searchingProducts.current.focus()
    }

    const tableFooterGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Total:" colSpan={4} footerStyle={{ textAlign: 'right' }} />
                <Column 
                    footer={(
                        <div className='flex justify-content-around'>
                            <span>S/.</span>
                            <span className=''>{products.reduce((t,v) => t+v.total, 0).toFixed(2)}</span>
                        </div>
                    )} 
                />
                <Column />
            </Row>
        </ColumnGroup>
    );

    const convertToPrice = (row, { field }) => {
        return (
            <div className='flex justify-content-around'>
                <span>S/.</span>
                <span className=''>{row[field].toFixed(2)}</span>
            </div>
        )
    }

    const acceptDelete = (event) => {
        event.preventDefault()
        
        let _products = [...products]
        let _selectedProduct = {...productDeleted}

        let index = _products.findIndex(p => p.internal_code === _selectedProduct.internal_code)
        if (index !== -1) {
            _products.splice(index, 1)
        } else {
            toast.current.show({ severity: 'error', summary: 'Confirmed', detail: `You have accepted`, life: 3000 })
        }
        setProducts(_products)
        setProductDeleted({})
        setIsVisibleDialogDelete(false)
        searchingProducts.current.focus()

        toast.current.show({ severity: 'success', summary: 'Eliminado', detail: `El producto fue eliminado`, life: 3000 })
    }

    const openDialogDeleteProduct = (e) => {
        setIsVisibleDialogDelete(true)
        setProductDeleted(e)
    }


    const actions = (row) => {
        return (
            <div className='flex justify-content-center'>
                <Button className={styles['btn-table']} icon="pi pi-pencil" aria-label="Filter" severity="warning" size="small" />
                <Button 
                    className={styles['btn-table']} 
                    icon="pi pi-trash" 
                    aria-label="Filter" 
                    severity="danger" 
                    size="small" 
                    onClick={() => openDialogDeleteProduct(row)} 
                />
            </div>
        )
    }

    return (<>
        <Toast ref={toast} />
        <ConfirmDialog />


        <Dialog 
            visible={modalPaymentsIsVisible} 
            style={{ width: '50vw' }} 
            onHide={() => closeSaleProcess()}
            draggable={false}
        >
            <div className='flex justify-content-evenly'>
                <div className='flex flex-column align-items-center'>
                    <img alt="efectivo" src="/images/efectivo.png" width="200" className='mb-4'></img>
                    <Button 
                        className='flex flex-row-reverse' 
                        label="Efectivo" 
                        severity="secondary" 
                        outlined 
                        size='small' 
                        icon={() => <img alt="icon" src="/icons/1.png" width="35" className='ml-2' />}
                        onClick={() => step2({key: '1'})}
                    />
                </div>
                <div className='flex flex-column align-items-center'>
                    <img alt="tarjeta" src="/images/tarjeta.png" width="200" className='mb-4'></img>
                    <Button 
                        className='flex flex-row-reverse' 
                        label="Tarjeta" 
                        severity="secondary" 
                        outlined 
                        size='small' 
                        icon={() => <img alt="icon" src="/icons/2.png" width="35" className='ml-2' />}
                        onClick={() => step2({key: '2'})}
                    />
                </div>
            </div>
        </Dialog>

        <Dialog 
            visible={modalPrintTicketIsVisible} 
            style={{ width: '30vw' }} 
            onHide={() => closeSaleProcess()}
            draggable={false}
        >
            <div className='flex justify-content-center mb-3'>
                <img alt="imprimir" src="/images/imprimir.png" width="200" className='mb-4'></img>
            </div>

            <div className='flex justify-content-evenly'>
                <Button 
                    className='flex flex-row-reverse' 
                    label="NO" 
                    severity="secondary" 
                    outlined 
                    size='small' 
                    icon={() => <img alt="icon" src="/icons/1.png" width="35" className='ml-2' />}
                    onClick={() => step3({key: '1'})}
                />
                <Button 
                    className='flex flex-row-reverse' 
                    label="SI" 
                    severity="secondary" 
                    outlined 
                    size='small' 
                    icon={() => <img alt="icon" src="/icons/2.png" width="35" className='ml-2' />}
                    onClick={() => step3({key: '2'})}
                />
            </div>
        </Dialog>

        
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <div className="flex justify-content-center my-4">
                        <AutoComplete 
                            className='p-0 col-12 md:col-6 xl:col-4' 
                            inputClassName='w-full'
                            field='name'
                            value={selectedProduct}
                            delay={0}
                            completeMethod={searchProduct}
                            suggestions={filteredProducts}
                            onChange={(e) => setSelectedProduct(e.value)}
                            autoHighlight
                            onSelect={onSelectProduct}
                            ref={searchingProducts}
                        />
                        <Dialog 
                            header="Asignar Precio" 
                            visible={isVisibleDialogProductWeighable}
                            onShow={() => priceProductWighable.current.focus()}
                            onHide={() => setIsVisibleDialogProductWeighable(false)}
                            style={{ width: '30vw' }} 
                            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                        >
                            <form onSubmit={acceptProductWeighable} autoComplete="off">
                                <div className="w-full my-4">
                                    <InputNumber 
                                        className='w-full'
                                        inputId="currency-pe" 
                                        mode="currency" 
                                        currency="PEN" 
                                        locale="es-PE" 
                                        autoComplete="off"
                                        inputRef={priceProductWighable}
                                    />
                                </div>
                                <div className="w-full flex justify-content-end gap-2">
                                    <Button type="button" label="Cancelar" text onClick={() => setIsVisibleDialogProductWeighable(false)}/>
                                    <Button type="submit" severity="danger" label="Aceptar"/>
                                </div>
                            </form>
                        </Dialog>
                    </div>
                    <DataTable value={products} footerColumnGroup={tableFooterGroup} tableStyle={{ minWidth: '50rem' }}>
                        <Column alignHeader="center" align="center" field="internal_code" header="Código"></Column>
                        <Column field="name" header="Descripcion"></Column>
                        <Column alignHeader="center" align="center" field="quantity" header="Cantidad"></Column>
                        <Column alignHeader="center" field="sale_price" header="Precio" body={convertToPrice}></Column>
                        <Column alignHeader="center" field="total" header="Total" body={convertToPrice}></Column>
                        <Column alignHeader="center" align="center" header="Acciones" body={actions}></Column>
                    </DataTable>

                    <Dialog 
                        header="Confirmar" 
                        visible={isVisibleDialogDelete} 
                        onShow={() => reason.current.focus()}
                        onHide={() => setIsVisibleDialogDelete(false)}
                        style={{ width: '50vw' }} 
                        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                    >
                        <form onSubmit={acceptDelete}>
                            <div className="w-full my-4">
                                <span className="p-float-label">
                                    <InputTextarea id="reason" ref={reason} rows={5} className='w-full' autoResize required/>
                                    <label htmlFor="reason">Motivo</label>
                                </span>
                            </div>
                            <div className="w-full flex justify-content-end gap-2">
                                <Button type="button" label="Cancelar" text onClick={() => setIsVisibleDialogDelete(false)}/>
                                <Button type="submit" severity="danger" label="Eliminar"/>
                            </div>
                        </form>
                    </Dialog>
                </div>
            </div>
        </div>
    </>);
};

export default PointOfSalePage;