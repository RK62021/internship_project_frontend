import React, { useEffect, useState } from 'react'
import UserCard from '../../../../ui/Cards/userCards'
import SearchBar from '../../../../ui/SearchBar/searchbar'
import CIcon from '@coreui/icons-react'
import Button from '../../../../ui/buttons'
import { cilPlus } from '@coreui/icons'
import PopupLayout from '../../../../layout/PopupLayout.js'
import AddUserForm from '../../../../components/form/addUserForm.js'
import axios from 'axios'
// Inline Spinner Loader
const InlineLoader = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

import useDebounce from '../../../../hooks/deBaounce/index.js'
import ApiUrl from '../../../../services/apiheaders.js'
import { useSelector } from 'react-redux'
import { GetLocalStorage } from '../../../../services/localStorageService.js'
import { ToastContainer } from 'react-toastify'

const UserCardList = () => {
  const userType = useSelector((state) => state.userType)
  const [isLoading, setIsLoading] = useState(false)
  const [isUserAdded, setIsUserAdded] = useState(false)
  const [IsUserPopup, setIsUserPopup] = useState(false)
  const [IsUserEditPopup, setIsUserEditPopup] = useState(false)
  const [EditUserData, setEditUserData] = useState(null)
  const [TeamMembers, setTeamMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 400)

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      const userdata = GetLocalStorage('user')
      const userId = userdata[0]?.userId || ''
      const userType = userdata[0]?.userType || ''

      const response = await axios.get(`${ApiUrl.User}`, {
        params: {
          search: debouncedSearchTerm,
          userId,
          userType,
        },
      })

      if (response.status === 200) {
        setTeamMembers(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setTimeout(() => setIsLoading(false), 200) // delay to prevent flicker
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [debouncedSearchTerm, isUserAdded])

  return (
    <>
      <ToastContainer
      autoClose={4000}
       />
      <div className="container-fluid">

        {/* Top Controls */}
        <div className="row align-items-center mb-4 g-2">
          <div className="col-12 col-md-9">
            <div
              className={`input-group search-div w-100 ${
                isFocused ? 'border border-primary shadow' : 'border border-secondary'
              }`}
            >
              <SearchBar
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                onFocus={(focus) => setIsFocused(focus)}
                placeholder="Search..."
              />
            </div>
          </div>
          {(userType === 'SuperAdmin' || userType === 'Admin') && (
            <div className="col-12 col-md-auto text-md-end">
              <Button
                name="Add User"
                icon={<CIcon icon={cilPlus} />}
                onClick={() => setIsUserPopup(true)}
              />
            </div>
          )}
        </div>

        {/* User Cards Grid */}
        <div className="row g-4">
          {isLoading && TeamMembers.length === 0 ? (
            <InlineLoader />
          ) : TeamMembers && TeamMembers.length > 0 ? (
            TeamMembers.map((item, idx) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={idx}>
                <UserCard
                  ccolor="white"
                  fcolor="white"
                  isActive={item.isActive}
                  data={item}
                  render={() => setIsUserAdded((prev) => !prev)}
                  onEdit={(data) => {
                    setIsUserEditPopup(true)
                    setEditUserData(data)
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted py-5 fs-5">
              No User Found
            </div>
          )}
        </div>

        {/* Add User Popup */}
        <PopupLayout show={IsUserPopup} onClose={() => setIsUserPopup(false)}>
          <AddUserForm
            formName="Add User"
            closePopup={() => setIsUserPopup(false)}
            isUserAdded={() => setIsUserAdded((prev) => !prev)}
            EditUserData={null}
          />
        </PopupLayout>

        {/* Edit User Popup */}
        <PopupLayout show={IsUserEditPopup} onClose={() => setIsUserEditPopup(false)}>
          <AddUserForm
            formName="Update User"
            closePopup={() => setIsUserEditPopup(false)}
            isUserAdded={() => setIsUserAdded((prev) => !prev)}
            EditUserData={EditUserData}
          />
        </PopupLayout>
      </div>
    </>
  )
}

export default UserCardList
