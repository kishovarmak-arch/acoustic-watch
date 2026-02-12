import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cog, Droplets, Fan, Zap, Gauge, Hammer, Wind, Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const machines = [
  { id: "steam-turbine", name: "Steam Turbine", icon: Zap, desc: "High-pressure steam-driven rotary engine converting thermal energy to mechanical work." },
  { id: "boiler-feed-pump", name: "Boiler Feed Pump", icon: Droplets, desc: "High-pressure pump supplying water to the steam boiler system." },
  { id: "cooling-tower-fan", name: "Cooling Tower Fan", icon: Fan, desc: "Large axial fan removing heat from circulating cooling water." },
  { id: "generator", name: "Generator", icon: Gauge, desc: "Electromagnetic device converting mechanical rotation to electrical power." },
  { id: "condenser-pump", name: "Condenser Pump", icon: Droplets, desc: "Extracts condensate from the steam condenser for recirculation." },
  { id: "coal-pulverizer", name: "Coal Pulverizer", icon: Hammer, desc: "Grinds coal into fine powder for efficient combustion in the boiler." },
  { id: "induced-draft-fan", name: "Induced Draft Fan", icon: Wind, desc: "Draws flue gases through the boiler and up the chimney stack." },
  { id: "gearbox-assembly", name: "Gearbox Assembly", icon: Settings2, desc: "Transmits and adjusts rotational speed between turbine and generator." },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

export default function MachinesPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-8 md:py-12">
      <motion.div {...fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Machine Selection</h1>
        <p className="text-muted-foreground mb-8 max-w-xl">
          Choose a machine to begin real-time acoustic analysis and AI health prediction.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {machines.map((machine, i) => (
          <motion.div key={machine.id} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.4 }}>
            <Card className="h-full hover:shadow-lg hover:border-accent/50 hover:-translate-y-1 transition-all duration-300 group">
              <CardContent className="p-5 flex flex-col h-full space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <machine.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{machine.name}</h3>
                  <p className="text-sm text-muted-foreground">{machine.desc}</p>
                </div>
                <Button
                  onClick={() => navigate(`/analysis?machine=${machine.id}`)}
                  className="w-full bg-thermal hover:bg-thermal/90 text-thermal-foreground"
                >
                  Analyze Machine
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
