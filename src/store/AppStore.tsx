import { create } from "zustand";
import type { Contact } from "contact";

interface AppState {
  contacts: Contact[] | [];
  setContacts: (contacts: Contact[]) => void;
  contactsLoading: boolean;
  setContactsLoading: (c: boolean) => void;
}

const useStore = create<AppState>()((set) => ({
  contacts: [],
  setContacts: (contacts: Contact[]) => set({ contacts }),
  contactsLoading: false,
  setContactsLoading: (c: boolean) => set({ contactsLoading: c }),
}));

export const useContacts = () => useStore((state) => state.contacts);
export const useSetContacts = () => useStore((state) => state.setContacts);
export const useContactsLoading = () =>
  useStore((state) => state.contactsLoading);
export const useSetContactsLoading = () =>
  useStore((state) => state.setContactsLoading);
