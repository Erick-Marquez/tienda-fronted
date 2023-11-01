import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { FilterMatchMode } from 'primereact/api'

import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
        

const PurchasePage = () => {
    const toast = useRef(null)

    const [purchases, setPurchases] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 5,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    });

    useEffect(() => {
        setPurchases([
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0001', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0002', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0003', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0004', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0005', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0006', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0007', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0008', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0009', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0010', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0011', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0012', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0013', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0014', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0015', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0016', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0017', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0018', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0019', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0020', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0021', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0022', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0023', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0024', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0025', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0026', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0027', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0028', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0029', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0030', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0031', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0032', customer: 'Cliente 1', total: 10.5 },
            { dateIssue: '2023-08-30 18:31 PM', serie: 'N001-0033', customer: 'Cliente 1', total: 10.5 },
        ])
    }, [])


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
                <h4 className="m-0">Compras</h4>
                
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

    return (<>
        <Toast ref={toast} />
        
        <div className="card">
            <Toolbar 
                className="mb-4" 
                left={(
                    <React.Fragment>
                        <div className="my-2">
                            <Button label="Nueva Compra" icon="pi pi-plus" severity="sucess" className="mr-2"  />
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
                value={purchases} 
                totalRecords={100}
                
                emptyMessage="No se encontraron compras."
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
                <Column field="serie" header="Serie"></Column>
                <Column field="customer" header="Cliente"></Column>
                <Column field="total" header="Total"></Column>
            </DataTable>

        </div>
    </>);
};

export default PurchasePage;