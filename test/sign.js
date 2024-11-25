import { describe, it } from 'node:test';
import assert from "node:assert";
import {
  ready,
  hydro_init,
  signKeygen,
  signKeygenDeterministic,
  signCreate,
  signVerify,
  signInit,
  signUpdate,
  signFinalCreate,
  signFinalVerify
} from "../src/hydrogen.js";
import { encode, decode } from '../src/utility.js';

await ready;

hydro_init();

const zeroSeed = new Uint8Array(32).fill(0);
const oneSeed = new Uint8Array(32);
oneSeed[31] = 1;

describe('sign', () => {
  describe('signKeygen', () => {
    it('generates the right deterministic key', () => {
      const { pk, sk } = signKeygen();

      assert.equal(pk.length, 32);
      assert.equal(sk.length, 64);
    });
  });

  describe('signKeygenDeterministic', () => {
    it('generates the right deterministic key', () => {
      const { pk, sk } = signKeygenDeterministic(zeroSeed);

      assert.equal(Buffer.from(pk).toString('hex'), 'cd385188694421d3d024543d03b95740abdeaa96121a2fabbbb1e2c77f603c69');
      assert.equal(Buffer.from(sk).toString('hex'), '51e61261d9db31ee6ea67e772620ecdeb4a253d54a531a8c5de2ccbc0bc515bccd385188694421d3d024543d03b95740abdeaa96121a2fabbbb1e2c77f603c69');
    });
  });

  describe('signCreate', () => {
    it('verifies a message signature', () => {
      const { pk, sk } = signKeygenDeterministic(zeroSeed);
      const signature = signCreate('my message', '12345678', sk);
      const verification = signVerify(signature, 'my message', '12345678', pk);

      assert.ok(verification === 0);
    });

    it('verifies a message signature', () => {
      const { pk, sk } = signKeygenDeterministic(zeroSeed);
      const signature = signCreate('my message', '12345678', sk);
      const verification = signVerify(signature, 'my message', '12345678', pk);

      assert.ok(verification === 0);
    });

    it('does not verify when the context is different', () => {
      const { pk, sk } = signKeygenDeterministic(zeroSeed);
      const signature = signCreate('my message', '12345678', sk);
      const verification = signVerify(signature, 'my message', '12345679', pk);

      assert.ok(verification === -1);
    });

    it('does not verify when the key is different', () => {
      const s1 = signKeygenDeterministic(zeroSeed);
      const s2 = signKeygenDeterministic(oneSeed);

      const signature = signCreate('my message', '12345678', s1.sk);
      const verification = signVerify(signature, 'my message', '12345679', s2.pk);

      assert.ok(verification === -1);
    });
  });

  describe('signFinalCreate', () => {
    it('can be veriried by signVerify', () => {
      const { pk, sk } = signKeygenDeterministic(zeroSeed);

      const state = signInit('12345678');
      signUpdate(state, '1');
      signUpdate(state, '2');
      const signature = signFinalCreate(state, sk);
      const verification = signVerify(signature, '12', '12345678', pk);

      assert.ok(verification === 0);
    });
  });

  describe('signFinalVerify', () => {
    it('can verify messages signed with signCreate', () => {
      const { pk, sk } = signKeygenDeterministic(zeroSeed);

      const signature = signCreate('12', '12345678', sk);

      const state = signInit('12345678');
      signUpdate(state, '1');
      signUpdate(state, '2');
      const verification = signFinalVerify(state, signature, pk);

      assert.ok(verification === 0);
    });
  });
});
