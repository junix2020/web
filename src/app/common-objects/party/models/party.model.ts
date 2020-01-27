//export class Party {
//  partyID: string;
//  code: string;
//  name: string;
//  description: string;
//  permanentRecordIndicator: string;
//  colorID: string;

//  @ManyToOne(type => Color)
//  @JoinColumn({ name: 'colorID' })
//  color: Color;

//  @OneToMany(type => Person, inv => inv.party, { cascade: true })
//  persons: Person[];

//  @OneToMany(type => PartyStatus, inv => inv.party, { cascade: true })
//  statuses: PartyStatus[];

//  @OneToMany(type => PartyClassification, inv => inv.party, { cascade: true })
//  classifications: PartyClassification[];
//}
