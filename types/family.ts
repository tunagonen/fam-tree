export interface FamilyMember {
  id: string;
  name: string;
  gender: "male" | "female";
  birthDate?: string;
  deathDate?: string;
  spouseIds?: string[]; // changed from spouseId to spouseIds
  parentIds?: string[];
  children?: string[];
  notes?: string;
  photo?: string;
  isBloodline: boolean; // true if bloodline, false if outsider
}

export interface FamilyTree {
  members: Record<string, FamilyMember>;
  rootMemberId: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface FamilyMemberWithPosition extends FamilyMember {
  position: Position;
  level: number;
}

export type ConnectionType = "spouse" | "bloodline";

export interface FamilyConnection {
  from: string; // member id
  to: string; // member id
  type: ConnectionType;
}
