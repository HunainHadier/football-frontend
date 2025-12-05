import React, { useState } from 'react'
import { FiFilter, FiPlus } from 'react-icons/fi'
import Checkbox from '@/components/shared/Checkbox';
import { Link } from 'react-router-dom';

const filterItems = ["Role", "Team", "Email", "Member", "Recommendation"]


const PageHeaderDate = () => {
  const [toggleDateRange, setToggleDateRange] = useState(false)

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
       
        <div className="filter-dropdown">
       
          <div className="dropdown-menu dropdown-menu-end">
            {filterItems.map((name, index) =>
              <div key={index} className="dropdown-item">
                <Checkbox name={name} id={index} checked={name} />
              </div>
            )}

            <div className="dropdown-divider"></div>
            <Link to="#" className="dropdown-item">
              <FiPlus size={16} className="me-3" />
              <span>Create New</span>
            </Link>
            <Link to="#" className="dropdown-item">
              <FiFilter size={16} className="me-3" />
              <span>Manage Filter</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageHeaderDate