import { WidgetConfig, KnowledgeBaseItem } from '../types';

export const INDUSTRY_PRESETS: {
  id: string;
  name: string;
  industry: string;
  businessName: string;
  receptionistName: string;
  receptionistTitle: string;
  welcomeGreeting: string;
  quickChips: string[];
  knowledgeBase: KnowledgeBaseItem[];
}[] = [
  {
    id: 'hvac',
    name: 'HVAC & Plumbing (Emergency Triage)',
    industry: 'HVAC & Plumbing',
    businessName: "Summit Heating & Air",
    receptionistName: 'Kelly',
    receptionistTitle: 'Dispatch & Service Coordinator',
    welcomeGreeting: 'Welcome to Summit Heating & Air. Need urgent repairs, maintenance, or a quote on your system?',
    quickChips: [
      'AC is blowing warm air',
      'Heater won’t turn on',
      'Do you offer 24/7 emergency service?',
      'Get a replacement quote'
    ],
    knowledgeBase: [
      {
        id: '1',
        question: 'Do you offer 24/7 emergency service?',
        answer: 'Yes! We have on-call licensed technicians ready 24/7 for urgent heat, AC, and severe plumbing leaks. Standard emergency diagnostic fee applies.'
      },
      {
        id: '2',
        question: 'What are your standard business hours?',
        answer: 'Our standard dispatch hours are Monday through Saturday, 7:00 AM to 7:00 PM. Emergency service is available 24 hours a day, 365 days a year.'
      },
      {
        id: '3',
        question: 'How much does a service call or diagnostic visit cost?',
        answer: 'Our standard residential diagnostic fee is $89, which is waived if you approve any recommended repair on the same visit!'
      },
      {
        id: '4',
        question: 'What is your service coverage area?',
        answer: 'We cover the entire greater metro area and surrounding suburbs within a 35-mile radius. No extra travel fee within our primary zone.'
      }
    ]
  },
  {
    id: 'dental',
    name: 'Dental & Healthcare Clinic',
    industry: 'Dental Practice',
    businessName: 'Evergreen Family Dental',
    receptionistName: 'Claire',
    receptionistTitle: 'Patient Concierge',
    welcomeGreeting: 'Hello! Welcome to Evergreen Family Dental. How can we care for your smile today?',
    quickChips: [
      'Book a new patient exam',
      'Dental emergency / toothache',
      'Do you accept Delta Dental insurance?',
      'Teeth whitening pricing'
    ],
    knowledgeBase: [
      {
        id: 'd1',
        question: 'Do you take new patients and emergency walk-ins?',
        answer: 'Yes, we are actively welcoming new patients and reserve emergency slots daily for acute tooth pain or broken teeth.'
      },
      {
        id: 'd2',
        question: 'What dental insurances do you accept?',
        answer: 'We accept most major PPO insurances including Delta Dental, MetLife, Cigna, Aetna, and Guardian. We also offer an affordable in-house membership plan!'
      },
      {
        id: 'd3',
        question: 'Where are you located and what are your hours?',
        answer: 'We are located at 450 Medical Arts Plaza, Suite 200. Open Monday to Thursday 8am - 5pm, and Fridays 8am - 2pm.'
      }
    ]
  },
  {
    id: 'contractor',
    name: 'Roofing & General Contractor',
    industry: 'Roofing & Exterior Construction',
    businessName: 'Pinnacle Roofing & Restoration',
    receptionistName: 'Marcus',
    receptionistTitle: 'Project Estimator Assistant',
    welcomeGreeting: 'Welcome to Pinnacle Roofing. Need a free storm damage inspection, roof replacement, or leak repair?',
    quickChips: [
      'Book a free roof inspection',
      'Active roof leak repair',
      'Insurance claim assistance',
      'Financing options'
    ],
    knowledgeBase: [
      {
        id: 'r1',
        question: 'Are your roof inspections really free?',
        answer: 'Yes, 100% free with zero obligation. A certified inspector performs an 18-point drone and physical inspection complete with photo documentation.'
      },
      {
        id: 'r2',
        question: 'Do you work directly with home insurance companies?',
        answer: 'Yes! We specialize in storm, wind, and hail insurance claims. We meet the insurance adjuster on site to ensure your roof is fully approved.'
      },
      {
        id: 'r3',
        question: 'Are you licensed and insured?',
        answer: 'We are fully licensed, bonded, and carry $2M in general liability and workers compensation insurance for your peace of mind.'
      }
    ]
  },
  {
    id: 'agency',
    name: 'SaaS / Digital Agency',
    industry: 'Software & Web Development',
    businessName: 'HyperScale AI Studio',
    receptionistName: 'Alex',
    receptionistTitle: 'Product Specialist',
    welcomeGreeting: 'Welcome to HyperScale. Want to see a quick demo, discuss a project, or explore custom pricing?',
    quickChips: [
      'How does the API key rotation work?',
      'Can I embed this in WordPress or Shopify?',
      'Is this MIT open-source?',
      'Schedule a 15-min call'
    ],
    knowledgeBase: [
      {
        id: 's1',
        question: 'Is this widget truly free and open source?',
        answer: 'Yes! It is published under the MIT license. You can embed it on unlimited sites, self-host the backend in Node or C#, and customize everything.'
      },
      {
        id: 's2',
        question: 'How fast is the widget to load?',
        answer: 'Under 14KB gzipped with zero external runtime dependencies. It loads asynchronously so it will never slow down your Core Web Vitals or PageSpeed scores.'
      },
      {
        id: 's3',
        question: 'Does this violate immigration or work authorization rules if I am on H-4 or F-1?',
        answer: 'No! Passive visibility — publishing open-source code on GitHub, writing documentation, and letting users discover it organically without soliciting customers — strictly avoids commercial advertising, making it compliant with passive scholarly contributions.'
      }
    ]
  }
];

export const THEME_PRESETS = [
  {
    id: 'indigo',
    name: 'Hyper Indigo',
    primary: '#4f46e5',
    secondary: '#eef2ff',
    text: '#ffffff',
    bg: '#0f172a',
    badge: 'Popular',
  },
  {
    id: 'emerald',
    name: 'Emerald Pro',
    primary: '#059669',
    secondary: '#ecfdf5',
    text: '#ffffff',
    bg: '#064e3b',
    badge: 'High Trust',
  },
  {
    id: 'violet',
    name: 'Electric Violet',
    primary: '#7c3aed',
    secondary: '#f5f3ff',
    text: '#ffffff',
    bg: '#3b0764',
    badge: 'Modern',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Slate',
    primary: '#0f172a',
    secondary: '#f8fafc',
    text: '#ffffff',
    bg: '#020617',
    badge: 'Minimal',
  },
  {
    id: 'rose',
    name: 'Sunset Rose',
    primary: '#e11d48',
    secondary: '#fff1f2',
    text: '#ffffff',
    bg: '#4c0519',
    badge: 'Vibrant',
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    primary: '#d97706',
    secondary: '#fffbeb',
    text: '#ffffff',
    bg: '#451a03',
    badge: 'Contractor',
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    primary: '#0891b2',
    secondary: '#ecfeff',
    text: '#ffffff',
    bg: '#083344',
    badge: 'Tech',
  }
];

export const FONT_OPTIONS: { id: WidgetConfig['fontFamily']; name: string; style: string }[] = [
  { id: 'Inter', name: 'Inter', style: 'Modern & Clean (Default for SaaS)' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', style: 'Crisp & Sophisticated' },
  { id: 'Outfit', name: 'Outfit', style: 'Friendly Geometric Curve' },
  { id: 'DM Sans', name: 'DM Sans', style: 'Warm Humanist Feel' },
  { id: 'Space Mono', name: 'Space Mono', style: 'Developer & Technical Aesthetic' },
  { id: 'system-ui', name: 'System Default', style: 'Native OS font stack' }
];

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  businessName: "Summit Heating & Air",
  industry: "HVAC & Plumbing",
  receptionistName: "Kelly",
  receptionistTitle: "AI Service Coordinator",
  welcomeGreeting: "Welcome to Summit Heating & Air. Need urgent repairs, maintenance, or an estimate on your system?",
  placeholderText: "Type your question or describe your issue...",
  primaryColor: "#4f46e5",
  textColor: "#0f172a",
  headerTextColor: "#ffffff",
  bubbleColorUser: "#4f46e5",
  bubbleColorAi: "#f1f5f9",
  fontFamily: "Inter",
  borderRadius: "rounded",
  position: "bottom-right",
  offsetY: 24,
  offsetX: 24,
  iconType: "bot",
  customIconUrl: "",
  customAvatarUrl: "",
  showEmergencyBanner: true,
  soundEnabled: true,
  enableQuickChips: true,
  quickChips: [
    "AC is blowing warm air",
    "Heater won't turn on",
    "Do you offer 24/7 emergency service?",
    "Get an upfront repair quote"
  ],
  knowledgeBase: INDUSTRY_PRESETS[0].knowledgeBase,
};
