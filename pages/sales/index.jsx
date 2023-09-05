import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { FilterMatchMode } from 'primereact/api'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
        

const SalePage = () => {
    const toast = useRef(null)

    const [sales, setSales] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })

    useEffect(() => {
        setSales([
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


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;
        
        setFilters(_filters);
        setGlobalFilterValue(value);
    }
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Ventas</h4>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar"/>
                </span>
            </div>
        )
    }
    const header = renderHeader()

    return (<>
        <Toast ref={toast} />
        
        <div className="card">
            
            <DataTable 
                value={sales} 
                paginator 
                rows={5} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
                pageLinkSize="4"
                emptyMessage="No se encontraron ventas."
                header={header}
                filters={filters}
                totalRecords={100}
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

export default SalePage;