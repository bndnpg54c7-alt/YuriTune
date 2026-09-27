import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const emptyStats = {
  score: 0,
  streak: 0,
  bestStreak: 0,
  answered: 0,
  correct: 0,
};

/**
 * The signed-in user's training stats. Returns null when signed out.
 * Reactive, so the quiz screen updates as soon as an answer is recorded.
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const stats = await ctx.db
      .query("quizStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return stats ?? emptyStats;
  },
});

/** Records one answered question and returns the updated stats. */
export const recordAnswer = mutation({
  args: { correct: v.boolean() },
  handler: async (ctx, { correct }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("quizStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const base = existing ?? emptyStats;
    const streak = correct ? base.streak + 1 : 0;
    const next = {
      userId,
      score: base.score + (correct ? 1 : 0),
      streak,
      bestStreak: Math.max(base.bestStreak, streak),
      answered: base.answered + 1,
      correct: base.correct + (correct ? 1 : 0),
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, next);
    } else {
      await ctx.db.insert("quizStats", next);
    }

    return next;
  },
});
