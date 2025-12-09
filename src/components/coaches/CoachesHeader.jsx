import React from 'react'
import {
    FiBarChart, FiBriefcase, FiDollarSign, FiEye, FiFilter,
    FiFlag, FiPaperclip, FiPlus, FiUserCheck, FiUserMinus, FiUsers
} from 'react-icons/fi'
import {
    BsFiletypeCsv, BsFiletypeExe, BsFiletypePdf, BsFiletypeTsx,
    BsFiletypeXml, BsPrinter
} from 'react-icons/bs';
import { Link } from 'react-router-dom';

const filterAction = [
    { label: "All", icon: <FiEye /> },
    { label: "Group", icon: <FiUsers /> },
    { label: "Country", icon: <FiFlag /> },
    { label: "Invoice", icon: <FiDollarSign /> },
    { label: "Project", icon: <FiBriefcase /> },
    { label: "Active", icon: <FiUserCheck /> },
    { label: "Inactive", icon: <FiUserMinus /> },
];

const fileType = [
    { label: "PDF", icon: <BsFiletypePdf /> },
    { label: "CSV", icon: <BsFiletypeCsv /> },
    { label: "XML", icon: <BsFiletypeXml /> },
    { label: "Text", icon: <BsFiletypeTsx /> },
    { label: "Excel", icon: <BsFiletypeExe /> },
    { label: "Print", icon: <BsPrinter /> },
];

const CoachesHeader = () => {
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
                <img
                    src="/images/football-vector-free-11.png"
                    alt="Logo"
                    style={{ width: '120px', height: '60px' }} // आप अपनी ज़रूरत के हिसाब से width/height बदल सकते हैं
                />
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

export default CoachesHeader
