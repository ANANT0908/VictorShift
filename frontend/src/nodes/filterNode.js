// filterNode.js — Conditional filter node

import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Filter"
            accentColor="#22d3ee"
            inputs={[{ id: 'data', label: 'Data' }]}
            outputs={[
                { id: 'passed', label: 'Passed' },
                { id: 'failed', label: 'Failed' },
            ]}
            fields={[
                { name: 'condition', type: 'text', label: 'Condition', defaultValue: '' },
            ]}
        />
    );
};
