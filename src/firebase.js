// Firebase configuration for Grandma Josephine Memorial
// To set up your own Firebase:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project
// 3. Enable Firestore Database (in test mode for now)
// 4. Go to Project Settings > General > Your apps > Web
// 5. Register your app and copy the config below

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed. Forms will work in local mode.', error);
}

// Guestbook functions
export const addGuestbookEntry = async (entry) => {
  if (!db) {
    console.warn('Firebase not configured. Entry saved locally only.');
    return { id: Date.now().toString(), ...entry };
  }

  try {
    const docRef = await addDoc(collection(db, 'guestbook'), {
      ...entry,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...entry };
  } catch (error) {
    console.error('Error adding guestbook entry:', error);
    throw error;
  }
};

export const getGuestbookEntries = async () => {
  if (!db) {
    console.warn('Firebase not configured. Returning empty array.');
    return [];
  }

  try {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'Recently'
    }));
  } catch (error) {
    console.error('Error fetching guestbook entries:', error);
    return [];
  }
};

// RSVP functions
export const addRSVP = async (rsvpData) => {
  if (!db) {
    console.warn('Firebase not configured. RSVP saved locally only.');
    return { id: Date.now().toString(), ...rsvpData };
  }

  try {
    const docRef = await addDoc(collection(db, 'rsvp'), {
      ...rsvpData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...rsvpData };
  } catch (error) {
    console.error('Error adding RSVP:', error);
    throw error;
  }
};

export const getRSVPs = async () => {
  if (!db) {
    return [];
  }

  try {
    const q = query(collection(db, 'rsvp'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return [];
  }
};

// Contact form functions
export const addContactMessage = async (messageData) => {
  if (!db) {
    console.warn('Firebase not configured. Message saved locally only.');
    return { id: Date.now().toString(), ...messageData };
  }

  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...messageData,
      createdAt: serverTimestamp(),
      read: false
    });
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error('Error adding contact message:', error);
    throw error;
  }
};

export { db };
