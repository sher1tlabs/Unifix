import { AuthUser, StudentAccount, AdminAccount } from '../types/models';

export interface StudentRegistrationData {
  universityEmail: string;
  registrationNumber: string;
  password: string;
}

export interface StudentLoginData {
  universityEmail: string;
  registrationNumber: string;
  password: string;
}

export interface AdminLoginData {
  adminEmail: string;
  password: string;
}

export interface IAuthRepository {
  registerStudent(data: StudentRegistrationData): Promise<AuthUser>;
  loginStudent(data: StudentLoginData): Promise<AuthUser>;
  loginAdmin(data: AdminLoginData): Promise<AuthUser>;
  getCurrentUser(): Promise<AuthUser | null>;
  logout(): Promise<void>;
}

const STORAGE_KEY_STUDENTS = 'unifix_mock_students_v2';
const STORAGE_KEY_SESSION = 'unifix_current_session_v2';

const INITIAL_STUDENTS: StudentAccount[] = [
  {
    id: 'student-demo-1',
    universityEmail: 'student@uni.edu',
    registrationNumber: 'CS-2024-884',
    passwordHash: 'password123',
    createdAt: '2026-09-20'
  },
  {
    id: 'student-demo-2',
    universityEmail: 'ayesha@uni.edu',
    registrationNumber: 'EE-2023-112',
    passwordHash: 'password123',
    createdAt: '2026-09-21'
  }
];

const INITIAL_ADMIN: AdminAccount = {
  id: 'admin-1',
  adminEmail: 'admin@campus.edu',
  passwordHash: 'admin123',
  name: 'Campus Administrator'
};

export class MockAuthRepository implements IAuthRepository {
  private getStoredStudents(): StudentAccount[] {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENTS;
    }
  }

  private saveStudents(students: StudentAccount[]): void {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }

  async registerStudent(data: StudentRegistrationData): Promise<AuthUser> {
    const email = data.universityEmail.trim().toLowerCase();
    const regNo = data.registrationNumber.trim().toUpperCase();
    const password = data.password.trim();

    if (!email || !regNo || !password) {
      throw new Error('Please fill in all registration fields.');
    }

    if (!email.includes('@')) {
      throw new Error('Please enter a valid university email address.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const students = this.getStoredStudents();

    // Check if email already registered
    const existingEmail = students.find(s => s.universityEmail.toLowerCase() === email);
    if (existingEmail) {
      throw new Error('A student account with this university email already exists.');
    }

    // Check if registration number already registered
    const existingReg = students.find(s => s.registrationNumber.toUpperCase() === regNo);
    if (existingReg) {
      throw new Error('A student account with this registration number already exists.');
    }

    const newStudent: StudentAccount = {
      id: `student-${Date.now()}`,
      universityEmail: email,
      registrationNumber: regNo,
      passwordHash: password,
      createdAt: new Date().toISOString().split('T')[0]
    };

    students.push(newStudent);
    this.saveStudents(students);

    const authUser: AuthUser = {
      id: newStudent.id,
      role: 'student',
      email: newStudent.universityEmail,
      registrationNumber: newStudent.registrationNumber,
      displayName: 'Student'
    };

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(authUser));
    return authUser;
  }

  async loginStudent(data: StudentLoginData): Promise<AuthUser> {
    const email = data.universityEmail.trim().toLowerCase();
    const regNo = data.registrationNumber.trim().toUpperCase();
    const password = data.password.trim();

    if (!email || !regNo || !password) {
      throw new Error('Please enter your university email, registration number, and password.');
    }

    const students = this.getStoredStudents();
    const matched = students.find(
      s =>
        s.universityEmail.toLowerCase() === email &&
        s.registrationNumber.toUpperCase() === regNo &&
        s.passwordHash === password
    );

    if (!matched) {
      throw new Error('Invalid credentials. Please verify your email, registration number, and password.');
    }

    const authUser: AuthUser = {
      id: matched.id,
      role: 'student',
      email: matched.universityEmail,
      registrationNumber: matched.registrationNumber,
      displayName: 'Student'
    };

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(authUser));
    return authUser;
  }

  async loginAdmin(data: AdminLoginData): Promise<AuthUser> {
    const email = data.adminEmail.trim().toLowerCase();
    const password = data.password.trim();

    if (!email || !password) {
      throw new Error('Please enter your admin email and password.');
    }

    if (
      email !== INITIAL_ADMIN.adminEmail.toLowerCase() ||
      password !== INITIAL_ADMIN.passwordHash
    ) {
      throw new Error('Invalid admin email or password.');
    }

    const authUser: AuthUser = {
      id: INITIAL_ADMIN.id,
      role: 'admin',
      email: INITIAL_ADMIN.adminEmail,
      displayName: 'University Administrator'
    };

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(authUser));
    return authUser;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }
}

// Singleton repository instance (easy to replace with FirebaseAuthRepository later)
export const authRepository: IAuthRepository = new MockAuthRepository();
