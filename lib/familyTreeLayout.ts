import dagre from "dagre";
import { Node, Edge, Position } from "@xyflow/react";
import { FamilyTree, FamilyConnection, FamilyMember } from "@/types/family";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 160;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: (isHorizontal ? Position.Left : Position.Top) as Position,
      sourcePosition: (isHorizontal
        ? Position.Right
        : Position.Bottom) as Position,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: layoutedNodes, edges };
};

export const createNodesAndEdges = (
  familyTree: FamilyTree,
  connections: FamilyConnection[],
  onEdit?: (member: FamilyMember) => void,
  onDelete?: (memberId: string) => void,
  onAddChild?: (parentId: string) => void,
  onAddSpouse?: (memberId: string) => void
) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const familyNodes: Record<string, string> = {}; // key: sorted spouse ids, value: family node id

  // 1. Create member nodes
  Object.values(familyTree.members).forEach((member) => {
    nodes.push({
      id: member.id,
      type: "familyMember",
      position: { x: 0, y: 0 },
      data: {
        ...member,
        onEdit,
        onDelete,
        onAddChild,
        onAddSpouse,
      },
    });
  });

  // 2. Create family unit nodes for each spouse pair
  Object.values(familyTree.members).forEach((member) => {
    if (member.spouseId && member.id < member.spouseId) {
      // Only create one node per pair
      const key = [member.id, member.spouseId].sort().join("-");
      const familyNodeId = `family-${key}`;
      familyNodes[key] = familyNodeId;
      nodes.push({
        id: familyNodeId,
        type: "familyUnit",
        position: { x: 0, y: 0 },
        data: {
          label: `${member.name} + ${
            familyTree.members[member.spouseId]?.name
          }`,
          spouses: [member.id, member.spouseId],
        },
      });
      // Connect each spouse to the family node
      edges.push({
        id: `${member.id}-${familyNodeId}`,
        source: member.id,
        target: familyNodeId,
        type: "default",
        // style: { stroke: "#ef4444", strokeWidth: 2 },
        animated: false,
      });
      edges.push({
        id: `${member.spouseId}-${familyNodeId}`,
        source: member.spouseId,
        target: familyNodeId,
        type: "default",
        // style: { stroke: "#ef4444", strokeWidth: 2 },
        animated: false,
      });
      // Connect family node to children
      const children = member.children || [];
      children.forEach((childId) => {
        edges.push({
          id: `${familyNodeId}-${childId}`,
          source: familyNodeId,
          target: childId,
          type: "default",
          // style: { stroke: "#3b82f6", strokeWidth: 3 },
          animated: false,
        });
      });
    }
  });

  // 3. Add any remaining bloodline edges for single parents (no spouse)
  Object.values(familyTree.members).forEach((member) => {
    if (!member.spouseId && member.children) {
      member.children.forEach((childId) => {
        edges.push({
          id: `${member.id}-${childId}`,
          source: member.id,
          target: childId,
          type: "default",
          // style: { stroke: "#3b82f6", strokeWidth: 3 },
          animated: false,
        });
      });
    }
  });

  return getLayoutedElements(nodes, edges);
};

export const findOptimalLayout = (
  familyTree: FamilyTree,
  connections: FamilyConnection[]
) => {
  // Try different layouts and choose the best one
  const layouts = ["TB", "BT", "LR", "RL"];
  let bestLayout = "TB";
  let minWidth = Infinity;

  layouts.forEach((direction) => {
    const { nodes } = createNodesAndEdges(familyTree, connections);
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, [], direction);

    const maxX = Math.max(
      ...layoutedNodes.map((n) => n.position.x + nodeWidth)
    );
    const maxY = Math.max(
      ...layoutedNodes.map((n) => n.position.y + nodeHeight)
    );
    const totalArea = maxX * maxY;

    if (totalArea < minWidth) {
      minWidth = totalArea;
      bestLayout = direction;
    }
  });

  return bestLayout;
};
