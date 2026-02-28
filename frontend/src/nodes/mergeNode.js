// mergeNode.js — Merge multiple inputs into one output

import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Merge"
            accentColor="#34d399"
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
