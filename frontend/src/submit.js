// submit.js

import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useState } from 'react';
import { Toast } from './Toast';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error('Submit failed:', err);
            setResult({ num_nodes: 0, num_edges: 0, is_dag: false, error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="submit-container">
                <button
                    className={`submit-button ${loading ? 'submit-button-loading' : ''}`}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="submit-spinner"></span>
                            Analyzing...
                        </>
                    ) : (
                        '🚀 Submit Pipeline'
                    )}
                </button>
            </div>

            {result && (
                <Toast data={result} onClose={() => setResult(null)} />
            )}
        </>
    );
};
