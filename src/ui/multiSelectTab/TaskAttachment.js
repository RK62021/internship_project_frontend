import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import ApiUrl from '../../services/apiheaders';
import { useSelector } from 'react-redux';
import { formatDateToDMYHM } from '../../utils/dateConvert';
import 'bootstrap-icons/font/bootstrap-icons.css';

function TaskAttachment({ taskId }) {
  const userId = useSelector((state) => state.userId);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv"
  ];
  const MAX_FILE_SIZE_MB = 5;

  const fetchAttachments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${ApiUrl.User}/attachments?id=${taskId}`);
      if (res.status === 200) {
        setFiles(res.data.data);
      } else {
        toast.error('Failed to load attachments');
      }
    } catch (err) {
      toast.error('Server error while loading attachments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error('File size exceeds 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.warn('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('taskid', taskId);
    formData.append('uploadedBy', userId);
    formData.append('remark', ''); // kept for API compatibility
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      const res = await axios.post(`${ApiUrl.User}/upload`, formData);
      console.log(res);
      if (res.status === 201) {
        toast.success('File uploaded');
        setFiles((prev) => [...prev, res.data.data]);
        setSelectedFile(null);
        fetchAttachments(); // Refresh the list
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await axios.delete(`${ApiUrl.User}/files/delete?id=${fileId}`);
      if (res.status === 200) {
        setFiles((prev) => prev.filter((f) => f._id !== fileId));
        toast.success('File deleted');
      } else {
        toast.error('Failed to delete file');
      }
    } catch (err) {
      toast.error('Delete request failed');
    }
  };

  const getBootstrapIcon = (ext) => {
    switch (ext.toLowerCase()) {
      case 'pdf': return 'bi-file-earmark-pdf text-danger';
      case 'doc':
      case 'docx': return 'bi-file-earmark-word text-primary';
      case 'xls':
      case 'xlsx': return 'bi-file-earmark-excel text-success';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif': return 'bi-file-earmark-image text-info';
      case 'csv': return 'bi-filetype-csv text-success';
      case 'txt': return 'bi-filetype-txt text-secondary';
      default: return 'bi-file-earmark text-muted';
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [taskId]);

  return (
    <div className="container-fluid px-2">
      <div className="mb-3">
        <label className="form-label fw-bold">Upload Document</label>
        <input
          type="file"
          className="form-control mb-1"
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
        />
        <small className="text-muted">
          * Allowed: jpg, png, gif, pdf, docx, txt, xlsx, csv | Max: 5MB
        </small>
        <button
          className="btn btn-primary mt-2 w-100"
          onClick={handleFileUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <hr />

      {isLoading ? (
        <Loader />
      ) : files?.length > 0 ? (
        <div className="list-group">
          {files?.map((file, idx) => {
            const extension = file.fileName?.split('.').pop() || '';
            const iconClass = getBootstrapIcon(extension);

            return (
              <div key={idx} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <i className={`bi ${iconClass} fs-4`}></i>
                  <div>
                    <div className="fw-bold text-break">{file.filename || 'Unnamed File'}</div>
                    <small className="text-muted">
                      Uploaded by: {file.uploadedBy || 'N/A'}<br />
                      On: {formatDateToDMYHM(file.uploadedDate)}
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                  <a
                    href={`${ApiUrl.User}/files/view?id=${file._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-light"
                    title="View"
                  >
                    <i className="bi bi-eye"></i>
                  </a>
                  <a
                    href={`${ApiUrl.User}/files/download?id=${file._id}`}
                    className="btn btn-sm btn-light"
                    title="Download"
                  >
                    <i className="bi bi-download"></i>
                  </a>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="btn btn-sm btn-light text-danger"
                    title="Delete"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted text-center">No attachments available.</p>
      )}
    </div>
  );
}

export default TaskAttachment;
