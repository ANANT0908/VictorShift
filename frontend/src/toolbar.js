// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div className="toolbar">
            <div className="toolbar-title">⚡ Pipeline Builder</div>
            <div className="toolbar-nodes">
                <DraggableNode type='customInput' label='Input' icon='📥' color='#2dd4bf' />
                <DraggableNode type='customOutput' label='Output' icon='📤' color='#f43f5e' />
                <DraggableNode type='llm' label='LLM' icon='🤖' color='#8b5cf6' />
                <DraggableNode type='text' label='Text' icon='📝' color='#f59e0b' />
                <DraggableNode type='note' label='Note' icon='📌' color='#facc15' />
                <DraggableNode type='filter' label='Filter' icon='🔍' color='#22d3ee' />
                <DraggableNode type='transform' label='Transform' icon='🔄' color='#a78bfa' />
                <DraggableNode type='api' label='API Call' icon='🌐' color='#f97316' />
                <DraggableNode type='merge' label='Merge' icon='🔗' color='#34d399' />
            </div>
        </div>
    );
};
