import { useState, useEffect, useRef } from 'react';
import NodeActions from './nodeActions';

interface Node {
    id: number;
    t: string;
    d: number;
    v: string;
    c: Node[];
}

interface ConceptMapEditorProps {
    onUpdate: (nodes: Node) => void;
}

const initialNode: Node = { 
    id: 0,
    t: 'root', 
    d: 0,
    v: 'Root',
    c: [] 
};

const NODE_HEIGHT = 50; // Altura fija de cada nodo

export default function ConceptMapEditor({ onUpdate }: ConceptMapEditorProps) {
    const [nodes, setNodes] = useState<Node>(initialNode);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [editingText, setEditingText] = useState<string | null>(null);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [nextId, setNextId] = useState<number>(1); // Contador de IDs
    const containerRef = useRef<HTMLDivElement>(null);

    const handleAddChild = () => {
        if (selectedNode) {
            const newNode: Node = { 
                id: nextId, // Asigna el ID siguiente
                t: 'heading', 
                d: selectedNode.d + 1, 
                v: 'New Node', 
                c: [] 
            };
            setNextId(nextId + 1); // Incrementa el contador para el siguiente nodo
            const updatedNode = addNode(nodes, selectedNode, newNode);
            setNodes(updatedNode);
            setSelectedNode(newNode);
            onUpdate(updatedNode);
        }
    };

    const handleEditNode = () => {
        if (selectedNode) {
            setEditingText(selectedNode.v);
        }
    };

    const handleDeleteNode = () => {
        if (selectedNode) {
            const updatedNode = removeNode(nodes, selectedNode);
            setNodes(updatedNode);
            setSelectedNode(null);
            setPosition(null);
            onUpdate(updatedNode);
        }
    };

    const handleSaveEdit = () => {
        if (selectedNode && editingText !== null) {
            const updatedNode = updateNode(nodes, selectedNode, editingText);
            setNodes(updatedNode);
            setEditingText(null);
            onUpdate(updatedNode);
        }
    };

    const handleCancelEdit = () => {
        setEditingText(null);
    };

    const handleSelectNode = (node: Node, e: React.MouseEvent<HTMLDivElement>) => {
        setSelectedNode(node);
        setEditingText(null);

        const nodeElement = document.getElementById(`node-${node.id}`);
        if (nodeElement && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const nodeRect = nodeElement.getBoundingClientRect();
            setPosition({
                top: nodeRect.top - containerRect.top,
                left: ( nodeRect.right - containerRect.left ) 
            });
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingText(e.target.value);
    };

    const addNode = (node: Node, parentNode: Node, newNode: Node): Node => {
        if (node === parentNode) {
            return { ...node, c: [...node.c, newNode] };
        }
        return { ...node, c: node.c.map(child => addNode(child, parentNode, newNode)) };
    };

    const removeNode = (node: Node, targetNode: Node): Node => {
        if (node === targetNode) return { ...node, c: [] };
        return { ...node, c: node.c.filter(child => child !== targetNode).map(child => removeNode(child, targetNode)) };
    };

    const updateNode = (node: Node, targetNode: Node, newValue: string): Node => {
        if (node === targetNode) return { ...node, v: newValue };
        return { ...node, c: node.c.map(child => updateNode(child, targetNode, newValue)) };
    };

    const renderNodes = (nodes: Node[]): JSX.Element => (
        <ul>
            {nodes.map(node => (
                <li key={node.id} className="mb-1">
                    <div
                        id={`node-${node.id}`}
                        onClick={(e) => handleSelectNode(node, e)}
                        className="cursor-pointer rounded-md text-white text-xs w-10 h-4 text-nowrap overflow-hidden"
                    >
                        {node.v}
                    </div>
                    {node.c.length > 0 && (
                        <ul className="pl-2">
                            {renderNodes(node.c)}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="relative flex">
            <div ref={containerRef} className="flex-1">
                {renderNodes([nodes])}
            </div>
            {position && (
                <NodeActions
                    selectedNode={selectedNode}
                    onAdd={handleAddChild}
                    onEdit={handleEditNode}
                    onDelete={handleDeleteNode}
                    editingText={editingText}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onTextChange={handleTextChange}
                    position={position}
                />
            )}
        </div>
    );
}
