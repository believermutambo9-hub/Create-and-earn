export type Role = 'creator' | 'business' | 'admin';

export type Screen = 
  | 'welcome'
  | 'home'
  | 'create-hub'
  | 'idea-generator'
  | 'script-generator'
  | 'scene-generator'
  | 'caption-generator'
  | 'projects'
  | 'opportunities'
  | 'earnings'
  | 'profile'
  | 'business-profile'
  | 'messaging'
  | 'premium'
  | 'admin';

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  bio: string;
  category: string;
  location: string;
  countryFlag: string;
  followers: number;
  following: number;
  rating: number;
  completedJobs: number;
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  isVerified: boolean;
  role?: Role;
  mobileMoneyNumber?: string;
  mobileMoneyProvider?: string;
  services: {
    id: string;
    title: string;
    rate: string;
    description: string;
  }[];
  portfolioVideos: {
    id: string;
    title: string;
    views: string;
    thumbnail: string;
    duration: string;
  }[];
}

export interface BusinessProfile {
  id: string;
  name: string;
  logo: string;
  category: string;
  location: string;
  description: string;
  activeCampaignsCount: number;
  totalSpent: number;
  rating: number;
  reviewsCount: number;
}

export interface Project {
  id: string;
  userId?: string;
  title: string;
  type: 'script' | 'idea' | 'scene' | 'caption';
  category: string;
  createdAt: string;
  status: 'Draft' | 'Ready' | 'In Production' | 'Completed';
  thumbnail: string;
  summary: string;
  content?: any;
}

export interface ScriptScene {
  sceneNumber: number;
  heading: string;
  location: string;
  duration: string;
  action: string;
  dialogue: string;
  expression: string;
  cameraCue: string;
}

export interface ScriptData {
  title: string;
  genre: string;
  duration: string;
  characters: string[];
  location: string;
  openingHook: string;
  scenes: ScriptScene[];
  punchline: string;
  ending: string;
}

export interface SceneShot {
  sceneNumber: number;
  title: string;
  location: string;
  characters: string;
  dialogue: string;
  facialExpression: string;
  bodyLanguage: string;
  cameraShot: string;
  cameraMovement: string;
  lighting: string;
  soundSuggestion: string;
  estimatedDuration: string;
}

export interface Opportunity {
  id: string;
  businessId?: string;
  businessName: string;
  businessLogo: string;
  title: string;
  description: string;
  category: string;
  budget: number; // in Zambian Kwacha (K)
  deadline: string;
  location: string;
  requirements: string[];
  spotsAvailable: number;
  applicantsCount: number;
  isSaved?: boolean;
  hasApplied?: boolean;
  featured?: boolean;
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
  selectedCreatorId?: string;
  selectedCreatorName?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  businessId?: string;
  businessName: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorCategory?: string;
  pitch: string;
  portfolioUrl?: string;
  proposedFee: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export interface Message {
  id: string;
  threadId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: 'creator' | 'business' | 'admin';
  receiverId: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
  projectRef?: string;
  isRead: boolean;
}

export interface Transaction {
  id: string;
  userId?: string;
  title: string;
  businessOrClient: string;
  amount: number;
  type: 'payout' | 'deposit' | 'withdrawal' | 'escrow_lock' | 'escrow_release';
  method: 'Airtel Money' | 'MTN MoMo' | 'Zamtel Kwacha' | 'Bank Transfer';
  phone?: string;
  reference?: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Processing' | 'Failed';
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  time: string;
  type: 'opportunity' | 'message' | 'payment' | 'system';
  isRead: boolean;
}
