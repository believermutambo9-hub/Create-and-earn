import React, { useState } from 'react';
import { 
  Screen, 
  Role, 
  CreatorProfile, 
  BusinessProfile, 
  Project, 
  Opportunity, 
  Transaction, 
  AppNotification,
  ScriptData 
} from './types';
import { 
  INITIAL_CREATOR, 
  INITIAL_BUSINESS, 
  INITIAL_PROJECTS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PhoneFrame } from './components/PhoneFrame';

// Screens
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CreateCategoriesScreen } from './components/screens/CreateCategoriesScreen';
import { IdeaGeneratorScreen } from './components/screens/IdeaGeneratorScreen';
import { ScriptGeneratorScreen } from './components/screens/ScriptGeneratorScreen';
import { SceneGeneratorScreen } from './components/screens/SceneGeneratorScreen';
import { CaptionGeneratorScreen } from './components/screens/CaptionGeneratorScreen';
import { ProjectsScreen } from './components/screens/ProjectsScreen';
import { OpportunitiesScreen } from './components/screens/OpportunitiesScreen';
import { EarningsScreen } from './components/screens/EarningsScreen';
import { CreatorProfileScreen } from './components/screens/CreatorProfileScreen';
import { BusinessProfileScreen } from './components/screens/BusinessProfileScreen';
import { MessagingScreen } from './components/screens/MessagingScreen';
import { PremiumScreen } from './components/screens/PremiumScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';

// Modals
import { NotificationsModal } from './components/modals/NotificationsModal';
import { SearchModal } from './components/modals/SearchModal';

export default function App() {
  // App Navigation State
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['home']);
  const [activeRole, setActiveRole] = useState<Role>('creator');
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // App Data States
  const [user, setUser] = useState<CreatorProfile>(INITIAL_CREATOR);
  const [business, setBusiness] = useState<BusinessProfile>(INITIAL_BUSINESS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Cross-screen contextual state
  const [selectedCategoryForGen, setSelectedCategoryForGen] = useState<string>('Couple Comedy');
  const [selectedIdeaForScript, setSelectedIdeaForScript] = useState<any>(null);
  const [selectedScriptForScenes, setSelectedScriptForScenes] = useState<ScriptData | undefined>(undefined);
  const [captionTopic, setCaptionTopic] = useState<string>('');
  const [targetBusinessName, setTargetBusinessName] = useState<string>('Hungry Lion Lusaka');

  // Modals state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Navigation handlers
  const navigateTo = (screen: Screen) => {
    if (screen !== currentScreen) {
      setScreenHistory((prev) => [...prev, currentScreen]);
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory((old) => old.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('home');
    }
  };

  // Handlers for Idea -> Script -> Scene -> Caption flow
  const handleQuickCategorySelect = (categoryName: string, targetTool?: Screen) => {
    setSelectedCategoryForGen(categoryName);
    if (targetTool) {
      navigateTo(targetTool);
    } else {
      navigateTo('idea-generator');
    }
  };

  const handleCreateScriptFromIdea = (ideaData: any) => {
    setSelectedIdeaForScript(ideaData);
    navigateTo('script-generator');
  };

  const handleGenerateScenesFromScript = (scriptData: ScriptData) => {
    setSelectedScriptForScenes(scriptData);
    navigateTo('scene-generator');
  };

  // Save Project Handler
  const handleSaveProject = (projectPartial: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: projectPartial.title || 'Untitled Project',
      type: projectPartial.type || 'idea',
      category: projectPartial.category || 'Comedy',
      createdAt: 'Just now',
      status: projectPartial.status || 'Ready',
      thumbnail: projectPartial.thumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      summary: projectPartial.summary || '',
      content: projectPartial.content,
    };
    setProjects([newProj, ...projects]);
  };

  const handleDuplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} (Copy)`,
      createdAt: 'Just now',
    };
    setProjects([duplicated, ...projects]);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  // Opportunities Handlers
  const handleApplyOpportunity = (oppId: string, pitchData: any) => {
    setOpportunities(
      opportunities.map((o) =>
        o.id === oppId
          ? { ...o, hasApplied: true, applicantsCount: o.applicantsCount + 1 }
          : o
      )
    );

    // Add notification
    const matched = opportunities.find((o) => o.id === oppId);
    if (matched) {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Application Sent! 🚀',
        message: `Your pitch for "${matched.title}" (K${matched.budget}) has been received by ${matched.businessName}.`,
        time: 'Just now',
        type: 'opportunity',
        isRead: false,
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  const handleSaveOpportunity = (oppId: string) => {
    setOpportunities(
      opportunities.map((o) =>
        o.id === oppId ? { ...o, isSaved: !o.isSaved } : o
      )
    );
  };

  const handlePostCampaign = (campaignData: Partial<Opportunity>) => {
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      businessName: campaignData.businessName || 'Verified Brand',
      businessLogo: campaignData.businessLogo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      title: campaignData.title || 'Brand Video Campaign',
      description: campaignData.description || '',
      category: campaignData.category || 'General',
      budget: campaignData.budget || 500,
      deadline: campaignData.deadline || '7 days left',
      location: campaignData.location || 'Lusaka, Zambia',
      requirements: campaignData.requirements || ['High quality video', 'Authentic comedy'],
      spotsAvailable: campaignData.spotsAvailable || 2,
      applicantsCount: 0,
      featured: true,
    };
    setOpportunities([newOpp, ...opportunities]);
  };

  // Financial Withdrawal Handler
  const handleWithdrawFunds = (amount: number, method: string, accountDetails: string) => {
    setUser((prev) => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Mobile Money Withdrawal (${accountDetails})`,
      businessOrClient: `Transferred to ${accountDetails}`,
      amount: amount,
      type: 'withdrawal',
      method: method as any,
      date: 'Just now',
      status: 'Completed',
    };
    setTransactions([newTx, ...transactions]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Withdrawal Successful 💸',
      message: `K${amount} sent to your ${method} account. Funds should reflect in 5 minutes.`,
      time: 'Just now',
      type: 'payment',
      isRead: false,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleAcceptOffer = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      pendingBalance: prev.pendingBalance + amount,
    }));
  };

  const handleSubscribe = (plan: string) => {
    setUser((prev) => ({
      ...prev,
      isVerified: true,
    }));
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'PRO Subscription Active! 👑',
      message: `You're now on CREATE & EARN PRO (${plan}). Unlimited AI tools unlocked!`,
      time: 'Just now',
      type: 'system',
      isRead: false,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleSelectBusiness = (businessName: string) => {
    setTargetBusinessName(businessName);
    navigateTo('business-profile');
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <PhoneFrame isFrameActive={isDeviceFrame}>
      {/* Welcome Screen has its own standalone full-bleed hero */}
      {currentScreen === 'welcome' ? (
        <WelcomeScreen
          onGetStarted={() => navigateTo('home')}
          onLogin={() => navigateTo('home')}
        />
      ) : (
        <>
          {/* Global Header */}
          <Header
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            onBack={handleBack}
            user={user}
            notifications={notifications}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            activeRole={activeRole}
            onChangeRole={(role) => setActiveRole(role)}
            isDeviceFrame={isDeviceFrame}
            onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
          />

          {/* Screen Content Switcher */}
          <div className="flex-1 flex flex-col">
            {currentScreen === 'home' && (
              <HomeScreen
                user={user}
                projects={projects}
                opportunities={opportunities}
                onNavigate={navigateTo}
                onSelectProject={(proj) => {
                  if (proj.type === 'script') {
                    setSelectedScriptForScenes(proj.content);
                    navigateTo('script-generator');
                  } else if (proj.type === 'scene') {
                    navigateTo('scene-generator');
                  } else {
                    navigateTo('idea-generator');
                  }
                }}
                onSelectOpportunity={(opp) => {
                  navigateTo('opportunities');
                }}
                onQuickCategory={handleQuickCategorySelect}
              />
            )}

            {currentScreen === 'create-hub' && (
              <CreateCategoriesScreen
                onSelectCategory={handleQuickCategorySelect}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'idea-generator' && (
              <IdeaGeneratorScreen
                initialCategory={selectedCategoryForGen}
                onSaveToProjects={handleSaveProject}
                onCreateScriptWithIdea={handleCreateScriptFromIdea}
              />
            )}

            {currentScreen === 'script-generator' && (
              <ScriptGeneratorScreen
                initialIdea={selectedIdeaForScript}
                onSaveProject={handleSaveProject}
                onGenerateScenes={handleGenerateScenesFromScript}
              />
            )}

            {currentScreen === 'scene-generator' && (
              <SceneGeneratorScreen
                initialScript={selectedScriptForScenes}
                onSaveProject={handleSaveProject}
              />
            )}

            {currentScreen === 'caption-generator' && (
              <CaptionGeneratorScreen
                initialDescription={captionTopic}
                onSaveProject={handleSaveProject}
              />
            )}

            {currentScreen === 'projects' && (
              <ProjectsScreen
                projects={projects}
                onOpenProject={(proj) => {
                  if (proj.type === 'script') {
                    setSelectedScriptForScenes(proj.content);
                    navigateTo('script-generator');
                  } else if (proj.type === 'scene') {
                    navigateTo('scene-generator');
                  } else if (proj.type === 'caption') {
                    navigateTo('caption-generator');
                  } else {
                    navigateTo('idea-generator');
                  }
                }}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                onNewProject={() => navigateTo('create-hub')}
              />
            )}

            {currentScreen === 'opportunities' && (
              <OpportunitiesScreen
                opportunities={opportunities}
                activeRole={activeRole}
                onApply={handleApplyOpportunity}
                onSaveOpportunity={handleSaveOpportunity}
                onPostCampaign={handlePostCampaign}
                onSelectBusiness={handleSelectBusiness}
              />
            )}

            {currentScreen === 'earnings' && (
              <EarningsScreen
                user={user}
                transactions={transactions}
                onWithdraw={handleWithdrawFunds}
              />
            )}

            {currentScreen === 'profile' && (
              <CreatorProfileScreen
                user={user}
                onNavigate={navigateTo}
                onContact={() => navigateTo('messaging')}
                onUpdateBio={(bio) => setUser({ ...user, bio })}
              />
            )}

            {currentScreen === 'business-profile' && (
              <BusinessProfileScreen
                business={business}
                activeCampaigns={opportunities.filter(
                  (o) => o.businessName.toLowerCase() === targetBusinessName.toLowerCase()
                )}
                onApplyOpportunity={(opp) => {
                  navigateTo('opportunities');
                }}
                onMessageBusiness={() => navigateTo('messaging')}
                onBack={handleBack}
              />
            )}

            {currentScreen === 'messaging' && (
              <MessagingScreen
                user={user}
                onBack={handleBack}
                onAcceptOffer={handleAcceptOffer}
              />
            )}

            {currentScreen === 'premium' && (
              <PremiumScreen
                onSubscribe={handleSubscribe}
                onBack={handleBack}
              />
            )}

            {currentScreen === 'admin' && (
              <AdminDashboardScreen
                opportunities={opportunities}
                transactions={transactions}
                onBack={() => navigateTo('home')}
              />
            )}
          </div>

          {/* Fixed Mobile Bottom Navigation Bar */}
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            pendingEarningsCount={user.pendingBalance > 0 ? 1 : 0}
          />
        </>
      )}

      {/* Overlays */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllRead}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projects}
        opportunities={opportunities}
        onSelectProject={(proj) => {
          navigateTo('projects');
        }}
        onSelectOpportunity={(opp) => {
          navigateTo('opportunities');
        }}
        onSelectCategory={(cat) => {
          handleQuickCategorySelect(cat);
        }}
      />
    </PhoneFrame>
  );
}
