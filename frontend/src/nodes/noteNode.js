// noteNode.js — Sticky-note style annotation node

import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            label="Note"
            accentColor="#facc15"
            inputs={[]}
            outputs={[]}
            fields={[
                { name: 'note', type: 'textarea', label: 'Note', defaultValue: '' },
            ]}
            style={{ borderColor: 'rgba(250, 204, 21, 0.25)' }}
        />
    );
};
