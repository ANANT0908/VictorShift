// filterNode.js — Conditional filter node

import { BaseNode } from './BaseNode';
import { Filter } from 'lucide-react';

export const FilterNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Filter"
            icon={<Filter size={16} />}
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
