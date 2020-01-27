import { FileType } from './file-type';

export interface ExternalDocument {
  documentID: string;
  document: Partial<Document>;
  documentURL: string;
  fileTypeID: string;
  fileType: FileType;
}
