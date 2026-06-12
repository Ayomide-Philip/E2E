export async function generateKeysValuePairs() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"],
  );

  const base64PublicKey = btoa(
    String.fromCharCode(
      ...new Uint8Array(
        await crypto.subtle.exportKey("raw", keyPair.publicKey),
      ),
    ),
  );

  return {
    privateKey: keyPair.privateKey,
    publicKey: base64PublicKey,
  };
}
