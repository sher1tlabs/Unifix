import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';

class AdminPortalScreen extends StatelessWidget {
  const AdminPortalScreen({Key? key}) : super(key: key);

  void _showReplyDialog(BuildContext context, Post post) {
    final replyController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Reply to "${post.title}"', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: replyController,
          maxLines: 3,
          style: const TextStyle(fontSize: 12),
          decoration: const InputDecoration(
            hintText: 'e.g. Work order dispatched to civil maintenance team...',
            border: OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6B21A8), foregroundColor: Colors.white),
            onPressed: () async {
              if (replyController.text.trim().isEmpty) return;
              final postProv = Provider.of<PostProvider>(context, listen: false);
              await postProv.addReply(
                postId: post.id,
                authorRole: 'admin',
                authorDisplay: 'Estate Administration',
                message: replyController.text.trim(),
              );
              Navigator.pop(ctx);
            },
            child: const Text('Send Official Reply'),
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
        backgroundColor: const Color(0xFF0F172A), // Slate 900
        foregroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'UniFix Admin Portal',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'Staff Oversight · ${auth.currentUser?.email ?? "admin@campus.edu"}',
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            tooltip: 'Logout',
            onPressed: () => auth.logout(),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            height: 48,
            color: const Color(0xFF1E293B),
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
                        color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: const Color(0xFF6B21A8),
                    backgroundColor: const Color(0xFF0F172A),
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
              ? const Center(
                  child: Text('No student reports found in this category.', style: TextStyle(color: Color(0xFF64748B))),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: postProv.filteredPosts.length,
                  itemBuilder: (context, index) {
                    final post = postProv.filteredPosts[index];

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 1,
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Text('Reported by Student', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                                    const SizedBox(width: 6),
                                    Text('· ${post.locationCategory}', style: const TextStyle(fontSize: 11, color: Color(0xFF6B21A8), fontWeight: FontWeight.w600)),
                                  ],
                                ),
                                DropdownButton<String>(
                                  value: post.status,
                                  isDense: true,
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black),
                                  items: ['Open', 'Under Review', 'In Progress', 'Resolved']
                                      .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                                      .toList(),
                                  onChanged: (val) {
                                    if (val != null) postProv.updateStatus(postId: post.id, status: val);
                                  },
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(color: const Color(0xFFFFF1F2), borderRadius: BorderRadius.circular(6)),
                              child: Text(post.roomDetails, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFBE123C))),
                            ),
                            const SizedBox(height: 6),
                            Text(post.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                            const SizedBox(height: 4),
                            Text(post.description, style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),

                            // Replies
                            if (post.replies.isNotEmpty) ...[
                              const SizedBox(height: 10),
                              ...post.replies.map(
                                (r) => Container(
                                  width: double.infinity,
                                  margin: const EdgeInsets.only(bottom: 4),
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
                                  child: Text('${r.authorDisplay}: ${r.message}', style: const TextStyle(fontSize: 11, color: Color(0xFF1E293B))),
                                ),
                              ),
                            ],

                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                OutlinedButton.icon(
                                  icon: const Icon(Icons.reply, size: 14),
                                  label: const Text('Reply to Report', style: TextStyle(fontSize: 11)),
                                  onPressed: () => _showReplyDialog(context, post),
                                ),
                                const SizedBox(width: 8),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                                  onPressed: () async {
                                    if (await showDialog<bool>(
                                          context: context,
                                          builder: (c) => AlertDialog(
                                            title: const Text('Delete Report?'),
                                            content: const Text('Remove this report as admin?'),
                                            actions: [
                                              TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')),
                                              TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Delete')),
                                            ],
                                          ),
                                        ) ??
                                        false) {
                                      await postProv.deletePost(postId: post.id, requestingUserId: '', isAdmin: true);
                                    }
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
