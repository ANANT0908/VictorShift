// inputNode.js

import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      label="Input"
      accentColor="#2dd4bf"
      outputs={[{ id: 'value' }]}
      fields={[
        { name: 'inputName', type: 'text', label: 'Name', defaultValue: id.replace('customInput-', 'input_') },
        { name: 'inputType', type: 'select', label: 'Type', options: ['Text', 'File'], defaultValue: 'Text' },
      ]}
    />
  );
};
