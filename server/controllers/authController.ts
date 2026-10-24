import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isMongooseReady, inMemoryDb } from '../data/store.js';
import { signToken, AuthRequest } from '../middleware/authMiddleware.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phoneNumber, password, email } = req.body;

    if (!name || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, Phone Number, and Password are required fields.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isMongooseReady()) {
      const existing = await User.findOne({ phoneNumber });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this phone number already exists. Please verify or log in.',
        });
      }

      const newUser = await User.create({
        name,
        phoneNumber,
        email: email || `${phoneNumber}@netflixmern.user`,
        password: hashedPassword,
        profiles: [
          {
            id: 'profile-1',
            name: `${name.split(' ')[0]} (Profile-1)`,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            isKids: false,
          },
          {
            id: 'profile-2',
            name: 'Profile-2',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            isKids: false,
          },
        ],
        activeProfileId: 'profile-1',
      });

      const token = signToken({
        id: (newUser._id as any).toString(),
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        activeProfileId: newUser.activeProfileId,
      });

      return res.status(201).json({
        success: true,
        message: 'Profile verified and registered successfully!',
        token,
        user: {
          id: (newUser._id as any).toString(),
          name: newUser.name,
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
          profiles: newUser.profiles,
          activeProfileId: newUser.activeProfileId,
        },
      });
    }

    // In-memory fallback
    const existing = inMemoryDb.users.find((u) => u.phoneNumber === phoneNumber);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists.',
      });
    }

    const userId = `u_${Date.now()}`;
    const newUser = {
      _id: userId,
      id: userId,
      name,
      phoneNumber,
      email: email || `${phoneNumber}@netflixmern.user`,
      password: hashedPassword,
      profiles: [
        {
          id: 'profile-1',
          name: `${name.split(' ')[0]} (Profile-1)`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          isKids: false,
        },
        {
          id: 'profile-2',
          name: 'Profile-2',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          isKids: false,
        },
      ],
      activeProfileId: 'profile-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryDb.users.push(newUser);

    const token = signToken({
      id: userId,
      name: newUser.name,
      phoneNumber: newUser.phoneNumber,
      email: newUser.email,
      activeProfileId: newUser.activeProfileId,
    });

    return res.status(201).json({
      success: true,
      message: 'Profile verified and registered successfully!',
      token,
      user: {
        id: userId,
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        profiles: newUser.profiles,
        activeProfileId: newUser.activeProfileId,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // identifier can be phoneNumber or email or name

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone Number/Email and Password are required.',
      });
    }

    let user: any = null;

    if (isMongooseReady()) {
      user = await User.findOne({
        $or: [
          { phoneNumber: identifier },
          { email: identifier },
          { name: identifier },
        ],
      });
    } else {
      user = inMemoryDb.users.find(
        (u) =>
          u.phoneNumber === identifier ||
          u.email === identifier ||
          u.name.toLowerCase() === identifier.toLowerCase()
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your phone number and password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.',
      });
    }

    const userId = (user._id || user.id).toString();
    const token = signToken({
      id: userId,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      activeProfileId: user.activeProfileId || 'profile-1',
    });

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: userId,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        profiles: user.profiles,
        activeProfileId: user.activeProfileId || 'profile-1',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let user: any = null;
    if (isMongooseReady()) {
      user = await User.findById(userId).select('-password');
    } else {
      user = inMemoryDb.users.find((u) => u._id === userId || u.id === userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: (user._id || user.id).toString(),
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        profiles: user.profiles,
        activeProfileId: user.activeProfileId || 'profile-1',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, email, phoneNumber } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (isMongooseReady()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (email) user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      await user.save();

      return res.json({
        success: true,
        message: 'Personal info updated successfully',
        user: {
          id: (user._id as any).toString(),
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          profiles: user.profiles,
          activeProfileId: user.activeProfileId,
        },
      });
    }

    const user = inMemoryDb.users.find((u) => u._id === userId || u.id === userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    user.updatedAt = new Date();

    return res.json({
      success: true,
      message: 'Personal info updated successfully',
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        profiles: user.profiles,
        activeProfileId: user.activeProfileId,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Choose Profile / Add Profile / Switch Profile
export const addProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, avatar, isKids } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Profile name is required' });
    }

    const newProfile = {
      id: `profile-${Date.now()}`,
      name: name.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isKids: Boolean(isKids),
    };

    if (isMongooseReady()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.profiles.push(newProfile);
      user.activeProfileId = newProfile.id;
      await user.save();

      return res.json({
        success: true,
        message: 'Profile added successfully',
        profiles: user.profiles,
        activeProfileId: user.activeProfileId,
      });
    }

    const user = inMemoryDb.users.find((u) => u._id === userId || u.id === userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.profiles.push(newProfile);
    user.activeProfileId = newProfile.id;

    return res.json({
      success: true,
      message: 'Profile added successfully',
      profiles: user.profiles,
      activeProfileId: user.activeProfileId,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const switchProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({ success: false, message: 'profileId is required' });
    }

    if (isMongooseReady()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const found = user.profiles.find((p: any) => p.id === profileId);
      if (!found) return res.status(404).json({ success: false, message: 'Profile not found' });

      user.activeProfileId = profileId;
      await user.save();

      return res.json({
        success: true,
        message: `Switched to ${found.name}`,
        activeProfileId: profileId,
      });
    }

    const user = inMemoryDb.users.find((u) => u._id === userId || u.id === userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const found = user.profiles.find((p: any) => p.id === profileId);
    if (!found) return res.status(404).json({ success: false, message: 'Profile not found' });

    user.activeProfileId = profileId;
    return res.json({
      success: true,
      message: `Switched to ${found.name}`,
      activeProfileId: profileId,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
