import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
interface UserData {
  readonly id: string;
  readonly name: string;
  readonly age: number;
  readonly email: string;
  readonly gender: string;
  readonly country: string;
  readonly agreement: boolean;
  readonly avatarBase64: string | null;
}
interface FormState {
  readonly isModalOpen: boolean;
  readonly mode: 'controlled' | 'uncontrolled' | null;
  readonly dataList: UserData[];
  readonly lastAddedId: string | null;
}

const initialState: FormState = {
  isModalOpen: false,
  mode: null,
  dataList: [],
  lastAddedId: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<'controlled' | 'uncontrolled'>
    ) => {
      state.mode = action.payload;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    saveData: (state, action: PayloadAction<Omit<UserData, 'id'>>) => {
      const newItem: UserData = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.dataList.push(newItem);
      state.lastAddedId = newItem.id;
      state.isModalOpen = false;
    },
    setAvatarBase64: (state, action: PayloadAction<string | null>) => {
      if (state.dataList.length > 0) {
        state.dataList[state.dataList.length - 1].avatarBase64 = action.payload;
      }
    },
    clearHighlight: (state) => {
      state.lastAddedId = null;
    },
  },
});
export const {
  openModal,
  closeModal,
  saveData,
  setAvatarBase64,
  clearHighlight,
} = formSlice.actions;

export default formSlice.reducer;
