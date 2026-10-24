import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  type: 'movie' | 'show';
  category: string;
  language: 'Telugu' | 'Hindi' | 'English';
  languages: string[];
  genres: string[];
  synopsis: string;
  rating: number;
  duration: string;
  releaseYear: number;
  thumbnailUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  director: string;
  cast: string[];
  maturityRating: string;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['movie', 'show'], required: true, default: 'movie' },
    category: { type: String, required: true, index: true },
    language: { type: String, enum: ['Telugu', 'Hindi', 'English'], required: true, index: true },
    languages: { type: [String], index: true, default: [] },
    genres: { type: [String], required: true, index: true },
    synopsis: { type: String, required: true },
    rating: { type: Number, default: 8.0, min: 0, max: 10 },
    duration: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    thumbnailUrl: { type: String, required: true },
    backdropUrl: { type: String, required: true },
    trailerUrl: { type: String, required: true },
    director: { type: String, default: 'Acclaimed Director' },
    cast: { type: [String], default: [] },
    maturityRating: { type: String, default: 'U/A 13+' },
  },
  { timestamps: true, bufferCommands: false }
);

// Add text search index
MovieSchema.index({ title: 'text', synopsis: 'text', director: 'text' });

export const Movie = mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
