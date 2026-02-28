// llmNode.js

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      label="LLM"
      accentColor="#8b5cf6"
      inputs={[
        { id: 'system', label: 'System' },
        { id: 'prompt', label: 'Prompt' },
      ]}
      outputs={[
        { id: 'response', label: 'Response' },
      ]}
    >
      <div className="base-node-static-text">This is a LLM.</div>
    </BaseNode>
  );
};
