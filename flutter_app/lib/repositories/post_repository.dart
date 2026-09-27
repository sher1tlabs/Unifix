import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

abstract class PostRepository {
  Future<List<Post>> getPosts({String? category});
  Future<Post> createPost({
    required String authorId,
    required String title,
    required String locationCategory,
    required String roomDetails,
    required String description,
    String? imageUrl,
  });
  Future<void> deletePost({
    required String postId,
    required String requestingUserId,
    bool isAdmin = false,
  });
  Future<PostReply> addReply({
    required String postId,
    required String authorRole,
    required String authorDisplay,
    required String message,
  });
  Future<void> updateStatus({
    required String postId,
    required String status,
  });
}

class MockPostRepository implements PostRepository {
  static const String _postsKey = 'unifix_mock_posts';

  final List<Post> _defaultPosts = [
    Post(
      id: 'post-101',
      authorId: 'student-demo-1',
      title: 'Deep structural plaster crack on classroom wall',
      locationCategory: 'AB - 1',
      roomDetails: 'Room no. 205 - AB - 1',
      description: 'During morning Calculus class in Room 205, plaster started crumbling from the vertical wall joint.',
      imageUrl: null,
      createdAt: 'Today, 9:20 AM',
      status: 'In Progress',
      replies: [
        PostReply(
          id: 'reply-1',
          authorRole: 'admin',
          authorDisplay: 'Estate Administration',
          message: 'Work order #CW-408 issued. Civil contractor is on-site today to repair and seal.',
          timestamp: 'Today, 10:05 AM',
        ),
      ],
    ),
    Post(
      id: 'post-102',
      authorId: 'other-student-2',
      title: 'Ceiling tile water seepage and pipe leak',
      locationCategory: 'FACULTY BLOCK 1',
      roomDetails: '3rd Floor Corridor, near Lab 304',
      description: 'Persistent water seepage through acoustic ceiling tiles creating a slip hazard.',
      imageUrl: null,
      createdAt: 'Today, 8:40 AM',
      status: 'Under Review',
      replies: [
        PostReply(
          id: 'reply-2',
          authorRole: 'admin',
          authorDisplay: 'Estate Administration',
          message: 'Caution signs deployed. Plumbing technician dispatched.',
          timestamp: 'Today, 9:15 AM',
        ),
      ],
    ),
    Post(
      id: 'post-103',
      authorId: 'other-student-3',
      title: 'Broken auditorium seat bracket with exposed sharp screws',
      locationCategory: 'AB - 2',
      roomDetails: 'Auditorium Hall B - Row 4, Seat 12',
      description: 'Seat bracket has completely snapped off the underfloor anchoring bolts.',
      imageUrl: null,
      createdAt: 'Yesterday, 4:10 PM',
      status: 'Open',
      replies: [],
    ),
  ];

  Future<List<Post>> _getStoredPosts() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_postsKey);
    if (raw == null) {
      final jsonString = jsonEncode(_defaultPosts.map((p) => p.toJson()).toList());
      await prefs.setString(_postsKey, jsonString);
      return List.from(_defaultPosts);
    }
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((item) => Post.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return List.from(_defaultPosts);
    }
  }

  Future<void> _savePosts(List<Post> list) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = jsonEncode(list.map((p) => p.toJson()).toList());
    await prefs.setString(_postsKey, jsonString);
  }

  @override
  Future<List<Post>> getPosts({String? category}) async {
    final posts = await _getStoredPosts();
    if (category == null || category == 'All Campus') {
      return posts;
    }
    return posts.where((p) => p.locationCategory == category).toList();
  }

  @override
  Future<Post> createPost({
    required String authorId,
    required String title,
    required String locationCategory,
    required String roomDetails,
    required String description,
    String? imageUrl,
  }) async {
    final posts = await _getStoredPosts();
    final newPost = Post(
      id: 'post-${DateTime.now().millisecondsSinceEpoch}',
      authorId: authorId,
      title: title.trim(),
      locationCategory: locationCategory,
      roomDetails: roomDetails.trim(),
      description: description.trim(),
      imageUrl: imageUrl,
      createdAt: 'Just now',
      status: 'Open',
      replies: [],
    );

    posts.insert(0, newPost);
    await _savePosts(posts);
    return newPost;
  }

  @override
  Future<void> deletePost({
    required String postId,
    required String requestingUserId,
    bool isAdmin = false,
  }) async {
    final posts = await _getStoredPosts();
    final index = posts.indexWhere((p) => p.id == postId);
    if (index == -1) throw Exception('Post not found.');

    final post = posts[index];
    if (!isAdmin && post.authorId != requestingUserId) {
      throw Exception('Unauthorized: You can only delete your own posts.');
    }

    posts.removeAt(index);
    await _savePosts(posts);
  }

  @override
  Future<PostReply> addReply({
    required String postId,
    required String authorRole,
    required String authorDisplay,
    required String message,
  }) async {
    final posts = await _getStoredPosts();
    final post = posts.firstWhere(
      (p) => p.id == postId,
      orElse: () => throw Exception('Post not found.'),
    );

    final reply = PostReply(
      id: 'reply-${DateTime.now().millisecondsSinceEpoch}',
      authorRole: authorRole,
      authorDisplay: authorDisplay,
      message: message.trim(),
      timestamp: 'Just now',
    );

    post.replies.add(reply);
    await _savePosts(posts);
    return reply;
  }

  @override
  Future<void> updateStatus({
    required String postId,
    required String status,
  }) async {
    final posts = await _getStoredPosts();
    final post = posts.firstWhere(
      (p) => p.id == postId,
      orElse: () => throw Exception('Post not found.'),
    );

    post.status = status;
    await _savePosts(posts);
  }
}
