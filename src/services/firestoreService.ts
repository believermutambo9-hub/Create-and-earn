import { 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc,
  deleteDoc, 
  query, 
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Project, 
  Opportunity, 
  Application, 
  Message, 
  Transaction, 
  AppNotification, 
  CreatorProfile 
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_MESSAGES 
} from '../data/mockData';

// -------------------------------------------------------------
// 1. Users
// -------------------------------------------------------------
export async function getUserProfile(userId: string): Promise<CreatorProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as CreatorProfile;
    }
  } catch (err) {
    console.warn('Error reading user profile from Firestore:', err);
  }
  return null;
}

export async function saveUserProfile(profile: CreatorProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'users', profile.id), profile, { merge: true });
  } catch (err) {
    console.error('Failed to save user profile to Firestore:', err);
  }
}

export async function updateUserBalances(
  userId: string, 
  deltaAvailable: number, 
  deltaPending: number,
  deltaTotalEarnings: number = 0
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as CreatorProfile;
      const newAvail = Math.max(0, (data.availableBalance || 0) + deltaAvailable);
      const newPending = Math.max(0, (data.pendingBalance || 0) + deltaPending);
      const newTotal = (data.totalEarnings || 0) + deltaTotalEarnings;
      await updateDoc(userRef, {
        availableBalance: newAvail,
        pendingBalance: newPending,
        totalEarnings: newTotal
      });
    }
  } catch (err) {
    console.error('Failed to update user balances in Firestore:', err);
  }
}

// -------------------------------------------------------------
// 2. Projects
// -------------------------------------------------------------
export async function fetchUserProjects(userId: string): Promise<Project[]> {
  try {
    const q = query(collection(db, 'projects'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
    }
  } catch (err) {
    console.warn('Firestore fetch projects error, using cached:', err);
  }
  return INITIAL_PROJECTS;
}

export async function saveProjectToFirestore(userId: string, project: Project): Promise<void> {
  try {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, { ...project, userId }, { merge: true });
  } catch (err) {
    console.error('Failed to save project to Firestore:', err);
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (err) {
    console.error('Failed to delete project from Firestore:', err);
  }
}

// -------------------------------------------------------------
// 3. Opportunities (Marketplace)
// -------------------------------------------------------------
export async function fetchOpportunities(): Promise<Opportunity[]> {
  try {
    const snapshot = await getDocs(collection(db, 'opportunities'));
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Opportunity));
    } else {
      // Seed default marketplace campaigns to Firestore on first run
      for (const opp of INITIAL_OPPORTUNITIES) {
        await setDoc(doc(db, 'opportunities', opp.id), opp);
      }
    }
  } catch (err) {
    console.warn('Firestore fetch opportunities error, falling back:', err);
  }
  return INITIAL_OPPORTUNITIES;
}

export async function saveOpportunityToFirestore(opp: Opportunity): Promise<void> {
  try {
    await setDoc(doc(db, 'opportunities', opp.id), opp, { merge: true });
  } catch (err) {
    console.error('Failed to save opportunity to Firestore:', err);
  }
}

export async function deleteOpportunityFromFirestore(oppId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'opportunities', oppId));
  } catch (err) {
    console.error('Failed to delete opportunity from Firestore:', err);
  }
}

// -------------------------------------------------------------
// 4. Job Applications
// -------------------------------------------------------------
export async function fetchApplicationsForOpportunity(oppId: string): Promise<Application[]> {
  try {
    const q = query(collection(db, 'applications'), where('opportunityId', '==', oppId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Application));
  } catch (err) {
    console.warn('Firestore fetch applications error:', err);
    return [];
  }
}

export async function fetchCreatorApplications(creatorId: string): Promise<Application[]> {
  try {
    const q = query(collection(db, 'applications'), where('creatorId', '==', creatorId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Application));
  } catch (err) {
    console.warn('Firestore fetch creator applications error:', err);
    return [];
  }
}

export async function submitApplicationToFirestore(app: Application): Promise<void> {
  try {
    await setDoc(doc(db, 'applications', app.id), app, { merge: true });
    // Increment applicantsCount on the opportunity
    const oppRef = doc(db, 'opportunities', app.opportunityId);
    const oppSnap = await getDoc(oppRef);
    if (oppSnap.exists()) {
      const currentCount = oppSnap.data().applicantsCount || 0;
      await updateDoc(oppRef, { applicantsCount: currentCount + 1 });
    }
  } catch (err) {
    console.error('Failed to submit application to Firestore:', err);
  }
}

export async function updateApplicationStatusInFirestore(
  appId: string, 
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
): Promise<void> {
  try {
    await updateDoc(doc(db, 'applications', appId), { status });
  } catch (err) {
    console.error('Failed to update application status:', err);
  }
}

// -------------------------------------------------------------
// 5. Messages & Offers
// -------------------------------------------------------------
export function subscribeToMessages(
  userId: string, 
  onUpdate: (messages: Message[]) => void
) {
  try {
    const q = collection(db, 'messages');
    return onSnapshot(
      q, 
      (snapshot) => {
        if (!snapshot.empty) {
          const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message));
          // Sort chronologically
          msgs.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
          onUpdate(msgs);
        } else {
          onUpdate(INITIAL_MESSAGES);
        }
      },
      (error) => {
        console.warn('Messages snapshot listener handled warning:', error);
        onUpdate(INITIAL_MESSAGES);
      }
    );
  } catch (err) {
    console.warn('Firestore messages subscribe error, fallback to mock:', err);
    onUpdate(INITIAL_MESSAGES);
    return () => {};
  }
}

export async function sendMessageToFirestore(msg: Message): Promise<void> {
  try {
    await setDoc(doc(db, 'messages', msg.id), msg, { merge: true });
  } catch (err) {
    console.error('Failed to send message to Firestore:', err);
  }
}

export async function updateOfferStatusInFirestore(
  msgId: string, 
  status: 'accepted' | 'declined'
): Promise<void> {
  try {
    await updateDoc(doc(db, 'messages', msgId), { offerStatus: status });
  } catch (err) {
    console.error('Failed to update offer status:', err);
  }
}

// -------------------------------------------------------------
// 6. Transactions & Ledger
// -------------------------------------------------------------
export async function fetchUserTransactions(userId: string): Promise<Transaction[]> {
  try {
    const q = query(collection(db, 'transactions'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
    }
  } catch (err) {
    console.warn('Firestore fetch transactions error, using defaults:', err);
  }
  return [];
}

export async function saveTransactionToFirestore(userId: string, tx: Transaction): Promise<void> {
  try {
    await setDoc(doc(db, 'transactions', tx.id), { ...tx, userId }, { merge: true });
  } catch (err) {
    console.error('Failed to save transaction to Firestore:', err);
  }
}
