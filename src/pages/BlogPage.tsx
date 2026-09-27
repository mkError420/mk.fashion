import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, User, ArrowRight, ChevronRight,
  Search, BookOpen, Tag, Sparkles, Eye, Share2
} from 'lucide-react';

export interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  author: string;
  category: string;
  tags: string;
  views: number;
  published_at: string | null;
  created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blog.php?action=list`);
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(p => {
      if (p.category && p.category.trim()) cats.add(p.category.trim());
    });
    return ['all', ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'all' ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !searchQuery ||
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Featured post: the first one if on 'all' and no search
  const featuredPost = (selectedCategory === 'all' && !searchQuery && filteredPosts.length > 0)
    ? filteredPosts[0]
    : null;

  const regularPosts = featuredPost
    ? filteredPosts.slice(1)
    : filteredPosts;

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const estimateReadingTime = (text: string | null) => {
    if (!text) return '3 min read';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-3">
          <div className="flex items-center space-x-2 text-xs text-neutral-500 font-medium">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-900 font-bold">Fashion Journal & Blog</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-neutral-950 text-white py-14 sm:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-neutral-800/30 to-transparent pointer-events-none" />
        <div className="w-full max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-neutral-300">
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span>The Blucheez Atelier Journal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white max-w-3xl mx-auto">
            Stories, Trends & Style Curations
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Explore seasonal style recommendations, fabric care guides, atelier craftsmanship, and wardrobe inspiration designed for contemporary Bangladeshi living.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-8 sm:py-12">

        {/* Filter and Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 uppercase tracking-wider ${selectedCategory === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-black border border-neutral-200 hover:border-neutral-400'
                  }`}
              >
                {cat === 'all' ? 'All Articles' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, trends..."
              className="w-full text-xs p-2.5 pl-9 pr-4 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-black font-medium transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-neutral-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  <div className="h-6 bg-neutral-200 rounded w-4/5" />
                  <div className="h-3 bg-neutral-200 rounded w-full" />
                  <div className="h-3 bg-neutral-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-2">No Articles Found</h3>
            <p className="text-xs text-neutral-500 mb-6">
              {searchQuery ? `No articles matched "${searchQuery}". Try a different keyword.` : 'Stay tuned! New fashion stories and style guides are coming soon.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Post Card */}
            {featuredPost && (
              <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[320px] overflow-hidden bg-neutral-100">
                    {featuredPost.cover_image ? (
                      <img
                        src={featuredPost.cover_image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
                        <BookOpen className="w-16 h-16 opacity-30" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      Featured Story
                    </span>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-xs text-neutral-400 font-medium">
                        {featuredPost.category && (
                          <span className="text-black font-bold uppercase tracking-wider bg-neutral-100 px-2.5 py-1 rounded">
                            {featuredPost.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(featuredPost.published_at || featuredPost.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {estimateReadingTime(featuredPost.excerpt)}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-snug group-hover:text-neutral-700 transition-colors">
                        <Link to={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-4">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-neutral-100 flex items-center justify-between mt-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold uppercase">
                          {featuredPost.author ? featuredPost.author.charAt(0) : 'A'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-900 leading-none">
                            {featuredPost.author || 'Blucheez Atelier'}
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Editorial Team</p>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors group-hover:translate-x-1 duration-200"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest font-extrabold text-neutral-400 mb-6">
                  {featuredPost ? 'More Stories & Curations' : 'All Published Stories'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {regularPosts.map(post => (
                    <article
                      key={post.id}
                      className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group"
                    >
                      {/* Thumbnail */}
                      <Link to={`/blog/${post.slug}`} className="block relative h-52 overflow-hidden bg-neutral-100">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-700 text-white">
                            <BookOpen className="w-10 h-10 opacity-30" />
                          </div>
                        )}
                        {post.category && (
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
                            {post.category}
                          </span>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-3 text-[11px] text-neutral-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.published_at || post.created_at)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {estimateReadingTime(post.excerpt)}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-lg text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-2 mb-2 leading-snug">
                            <Link to={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>

                          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-neutral-600">
                            By {post.author || 'Atelier'}
                          </span>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center text-xs font-bold text-black hover:text-neutral-600 transition-colors gap-1"
                          >
                            <span>Read</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
