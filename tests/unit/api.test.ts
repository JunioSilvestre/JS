import { describe, it, expect } from 'vitest';
import { parseFlags, parseExamples, CommandFlag, CommandExample } from '../../lib/api';

describe('lib/api helpers', () => {
  describe('parseFlags', () => {
    it('returns the same array if already an array', () => {
      const arr: CommandFlag[] = [{ flag: '-v', description: 'verbose' }];
      expect(parseFlags(arr)).toBe(arr);
    });

    it('parses valid JSON string', () => {
      const json = '[{"flag": "-h", "description": "help"}]';
      expect(parseFlags(json)).toEqual([{ flag: '-h', description: 'help' }]);
    });

    it('returns empty array for invalid JSON', () => {
      expect(parseFlags('invalid json')).toEqual([]);
    });

    it('returns empty array if parsed value is falsy', () => {
      expect(parseFlags('null')).toEqual([]);
    });
  });

  describe('parseExamples', () => {
    it('returns the same array if already an array', () => {
      const arr: CommandExample[] = [{ code: 'ls -l' }];
      expect(parseExamples(arr)).toBe(arr);
    });

    it('parses valid JSON string', () => {
      const json = '[{"code": "pwd"}]';
      expect(parseExamples(json)).toEqual([{ code: 'pwd' }]);
    });

    it('returns empty array for invalid JSON', () => {
      expect(parseExamples('invalid json')).toEqual([]);
    });
  });
});
