// outputNode.js

import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      label="Output"
      accentColor="#f43f5e"
      inputs={[{ id: 'value' }]}
      fields={[
        { name: 'outputName', type: 'text', label: 'Name', defaultValue: id.replace('customOutput-', 'output_') },
        { name: 'outputType', type: 'select', label: 'Type', options: ['Text', 'Image'], defaultValue: 'Text' },
      ]}
    />
  );
};
