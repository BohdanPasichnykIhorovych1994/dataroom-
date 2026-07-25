import {
  NODE_TYPE,
  SORT_DIRECTION,
  SORT_FIELD,
} from "@/constants";
import type {
  DataroomNode,
  FileNode,
  FolderNode,
  NodeId,
} from "@/types";

export function isFolder(node: DataroomNode): node is FolderNode {
  return node.type === NODE_TYPE.FOLDER;
}

export function isFile(node: DataroomNode): node is FileNode {
  return node.type === NODE_TYPE.FILE;
}

function nodeSize(node: DataroomNode): number {
  return node.type === NODE_TYPE.FILE ? node.size : -1;
}

function nodeDate(node: DataroomNode): number {
  return node.updatedAt;
}

export function compareNodes(
  a: DataroomNode,
  b: DataroomNode,
  field: SORT_FIELD = SORT_FIELD.NAME,
  direction: SORT_DIRECTION = SORT_DIRECTION.ASC,
): number {
  if (a.type !== b.type) return a.type === NODE_TYPE.FOLDER ? -1 : 1;

  let cmp = 0;
  switch (field) {
    case SORT_FIELD.SIZE:
      cmp = nodeSize(a) - nodeSize(b);
      break;
    case SORT_FIELD.DATE:
      cmp = nodeDate(a) - nodeDate(b);
      break;
    case SORT_FIELD.NAME:
    default:
      cmp = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  }

  if (cmp === 0 && field !== SORT_FIELD.NAME) {
    cmp = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  }

  return direction === SORT_DIRECTION.ASC ? cmp : -cmp;
}

export function sortNodes(a: DataroomNode, b: DataroomNode): number {
  return compareNodes(a, b, SORT_FIELD.NAME, SORT_DIRECTION.ASC);
}

export function sortNodesBy(
  nodes: DataroomNode[],
  field: SORT_FIELD,
  direction: SORT_DIRECTION,
): DataroomNode[] {
  return [...nodes].sort((a, b) => compareNodes(a, b, field, direction));
}

export function collectDescendantIds(
  rootId: NodeId,
  allNodes: DataroomNode[],
): NodeId[] {
  const childrenByParent = new Map<NodeId | null, DataroomNode[]>();
  for (const node of allNodes) {
    const list = childrenByParent.get(node.parentId) ?? [];
    list.push(node);
    childrenByParent.set(node.parentId, list);
  }

  const result: NodeId[] = [];
  const stack: NodeId[] = [rootId];

  while (stack.length > 0) {
    const id = stack.pop()!;
    result.push(id);
    const children = childrenByParent.get(id) ?? [];
    for (const child of children) {
      stack.push(child.id);
    }
  }

  return result;
}
