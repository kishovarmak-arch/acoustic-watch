import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Radar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { plantSystems, type PlantSystem, type Subsystem } from "@/data/plantHierarchy";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

export default function MachinesPage() {
  const navigate = useNavigate();
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);
  const [expandedSubsystem, setExpandedSubsystem] = useState<string | null>(null);

  const toggleSystem = (id: string) => {
    setExpandedSystem((prev) => (prev === id ? null : id));
    setExpandedSubsystem(null);
  };

  const toggleSubsystem = (id: string) => {
    setExpandedSubsystem((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container py-8 md:py-12">
      <motion.div {...fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Plant Component Browser</h1>
        <p className="text-muted-foreground mb-2 max-w-2xl">
          Navigate the thermal power plant hierarchy: <span className="font-semibold text-foreground">System → Subsystem → Component</span>.
          Select a component to begin acoustic analysis.
        </p>
        <p className="text-xs text-muted-foreground mb-8">
          AI uses acoustic zoning — each system maps to a microphone zone for directional fault detection.
        </p>
      </motion.div>

      <div className="space-y-3">
        {plantSystems.map((system, i) => (
          <motion.div key={system.id} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.4 }}>
            <SystemCard
              system={system}
              isExpanded={expandedSystem === system.id}
              onToggle={() => toggleSystem(system.id)}
              expandedSubsystem={expandedSubsystem}
              onToggleSubsystem={toggleSubsystem}
              onSelectComponent={(componentId) =>
                navigate(`/analysis?system=${system.id}&component=${componentId}`)
              }
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SystemCard({
  system,
  isExpanded,
  onToggle,
  expandedSubsystem,
  onToggleSubsystem,
  onSelectComponent,
}: {
  system: PlantSystem;
  isExpanded: boolean;
  onToggle: () => void;
  expandedSubsystem: string | null;
  onToggleSubsystem: (id: string) => void;
  onSelectComponent: (id: string) => void;
}) {
  const Icon = system.icon;

  return (
    <Card className={`transition-all duration-300 ${isExpanded ? "border-accent/50 shadow-lg" : "hover:border-accent/30"}`}>
      <button onClick={onToggle} className="w-full text-left">
        <CardContent className="p-4 md:p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm md:text-base">{system.name}</h3>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">{system.zone}</Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono text-muted-foreground">
                {system.angleRange[0]}°–{system.angleRange[1]}°
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{system.description}</p>
          </div>
          <div className="shrink-0 text-muted-foreground">
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </CardContent>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 space-y-2 border-t border-border pt-3">
              {system.subsystems.map((sub) => (
                <SubsystemBlock
                  key={sub.id}
                  subsystem={sub}
                  isExpanded={expandedSubsystem === sub.id}
                  onToggle={() => onToggleSubsystem(sub.id)}
                  onSelectComponent={onSelectComponent}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function SubsystemBlock({
  subsystem,
  isExpanded,
  onToggle,
  onSelectComponent,
}: {
  subsystem: Subsystem;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectComponent: (id: string) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-muted/30">
      <button onClick={onToggle} className="w-full text-left px-3 py-2.5 flex items-center gap-2">
        <Radar className="w-4 h-4 text-accent shrink-0" />
        <span className="text-sm font-medium flex-1">{subsystem.name}</span>
        <span className="text-xs text-muted-foreground">{subsystem.components.length} components</span>
        {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {subsystem.components.map((comp) => (
                <div
                  key={comp.id}
                  className="rounded-md border border-border bg-card p-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{comp.name}</p>
                      <p className="text-[10px] font-mono text-accent">{comp.aiLabel}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-thermal hover:bg-thermal/90 text-thermal-foreground text-xs gap-1 h-7 px-2.5"
                      onClick={() => onSelectComponent(comp.id)}
                    >
                      Analyze <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {comp.faults.map((f) => (
                      <Badge key={f} variant="secondary" className="text-[10px] px-1.5 py-0">{f}</Badge>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Radar className="w-3 h-3 text-accent" />
                    {comp.soundCharacteristics}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
