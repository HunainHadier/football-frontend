import React, { useState } from 'react'
import TableSearch from './TableSearch'
import TablePagination from './TablePagination'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

const Table = ({ data, columns }) => {
    // const [data] = useState([...fackData])
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })


    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            pagination
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    })


    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full function-table">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <div className='dataTables_wrapper dt-bootstrap5 no-footer'>

                            {/* Header Section - Fixed */}
                            <div className="table-header-section">
                                <TableSearch table={table} setGlobalFilter={setGlobalFilter} globalFilter={globalFilter} />
                            </div>

                            {/* Table Body - Scrollable */}
                            <div className="table-body-section">
                                <div className="row dt-row">
                                    <div className="col-sm-12 px-0">
                                        <table className="table table-hover dataTable no-footer" id='projectList'>
                                            <thead>
                                                {table.getHeaderGroups().map((headerGroup) => (
                                                    <tr key={headerGroup.id} >
                                                        {
                                                            headerGroup.headers.map((header) => {
                                                                return (
                                                                    <th key={header.id} className={header.column.columnDef.meta?.headerClassName}>
                                                                        {
                                                                            header.id === "id" ?
                                                                                <div className='d-flex gap-2'>
                                                                                    {
                                                                                        flexRender(
                                                                                            header.column.columnDef.header,
                                                                                            header.getContext()
                                                                                        )

                                                                                    }
                                                                                    <ArrowToggle header={header} />
                                                                                </div>
                                                                                :
                                                                                <ArrowToggle header={header}>
                                                                                    {
                                                                                        flexRender(
                                                                                            header.column.columnDef.header,
                                                                                            header.getContext()
                                                                                        )
                                                                                    }
                                                                                </ArrowToggle>
                                                                        }
                                                                    </th>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody>
                                                {
                                                    table.getRowModel().rows.map((row) => (
                                                        <tr key={row.id} className='single-item chat-single-item'>
                                                            {row.getVisibleCells().map((cell) => {
                                                                return (
                                                                    <td key={cell.id} className={cell.column.columnDef.meta?.className}>
                                                                        {
                                                                            flexRender(
                                                                                cell.column.columnDef.cell,
                                                                                cell.getContext()
                                                                            )
                                                                        }
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Section - Fixed */}
                            <div className="table-footer-section">
                                <TablePagination table={table} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS Styles */}
            {/* Add CSS Styles */}
            <style jsx>{`
    .dataTables_wrapper {
        display: flex;
        flex-direction: column;
        height: 600px; /* Adjust height as needed */
    }
    
    .table-header-section {
        flex-shrink: 0;
        padding: 1rem;
        background: var(--card-bg, white); /* CSS variable use karein */
        border-bottom: 1px solid var(--border-color, #e5e7eb);
    }
    
    .table-body-section {
        flex: 1;
        overflow-y: auto;
        overflow-x: auto;
    }
    
    .table-footer-section {
        flex-shrink: 0;
        padding: 1rem;
        background: var(--card-bg, white); /* CSS variable use karein */
        border-top: 1px solid var(--border-color, #e5e7eb);
    }
    
    /* Ensure table header stays fixed during scroll */
    .table-body-section thead th {
        position: sticky;
        top: 0;
        background: var(--card-bg, white); /* CSS variable use karein */
        z-index: 10;
        box-shadow: 0 1px 0 var(--border-color, #e5e7eb);
    }
    
    /* Remove default table responsive behavior */
    .table-responsive {
        overflow: visible;
    }

    /* Dark theme support */
    .app-skin-dark .table-header-section,
    .app-skin-dark .table-footer-section,
    .app-skin-dark .table-body-section thead th {
        background: var(--dark-card-bg, #1f2937);
        color: var(--dark-text, #f9fafb);
    }

    /* Table specific dark styles */
    .app-skin-dark .table {
        background: var(--dark-card-bg, #1f2937);
        color: var(--dark-text, #f9fafb);
    }

    .app-skin-dark .table th {
        background: var(--dark-card-bg, #1f2937);
        color: var(--dark-text, #f9fafb);
        border-color: var(--dark-border-color, #374151);
    }

    .app-skin-dark .table td {
        background: var(--dark-card-bg, #1f2937);
        color: var(--dark-text, #f9fafb);
        border-color: var(--dark-border-color, #374151);
    }
`}</style>


        </div>
    )
}

export default Table

const ArrowToggle = ({ header, children }) => {
    const position = header.column.getIsSorted()
    return (
        <div
            className='table-head'
            style={{
                cursor: header.column.getCanSort() ? "pointer" : "default"
            }}
            onClick={header.column.getToggleSortingHandler()}
        >

            {children}
            {
                {
                    asc: <FaSortUp size={13} opacity={position === "asc" ? 1 : .125} />,
                    desc: <FaSortDown size={13} opacity={position === "desc" ? 1 : .125} />
                }[position]
            }
            {header.column.getCanSort() && !position ? (
                <FaSort size={13} opacity={.125} />
            ) : null}
        </div>
    )
}