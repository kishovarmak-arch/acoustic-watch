

# ThermoSense AI – Acoustic Health Monitoring Dashboard

## Overview
A fully responsive, industrial-grade frontend dashboard for AI-powered acoustic monitoring of thermal power plant machinery. Engineers capture live microphone audio, visualize sound frequencies, and receive simulated AI health predictions.

---

## Design System
- **Industrial theme** with Deep Navy (#0F172A), Industrial Blue (#1E3A8A), Slate Gray, Steel Gray
- **Accent colors**: Thermal Orange, Warning Red, Success Green, Electric Cyan
- **Light industrial background** (#F1F5F9) with card-based layouts
- **Dark mode support** with toggle
- **Clean sans-serif typography** with strong data hierarchy

---

## Page 1: Home Page

### Hero Section
- Bold headline: "AI-Powered Acoustic Monitoring for Thermal Power Plants"
- Gradient background (Deep Navy → Slate Gray) with subtle grid pattern
- Two CTA buttons: "Start Monitoring" (orange) and "Explore Machines" (cyan)

### About Thermal Power Plants
- Two-column layout explaining turbines, boilers, generators, and why predictive maintenance matters
- Stacks vertically on mobile

### Detectable Faults Grid
- 8 cards (Bearing Wear, Shaft Misalignment, Cavitation, Turbine Blade Damage, Boiler Fan Imbalance, Gearbox Defects, Loose Couplings, Structural Vibration)
- Each with icon, explanation, sound characteristics
- Hover: lift + cyan glow border

### How It Works
- 4-step horizontal workflow with progress indicators (vertical on mobile)
- Select Machine → Capture Audio → AI Analysis → Health Dashboard

---

## Page 2: Machine Selection

- Responsive card grid with 8 machines (Steam Turbine, Boiler Feed Pump, Cooling Tower Fan, Generator, Condenser Pump, Coal Pulverizer, Induced Draft Fan, Gearbox Assembly)
- Each card: icon, description, "Analyze Machine" button
- Click navigates to Analysis Page with machine context
- Smooth transition animations

---

## Page 3: Real-Time Analysis Dashboard

### Header
- Selected machine name + status badge (Awaiting / Listening / Analyzing / Complete)

### Microphone Integration
- Real-time mic access via `getUserMedia`
- Start/Stop buttons, recording animation, mic indicator
- Permission denial error handling

### Live Audio Visualization
- Canvas-based real-time waveform
- FFT frequency spectrum bars
- Decibel level meter
- Audio intensity pulse animation
- All charts responsive

### AI Prediction (Simulated)
- After ~10-15 seconds of recording, shows loading: "Analyzing acoustic frequency patterns…"
- Mock API response with health status, confidence, detected fault, recommendation

### Health Dashboard
- Color-coded circular gauge (🟢 Healthy / 🟡 Warning / 🔴 Critical) with animated fill
- Prediction details card (fault, confidence %, risk, action, timestamp)
- Frequency line graph, health gauge, historical trend chart (mock), fault probability bar chart

---

## Navigation & Layout
- **Desktop**: Sidebar navigation + top navbar
- **Mobile**: Hamburger menu + bottom tab navigation
- Responsive at 360px, 768px, 1440px breakpoints

---

## Additional Features
- Dark mode toggle
- Export report button (mock PDF)
- Critical health alert popup
- Animated notification bell
- Toast notifications
- Loading skeleton states
- Smooth page transitions
- System status indicator ("AI Engine Online")
- Live confidence meter

---

## Technical Approach
- Modular React component architecture
- React Router for navigation with state passing
- Web Audio API for microphone capture and FFT analysis
- Canvas-based audio visualizations
- Recharts for data charts (frequency, trends, bar charts)
- Mock API simulation with setTimeout
- Tailwind CSS with custom industrial color palette
- Mobile-first responsive design

