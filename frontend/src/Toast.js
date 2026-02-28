// Toast.js — Reusable toast/modal component for pipeline results

import { useState, useEffect } from 'react';

export const Toast = ({ data, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // wait for exit animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`toast-overlay ${visible ? 'toast-visible' : ''}`}>
            <div className={`toast-card ${visible ? 'toast-card-visible' : ''}`}>
                <div className="toast-header">
                    <span className="toast-title">Pipeline Analysis</span>
                    <button className="toast-close" onClick={handleClose}>✕</button>
                </div>
                <div className="toast-body">
                    <div className="toast-stat">
                        <span className="toast-stat-icon">🔷</span>
                        <span className="toast-stat-label">Nodes</span>
                        <span className="toast-stat-value">{data.num_nodes}</span>
                    </div>
                    <div className="toast-stat">
                        <span className="toast-stat-icon">🔶</span>
                        <span className="toast-stat-label">Edges</span>
                        <span className="toast-stat-value">{data.num_edges}</span>
                    </div>
                    <div className="toast-stat">
                        <span className={`toast-stat-icon ${data.is_dag ? 'toast-dag-yes' : 'toast-dag-no'}`}>
                            {data.is_dag ? '✅' : '❌'}
                        </span>
                        <span className="toast-stat-label">Is DAG</span>
                        <span className={`toast-stat-value ${data.is_dag ? 'toast-dag-yes-text' : 'toast-dag-no-text'}`}>
                            {data.is_dag ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
