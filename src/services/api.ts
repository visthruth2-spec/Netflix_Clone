export interface MovieItem {
  _id: string;
  id?: string;
  title: string;
  type: 'movie' | 'show';
  category: string;
  language: 'Telugu' | 'Hindi' | 'English';
  languages?: string[];
  genres: string[];
  synopsis: string;
  rating: number;
  duration: string;
  releaseYear: number;
  thumbnailUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  director?: string;
  cast?: string[];
  maturityRating?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
}

export interface UserData {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  profiles: UserProfile[];
  activeProfileId: string;
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('netflix_token');
};

const authHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Movies
  async getWireframeCategories(view: 'home' | 'movies' | 'shows'): Promise<{ name: string; items: MovieItem[] }[]> {
    const res = await fetch(`/api/movies/wireframe-categories?view=${view}`);
    const data = await res.json();
    return data.data || [];
  },

  async getAllMovies(params?: { type?: string; category?: string; language?: string; genre?: string }): Promise<MovieItem[]> {
    const cleanParams: Record<string, string> = {};
    if (params) {
      if (params.type && params.type !== 'undefined') cleanParams.type = params.type;
      if (params.category && params.category !== 'undefined') cleanParams.category = params.category;
      if (params.language && params.language !== 'undefined') cleanParams.language = params.language;
      if (params.genre && params.genre !== 'undefined') cleanParams.genre = params.genre;
    }
    const query = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`/api/movies${query ? `?${query}` : ''}`);
    const data = await res.json();
    return data.data || [];
  },

  async searchMovies(params: { q?: string; language?: string; genre?: string }): Promise<MovieItem[]> {
    const cleanParams: Record<string, string> = {};
    if (params.q && params.q.trim() && params.q !== 'undefined') {
      cleanParams.q = params.q.trim();
    }
    if (params.language && params.language.trim() && params.language !== 'undefined') {
      cleanParams.language = params.language.trim();
    }
    if (params.genre && params.genre.trim() && params.genre !== 'undefined') {
      cleanParams.genre = params.genre.trim();
    }
    const query = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`/api/movies/search${query ? `?${query}` : ''}`);
    const data = await res.json();
    return data.data || [];
  },

  async getMovieById(id: string): Promise<MovieItem | null> {
    const res = await fetch(`/api/movies/${id}`);
    const data = await res.json();
    return data.data || null;
  },

  // Auth & Verification
  async verifyAndRegister(payload: { name: string; phoneNumber: string; password: string; email?: string }): Promise<{ token: string; user: UserData }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Verification failed');
    }
    return data;
  },

  async login(payload: { identifier: string; password: string }): Promise<{ token: string; user: UserData }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  async getCurrentUser(): Promise<UserData | null> {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', { headers: authHeaders() });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  },

  async updateProfile(payload: { name?: string; email?: string; phoneNumber?: string }): Promise<UserData> {
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update personal info');
    return data.user;
  },

  async addProfile(payload: { name: string; avatar?: string }): Promise<UserProfile[]> {
    const res = await fetch('/api/auth/profile/add', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add profile');
    return data.profiles;
  },

  async switchProfile(profileId: string): Promise<void> {
    const res = await fetch('/api/auth/profile/switch', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ profileId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to switch profile');
  },

  // Watchlist
  async getWatchlist(profileId?: string): Promise<{ movieIds: string[]; data: MovieItem[] }> {
    const res = await fetch(`/api/watchlist${profileId ? `?profileId=${profileId}` : ''}`, {
      headers: authHeaders(),
    });
    if (!res.ok) {
      return { movieIds: [], data: [] };
    }
    const data = await res.json();
    return {
      movieIds: data.movieIds || [],
      data: data.data || [],
    };
  },

  async addToWatchlist(movieId: string, profileId?: string): Promise<string[]> {
    const res = await fetch('/api/watchlist/add', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ movieId, profileId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add to watchlist');
    return data.movieIds || [];
  },

  async removeFromWatchlist(movieId: string, profileId?: string): Promise<string[]> {
    const res = await fetch(`/api/watchlist/${movieId}`, {
      method: 'DELETE',
      headers: authHeaders(),
      body: JSON.stringify({ profileId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to remove from watchlist');
    return data.movieIds || [];
  },

  // System status
  async getSystemStatus(): Promise<any> {
    const res = await fetch('/api/system/status');
    return res.json();
  },
};
