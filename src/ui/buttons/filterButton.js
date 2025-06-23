import React, { useState } from 'react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { FaChevronDown } from 'react-icons/fa' // For dropdown icon (optional)
import "../style.css"

const FilterButton = ({ onFilterChange, filterData, active }) => {
  const [dropdownLabel, setDropdownLabel] = useState(getLabel(active))

  const handleClick = (filter) => {
    setDropdownLabel(getLabel(filter))
    if (onFilterChange) onFilterChange(filter)
  }

  function getLabel(filter) {
    switch (filter) {
      case 'today':
        return 'Today Task'
      case 'upcoming':
        return 'Upcoming Task'
      case 'dead':
        return 'Dead Task'
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      default:
        return 'Filter Task'
    }
  }

  return (
    <CDropdown>
      <CDropdownToggle color="primary" className="no-caret">
      {/* {dropdownLabel} */}
        {dropdownLabel} <FaChevronDown className="ms-2" />
      </CDropdownToggle>
      <CDropdownMenu>
        {filterData.map((filter) => (
          <CDropdownItem key={filter} active={active === filter} onClick={() => handleClick(filter)}>
            {getLabel(filter)}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default FilterButton
