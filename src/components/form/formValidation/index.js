import { EmailValidation, isValidPassword } from "../../../utils/validations"

export const UserFormValidate = (values, EditUserData) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Name is required'
  }

  if (!values.email) {
    errors.email = 'Email is required'
  } else if (!EmailValidation(values.email)) {
    errors.email = 'Invalid email'
  }

  if (!values.mobile) {
    errors.mobile = 'Contact is required'
  }

  if (!values.designation) {
    errors.designation = 'Designation is required'
  }

  if (!values.department) {
    errors.department = 'Department is required'
  }

  if (!values.reportingto) {
    errors.reportingto = 'Reporting is required'
  }

  // ✅ Password and Confirm Password should only be validated when adding a user
  if (!EditUserData) {
    if (!values.password) {
      errors.password = 'Password is required'
    } else if (!isValidPassword(values.password)) {
      errors.password = 'Invalid Password'
    }

    if (!values.confirmpassword) {
      errors.confirmpassword = 'Confirm password is required'
    } else if (values.password !== values.confirmpassword) {
      errors.confirmpassword = 'Passwords do not match'
    }
  }

  return errors
}
