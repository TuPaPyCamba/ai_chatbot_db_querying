export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

// In-memory mock database of chats
const mockSessions: ChatSession[] = [
  {
    id: "session_1",
    userId: "john@example.com", // linking with email for mock simplicity
    title: "SQL Query Optimization Help",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    messages: [
      {
        id: "msg_1",
        role: "user",
        content: "How do I optimize a query with multiple JOINs in PostgreSQL?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "msg_2",
        role: "assistant",
        content: "To optimize a query with multiple JOINs in PostgreSQL, you should:\n1. Ensure you have indexes on the JOIN keys (typically foreign keys).\n2. Run `EXPLAIN ANALYZE` to check the execution plan.\n3. Make sure table statistics are up-to-date with `ANALYZE`.\n4. Avoid selective filter conditions inside JOINs; apply them in the WHERE clause.",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
    ],
  },
  {
    id: "session_2",
    userId: "john@example.com",
    title: "What is Next.js Standalone?",
    createdAt: new Date().toISOString(),
    messages: [],
  },
];

export async function getSessions(userId: string): Promise<ChatSession[]> {
  return mockSessions.filter((s) => s.userId === userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getSession(userId: string, sessionId: string): Promise<ChatSession | null> {
  const session = mockSessions.find((s) => s.id === sessionId && s.userId === userId);
  return session || null;
}

export async function createSession(userId: string, title: string): Promise<ChatSession> {
  const newSession: ChatSession = {
    id: `session_${Date.now()}`,
    userId,
    title,
    messages: [],
    createdAt: new Date().toISOString(),
  };
  mockSessions.push(newSession);
  return newSession;
}

export async function addMessageToSession(
  userId: string,
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<ChatMessage> {
  const session = await getSession(userId, sessionId);
  if (!session) {
    throw new Error("Chat session not found");
  }

  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(newMessage);

  // If this is the first user message, update session title based on the first few words
  if (role === "user" && session.messages.filter((m) => m.role === "user").length === 1) {
    session.title = content.length > 30 ? content.substring(0, 27) + "..." : content;
  }

  return newMessage;
}

export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  const index = mockSessions.findIndex((s) => s.id === sessionId && s.userId === userId);
  if (index !== -1) {
    mockSessions.splice(index, 1);
  }
}
