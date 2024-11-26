import { describe, it } from 'node:test';
import assert from "node:assert";
import {
  ready,
  hydro_init,
  kxKeygen,
  kxKeygenDeterministic,
  kxN1,
  kxN2,
} from "../src/hydrogen.js";
import { encode, decode } from '../src/utility.js';

await ready;

hydro_init();

const zeros = new Uint8Array(32).fill(0);
const ones = new Uint8Array(32).fill(1);

describe('kx', () => {
  describe('N', () => {
    it('generates matching keys on the client and server', () => {
      const serverStaticKp = kxKeygenDeterministic(zeros);
      const client = kxN1(null, serverStaticKp.pk);
      const server = kxN2(client.packet, null, serverStaticKp);

      assert.equal(decode(client.tx), decode(server.rx));
      assert.equal(decode(client.rx), decode(server.tx));
    });

    it('generates matching keys on the client and server with PSK', () => {
      const serverStaticKp = kxKeygenDeterministic(zeros);
      const client = kxN1(ones, serverStaticKp.pk);
      const server = kxN2(client.packet, ones, serverStaticKp);

      assert.equal(decode(client.tx), decode(server.rx));
      assert.equal(decode(client.rx), decode(server.tx));
    });

    it('fails with a mismatched PSK', () => {
      const serverStaticKp = kxKeygenDeterministic(zeros);
      const client = kxN1(zeros, serverStaticKp.pk);
      let kxN2Failure = false;

      try {
        kxN2(client.packet, ones, serverStaticKp);
      } catch {
        kxN2Failure = true;
      }

      assert.ok(kxN2Failure);
    });
  });
});
