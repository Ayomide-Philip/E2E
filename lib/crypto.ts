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

export async function getEncryptionKey(
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

export async function encryptMessage(aesKey: CryptoKey, message: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedMessage = new TextEncoder().encode(message);

  const cipherText = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    encodedMessage,
  );

  const ivBase64 = btoa(String.fromCharCode(...iv));
  const cipherTextBase64 = btoa(
    String.fromCharCode(...new Uint8Array(cipherText)),
  );

  return { iv: ivBase64, cipherText: cipherTextBase64 };
}

export async function decryptMessage(
  aesKey: CryptoKey,
  iv: string,
  cipherText: string,
) {
  const ivArray = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const cipherTextArray = Uint8Array.from(atob(cipherText), (c) =>
    c.charCodeAt(0),
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray,
    },
    aesKey,
    cipherTextArray,
  );

  return new TextDecoder().decode(decrypted);
}
