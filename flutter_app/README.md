# UniFix Campus - Flutter Native App

A complete, production-ready Flutter mobile application for University Infrastructure & Damage Management.

## Architecture

This project follows a clean repository and state-management architecture using **Provider**:

```
flutter_app/
├── lib/
│   ├── models/
│   │   └── models.dart                 # Data models (AuthUser, StudentAccount, Post, PostReply)
│   ├── repositories/
│   │   ├── auth_repository.dart        # AuthRepository interface & MockAuthRepository
│   │   └── post_repository.dart        # PostRepository interface & MockPostRepository
│   ├── providers/
│   │   ├── auth_provider.dart          # AuthProvider (ChangeNotifier)
│   │   └── post_provider.dart          # PostProvider (ChangeNotifier)
│   ├── screens/
│   │   ├── auth_screen.dart            # First Screen: Student Login & Admin Login
│   │   ├── student_portal_screen.dart  # Student Portal: 8 Campus Categories, Create/Delete Post
│   │   └── admin_portal_screen.dart    # Admin Portal: View reports, update status, reply
│   └── main.dart                       # App entry point & dependency injection
└── pubspec.yaml                        # Flutter dependencies
```

## How to Run This Flutter App

1. Make sure you have the [Flutter SDK](https://flutter.dev/docs/get-started/install) installed.
2. Navigate into the `flutter_app` directory:
   ```bash
   cd flutter_app
   ```
3. Install dependencies:
   ```bash
   flutter pub get
   ```
4. Run on a connected Android phone, iOS simulator, or Chrome:
   ```bash
   flutter run
   ```

## Demo Credentials

- **Student Login**:
  - University Email: `student@uni.edu`
  - Registration Number: `CS-2024-884`
  - Password: `password123`
- **Admin Login**:
  - Admin Email: `admin@campus.edu`
  - Password: `admin123`

You can also use the **Create Student Account** button on the Student Login tab to register new student accounts with any email and registration number.
