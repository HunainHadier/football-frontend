// import React, { useContext, useEffect } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import { FiSunrise } from "react-icons/fi";
// import PerfectScrollbar from "react-perfect-scrollbar";
// import Menus from './Menus';
// import { NavigationContext } from '../../../contentApi/navigationProvider';

// const NavigationManu = () => {
//     const { navigationOpen, setNavigationOpen } = useContext(NavigationContext)
//     const pathName = useLocation().pathname
//     useEffect(() => {
//         setNavigationOpen(false)
//     }, [pathName])
//     return (
//         <nav className={`nxl-navigation ${navigationOpen ? "mob-navigation-active" : ""}`}>
//             <div className="navbar-wrapper">
//                 <div className="m-header">
//                     <Link to="/" className="b-brand">
//                         {/* <!-- ========   change your logo hear   ============ --> */}
//                         <img src="/images/football-vector-free-11.png" alt="logo" className="logo logo-lg" style={{ marginLeft: '10px', width: '220px', height: '90px' }} />
//                         <img src="/images/half.png" alt="logo" className="logo logo-sm" style={{ width: '70px', height: '80px' ,  marginLeft: '-18px' }}/>
//                     </Link>
//                 </div>

//                 <div className={`navbar-content`}>
//                     <PerfectScrollbar>
//                         <ul className="nxl-navbar">
//                             <li className="nxl-item nxl-caption">
//                                 <label>Navigation</label>
//                             </li>
//                             <Menus />
//                         </ul>
//                         {/* <div className="card text-center">
//                             <div className="card-body">
//                                 <i className="fs-4 text-dark"><FiSunrise /></i>
//                                 <h6 className="mt-4 text-dark fw-bolder">Downloading Center</h6>
//                                 <p className="fs-11 my-3 text-dark">Duralux is a production ready CRM to get started up and running easily.</p>
//                                 <Link to="#" className="btn btn-primary text-dark w-100">Download Now</Link>
//                             </div>
//                         </div> */}
//                         <div style={{ height: "18px" }}></div>
//                     </PerfectScrollbar>
//                 </div>
//             </div>
//             <div onClick={() => setNavigationOpen(false)} className={`${navigationOpen ? "nxl-menu-overlay" : ""}`}></div>
//         </nav>
//     )
// }

// export default NavigationManu

import React, { useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PerfectScrollbar from "react-perfect-scrollbar";
import Menus from './Menus';
import { NavigationContext } from '../../../contentApi/navigationProvider';

const NavigationManu = () => {
    const { navigationOpen, setNavigationOpen } = useContext(NavigationContext)
    const pathName = useLocation().pathname

    // Agar authToken localStorage me nahi hai to sidebar/menu show na ho
    const authToken = localStorage.getItem("authToken")
    if (!authToken) return null

    useEffect(() => {
        setNavigationOpen(false)
    }, [pathName])

    return (
        <nav className={`nxl-navigation ${navigationOpen ? "mob-navigation-active" : ""}`}>
            <div className="navbar-wrapper">
                <div className="m-header">
                    <Link to="/" className="b-brand">
                        <img src="/images/football-vector-free-11.png" alt="logo" className="logo logo-lg" style={{ marginLeft: '10px', width: '220px', height: '90px' }} />
                        <img src="/images/half.png" alt="logo" className="logo logo-sm" style={{ width: '70px', height: '80px' ,  marginLeft: '-18px' }}/>
                    </Link>
                </div>

                <div className={`navbar-content`}>
                    <PerfectScrollbar>
                        <ul className="nxl-navbar">
                            <li className="nxl-item nxl-caption">
                                <label>Navigation</label>
                            </li>
                            <Menus />
                        </ul>
                        <div style={{ height: "18px" }}></div>
                    </PerfectScrollbar>
                </div>
            </div>
            <div onClick={() => setNavigationOpen(false)} className={`${navigationOpen ? "nxl-menu-overlay" : ""}`}></div>
        </nav>
    )
}

export default NavigationManu
