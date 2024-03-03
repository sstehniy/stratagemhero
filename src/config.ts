import { Key, Stratogem } from "./types";

import LIFT_850_Jump_Pack from "./assets/Packs/HD2-JP.png";
import B_1_Supply_Pack from "./assets/Packs/HD2-SP.png";
import AX_LAS_5_Guard_Dog_Rover from "./assets/Packs/HD2-GDR.png";
import SH_20_Ballistic_Shield_Backpack from "./assets/Packs/HD2-BS.png";
import SH_32_Shield_Generator_Pack from "./assets/Packs/HD2-SGP.png";
import AX_AR_23_Guard_Dog from "./assets/Packs/HD2-GD.png";

import MG_43_Machine_Gun from "./assets/Weapons/HD2-MG.png";
import APW_1_Anti_Materiel_Rifle from "./assets/Weapons/HD2-AMR.png";
import M_105_Stalwart from "./assets/Weapons/HD2-STA.png";
import EAT_17_Expendable_Anti_tank from "./assets/Weapons/HD2-EAT.png";
import GR_8_Recoilless_Rifle from "./assets/Weapons/HD2-RR.png";
import FLAM_40_Flamethrower from "./assets/Weapons/HD2-FT.png";
import AC_8_Autocannon from "./assets/Weapons/HD2-AC.png";
import RS_422_Railgun from "./assets/Weapons/HD2-RG.png";
import FAF_14_SPEAR_Launcher from "./assets/Weapons/HD2-SPE.png";
import GL_21_Grenade_Launcher from "./assets/Weapons/HD2-GL.png";
import LAS_98_Laser_Cannon from "./assets/Weapons/HD2-LC.png";
import ARC_3_Arc_Thrower from "./assets/Weapons/HD2-AT.png";

import Reinforce from "./assets/Support/HD2-Reinforcement.png";
import SOS_Beacon from "./assets/Support/HD2-SOS.png";
import Resupply from "./assets/Support/HD2-Resupply.png";
import NUX_223_Hellbomb from "./assets/Support/HD2-Hellbomb.png";

import Upload_Data from "./assets/Support/HD2-Upload.png";
import Eagle_Rearm from "./assets/Support/HD2-ERA.png";

import Orbital_Gatling_Barrage from "./assets/Eagle/HD2-EGB.png";
import Orbital_Airburst_Strike from "./assets/Orbital/HD2-OAS.png";
import Orbital_120MM_HE_Barrage from "./assets/Orbital/HD2-O120.png";
import Orbital_380MM_HE_Barrage from "./assets/Orbital/HD2-O380.png";
import Orbital_Walking_Barrage from "./assets/Orbital/HD2-OWB.png";
import Orbital_Laser from "./assets/Orbital/HD2-OL.png";
import Orbital_Railcannon_Strike from "./assets/Orbital/HD2-ORS.png";
import Orbital_Precision_Strike from "./assets/Orbital/HD2-OPS.png";
import Orbital_Gas_Strike from "./assets/Orbital/HD2-OGS.png";
import Orbital_EMS_Strike from "./assets/Orbital/HD2-OES.png";
import Orbital_Smoke_Strike from "./assets/Orbital/HD2-OSS.png";

import Eagle_Strafing_Run from "./assets/Eagle/HD2-ESR.png";
import Eagle_Airstrike from "./assets/Eagle/HD2-EA.png";
import Eagle_Cluster_Bomb from "./assets/Eagle/HD2-ECB.png";
import Eagle_Napalm_Airstrike from "./assets/Eagle/HD2-ENA.png";
import Eagle_Smoke_Strike from "./assets/Eagle/HD2-ESS.png";
import Eagle_110MM_Rocket_Pods from "./assets/Eagle/HD2-E110.png";
import Eagle_500kg_Bomb from "./assets/Eagle/HD2-E500.png";

import E_MG_101_HMG_Emplacement from "./assets/Emplacements/HD2-HMG.png";
import FX_12_Shield_Generator_Relay from "./assets/Emplacements/HD2-SG.png";
import A_ARC_3_Tesla_Tower from "./assets/Emplacements/HD2-TT.png";
import MD_6_Anti_Personnel_Minefield from "./assets/Emplacements/HD2-APM.png";
import MD_I4_Incendiary_Mines from "./assets/Emplacements/HD2-IM.png";
import A_MG_43_Machine_Gun_Sentry from "./assets/Emplacements/HD2-MGS.png";
import A_G_16_Gatling_Sentry from "./assets/Emplacements/HD2-GS.png";
import A_M_12_Mortar_Sentry from "./assets/Emplacements/HD2-MS.png";
import A_AC_8_Autocannon_Sentry from "./assets/Emplacements/HD2-AS.png";
import A_MLS_4X_Rocket_Sentry from "./assets/Emplacements/HD2-RS.png";
import A_M_23_EMS_Mortar_Sentry from "./assets/Emplacements/HD2-EMS.png";

export const keyCodeToKey = {
  87: Key.UP,
  83: Key.DOWN,
  65: Key.LEFT,
  68: Key.RIGHT,
};

export const stratogems: Stratogem[] = [
  {
    name: "LIFT-850 Jump Pack",
    keys: [Key.DOWN, Key.UP, Key.UP, Key.DOWN, Key.UP],
    keyCount: 5,
    image: LIFT_850_Jump_Pack,
  },
  {
    name: "B-1 Supply Pack",
    keys: [Key.DOWN, Key.LEFT, Key.DOWN, Key.UP, Key.UP, Key.DOWN],
    keyCount: 6,
    image: B_1_Supply_Pack,
  },
  {
    name: 'AX/LAS-5 "Guard Dog" Rover',
    keys: [Key.DOWN, Key.UP, Key.LEFT, Key.UP, Key.RIGHT, Key.RIGHT],
    keyCount: 6,
    image: AX_LAS_5_Guard_Dog_Rover,
  },
  {
    name: "SH-20 Ballistic Shield Backpack",
    keys: [Key.DOWN, Key.LEFT, Key.DOWN, Key.DOWN, Key.UP, Key.LEFT],
    keyCount: 6,
    image: SH_20_Ballistic_Shield_Backpack,
  },
  {
    name: "SH-32 Shield Generator Pack",
    keys: [Key.DOWN, Key.UP, Key.LEFT, Key.RIGHT, Key.LEFT, Key.RIGHT],
    keyCount: 6,
    image: SH_32_Shield_Generator_Pack,
  },
  {
    name: 'AX/AR-23 "Guard Dog"',
    keys: [Key.DOWN, Key.UP, Key.LEFT, Key.UP, Key.RIGHT, Key.DOWN],
    keyCount: 6,
    image: AX_AR_23_Guard_Dog,
  },
  {
    name: "MG-43 Machine Gun",
    keys: [Key.DOWN, Key.LEFT, Key.DOWN, Key.UP, Key.RIGHT],
    keyCount: 5,
    image: MG_43_Machine_Gun,
  },
  {
    name: "APW-1 Anti-Materiel Rifle",
    keys: [Key.DOWN, Key.LEFT, Key.RIGHT, Key.UP, Key.DOWN],
    keyCount: 5,
    image: APW_1_Anti_Materiel_Rifle,
  },
  {
    name: "M-105 Stalwart",
    keys: [Key.DOWN, Key.LEFT, Key.DOWN, Key.UP, Key.UP, Key.LEFT],
    keyCount: 6,
    image: M_105_Stalwart,
  },
  {
    name: "EAT-17 Expendable Anti-tank",
    keys: [Key.DOWN, Key.UP, Key.LEFT, Key.UP, Key.RIGHT, Key.DOWN],
    keyCount: 6,
    image: EAT_17_Expendable_Anti_tank,
  },
  {
    name: "GR-8 Recoilless Rifle",
    keys: [Key.DOWN, Key.LEFT, Key.RIGHT, Key.RIGHT, Key.LEFT],
    keyCount: 5,
    image: GR_8_Recoilless_Rifle,
  },
  {
    name: "FLAM-40 Flamethrower",
    keys: [Key.DOWN, Key.LEFT, Key.UP, Key.DOWN, Key.UP],
    keyCount: 5,
    image: FLAM_40_Flamethrower,
  },
  {
    name: "AC-8 Autocannon",
    keys: [Key.DOWN, Key.LEFT, Key.DOWN, Key.UP, Key.UP, Key.RIGHT],
    keyCount: 6,
    image: AC_8_Autocannon,
  },
  {
    name: "RS-422 Railgun",
    keys: [Key.DOWN, Key.RIGHT, Key.DOWN, Key.UP, Key.LEFT, Key.RIGHT],
    keyCount: 6,
    image: RS_422_Railgun,
  },
  {
    name: "FAF-14 SPEAR Launcher",
    keys: [Key.DOWN, Key.DOWN, Key.UP, Key.DOWN, Key.DOWN],
    keyCount: 5,
    image: FAF_14_SPEAR_Launcher,
  },
  {
    name: "GL-21 Grenade Launcher",
    keys: [Key.DOWN, Key.LEFT, Key.UP, Key.LEFT, Key.DOWN],
    keyCount: 5,
    image: GL_21_Grenade_Launcher,
  },
  {
    name: "LAS-98 Laser Cannon",
    keys: [Key.DOWN, Key.LEFT, Key.DOWN, Key.UP, Key.LEFT],
    keyCount: 5,
    image: LAS_98_Laser_Cannon,
  },
  {
    name: "ARC-3 Arc Thrower",
    keys: [Key.DOWN, Key.RIGHT, Key.DOWN, Key.UP, Key.LEFT, Key.LEFT],
    keyCount: 6,
    image: ARC_3_Arc_Thrower,
  },
  {
    name: "Reinforce",
    keys: [Key.UP, Key.DOWN, Key.RIGHT, Key.LEFT, Key.UP],
    keyCount: 5,
    image: Reinforce,
  },
  {
    name: "SOS Beacon",
    keys: [Key.UP, Key.DOWN, Key.RIGHT, Key.UP],
    keyCount: 4,
    image: SOS_Beacon,
  },
  {
    name: "Resupply",
    keys: [Key.DOWN, Key.DOWN, Key.UP, Key.RIGHT],
    keyCount: 4,
    image: Resupply,
  },
  {
    name: "NUX-223 Hellbomb",
    keys: [
      Key.DOWN,
      Key.UP,
      Key.LEFT,
      Key.DOWN,
      Key.UP,
      Key.RIGHT,
      Key.DOWN,
      Key.UP,
    ],
    keyCount: 8,
    image: NUX_223_Hellbomb,
  },
  {
    name: "Upload Data",
    keys: [Key.DOWN, Key.DOWN, Key.UP, Key.UP, Key.UP],
    keyCount: 5,
    image: Upload_Data,
  },
  {
    name: "Eagle Rearm",
    keys: [Key.UP, Key.UP, Key.LEFT, Key.UP, Key.RIGHT],
    keyCount: 5,
    image: Eagle_Rearm,
  },
  {
    name: "E/MG-101 HMG Emplacement",
    keys: [Key.DOWN, Key.UP, Key.LEFT, Key.RIGHT, Key.RIGHT, Key.LEFT],
    keyCount: 6,
    image: E_MG_101_HMG_Emplacement,
  },
  {
    name: "FX-12 Shield Generator Relay",
    keys: [Key.DOWN, Key.DOWN, Key.LEFT, Key.RIGHT, Key.LEFT, Key.RIGHT],
    keyCount: 6,
    image: FX_12_Shield_Generator_Relay,
  },
  {
    name: "A/ARC-3 Tesla Tower",
    keys: [Key.DOWN, Key.UP, Key.RIGHT, Key.UP, Key.LEFT, Key.RIGHT],
    keyCount: 6,
    image: A_ARC_3_Tesla_Tower,
  },
  {
    name: "MD-6 Anti-Personnel Minefield",
    keys: [Key.DOWN, Key.LEFT, Key.UP, Key.RIGHT],
    keyCount: 4,
    image: MD_6_Anti_Personnel_Minefield,
  },
  {
    name: "MD-I4 Incendiary Mines",
    keys: [Key.DOWN, Key.LEFT, Key.LEFT, Key.DOWN],
    keyCount: 4,
    image: MD_I4_Incendiary_Mines,
  },
  {
    name: "A/MG-43 Machine Gun Sentry",
    keys: [Key.DOWN, Key.UP, Key.RIGHT, Key.RIGHT, Key.UP],
    keyCount: 5,
    image: A_MG_43_Machine_Gun_Sentry,
  },
  {
    name: "A/G-16 Gatling Sentry",
    keys: [Key.DOWN, Key.UP, Key.RIGHT, Key.LEFT],
    keyCount: 4,
    image: A_G_16_Gatling_Sentry,
  },
  {
    name: "A/M-12 Mortar Sentry",
    keys: [Key.DOWN, Key.UP, Key.RIGHT, Key.RIGHT, Key.DOWN],
    keyCount: 5,
    image: A_M_12_Mortar_Sentry,
  },
  {
    name: "A/AC-8 Autocannon Sentry",
    keys: [Key.DOWN, Key.UP, Key.RIGHT, Key.UP, Key.LEFT, Key.UP],
    keyCount: 6,
    image: A_AC_8_Autocannon_Sentry,
  },
  {
    name: "A/MLS-4X Rocket Sentry",
    keys: [Key.DOWN, Key.UP, Key.RIGHT, Key.RIGHT, Key.LEFT],
    keyCount: 5,
    image: A_MLS_4X_Rocket_Sentry,
  },
  {
    name: "A/M-23 EMS Mortar Sentry",
    keys: [Key.DOWN, Key.UP, Key.RIGHT, Key.DOWN, Key.RIGHT],
    keyCount: 5,
    image: A_M_23_EMS_Mortar_Sentry,
  },
  {
    name: "Orbital Gatling Barrage",
    keys: [Key.RIGHT, Key.DOWN, Key.LEFT, Key.UP, Key.UP],
    keyCount: 5,
    image: Orbital_Gatling_Barrage,
  },
  {
    name: "Orbital Airburst Strike",
    keys: [Key.RIGHT, Key.RIGHT, Key.RIGHT],
    keyCount: 3,
    image: Orbital_Airburst_Strike,
  },
  {
    name: "Orbital 120MM HE Barrage",
    keys: [Key.RIGHT, Key.RIGHT, Key.DOWN, Key.LEFT, Key.RIGHT, Key.DOWN],
    keyCount: 6,
    image: Orbital_120MM_HE_Barrage,
  },
  {
    name: "Orbital 380MM HE Barrage",
    keys: [Key.RIGHT, Key.DOWN, Key.UP, Key.UP, Key.LEFT, Key.DOWN, Key.DOWN],
    keyCount: 7,
    image: Orbital_380MM_HE_Barrage,
  },
  {
    name: "Orbital Walking Barrage",
    keys: [Key.RIGHT, Key.DOWN, Key.RIGHT, Key.DOWN, Key.RIGHT, Key.DOWN],
    keyCount: 6,
    image: Orbital_Walking_Barrage,
  },
  {
    name: "Orbital Laser",
    keys: [Key.RIGHT, Key.DOWN, Key.UP, Key.RIGHT, Key.DOWN],
    keyCount: 5,
    image: Orbital_Laser,
  },
  {
    name: "Orbital Railcannon Strike",
    keys: [Key.RIGHT, Key.UP, Key.DOWN, Key.DOWN, Key.RIGHT],
    keyCount: 5,
    image: Orbital_Railcannon_Strike,
  },
  {
    name: "Orbital Precision Strike",
    keys: [Key.RIGHT, Key.RIGHT, Key.UP],
    keyCount: 3,
    image: Orbital_Precision_Strike,
  },
  {
    name: "Orbital Gas Strike",
    keys: [Key.RIGHT, Key.RIGHT, Key.DOWN, Key.RIGHT],
    keyCount: 4,
    image: Orbital_Gas_Strike,
  },
  {
    name: "Orbital EMS Strike",
    keys: [Key.RIGHT, Key.RIGHT, Key.LEFT, Key.DOWN],
    keyCount: 4,
    image: Orbital_EMS_Strike,
  },
  {
    name: "Orbital Smoke Strike",
    keys: [Key.RIGHT, Key.RIGHT, Key.DOWN, Key.UP],
    keyCount: 4,
    image: Orbital_Smoke_Strike,
  },
  {
    name: "Eagle Strafing Run",
    keys: [Key.UP, Key.RIGHT, Key.RIGHT],
    keyCount: 3,
    image: Eagle_Strafing_Run,
  },
  {
    name: "Eagle Airstrike",
    keys: [Key.UP, Key.RIGHT, Key.DOWN, Key.RIGHT],
    keyCount: 4,
    image: Eagle_Airstrike,
  },
  {
    name: "Eagle Cluster Bomb",
    keys: [Key.UP, Key.RIGHT, Key.DOWN, Key.DOWN, Key.RIGHT],
    keyCount: 5,
    image: Eagle_Cluster_Bomb,
  },
  {
    name: "Eagle Napalm Airstrike",
    keys: [Key.UP, Key.RIGHT, Key.DOWN, Key.UP],
    keyCount: 4,
    image: Eagle_Napalm_Airstrike,
  },
  {
    name: "Eagle Smoke Strike",
    keys: [Key.UP, Key.RIGHT, Key.UP, Key.DOWN],
    keyCount: 4,
    image: Eagle_Smoke_Strike,
  },
  {
    name: "Eagle 110MM Rocket Pods",
    keys: [Key.UP, Key.RIGHT, Key.UP, Key.LEFT],
    keyCount: 4,
    image: Eagle_110MM_Rocket_Pods,
  },
  {
    name: "Eagle 500kg Bomb",
    keys: [Key.UP, Key.RIGHT, Key.DOWN, Key.DOWN, Key.DOWN],
    keyCount: 5,
    image: Eagle_500kg_Bomb,
  },
];
