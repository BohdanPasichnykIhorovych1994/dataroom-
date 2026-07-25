import { NodeParentLink } from '../types';

export function collectSubtreeIds(
  rootId: string,
  nodes: NodeParentLink[],
): string[] {
  const childrenByParent = new Map<string | null, string[]>();

  for (const node of nodes) {
    const key = node.parentId ? node.parentId.toString() : null;
    const list = childrenByParent.get(key) ?? [];
    list.push(node._id.toString());
    childrenByParent.set(key, list);
  }

  const result: string[] = [];
  const stack = [rootId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    result.push(current);
    const children = childrenByParent.get(current) ?? [];
    stack.push(...children);
  }

  return result;
}
