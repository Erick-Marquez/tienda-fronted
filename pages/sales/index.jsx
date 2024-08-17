import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { FilterMatchMode } from 'primereact/api'
import { addLocale } from 'primereact/api'

import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'

import { SplitButton } from 'primereact/splitbutton'
import { SaleService } from '../../services/SaleService'
import moment from 'moment/moment'
import { ticketPdf } from '../../libs/pdf/ticketPdf'
// import printJS from 'print-js'
        

const SalePage = () => {
    const toast = useRef(null)

    const [modalConvertInvoiceIsVisible, setModalConvertInvoiceIsVisible] = useState(false)
    const [date, setDate] = useState(null)
    const [selectedTypeInvoice, setSelectedTypeInvoice] = useState(null)
    const [selectedSerie, setSelectedSerie] = useState(null)
    const [selectedIdentificationDocument, setSelectedIdentificationDocument] = useState(null)
    const [documentNumber, setDocumentNumber] = useState(null)
    const [customerName, setCustomerName] = useState(null)

    const [isLoadingCreateInvoice, setIsLoadingCreateInvoice] = useState(false)

    const [sales, setSales] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [isLoadingTable, setIsLoadingTable] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 5,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    });

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);

    function loadLazyData() {
        setIsLoadingTable(true);

        SaleService.getSales(lazyState)
        .then(res => {
            setTotalRecords(res.data.total);
            setSales(res.data.data);
        })
        .catch(err => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrio un incoveniente', life: 3000 })
        })
        .finally(() => {
            setIsLoadingTable(false)
        })

    };


    addLocale('es', {
        firstDayOfWeek: 1,
        showMonthAfterYear: true,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    })


    const onPage = (event) => {
        setlazyState(event)
    }

    const onSearch = (e) => {
        let _filters = { ...lazyState }
        _filters['first'] = 0
        _filters['filters']['global'].value = globalFilterValue
        console.log(_filters);
        setlazyState(_filters)
    }
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Ventas</h4>
                
                <span className="p-input-icon-left">
                    <div className="p-inputgroup">
                        <InputText value={globalFilterValue} onChange={(e) => setGlobalFilterValue(e.target.value)} placeholder="Buscar"/>
                        <Button icon="pi pi-search" className="p-button-primary" onClick={onSearch}/>
                    </div>
                </span>
            </div>
        )
    }
    const header = renderHeader()

    const fechaTemplate = (rowData) => moment(rowData.created_at).format('DD/MM/YYYY hh:mm A')
    const serieTemplate = (rowData) => `${rowData.serie.serie}-${rowData.document_number}`
    const totalTemplate = (rowData) => `S/. ${rowData.total}`
    const actionTemplate = (rowData) => {
        return (
            <SplitButton label="Acciones" size="small" model={[
                {
                    label: 'Crear comprobante',
                    icon: 'pi pi-file-edit',
                    command: () => {
                        setDate(new Date())
                        setSelectedTypeInvoice(3)
                        setSelectedSerie(2)
                        setSelectedIdentificationDocument(1)
                        setDocumentNumber('00000000')
                        setCustomerName('Clientes varios')
                        setModalConvertInvoiceIsVisible(true)
                    }
                },
                {
                    label: 'Imprimir recibo',
                    icon: 'pi pi-print',
                    command: () => {
                        // printJS('prueba', 'html')
                        SaleService.getSale(rowData.id)
                        .then(res => {

                            res.data.total = Number(res.data.total)

                            for (const iterator of res.data.sale_details) {
                                iterator.name = iterator.product.name
                                iterator.sale_price = Number(iterator.price)
                                iterator.total = Number(iterator.total)
                            }
                            ticketPdf(res.data)
                        })
                        .catch(err => {
                            console.log(err);
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrio un incoveniente', life: 3000 })
                        })
                    }
                }
            ]} />
        )
    }

    const createInvoice = () => {
        setIsLoadingCreateInvoice(true)

        const body = {
            date_issue: date,
            serie_id: selectedSerie,
            customer: {
                identification_document_id: selectedIdentificationDocument,
                document: documentNumber,
                name: customerName
            }
        }

        SaleService.convertInvoice(body)
        .then(res => {
            toast.current.show({ 
                severity: 'success', 
                summary: 'Confirmado', 
                detail: `Se ha creado el comprobante ${res.data.serie}-${res.data.document_number}`, 
                life: 3000
            })
        })
        .catch(err => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrio un incoveniente', life: 3000 })
        })
        .finally(() => {
            setIsLoadingCreateInvoice(false)
        })
    }

    return (<>
        <Toast ref={toast} />

        <Dialog
            visible={modalConvertInvoiceIsVisible} 
            style={{ width: '70vw' }} 
            className="p-fluid"
            onHide={() => setModalConvertInvoiceIsVisible(false)}
            draggable={false}
            header="Convertir a comprobante"
            footer={(
                <div>
                    <Button label="Cancelar" severity="danger" onClick={() => setModalConvertInvoiceIsVisible(false)}/>
                    <Button label="Crear Comprobante" severity="success" onClick={createInvoice} loading={isLoadingCreateInvoice}/>
                </div>
            )}
        >
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="date_of_issue">Fecha de emisión</label>
                    <Calendar 
                        inputId="date_of_issue" 
                        value={date} 
                        onChange={(e) => setDate(e.value)}
                        maxDate={new Date()}
                        locale="es"
                        dateFormat='dd/mm/yy'
                        showIcon 
                    />
                </div>
                <div className="field col">
                    <label htmlFor="voucher_type_id">Tipo comprobante</label>
                    <Dropdown
                        inputId="voucher_type_id"
                        value={selectedTypeInvoice} 
                        onChange={(e) => setSelectedTypeInvoice(e.value)} 
                        options={[
                            { name: 'Boleta Electrónica', code: 3 }
                        ]} 
                        optionLabel="name"
                        optionValue="code"
                        placeholder="Selecciona" 
                    />
                </div>
                <div className="field col">
                    <label htmlFor="serie_id">Serie</label>
                    <Dropdown 
                        inputId="serie_id"
                        value={selectedSerie} 
                        onChange={(e) => setSelectedSerie(e.value)} 
                        options={[
                            { name: 'B001', code: 2 }
                        ]} 
                        optionLabel="name"
                        optionValue="code"
                        placeholder="Selecciona" 
                    />
                </div>
            </div>
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="identification_document_id">Tipo documento</label>
                    <Dropdown 
                        inputId="identification_document_id"
                        value={selectedIdentificationDocument} 
                        onChange={(e) => setSelectedIdentificationDocument(e.value)} 
                        options={[
                            { name: 'DNI', code: 1 }
                        ]} 
                        optionLabel="name"
                        optionValue="code"
                        placeholder="Selecciona" 
                    />
                </div>
                <div className="field col">
                    <label htmlFor="document">Nro. Documento</label>
                    <InputText 
                        inputId="document"
                        value={documentNumber} 
                        onChange={(e) => setDocumentNumber(e.value)}
                        keyfilter="int"
                        maxLength={8}
                    />
                </div>
                <div className="field col">
                    <label htmlFor="customerName">Nombre</label>
                    <InputText 
                        inputId="customerName"
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.value)}
                    />
                </div>
            </div>
        </Dialog>
        
        <div className="card">
            <Toolbar 
                className="mb-4" 
                left={(
                    <React.Fragment>
                        <div className="my-2">
                            <Button 
                                label="Nueva venta" 
                                icon="pi pi-plus" 
                                severity="primary" 
                                className="mr-2" 
                                onClick={() => console.log('nueva venta')} 
                            />
                        </div>
                    </React.Fragment>
                )} 
                right={(
                    <React.Fragment>
                        <Button icon="pi pi-file-excel" severity="success" className="mr-2"  />
                        <Button icon="pi pi-file-pdf" severity="danger" className="mr-2"  />
                    </React.Fragment>
                )}
            />
            <DataTable 
                header={header}
                value={sales} 
                totalRecords={totalRecords}
                loading={isLoadingTable}
                
                emptyMessage="No se encontraron ventas."
                filters={lazyState.filters} 

                onPage={onPage}
                first={lazyState.first} 
                rows={lazyState.rows} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
                pageLinkSize="4"
                paginator 

                lazy
            >
                <Column body={fechaTemplate} header="Fecha"></Column>
                <Column body={serieTemplate} header="Comprobante"></Column>
                <Column body={totalTemplate} header="Total"></Column>
                <Column body={actionTemplate} header="Acciones"></Column>
            </DataTable>

        </div>
    </>);
};

export default SalePage;