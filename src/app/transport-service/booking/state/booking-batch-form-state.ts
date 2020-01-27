export interface BookingBatchFormState {
    newForm: {
        bookingBatchID: string;
        batchCode: string;
        name: string;
        description: string;
        creationDate: Date;
        bookingSlipQuantity: number;
        customerPartyID: string;
        customer: string;
        bookingPartyID: string;
        bookingParty: string;
        statusTypeID: string;
        status: string;
    }
}
