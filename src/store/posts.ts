import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Post, Comment } from '../types';
import { generateId } from '../lib/utils';

interface PostsState {
  posts: Post[];
  comments: Record<string, Comment[]>;
  addPost: (content: string, attachments?: File[]) => Promise<void>;
  addComment: (postId: string, content: string) => void;
  likePost: (postId: string) => void;
  bookmarkPost: (postId: string) => void;
  sharePost: (postId: string) => void;
  deletePost: (postId: string) => void;
  uploadAttachments: (files: File[]) => Promise<string[]>;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      comments: {},
      
      addPost: async (content, attachments = []) => {
        const user = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user;
        if (!user) return;

        let attachmentUrls: string[] = [];
        if (attachments.length > 0) {
          attachmentUrls = await get().uploadAttachments(attachments);
        }

        const newPost: Post = {
          id: generateId(),
          content,
          authorId: user.id,
          author: user,
          attachments: attachmentUrls.map((url, index) => ({
            id: generateId(),
            type: attachments[index]?.type.startsWith('image/') ? 'image' : 'document',
            url,
            filename: attachments[index]?.name || 'file',
            size: attachments[index]?.size || 0,
          })),
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          isLiked: false,
          isBookmarked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
      },

      addComment: (postId, content) => {
        const user = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user;
        if (!user) return;

        const newComment: Comment = {
          id: generateId(),
          content,
          authorId: user.id,
          author: user,
          postId,
          likesCount: 0,
          isLiked: false,
          createdAt: new Date(),
        };

        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: [...(state.comments[postId] || []), newComment],
          },
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, commentsCount: post.commentsCount + 1 }
              : post
          ),
        }));
      },

      likePost: (postId) => {
        set((state) => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
                }
              : post
          ),
        }));
      },

      bookmarkPost: (postId) => {
        set((state) => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, isBookmarked: !post.isBookmarked }
              : post
          ),
        }));
      },

      sharePost: (postId) => {
        set((state) => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, sharesCount: post.sharesCount + 1 }
              : post
          ),
        }));
      },

      deletePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter(post => post.id !== postId),
          comments: Object.fromEntries(
            Object.entries(state.comments).filter(([key]) => key !== postId)
          ),
        }));
      },

      uploadAttachments: async (files) => {
        // Simulate file upload - in real app, upload to cloud storage
        return files.map(file => URL.createObjectURL(file));
      },
    }),
    {
      name: 'posts-storage',
    }
  )
);