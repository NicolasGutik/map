import React from 'react';

interface Node {
    id: number;
    t: string;
    d: number;
    v: string;
    c: Node[];
}

interface NodeActionsProps {
    selectedNode: Node | null;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
    editingText: string | null;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    position: { top: number; left: number } | null;
}

const NodeActions: React.FC<NodeActionsProps> = ({
    selectedNode,
    onAdd,
    onEdit,
    onDelete,
    editingText,
    onSaveEdit,
    onCancelEdit,
    onTextChange,
    position
}) => {
    if (!selectedNode || !position) return null;

    return (
        <div 
            className="absolute" 
            style={{ 
                top: `${position?.top}px`, 
                left: `${position?.left}px`,
                zIndex: 1000 // Asegúrate de que esté por encima del contenido del árbol
            }}
        >
            <div className="flex ml-2">
                <button className="w-4 h-4 rounded-md bg-white text-xs font-bold" onClick={onAdd}>a</button>
                <button className="w-4 h-4 mx-1 rounded-md bg-white text-xs font-bold" onClick={onEdit}>e</button>
                <button className="w-4 h-4 rounded-md bg-white text-xs font-bold" onClick={onDelete}>d</button>
            </div>
            {editingText !== null && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={editingText}
                        onChange={onTextChange}
                        className="border border-gray-300 rounded p-1"
                    />
                    <div className="mt-2 flex gap-2">
                        <button 
                            onClick={onSaveEdit} 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                        <button 
                            onClick={onCancelEdit} 
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default NodeActions;
