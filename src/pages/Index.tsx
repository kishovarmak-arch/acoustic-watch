import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity, Cpu, BarChart3, ArrowRight, Cog,
  AlertTriangle, Waves, CircleDot, Settings2,
  Vibrate, Building2, Zap, Gauge, Mic, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const faults = [
  { title: "Steam Valve Leakage", icon: Waves, desc: "High-pressure steam escaping through valve seats in boiler or turbine systems", sound: "High-frequency hiss above 4kHz", zone: "Boiler / Steam System" },
  { title: "Bearing Wear", icon: CircleDot, desc: "Degradation of bearing surfaces in turbines, pumps, and fans", sound: "High-frequency spikes above 5kHz", zone: "Turbine / Feedwater" },
  { title: "Shaft Misalignment", icon: Settings2, desc: "Angular or parallel offset between coupled shafts", sound: "2x running speed harmonics", zone: "Steam & Turbine System" },
  { title: "Cavitation", icon: Waves, desc: "Vapor bubble collapse in pump and valve systems", sound: "Broadband crackling noise", zone: "Feedwater / Condenser" },
  { title: "Turbine Blade Damage", icon: Zap, desc: "Erosion, cracking or fouling of HP/IP/LP turbine stages", sound: "Blade-pass frequency anomalies", zone: "Steam & Turbine System" },
  { title: "Fan Imbalance", icon: Activity, desc: "Uneven mass distribution in FD/ID fans", sound: "1x running speed dominant peak", zone: "Fuel & Air System" },
  { title: "Gearbox Defects", icon: Cog, desc: "Gear tooth wear, pitting or breakage in gearbox assemblies", sound: "Gear mesh frequency sidebands", zone: "Auxiliary Systems" },
  { title: "Valve Flutter", icon: Vibrate, desc: "Rapid oscillation of control or stop valves under pressure", sound: "Irregular fluttering with amplitude modulation", zone: "Steam Line Valves" },
];

const steps = [
  { num: 1, title: "Select Zone", desc: "Browse System → Subsystem → Component", icon: Cpu },
  { num: 2, title: "Capture Audio", desc: "Record from acoustic zone mic", icon: Mic },
  { num: 3, title: "TDOA + AI Analysis", desc: "Beamforming & fault classification", icon: BarChart3 },
  { num: 4, title: "Zone Health Dashboard", desc: "View localized predictions", icon: Monitor },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-industrial text-industrial-foreground overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative container py-20 md:py-32">
          <motion.div className="max-w-3xl" {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              Real-Time Acoustic Intelligence
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              AI-Powered Acoustic Monitoring for{" "}
              <span className="text-accent">Thermal Power Plants</span>
            </h1>
            <p className="text-lg md:text-xl text-industrial-foreground/70 mb-8 max-w-2xl">
              Detect early machine faults using real-time sound frequency analysis and predictive AI.
              Reduce downtime, prevent catastrophic failures.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-thermal hover:bg-thermal/90 text-thermal-foreground font-semibold">
                <Link to="/machines">
                  Start Monitoring <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                <Link to="/machines">
                  Explore Machines <Cpu className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="container py-16 md:py-24">
        <motion.div {...fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">About Thermal Power Plants</h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            Understanding the machinery behind power generation is key to preventing failures.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }}>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Building2 className="w-10 h-10 text-accent" />
                <h3 className="text-lg font-semibold">How They Work</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Thermal power plants convert heat energy from fuel combustion into electricity. 
                  Key components include steam turbines, boilers, generators, condensers, and feed pumps 
                  — all operating under extreme temperatures and pressures. Each component produces 
                  distinct acoustic signatures during normal and faulty operation.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }}>
            <Card>
              <CardContent className="p-6 space-y-4">
                <AlertTriangle className="w-10 h-10 text-thermal" />
                <h3 className="text-lg font-semibold">Why Predictive Maintenance?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Traditional maintenance is reactive — costly and dangerous. Sound frequency analysis 
                  reveals internal faults before they escalate: bearing wear produces high-frequency 
                  harmonics, misalignment generates 2x RPM peaks, and cavitation creates broadband noise. 
                  AI-driven acoustic monitoring catches these early, saving millions in unplanned downtime.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Detectable Faults */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Detectable Faults</h2>
            <p className="text-muted-foreground max-w-2xl mb-10">
              Our AI analyzes acoustic patterns to identify these critical machinery faults.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {faults.map((fault, i) => (
              <motion.div key={fault.title} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.5 }}>
                <Card className="h-full hover:shadow-lg hover:border-accent/50 hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <CardContent className="p-5 space-y-3">
                    <fault.icon className="w-8 h-8 text-accent" />
                    <h3 className="font-semibold">{fault.title}</h3>
                    <p className="text-sm text-muted-foreground">{fault.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-accent font-mono bg-accent/5 px-2 py-1 rounded">
                      <Gauge className="w-3 h-3" />
                      {fault.sound}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium">
                      Zone: {fault.zone}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-16 md:py-24">
        <motion.div {...fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mb-12">
            From machine selection to actionable health insights in four simple steps.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div key={step.num} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="relative">
              <Card className="h-full text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto text-lg font-bold">
                    {step.num}
                  </div>
                  <step.icon className="w-8 h-8 mx-auto text-muted-foreground" />
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 ThermoSense AI — Industrial Acoustic Monitoring Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
