"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, ThumbsUp, MessageSquare, UserCircle, Loader2 } from "lucide-react";
import { toast } from "sonner"; 

// 🟢 Import your services! Adjust the paths if needed.
import { getMovieReviewByMovieId } from "@/service/review.service"; 
import { toggoleLike } from "@/service/like.service"; 
import { createComment } from "@/service/comment.service"; // 👈 Make sure this path is correct

// Sub-component for individual reviews to handle its own "show comments" state
function ReviewCard({ review }: { review: any }) {
  const [showComments, setShowComments] = useState(false);
  console.log("Review Data received in card:", review.content, "Is Liked:", review.isLikedByCurrentUser);
  
  // Initialize directly from the backend's calculated boolean!
  const [isLiked, setIsLiked] = useState(review.isLikedByCurrentUser || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // 🟢 NEW: Comment States & Refs
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Format date safely
  const formattedDate = new Date(review.publishedAt || review.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  // The Toggle Like Handler
  const handleToggleLike = async () => {
    if (isLikeLoading) return;

    try {
      setIsLikeLoading(true);
      
      // Optimistic Update: instantly flip the UI state for a snappy UX
      setIsLiked(!isLiked);

      // Call the API (passing the review.id)
      const res = await toggoleLike(review.id);

      // If the backend fails, revert the optimistic update and show an error
      if (!res?.success) {
        setIsLiked(!isLiked);
        toast.error("Failed to update like status.");
      }
    } catch (error) {
      setIsLiked(!isLiked);
      toast.error("Something went wrong while liking.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 🟢 NEW: Reply Click Handler
  const handleReplyClick = (userName: string) => {
    // Fills the input with @username and focuses it instantly
    setCommentText(`@${userName} `);
    inputRef.current?.focus();
  };

  // 🟢 NEW: Submit Comment Mutation
  const { mutate: submitComment, isPending: isCommenting } = useMutation({
    mutationFn: () => createComment(review.id, commentText),
    onSuccess: () => {
      // Assuming your service doesn't throw an error, we treat success as true
      toast.success("Comment added!");
      setCommentText(""); // Clear the input box
      
      // Refreshes the movie reviews to instantly show the new comment!
      // NOTE: Make sure this key matches the one in ReviewElement
      queryClient.invalidateQueries({ queryKey: ["movie-reviews"] }); 
    },
    onError: () => {
      toast.error("Failed to add comment.");
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    submitComment();
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 transition-all hover:bg-white/10">
      
      {/* HEADER: User info and Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserCircle className="w-10 h-10 text-gray-400" />
          <div>
            <p className="font-semibold text-gray-200">
              {review.user?.name || "CineHub User"}
            </p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        
        {/* Premium 10-Point Rating Badge */}
        <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 shadow-inner">
          <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-500 text-yellow-500" />
          <span className="text-yellow-500 font-bold text-sm md:text-base">
            {review.rating}
            <span className="text-yellow-500/60 font-medium text-xs md:text-sm">/10</span>
          </span>
        </div>
      </div>

      {/* BODY: Review Content & Tags */}
      <div className="mb-6">
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
          {review.content}
        </p>
        
        {/* Render Tags if they exist */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {review.tags.map((t: any) => (
              <span key={t.tag.id} className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                {t.tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER: Actions */}
      <div className="flex items-center gap-6 border-t border-gray-700/50 pt-4">
        
        <button 
          onClick={handleToggleLike}
          disabled={isLikeLoading}
          className={`flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isLiked ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 transition-all ${isLiked ? "fill-current scale-110" : ""}`} /> 
          Like
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
        >
          <MessageSquare className="w-4 h-4" /> 
          {review.comments?.length || 0} Comments
        </button>
      </div>

      {/* 🟢 UPDATED: COMMENTS SECTION */}
      {showComments && (
        <div className="mt-6 space-y-4 pl-4 md:pl-6 border-l-2 border-gray-700/50 animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* List Existing Comments */}
          {review.comments && review.comments.length > 0 ? (
            review.comments.map((comment: any) => (
              <div key={comment.id} className="bg-black/20 rounded-lg p-4 border border-white/5 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-300">
                      {comment.user?.name?.charAt(0) || "U"}
                    </div>
                    <p className="text-sm font-medium text-gray-300">{comment.user?.name || "User"}</p>
                    <span className="text-[10px] text-gray-500">•</span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  
                  {/* Reply Button (Only visible when hovering over the comment) */}
                  <button 
                    onClick={() => handleReplyClick(comment.user?.name || "User")}
                    className="text-xs text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Reply
                  </button>
                </div>
                
                {/* Render comment text, highlighting mentions in blue */}
                <p className="text-sm text-gray-400 pl-8">
                  {comment.content.split(' ').map((word: string, i: number) => 
                    word.startsWith('@') ? (
                      <span key={i} className="text-blue-400 font-medium">{word} </span>
                    ) : (
                      <span key={i}>{word} </span>
                    )
                  )}
                </p>
              </div>
            ))
          ) : (
            // Message shown if there are no comments yet
            <p className="text-sm text-gray-500 italic mb-4">No comments yet. Be the first to share your thoughts!</p>
          )}

          {/* New Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2 pt-2">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment or reply..."
              disabled={isCommenting}
              className="flex-1 bg-black/40 border border-gray-700 rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isCommenting || !commentText.trim()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCommenting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Post"
              )}
            </button>
          </form>

        </div>
      )}
    </div>
  );
}

// Main Component exported to your page
export default function ReviewElement({ movieId }: { movieId: string }) {
  // Fetch reviews using React Query
  const { data: response, isLoading, isError } = useQuery<any>({
    queryKey: ["movie-reviews", movieId],
    queryFn: () => getMovieReviewByMovieId(movieId),
    enabled: !!movieId, // Only run if movieId is provided
  });

  // Extract the array of reviews safely
  const reviews = response?.data || response || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-400 text-center py-8">Failed to load reviews.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-4 md:px-12 pb-24">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
        Audience Reviews <span className="text-gray-500 text-lg font-normal">({reviews.length})</span>
      </h2>
      
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 text-gray-400">
          No reviews yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review: any) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}