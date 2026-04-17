import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Send, Plus, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MOCK_POSTS = [
  { id: 1, author: 'Ananya M.', avatar: '👩‍🦰', time: '2 hours ago', category: 'Tips', content: 'Ladies, drinking warm water with a squeeze of lemon first thing in the morning really helped with my morning sickness! Week 14 and feeling so much better now. 🍋', likes: 24, comments: [{ id: 1, author: 'Sneha R.', text: 'Will try this! I\'m at week 8 and struggling.', time: '1 hour ago' }, { id: 2, author: 'Priya K.', text: 'Ginger tea also works wonders! 🫚', time: '45 min ago' }] },
  { id: 2, author: 'Kavitha S.', avatar: '👩‍🍼', time: '5 hours ago', category: 'Question', content: 'Has anyone experienced back pain during the third trimester? What exercises helped you? My doctor suggested prenatal yoga but I\'d love to hear your experiences.', likes: 18, comments: [{ id: 1, author: 'Deepa V.', text: 'Swimming was a lifesaver for me! Very gentle on the back.', time: '3 hours ago' }] },
  { id: 3, author: 'Meera J.', avatar: '🤰', time: '1 day ago', category: 'Milestone', content: '✨ Just had my 20-week anomaly scan and everything looks perfect! Baby is healthy and we\'re so happy. Sending positive vibes to all the mamas here! 💗', likes: 56, comments: [{ id: 1, author: 'Ritu P.', text: 'Congratulations! Such a wonderful feeling! 🎉', time: '22 hours ago' }, { id: 2, author: 'Swati N.', text: 'So happy for you! Mine is next week, excited and nervous!', time: '20 hours ago' }] },
  { id: 4, author: 'Pooja R.', avatar: '👶', time: '2 days ago', category: 'Diet', content: 'My nutritionist recommended eating 5 small meals instead of 3 big ones. It really reduced my bloating and heartburn. Adding dates and almonds as snacks has been great for energy levels! 🥜', likes: 31, comments: [] },
  { id: 5, author: 'Lakshmi N.', avatar: '👩‍⚕️', time: '3 days ago', category: 'Tips', content: 'Pro tip: Keep a "kick count" journal. Not only is it medically useful, but it becomes such a sweet memory later. I still read mine from my first pregnancy! 📔', likes: 42, comments: [{ id: 1, author: 'Anu M.', text: 'This is so sweet! Starting mine today. ❤️', time: '2 days ago' }] },
];

const CATEGORIES = ['All', 'Tips', 'Question', 'Milestone', 'Diet', 'Support'];

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [filter, setFilter] = useState('All');
  const [showNew, setShowNew] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', category: 'Tips' });
  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const toggleLike = (id) => setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));

  const addComment = (postId) => {
    if (!commentText[postId]?.trim()) return;
    setPosts(p => p.map(post => post.id === postId ? { ...post, comments: [...post.comments, { id: Date.now(), author: user?.name || 'You', text: commentText[postId], time: 'Just now' }] } : post));
    setCommentText(p => ({ ...p, [postId]: '' }));
  };

  const createPost = () => {
    if (!newPost.content.trim()) return;
    setPosts(p => [{ id: Date.now(), author: user?.name || 'You', avatar: '🤰', time: 'Just now', category: newPost.category, content: newPost.content, likes: 0, comments: [] }, ...p]);
    setNewPost({ content: '', category: 'Tips' });
    setShowNew(false);
  };

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  return (
    <div className="community-page">
      <div className="community-header">
        <div>
          <h2><Users size={24} /> Community Forum</h2>
          <p className="subtitle">Connect with other mothers, share tips & experiences</p>
        </div>
        <button className="new-post-btn" onClick={() => setShowNew(!showNew)}>
          {showNew ? <X size={18} /> : <Plus size={18} />} {showNew ? 'Cancel' : 'New Post'}
        </button>
      </div>

      <AnimatePresence>
        {showNew && (
          <motion.div className="new-post-form card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <select value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
            <textarea placeholder="Share your thoughts, questions, or milestones..." value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} rows={3} />
            <button className="post-submit-btn" onClick={createPost} disabled={!newPost.content.trim()}>Post</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="community-filters">
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="posts-list">
        {filtered.map(post => (
          <motion.div key={post.id} className="post-card card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="post-header">
              <span className="post-avatar">{post.avatar}</span>
              <div>
                <strong>{post.author}</strong>
                <span className="post-meta">{post.time} · <span className="post-cat-tag">{post.category}</span></span>
              </div>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-actions">
              <button className="post-like" onClick={() => toggleLike(post.id)}><ThumbsUp size={15} /> {post.likes}</button>
              <button className="post-comment-toggle" onClick={() => setExpandedComments(p => ({ ...p, [post.id]: !p[post.id] }))}><MessageCircle size={15} /> {post.comments.length}</button>
            </div>

            {expandedComments[post.id] && (
              <div className="post-comments">
                {post.comments.map(c => (
                  <div key={c.id} className="comment">
                    <strong>{c.author}</strong>
                    <span className="comment-time">{c.time}</span>
                    <p>{c.text}</p>
                  </div>
                ))}
                <div className="comment-input">
                  <input placeholder="Write a comment..." value={commentText[post.id] || ''} onChange={e => setCommentText(p => ({ ...p, [post.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addComment(post.id)} />
                  <button onClick={() => addComment(post.id)}><Send size={14} /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Community;
