import { describe, it, expect, vi } from 'vitest';
import { fileToBase64 } from '../utils/file-to-base-64';

describe('fileToBase64', () => {
  it('should convert a file to a base64 string', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const base64 = await fileToBase64(file);

    expect(base64).toMatch(/^data:text\/plain;base64,/);
    expect(base64).toContain(Buffer.from('hello').toString('base64'));
  });

  it('should reject if FileReader errors', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const originalFileReader = global.FileReader;
    const mockReader = {
      readAsDataURL: vi.fn(),
      onload: null,
      onerror: null,
      abort: vi.fn(),
      readyState: 0,
      result: null,
      error: null,
      onabort: null,
      onloadend: null,
      onloadstart: null,
      onprogress: null,
    } as unknown as FileReader;
    vi.stubGlobal(
      'FileReader',
      vi.fn(() => mockReader as unknown as FileReader)
    );

    const promise = fileToBase64(file);

    mockReader.onerror?.({} as ProgressEvent<FileReader>);

    await expect(promise).rejects.toBeDefined();

    vi.stubGlobal('FileReader', originalFileReader);
  });
});
