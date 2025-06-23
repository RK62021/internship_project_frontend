import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";

const SearchableDropdown = forwardRef(({ options, onSelect,ClassName }, ref) => {
  console.log("options in searchable dropdown---------",options);
  const inputRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // const filteredOptions = options.filter((option) =>
  //   option.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleSelect = (value) => {
    setSearchTerm(value);
    onSelect(value);
    setShowDropdown(false);
  };

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current.focus();
    },
    getValue: () => {
      return inputRef.current.value;
    },
  }));

  return (
    <div className={ClassName}>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 200); // delay to allow click
        }}
        placeholder="Search..."
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />
      {showDropdown && (
        <ul
          style={{
            position: "absolute",
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            listStyleType: "none",
            margin: 0,
            padding: 0,
            zIndex: 1,
          }}
        >
          {options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => handleSelect(option.username)} // use onMouseDown instead of onClick
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {option.username}
              </li>
            ))
          ) : (
            <li style={{ padding: "8px", color: "#888" }}>No results</li>
          )}
        </ul>
      )}
    </div>
  );
});

export default SearchableDropdown;
