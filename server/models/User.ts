import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
}

export interface IUser extends Document {
  name: string;
  phoneNumber: string;
  email?: string;
  password: string;
  profiles: IUserProfile[];
  activeProfileId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSubSchema = new Schema<IUserProfile>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    isKids: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String, required: true },
    profiles: {
      type: [ProfileSubSchema],
      default: [
        { id: 'profile-1', name: 'Profile-1', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', isKids: false },
        { id: 'profile-2', name: 'Profile-2', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', isKids: false },
      ],
    },
    activeProfileId: { type: String, default: 'profile-1' },
  },
  { timestamps: true, bufferCommands: false }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
