import React from "react";
import { format } from "date-fns";

const TaskActivityTab = ({ activities = [] }) => {
  return (
    <div className="container px-3 py-4">
      {activities.length === 0 ? (
        <div className="text-center text-muted py-3">No activity yet.</div>
      ) : (
        activities.map((activity, idx) => (
          <div
            key={idx}
            className="card shadow-sm mb-3 border-0 rounded-4"
          >
            <div className="card-body">
              <h6 className="card-title mb-1 text-primary">
                {activity.action}
              </h6>
              <p className="card-text text-muted small mb-2">
                {activity.details}
              </p>
              <p className="card-text text-secondary small mb-0">
                By <strong>{activity.by}</strong> on{" "}
                {format(new Date(activity.date), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskActivityTab;
