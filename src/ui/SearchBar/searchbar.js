import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa' // you can use any icon library like FontAwesome

const SearchBar = ({ value, onChange, placeholder = 'Search by user name...',onFocus }) => {

  return (
    <>
      <input
        type="text"
        className="form-control border-0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          if (value === ' ') return
          onChange(value)
        }}
        onFocus={() => onFocus(true)}
        onBlur={() => onFocus(false)}
        style={{
          boxShadow: 'none',
        }}
      />
      <span
        className="search-icon"
      >
        <FaSearch />
      </span>
      </>

  )
}

export default SearchBar
