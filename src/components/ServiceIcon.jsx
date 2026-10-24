import { Code2, Globe, Workflow, Mail, BatteryCharging, Monitor, Cctv, HouseWifi, Network, Zap, ShieldCheck } from 'lucide-react';
const icons = { Code2, Globe, Workflow, Mail, BatteryCharging, Monitor, Cctv, HouseWifi, Network, Zap, ShieldCheck };
export default function ServiceIcon({ name, ...props }) { const Icon = icons[name] || Code2; return <Icon aria-hidden="true" {...props} />; }
