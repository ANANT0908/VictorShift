// inputNode.js — Input node with visible Outputs section

import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const inputType = data?.inputType || 'Text';

  return (
    <BaseNode
      id={id}
      data={data}
      label="Input"
      icon="📥"
      description="Pass data of different types into your workflow"
      accentColor="#6366f1" // Changed to match the purple styling
      outputs={[{ id: 'value', label: 'text' }]}
      fields={[
        { name: 'inputName', type: 'text', label: 'Name', defaultValue: id.replace('customInput-', 'input_') },
        { name: 'inputType', type: 'select', label: 'Type', badge: 'Dropdown', options: ['Text', 'File'], defaultValue: 'Text' },
      ]}
    >
      {/* Visible Outputs section */}
      <div className="input-node-outputs">
        <div className="input-node-outputs-header">
          <span className="input-node-outputs-title">Output Fields</span>
          <span className="input-node-outputs-type-header">Type</span>
        </div>
        <div className="input-node-output-row">
          <span className="input-node-output-name">text</span>
          <span className="input-node-output-type-badge">{inputType}</span>
        </div>
        <div className="input-node-output-desc">The inputted text</div>
      </div>
    </BaseNode>
  );
};
