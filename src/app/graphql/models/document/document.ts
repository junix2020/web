import { AssociationType } from '../core-object/association-type';
import { CategoryType } from '../core-object/category-type';
import { StatusType } from '../core-object/status-type';
import { Color } from '../user-interface/color';

export interface DocumentAssociation {
  documentAssociationID: string;
  associationDateTime: Date;
  associationTypeID: string;
  associationType: Partial<AssociationType>;
  subjectDocumentID: string;
  subjectDocument: Partial<Document>;
  associatedDocumentID: string;
  associatedDocument: Partial<Document>;
}

export interface DocumentClassification {
  documentClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  documentID: string;
  document: Partial<Document>;
  categoryType: Partial<CategoryType>;
}

export interface DocumentStatus {
  documentStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  documentID: string;
  document: Partial<Document>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}

export interface Document {
  documentID: string;
  code: string;
  name: string;
  description: string;
  entryDate: Date;
  remark: string;
  colorID: string;
  color: Partial<Color>;
  statuses: DocumentStatus[];
  classifications: DocumentClassification[];
  associations: DocumentAssociation[];
}
