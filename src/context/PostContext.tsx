import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, CampusCategory, PostLocationCategory } from '../types/models';
import { postRepository, CreatePostData } from '../services/postRepository';
import { useAuth } from './AuthContext';

interface PostContextType {
  posts: Post[];
  selectedCategory: CampusCategory;
  setSelectedCategory: (cat: CampusCategory) => void;
  isLoading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  createPost: (data: CreatePostData) => Promise<Post>;
  deletePost: (postId: string) => Promise<void>;
  addReply: (postId: string, message: string) => Promise<void>;
  updateStatus: (postId: string, status: Post['status']) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CampusCategory>('All Campus');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = async () => {
    setIsLoading(true);
    try {
      const data = await postRepository.getPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load posts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const createPost = async (data: CreatePostData): Promise<Post> => {
    if (!currentUser) throw new Error('You must be logged in to create a post.');
    setIsLoading(true);
    try {
      const created = await postRepository.createPost(currentUser.id, data);
      await refreshPosts();
      return created;
    } catch (err: any) {
      setError(err?.message || 'Failed to create post.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId: string): Promise<void> => {
    if (!currentUser) throw new Error('You must be logged in to delete a post.');
    setIsLoading(true);
    try {
      const isAdmin = currentUser.role === 'admin';
      await postRepository.deletePost(postId, currentUser.id, isAdmin);
      await refreshPosts();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete post.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addReply = async (postId: string, message: string): Promise<void> => {
    if (!currentUser) throw new Error('You must be logged in to post a reply.');
    try {
      const authorDisplay = currentUser.role === 'admin' ? 'University Estate Admin' : 'Student';
      await postRepository.addReply(postId, currentUser.role, authorDisplay, message);
      await refreshPosts();
    } catch (err: any) {
      setError(err?.message || 'Failed to post reply.');
      throw err;
    }
  };

  const updateStatus = async (postId: string, status: Post['status']): Promise<void> => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can update report status.');
    }
    try {
      await postRepository.updateStatus(postId, status);
      await refreshPosts();
    } catch (err: any) {
      setError(err?.message || 'Failed to update report status.');
      throw err;
    }
  };

  return (
    <PostContext.Provider value={{
      posts,
      selectedCategory,
      setSelectedCategory,
      isLoading,
      error,
      refreshPosts,
      createPost,
      deletePost,
      addReply,
      updateStatus
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within a PostProvider');
  return context;
};
