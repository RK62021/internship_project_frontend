import registerUser from '../../../../assets/images/registeruser.jpg'

const AddUser = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${registerUser})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '90vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: "black",
      }}
    >
      <div
        className="p-4 shadow rounded"
        style={{
          backgroundColor: 'rgba(000,000,000, 0.5)',
          backdropFilter: 'blur(5px)',
          maxWidth: '600px',
          width: '100%',
          color: '#000',
        }}
      >
        <h4 className="mb-3 text-center" style={{color:"whitesmoke"}}>Add New User</h4>
        <form>
          <div className="mb-3" style={{color:"whitesmoke"}}>
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input type="text" className="form-control" id="name" placeholder="Enter full name" style={{height:"50px",backgroundColor: 'rgba(255,255,255,0.7)'}}  />
          </div>

          <div className="mb-3" style={{color:"whitesmoke"}}>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input type="email" className="form-control" id="email" placeholder="Enter email" style={{height:"50px",backgroundColor: 'rgba(255,255,255,0.7)'}} />
          </div>

          <div className="mb-3" style={{color:"whitesmoke"}}>
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input type="tel" className="form-control" id="phone" placeholder="Enter phone number" style={{height:"50px",backgroundColor: 'rgba(255,255,255,0.7)'}} />
          </div>
          <div className="mb-3" style={{color:"whitesmoke"}}>
            <label htmlFor="phone" className="form-label">
              Department
            </label>
            <input type="tel" className="form-control" id="phone" placeholder="Enter phone number" style={{height:"50px",backgroundColor: 'rgba(255,255,255,0.7)'}} />
          </div>
          <div className="mb-3" style={{color:"whitesmoke"}}>
            <label htmlFor="phone" className="form-label">
              Designation
            </label>
            <input type="tel" className="form-control" id="phone" placeholder="Enter phone number" style={{height:"50px",backgroundColor: 'rgba(255,255,255,0.7)'}} />
          </div>

          {/* <div className="mb-3" style={{color:"whitesmoke"}}>
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <input type="text" className="form-control" id="role" placeholder="Enter user role" style={{height:"50px",backgroundColor: 'rgba(255,255,255,0.7)'}} />
          </div> */}
          <div className="mb-3" style={{color:"whitesmoke",marginTop:"33px"}}>
          <button type="submit" className="btn btn-primary w-100" style={{height:"50px"}}>
            Add User
          </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUser
