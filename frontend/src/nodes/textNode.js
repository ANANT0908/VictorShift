// textNode.js — Auto-resize textarea + dynamic {{ variable }} handles

import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const extractVariables = (text) => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (!vars.includes(match[1])) vars.push(match[1]);
  }
  return vars;
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const textareaRef = useRef(null);

  // Compute auto-resize dimensions
  const lines = currText.split('\n');
  const longestLine = Math.max(...lines.map((l) => l.length));
  const charWidth = 8.2;
  const lineHeight = 22;
  const headerHeight = 42;
  const padding = 40;

  const nodeWidth = Math.max(220, Math.min(500, longestLine * charWidth + padding));
  const nodeHeight = Math.max(120, lines.length * lineHeight + headerHeight + padding + 20);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrText(newText);
    setVariables(extractVariables(newText));
    updateNodeField(id, 'text', newText);
  };

  useEffect(() => {
    setVariables(extractVariables(currText));
  }, [currText]);

  return (
    <div className="base-node" style={{ width: nodeWidth, minHeight: nodeHeight }}>
      {/* Header */}
      <div className="base-node-header" style={{ borderTopColor: '#f59e0b' }}>
        <span className="base-node-label">Text</span>
      </div>

      {/* Body */}
      <div className="base-node-body">
        <div className="base-node-field">
          <label className="base-node-field-label">Text</label>
          <textarea
            ref={textareaRef}
            className="base-node-field-input base-node-textarea text-node-textarea"
            value={currText}
            onChange={handleTextChange}
            rows={Math.max(2, lines.length)}
            style={{
              width: '100%',
              resize: 'none',
              overflow: 'hidden',
            }}
          />
        </div>
      </div>

      {/* Dynamic variable handles (left side) */}
      {variables.map((varName, index) => (
        <Handle
          key={varName}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          className="base-node-handle base-node-handle-target"
          style={{ top: `${((index + 1) / (variables.length + 1)) * 100}%` }}
        >
          <span className="handle-label handle-label-left">{varName}</span>
        </Handle>
      ))}

      {/* Static output handle (right side) */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="base-node-handle base-node-handle-source"
        style={{ top: '50%' }}
      >
        <span className="handle-label handle-label-right">Output</span>
      </Handle>
    </div>
  );
};
