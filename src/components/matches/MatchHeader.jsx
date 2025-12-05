import React from 'react'

import { Link } from 'react-router-dom';



const MatchHeader = () => {
    // 🟢 Correct role reading
    const userRole = localStorage.getItem("role") || "user";

    // 🟢 Only company_owner can create customer
    const canCreateCustomer = userRole === "company_owner";

    return (
        <>
            <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">

                {/* 🟦 Create Customer only for company_owner */}
                {canCreateCustomer && (
                    <Link to="/add-Customer" className="btn btn-primary">
                        <FiPlus size={16} className='me-2' />
                        <span>Create Customer</span>
                    </Link>
                )}
            </div>

            <div id="collapseOne" className="accordion-collapse collapse page-header-collapse">
                <div className="accordion-body pb-2">
                    <div className="row">
                        {/* <CustomersStatistics /> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MatchHeader
