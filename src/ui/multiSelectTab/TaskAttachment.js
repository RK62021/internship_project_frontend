import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../Loader'
import { formatDateToDMYHM } from '../../utils/dateConvert'
import ApiUrl from '../../services/apiheaders'
import { useSelector } from 'react-redux'

function TaskAttachment({ taskId }) {
  const userId = useSelector((state) => state.userId)
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchAttachments = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`${ApiUrl.User}/attachments?taskId=${taskId}`)
      if (res.status === 200) {
        setFiles(res.data.data)
      } else {
        toast.error('Failed to load attachments')
      }
    } catch (err) {
      toast.error('Server error while loading attachments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (inputFiles) => {
    if (!inputFiles || inputFiles.length === 0) return

    const formData = new FormData()
    formData.append('taskId', taskId)
    formData.append('uploadedBy', userId)
    Array.from(inputFiles).forEach((file) => {
      formData.append('documents', file)
    })

    try {
      setUploading(true)
      const response = await axios.post(`${ApiUrl.User}/attachments/upload`, formData)
      if (response.status === 200) {
        toast.success('Files uploaded successfully')
        setFiles((prev) => [...prev, ...response.data.data])
      } else {
        toast.error('Upload failed')
      }
    } catch {
      toast.error('Upload error')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    fetchAttachments()
  }, [taskId])

  return (
    <div>
      <div
        className="border p-4 mb-4 text-center"
        style={{ backgroundColor: '#f8f9fa', borderStyle: 'dashed', borderWidth: '2px' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFileUpload(e.dataTransfer.files)
        }}
      >
        <p className="text-muted mb-1">Drag & drop files here or click to upload</p>
        <input
          type="file"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="form-control mt-2"
        />
      </div>

      <hr />

      {uploading && (
        <div className="mb-3">
          <Loader small />
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : files.length > 0 ? (
        files.map((file, idx) => (
          <div key={idx} className="border rounded p-3 mb-3 bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{file.fileName || 'Unnamed File'}</strong>
                <br />
                <small className="text-muted">
                  Uploaded by: {file.uploadedByName || 'N/A'} <br />
                  On: {formatDateToDMYHM(file.uploadedDate)}
                </small>
              </div>
              <div>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  Open
                </a>
                <a
                  href={file.fileUrl}
                  download
                  className="btn btn-sm btn-primary"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No attachments available for this task.</p>
      )}
    </div>
  )
}

export default TaskAttachment
