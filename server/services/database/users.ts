export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// In-memory mock database of users
const mockUsers: User[] = [
  {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    passwordHash: "password123", // Keep it plain text for simplicity in mock
  },
  {
    id: "user_2",
    name: "Jane Smith",
    email: "jane@example.com",
    passwordHash: "secure456",
  },
];

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<User> {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    passwordHash,
  };

  mockUsers.push(newUser);
  return newUser;
}
