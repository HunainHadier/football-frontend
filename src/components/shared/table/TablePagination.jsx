// import React from 'react'

// const TablePagination = ({table}) => {
//     return (
//         <div className="row gy-2">
//             <div className="col-sm-12 col-md-5 p-0">
//                 <div className="dataTables_info text-lg-start text-center" id="proposalList_info" role="status" aria-live="polite">Showing 1 to 10 of 10 entries</div>
//             </div>
//             <div className="col-sm-12 col-md-7 p-0">
//                 <div className="dataTables_paginate paging_simple_numbers" id="proposalList_paginate">
//                     <ul className="pagination mb-0 justify-content-md-end justify-content-center">
//                         <li className={`paginate_button page-item previous ${!table.getCanPreviousPage() ? "disabled" : ""} `}
//                             onClick={() => table.previousPage()}
//                             disabled={!table.getCanPreviousPage()}
//                         >
//                             <a href="#" className="page-link">Previous</a></li>
//                         <li className="paginate_button page-item active">
//                             <a href="#" aria-controls="proposalList" data-dt-idx="0" tabIndex="0" className="page-link">
//                                 {table.getState().pagination.pageIndex + 1}
//                                 {/* {table.getPageCount().toLocaleString()} */}
//                             </a>
//                         </li>
//                         <li className={`paginate_button page-item next ${!table.getCanNextPage() ? "disabled" : ""}`}
//                             onClick={() => table.nextPage()}
//                             disabled={!table.getCanNextPage()}
//                         >
//                             <a href="#" className="page-link">Next</a>
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default TablePagination

import React from 'react'

const TablePagination = ({ table }) => {
    return (
        <div 
            className="row"
            style={{
                margin: 0,
                padding: "4px 0",
                border: "none"
            }}
        >

            {/* LEFT INFO */}
            <div className="col-sm-12 col-md-5 p-0" style={{ border: "none" }}>
                <div
                    className="dataTables_info text-lg-start text-center"
                    style={{ margin: 0, padding: 0, border: "none" }}
                >
                    Showing {table.getState().pagination.pageIndex + 1} to {table.getPageCount()} of {table.getPageCount()} entries
                </div>
            </div>

            {/* RIGHT PAGINATION */}
            <div className="col-sm-12 col-md-7 p-0" style={{ border: "none" }}>
                <div
                    className="dataTables_paginate paging_simple_numbers"
                    style={{ margin: 0, padding: 0, border: "none" }}
                >
                    <ul
                        className="pagination mb-0 justify-content-md-end justify-content-center"
                        style={{ margin: 0, padding: 0, border: "none" }}
                    >

                        {/* PREVIOUS */}
                        <li
                            className={`paginate_button page-item previous ${!table.getCanPreviousPage() ? "disabled" : ""}`}
                            onClick={() => table.previousPage()}
                            style={{ border: "none" }}
                        >
                            <button className="page-link" style={{ padding: "4px 10px", border: "none" }}>
                                Previous
                            </button>
                        </li>

                        {/* CURRENT PAGE */}
                        <li className="paginate_button page-item active" style={{ border: "none" }}>
                            <button className="page-link" style={{ padding: "4px 10px", border: "none" }}>
                                {table.getState().pagination.pageIndex + 1}
                            </button>
                        </li>

                        {/* NEXT */}
                        <li
                            className={`paginate_button page-item next ${!table.getCanNextPage() ? "disabled" : ""}`}
                            onClick={() => table.nextPage()}
                            style={{ border: "none" }}
                        >
                            <button className="page-link" style={{ padding: "4px 10px", border: "none" }}>
                                Next
                            </button>
                        </li>

                    </ul>
                </div>
            </div>

        </div>
    )
}

export default TablePagination
