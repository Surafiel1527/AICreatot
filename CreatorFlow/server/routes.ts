import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateContentIdeas, 
  generateHashtags, 
  generateVideoScript, 
  getTrendingTopics 
} from "./services/gemini";
import { searchImages, searchVideos, getContentCreationMedia } from "./services/media";
import { 
  insertContentIdeaSchema, 
  insertVideoContentSchema,
  insertHashtagsSchema,
  insertContentCalendarSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Content Ideas routes
  app.post('/api/content-ideas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestData = req.body;
      
      const generatedIdeas = await generateContentIdeas(requestData);
      
      const savedIdeas = await Promise.all(
        generatedIdeas.map(idea => 
          storage.createContentIdea({
            ...idea,
            userId,
            platform: requestData.platform,
            targetAudience: requestData.targetAudience,
            niche: requestData.niche
          })
        )
      );
      
      res.json(savedIdeas);
    } catch (error) {
      console.error("Error generating content ideas:", error);
      res.status(500).json({ message: "Failed to generate content ideas" });
    }
  });

  app.get('/api/content-ideas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const platform = req.query.platform as string;
      
      const ideas = await storage.getContentIdeas(userId, platform);
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching content ideas:", error);
      res.status(500).json({ message: "Failed to fetch content ideas" });
    }
  });

  app.patch('/api/content-ideas/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updated = await storage.updateContentIdea(id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating content idea:", error);
      res.status(500).json({ message: "Failed to update content idea" });
    }
  });

  app.delete('/api/content-ideas/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteContentIdea(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content idea:", error);
      res.status(500).json({ message: "Failed to delete content idea" });
    }
  });

  // Hashtags routes
  app.post('/api/hashtags', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestData = req.body;
      
      const generated = await generateHashtags(requestData);
      
      const saved = await storage.createHashtags({
        ...generated,
        userId,
        contentDescription: requestData.contentDescription,
        platform: requestData.platform,
        niche: requestData.niche
      });
      
      res.json(saved);
    } catch (error) {
      console.error("Error generating hashtags:", error);
      res.status(500).json({ message: "Failed to generate hashtags" });
    }
  });

  app.get('/api/hashtags', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const platform = req.query.platform as string;
      
      const hashtags = await storage.getHashtags(userId, platform);
      res.json(hashtags);
    } catch (error) {
      console.error("Error fetching hashtags:", error);
      res.status(500).json({ message: "Failed to fetch hashtags" });
    }
  });

  // Video Content routes
  app.post('/api/video-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestData = req.body;
      
      const script = await generateVideoScript(requestData);
      
      const saved = await storage.createVideoContent({
        userId,
        title: script.title,
        script: script.script,
        platform: requestData.platform,
        aspectRatio: requestData.aspectRatio,
        duration: requestData.duration,
        style: requestData.style,
        contentIdeaId: requestData.contentIdeaId || null,
        mediaUrls: [],
        status: 'draft'
      });
      
      res.json(saved);
    } catch (error) {
      console.error("Error generating video script:", error);
      res.status(500).json({ message: "Failed to generate video script" });
    }
  });

  app.get('/api/video-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const videos = await storage.getVideoContent(userId);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching video content:", error);
      res.status(500).json({ message: "Failed to fetch video content" });
    }
  });

  app.patch('/api/video-content/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updated = await storage.updateVideoContent(id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating video content:", error);
      res.status(500).json({ message: "Failed to update video content" });
    }
  });

  // Media search routes
  app.get('/api/media/search', isAuthenticated, async (req: any, res) => {
    try {
      const { query, type = 'images', platform, orientation, per_page = 15 } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      const searchOptions = {
        query: query as string,
        orientation: orientation as any,
        per_page: parseInt(per_page as string)
      };

      let results;
      if (type === 'videos') {
        results = await searchVideos(searchOptions);
      } else {
        results = await searchImages(searchOptions);
      }
      
      res.json(results);
    } catch (error) {
      console.error("Error searching media:", error);
      res.status(500).json({ message: "Failed to search media" });
    }
  });

  app.get('/api/media/content-creation', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, platform } = req.query;
      
      if (!topic || !platform) {
        return res.status(400).json({ message: "Topic and platform parameters are required" });
      }

      const media = await getContentCreationMedia(topic as string, platform as string);
      res.json(media);
    } catch (error) {
      console.error("Error fetching content creation media:", error);
      res.status(500).json({ message: "Failed to fetch content creation media" });
    }
  });

  // Content Calendar routes
  app.post('/api/content-calendar', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = { ...req.body, userId };
      
      const entry = await storage.createContentCalendarEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating calendar entry:", error);
      res.status(500).json({ message: "Failed to create calendar entry" });
    }
  });

  app.get('/api/content-calendar', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const calendar = await storage.getContentCalendar(userId);
      res.json(calendar);
    } catch (error) {
      console.error("Error fetching content calendar:", error);
      res.status(500).json({ message: "Failed to fetch content calendar" });
    }
  });

  // Platform Stats routes
  app.get('/api/platform-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getPlatformStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ message: "Failed to fetch platform stats" });
    }
  });

  app.post('/api/platform-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const statsData = { ...req.body, userId };
      
      const stats = await storage.upsertPlatformStats(statsData);
      res.json(stats);
    } catch (error) {
      console.error("Error updating platform stats:", error);
      res.status(500).json({ message: "Failed to update platform stats" });
    }
  });

  // Trending topics route
  app.get('/api/trending-topics', isAuthenticated, async (req: any, res) => {
    try {
      const { niche } = req.query;
      
      if (!niche) {
        return res.status(400).json({ message: "Niche parameter is required" });
      }

      const topics = await getTrendingTopics(niche as string);
      res.json({ topics });
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      res.status(500).json({ message: "Failed to fetch trending topics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
