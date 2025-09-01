import { describe, it, expect, beforeEach } from 'vitest';
import { setupStore, RootState } from '../store/test-utils';

describe('countries slice', () => {
  let store = setupStore();

  beforeEach(() => {
    store = setupStore();
  });

  it('should have initial countries list', () => {
    const state: RootState = store.getState();
    expect(state.countries.allCountries.length).toBeGreaterThan(0);
  });
});
