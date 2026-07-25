export enum NODE_TYPE {
  FOLDER = 'folder',
  FILE = 'file',
}

export const NODE_TYPE_VALUES = [NODE_TYPE.FOLDER, NODE_TYPE.FILE] as const;
