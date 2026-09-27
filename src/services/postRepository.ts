import { Post, CampusCategory, PostLocationCategory, PostReply } from '../types/models';
import wallCrackImg from '../assets/images/uni_wall_crack_damage_1790275173929.jpg';
import ceilingPipeImg from '../assets/images/uni_leaking_ceiling_pipe_1790275186799.jpg';
import brokenChairImg from '../assets/images/uni_broken_lecture_chair_1790275199999.jpg';

export interface CreatePostData {
  title: string;
  locationCategory: PostLocationCategory;
  roomDetails: string;
  description: string;
  imageUrl?: string;
}

export interface IPostRepository {
  getPosts(category?: CampusCategory): Promise<Post[]>;
  createPost(authorId: string, data: CreatePostData): Promise<Post>;
  deletePost(postId: string, requestingUserId: string, isAdmin?: boolean): Promise<boolean>;
  addReply(postId: string, authorRole: 'admin' | 'student', authorDisplay: string, message: string): Promise<PostReply>;
  updateStatus(postId: string, status: Post['status']): Promise<void>;
}

const STORAGE_KEY_POSTS = 'unifix_posts_v2';

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-101',
    authorId: 'student-demo-1', // Default demo student
    title: 'Deep structural plaster crack on classroom wall',
    locationCategory: 'AB - 1',
    roomDetails: 'Room no. 205 - AB - 1',
    description: 'During morning Calculus class in Room 205, plaster fragments started falling from the vertical wall joint behind the side rows. Needs masonry inspection.',
    imageUrl: wallCrackImg,
    createdAt: 'Today, 9:20 AM',
    status: 'In Progress',
    replies: [
      {
        id: 'reply-1',
        authorRole: 'admin',
        authorDisplay: 'Estate Administration',
        message: 'Work order #CW-408 issued. Civil contractor is on-site today to scrap, replaster, and seal the joint.',
        timestamp: 'Today, 10:05 AM'
      }
    ]
  },
  {
    id: 'post-102',
    authorId: 'student-demo-2', // Other student
    title: 'Ceiling tile water seepage and pipe leak',
    locationCategory: 'FACULTY BLOCK 1',
    roomDetails: '3rd Floor Corridor, near Lab 304',
    description: 'Persistent water seepage through acoustic ceiling tiles. Water is pooling on smooth tiles, creating a slip hazard for students moving between lecture halls.',
    imageUrl: ceilingPipeImg,
    createdAt: 'Today, 8:40 AM',
    status: 'Under Review',
    replies: [
      {
        id: 'reply-2',
        authorRole: 'admin',
        authorDisplay: 'Estate Administration',
        message: 'Caution signs deployed. Plumbing technician dispatched to isolate 3rd floor riser valve.',
        timestamp: 'Today, 9:15 AM'
      }
    ]
  },
  {
    id: 'post-103',
    authorId: 'student-demo-2', // Other student
    title: 'Broken auditorium seat bracket with exposed sharp screws',
    locationCategory: 'AB - 2',
    roomDetails: 'Auditorium Hall B - Row 4, Seat 12',
    description: 'Seat bracket has completely snapped off the underfloor anchoring bolts. The wooden armrest is wobbling with exposed metal screws.',
    imageUrl: brokenChairImg,
    createdAt: 'Yesterday, 4:10 PM',
    status: 'Open',
    replies: []
  }
];

export class MockPostRepository implements IPostRepository {
  private getStoredPosts(): Post[] {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_POSTS;
    }
  }

  private savePosts(posts: Post[]): void {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }

  async getPosts(category?: CampusCategory): Promise<Post[]> {
    const posts = this.getStoredPosts();
    if (!category || category === 'All Campus') {
      return posts;
    }
    return posts.filter(p => p.locationCategory === category);
  }

  async createPost(authorId: string, data: CreatePostData): Promise<Post> {
    if (!data.title.trim()) throw new Error('Post title is required.');
    if (!data.locationCategory) throw new Error('Location category is required.');
    if (!data.roomDetails.trim()) throw new Error('Room or location detail is required.');

    const posts = this.getStoredPosts();
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId,
      title: data.title.trim(),
      locationCategory: data.locationCategory,
      roomDetails: data.roomDetails.trim(),
      description: data.description.trim() || 'No additional description provided.',
      imageUrl: data.imageUrl,
      createdAt: 'Just now',
      status: 'Open',
      replies: []
    };

    posts.unshift(newPost);
    this.savePosts(posts);
    return newPost;
  }

  async deletePost(postId: string, requestingUserId: string, isAdmin = false): Promise<boolean> {
    const posts = this.getStoredPosts();
    const target = posts.find(p => p.id === postId);

    if (!target) {
      throw new Error('Post not found.');
    }

    // Verify ownership: only creator student or admin can delete
    if (!isAdmin && target.authorId !== requestingUserId) {
      throw new Error('Unauthorized: You can only delete your own posts.');
    }

    const updated = posts.filter(p => p.id !== postId);
    this.savePosts(updated);
    return true;
  }

  async addReply(
    postId: string,
    authorRole: 'admin' | 'student',
    authorDisplay: string,
    message: string
  ): Promise<PostReply> {
    if (!message.trim()) throw new Error('Reply message cannot be empty.');

    const posts = this.getStoredPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) {
      throw new Error('Post not found.');
    }

    const reply: PostReply = {
      id: `reply-${Date.now()}`,
      authorRole,
      authorDisplay,
      message: message.trim(),
      timestamp: 'Just now'
    };

    post.replies.push(reply);
    this.savePosts(posts);
    return reply;
  }

  async updateStatus(postId: string, status: Post['status']): Promise<void> {
    const posts = this.getStoredPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found.');
    post.status = status;
    this.savePosts(posts);
  }
}

// Singleton repository instance (easy to swap with FirebasePostRepository later)
export const postRepository: IPostRepository = new MockPostRepository();
