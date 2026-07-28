import { UserProfile, UserRole } from '@/types';
import { MOCK_USERS } from '@/lib/storage/mock-store';

const AUTH_STORAGE_KEY = 'sbi_mock_cbt_user';

export function getActiveUser(): UserProfile {
  if (typeof window === 'undefined') return MOCK_USERS[1]; // Default candidate for SSR

  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse auth user', e);
  }

  // Default candidate
  return MOCK_USERS[1];
}

export function setActiveUser(user: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}

export function switchRole(role: UserRole): UserProfile {
  const targetUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[1];
  setActiveUser(targetUser);
  return targetUser;
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
