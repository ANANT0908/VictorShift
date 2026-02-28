// transformNode.js — Data transformation node

import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Transform"
            accentColor="#a78bfa"
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
