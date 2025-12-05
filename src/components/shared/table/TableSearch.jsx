import React from 'react'

const TableSearch = ({ table, setGlobalFilter, globalFilter }) => {
    return (
        <div className='row' style={{ margin: 0, padding: "4px 0", border: "none" }}>

            {/* LEFT - PAGE SIZE */}
            <div className='col-sm-12 col-md-6 p-0' style={{ border: "none" }}>
                <div className='dataTables_length d-flex justify-content-md-start justify-content-center'
                    style={{ margin: 0, padding: 0, border: "none" }}>
                    <label className='d-flex align-items-center gap-1' style={{ margin: 0, padding: 0 }}>
                        Show
                        <select
                            className='form-select form-select-sm w-auto pe-4'
                            style={{ boxShadow: "none" }}
                            value={table.getState().pagination.pageSize}
                            onChange={e => table.setPageSize(Number(e.target.value))}
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>{pageSize}</option>
                            ))}
                        </select>
                        entries
                    </label>
                </div>
            </div>

            {/* RIGHT - SEARCH */}
            {/* <div className='col-sm-12 col-md-6 p-0' style={{ border: "none" }}>
                <div className='dataTables_filter d-flex justify-content-md-end justify-content-center'
                    style={{ margin: 0, padding: 0, border: "none" }}>
                    <label className='d-inline-flex align-items-center gap-2'
                        style={{ margin: 0, padding: 0 }}>
                        Search:
                        <input
                            type="text"
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder='Search...'
                            className="form-control form-control-sm"
                            style={{ boxShadow: "none" }}
                        />
                    </label>
                </div>
            </div> */}

        </div>
    )
}

export default TableSearch
