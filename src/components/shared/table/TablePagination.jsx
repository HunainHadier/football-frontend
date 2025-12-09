
// import React from 'react'

// const TablePagination = ({ table }) => {
//     return (
//         <div 
//             className="row"
//             style={{
//                 margin: 0,
//                 padding: "4px 0",
//                 border: "none"
//             }}
//         >

//             {/* LEFT INFO */}
//             <div className="col-sm-12 col-md-5 p-0" style={{ border: "none" }}>
//                 <div
//                     className="dataTables_info text-lg-start text-center"
//                     style={{ margin: 0, padding: 0, border: "none" }}
//                 >
//                     Showing {table.getState().pagination.pageIndex + 1} to {table.getPageCount()} of {table.getPageCount()} entries
//                 </div>
//             </div>

//             {/* RIGHT PAGINATION */}
//             <div className="col-sm-12 col-md-7 p-0" style={{ border: "none" }}>
//                 <div
//                     className="dataTables_paginate paging_simple_numbers"
//                     style={{ margin: 0, padding: 0, border: "none" }}
//                 >
//                     <ul
//                         className="pagination mb-0 justify-content-md-end justify-content-center"
//                         style={{ margin: 0, padding: 0, border: "none" }}
//                     >

//                         {/* PREVIOUS */}
//                         <li
//                             className={`paginate_button page-item previous ${!table.getCanPreviousPage() ? "disabled" : ""}`}
//                             onClick={() => table.previousPage()}
//                             style={{ border: "none" }}
//                         >
//                             <button className="page-link" style={{ padding: "4px 10px", border: "none" }}>
//                                 Previous
//                             </button>
//                         </li>

//                         {/* CURRENT PAGE */}
//                         <li className="paginate_button page-item active" style={{ border: "none" }}>
//                             <button className="page-link" style={{ padding: "4px 10px", border: "none" }}>
//                                 {table.getState().pagination.pageIndex + 1}
//                             </button>
//                         </li>

//                         {/* NEXT */}
//                         <li
//                             className={`paginate_button page-item next ${!table.getCanNextPage() ? "disabled" : ""}`}
//                             onClick={() => table.nextPage()}
//                             style={{ border: "none" }}
//                         >
//                             <button className="page-link" style={{ padding: "4px 10px", border: "none" }}>
//                                 Next
//                             </button>
//                         </li>

//                     </ul>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default TablePagination


// import React from "react";

// const TablePagination = ({ table }) => {
//   const {
//     pageIndex,
//   } = table.getState().pagination;

//   const pageCount = table.getPageCount();
//   const canPrev = table.getCanPreviousPage();
//   const canNext = table.getCanNextPage();

//   return (
//     <div
//       className="row align-items-center"
//       style={{ margin: 0, padding: "4px 0" }}
//     >
//       {/* LEFT INFO */}
//       <div className="col-sm-12 col-md-5 p-0 text-md-start text-center">
//         <div className="dataTables_info">
//           Page <strong>{pageIndex + 1}</strong> of <strong>{pageCount}</strong>
//         </div>
//       </div>

//       {/* RIGHT PAGINATION */}
//       <div className="col-sm-12 col-md-7 p-0">
//         <ul className="pagination mb-0 justify-content-md-end justify-content-center">

//           {/* PREVIOUS */}
//           <li className={`page-item ${!canPrev ? "disabled" : ""}`}>
//             <button
//               className="page-link"
//               disabled={!canPrev}
//               onClick={() => table.previousPage()}
//             >
//               Previous
//             </button>
//           </li>

//           {/* CURRENT PAGE */}
//           <li className="page-item active">
//             <button className="page-link" disabled>
//               {pageIndex + 1}
//             </button>
//           </li>

//           {/* NEXT */}
//           <li className={`page-item ${!canNext ? "disabled" : ""}`}>
//             <button
//               className="page-link"
//               disabled={!canNext}
//               onClick={() => table.nextPage()}
//             >
//               Next
//             </button>
//           </li>

//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TablePagination;

import React from 'react'

const TablePagination = ({ table }) => {
    // Check if there are any pages to prevent errors if the table data is empty
    const pageCount = table.getPageCount();

    // Check if the current page index is valid (0 to pageCount - 1)
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalEntries = table.getFilteredRowModel().rows.length; // Total filtered rows

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
                    {/* Display current range and total count */}
                    Showing {pageCount > 0 ? currentPage : 0} to {pageCount} of {totalEntries} entries
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
                            // FIXED: Only call onClick if getCanPreviousPage() is true
                            onClick={() => table.getCanPreviousPage() && table.previousPage()}
                            style={{ border: "none" }}
                        >
                            <button className="page-link" style={{ padding: "4px 10px", border: "none" }}>
                                Previous
                            </button>
                        </li>

                        {/* CURRENT PAGE - Only show if there are pages */}
                        {pageCount > 0 && (
                            <li className="paginate_button page-item active" style={{ border: "none" }}>
                                <button className="page-link" style={{ padding: "4px 10px", border: "none" }}>
                                    {currentPage}
                                </button>
                            </li>
                        )}
                        

                        {/* NEXT */}
                        <li
                            className={`paginate_button page-item next ${!table.getCanNextPage() ? "disabled" : ""}`}
                            // FIXED: Only call onClick if getCanNextPage() is true
                            onClick={() => table.getCanNextPage() && table.nextPage()}
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