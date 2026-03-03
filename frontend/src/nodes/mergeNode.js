// mergeNode.js — Merge multiple inputs into one output

import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Merge"
            icon="🔗"
            description="Combine multiple inputs into a single output stream"
            accentColor="#10b981"
            inputs={[
                { id: 'a', label: 'A' },
                { id: 'b', label: 'B' },
                { id: 'c', label: 'C' },
            ]}
            outputs={[{ id: 'merged', label: 'Merged' }]}
            fields={[
                {
                    name: 'strategy',
                    type: 'select',
                    label: 'Strategy',
                    options: ['concat', 'zip', 'join'],
                    defaultValue: 'concat',
                },
            ]}
        />
    );
};
