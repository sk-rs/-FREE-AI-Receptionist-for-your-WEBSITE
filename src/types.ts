export type IconType = 'message' | 'bot' | 'headset' | 'sparkles' | 'phone' | 'custom';
export type WidgetPosition = 'bottom-right' | 'bottom-left';
export type BorderRadiusType = 'sharp' | 'rounded' | 'soft';
export type FontFamilyType = 'Inter' | 'Plus Jakarta Sans' | 'Outfit' | 'DM Sans' | 'Space Mono' | 'system-ui';

export interface KnowledgeBaseItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface WidgetConfig {
  businessName: string;
  industry: string;
  receptionistName: string;
  receptionistTitle: string;
  welcomeGreeting: string;
  placeholderText: string;
  primaryColor: string;
  textColor: string;
  headerTextColor: string;
  bubbleColorUser: string;
  bubbleColorAi: string;
  fontFamily: FontFamilyType;
  borderRadius: BorderRadiusType;
  position: WidgetPosition;
  offsetY: number;
  offsetX: number;
  iconType: IconType;
  customIconUrl: string;
  customAvatarUrl: string;
  showEmergencyBanner: boolean;
  soundEnabled: boolean;
  enableQuickChips: boolean;
  quickChips: string[];
  knowledgeBase: KnowledgeBaseItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ExtractedLead {
  name: string | null;
  phone: string | null;
  email: string | null;
  issueSummary: string | null;
  isEmergency: boolean;
  status: 'active' | 'qualified';
}

export interface KeyPoolInfo {
  totalKeys: number;
  hasKey: boolean;
  activePool: { index: number; masked: string; isCoolingDown: boolean }[];
  cyclingSupported: boolean;
  hint: string;
}
