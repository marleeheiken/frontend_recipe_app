import {
  createMockJwt,
  sanitizeText,
  validateEmail,
  validatePassword,
} from './security';

const USERS_KEY = 'recipehub_users';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function persistUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPassword(password) {
  return btoa(password);
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

export async function registerUser({ email, password, role }) {
  const { normalized, valid } = validateEmail(email);
  const passwordStatus = validatePassword(password);
  const cleanRole = role === 'admin' ? 'admin' : 'regular';

  if (!valid) {
    throw new Error('Please enter a valid email.');
  }

  if (!passwordStatus.valid) {
    throw new Error(passwordStatus.message);
  }

  const users = readUsers();
  const exists = users.some((user) => user.email === normalized);
  if (exists) {
    throw new Error('An account already exists for this email.');
  }

  const newUser = {
    email: normalized,
    passwordHash: hashPassword(password),
    role: cleanRole,
    createdAt: Date.now(),
  };

  users.push(newUser);
  persistUsers(users);

  return { email: newUser.email, role: newUser.role };
}

export async function loginUser({ email, password, roleHint }) {
  const { normalized, valid } = validateEmail(email);
  const cleanRole = roleHint === 'admin' ? 'admin' : 'regular';

  if (!valid) {
    throw new Error('Please enter a valid email.');
  }

  const users = readUsers();
  const existing = users.find((user) => user.email === normalized);

  if (!existing) {
    // Allow demo sign-in if user has not registered yet.
    const demoUser = {
      email: normalized,
      passwordHash: hashPassword(password),
      role: cleanRole,
      createdAt: Date.now(),
    };
    users.push(demoUser);
    persistUsers(users);

    const token = createMockJwt({ sub: demoUser.email, role: demoUser.role });
    return { user: { email: demoUser.email, role: demoUser.role }, token };
  }

  if (!verifyPassword(password, existing.passwordHash)) {
    throw new Error('Incorrect email or password.');
  }

  const token = createMockJwt({ sub: existing.email, role: existing.role });
  return {
    user: { email: sanitizeText(existing.email), role: existing.role },
    token,
  };
}
