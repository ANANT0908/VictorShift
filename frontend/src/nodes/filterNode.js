// filterNode.js — Conditional filter node

import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Filter"
            icon="🔍"
            description="Conditionally filter incoming data streams"
            accentColor="#0ea5e9"
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
