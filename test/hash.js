import { describe, it } from 'node:test';
import assert from "node:assert";
import {
  ready,
  hydro_init,
  hash_BYTES,
  hash_BYTES_MAX,
  hash_BYTES_MIN,
  hash_CONTEXTBYTES,
  hash_KEYBYTES,
  hashHash,
  hashKeygen,
  hashInit,
  hashUpdate,
  hashFinal,
} from "../src/hydrogen.js";
import { encode, decode } from '../src/utility.js';

await ready;

hydro_init();

describe('hashHash', () => {
  it('generates the same hash for the same message and key', () => {
    const key = hashKeygen();
    const hash1 = hashHash("Arbitrary data to hash", "Examples", key);
    const hash2 = hashHash("Arbitrary data to hash", "Examples", key);

    assert.ok(decode(hash1) === decode(hash2));
  });

  it('generates a different hash for the same message and key but different context', () => {
    const key = hashKeygen();
    const hash1 = hashHash("Arbitrary data to hash", "context1", key);
    const hash2 = hashHash("Arbitrary data to hash", "context2", key);

    assert.ok(decode(hash1) !== decode(hash2));
  });

  it('generates a different hash for the same message and context but different key', () => {
    const key1 = hashKeygen();
    const key2 = hashKeygen();
    const hash1 = hashHash("Arbitrary data to hash", "context1", key1);
    const hash2 = hashHash("Arbitrary data to hash", "context2", key2);

    assert.ok(decode(hash1) !== decode(hash2));
  });
});

describe('hashInit/hashUpdate/hashFinal', () => {
  it('generates a consistent hash for multi-step hashing', () => {
    const key = hashKeygen();

    const state1 = hashInit('12345678', key);
    hashUpdate(state1, 'part 1');
    hashUpdate(state1, 'part 2');
    const hash1 = hashFinal(state1, 80);

    const state2 = hashInit('12345678', key);
    hashUpdate(state2, 'part 1');
    hashUpdate(state2, 'part 2');
    const hash2 = hashFinal(state2, 80);

    assert.ok(hash1.length === 80);
    assert.ok(decode(hash1) === decode(hash2));
  });

  it('hashes with different contexts do not match', () => {
    const key = hashKeygen();

    const state1 = hashInit('12345678', key);
    hashUpdate(state1, 'part 1');
    hashUpdate(state1, 'part 2');
    const hash1 = hashFinal(state1, 80);

    const state2 = hashInit('ABCDEFGH', key);
    hashUpdate(state2, 'part 1');
    hashUpdate(state2, 'part 2');
    const hash2 = hashFinal(state2, 80);

    assert.ok(decode(hash1) !== decode(hash2));
  });
});
