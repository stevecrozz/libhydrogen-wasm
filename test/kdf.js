import { describe, it } from 'node:test';
import assert from "node:assert";
import {
  ready,
  hydro_init,
  kdfKeygen,
  kdfDeriveFromKey,
} from "../src/hydrogen.js";
import { encode, decode } from '../src/utility.js';

await ready;

hydro_init();

describe('kdfKeygen', () => {
  it('generates a key', () => {
    const key = kdfKeygen();
    assert.equal(key.length, 32);
  });
});

describe('kdfDeriveFromKey', () => {
  it('derives the same subkey for the same ID', () => {
    const key = kdfKeygen();
    const subkey1 = kdfDeriveFromKey(40, 0, 'CCCCCCCC', key);
    const subkey2 = kdfDeriveFromKey(40, 0, 'CCCCCCCC', key);

    assert.equal(decode(subkey1), decode(subkey2));
  });

  it('derives a different subkey for a different ID', () => {
    const key = kdfKeygen();
    const subkey1 = kdfDeriveFromKey(40, 0, 'CCCCCCCC', key);
    const subkey2 = kdfDeriveFromKey(40, 1, 'CCCCCCCC', key);

    assert.notEqual(decode(subkey1), decode(subkey2));
  });

  it('derives a different subkey for a different context', () => {
    const key = kdfKeygen();
    const subkey1 = kdfDeriveFromKey(40, 0, 'CCCCCCCC', key);
    const subkey2 = kdfDeriveFromKey(40, 0, 'CCCCCCCD', key);

    assert.notEqual(decode(subkey1), decode(subkey2));
  });

  it('derives a different subkey for a different key', () => {
    const key1 = kdfKeygen();
    const key2 = kdfKeygen();
    const subkey1 = kdfDeriveFromKey(40, 0, 'CCCCCCCC', key1);
    const subkey2 = kdfDeriveFromKey(40, 0, 'CCCCCCCD', key2);

    assert.notEqual(decode(subkey1), decode(subkey2));
  });
});
