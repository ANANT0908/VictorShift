// outputNode.js

import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      label="Output"
      icon="📤"
      description="Output data out of your workflow"
      accentColor="#8b5cf6"
      inputs={[{ id: 'value', label: 'value' }]}
      fields={[
        { name: 'outputName', type: 'text', label: 'Name', defaultValue: id.replace('customOutput-', 'output_') },
        { name: 'outputType', type: 'select', label: 'Type', badge: 'Dropdown', options: ['Text', 'Image'], defaultValue: 'Text' },
      ]}
    />
  );
};
