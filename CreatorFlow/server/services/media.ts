interface MediaSearchOptions {
  query: string;
  category?: string;
  orientation?: 'horizontal' | 'vertical' | 'square';
  size?: 'small' | 'medium' | 'large';
  per_page?: number;
}

interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  downloadUrl: string;
  source: 'pexels' | 'pixabay';
  tags: string[];
  author?: string;
  license?: string;
}

export async function searchImages(options: MediaSearchOptions): Promise<MediaItem[]> {
  const results: MediaItem[] = [];

  // Search Pexels
  if (process.env.PEXELS_API_KEY) {
    try {
      const pexelsResults = await searchPexelsImages(options);
      results.push(...pexelsResults);
    } catch (error) {
      console.error("Pexels search error:", error);
    }
  }

  // Search Pixabay
  if (process.env.PIXABAY_API_KEY) {
    try {
      const pixabayResults = await searchPixabayImages(options);
      results.push(...pixabayResults);
    } catch (error) {
      console.error("Pixabay search error:", error);
    }
  }

  return results;
}

export async function searchVideos(options: MediaSearchOptions): Promise<MediaItem[]> {
  const results: MediaItem[] = [];

  // Search Pexels Videos
  if (process.env.PEXELS_API_KEY) {
    try {
      const pexelsResults = await searchPexelsVideos(options);
      results.push(...pexelsResults);
    } catch (error) {
      console.error("Pexels videos search error:", error);
    }
  }

  // Search Pixabay Videos
  if (process.env.PIXABAY_API_KEY) {
    try {
      const pixabayResults = await searchPixabayVideos(options);
      results.push(...pixabayResults);
    } catch (error) {
      console.error("Pixabay videos search error:", error);
    }
  }

  return results;
}

async function searchPexelsImages(options: MediaSearchOptions): Promise<MediaItem[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error("Pexels API key not found");

  const params = new URLSearchParams({
    query: options.query,
    per_page: (options.per_page || 15).toString(),
    orientation: options.orientation || 'all'
  });

  const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: {
      'Authorization': apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.photos?.map((photo: any) => ({
    id: photo.id.toString(),
    url: photo.src.large,
    thumbnailUrl: photo.src.medium,
    downloadUrl: photo.src.original,
    source: 'pexels' as const,
    tags: [],
    author: photo.photographer,
    license: 'Pexels License'
  })) || [];
}

async function searchPexelsVideos(options: MediaSearchOptions): Promise<MediaItem[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error("Pexels API key not found");

  const params = new URLSearchParams({
    query: options.query,
    per_page: (options.per_page || 10).toString(),
    orientation: options.orientation || 'all'
  });

  const response = await fetch(`https://api.pexels.com/videos/search?${params}`, {
    headers: {
      'Authorization': apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`Pexels Videos API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.videos?.map((video: any) => ({
    id: video.id.toString(),
    url: video.video_files[0]?.link || '',
    thumbnailUrl: video.image,
    downloadUrl: video.video_files[0]?.link || '',
    source: 'pexels' as const,
    tags: [],
    author: video.user?.name,
    license: 'Pexels License'
  })) || [];
}

async function searchPixabayImages(options: MediaSearchOptions): Promise<MediaItem[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) throw new Error("Pixabay API key not found");

  const params = new URLSearchParams({
    key: apiKey,
    q: options.query,
    image_type: 'photo',
    per_page: (options.per_page || 15).toString(),
    safesearch: 'true',
    orientation: options.orientation || 'all'
  });

  const response = await fetch(`https://pixabay.com/api/?${params}`);

  if (!response.ok) {
    throw new Error(`Pixabay API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.hits?.map((hit: any) => ({
    id: hit.id.toString(),
    url: hit.largeImageURL,
    thumbnailUrl: hit.webformatURL,
    downloadUrl: hit.fullHDURL || hit.largeImageURL,
    source: 'pixabay' as const,
    tags: hit.tags.split(', '),
    author: hit.user,
    license: 'Pixabay License'
  })) || [];
}

async function searchPixabayVideos(options: MediaSearchOptions): Promise<MediaItem[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) throw new Error("Pixabay API key not found");

  const params = new URLSearchParams({
    key: apiKey,
    q: options.query,
    video_type: 'all',
    per_page: (options.per_page || 10).toString(),
    safesearch: 'true'
  });

  const response = await fetch(`https://pixabay.com/api/videos/?${params}`);

  if (!response.ok) {
    throw new Error(`Pixabay Videos API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.hits?.map((hit: any) => ({
    id: hit.id.toString(),
    url: hit.videos.large.url,
    thumbnailUrl: hit.picture_id,
    downloadUrl: hit.videos.large.url,
    source: 'pixabay' as const,
    tags: hit.tags.split(', '),
    author: hit.user,
    license: 'Pixabay License'
  })) || [];
}

export async function getContentCreationMedia(topic: string, platform: string): Promise<{
  images: MediaItem[];
  videos: MediaItem[];
}> {
  const searchOptions: MediaSearchOptions = {
    query: `${topic} content creation`,
    per_page: 12,
    orientation: platform === 'tiktok' || platform === 'instagram' ? 'vertical' : 'horizontal'
  };

  const [images, videos] = await Promise.all([
    searchImages(searchOptions),
    searchVideos(searchOptions)
  ]);

  return { images, videos };
}
