"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signIn } from "next-auth/react";
import { ThumbsUp, ThumbsDown, Send, LogIn, User, Trash2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

const ADMIN_EMAIL = "alphaprime.co.in@gmail.com";

interface Comment {
    _id: string;
    uid: string;
    displayName: string;
    photoURL: string;
    content: string;
    likes: number;
    dislikes: number;
    likedBy: string[];
    dislikedBy: string[];
    parentId: string | null;
    email: string;
    createdAt: string;
}

export default function CommentSection() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { data: session, status } = useSession();
    const user = session?.user ? {
        uid: (session.user as any).id,
        displayName: session.user.name || "",
        photoURL: session.user.image || "",
        email: session.user.email || ""
    } : null;
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/comments');
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            await signIn("google");
        } catch (error: any) {
            console.error("Login failed", error);
            alert(`Login failed: ${error.message || 'Please try again later.'}`);
        }
    };

    const handlePostComment = async (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault();
        const content = parentId ? replyContent : newComment;
        if (!user || !content.trim()) return;

        setIsPosting(true);
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    email: user.email,
                    content: content.trim(),
                    parentId
                })
            });

            if (response.ok) {
                if (parentId) {
                    setReplyContent('');
                    setReplyingTo(null);
                } else {
                    setNewComment('');
                }
                fetchComments(); // Refresh list to get the ID and exact timestamp
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleReaction = async (commentId: string, action: 'like' | 'dislike') => {
        if (!user) {
            handleLogin(); // Prompt login if trying to react while logged out
            return;
        }

        try {
            // Optimistic update
            setComments(comments.map(c => {
                if (c._id === commentId) {
                    let updatedComment = { ...c };
                    const hasLiked = c.likedBy?.includes(user.uid);
                    const hasDisliked = c.dislikedBy?.includes(user.uid);

                    if (action === 'like') {
                        if (hasLiked) {
                            updatedComment.likes -= 1;
                            updatedComment.likedBy = c.likedBy.filter(id => id !== user.uid);
                        } else {
                            updatedComment.likes += 1;
                            updatedComment.likedBy = [...(c.likedBy || []), user.uid];
                            if (hasDisliked) {
                                updatedComment.dislikes -= 1;
                                updatedComment.dislikedBy = c.dislikedBy.filter(id => id !== user.uid);
                            }
                        }
                    } else if (action === 'dislike') {
                        if (hasDisliked) {
                            updatedComment.dislikes -= 1;
                            updatedComment.dislikedBy = c.dislikedBy.filter(id => id !== user.uid);
                        } else {
                            updatedComment.dislikes += 1;
                            updatedComment.dislikedBy = [...(c.dislikedBy || []), user.uid];
                            if (hasLiked) {
                                updatedComment.likes -= 1;
                                updatedComment.likedBy = c.likedBy.filter(id => id !== user.uid);
                            }
                        }
                    }
                    return updatedComment;
                }
                return c;
            }));

            const response = await fetch('/api/comments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId,
                    uid: user.uid,
                    action
                })
            });

            if (!response.ok) {
                // Revert if failed
                fetchComments();
            }
        } catch (error) {
            console.error("Failed to react", error);
            fetchComments(); // Revert on error
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    const handleDelete = async (commentId: string) => {
        if (!user || !confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch('/api/comments', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId,
                    uid: user.uid,
                    email: user.email
                })
            });

            if (response.ok) {
                // Update local state without refetching for speed
                setComments(comments.filter(c => c._id !== commentId));
            } else {
                alert("Failed to delete comment");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-0 p-2 sm:p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group"
            >
                <h2 className="text-2xl font-bold text-black group-hover:text-gray-700 transition-colors">
                    Discussion {comments.length > 0 && `(${comments.length})`}
                </h2>
                <div className="p-2 rounded-full bg-gray-200 text-gray-800 group-hover:bg-gray-200 transition-all">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>

            {isOpen && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Comment Input */}
                    <div className="mb-4">
                        {!user ? (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                                <User className="w-12 h-12 mx-auto text-gray-700 mb-4" />
                                <h3 className="text-lg font-medium text-black mb-2">Join the conversation</h3>
                                <p className="text-gray-800 mb-6 max-w-sm mx-auto">
                                    Sign in with your Google account to share your thoughts, ask questions, or provide feedback.
                                </p>
                                <button
                                    onClick={handleLogin}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black border-2 border-black rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Login with Google
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handlePostComment} className="flex gap-4">
                                <div className="flex-shrink-0 hidden sm:block">
                                    {!imgError && user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full shadow-sm"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                            <User className="w-6 h-6 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full min-h-[100px] p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-black placeholder-gray-600 transition-all resize-y"
                                        required
                                    />
                                    <div className="flex flex-wrap justify-between items-center mt-3 gap-3">
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 max-w-full overflow-hidden">
                                            {(!imgError && user.photoURL) ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName}
                                                    className="w-5 h-5 rounded-full"
                                                    onError={() => setImgError(true)}
                                                />
                                            ) : (
                                                <User className="w-4 h-4 text-gray-500" />
                                            )}
                                            <span className="text-xs text-gray-600 font-medium truncate">
                                                Signed in as <span className="text-black">{user.displayName}</span>
                                            </span>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isPosting || !newComment.trim()}
                                            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                                        >
                                            {isPosting ? 'Posting...' : 'Post Comment'}
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-800">Loading comments...</div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-8 text-gray-800">
                                No comments yet. Be the first to start the discussion!
                            </div>
                        ) : (
                            // Render top-level comments and their replies
                            comments.filter(c => !c.parentId)
                                .sort((a, b) => {
                                    const aIsAdmin = a.email === ADMIN_EMAIL;
                                    const bIsAdmin = b.email === ADMIN_EMAIL;
                                    if (aIsAdmin && !bIsAdmin) return -1;
                                    if (!aIsAdmin && bIsAdmin) return 1;
                                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                                })
                                .map((comment) => (
                                    <CommentItem
                                        key={comment._id}
                                        comment={comment}
                                        allComments={comments}
                                        user={user}
                                        handleReaction={handleReaction}
                                        handleDelete={handleDelete}
                                        handlePostComment={handlePostComment}
                                        replyingTo={replyingTo}
                                        setReplyingTo={setReplyingTo}
                                        replyContent={replyContent}
                                        setReplyContent={setReplyContent}
                                        isPosting={isPosting}
                                        formatDate={formatDate}
                                    />
                                ))
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
}

interface CommentItemProps {
    comment: Comment;
    allComments: Comment[];
    user: any;
    handleReaction: (id: string, action: 'like' | 'dislike') => void;
    handleDelete: (id: string) => void;
    handlePostComment: (e: React.FormEvent, parentId: string | null) => void;
    replyingTo: string | null;
    setReplyingTo: (id: string | null) => void;
    replyContent: string;
    setReplyContent: (content: string) => void;
    isPosting: boolean;
    formatDate: (date: string) => string;
    isReply?: boolean;
}

function CommentItem({
    comment,
    allComments,
    user,
    handleReaction,
    handleDelete,
    handlePostComment,
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    isPosting,
    formatDate,
    isReply = false
}: CommentItemProps) {
    const [showReplies, setShowReplies] = useState(false);
    const replies = allComments.filter(c => c.parentId === comment._id)
        .sort((a, b) => {
            const aIsAdmin = a.email === ADMIN_EMAIL;
            const bIsAdmin = b.email === ADMIN_EMAIL;
            if (aIsAdmin && !bIsAdmin) return -1;
            if (!aIsAdmin && bIsAdmin) return 1;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

    const isAdminComment = comment.email === ADMIN_EMAIL;
    const isCurrentUserAdmin = user?.email === ADMIN_EMAIL;

    return (
        <div className={`space-y-4 ${isReply ? 'ml-6 sm:ml-10 mt-4 border-l-2 border-gray-100 pl-4 sm:pl-6' : ''}`}>
            <div className={`flex gap-4 p-3 rounded-xl transition-colors group ${isAdminComment ? 'bg-amber-50/30' : 'hover:bg-gray-50'}`}>
                <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex-shrink-0 bg-gray-100 flex items-center justify-center border-2 ${isAdminComment ? 'border-amber-400' : 'border-gray-100'} overflow-hidden`}>
                    {comment.photoURL ? (
                        <img
                            src={comment.photoURL}
                            alt={comment.displayName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.classList.add('bg-gray-100');
                                (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                            }}
                        />
                    ) : (
                        <User className="w-5 h-5 text-gray-400" />
                    )}
                </div>
                <div className="flex-grow">
                    <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <h4 className={`${isReply ? 'text-sm' : 'text-base'} font-medium text-black flex items-center gap-1.5`}>
                                {comment.displayName}
                                {isAdminComment && (
                                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                                        ADMIN
                                    </span>
                                )}
                            </h4>
                            <span className="text-[10px] sm:text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>
                        {(user && (user.uid === comment.uid || isCurrentUserAdmin)) && (
                            <button
                                onClick={() => handleDelete(comment._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Delete comment"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <p className={`text-gray-700 mb-2 whitespace-pre-wrap break-words ${isReply ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
                        {comment.content}
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleReaction(comment._id, 'like')}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${user && comment.likedBy?.includes(user.uid)
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-500 hover:text-black'
                                }`}
                        >
                            <ThumbsUp className={`w-3.5 h-3.5 ${user && comment.likedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
                            <span>{comment.likes || 0}</span>
                        </button>
                        <button
                            onClick={() => handleReaction(comment._id, 'dislike')}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${user && comment.dislikedBy?.includes(user.uid)
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500 hover:text-black'
                                }`}
                        >
                            <ThumbsDown className={`w-3.5 h-3.5 ${user && comment.dislikedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
                            <span>{comment.dislikes || 0}</span>
                        </button>
                        {user && user.uid !== comment.uid && (
                            <button
                                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                className="text-xs text-gray-500 hover:text-black font-medium transition-colors"
                            >
                                Reply
                            </button>
                        )}
                    </div>

                    {/* Expand/Collapse Replies Button */}
                    {replies.length > 0 && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="mt-3 flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-all text-xs font-semibold group"
                        >
                            {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            <span>{showReplies ? 'Hide replies' : `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}</span>
                        </button>
                    )}

                    {/* Reply Input Form */}
                    {replyingTo === comment._id && (
                        <form onSubmit={(e) => handlePostComment(e, comment._id)} className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex-grow">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Reply to ${comment.displayName}...`}
                                    className="w-full min-h-[80px] p-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-black placeholder-gray-500 resize-y"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setReplyingTo(null)}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPosting || !replyContent.trim()}
                                        className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-md hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-sm"
                                    >
                                        {isPosting ? 'Replying...' : 'Reply'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Render nested replies */}
            {replies.length > 0 && showReplies && (
                <div className="space-y-2">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            allComments={allComments}
                            user={user}
                            handleReaction={handleReaction}
                            handleDelete={handleDelete}
                            handlePostComment={handlePostComment}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            isPosting={isPosting}
                            formatDate={formatDate}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
