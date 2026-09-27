import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, User, ArrowLeft, ArrowRight, ChevronRight,
  Eye, Share2, Tag, BookOpen, Check, Sparkles, ShoppingBag
} from 'lucide-react';

interface BlogPostFull {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author: string;
  category: string;
  tags: string;
  views: number;
  published_at: string | null;
  created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/blog.php?action=post&slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.success && data.post) {
          setPost(data.post);
        } else {
          setError(data.message || 'Article not found');
        }
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Network error loading article');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const estimateReadingTime = (text: string | null) => {
    if (!text) return '4 min read';
    const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-neutral-300 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest">
          Loading Article...
        </p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-neutral-50 py-24 px-4 text-center">
        <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-3xl p-10 space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Article Not Found</h2>
          <p className="text-xs text-neutral-500">
            {error || "The article you are looking for may have been moved or removed."}
          </p>
          <div className="pt-2">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tagsList = post.tags
    ? post.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <article className="min-h-screen bg-white pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center space-x-2 text-xs text-neutral-500 font-medium overflow-hidden truncate">
            <Link to="/" className="hover:text-black transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <Link to="/blog" className="hover:text-black transition-colors shrink-0">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-neutral-900 font-bold truncate">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {post.category && (
            <span className="bg-neutral-900 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded">
              {post.category}
            </span>
          )}
          <span className="text-neutral-400 text-xs flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {estimateReadingTime(post.content || post.excerpt)}
          </span>
          <span className="text-neutral-400 text-xs flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views || 0} views
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-neutral-950 leading-tight sm:leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-sans border-l-2 border-neutral-900 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Author & Share Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center text-sm font-bold uppercase">
              {post.author ? post.author.charAt(0) : 'A'}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">{post.author || 'Blucheez Editorial'}</p>
              <div className="flex items-center space-x-2 text-[11px] text-neutral-400">
                <span>{formatDate(post.published_at || post.created_at)}</span>
                <span>•</span>
                <span>Fashion & Lifestyle Desk</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 border border-neutral-200 rounded-xl text-xs font-semibold hover:border-black transition-colors bg-neutral-50 hover:bg-white cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {post.cover_image && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-12">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-100 max-h-[540px]">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className="blog-content text-neutral-800 text-sm sm:text-base leading-relaxed space-y-5"
          dangerouslySetInnerHTML={{
            __html: post.content ? post.content : `<p>${post.excerpt}</p>`
          }}
        />

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex items-center space-x-2 text-xs text-neutral-400 font-bold uppercase tracking-wider mb-3">
              <Tag className="w-3.5 h-3.5" />
              <span>Related Topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tagsList.map(tag => (
                <span
                  key={tag}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Post Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};
