import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserData {
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
  readonly data: UserData | null;
}

const initialState: FormState = {
  isModalOpen: false,
  mode: null,
  data: null,
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
    saveData: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      state.isModalOpen = false;
    },
    setAvatarBase64: (state, action: PayloadAction<string | null>) => {
      if (state.data) {
        state.data.avatarBase64 = action.payload;
      } else {
        state.data = {
          name: '',
          age: 0,
          email: '',
          gender: '',
          country: '',
          agreement: false,
          avatarBase64: action.payload,
        };
      }
    },
  },
});

export const { openModal, closeModal, saveData, setAvatarBase64 } =
  formSlice.actions;

export default formSlice.reducer;
