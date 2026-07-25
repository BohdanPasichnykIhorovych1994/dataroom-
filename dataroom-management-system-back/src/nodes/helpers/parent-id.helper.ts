export function normalizeParentId(value: unknown): string | null {
  if (value === '' || value === undefined || value === null) {
    return null;
  }
  return String(value);
}

export function parentIdToString(
  parentId: { toString(): string } | null | undefined,
): string | null {
  if (!parentId) return null;
  return parentId.toString();
}
