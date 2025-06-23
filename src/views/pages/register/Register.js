import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { toast, ToastContainer } from 'react-toastify'
import { SetLocalStorage } from '../../../services/localStorageService'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ApiUrl from '../../../services/apiheaders'
import { EmailValidation, isValidPassword } from '../../../utils/validations'

const Register = () => {
  const navigate=useNavigate();
  const [RegistrationData,setRegistrationData]=useState({
    fullName:"",
    email:"",
    password :"",
    confirmpassword:""
  });

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setRegistrationData((prev)=>(
      {...prev,[name]:value}
    ))
  }
  const submitForm=async()=>{
    const matchEmail=EmailValidation(RegistrationData.email);
    const isvalidPassword=isValidPassword(RegistrationData.password)
    if (!RegistrationData.email || !RegistrationData.password || !RegistrationData.fullName || !RegistrationData.confirmpassword) {
      toast.error("Please fill Username and Password")
      return
    }
    if(!matchEmail)
    {
      toast.error("Please enter valid email")
      return
    }
    if(!isvalidPassword)
    {
      toast.warn("Please enter valid password")
      return
    }
    if(RegistrationData.password!=RegistrationData.confirmpassword)
      {
        toast.error("Password Not matching..")
        return
      }
  
    try {
      const { confirmpassword, ...dataToSend } = RegistrationData;
      const response = await axios.post(ApiUrl.Register, dataToSend)
      console.log("response data--------",response)
      if (response.data.statusCode === 200) {
        toast.success(response.data.messege)
        setTimeout(() => {
          navigate('/')
        }, 500);
      } else if(response.data.statusCode===404) {

        toast.warn(response.data.messege)
      }
      else if(response.data.statusCode===409)
      {
        toast.warn(response.data.message)
      }
      else{
        toast.warn(response.data.messege)
      }
    } catch (err) {
      console.error("eoor--------------",err)
      toast.error("Something went wrong, please try again.")
    }
    }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer/>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" autoComplete="fullName"
                      name="fullName"
                      onChange={(e)=>handleChange(e)} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                     type="email"
                     placeholder="Email" 
                     autoComplete="email" 
                      name="email"
                      onChange={(e)=>handleChange(e)}  />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="password"
                      name="password"
                      onChange={(e)=>handleChange(e)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="confirmpassword"
                      name="confirmpassword"
                      onChange={(e)=>handleChange(e)}
                    />
                  </CInputGroup>
                  <div className="d-grid" >
                    <CButton color="success" onClick={()=>submitForm()}>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
