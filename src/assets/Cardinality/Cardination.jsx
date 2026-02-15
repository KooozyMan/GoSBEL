import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from 'reactflow';

export default function Cardination({ id, sourceX, sourceY, targetX, targetY }) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <select name="relationship" id={`edge-${id}`} style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}>
          <option value="0" selected hidden>realtionship</option>
          <option value="1-1">1:1</option>
          <option value="1-m">1:M</option>
          <option value="m-1">M:1</option>
          <option value="m-m">M:M</option>
      </select>
      </EdgeLabelRenderer>
    </>
  );
}
