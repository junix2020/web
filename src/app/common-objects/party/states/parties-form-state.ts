
export interface PartiesFormState {
  personsForm: {
    personCategoryTypeID: string;
    personCategoryTypeName: string;
    partyID: string;
    code: string;
    name: string;
    description: string;
    permanentRecordIndicator: string;
    colorID: string;
    personPartyID: string;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: Date;
    partyStatusID: string;
    startDateTime: Date;
    endDateTime: Date;
    partyStatusPartyID: string;
    statusName: string;
    statusTypeID: string;
    classifications: Array<{
      partyClassificationID: string;
      startDateTime: Date;
      endDateTime: Date;
      primaryTypeIndicator: string;
      partyID: string;
      categoryTypeName: string;
      categoryTypeID: string;
      subCategoryTypeID: string;
      mutuallyExclusiveIndicator: string;
    }>;
    // associatedAreas: Array<{
    //   areaAssociationID: string;
    //   associationTypeID: string;
    //   associationTypeName: string;
    //   subjectAreaID: string;
    //   subjectAreaName: string;
    //   associatedAreaID: string;
    //   associatedAreaName: string;
    //   areaID: string;
    //   areaCode: string;
    //   areaName: string;
    //   areaDescription;
    //   areaPermanentRecordIndicator;
    //   areaStatusID: string;
    //   areaStatusName: string;
    // }>
    //}
  };

  organizationsForm: {
    organizationCategoryTypeID: string;
    organizationTypeName: string;
    partyID: string;
    code: string;
    name: string;
    description: string;
    permanentRecordIndicator: string;
    colorID: string;
    organizationPartyID: string;
    officialName: string;
    creationDate: Date;
    partyStatusID: string;
    startDateTime: Date;
    endDateTime: Date;
    partyStatusPartyID: string;
    statusName: string;
    statusTypeID: string;
    classifications: Array<{
      partyClassificationID: string;
      startDateTime: Date;
      endDateTime: Date;
      primaryTypeIndicator: string;
      partyID: string;
      categoryTypeName: string;
      categoryTypeID: string;
      subCategoryTypeID: string;
      mutuallyExclusiveIndicator: string;
    }>;
  }
}
