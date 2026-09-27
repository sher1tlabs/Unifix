import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

abstract class AuthRepository {
  Future<AuthUser> registerStudent({
    required String universityEmail,
    required String registrationNumber,
    required String password,
  });

  Future<AuthUser> loginStudent({
    required String universityEmail,
    required String registrationNumber,
    required String password,
  });

  Future<AuthUser> loginAdmin({
    required String adminEmail,
    required String password,
  });

  Future<AuthUser?> getCurrentUser();
  Future<void> logout();
}

class MockAuthRepository implements AuthRepository {
  static const String _studentsKey = 'unifix_mock_students';
  static const String _sessionKey = 'unifix_current_session';

  final List<StudentAccount> _defaultStudents = [
    StudentAccount(
      id: 'student-demo-1',
      universityEmail: 'student@uni.edu',
      registrationNumber: 'CS-2024-884',
      passwordHash: 'password123',
      createdAt: '2026-09-20',
    ),
  ];

  Future<List<StudentAccount>> _getStoredStudents() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_studentsKey);
    if (raw == null) {
      final listJson = jsonEncode(_defaultStudents.map((s) => s.toJson()).toList());
      await prefs.setString(_studentsKey, listJson);
      return _defaultStudents;
    }
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((item) => StudentAccount.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return _defaultStudents;
    }
  }

  Future<void> _saveStudents(List<StudentAccount> list) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = jsonEncode(list.map((s) => s.toJson()).toList());
    await prefs.setString(_studentsKey, jsonString);
  }

  @override
  Future<AuthUser> registerStudent({
    required String universityEmail,
    required String registrationNumber,
    required String password,
  }) async {
    final email = universityEmail.trim().toLowerCase();
    final regNo = registrationNumber.trim().toUpperCase();
    final pwd = password.trim();

    if (email.isEmpty || regNo.isEmpty || pwd.isEmpty) {
      throw Exception('All fields are required.');
    }
    if (!email.contains('@')) {
      throw Exception('Please provide a valid university email address.');
    }
    if (pwd.length < 6) {
      throw Exception('Password must be at least 6 characters long.');
    }

    final students = await _getStoredStudents();
    if (students.any((s) => s.universityEmail.toLowerCase() == email)) {
      throw Exception('This university email is already registered.');
    }
    if (students.any((s) => s.registrationNumber.toUpperCase() == regNo)) {
      throw Exception('This registration number is already registered.');
    }

    final newStudent = StudentAccount(
      id: 'student-${DateTime.now().millisecondsSinceEpoch}',
      universityEmail: email,
      registrationNumber: regNo,
      passwordHash: pwd,
      createdAt: DateTime.now().toIso8601String().split('T')[0],
    );

    students.add(newStudent);
    await _saveStudents(students);

    final user = AuthUser(
      id: newStudent.id,
      role: UserRole.student,
      email: newStudent.universityEmail,
      registrationNumber: newStudent.registrationNumber,
      displayName: 'Student',
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_sessionKey, jsonEncode(user.toJson()));
    return user;
  }

  @override
  Future<AuthUser> loginStudent({
    required String universityEmail,
    required String registrationNumber,
    required String password,
  }) async {
    final email = universityEmail.trim().toLowerCase();
    final regNo = registrationNumber.trim().toUpperCase();
    final pwd = password.trim();

    if (email.isEmpty || regNo.isEmpty || pwd.isEmpty) {
      throw Exception('Please enter email, registration number, and password.');
    }

    final students = await _getStoredStudents();
    final matched = students.firstWhere(
      (s) =>
          s.universityEmail.toLowerCase() == email &&
          s.registrationNumber.toUpperCase() == regNo &&
          s.passwordHash == pwd,
      orElse: () => throw Exception('Invalid credentials. Check email, registration number, or password.'),
    );

    final user = AuthUser(
      id: matched.id,
      role: UserRole.student,
      email: matched.universityEmail,
      registrationNumber: matched.registrationNumber,
      displayName: 'Student',
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_sessionKey, jsonEncode(user.toJson()));
    return user;
  }

  @override
  Future<AuthUser> loginAdmin({
    required String adminEmail,
    required String password,
  }) async {
    final email = adminEmail.trim().toLowerCase();
    final pwd = password.trim();

    if (email != 'admin@campus.edu' || pwd != 'admin123') {
      throw Exception('Invalid admin credentials.');
    }

    final user = AuthUser(
      id: 'admin-1',
      role: UserRole.admin,
      email: 'admin@campus.edu',
      displayName: 'University Administrator',
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_sessionKey, jsonEncode(user.toJson()));
    return user;
  }

  @override
  Future<AuthUser?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_sessionKey);
    if (raw == null) return null;
    try {
      return AuthUser.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_sessionKey);
  }
}
