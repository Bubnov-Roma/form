import { describe, it, expect, beforeEach } from 'vitest';
import { setupStore, RootState } from '../store/test-utils';
import {
  openModal,
  closeModal,
  saveData,
  setAvatarBase64,
  clearHighlight,
} from '../store/form-slice';

describe('form slice', () => {
  let store = setupStore();

  beforeEach(() => {
    store = setupStore();
  });

  it('should handle initial state', () => {
    const state: RootState = store.getState();
    expect(state.form.isModalOpen).toBe(false);
    expect(state.form.mode).toBeNull();
    expect(state.form.dataList).toHaveLength(0);
  });

  it('should open modal in controlled mode', () => {
    store.dispatch(openModal('controlled'));
    const state: RootState = store.getState();
    expect(state.form.isModalOpen).toBe(true);
    expect(state.form.mode).toBe('controlled');
  });

  it('should close modal', () => {
    store.dispatch(openModal('uncontrolled'));
    store.dispatch(closeModal());
    const state: RootState = store.getState();
    expect(state.form.isModalOpen).toBe(false);
  });

  it('should save user data', () => {
    store.dispatch(
      saveData({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        gender: 'Male',
        country: 'US',
        agreement: true,
        avatarBase64: null,
      })
    );

    const state: RootState = store.getState();
    expect(state.form.dataList).toHaveLength(1);
    expect(state.form.dataList[0].name).toBe('John');
    expect(state.form.lastAddedId).not.toBeNull();
    expect(state.form.isModalOpen).toBe(false);
  });

  it('should set avatar base64 for last user', () => {
    store.dispatch(
      saveData({
        name: 'Jane',
        age: 30,
        email: 'jane@example.com',
        gender: 'Female',
        country: 'UK',
        agreement: true,
        avatarBase64: null,
      })
    );

    store.dispatch(setAvatarBase64('base64-image'));

    const state: RootState = store.getState();
    expect(state.form.dataList[0].avatarBase64).toBe('base64-image');
  });

  it('should clear highlight', () => {
    store.dispatch(
      saveData({
        name: 'Alice',
        age: 22,
        email: 'alice@example.com',
        gender: 'Female',
        country: 'FR',
        agreement: true,
        avatarBase64: null,
      })
    );
    store.dispatch(clearHighlight());
    const state: RootState = store.getState();
    expect(state.form.lastAddedId).toBeNull();
  });
});
