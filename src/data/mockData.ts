import { CreatorProfile, BusinessProfile, Project, Opportunity, Transaction, AppNotification } from '../types';

export const INITIAL_CREATOR: CreatorProfile = {
  id: 'c-001',
  name: 'Ace Believer',
  username: '@acebeliever',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Viral African comedy creator & storyteller. Transforming everyday Zambian life into laugh-out-loud skits. 15M+ views across socials.',
  category: 'Comedy & Acting',
  location: 'Lusaka, Zambia',
  countryFlag: '🇿🇲',
  followers: 2420,
  following: 48,
  rating: 4.9,
  completedJobs: 14,
  totalEarnings: 4750,
  availableBalance: 1250,
  pendingBalance: 500,
  isVerified: true,
  services: [
    {
      id: 'srv-1',
      title: 'Viral Brand Comedy Skit',
      rate: 'K1,200',
      description: 'Custom 45-60s narrative skit featuring your product naturally integrated into high-retention comedy.'
    },
    {
      id: 'srv-2',
      title: 'Restaurant / Venue Review Video',
      rate: 'K850',
      description: 'Energetic on-location walkthrough, taste-test humor, and call-to-action for Lusaka foodies.'
    },
    {
      id: 'srv-3',
      title: 'Audio Voiceover & Character Acting',
      rate: 'K500',
      description: 'Radio/TikTok voice character delivery in authentic Zambian English, Bemba, and Nyanja inflections.'
    }
  ],
  portfolioVideos: [
    {
      id: 'pv-1',
      title: 'Village vs Town: Smart TV Trauma',
      views: '482K',
      thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
      duration: '0:58'
    },
    {
      id: 'pv-2',
      title: 'Just a Like (Caught at 2 AM)',
      views: '890K',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      duration: '0:45'
    },
    {
      id: 'pv-3',
      title: 'Zambian Weddings vs Reality',
      views: '1.2M',
      thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      duration: '1:12'
    }
  ]
};

export const INITIAL_BUSINESS: BusinessProfile = {
  id: 'b-101',
  name: 'Hungry Lion Lusaka',
  logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
  category: 'Fast Casual Dining',
  location: 'Manda Hill Mall, Lusaka',
  description: 'Zambia’s favorite fried chicken. We love collaborating with authentic local storytellers who make our customers laugh and crave crunch.',
  activeCampaignsCount: 3,
  totalSpent: 45000,
  rating: 4.8,
  reviewsCount: 32
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Just a Like',
    type: 'script',
    category: 'Couple Comedy',
    createdAt: 'Today, 9:32 AM',
    status: 'Ready',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    summary: 'A boyfriend gets caught double-tapping an ex-classmate\'s photo at 2 AM.'
  },
  {
    id: 'proj-2',
    title: 'Village vs Town (The Escalator)',
    type: 'idea',
    category: 'Village Comedy',
    createdAt: 'Yesterday, 6:14 PM',
    status: 'Draft',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    summary: 'Uncle attempts to step onto Cairo Road mall escalator while blessing it with holy water.'
  },
  {
    id: 'proj-3',
    title: 'Office Drama: 4:59 PM Task',
    type: 'script',
    category: 'Workplace Comedy',
    createdAt: 'Yesterday, 2:20 PM',
    status: 'In Production',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
    summary: 'Trying to sneak past boss\'s office with car keys already jangling.'
  },
  {
    id: 'proj-4',
    title: 'Love Confession at the Bus Stop',
    type: 'idea',
    category: 'Love & Romance',
    createdAt: 'Aug 12, 2026',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    summary: 'Complicated romantic proposal while conductor shouts "Town! Town! Two seats remaining!"'
  },
  {
    id: 'proj-5',
    title: 'Family Problems: Auntie in Town',
    type: 'script',
    category: 'Family Comedy',
    createdAt: 'Aug 10, 2026',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    summary: 'Auntie inspects the fridge and asks why there are only eggs and energy drinks.'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    businessName: 'Hungry Lion Lusaka',
    businessLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    title: 'Funny Restaurant Advertisement Skit',
    description: 'Create a hilarious 45-second TikTok/Reels comedy video showcasing the unbeatable crunch of our 8-piece Wing Bucket with friends.',
    category: 'Food & Beverage',
    budget: 500,
    deadline: '5 days left',
    location: 'Lusaka, Zambia',
    requirements: ['High video resolution', 'Authentic comedy', 'Must show product bucket naturally', 'Post on TikTok & tag @HungryLionZM'],
    spotsAvailable: 3,
    applicantsCount: 14,
    featured: true
  },
  {
    id: 'opp-2',
    businessName: 'Airtel Money Zambia',
    businessLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    title: 'Street Cashless Pay Challenge Skit',
    description: 'Depict a funny moment where a market vendor rejects physical paper notes and forces everyone to "tap that QR code".',
    category: 'Fintech & Apps',
    budget: 1500,
    deadline: '7 days left',
    location: 'All Zambia (Remote or Street)',
    requirements: ['Relatable market setting', 'Show instant notification sound', 'Comedy & high energy'],
    spotsAvailable: 2,
    applicantsCount: 28,
    featured: true
  },
  {
    id: 'opp-3',
    businessName: 'Zambezi Glow Cosmetics',
    businessLogo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
    title: 'Couples Skincare Humor Review',
    description: 'Boyfriend steals girlfriend’s luxury glow serum thinking it was shaving cream. Hilarious before and after reaction.',
    category: 'Beauty & Lifestyle',
    budget: 1200,
    deadline: '3 days left',
    location: 'Kitwe or Lusaka',
    requirements: ['Natural lighting', 'Humorous couple banter', 'Product close-up shot'],
    spotsAvailable: 1,
    applicantsCount: 9
  },
  {
    id: 'opp-4',
    businessName: 'Lusaka Fitness Hub',
    businessLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80',
    title: 'First Day at the Gym Struggles',
    description: 'Comedy creator documenting the hilarious pain of leg day after bragging to gym buddies.',
    category: 'Fitness & Health',
    budget: 750,
    deadline: '10 days left',
    location: 'Lusaka East',
    requirements: ['Film inside facility', 'Lighthearted comedy', 'Gym membership call-out'],
    spotsAvailable: 4,
    applicantsCount: 19
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    title: 'Campaign Payout: Hungry Lion Skit',
    businessOrClient: 'Hungry Lion Lusaka',
    amount: 500,
    type: 'payout',
    method: 'Airtel Money',
    date: 'Today, 11:20 AM',
    status: 'Completed'
  },
  {
    id: 'tx-102',
    title: 'Advance Deposit: Fintech Promo',
    businessOrClient: 'Airtel Money Zambia',
    amount: 750,
    type: 'payout',
    method: 'MTN MoMo',
    date: 'Sep 24, 2026',
    status: 'Completed'
  },
  {
    id: 'tx-103',
    title: 'Mobile Money Withdrawal',
    businessOrClient: 'Transferred to +260 97 1234567',
    amount: 1500,
    type: 'withdrawal',
    method: 'Airtel Money',
    date: 'Sep 20, 2026',
    status: 'Completed'
  },
  {
    id: 'tx-104',
    title: 'Milestone 2: Zambezi Glow Review',
    businessOrClient: 'Zambezi Glow Cosmetics',
    amount: 500,
    type: 'payout',
    method: 'Bank Transfer',
    date: 'Sep 18, 2026',
    status: 'Pending'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Application Accepted! 🎉',
    message: 'Hungry Lion approved your pitch for "Funny Restaurant Advertisement Skit". Contract active: K500.',
    time: '20m ago',
    type: 'opportunity',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Payment Credited 💰',
    message: 'K500 deposited into your Available Balance from Hungry Lion Lusaka.',
    time: '2h ago',
    type: 'payment',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'New Campaign Match',
    message: 'Airtel Money posted "Street Cashless Pay Challenge" with budget K1,500.',
    time: 'Yesterday',
    type: 'opportunity',
    isRead: true
  },
  {
    id: 'notif-4',
    title: 'Script Saved',
    message: '"Just a Like" script has been formatted and ready for scene breakdown.',
    time: '2 days ago',
    type: 'system',
    isRead: true
  }
];

export const CREATOR_CATEGORIES = [
  {
    id: 'cat-comedy',
    title: 'Comedy',
    emoji: '😂',
    color: '#8B5CF6',
    gradient: 'from-purple-600 to-indigo-700',
    description: 'Couple drama, village vs town, street pranks, relatable African skits.',
    subcategories: ['Couple Comedy', 'Boyfriend vs Girlfriend', 'Village vs Town', 'Workplace Comedy', 'Family Comedy', 'Zambian Slang', 'Church Humor']
  },
  {
    id: 'cat-love',
    title: 'Love & Romance',
    emoji: '❤️',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-600',
    description: 'Dating red flags, romantic surprises, awkward dates, anniversary ideas.',
    subcategories: ['First Date Chaos', 'Talking Stage', 'Dating Red Flags', 'Unexpected Proposals', 'Long Distance']
  },
  {
    id: 'cat-acting',
    title: 'Acting & Skits',
    emoji: '🎭',
    color: '#3B82F6',
    gradient: 'from-blue-600 to-cyan-700',
    description: 'Dramatic short skits, monologues, character transformations.',
    subcategories: ['Dramatic Plot Twist', 'Courtroom Drama', 'Hero vs Villain', 'Undercover Boss']
  },
  {
    id: 'cat-music',
    title: 'Music & Afrobeat',
    emoji: '🎵',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Song concepts, dance challenges, music video storytelling.',
    subcategories: ['Afrobeat Concept', 'Amapiano Drop Story', 'Gospel Skit', 'Studio Session Parody']
  },
  {
    id: 'cat-dance',
    title: 'Dance & Trends',
    emoji: '💃',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-700',
    description: 'High-energy dance transitions, crowd challenges, viral routines.',
    subcategories: ['Street Dance Challenge', 'Viral Transition', 'Cultural Dance Fusion']
  },
  {
    id: 'cat-education',
    title: 'Education & Tips',
    emoji: '📚',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-blue-600',
    description: 'Bite-sized life hacks, financial literacy, creator career advice.',
    subcategories: ['Creator Money Tips', 'Smartphone Videography', 'Side Hustles in Africa']
  },
  {
    id: 'cat-business',
    title: 'Business & Ads',
    emoji: '🍔',
    color: '#F97316',
    gradient: 'from-orange-500 to-red-600',
    description: 'Commercial brand skits, product launches, customer testimonials.',
    subcategories: ['Fast Food Promo', 'Fintech Skit', 'Fashion Brand Reel', 'Salon & Barber Skit']
  },
  {
    id: 'cat-gaming',
    title: 'Gaming & Memes',
    emoji: '🎮',
    color: '#8B5CF6',
    gradient: 'from-violet-600 to-purple-800',
    description: 'Gamer reactions, funny glitches, voice troll comedy.',
    subcategories: ['Mobile Gaming Fails', 'FIFA Rage Moments', 'African Parents vs Games']
  },
  {
    id: 'cat-films',
    title: 'Short Films',
    emoji: '🎥',
    color: '#EF4444',
    gradient: 'from-rose-600 to-red-700',
    description: 'Cinematic micro-dramas, suspense thrillers, festival shorts.',
    subcategories: ['Suspense Thriller', 'Sci-Fi in Lusaka', 'Heist & Chase', 'Heartwarming Drama']
  },
  {
    id: 'cat-lifestyle',
    title: 'Lifestyle & Vlogs',
    emoji: '📱',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-blue-600',
    description: 'Day-in-the-life, African street markets, fashion transformations.',
    subcategories: ['Day in Lusaka', 'Market Bargaining', 'OOTD Fashion Reveal', 'Morning Routine']
  }
];
