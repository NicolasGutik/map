'use client';

import { useEffect, useRef } from 'react';
import { Markmap } from 'markmap-view';

interface Node {
    id: number;
    t: string;
    d: number;
    v: string;
    c: Node[];
}

interface MarkmapNode {
    content: string;
    children: MarkmapNode[];
}

// Convert Node to MarkmapNode format
const convertToMarkmapFormat = (node: Node): MarkmapNode => {
    return {
        content: node.v,
        children: node.c.map(convertToMarkmapFormat)
    };
};

interface MapVisualizationProps {
    nodes: Node;
}

export default function MapVisualization({ nodes }: MapVisualizationProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const generateMarkmap = () => {
            if (svgRef.current) {
                svgRef.current.innerHTML = ''; // Limpiar contenido previo
                const markmapData = convertToMarkmapFormat(nodes);
                Markmap.create(svgRef.current, {}, markmapData);
            }
        };

        generateMarkmap();
    }, [nodes]);

    return <svg ref={svgRef} style={{ width: '100%', height: '600px' }}></svg>;
}
