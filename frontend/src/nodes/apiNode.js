// apiNode.js — API Call node

import { BaseNode } from './BaseNode';
import { Globe } from 'lucide-react';

export const APINode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="API Call"
            icon={<Globe size={16} />}
            description="Send an HTTP request to an external service"
            accentColor="#3b82f6"
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
