import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import ApiUrl from '../../services/apiheaders';

const actionMap = {
  "Created": { label: 'Created', color: 'bg-primary', icon: 'C' },
  "Updated": { label: 'Updated', color: 'bg-success', icon: 'U' },
  "Deleted": { label: 'Deleted', color: 'bg-danger', icon: 'D' },
  "Status Changed": { label: 'Status Changed', color: 'bg-warning', icon: 'S' },
  "Document related": { label: 'Document', color: 'bg-secondary', icon: 'F' }
};

const TaskActivityTimeline = ({ taskId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${ApiUrl.User}/task-logs?taskid=${taskId}`);
      setLogs(res.data.data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) fetchLogs();
  }, [taskId]);

  return (
    <div className="ps-3 border-start border-2">
      {loading ? (
        <p className="text-muted">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-muted">No activity logs yet.</p>
      ) : (
        logs.map((log, index) => {
          const { action, performedBy, description, performedDate } = log;
          const meta = actionMap[action] || {};
          const timeAgo = formatDistanceToNow(new Date(performedDate), { addSuffix: true });

          return (
            <div className="d-flex align-items-start mb-4" key={index}>
              {/* Circle Icon */}
              <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${meta.color}`}
                   style={{ width: 40, height: 40, color: '#fff', fontWeight: 'bold' }}>
                {meta.icon || '?'}
              </div>

              {/* Description */}
              <div className="flex-grow-1">
                <div className="fw-bold mb-1">
                  {meta.label || action} by <span className="text-primary">{performedBy || 'Unknown'}</span>{' '}
                  <span className="text-muted small">• {timeAgo}</span>
                </div>
                <div className="text-muted small">{description}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TaskActivityTimeline;
