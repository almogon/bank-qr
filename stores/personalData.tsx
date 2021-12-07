import create from 'zustand'
import {persist} from 'zustand/middleware';

export type PersonalData = {
  name: string;
  iban: string;
  bic: string;
  lastReferences: string[];
  updateName: any;
  updateIban: any;
  updateBic: any;
  addNewReference: any;
}

const usePersonalData = create<PersonalData>(persist(
  (set, get) => ({
    name: '',
    iban: '',
    bic: '',
    lastReferences: [],
    updateName: (newName: string) => set({ name: newName }),
    updateIban: (newIban: string) => set({ iban: newIban }),
    updateBic: (newBic: string) => set({ bic: newBic }),
    addNewReference: (reference: string) => { 
      const auxList = get().lastReferences;
      auxList.push(reference);
      auxList.slice(0, 10);
      set({ lastReferences: auxList })
    },
  }),
  {
    name: 'personalData'
  }
));

export default usePersonalData;