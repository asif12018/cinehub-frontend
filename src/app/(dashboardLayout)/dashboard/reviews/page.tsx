"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquareWarning, CheckCircle, Trash2, XCircle, CheckSquare, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getUnPublishedReviews, getPublishedReviews, updateReviewStatus, deleteReview } from "@/service/review.service";
import { ConfirmationModal } from "@/components/ui/shared/ConfirmationModal";

export default function ManageReviewsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "published">("pending");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: "APPROVE" | "REJECT" | "UNPUBLISH" | "DELETE_PUBLISHED" | null;
    reviewId: string | null;
  }>({ isOpen: false, action: null, reviewId: null });

  const { data: pendingResponse, isLoading: isPendingLoading } = useQuery({
    queryKey: ["admin-pending-reviews"],
    queryFn: () => getUnPublishedReviews()
  });

  const { data: publishedResponse, isLoading: isPublishedLoading } = useQuery({
    queryKey: ["admin-published-reviews"],
    queryFn: () => getPublishedReviews()
  });

  // Extract the reviews array (handles different possible wrapper structures)
  const pendingReviews = pendingResponse?.data || pendingResponse || [];
  const publishedReviews = publishedResponse?.data || publishedResponse || [];

  const reviews = activeTab === "pending" ? pendingReviews : publishedReviews;
  const isLoading = activeTab === "pending" ? isPendingLoading : isPublishedLoading;

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateReviewStatus(id, status),
    onSuccess: (data, variables) => {
      if (data?.success === false) {
        toast.error(data.message || "Failed to update review status");
      } else {
        toast.success("Review status updated successfully");
        setModalState({ isOpen: false, action: null, reviewId: null });
        
        queryClient.invalidateQueries({ queryKey: ["admin-pending-reviews"] });
        queryClient.invalidateQueries({ queryKey: ["admin-published-reviews"] });
      }
    },
    onError: () => {
      toast.error("Failed to update review status");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: (data, variables) => {
      if (data?.success === false) {
        toast.error(data.message || "Failed to delete review");
      } else {
        toast.success("Review deleted successfully");
        setModalState({ isOpen: false, action: null, reviewId: null });

        queryClient.invalidateQueries({ queryKey: ["admin-pending-reviews"] });
        queryClient.invalidateQueries({ queryKey: ["admin-published-reviews"] });
      }
    },
    onError: () => {
      toast.error("Failed to delete review");
    }
  });

  const handleAction = (id: string, action: "APPROVE" | "REJECT" | "UNPUBLISH" | "DELETE_PUBLISHED") => {
    setModalState({ isOpen: true, action, reviewId: id });
  };

  const handleConfirmAction = () => {
    if (!modalState.reviewId) return;
    
    if (modalState.action === "APPROVE") {
      statusMutation.mutate({ id: modalState.reviewId, status: "PUBLISHED" });
    } else if (modalState.action === "UNPUBLISH") {
      statusMutation.mutate({ id: modalState.reviewId, status: "PENDING" });
    } else if (modalState.action === "REJECT" || modalState.action === "DELETE_PUBLISHED") {
      deleteMutation.mutate(modalState.reviewId);
    }
  };

  const getModalConfig = () => {
    switch (modalState.action) {
      case "APPROVE":
        return {
          title: "Approve Review?",
          message: "Are you sure you want to approve and publish this review? It will be visible to all users.",
          confirmText: "Yes, Approve",
          variant: "success" as const
        };
      case "UNPUBLISH":
        return {
          title: "Unpublish Review?",
          message: "Are you sure you want to unpublish this review? It will be moved back to pending.",
          confirmText: "Yes, Unpublish",
          variant: "danger" as const
        };
      case "REJECT":
        return {
          title: "Reject Review?",
          message: "Are you sure you want to permanently delete this pending review? This action cannot be undone.",
          confirmText: "Yes, Reject",
          variant: "danger" as const
        };
      case "DELETE_PUBLISHED":
        return {
          title: "Delete Review?",
          message: "Are you sure you want to permanently delete this published review? This action cannot be undone.",
          confirmText: "Yes, Delete",
          variant: "danger" as const
        };
      default:
        return { title: "", message: "", confirmText: "", variant: "danger" as const };
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div className="min-h-screen w-full flex-1 bg-card p-4 md:p-8 font-sans text-foreground">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-yellow-500" />
              Manage Reviews
            </h1>
            <p className="text-muted-foreground mt-2">Manage pending and published user reviews.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "pending" 
                ? "border-yellow-500 text-yellow-500" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            Pending Reviews
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "published" 
                ? "border-green-500 text-green-500" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Published Reviews
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-foreground">
              <thead className="bg-[#1a1a1a] text-xs uppercase font-semibold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Review Content</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-600 border-t-yellow-500 rounded-full animate-spin" />
                        Loading reviews...
                      </div>
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <MessageSquareWarning className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No {activeTab} reviews found.</p>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review: any) => (
                    <tr key={review.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex flex-col">
                          <span>{review.user?.name || "Unknown User"}</span>
                          <span className="text-xs text-gray-500">{review.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="truncate text-foreground" title={review.content}>
                          {review.content || "No text provided"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 font-bold">{review.rating}</span>
                          <span className="text-gray-500 text-xs">/ 10</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          review.status === "PUBLISHED" 
                            ? "bg-green-600/20 text-green-400"
                            : "bg-yellow-600/20 text-yellow-400"
                        }`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {activeTab === "pending" ? (
                            <>
                              <button 
                                onClick={() => handleAction(review.id, "APPROVE")}
                                disabled={statusMutation.isPending}
                                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Approve & Publish"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleAction(review.id, "REJECT")}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Reject & Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleAction(review.id, "UNPUBLISH")}
                                disabled={statusMutation.isPending}
                                className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Unpublish"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleAction(review.id, "DELETE_PUBLISHED")}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, action: null, reviewId: null })}
        onConfirm={handleConfirmAction}
        isPending={statusMutation.isPending || deleteMutation.isPending}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText="Cancel"
        variant={modalConfig.variant}
      />
    </div>
  );
}
