export interface Folder {
  folderId: number;
  userId?: number;
  folderName: string;
  parentFolderId: number | null;
}