// transformNode.js — Data transformation node

import { BaseNode } from './BaseNode';
import { Workflow } from 'lucide-react';

export const TransformNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Transform"
            icon={<Workflow size={16} />}
            description="Apply data transformations to incoming variables"
            accentColor="#8b5cf6"
            inputs={[{ id: 'input' }]}
            outputs={[{ id: 'output' }]}
            fields={[
                {
                    name: 'operation',
                    type: 'select',
                    label: 'Operation',
                    options: ['uppercase', 'lowercase', 'trim', 'reverse'],
                    defaultValue: 'uppercase',
                },
            ]}
        />
    );
};
