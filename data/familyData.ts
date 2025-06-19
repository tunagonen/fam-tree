import { FamilyTree, FamilyConnection } from "@/types/family";

export const familyTreeData: FamilyTree = {
  rootMemberId: "necdet",
  members: {
    // First generation (grandparents)
    necdet: {
      id: "necdet",
      name: "NECDET",
      gender: "male",
      spouseId: "guloren",
      children: ["kemal"],
      isBloodline: true,
    },
    guloren: {
      id: "guloren",
      name: "GÜLÖREN",
      gender: "female",
      spouseId: "necdet",
      children: ["kemal"],
      isBloodline: false, // outsider spouse
    },

    // Second generation (parents)
    kemal: {
      id: "kemal",
      name: "KEMAL",
      gender: "male",
      parentIds: ["necdet", "guloren"],
      spouseId: "gaye",
      children: ["naz", "asutay", "bogealp", "barbaros"],
      isBloodline: true,
    },
    gaye: {
      id: "gaye",
      name: "GAYE",
      gender: "female",
      spouseId: "kemal",
      children: ["naz", "asutay", "bogealp", "barbaros"],
      isBloodline: false, // outsider spouse
    },

    // Third generation (children)
    naz: {
      id: "naz",
      name: "NAZ",
      gender: "female",
      parentIds: ["kemal", "gaye"],
      isBloodline: true,
    },
    asutay: {
      id: "asutay",
      name: "ASUTAY",
      gender: "male",
      parentIds: ["kemal", "gaye"],
      isBloodline: true,
    },
    bogealp: {
      id: "bogealp",
      name: "BOGEALP",
      gender: "male",
      parentIds: ["kemal", "gaye"],
      isBloodline: true,
    },
    barbaros: {
      id: "barbaros",
      name: "BARBAROS",
      gender: "male",
      parentIds: ["kemal", "gaye"],
      isBloodline: false, // outsider child (example)
    },
  },
};

export const familyConnections: FamilyConnection[] = [
  // Spouse connections (red)
  { from: "necdet", to: "guloren", type: "spouse" },
  { from: "kemal", to: "gaye", type: "spouse" },

  // Bloodline connections (blue)
  { from: "necdet", to: "kemal", type: "bloodline" },
  { from: "guloren", to: "kemal", type: "bloodline" },
  { from: "kemal", to: "naz", type: "bloodline" },
  { from: "kemal", to: "asutay", type: "bloodline" },
  { from: "kemal", to: "bogealp", type: "bloodline" },
  { from: "kemal", to: "barbaros", type: "bloodline" },
  { from: "gaye", to: "naz", type: "bloodline" },
  { from: "gaye", to: "asutay", type: "bloodline" },
  { from: "gaye", to: "bogealp", type: "bloodline" },
  { from: "gaye", to: "barbaros", type: "bloodline" },
];
