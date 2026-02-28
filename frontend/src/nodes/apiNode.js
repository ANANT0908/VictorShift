// apiNode.js — API Call node

import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="API Call"
            accentColor="#f97316"
            inputs={[{ id: 'body', label: 'Body' }]}
            outputs={[
                { id: 'response', label: 'Response' },
                { id: 'error', label: 'Error' },
            ]}
            fields={[
                { name: 'url', type: 'text', label: 'URL', defaultValue: '' },
                {
                    name: 'method',
                    type: 'select',
                    label: 'Method',
                    options: ['GET', 'POST', 'PUT', 'DELETE'],
                    defaultValue: 'GET',
                },
            ]}
        />
    );
};
