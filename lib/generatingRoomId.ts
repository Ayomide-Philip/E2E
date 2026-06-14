export default function generateRoomId(): string {
  return crypto.randomUUID();
}

export function verifyRoomId(roomId: string) {
  const v4UuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  return v4UuidRegex.test(roomId);
}
