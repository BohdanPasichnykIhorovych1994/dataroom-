export enum APP_ROUTE {
  ROOT = "/",
  LOGIN = "/login",
  SIGN_UP = "/signup",
  FOLDER_PATTERN = "/folder/:folderId",
}

export function folderRoute(folderId: string): string {
  return `/folder/${folderId}`;
}
