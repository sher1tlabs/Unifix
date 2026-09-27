import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'models/models.dart';
import 'repositories/auth_repository.dart';
import 'repositories/post_repository.dart';
import 'providers/auth_provider.dart';
import 'providers/post_provider.dart';
import 'screens/auth_screen.dart';
import 'screens/student_portal_screen.dart';
import 'screens/admin_portal_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Clean dependency injection of repositories
  // (Easily swap with FirebaseAuthRepository / FirebasePostRepository later)
  final AuthRepository authRepository = MockAuthRepository();
  final PostRepository postRepository = MockPostRepository();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(repository: authRepository),
        ),
        ChangeNotifierProvider(
          create: (_) => PostProvider(repository: postRepository),
        ),
      ],
      child: const UniFixApp(),
    ),
  );
}

class UniFixApp extends StatelessWidget {
  const UniFixApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UniFix Campus Infrastructure',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Roboto',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F46E5), // Indigo
          primary: const Color(0xFF4F46E5),
        ),
        useMaterial3: true,
      ),
      home: const RootNavigator(),
    );
  }
}

class RootNavigator extends StatelessWidget {
  const RootNavigator({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (auth.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    // 1. First Screen: If not logged in, show ONLY Student Login | Admin Login
    if (!auth.isAuthenticated) {
      return const AuthScreen();
    }

    // 2. Student Portal: If student, show Student Portal
    if (auth.isStudent) {
      return const StudentPortalScreen();
    }

    // 3. Admin Portal: If admin, show Admin Portal
    if (auth.isAdmin) {
      return const AdminPortalScreen();
    }

    return const AuthScreen();
  }
}
