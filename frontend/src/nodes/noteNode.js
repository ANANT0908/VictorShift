// noteNode.js — Sticky-note style annotation node with auto-resize

import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import { StickyNote } from 'lucide-react';

export const NoteNode = ({ id, data }) => {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const [currText, setCurrText] = useState(data?.note || '');
    const textareaRef = useRef(null);
    const measureRef = useRef(null);
    const [dims, setDims] = useState({ width: 220, height: 80 });

    const measure = useCallback(() => {
        if (!measureRef.current) return;
        const el = measureRef.current;
        // Note nodes might want to be a bit smaller minimum width
        const measuredWidth = Math.max(200, Math.min(400, el.scrollWidth + 32));
        const measuredHeight = Math.max(60, el.scrollHeight + 4);
        setDims({ width: measuredWidth, height: measuredHeight });
    }, []);

    useEffect(() => {
        measure();
    }, [currText, measure]);

    // Initial measure delay to ensure fonts/layout are ready
    useEffect(() => {
        const timer = setTimeout(measure, 50);
        return () => clearTimeout(timer);
    }, [measure]);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setCurrText(newText);
        updateNodeField(id, 'note', newText);
    };

    return (
        <div
            className="base-node note-node-resizable"
            style={{
                width: dims.width,
                minHeight: 'auto',
                borderColor: 'rgba(250, 204, 21, 0.25)',
                backgroundColor: 'rgba(250, 204, 21, 0.05)', // slight yellow tint for notes
            }}
        >
            {/* Header */}
            <div className="base-node-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="base-node-icon" style={{ color: '#eab308' }}><StickyNote size={16} /></span>
                    <span className="base-node-label">Note</span>
                </div>
                <button className="base-node-close">✕</button>
            </div>

            {/* Body */}
            <div className="base-node-body" style={{ position: 'relative', padding: '10px' }}>

                {/* Hidden measurement element */}
                <div ref={measureRef} className="note-node-measure" aria-hidden="true">
                    {currText ? currText + '\n' : '\n'}
                </div>

                <textarea
                    ref={textareaRef}
                    className="note-node-textarea nodrag"
                    value={currText}
                    onChange={handleTextChange}
                    placeholder="Type your note here..."
                    style={{
                        width: '100%',
                        height: dims.height,
                        resize: 'none',
                        overflow: 'hidden',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        outline: 'none',
                    }}
                />
            </div>
        </div>
    );
};
