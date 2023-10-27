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
import { InputNumber } from 'primereact/inputnumber'
import { SunatService } from '../../../services/SunatService'

        

const InvoicePage = () => {
    const toast = useRef(null)

    const [date, setDate] = useState(null)
    const [isLoadingCreateSummary, setIsLoadingCreateSummary] = useState(false)

    const [isLoadingGetDocuments, setIsLoadingGetDocuments] = useState(false)
    const [infoSummary, setInfoSummary] = useState({
        count: 0,
        total: 0
    })


    const [summaries, setSummaries] = useState([])
    const [modalCreareSummaryIsVisible, setModalCreareSummaryIsVisible] = useState(false)
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

        SunatService.getSummaries(lazyState)
        .then(res => {
            setTotalRecords(res.data.total);
            setSummaries(res.data.data);
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

    const getDocuments = () => {
        setIsLoadingGetDocuments(true)

        const body = {
            date_of_reference: date
        }

        SunatService.getDocumentsToSummary(body)
        .then(res => {
            setInfoSummary({
                count: res.data.sales_count,
                total: res.data.sales_sum
            })
        })
        .catch(err => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrio un incoveniente', life: 3000 })
        })
        .finally(() => {
            setIsLoadingGetDocuments(false)
        })
    }

    const createSummary = () => {
        setIsLoadingCreateSummary(true)

        const body = { date_of_reference: date }

        SunatService.getDocumentsToSummary(body)
        .then(res => {
            setInfoSummary({
                count: res.data.sales_count,
                total: res.data.sales_sum
            })

            toast.current.show({ 
                severity: 'success', 
                summary: 'Confirmado', 
                detail: `Se ha creado el resumen ${res.data.sales_count}-${res.data.sales_sum}`, 
                life: 3000
            })
            setModalCreareSummaryIsVisible(false)
        })
        .catch(err => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrio un incoveniente', life: 3000 })
        })
        .finally(() => {
            setIsLoadingCreateSummary(false)
        })
    }
    const sendSummary = (rowData) => {
        console.log(rowData);
    }

    const onPage = (event) => {
        setlazyState(event)
    }

    const onSearch = (e) => {
        let _filters = { ...lazyState }
        _filters['first'] = 0
        _filters['filters']['global'].value = globalFilterValue
        setlazyState(_filters)
    }
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Comprobantes</h4>
                
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

    const actionTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-send" severity="success" rounded size="small" onClick={() => sendSummary(rowData)}/>
            </>
        )
    }

    return (<>
        <Toast ref={toast} />


        <Dialog
            visible={modalCreareSummaryIsVisible} 
            style={{ width: '50vw' }} 
            className="p-fluid"
            onHide={() => setModalCreareSummaryIsVisible(false)}
            draggable={false}
            header="Nuevo resumen"
            footer={(
                <div>
                    <Button label="Cancelar" severity="danger" onClick={() => setModalCreareSummaryIsVisible(false)}/>
                    <Button label="Crear Resumen" severity="success" onClick={createSummary} loading={isLoadingCreateSummary}/>
                </div>
            )}
        >
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="date_of_reference">Fecha de comprobantes</label>
                    <Calendar 
                        inputId="date_of_reference" 
                        value={date} 
                        onChange={(e) => setDate(e.value)}
                        maxDate={new Date()}
                        locale="es"
                        dateFormat='dd/mm/yy'
                        showIcon 
                    />
                </div>
                <div className="field col flex align-items-end justify-content-center">
                    <div>
                        <Button label="Obtener boletas" severity="primary" onClick={getDocuments} loading={isLoadingGetDocuments}/>
                    </div>
                </div>
            </div>
            <div className="formgrid grid my-5">
                <div className="field col">
                    <label htmlFor="total_of_documents">Cantidad de comprobantes</label>
                    <InputText inputId="total_of_documents" value={infoSummary.count} disabled/>
                </div>
                <div className="field col">
                    <label htmlFor="date_of_reference">Total a emitir</label>
                    <InputNumber
                        inputId="currency-pe" 
                        mode="currency" 
                        currency="PEN" 
                        locale="es-PE" 
                        autoComplete="off"
                        value={infoSummary.total}
                        disabled
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
                                label="Nuevo resumen" 
                                icon="pi pi-plus" 
                                severity="primary" 
                                className="mr-2" 
                                onClick={() => setModalCreareSummaryIsVisible(true)} 
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
                value={summaries} 
                totalRecords={totalRecords}
                loading={isLoadingTable}
                
                emptyMessage="No se encontraron comprobantes."
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
                <Column field="dateIssue" header="Fecha"></Column>
                <Column field="identifier" header="Identificador"></Column>
                <Column field="ticket" header="Ticket"></Column>
                <Column field="state" header="Estado"></Column>
                <Column body={actionTemplate} header="Acciones"></Column>
            </DataTable>

        </div>
    </>);
};

export default InvoicePage;