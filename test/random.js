import { describe, it } from 'node:test';
import assert from "node:assert";
import {
  ready,
  hydro_init,
  randomSEEDBYTES,
  randomU32,
  randomUniform,
  randomRatchet,
  randomReseed,
  randomBuf,
  randomBufDeterministic,
} from "../src/hydrogen.js";
import { encode, decode } from '../src/utility.js';

await ready;

hydro_init();

describe('randomU32', () => {
  it('returns a random number', () => {
    const number = randomU32();

    assert.ok(number <= 2147483647);
    assert.ok(number >= -2147483648);
  });
});

describe('randomUniform', () => {
  it('generates positive numbers in bounds', () => {
    for (let i = 0; i < 1000; i++) {
      for (let j = 1; j < 100; j++) {
        const value = randomUniform(j);
        assert.ok(0 <= value && value < j);
      }
    }
  });
});

describe('randomBufDeterministic', () => {
  it('generates the same buffer given the same seed', () => {
    const seed = new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);
    const buf1 = randomBufDeterministic(100, seed);
    const buf2 = randomBufDeterministic(100, seed);
    assert.ok(decode(buf1) === decode(buf2));
  });

  it('generates different buffers given different seeds', () => {
    const seed1 = new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);
    const seed2 = new Uint8Array([99,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);
    const buf1 = randomBufDeterministic(100, seed1);
    const buf2 = randomBufDeterministic(100, seed2);
    assert.ok(decode(buf1) !== decode(buf2));
  });
});
