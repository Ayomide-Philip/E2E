export default function generateRoomId(): string {
  return crypto.randomUUID();
}
