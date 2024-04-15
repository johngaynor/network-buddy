import { create } from "zustand";

interface AppState {
  contacts: Contact[] | [];
  setContacts: (contacts: Contact[]) => void;
}

const useStore = create<AppState>()((set) => ({
  contacts: [],
  setContacts: (contacts: Contact[]) => set({ contacts }),
}));

export const useContacts = () => useStore((state) => state.contacts);
export const useSetContacts = () => useStore((state) => state.setContacts);
