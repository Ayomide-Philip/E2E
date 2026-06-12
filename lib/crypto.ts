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

export async function deriveSharedSecret(
  privateKey: CryptoKey,
  publicKey: string,
) {
  const rawPublicKey = Uint8Array.from(atob(publicKey), (c) =>
    c.charCodeAt(0),
  ).buffer;

  const importedPublicKey = await crypto.subtle.importKey(
    "raw",
    rawPublicKey,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    false,
    [],
  );

  const sharedSecret = await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: importedPublicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  return sharedSecret;
}
