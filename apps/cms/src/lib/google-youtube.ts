import { google, youtube_v3, youtubeAnalytics_v2 } from 'googleapis';
import { JWT } from 'google-auth-library';

// Interfaces
export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: Date;
  thumbnails: {
    default?: string;
    medium?: string;
    high?: string;
  };
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: Date;
  thumbnails: {
    default?: string;
    medium?: string;
    high?: string;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  tags?: string[];
}

export interface YouTubeAnalytics {
  date: Date;
  views: number;
  estimatedMinutesWatched: number;
  averageViewDuration: number;
  subscribersGained: number;
  subscribersLost: number;
  likes: number;
  dislikes: number;
  shares: number;
  comments: number;
}

export interface YouTubeMetrics {
  totalViews: number;
  totalWatchTime: number; // in hours
  totalSubscribers: number;
  totalVideos: number;
  averageViewDuration: number; // in seconds
  subscriberGrowth: number; // net change
  engagementRate: number; // (likes + comments) / views
}

// Service class
export class GoogleYouTubeService {
  private youtube: youtube_v3.Youtube;
  private analytics: youtubeAnalytics_v2.Youtubeanalytics;
  private auth: JWT;

  constructor(clientEmail: string, privateKey: string) {
    this.auth = new JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/yt-analytics.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl',
      ],
    });

    this.youtube = google.youtube({ version: 'v3', auth: this.auth });
    this.analytics = google.youtubeAnalytics({ version: 'v2', auth: this.auth });
  }

  // Get channel details
  async getChannelDetails(channelId: string): Promise<YouTubeChannel | null> {
    try {
      const response = await this.youtube.channels.list({
        part: ['snippet', 'statistics', 'brandingSettings'],
        id: [channelId],
      });

      if (!response.data.items || response.data.items.length === 0) {
        return null;
      }

      const channel = response.data.items[0];
      const snippet = channel.snippet;
      const statistics = channel.statistics;

      return {
        id: channel.id!,
        title: snippet?.title || '',
        description: snippet?.description || '',
        customUrl: snippet?.customUrl,
        publishedAt: new Date(snippet?.publishedAt || new Date()),
        thumbnails: {
          default: snippet?.thumbnails?.default?.url,
          medium: snippet?.thumbnails?.medium?.url,
          high: snippet?.thumbnails?.high?.url,
        },
        subscriberCount: parseInt(statistics?.subscriberCount || '0'),
        videoCount: parseInt(statistics?.videoCount || '0'),
        viewCount: parseInt(statistics?.viewCount || '0'),
      };
    } catch (error) {
      console.error('Failed to get channel details:', error);
      throw error;
    }
  }

  // Get recent videos
  async getRecentVideos(
    channelId: string,
    maxResults: number = 10
  ): Promise<YouTubeVideo[]> {
    try {
      // Get uploads playlist ID
      const channelResponse = await this.youtube.channels.list({
        part: ['contentDetails'],
        id: [channelId],
      });

      const uploadsPlaylistId =
        channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        return [];
      }

      // Get recent videos from uploads playlist
      const playlistResponse = await this.youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: uploadsPlaylistId,
        maxResults,
      });

      const videoIds =
        playlistResponse.data.items?.map((item) => item.snippet?.resourceId?.videoId!) || [];

      if (videoIds.length === 0) {
        return [];
      }

      // Get video statistics
      const videosResponse = await this.youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: videoIds,
      });

      const videos =
        videosResponse.data.items?.map((video) => ({
          id: video.id!,
          title: video.snippet?.title || '',
          description: video.snippet?.description || '',
          publishedAt: new Date(video.snippet?.publishedAt || new Date()),
          thumbnails: {
            default: video.snippet?.thumbnails?.default?.url,
            medium: video.snippet?.thumbnails?.medium?.url,
            high: video.snippet?.thumbnails?.high?.url,
          },
          viewCount: parseInt(video.statistics?.viewCount || '0'),
          likeCount: parseInt(video.statistics?.likeCount || '0'),
          commentCount: parseInt(video.statistics?.commentCount || '0'),
          duration: video.contentDetails?.duration || 'PT0S',
          tags: video.snippet?.tags,
        })) || [];

      return videos;
    } catch (error) {
      console.error('Failed to get recent videos:', error);
      throw error;
    }
  }

  // Get analytics data
  async getAnalytics(
    channelId: string,
    startDate: string, // YYYY-MM-DD
    endDate: string // YYYY-MM-DD
  ): Promise<YouTubeAnalytics[]> {
    try {
      const response = await this.analytics.reports.query({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: [
          'views',
          'estimatedMinutesWatched',
          'averageViewDuration',
          'subscribersGained',
          'subscribersLost',
          'likes',
          'dislikes',
          'shares',
          'comments',
        ].join(','),
        dimensions: 'day',
        sort: 'day',
      });

      const headers = response.data.columnHeaders?.map((h) => h.name!) || [];
      const rows = response.data.rows || [];

      return rows.map((row) => {
        const data: any = {};
        headers.forEach((header, index) => {
          data[header] = row[index];
        });

        return {
          date: new Date(data.day),
          views: parseInt(data.views || '0'),
          estimatedMinutesWatched: parseInt(data.estimatedMinutesWatched || '0'),
          averageViewDuration: parseFloat(data.averageViewDuration || '0'),
          subscribersGained: parseInt(data.subscribersGained || '0'),
          subscribersLost: parseInt(data.subscribersLost || '0'),
          likes: parseInt(data.likes || '0'),
          dislikes: parseInt(data.dislikes || '0'),
          shares: parseInt(data.shares || '0'),
          comments: parseInt(data.comments || '0'),
        };
      });
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }

  // Get summary metrics
  async getSummaryMetrics(
    channelId: string,
    startDate: string,
    endDate: string
  ): Promise<YouTubeMetrics> {
    try {
      const analytics = await this.getAnalytics(channelId, startDate, endDate);

      const totalViews = analytics.reduce((sum, day) => sum + day.views, 0);
      const totalWatchTime =
        analytics.reduce((sum, day) => sum + day.estimatedMinutesWatched, 0) / 60; // Convert to hours
      const totalSubscribersGained = analytics.reduce(
        (sum, day) => sum + day.subscribersGained,
        0
      );
      const totalSubscribersLost = analytics.reduce(
        (sum, day) => sum + day.subscribersLost,
        0
      );
      const subscriberGrowth = totalSubscribersGained - totalSubscribersLost;

      const totalLikes = analytics.reduce((sum, day) => sum + day.likes, 0);
      const totalComments = analytics.reduce((sum, day) => sum + day.comments, 0);
      const engagementRate =
        totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

      const avgViewDuration =
        analytics.length > 0
          ? analytics.reduce((sum, day) => sum + day.averageViewDuration, 0) /
            analytics.length
          : 0;

      // Get current channel stats
      const channel = await this.getChannelDetails(channelId);

      return {
        totalViews,
        totalWatchTime,
        totalSubscribers: channel?.subscriberCount || 0,
        totalVideos: channel?.videoCount || 0,
        averageViewDuration: avgViewDuration,
        subscriberGrowth,
        engagementRate,
      };
    } catch (error) {
      console.error('Failed to get summary metrics:', error);
      throw error;
    }
  }

  // Get top videos by views
  async getTopVideos(
    channelId: string,
    startDate: string,
    endDate: string,
    maxResults: number = 10
  ): Promise<Array<{ videoId: string; views: number; title?: string }>> {
    try {
      const response = await this.analytics.reports.query({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'views',
        dimensions: 'video',
        sort: '-views',
        maxResults,
      });

      const rows = response.data.rows || [];

      // Get video details
      const videoIds = rows.map((row) => row[0] as string);
      const videos = await Promise.all(
        videoIds.map(async (videoId) => {
          try {
            const videoResponse = await this.youtube.videos.list({
              part: ['snippet'],
              id: [videoId],
            });
            return videoResponse.data.items?.[0]?.snippet?.title;
          } catch {
            return undefined;
          }
        })
      );

      return rows.map((row, index) => ({
        videoId: row[0] as string,
        views: parseInt(row[1] as string),
        title: videos[index],
      }));
    } catch (error) {
      console.error('Failed to get top videos:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      // Try to list channels (requires minimal permissions)
      const response = await this.youtube.channels.list({
        part: ['id'],
        mine: true,
      });
      return !!response.data;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Factory function
export async function createYouTubeService(
  clientEmail?: string,
  privateKey?: string
): Promise<GoogleYouTubeService> {
  const email = clientEmail || process.env.GOOGLE_YOUTUBE_CLIENT_EMAIL;
  const key = privateKey || process.env.GOOGLE_YOUTUBE_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error('YouTube API credentials not configured');
  }

  return new GoogleYouTubeService(email, key);
}
