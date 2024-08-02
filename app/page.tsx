'use client';

import { useState } from 'react';
import ConceptMapEditor from './components/editor';
import MapVisualization from './components/visualization';

interface Node {
  id: number;
  t: string;
  d: number;
  v: string;
  c: Node[];
}

const initialNode: Node = { 
  id: 0,
  t: 'root', 
  d: 0,
  v: 'Root',
  c: [] 
};
export default function Home() {
    const [nodes, setNodes] = useState<Node>(initialNode);

    const handleUpdateNodes = (updatedNodes: Node) => {
        setNodes(updatedNodes);
    };

    return (
        <main className="flex min-h-screen items-start justify-between">
            <div className="pt-8 pl-4 flex h-screen bg-zinc-800 w-1/6">
                <ConceptMapEditor onUpdate={handleUpdateNodes} />
            </div>
            <MapVisualization nodes={nodes} />
        </main>
    );
}
