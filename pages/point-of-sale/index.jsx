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

    const [bindKeyDown, unbindKeyDown] = useEventListener({
        type: 'keydown',
        listener: (e) => {
            handleKeyDown(e)
        }
    })

    useEffect(() => {
        bindKeyDown()

        return () => {
            unbindKeyDown()
        };
    }, [bindKeyDown, unbindKeyDown])

    function handleKeyDown(e) {
        if (e.key === "F2") {
            console.log(e);
            confirmDialog({
                message: '¿Quieres guardar la venta?',
                header: 'Confirmación',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Si',
                accept: () => {
                    saveSale()
                    bindKeyDown()
                },
                reject: () => {
                    toast.current.show({ severity: 'warn', summary: 'Rechazado', detail: 'Se ha rechazado la venta', life: 3000 })
                    bindKeyDown()
                }
            }) 
            unbindKeyDown()
        }
    }

    // useEffect(() => {
    //     function handleKeyDown(e) {

    //         const accept = () => {
    //             saveSale()
    //             document.addEventListener("keydown", handleKeyDown)
    //         }
        
    //         const reject = () => {
    //             toast.current.show({ severity: 'warn', summary: 'Rechazado', detail: 'Se ha rechazado la venta', life: 3000 })
    //             document.addEventListener("keydown", handleKeyDown)
    //         }

    //         if (e.key === "F2") {
    //             console.log(e);
    //             confirmDialog({
    //                 message: '¿Quieres guardar la venta?',
    //                 header: 'Confirmación',
    //                 icon: 'pi pi-exclamation-triangle',
    //                 acceptLabel: 'Si',
    //                 accept,
    //                 reject
    //             }) 
    //             document.removeEventListener("keydown", handleKeyDown) 
    //         }
    //     }

    //     document.addEventListener("keydown", handleKeyDown)
    //     return () => {
    //       document.removeEventListener("keydown", handleKeyDown)
    //     }
    // }, [])

    useEffect(() => {
        searchingProducts.current.focus()

        // CountryService.getCountries().then((data) => setCountries(data));

        ProductService.getAll()
        .then(data => setAllProducts(data.data.map(p => ({...p, sale_price: parseFloat(p.sale_price)}))))
        // setAllProducts([
        //     { name: 'Galleta Soda', internal_code: '1111', sale_price: 1, is_weighable: false },
        //     { name: 'Trident', internal_code: '2222', sale_price: 1.2, is_weighable: false },
        //     { name: 'Papas Lays', internal_code: '3333', sale_price: 1.5, is_weighable: false },
        //     { name: 'Sporade 550ml', internal_code: '4444', sale_price: 2, is_weighable: false },
        //     { name: 'Apio', internal_code: '5555', sale_price: 1, is_weighable: true },
        //     { name: 'Pollo', internal_code: '6666', sale_price: 1, is_weighable: true },
        //     { name: 'Arroz', internal_code: '7777', sale_price: 4, is_weighable: true },
        // ])

    }, [])

    function saveSale() {
        console.log(products)

        const body = {
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
            ticketPdf(res.data)
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
                return product.name.toLowerCase().startsWith(event.query.toLowerCase()) 
                || product.internal_code.toLowerCase().startsWith(event.query.toLowerCase()) 
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
                            // onKeyPress={e => console.log(e)}
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