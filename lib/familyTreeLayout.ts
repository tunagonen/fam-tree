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

  // 2. Create family unit nodes for each unique spouse pair
  const processedGroups = new Set<string>();
  Object.values(familyTree.members).forEach((member) => {
    if (member.spouseIds && member.spouseIds.length > 0) {
      member.spouseIds.forEach((spouseId) => {
        // Create a group for each pair (member + spouse)
        const group = [member.id, spouseId].sort();
        const key = group.join("-");
        if (!processedGroups.has(key)) {
          processedGroups.add(key);
          const familyNodeId = `family-${key}`;
          familyNodes[key] = familyNodeId;
          nodes.push({
            id: familyNodeId,
            type: "familyUnit",
            position: { x: 0, y: 0 },
            data: {
              label: group
                .map((id) => familyTree.members[id]?.name)
                .join(" + "),
              spouses: group,
            },
          });
          // Connect each spouse to the family node
          group.forEach((spouse) => {
            edges.push({
              id: `${spouse}-${familyNodeId}`,
              source: spouse,
              target: familyNodeId,
              type: "default",
              animated: false,
            });
          });
          // Connect family node to children shared by both spouses
          const memberChildren = new Set(familyTree.members[member.id]?.children || []);
          const spouseChildren = new Set(familyTree.members[spouseId]?.children || []);
          // Only connect children that are listed for both parents (intersection)
          const sharedChildren = Array.from(memberChildren).filter(childId => spouseChildren.has(childId));
          sharedChildren.forEach((childId) => {
            edges.push({
              id: `${familyNodeId}-${childId}`,
              source: familyNodeId,
              target: childId,
              type: "default",
              animated: false,
            });
          });
        }
      });
    }
  });

  // 3. Add any remaining bloodline edges for single parents (no spouse)
  Object.values(familyTree.members).forEach((member) => {
    if (
      (!member.spouseIds || member.spouseIds.length === 0) &&
      member.children
    ) {
      member.children.forEach((childId) => {
        edges.push({
          id: `${member.id}-${childId}`,
          source: member.id,
          target: childId,
          type: "default",
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
