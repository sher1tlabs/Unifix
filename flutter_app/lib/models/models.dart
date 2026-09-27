import 'dart:convert';

const List<String> campusCategories = [
  'All Campus',
  'AB - 1',
  'AB - 2',
  'AB - 3',
  'FACULTY BLOCK 1',
  'FACULTY BLOCK 2',
  'Library',
  'Central Cafeteria Block',
];

const List<String> locationCategories = [
  'AB - 1',
  'AB - 2',
  'AB - 3',
  'FACULTY BLOCK 1',
  'FACULTY BLOCK 2',
  'Library',
  'Central Cafeteria Block',
];

enum UserRole { student, admin }

class AuthUser {
  final String id;
  final UserRole role;
  final String email;
  final String? registrationNumber;
  final String displayName;

  AuthUser({
    required this.id,
    required this.role,
    required this.email,
    this.registrationNumber,
    required this.displayName,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'role': role == UserRole.student ? 'student' : 'admin',
    'email': email,
    'registrationNumber': registrationNumber,
    'displayName': displayName,
  };

  factory AuthUser.fromJson(Map<String, dynamic> json) => AuthUser(
    id: json['id'] as String,
    role: json['role'] == 'admin' ? UserRole.admin : UserRole.student,
    email: json['email'] as String,
    registrationNumber: json['registrationNumber'] as String?,
    displayName: json['displayName'] as String,
  );
}

class StudentAccount {
  final String id;
  final String universityEmail;
  final String registrationNumber;
  final String passwordHash;
  final String createdAt;

  StudentAccount({
    required this.id,
    required this.universityEmail,
    required this.registrationNumber,
    required this.passwordHash,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'universityEmail': universityEmail,
    'registrationNumber': registrationNumber,
    'passwordHash': passwordHash,
    'createdAt': createdAt,
  };

  factory StudentAccount.fromJson(Map<String, dynamic> json) => StudentAccount(
    id: json['id'] as String,
    universityEmail: json['universityEmail'] as String,
    registrationNumber: json['registrationNumber'] as String,
    passwordHash: json['passwordHash'] as String,
    createdAt: json['createdAt'] as String,
  );
}

class PostReply {
  final String id;
  final String authorRole; // 'admin' | 'student'
  final String authorDisplay;
  final String message;
  final String timestamp;

  PostReply({
    required this.id,
    required this.authorRole,
    required this.authorDisplay,
    required this.message,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'authorRole': authorRole,
    'authorDisplay': authorDisplay,
    'message': message,
    'timestamp': timestamp,
  };

  factory PostReply.fromJson(Map<String, dynamic> json) => PostReply(
    id: json['id'] as String,
    authorRole: json['authorRole'] as String,
    authorDisplay: json['authorDisplay'] as String,
    message: json['message'] as String,
    timestamp: json['timestamp'] as String,
  );
}

class Post {
  final String id;
  final String authorId;
  final String title;
  final String locationCategory;
  final String roomDetails;
  final String description;
  final String? imageUrl;
  final String createdAt;
  String status; // 'Open', 'Under Review', 'In Progress', 'Resolved'
  final List<PostReply> replies;

  Post({
    required this.id,
    required this.authorId,
    required this.title,
    required this.locationCategory,
    required this.roomDetails,
    required this.description,
    this.imageUrl,
    required this.createdAt,
    required this.status,
    required this.replies,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'authorId': authorId,
    'title': title,
    'locationCategory': locationCategory,
    'roomDetails': roomDetails,
    'description': description,
    'imageUrl': imageUrl,
    'createdAt': createdAt,
    'status': status,
    'replies': replies.map((r) => r.toJson()).toList(),
  };

  factory Post.fromJson(Map<String, dynamic> json) => Post(
    id: json['id'] as String,
    authorId: json['authorId'] as String,
    title: json['title'] as String,
    locationCategory: json['locationCategory'] as String,
    roomDetails: json['roomDetails'] as String,
    description: json['description'] as String,
    imageUrl: json['imageUrl'] as String?,
    createdAt: json['createdAt'] as String,
    status: json['status'] as String? ?? 'Open',
    replies: (json['replies'] as List<dynamic>?)
            ?.map((r) => PostReply.fromJson(r as Map<String, dynamic>))
            .toList() ??
        [],
  );
}
