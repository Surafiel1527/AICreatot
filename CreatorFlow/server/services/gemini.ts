import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface ContentIdeaRequest {
  topic: string;
  platform: string;
  targetAudience: string;
  contentStyle: string;
  duration: string;
  niche: string;
}

export interface GeneratedContentIdea {
  title: string;
  description: string;
  hook: string;
  hashtags: string[];
  keywords: string[];
  estimatedViews: number;
  estimatedEngagement: string;
  contentStyle: string;
  duration: string;
}

export interface HashtagRequest {
  contentDescription: string;
  platform: string;
  niche: string;
}

export interface GeneratedHashtags {
  tags: string[];
  trendingScore: number;
}

export interface VideoScriptRequest {
  topic: string;
  style: string;
  duration: string;
  platform: string;
  outline?: string;
}

export interface GeneratedVideoScript {
  script: string;
  title: string;
  description: string;
  keyPoints: string[];
}

export async function generateContentIdeas(request: ContentIdeaRequest): Promise<GeneratedContentIdea[]> {
  try {
    const prompt = `Generate 3 viral content ideas for ${request.platform} about "${request.topic}".

Target Audience: ${request.targetAudience}
Content Style: ${request.contentStyle}
Duration: ${request.duration}
Niche: ${request.niche}

For each idea, provide:
- A compelling title
- Detailed description with hook
- Engaging opening hook
- 8-12 relevant hashtags
- 5-8 keywords
- Estimated view count
- Estimated engagement rate

Focus on trending, viral potential content that will maximize engagement and growth.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            ideas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  hook: { type: "string" },
                  hashtags: { 
                    type: "array",
                    items: { type: "string" }
                  },
                  keywords: {
                    type: "array", 
                    items: { type: "string" }
                  },
                  estimatedViews: { type: "number" },
                  estimatedEngagement: { type: "string" },
                  contentStyle: { type: "string" },
                  duration: { type: "string" }
                },
                required: ["title", "description", "hook", "hashtags", "keywords", "estimatedViews", "estimatedEngagement"]
              }
            }
          },
          required: ["ideas"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result.ideas || [];
  } catch (error) {
    console.error("Error generating content ideas:", error);
    throw new Error(`Failed to generate content ideas: ${error}`);
  }
}

export async function generateHashtags(request: HashtagRequest): Promise<GeneratedHashtags> {
  try {
    const prompt = `Generate optimized hashtags for ${request.platform} content about "${request.contentDescription}".

Platform: ${request.platform}
Niche: ${request.niche}

Generate 15-30 hashtags including:
- Trending hashtags for the platform
- Niche-specific hashtags  
- Content-specific hashtags
- Mix of popular and niche tags for optimal reach

Also provide a trending score (1-100) based on current trends.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            tags: {
              type: "array",
              items: { type: "string" }
            },
            trendingScore: { type: "number" }
          },
          required: ["tags", "trendingScore"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return {
      tags: result.tags || [],
      trendingScore: result.trendingScore || 50
    };
  } catch (error) {
    console.error("Error generating hashtags:", error);
    throw new Error(`Failed to generate hashtags: ${error}`);
  }
}

export async function generateVideoScript(request: VideoScriptRequest): Promise<GeneratedVideoScript> {
  try {
    const prompt = `Create a detailed video script for ${request.platform} about "${request.topic}".

Style: ${request.style}
Duration: ${request.duration}
Platform: ${request.platform}
${request.outline ? `Outline: ${request.outline}` : ''}

Generate:
- Complete script with timestamps
- Engaging title 
- Video description
- Key talking points
- Call-to-action

Make it engaging, platform-optimized, and designed for maximum retention and engagement.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json", 
        responseSchema: {
          type: "object",
          properties: {
            script: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            keyPoints: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["script", "title", "description", "keyPoints"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return {
      script: result.script || "",
      title: result.title || "",
      description: result.description || "",
      keyPoints: result.keyPoints || []
    };
  } catch (error) {
    console.error("Error generating video script:", error);
    throw new Error(`Failed to generate video script: ${error}`);
  }
}

export async function getTrendingTopics(niche: string): Promise<string[]> {
  try {
    const prompt = `List 10 trending topics and keywords in the ${niche} niche for content creation. 
    Focus on what's currently viral and engaging on social media platforms.
    Return just the topics as an array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object", 
          properties: {
            topics: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["topics"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result.topics || [];
  } catch (error) {
    console.error("Error getting trending topics:", error);
    throw new Error(`Failed to get trending topics: ${error}`);
  }
}
