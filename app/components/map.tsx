import { useEffect, useRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import 'markmap-view/style/index.css';

interface MapProps {
    markdown: string;
}

export default function Map({ markdown }: MapProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const generateMarkmap = () => {
            const transformer = new Transformer();
            const { root } = transformer.transform(markdown);

            if (svgRef.current) {
                Markmap.create(svgRef.current, {}, root);
            }
        };

        generateMarkmap();
    }, [markdown]);

    return <svg ref={svgRef} style={{ width: '100%', height: '600px' }}></svg>;
}
