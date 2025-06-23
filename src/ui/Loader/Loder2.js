import { CSpinner } from "@coreui/react"

const Loader2=()=>{
    return (
        <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{
          zIndex: 1060,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        //   backdropFilter: 'blur(4px)',
        }}
      >
        <CSpinner color="primary" style={{ width: '4rem', height: '4rem' }} />
      </div>
    )
}

export default Loader2