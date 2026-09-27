import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../repositories/post_repository.dart';

class PostProvider extends ChangeNotifier {
  final PostRepository _repository;

  List<Post> _posts = [];
  String _selectedCategory = 'All Campus';
  bool _isLoading = false;
  String? _errorMessage;

  PostProvider({required PostRepository repository}) : _repository = repository {
    loadPosts();
  }

  List<Post> get posts => _posts;
  String get selectedCategory => _selectedCategory;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<Post> get filteredPosts {
    if (_selectedCategory == 'All Campus') {
      return _posts;
    }
    return _posts.where((p) => p.locationCategory == _selectedCategory).toList();
  }

  void setSelectedCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  Future<void> loadPosts() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _posts = await _repository.getPosts();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createPost({
    required String authorId,
    required String title,
    required String locationCategory,
    required String roomDetails,
    required String description,
    String? imageUrl,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _repository.createPost(
        authorId: authorId,
        title: title,
        locationCategory: locationCategory,
        roomDetails: roomDetails,
        description: description,
        imageUrl: imageUrl,
      );
      await loadPosts();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deletePost({
    required String postId,
    required String requestingUserId,
    bool isAdmin = false,
  }) async {
    try {
      await _repository.deletePost(
        postId: postId,
        requestingUserId: requestingUserId,
        isAdmin: isAdmin,
      );
      await loadPosts();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
      return false;
    }
  }

  Future<bool> addReply({
    required String postId,
    required String authorRole,
    required String authorDisplay,
    required String message,
  }) async {
    try {
      await _repository.addReply(
        postId: postId,
        authorRole: authorRole,
        authorDisplay: authorDisplay,
        message: message,
      );
      await loadPosts();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateStatus({
    required String postId,
    required String status,
  }) async {
    try {
      await _repository.updateStatus(
        postId: postId,
        status: status,
      );
      await loadPosts();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
      return false;
    }
  }
}
