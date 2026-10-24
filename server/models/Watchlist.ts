import mongoose, { Document, Schema } from 'mongoose';

export interface IWatchlist extends Document {
  userId: string;
  profileId: string;
  movieIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: { type: String, required: true, index: true },
    profileId: { type: String, required: true, default: 'profile-1' },
    movieIds: [{ type: String, required: true }],
  },
  { timestamps: true, bufferCommands: false }
);

WatchlistSchema.index({ userId: 1, profileId: 1 }, { unique: true });

export const Watchlist = mongoose.models.Watchlist || mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
