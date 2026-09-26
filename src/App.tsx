import React, { useState, useEffect } from 'react';
import { 
  Screen, 
  Role, 
  CreatorProfile, 
  BusinessProfile, 
  Project, 
  Opportunity, 
  Application,
  Message,
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
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PhoneFrame } from './components/PhoneFrame';
import { useAuth } from './context/AuthContext';
import { 
  fetchUserProjects, 
  saveProjectToFirestore, 
  deleteProjectFromFirestore,
  fetchOpportunities, 
  saveOpportunityToFirestore, 
  deleteOpportunityFromFirestore,
  fetchCreatorApplications,
  fetchApplicationsForOpportunity,
  submitApplicationToFirestore,
  updateApplicationStatusInFirestore,
  subscribeToMessages,
  sendMessageToFirestore,
  updateOfferStatusInFirestore,
  fetchUserTransactions,
  saveTransactionToFirestore 
} from './services/firestoreService';

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
import { AuthModal } from './components/modals/AuthModal';
import { ApplyJobModal } from './components/modals/ApplyJobModal';
import { PostCampaignModal } from './components/modals/PostCampaignModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineNotice } from './components/OfflineNotice';

export default function App() {
  const { 
    firebaseUser, 
    currentUserProfile, 
    logOut, 
    updateProfileData, 
    adjustBalance 
  } = useAuth();

  // App Navigation State
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['home']);
  const [activeRole, setActiveRole] = useState<Role>('creator');
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // App Data States
  const [user, setUser] = useState<CreatorProfile>(currentUserProfile);
  const [business, setBusiness] = useState<BusinessProfile>(INITIAL_BUSINESS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);
  const [isPostCampaignModalOpen, setIsPostCampaignModalOpen] = useState(false);

  // Sync profile when auth state updates
  useEffect(() => {
    setUser(currentUserProfile);
    if (currentUserProfile.role) {
      setActiveRole(currentUserProfile.role);
    }

    if (firebaseUser) {
      // Fetch projects
      fetchUserProjects(firebaseUser.uid).then((projs) => {
        if (projs && projs.length > 0) setProjects(projs);
      });

      // Fetch applications submitted by this user
      fetchCreatorApplications(firebaseUser.uid).then((apps) => {
        if (apps && apps.length > 0) setApplications(apps);
      });

      // Fetch transactions
      fetchUserTransactions(firebaseUser.uid).then((txs) => {
        if (txs && txs.length > 0) setTransactions(txs);
      });
    }
  }, [currentUserProfile, firebaseUser]);

  // Load live marketplace opportunities from Firestore
  useEffect(() => {
    fetchOpportunities().then((opps) => {
      if (opps && opps.length > 0) {
        setOpportunities(opps);
      }
    });

    // Real-time messages listener
    const unsubscribeMessages = subscribeToMessages(
      firebaseUser?.uid || 'guest',
      (liveMsgs) => {
        if (liveMsgs && liveMsgs.length > 0) {
          setMessages(liveMsgs);
        }
      }
    );

    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [firebaseUser]);

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

  // Save Project Handler with Firestore persistence
  const handleSaveProject = async (projectPartial: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      userId: firebaseUser?.uid,
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

    if (firebaseUser) {
      await saveProjectToFirestore(firebaseUser.uid, newProj);
    }

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Project Saved! 💾',
      message: `"${newProj.title}" saved to your cloud projects.`,
      time: 'Just now',
      type: 'system',
      isRead: false,
    };
    setNotifications([notif, ...notifications]);
  };

  const handleDuplicateProject = async (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} (Copy)`,
      createdAt: 'Just now',
    };
    setProjects([duplicated, ...projects]);
    if (firebaseUser) {
      await saveProjectToFirestore(firebaseUser.uid, duplicated);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    await deleteProjectFromFirestore(projectId);
  };

  // Opportunities Handlers
  const handleApplyClick = (opportunity: Opportunity) => {
    setSelectedOppForApply(opportunity);
  };

  const handleApplicationSuccess = (newApp: Application) => {
    setApplications([newApp, ...applications]);
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === newApp.opportunityId
          ? { ...o, hasApplied: true, applicantsCount: o.applicantsCount + 1 }
          : o
      )
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Application Sent! 🚀',
      message: `Your pitch for "${newApp.opportunityTitle}" (K${newApp.proposedFee}) has been submitted.`,
      time: 'Just now',
      type: 'opportunity',
      isRead: false,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleSaveOpportunity = (oppId: string) => {
    setOpportunities(
      opportunities.map((o) =>
        o.id === oppId ? { ...o, isSaved: !o.isSaved } : o
      )
    );
  };

  const handlePostCampaignSuccess = (newOpp: Opportunity) => {
    setOpportunities([newOpp, ...opportunities]);
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Campaign Published! 📢',
      message: `"${newOpp.title}" is live on the Creator Marketplace.`,
      time: 'Just now',
      type: 'opportunity',
      isRead: false,
    };
    setNotifications([notif, ...notifications]);
  };

  // Business Action: Hire Creator & Lock Escrow
  const handleAcceptApplication = async (app: Application) => {
    await updateApplicationStatusInFirestore(app.id, 'accepted');
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: 'accepted' as const } : a))
    );

    // If current user is the creator, update pending balance
    if (firebaseUser && app.creatorId === firebaseUser.uid) {
      await adjustBalance(0, app.proposedFee);
    }

    // Create Escrow Lock transaction
    const tx: Transaction = {
      id: `tx-escrow-${Date.now()}`,
      userId: app.creatorId,
      title: `Escrow Locked: ${app.opportunityTitle}`,
      businessOrClient: app.businessName,
      amount: app.proposedFee,
      type: 'escrow_lock',
      method: 'Airtel Money',
      reference: `ESCROW-ZM-${Date.now().toString().slice(-6)}`,
      date: 'Just now',
      status: 'Pending',
    };
    setTransactions((prev) => [tx, ...prev]);
    if (firebaseUser) {
      await saveTransactionToFirestore(app.creatorId, tx);
    }

    // Send Message
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'business-lead',
      senderName: app.businessName,
      senderAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      senderRole: 'business',
      receiverId: app.creatorId,
      text: `Congratulations ${app.creatorName}! Your pitch has been accepted. K${app.proposedFee} is now secured in Escrow. Please start production!`,
      timestamp: 'Just now',
      isOffer: true,
      offerAmount: app.proposedFee,
      offerStatus: 'accepted',
      projectRef: app.opportunityTitle,
      isRead: true,
    };
    await sendMessageToFirestore(msg);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Hired & Escrow Locked! 🤝',
      message: `${app.businessName} hired you for K${app.proposedFee}. Funds secured in Escrow.`,
      time: 'Just now',
      type: 'opportunity',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Business Action: Mark Video Delivery Approved & Release Payment
  const handleCompleteJob = async (app: Application) => {
    await updateApplicationStatusInFirestore(app.id, 'completed');
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: 'completed' as const } : a))
    );

    // Transfer from pending to available
    if (firebaseUser && app.creatorId === firebaseUser.uid) {
      await adjustBalance(app.proposedFee, -app.proposedFee, app.proposedFee);
    }

    const tx: Transaction = {
      id: `tx-payout-${Date.now()}`,
      userId: app.creatorId,
      title: `Escrow Released: ${app.opportunityTitle}`,
      businessOrClient: app.businessName,
      amount: app.proposedFee,
      type: 'payout',
      method: 'Airtel Money',
      reference: `PAYOUT-ZM-${Date.now().toString().slice(-6)}`,
      date: 'Just now',
      status: 'Completed',
    };
    setTransactions((prev) => [tx, ...prev]);
    if (firebaseUser) {
      await saveTransactionToFirestore(app.creatorId, tx);
    }

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Payment Released! 💰',
      message: `${app.businessName} approved your video delivery! K${app.proposedFee} moved to your Available Balance.`,
      time: 'Just now',
      type: 'payment',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...notifications]);
  };

  // Financial Withdrawal Handler
  const handleWithdrawFunds = async (amount: number, method: string, accountDetails: string) => {
    if (amount > user.availableBalance) {
      alert(`Insufficient balance. Your available balance is K${user.availableBalance}.`);
      return;
    }

    await adjustBalance(-amount, 0);

    const refCode = `${method.toUpperCase().replace(/\s+/g, '')}-ZM-${Date.now().toString().slice(-6)}`;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: firebaseUser?.uid,
      title: `Payout to ${method} (${accountDetails})`,
      businessOrClient: accountDetails,
      amount: amount,
      type: 'withdrawal',
      method: method as any,
      phone: accountDetails,
      reference: refCode,
      date: 'Just now',
      status: 'Completed',
    };

    setTransactions([newTx, ...transactions]);
    if (firebaseUser) {
      await saveTransactionToFirestore(firebaseUser.uid, newTx);
    }

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Withdrawal Successful! 💸',
      message: `K${amount} paid to ${accountDetails} via ${method}. Ref: ${refCode}`,
      time: 'Just now',
      type: 'payment',
      isRead: false,
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Messaging Handlers
  const handleSendMessage = async (
    text: string, 
    isOffer: boolean = false, 
    offerAmount?: number, 
    projectRef?: string
  ) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id || 'creator-believer',
      senderName: user.name,
      senderAvatar: user.avatar,
      senderRole: activeRole,
      receiverId: 'business-lead',
      text,
      timestamp: 'Just now',
      isOffer,
      offerAmount,
      offerStatus: isOffer ? 'pending' : undefined,
      projectRef,
      isRead: true,
    };

    await sendMessageToFirestore(newMsg);
  };

  const handleAcceptMessageOffer = async (msgId: string, amount: number) => {
    await updateOfferStatusInFirestore(msgId, 'accepted');
    await adjustBalance(0, amount); // Add to pending balance in Escrow

    const tx: Transaction = {
      id: `tx-offer-${Date.now()}`,
      userId: user.id,
      title: 'Escrow Locked: Hungry Lion Skit Deal',
      businessOrClient: 'Hungry Lion Lusaka',
      amount: amount,
      type: 'escrow_lock',
      method: 'Airtel Money',
      reference: `ESCROW-ZM-${Date.now().toString().slice(-6)}`,
      date: 'Just now',
      status: 'Pending',
    };
    setTransactions((prev) => [tx, ...prev]);
    if (firebaseUser) {
      await saveTransactionToFirestore(user.id, tx);
    }

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Offer Accepted! 🔒',
      message: `K${amount} is locked in Escrow. Create and submit your video to receive payout!`,
      time: 'Just now',
      type: 'payment',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...notifications]);
  };

  const handleSubscribe = async (
    plan: string,
    details?: { method: string; amount: number; reference: string; phone: string }
  ) => {
    await updateProfileData({ isVerified: true });

    const amount = details?.amount || (plan === 'yearly' ? 399 : 49);
    const method = (details?.method as any) || 'Airtel Money';
    const reference = details?.reference || `CE-SUB-ZM-${Date.now().toString().slice(-6)}`;

    // Create a real transaction record in Firestore
    const subTx: Transaction = {
      id: `tx-sub-${Date.now()}`,
      userId: firebaseUser?.uid || user.id,
      title: `PRO Creator Subscription (${plan === 'yearly' ? 'Yearly' : 'Monthly'})`,
      businessOrClient: 'CREATE & EARN Platform',
      amount: amount,
      type: 'deposit',
      method: method,
      phone: details?.phone || user.mobileMoneyNumber,
      reference: reference,
      date: 'Just now',
      status: 'Completed',
    };

    setTransactions((prev) => [subTx, ...prev]);
    if (firebaseUser) {
      await saveTransactionToFirestore(firebaseUser.uid, subTx);
    }

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'PRO Subscription Active! 👑',
      message: `Paid K${amount} via ${method}. Unlimited AI tools unlocked! Ref: ${reference}`,
      time: 'Just now',
      type: 'payment',
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
          onGetStarted={() => {
            if (!firebaseUser) {
              setAuthModalMode('signup');
              setIsAuthModalOpen(true);
            } else {
              navigateTo('home');
            }
          }}
          onLogin={() => {
            if (!firebaseUser) {
              setAuthModalMode('signin');
              setIsAuthModalOpen(true);
            } else {
              navigateTo('home');
            }
          }}
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
            isLoggedIn={!!firebaseUser}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode || 'signin');
              setIsAuthModalOpen(true);
            }}
          />

          {/* Network & PWA Offline Status & Install Prompt */}
          <OfflineNotice />
          <PWAInstallBanner />

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
                  } else if (proj.type === 'caption') {
                    navigateTo('caption-generator');
                  } else {
                    navigateTo('idea-generator');
                  }
                }}
                onSelectOpportunity={(opp) => {
                  navigateTo('opportunities');
                }}
                onQuickCategory={(cat) => handleQuickCategorySelect(cat)}
              />
            )}

            {currentScreen === 'create-hub' && (
              <CreateCategoriesScreen
                onSelectCategory={(categoryName, targetTool) =>
                  handleQuickCategorySelect(categoryName, targetTool)
                }
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'idea-generator' && (
              <IdeaGeneratorScreen
                initialCategory={selectedCategoryForGen}
                onSaveToProjects={(idea: Partial<Project>) => handleSaveProject(idea)}
                onCreateScriptWithIdea={(ideaData: any) => handleCreateScriptFromIdea(ideaData)}
              />
            )}

            {currentScreen === 'script-generator' && (
              <ScriptGeneratorScreen
                initialIdea={selectedIdeaForScript}
                onSaveProject={(script: Partial<Project>) => handleSaveProject(script)}
                onGenerateScenes={(scriptData: ScriptData) => handleGenerateScenesFromScript(scriptData)}
              />
            )}

            {currentScreen === 'scene-generator' && (
              <SceneGeneratorScreen
                initialScript={selectedScriptForScenes}
                onSaveProject={(sceneProj: Partial<Project>) => handleSaveProject(sceneProj)}
              />
            )}

            {currentScreen === 'caption-generator' && (
              <CaptionGeneratorScreen
                initialDescription={captionTopic}
                onSaveProject={(capProj: Partial<Project>) => handleSaveProject(capProj)}
              />
            )}

            {currentScreen === 'projects' && (
              <ProjectsScreen
                projects={projects}
                onOpenProject={(proj: Project) => {
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
                applications={applications}
                activeRole={activeRole}
                onApply={handleApplyClick}
                onSaveOpportunity={handleSaveOpportunity}
                onPostCampaign={() => setIsPostCampaignModalOpen(true)}
                onSelectBusiness={handleSelectBusiness}
                onAcceptApplication={handleAcceptApplication}
                onCompleteJob={handleCompleteJob}
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
                onUpdateBio={(newBio) => updateProfileData({ bio: newBio })}
                onSaveProfile={async (up) => {
                  await updateProfileData(up);
                }}
                onLogOut={async () => {
                  await logOut();
                  navigateTo('welcome');
                }}
                onOpenAuth={(mode) => {
                  setAuthModalMode(mode || 'signin');
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {currentScreen === 'business-profile' && (
              <BusinessProfileScreen
                business={business}
                activeCampaigns={opportunities}
                onBack={handleBack}
                onMessageBusiness={() => navigateTo('messaging')}
                onApplyOpportunity={(opp: Opportunity) => handleApplyClick(opp)}
              />
            )}

            {currentScreen === 'messaging' && (
              <MessagingScreen
                user={user}
                activeRole={activeRole}
                messages={messages}
                onBack={handleBack}
                onSendMessage={handleSendMessage}
                onAcceptOffer={handleAcceptMessageOffer}
              />
            )}

            {currentScreen === 'premium' && (
              <PremiumScreen
                onSubscribe={handleSubscribe}
                onBack={handleBack}
                userEmail={user.email}
                userName={user.name}
              />
            )}

            {currentScreen === 'admin' && (
              <AdminDashboardScreen
                opportunities={opportunities}
                transactions={transactions}
                onBack={handleBack}
                onToggleVerify={async (cid, cur) => {
                  if (cid === user.id) {
                    await updateProfileData({ isVerified: !cur });
                  }
                }}
                onDeleteOpportunity={async (oppId) => {
                  await deleteOpportunityFromFirestore(oppId);
                  setOpportunities((prev) => prev.filter((o) => o.id !== oppId));
                }}
                onApproveEscrowRelease={async (tx) => {
                  const updated = transactions.map((t) => (t.id === tx.id ? { ...t, status: 'Completed' as const } : t));
                  setTransactions(updated);
                  if (tx.userId === user.id) {
                    await adjustBalance(tx.amount, -tx.amount, tx.amount);
                  }
                }}
              />
            )}
          </div>

          {/* Fixed Bottom Navigation */}
          <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} />
        </>
      )}

      {/* Global Modals */}
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
        onSelectProject={(proj: Project) => {
          setIsSearchOpen(false);
          if (proj.type === 'script') {
            setSelectedScriptForScenes(proj.content);
            navigateTo('script-generator');
          } else {
            navigateTo('projects');
          }
        }}
        onSelectOpportunity={(opp: Opportunity) => {
          setIsSearchOpen(false);
          navigateTo('opportunities');
        }}
        onSelectCategory={(cat: string) => {
          setIsSearchOpen(false);
          handleQuickCategorySelect(cat);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (currentScreen === 'welcome') {
            navigateTo('home');
          }
        }}
      />

      <ApplyJobModal
        isOpen={!!selectedOppForApply}
        opportunity={selectedOppForApply}
        user={user}
        onClose={() => setSelectedOppForApply(null)}
        onSuccess={handleApplicationSuccess}
      />

      <PostCampaignModal
        isOpen={isPostCampaignModalOpen}
        businessName={business.name}
        businessLogo={business.logo}
        onClose={() => setIsPostCampaignModalOpen(false)}
        onSuccess={handlePostCampaignSuccess}
      />
    </PhoneFrame>
  );
}
