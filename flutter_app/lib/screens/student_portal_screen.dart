import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';

class StudentPortalScreen extends StatelessWidget {
  const StudentPortalScreen({Key? key}) : super(key: key);

  void _showCreatePostDialog(BuildContext context) {
    final titleController = TextEditingController();
    final roomController = TextEditingController(text: 'Room no. 205 - AB - 1');
    final descController = TextEditingController();
    String selectedLoc = locationCategories.first;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: const [
              Icon(Icons.add_circle, color: Color(0xFF4F46E5), size: 22),
              SizedBox(width: 8),
              Text('Create Campus Report', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Campus Category', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                DropdownButtonFormField<String>(
                  value: selectedLoc,
                  isExpanded: true,
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  items: locationCategories
                      .map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 12))))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) setDialogState(() => selectedLoc = val);
                  },
                ),
                const SizedBox(height: 12),
                const Text('Room / Spot Details', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                TextField(
                  controller: roomController,
                  style: const TextStyle(fontSize: 12),
                  decoration: InputDecoration(
                    hintText: 'e.g. Room no. 205 - AB - 1',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 12),
                const Text('Post Title', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                TextField(
                  controller: titleController,
                  style: const TextStyle(fontSize: 12),
                  decoration: InputDecoration(
                    hintText: 'e.g. Broken lecture desk / cracked wall',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 12),
                const Text('Description', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                TextField(
                  controller: descController,
                  maxLines: 2,
                  style: const TextStyle(fontSize: 12),
                  decoration: InputDecoration(
                    hintText: 'Describe damage or hazard...',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () async {
                final auth = Provider.of<AuthProvider>(context, listen: false);
                final postProv = Provider.of<PostProvider>(context, listen: false);

                if (titleController.text.trim().isEmpty || roomController.text.trim().isEmpty) {
                  return;
                }

                await postProv.createPost(
                  authorId: auth.currentUser?.id ?? 'student-demo',
                  title: titleController.text,
                  locationCategory: selectedLoc,
                  roomDetails: roomController.text,
                  description: descController.text,
                );

                Navigator.pop(ctx);
              },
              child: const Text('Publish Post'),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmDelete(BuildContext context, Post post) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Post?', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to delete "${post.title}"? This cannot be undone.', style: const TextStyle(fontSize: 12)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () async {
              final auth = Provider.of<AuthProvider>(context, listen: false);
              final postProv = Provider.of<PostProvider>(context, listen: false);
              await postProv.deletePost(postId: post.id, requestingUserId: auth.currentUser?.id ?? '');
              Navigator.pop(ctx);
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final postProv = Provider.of<PostProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'UniFix Student Portal',
              style: TextStyle(color: Color(0xFF0F172A), fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'You (Student) · ${auth.currentUser?.registrationNumber ?? "Registered Student"}',
              style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle, color: Color(0xFF4F46E5)),
            tooltip: 'Create Post',
            onPressed: () => _showCreatePostDialog(context),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Color(0xFF64748B)),
            tooltip: 'Logout',
            onPressed: () => auth.logout(),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            height: 48,
            color: const Color(0xFFF1F5F9),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              itemCount: campusCategories.length,
              itemBuilder: (context, index) {
                final cat = campusCategories[index];
                final isSelected = postProv.selectedCategory == cat;

                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: ChoiceChip(
                    label: Text(
                      cat,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : const Color(0xFF334155),
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: const Color(0xFF0F172A),
                    backgroundColor: Colors.white,
                    side: BorderSide(
                      color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFCBD5E1),
                    ),
                    onSelected: (selected) {
                      if (selected) postProv.setSelectedCategory(cat);
                    },
                  ),
                );
              },
            ),
          ),
        ),
      ),
      body: postProv.isLoading
          ? const Center(child: CircularProgressIndicator())
          : postProv.filteredPosts.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.location_off, size: 40, color: Color(0xFF94A3B8)),
                      const SizedBox(height: 8),
                      Text('No posts in ${postProv.selectedCategory}', style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.add, size: 16),
                        label: const Text('Create Post', style: TextStyle(fontSize: 12)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4F46E5),
                          foregroundColor: Colors.white,
                        ),
                        onPressed: () => _showCreatePostDialog(context),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: postProv.filteredPosts.length,
                  itemBuilder: (context, index) {
                    final post = postProv.filteredPosts[index];
                    final isOwnPost = auth.currentUser != null && post.authorId == auth.currentUser!.id;

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 1,
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header with Author & Delete
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    CircleAvatar(
                                      radius: 14,
                                      backgroundColor: isOwnPost ? const Color(0xFFEEF2FF) : const Color(0xFFF1F5F9),
                                      child: Text(
                                        'S',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          color: isOwnPost ? const Color(0xFF4F46E5) : const Color(0xFF475569),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        // Requirement: "You (Student)" on own post, "Student" on others
                                        Text(
                                          isOwnPost ? 'You (Student)' : 'Student',
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: isOwnPost ? const Color(0xFF4F46E5) : const Color(0xFF0F172A),
                                          ),
                                        ),
                                        Text(
                                          '${post.createdAt} · ${post.locationCategory}',
                                          style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),

                                Row(
                                  children: [
                                    // Status tag
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: post.status == 'Resolved'
                                            ? const Color(0xFFECFDF5)
                                            : post.status == 'In Progress'
                                                ? const Color(0xFFEEF2FF)
                                                : const Color(0xFFF1F5F9),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        post.status,
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: post.status == 'Resolved'
                                              ? const Color(0xFF059669)
                                              : post.status == 'In Progress'
                                                  ? const Color(0xFF4F46E5)
                                                  : const Color(0xFF475569),
                                        ),
                                      ),
                                    ),

                                    // Delete option ONLY on own post!
                                    if (isOwnPost) ...[
                                      const SizedBox(width: 4),
                                      IconButton(
                                        icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(),
                                        onPressed: () => _confirmDelete(context, post),
                                      ),
                                    ],
                                  ],
                                ),
                              ],
                            ),

                            const SizedBox(height: 10),

                            // Room details
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFF1F2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.place, size: 12, color: Color(0xFFE11D48)),
                                  const SizedBox(width: 4),
                                  Text(
                                    post.roomDetails,
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFBE123C)),
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(height: 6),

                            // Title & Description
                            Text(
                              post.title,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              post.description,
                              style: const TextStyle(fontSize: 11, color: Color(0xFF475569)),
                            ),

                            // Admin replies
                            if (post.replies.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEEF2FF),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: const Color(0xFFC7D2FE)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('Official Admin Response:', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4338CA))),
                                    const SizedBox(height: 4),
                                    ...post.replies.map(
                                      (r) => Text(
                                        r.message,
                                        style: const TextStyle(fontSize: 11, color: Color(0xFF312E81)),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
