import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  onValue, 
  off,
  push, 
  child,
  update
} from 'firebase/database';
import { Party, Player } from '../types/game';

const firebaseConfig = {
  apiKey: "AIzaSyBWvQL7cxJZ1Z3ebYkSL7PxFtvHASmS7Rg",
  authDomain: "friendsgiving-a225a.firebaseapp.com",
  projectId: "friendsgiving-a225a",
  storageBucket: "friendsgiving-a225a.firebasestorage.app",
  messagingSenderId: "705351119540",
  appId: "1:705351119540:web:78c593a151b0c077215de1",
  measurementId: "G-8R4QEVRYJT",
  databaseURL: "https://friendsgiving-a225a-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

type PartyStoreListener = (party: Party) => void;
const listeners = new Map<string, Set<PartyStoreListener>>();

interface Updates {
  [key: string]: any;
}

export const partyStore = {
  createParty(party: Party) {
    set(ref(db, `parties/${party.code}`), party)
      .then(() => {
        console.log(`[PartyStore] Party created with code: ${party.code}`, party);
        this.notifyListeners(party.code);
      })
      .catch(error => {
        console.error(`[PartyStore] Error creating party: ${error}`);
      });
  },

  async getParty(code: string): Promise<Party | undefined> {
    try {
      const snapshot = await get(ref(db, `parties/${code}`));
      return snapshot.val();
    } catch (error) {
      console.error(`[PartyStore] Error getting party: ${error}`);
      return undefined;
    }
  },

  updateParty(code: string, party: Party) {
    set(ref(db, `parties/${code}`), party)
      .then(() => {
        console.log(`[PartyStore] Party updated: ${code}`, party);
      })
      .catch(error => {
        console.error(`[PartyStore] Error updating party: ${error}`);
      });
  },

  addPlayer(code: string, player: Player) {
    const updates: Updates = {};
    updates[`parties/${code}/players/${player.id}`] = player;
    
    update(ref(db), updates)
      .then(() => {
        console.log(`[PartyStore] Player added to party: ${code}`, player);
      })
      .catch(error => {
        console.error(`[PartyStore] Error adding player: ${error}`);
      });
  },

  subscribe(code: string, listener: PartyStoreListener) {
    if (!listeners.has(code)) {
      listeners.set(code, new Set());
    }
    listeners.get(code)?.add(listener);

    const partyRef = ref(db, `parties/${code}`);
    onValue(partyRef, (snapshot) => {
      const party = snapshot.val();
      if (party) {
        listener(party);
      }
    });

    console.log(`[PartyStore] Subscribed listener to party code: ${code}`);
  },

  unsubscribe(code: string, listener: PartyStoreListener) {
    listeners.get(code)?.delete(listener);
    const partyRef = ref(db, `parties/${code}`);
    off(partyRef);
    console.log(`[PartyStore] Unsubscribed listener from party code: ${code}`);
  },

  notifyListeners(code: string) {
    this.getParty(code).then(party => {
      if (party) {
        console.log(`[PartyStore] Notifying listeners for party code: ${code}`, party);
        listeners.get(code)?.forEach(listener => listener(party));
      } else {
        console.error(`[PartyStore] No party found to notify for code: ${code}`);
      }
    });
  }
};