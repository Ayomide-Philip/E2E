// Mock data: maps room IDs to their passwords
// In production, this would come from your backend/WebSocket handshake
export const MOCK_ROOM_PASSWORDS: Record<string, string> = {
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890": "secret123",
  "b2c3d4e5-f6a7-8901-bcde-f12345678901": "room@pass!",
  "c3d4e5f6-a7b8-9012-cdef-123456789012": "group2024",
  "d4e5f6a7-b8c9-0123-defa-234567890123": "e2e#secure",
};

// Mock function to simulate fetching a room password
// Returns the password if the room exists in mock data, otherwise null
export function getMockRoomPassword(roomId: string): string | null {
  return MOCK_ROOM_PASSWORDS[roomId] ?? null;
}

// Mock fallback password for rooms not in the lookup
export const DEFAULT_MOCK_PASSWORD = "defaultPass123";
