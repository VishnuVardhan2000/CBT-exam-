import { UserProfile, UserRole } from '@/types';

const AUTH_STORAGE_KEY = 'sbi_mock_cbt_user';

export function getActiveUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse auth user', e);
  }

  return null;
}

export function setActiveUser(user: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}

export function switchRole(role: UserRole): UserProfile {
  const user: UserProfile = role === 'admin'
    ? {
        id: 'usr_admin',
        email: '',
        fullName: 'Exam Admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    : {
        id: 'usr_candidate',
        email: '',
        fullName: 'Candidate',
        role: 'candidate',
        targetYear: 2026,
        createdAt: new Date().toISOString()
      };

  setActiveUser(user);
  return user;
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
