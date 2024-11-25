import { describe, it } from 'node:test';
import assert from "node:assert";
import {
  ready,
  hydro_init,
  secretbox_CONTEXTBYTES,
  secretbox_HEADERBYTES,
  secretbox_KEYBYTES,
  secretbox_PROBEBYTES,
  secretboxKeygen,
  secretboxEncrypt,
  secretboxDecrypt,
  secretboxProbeCreate,
  secretboxProbeVerify,
} from "../src/hydrogen.js";
import { encode, decode } from '../src/utility.js';

await ready;

hydro_init();

describe('secretbox', () => {
  describe('encryption', () => {
    it('can decrypt an encrypted message', () => {
      const messageBytes = encode('test message');
      const key = secretboxKeygen();
      const cipherText = secretboxEncrypt(messageBytes, '12345678', key);
      const decryptedBytes = secretboxDecrypt(cipherText, '12345678', key);

      assert.equal(decode(decryptedBytes), 'test message');
    });

    it('cannot decrypt an encrypted message with the wrong key', () => {
      const messageBytes = encode('test message');
      const key1 = secretboxKeygen();
      const key2 = secretboxKeygen();
      const cipherText = secretboxEncrypt(messageBytes, '12345678', key1);
      let caughtException = false

      try {
        secretboxDecrypt(cipherText, '12345678', key2);
      } catch {
        caughtException = true
      }

      assert.ok(caughtException);
    });

    it('cannot decrypt an encrypted message with the wrong context', () => {
      const messageBytes = encode('a test message');
      const key = secretboxKeygen();
      const cipherText = secretboxEncrypt(messageBytes, 'AAAAAAAA', key);
      let caughtException = false

      try {
        secretboxDecrypt(cipherText, 'AAAAAAAB', key);
      } catch {
        caughtException = true
      }

      assert.ok(caughtException);
    });

    it('cannot decrypt an encrypted message with the wrong id', () => {
      const messageBytes = encode('a test message');
      const key = secretboxKeygen();
      const cipherText = secretboxEncrypt(messageBytes, 'AAAAAAAA', key, 1);
      let caughtException = false

      try {
        secretboxDecrypt(cipherText, 'AAAAAAAA', key, 2);
      } catch {
        caughtException = true
      }

      assert.ok(caughtException);
    });
  });

  describe('probes', () => {
    it('can verify a probe', () => {
      const messageBytes = encode('test message');
      const key = secretboxKeygen();
      const cipherText = secretboxEncrypt(messageBytes, '12345678', key);
      const probe = secretboxProbeCreate(cipherText, '12345678', key);
      const verification = secretboxProbeVerify(probe, cipherText, '12345678', key);

      assert.ok(verification === 0);
    });

    it('cannot verify a probe with a mismatched message', () => {
      const messageBytes = encode('test message');
      const key = secretboxKeygen();
      const cipherText1 = secretboxEncrypt(messageBytes, '12345678', key);

      const anotherMessageBytes = encode('different test message');
      const cipherText2 = secretboxEncrypt(messageBytes, '12345678', key);

      const probe = secretboxProbeCreate(cipherText1, '12345678', key);
      const verification = secretboxProbeVerify(probe, cipherText2, '12345678', key);

      assert.ok(verification !== 0);
    });

    it('cannot verify a probe with the wrong key', () => {
      const messageBytes = encode('test message');
      const key1 = secretboxKeygen();
      const key2 = secretboxKeygen();
      const cipherText = secretboxEncrypt(messageBytes, '12345678', key1);
      const probe = secretboxProbeCreate(cipherText, '12345678', key1);
      const verification = secretboxProbeVerify(probe, cipherText, '12345678', key2);

      assert.ok(verification !== 0);
    });

    it('cannot verify a probe with a the wrong context', () => {
      const messageBytes = encode('test message');
      const key = secretboxKeygen();
      const cipherText = secretboxEncrypt(messageBytes, '12345678', key);
      const probe = secretboxProbeCreate(cipherText, '12345678', key);
      const verification = secretboxProbeVerify(probe, cipherText, 'context2', key);

      assert.ok(verification !== 0);
    });
  });
});
