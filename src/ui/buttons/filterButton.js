import React, { useEffect, useState } from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'
import { FaChevronDown } from 'react-icons/fa'
import '../style.css'

const FilterButton = ({ onFilterChange, filterData, active }) => {
  const [dropdownLabel, setDropdownLabel] = useState(getLabel(active))

  useEffect(() => {
    setDropdownLabel(getLabel(active))
  }, [active])

  const handleClick = (filter) => {
    setDropdownLabel(getLabel(filter))
    if (onFilterChange) onFilterChange(filter)
  }

  function getLabel(filter) {
    switch (filter) {
      case 'today':
        return 'Today'
      case 'yesterday':
        return 'Yesterday'
      case 'week':
        return 'This Week'
      case 'month':
        return 'This Month'
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      case 'dead':
        return 'Dead'
      case 'upcoming':
        return 'Upcoming'
      default:
        return 'All Tasks'
    }
  }

  return (
    <CDropdown>
      <CDropdownToggle color="primary" className="no-caret">
        {dropdownLabel} <FaChevronDown className="ms-2" />
      </CDropdownToggle>
      <CDropdownMenu>
        {filterData.map((filter) => (
          <CDropdownItem
            key={filter}
            active={active === filter}
            onClick={() => handleClick(filter)}
          >
            {getLabel(filter)}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default FilterButton
