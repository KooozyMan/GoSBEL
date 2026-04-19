import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow
} from 'reactflow';

export default function CrowsFoot({ id, sourceX, sourceY, targetX, targetY, data }) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const { setEdges } = useReactFlow();

  const relationship = data?.relationship || "0";

  const handleRelationshipChange = (e) => {
    const newValue = e.target.value;

    // Update the edge data
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              relationship: newValue
            }
          };
        }
        return edge;
      })
    );
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <select
          name="relationship"
          value={relationship}
          id={`edge-${id}`}
          onChange={handleRelationshipChange}
          style={{
            position: 'absolute',
            background: '#374151',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#e5e7eb',
            border: 'none',
            padding: '4px 6px',
            borderRadius: '4px',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <option value="0" hidden>relationship</option>
          <option value="1-1" style={{ fontSize: '20px' }}>1:1</option>
          <option value="1-m" style={{ fontSize: '20px' }}>1:M</option>
          <option value="m-1" style={{ fontSize: '20px' }}>M:1</option>
          <option value="m-m" style={{ fontSize: '20px' }}>M:M</option>
        </select>
      </EdgeLabelRenderer>
    </>
  );
}