import {
  Flame, Wind, Droplets, Gauge, Fuel, Wrench,
  type LucideIcon
} from "lucide-react";

export interface PlantComponent {
  id: string;
  name: string;
  aiLabel: string;
  faults: string[];
  soundCharacteristics: string;
}

export interface Subsystem {
  id: string;
  name: string;
  components: PlantComponent[];
}

export interface PlantSystem {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  zone: string;
  angleRange: [number, number];
  subsystems: Subsystem[];
}

export const plantSystems: PlantSystem[] = [
  {
    id: "boiler",
    name: "Boiler System",
    icon: Flame,
    description: "Steam generation through fuel combustion — furnace, superheater, economizer, and drum.",
    zone: "ZONE A",
    angleRange: [0, 30],
    subsystems: [
      {
        id: "boiler-furnace",
        name: "Furnace & Tubes",
        components: [
          { id: "furnace-walls", name: "Furnace Wall Tubes", aiLabel: "boiler_furnace_zone", faults: ["Tube Leak", "Overheating"], soundCharacteristics: "High-frequency hiss from steam escape" },
          { id: "superheater", name: "Superheater", aiLabel: "boiler_superheater_zone", faults: ["Tube Erosion", "Overheating"], soundCharacteristics: "Broadband noise with temperature-linked amplitude" },
          { id: "reheater", name: "Reheater", aiLabel: "boiler_reheater_zone", faults: ["Thermal Fatigue", "Tube Leak"], soundCharacteristics: "Intermittent high-frequency bursts" },
          { id: "economizer", name: "Economizer", aiLabel: "boiler_economizer_zone", faults: ["Corrosion", "Blockage"], soundCharacteristics: "Low-frequency rumble with flow restriction noise" },
          { id: "drum", name: "Drum", aiLabel: "boiler_drum_zone", faults: ["Water Level Fault", "Pressure Surge"], soundCharacteristics: "Thumping or hammering at irregular intervals" },
        ],
      },
      {
        id: "boiler-valves",
        name: "Boiler Valves",
        components: [
          { id: "blowdown-valve", name: "Blowdown Valve", aiLabel: "boiler_blowdown_valve", faults: ["Leakage", "Stuck Open"], soundCharacteristics: "Continuous steam hiss above 4kHz" },
          { id: "safety-valve", name: "Safety Valve", aiLabel: "boiler_safety_valve", faults: ["Premature Lift", "Seat Leak"], soundCharacteristics: "Sharp pressure-release burst" },
          { id: "steam-outlet-valve", name: "Steam Outlet Valve", aiLabel: "boiler_steam_outlet_valve", faults: ["Erosion", "Vibration"], soundCharacteristics: "Ultrasonic hiss with valve flutter" },
        ],
      },
    ],
  },
  {
    id: "steam-turbine",
    name: "Steam & Turbine System",
    icon: Wind,
    description: "Main steam piping, control/stop valves, and HP/IP/LP turbine stages.",
    zone: "ZONE B–C",
    angleRange: [30, 140],
    subsystems: [
      {
        id: "steam-line",
        name: "Main Steam Line",
        components: [
          { id: "main-steam-pipe", name: "Main Steam Pipe", aiLabel: "main_steam_line_zone", faults: ["Steam Leakage", "Thermal Expansion Stress"], soundCharacteristics: "High-frequency hiss and pipe resonance" },
          { id: "control-valve", name: "Control Valve", aiLabel: "turbine_control_valve_zone", faults: ["Leakage", "Valve Flutter", "Cavitation"], soundCharacteristics: "Irregular fluttering with cavitation noise" },
          { id: "stop-valve", name: "Stop Valve", aiLabel: "turbine_stop_valve_zone", faults: ["Seat Erosion", "Stuck"], soundCharacteristics: "Grinding noise during operation" },
        ],
      },
      {
        id: "turbine-stages",
        name: "Turbine Stages",
        components: [
          { id: "hp-turbine", name: "HP Turbine", aiLabel: "hp_turbine_zone", faults: ["Blade Damage", "Bearing Wear", "Shaft Misalignment"], soundCharacteristics: "Blade-pass frequency anomalies, 2x RPM harmonics" },
          { id: "ip-turbine", name: "IP Turbine", aiLabel: "ip_turbine_zone", faults: ["Blade Erosion", "Vibration"], soundCharacteristics: "Mid-frequency vibration hum" },
          { id: "lp-turbine", name: "LP Turbine", aiLabel: "lp_turbine_zone", faults: ["Blade Fouling", "Exhaust Wetness"], soundCharacteristics: "Low-frequency rumble with moisture impact noise" },
        ],
      },
    ],
  },
  {
    id: "condenser-cooling",
    name: "Condenser & Cooling System",
    icon: Droplets,
    description: "Condenser tubes, circulating water pumps, cooling tower lines, and associated valves.",
    zone: "ZONE D",
    angleRange: [140, 200],
    subsystems: [
      {
        id: "condenser",
        name: "Condenser",
        components: [
          { id: "condenser-tubes", name: "Condenser Tubes", aiLabel: "condenser_zone", faults: ["Tube Leak", "Fouling"], soundCharacteristics: "Air ingress whistle, flow turbulence" },
          { id: "circ-water-pump", name: "Circulating Water Pump", aiLabel: "condenser_circ_pump_zone", faults: ["Cavitation", "Bearing Wear"], soundCharacteristics: "Broadband crackling with bearing rumble" },
        ],
      },
      {
        id: "cooling-valves",
        name: "Cooling Valves",
        components: [
          { id: "cooling-water-valve", name: "Cooling Water Valve", aiLabel: "cooling_water_valve_zone", faults: ["Leakage", "Corrosion"], soundCharacteristics: "Low-frequency drip-related noise" },
          { id: "drain-valve", name: "Drain Valve", aiLabel: "cooling_drain_valve_zone", faults: ["Stuck", "Vibration"], soundCharacteristics: "Rattling and valve chatter" },
        ],
      },
    ],
  },
  {
    id: "feedwater",
    name: "Feedwater System",
    icon: Gauge,
    description: "Boiler feed pump, feedwater heaters, check valves, and control valves.",
    zone: "ZONE E",
    angleRange: [200, 260],
    subsystems: [
      {
        id: "feedwater-pump",
        name: "Feed Pump & Heaters",
        components: [
          { id: "boiler-feed-pump", name: "Boiler Feed Pump", aiLabel: "feedwater_pump_zone", faults: ["Cavitation", "Bearing Wear", "Seal Leak"], soundCharacteristics: "Broadband crackling, high-frequency bearing spikes" },
          { id: "feedwater-heater", name: "Feedwater Heater", aiLabel: "feedwater_heater_zone", faults: ["Tube Leak", "Shell Erosion"], soundCharacteristics: "Steam impingement noise" },
        ],
      },
      {
        id: "feedwater-valves",
        name: "Feedwater Valves",
        components: [
          { id: "feedwater-check-valve", name: "Check Valve", aiLabel: "feedwater_check_valve_zone", faults: ["Vibration", "Slam"], soundCharacteristics: "Periodic slamming impact noise" },
          { id: "feedwater-control-valve", name: "Control Valve", aiLabel: "feedwater_control_valve_zone", faults: ["Cavitation", "Leakage"], soundCharacteristics: "High-frequency cavitation hiss" },
        ],
      },
    ],
  },
  {
    id: "fuel-air",
    name: "Fuel & Air System",
    icon: Fuel,
    description: "Pulverizers, FD/ID fans, air dampers, and fuel handling components.",
    zone: "ZONE F",
    angleRange: [260, 320],
    subsystems: [
      {
        id: "fuel-handling",
        name: "Fuel Handling",
        components: [
          { id: "coal-pulverizer", name: "Coal Pulverizer", aiLabel: "pulverizer_zone", faults: ["Roller Wear", "Fire", "Blockage"], soundCharacteristics: "Grinding noise with impact spikes" },
        ],
      },
      {
        id: "fans",
        name: "Fans & Dampers",
        components: [
          { id: "fd-fan", name: "Forced Draft Fan", aiLabel: "fd_fan_zone", faults: ["Imbalance", "Bearing Wear", "Blade Damage"], soundCharacteristics: "1x running speed dominant peak" },
          { id: "id-fan", name: "Induced Draft Fan", aiLabel: "id_fan_zone", faults: ["Imbalance", "Erosion"], soundCharacteristics: "Sub-harmonic vibration with erosion noise" },
          { id: "air-damper", name: "Air Damper", aiLabel: "air_damper_zone", faults: ["Stuck", "Vibration"], soundCharacteristics: "Rattling and flow turbulence" },
        ],
      },
    ],
  },
  {
    id: "auxiliary",
    name: "Auxiliary Systems",
    icon: Wrench,
    description: "Lubrication system, drain lines, safety relief systems, and gearbox assemblies.",
    zone: "ZONE G",
    angleRange: [320, 360],
    subsystems: [
      {
        id: "aux-systems",
        name: "Support Systems",
        components: [
          { id: "lube-oil-system", name: "Lubrication System", aiLabel: "lube_oil_zone", faults: ["Low Pressure", "Contamination"], soundCharacteristics: "Pump whine and flow restriction noise" },
          { id: "gearbox", name: "Gearbox Assembly", aiLabel: "gearbox_zone", faults: ["Gear Tooth Wear", "Pitting", "Misalignment"], soundCharacteristics: "Gear mesh frequency sidebands" },
          { id: "safety-relief", name: "Safety Relief System", aiLabel: "safety_relief_zone", faults: ["Premature Lift", "Seat Leak"], soundCharacteristics: "Sudden pressure release bursts" },
        ],
      },
    ],
  },
];

// Flat helpers
export function getAllComponents(): (PlantComponent & { systemId: string; systemName: string; subsystemName: string; zone: string })[] {
  return plantSystems.flatMap((sys) =>
    sys.subsystems.flatMap((sub) =>
      sub.components.map((comp) => ({
        ...comp,
        systemId: sys.id,
        systemName: sys.name,
        subsystemName: sub.name,
        zone: sys.zone,
      }))
    )
  );
}

export function findComponentById(componentId: string) {
  for (const sys of plantSystems) {
    for (const sub of sys.subsystems) {
      const comp = sub.components.find((c) => c.id === componentId);
      if (comp) return { system: sys, subsystem: sub, component: comp };
    }
  }
  return null;
}
