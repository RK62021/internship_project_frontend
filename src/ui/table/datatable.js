import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CPagination,
  CPaginationItem,
} from '@coreui/react'

const data = [
  { id: 1, first: 'Mark', last: 'Otto', handle: '@mdo' },
  { id: 2, first: 'Jacob', last: 'Thornton', handle: '@fat' },
  { id: 3, first: 'Larry', last: 'Bird', handle: '@twitter' },
  { id: 4, first: 'John', last: 'Doe', handle: '@john' },
  { id: 5, first: 'Jane', last: 'Smith', handle: '@jane' },
  { id: 6, first: 'Alex', last: 'Stone', handle: '@alex' },
  { id: 1, first: 'Mark', last: 'Otto', handle: '@mdo' },
  { id: 2, first: 'Jacob', last: 'Thornton', handle: '@fat' },
  { id: 3, first: 'Larry', last: 'Bird', handle: '@twitter' },
  { id: 4, first: 'John', last: 'Doe', handle: '@john' },
  { id: 5, first: 'Jane', last: 'Smith', handle: '@jane' },
  { id: 6, first: 'Alex', last: 'Stone', handle: '@alex' },
  { id: 1, first: 'Mark', last: 'Otto', handle: '@mdo' },
  { id: 2, first: 'Jacob', last: 'Thornton', handle: '@fat' },
  { id: 3, first: 'Larry', last: 'Bird', handle: '@twitter' },
  { id: 4, first: 'John', last: 'Doe', handle: '@john' },
  { id: 5, first: 'Jane', last: 'Smith', handle: '@jane' },
  { id: 6, first: 'Alex', last: 'Stone', handle: '@alex' },
  { id: 1, first: 'Mark', last: 'Otto', handle: '@mdo' },
  { id: 2, first: 'Jacob', last: 'Thornton', handle: '@fat' },
  { id: 3, first: 'Larry', last: 'Bird', handle: '@twitter' },
  { id: 4, first: 'John', last: 'Doe', handle: '@john' },
  { id: 5, first: 'Jane', last: 'Smith', handle: '@jane' },
  { id: 6, first: 'Alex', last: 'Stone', handle: '@alex' },
]

const Table = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const totalPages = Math.ceil(data.length / rowsPerPage)
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="d-flex flex-column min-vh-100">
    {/* Full-width background for table */}
    <div className="w-100 bg-light p-4 flex-grow-1">
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>First</CTableHeaderCell>
            <CTableHeaderCell>Last</CTableHeaderCell>
            <CTableHeaderCell>Handle</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {paginatedData.map((row) => (
            <CTableRow key={row.id}>
              <CTableHeaderCell>{row.id}</CTableHeaderCell>
              <CTableDataCell>{row.first}</CTableDataCell>
              <CTableDataCell>{row.last}</CTableDataCell>
              <CTableDataCell>{row.handle}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>

    {/* Fixed Pagination at bottom */}
    <div
      className="bg-white shadow position-fixed bottom-0 w-100 d-flex justify-content-center p-3"
      style={{ zIndex: 1000 }}
    >
      <CPagination>
        {[...Array(totalPages)].map((_, index) => (
          <CPaginationItem
            key={index + 1}
            active={currentPage === index + 1}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </CPaginationItem>
        ))}
      </CPagination>
    </div>
  </div>
  )
}

export default Table
