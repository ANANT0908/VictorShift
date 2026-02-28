// BaseNode.js — Reusable node abstraction for all pipeline nodes

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({ id, data, label, inputs = [], outputs = [], fields = [], style = {}, children, accentColor = '#6366f1' }) => {
    const updateNodeField = useStore((state) => state.updateNodeField);

    const renderField = (field) => {
        const value = data?.[field.name] !== undefined ? data[field.name] : (field.defaultValue || '');

        const handleChange = (e) => {
            updateNodeField(id, field.name, e.target.value);
        };

        switch (field.type) {
            case 'select':
                return (
                    <div className="base-node-field" key={field.name}>
                        <label className="base-node-field-label">{field.label}</label>
                        <select
                            className="base-node-field-input"
                            value={value}
                            onChange={handleChange}
                        >
                            {(field.options || []).map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'textarea':
                return (
                    <div className="base-node-field" key={field.name}>
                        <label className="base-node-field-label">{field.label}</label>
                        <textarea
                            className="base-node-field-input base-node-textarea"
                            value={value}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                );
            case 'text':
            default:
                return (
                    <div className="base-node-field" key={field.name}>
                        <label className="base-node-field-label">{field.label}</label>
                        <input
                            type="text"
                            className="base-node-field-input"
                            value={value}
                            onChange={handleChange}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="base-node" style={style}>
            {/* Header */}
            <div className="base-node-header" style={{ borderTopColor: accentColor }}>
                <span className="base-node-label">{label}</span>
            </div>

            {/* Body */}
            <div className="base-node-body">
                {fields.map(renderField)}
                {children}
            </div>

            {/* Input handles (left side) */}
            {inputs.map((input, index) => (
                <Handle
                    key={input.id}
                    type="target"
                    position={Position.Left}
                    id={`${id}-${input.id}`}
                    className="base-node-handle base-node-handle-target"
                    style={{ top: `${((index + 1) / (inputs.length + 1)) * 100}%` }}
                >
                    {input.label && (
                        <span className="handle-label handle-label-left">{input.label}</span>
                    )}
                </Handle>
            ))}

            {/* Output handles (right side) */}
            {outputs.map((output, index) => (
                <Handle
                    key={output.id}
                    type="source"
                    position={Position.Right}
                    id={`${id}-${output.id}`}
                    className="base-node-handle base-node-handle-source"
                    style={{ top: `${((index + 1) / (outputs.length + 1)) * 100}%` }}
                >
                    {output.label && (
                        <span className="handle-label handle-label-right">{output.label}</span>
                    )}
                </Handle>
            ))}
        </div>
    );
};
