import {
  users,
  contentIdeas,
  videoContent,
  hashtags,
  contentCalendar,
  platformStats,
  type User,
  type UpsertUser,
  type ContentIdea,
  type InsertContentIdea,
  type VideoContent,
  type InsertVideoContent,
  type Hashtags,
  type InsertHashtags,
  type ContentCalendar,
  type InsertContentCalendar,
  type PlatformStats,
  type InsertPlatformStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Content Ideas operations
  createContentIdea(idea: InsertContentIdea): Promise<ContentIdea>;
  getContentIdeas(userId: string, platform?: string): Promise<ContentIdea[]>;
  updateContentIdea(id: string, updates: Partial<InsertContentIdea>): Promise<ContentIdea>;
  deleteContentIdea(id: string): Promise<void>;
  
  // Video Content operations
  createVideoContent(video: InsertVideoContent): Promise<VideoContent>;
  getVideoContent(userId: string): Promise<VideoContent[]>;
  updateVideoContent(id: string, updates: Partial<InsertVideoContent>): Promise<VideoContent>;
  deleteVideoContent(id: string): Promise<void>;
  
  // Hashtags operations
  createHashtags(hashtags: InsertHashtags): Promise<Hashtags>;
  getHashtags(userId: string, platform?: string): Promise<Hashtags[]>;
  
  // Content Calendar operations
  createContentCalendarEntry(entry: InsertContentCalendar): Promise<ContentCalendar>;
  getContentCalendar(userId: string): Promise<ContentCalendar[]>;
  updateContentCalendarEntry(id: string, updates: Partial<InsertContentCalendar>): Promise<ContentCalendar>;
  deleteContentCalendarEntry(id: string): Promise<void>;
  
  // Platform Stats operations
  upsertPlatformStats(stats: InsertPlatformStats): Promise<PlatformStats>;
  getPlatformStats(userId: string): Promise<PlatformStats[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Content Ideas operations
  async createContentIdea(idea: InsertContentIdea): Promise<ContentIdea> {
    const [contentIdea] = await db.insert(contentIdeas).values(idea).returning();
    return contentIdea;
  }

  async getContentIdeas(userId: string, platform?: string): Promise<ContentIdea[]> {
    const query = db.select().from(contentIdeas).where(eq(contentIdeas.userId, userId));
    
    if (platform) {
      return await query.where(and(eq(contentIdeas.userId, userId), eq(contentIdeas.platform, platform)))
        .orderBy(desc(contentIdeas.createdAt));
    }
    
    return await query.orderBy(desc(contentIdeas.createdAt));
  }

  async updateContentIdea(id: string, updates: Partial<InsertContentIdea>): Promise<ContentIdea> {
    const [updated] = await db
      .update(contentIdeas)
      .set(updates)
      .where(eq(contentIdeas.id, id))
      .returning();
    return updated;
  }

  async deleteContentIdea(id: string): Promise<void> {
    await db.delete(contentIdeas).where(eq(contentIdeas.id, id));
  }

  // Video Content operations
  async createVideoContent(video: InsertVideoContent): Promise<VideoContent> {
    const [videoContentResult] = await db.insert(videoContent).values(video).returning();
    return videoContentResult;
  }

  async getVideoContent(userId: string): Promise<VideoContent[]> {
    return await db
      .select()
      .from(videoContent)
      .where(eq(videoContent.userId, userId))
      .orderBy(desc(videoContent.createdAt));
  }

  async updateVideoContent(id: string, updates: Partial<InsertVideoContent>): Promise<VideoContent> {
    const [updated] = await db
      .update(videoContent)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(videoContent.id, id))
      .returning();
    return updated;
  }

  async deleteVideoContent(id: string): Promise<void> {
    await db.delete(videoContent).where(eq(videoContent.id, id));
  }

  // Hashtags operations
  async createHashtags(hashtagsData: InsertHashtags): Promise<Hashtags> {
    const [hashtagsResult] = await db.insert(hashtags).values(hashtagsData).returning();
    return hashtagsResult;
  }

  async getHashtags(userId: string, platform?: string): Promise<Hashtags[]> {
    const query = db.select().from(hashtags).where(eq(hashtags.userId, userId));
    
    if (platform) {
      return await query.where(and(eq(hashtags.userId, userId), eq(hashtags.platform, platform)))
        .orderBy(desc(hashtags.createdAt));
    }
    
    return await query.orderBy(desc(hashtags.createdAt));
  }

  // Content Calendar operations
  async createContentCalendarEntry(entry: InsertContentCalendar): Promise<ContentCalendar> {
    const [calendarEntry] = await db.insert(contentCalendar).values(entry).returning();
    return calendarEntry;
  }

  async getContentCalendar(userId: string): Promise<ContentCalendar[]> {
    return await db
      .select()
      .from(contentCalendar)
      .where(eq(contentCalendar.userId, userId))
      .orderBy(contentCalendar.scheduledDate);
  }

  async updateContentCalendarEntry(id: string, updates: Partial<InsertContentCalendar>): Promise<ContentCalendar> {
    const [updated] = await db
      .update(contentCalendar)
      .set(updates)
      .where(eq(contentCalendar.id, id))
      .returning();
    return updated;
  }

  async deleteContentCalendarEntry(id: string): Promise<void> {
    await db.delete(contentCalendar).where(eq(contentCalendar.id, id));
  }

  // Platform Stats operations
  async upsertPlatformStats(stats: InsertPlatformStats): Promise<PlatformStats> {
    const [platformStatsResult] = await db
      .insert(platformStats)
      .values(stats)
      .onConflictDoUpdate({
        target: [platformStats.userId, platformStats.platform],
        set: {
          ...stats,
          updatedAt: new Date(),
        },
      })
      .returning();
    return platformStatsResult;
  }

  async getPlatformStats(userId: string): Promise<PlatformStats[]> {
    return await db
      .select()
      .from(platformStats)
      .where(eq(platformStats.userId, userId));
  }
}

export const storage = new DatabaseStorage();
