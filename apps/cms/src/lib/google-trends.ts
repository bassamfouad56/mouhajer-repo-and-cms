/**
 * Google Trends API Integration
 *
 * Provides keyword research, trending topics, and content planning insights.
 * Uses the unofficial google-trends-api package.
 */

import googleTrends from 'google-trends-api';

export interface TrendsKeyword {
  keyword: string;
  geo?: string; // Country code (e.g., 'US', 'AE', 'GB')
  category?: number; // Category ID
  timeRange?: string; // e.g., 'today 12-m', 'today 3-m', 'now 7-d'
}

export interface TrendsInterestOverTime {
  keyword: string;
  data: Array<{
    time: string; // ISO date string
    value: number; // 0-100
    formattedTime: string;
    formattedValue: string;
  }>;
  averageValue: number;
}

export interface TrendsRelatedQuery {
  query: string;
  value: number;
  formattedValue: string;
  link: string;
}

export interface TrendsRegionalInterest {
  geo: string;
  geoName: string;
  value: number;
  formattedValue: string;
  maxValueIndex: number;
}

export interface TrendsRealtime {
  title: string;
  formattedTraffic: string;
  image?: {
    newsUrl: string;
    source: string;
    imageUrl: string;
  };
  articles: Array<{
    title: string;
    timeAgo: string;
    source: string;
    image?: {
      newsUrl: string;
      source: string;
      imageUrl: string;
    };
    url: string;
    snippet: string;
  }>;
  shareUrl: string;
}

export interface TrendsComparison {
  keywords: string[];
  data: Array<{
    time: string;
    values: number[]; // One value per keyword
    formattedTime: string;
  }>;
  averages: number[]; // Average for each keyword
}

export class GoogleTrendsService {
  /**
   * Get interest over time for a keyword
   */
  async getInterestOverTime(
    keyword: string,
    geo: string = '',
    timeRange: string = 'today 12-m'
  ): Promise<TrendsInterestOverTime> {
    try {
      console.log(`[Trends] Fetching interest over time for "${keyword}" (${geo || 'worldwide'}, ${timeRange})...`);

      const result = await googleTrends.interestOverTime({
        keyword,
        geo,
        granularTimeResolution: false,
        startTime: this.parseTimeRange(timeRange).startTime,
        endTime: new Date(),
      });

      const parsed = JSON.parse(result);
      const timelineData = parsed.default.timelineData || [];

      const data = timelineData.map((point: any) => ({
        time: new Date(point.time * 1000).toISOString(),
        value: point.value[0] || 0,
        formattedTime: point.formattedTime,
        formattedValue: point.formattedValue[0] || '0',
      }));

      const values = data.map((d: any) => d.value).filter((v: number) => v > 0);
      const averageValue = values.length > 0
        ? Math.round(values.reduce((sum: number, v: number) => sum + v, 0) / values.length)
        : 0;

      console.log(`[Trends] Interest over time fetched. Average: ${averageValue}`);

      return {
        keyword,
        data,
        averageValue,
      };
    } catch (error) {
      console.error('[Trends] Failed to fetch interest over time:', error);
      throw error;
    }
  }

  /**
   * Get related queries for a keyword
   */
  async getRelatedQueries(
    keyword: string,
    geo: string = '',
    timeRange: string = 'today 12-m'
  ): Promise<{ top: TrendsRelatedQuery[]; rising: TrendsRelatedQuery[] }> {
    try {
      console.log(`[Trends] Fetching related queries for "${keyword}"...`);

      const result = await googleTrends.relatedQueries({
        keyword,
        geo,
        startTime: this.parseTimeRange(timeRange).startTime,
        endTime: new Date(),
      });

      const parsed = JSON.parse(result);
      const rankedList = parsed.default.rankedList || [];

      let top: TrendsRelatedQuery[] = [];
      let rising: TrendsRelatedQuery[] = [];

      rankedList.forEach((list: any) => {
        const queries = (list.rankedKeyword || []).map((item: any) => ({
          query: item.query,
          value: item.value,
          formattedValue: item.formattedValue,
          link: item.link,
        }));

        if (list.rankedKeyword && list.rankedKeyword.length > 0) {
          // Check if it's top or rising based on the presence of 'Breakout' values
          const hasBreakout = queries.some((q: any) => q.formattedValue === 'Breakout');
          if (hasBreakout || rising.length === 0) {
            rising = queries;
          } else {
            top = queries;
          }
        }
      });

      console.log(`[Trends] Related queries fetched. Top: ${top.length}, Rising: ${rising.length}`);

      return { top, rising };
    } catch (error) {
      console.error('[Trends] Failed to fetch related queries:', error);
      throw error;
    }
  }

  /**
   * Get regional interest for a keyword
   */
  async getRegionalInterest(
    keyword: string,
    geo: string = '',
    timeRange: string = 'today 12-m'
  ): Promise<TrendsRegionalInterest[]> {
    try {
      console.log(`[Trends] Fetching regional interest for "${keyword}"...`);

      const result = await googleTrends.interestByRegion({
        keyword,
        geo,
        startTime: this.parseTimeRange(timeRange).startTime,
        endTime: new Date(),
      });

      const parsed = JSON.parse(result);
      const geoMapData = parsed.default.geoMapData || [];

      const regional = geoMapData.map((region: any) => ({
        geo: region.geoCode,
        geoName: region.geoName,
        value: region.value[0] || 0,
        formattedValue: region.formattedValue[0] || '0',
        maxValueIndex: region.maxValueIndex,
      }));

      console.log(`[Trends] Regional interest fetched. ${regional.length} regions`);

      return regional;
    } catch (error) {
      console.error('[Trends] Failed to fetch regional interest:', error);
      throw error;
    }
  }

  /**
   * Get real-time trending searches
   */
  async getRealTimeTrends(geo: string = 'US'): Promise<TrendsRealtime[]> {
    try {
      console.log(`[Trends] Fetching real-time trends for ${geo}...`);

      const result = await googleTrends.realTimeTrends({
        geo,
        category: 'all',
      });

      const parsed = JSON.parse(result);
      const storySummaries = parsed.storySummaries || [];

      const trends = storySummaries.map((story: any) => ({
        title: story.title,
        formattedTraffic: story.formattedTraffic,
        image: story.image ? {
          newsUrl: story.image.newsUrl,
          source: story.image.source,
          imageUrl: story.image.imageUrl,
        } : undefined,
        articles: (story.articles || []).map((article: any) => ({
          title: article.articleTitle,
          timeAgo: article.timeAgo,
          source: article.source,
          image: article.image ? {
            newsUrl: article.image.newsUrl,
            source: article.image.source,
            imageUrl: article.image.imageUrl,
          } : undefined,
          url: article.url,
          snippet: article.snippet,
        })),
        shareUrl: story.shareUrl,
      }));

      console.log(`[Trends] Real-time trends fetched. ${trends.length} trending topics`);

      return trends;
    } catch (error) {
      console.error('[Trends] Failed to fetch real-time trends:', error);
      throw error;
    }
  }

  /**
   * Compare multiple keywords
   */
  async compareKeywords(
    keywords: string[],
    geo: string = '',
    timeRange: string = 'today 12-m'
  ): Promise<TrendsComparison> {
    try {
      console.log(`[Trends] Comparing keywords: ${keywords.join(', ')}...`);

      const result = await googleTrends.interestOverTime({
        keyword: keywords,
        geo,
        granularTimeResolution: false,
        startTime: this.parseTimeRange(timeRange).startTime,
        endTime: new Date(),
      });

      const parsed = JSON.parse(result);
      const timelineData = parsed.default.timelineData || [];

      const data = timelineData.map((point: any) => {
        const values = keywords.map((_, index) => point.value[index] || 0);
        return {
          time: new Date(point.time * 1000).toISOString(),
          values,
          formattedTime: point.formattedTime,
        };
      });

      // Calculate average for each keyword
      const averages = keywords.map((_, index) => {
        const values = data
          .map((d: any) => d.values[index])
          .filter((v: number) => v > 0);
        return values.length > 0
          ? Math.round(values.reduce((sum: number, v: number) => sum + v, 0) / values.length)
          : 0;
      });

      console.log(`[Trends] Keyword comparison complete. Averages: ${averages.join(', ')}`);

      return {
        keywords,
        data,
        averages,
      };
    } catch (error) {
      console.error('[Trends] Failed to compare keywords:', error);
      throw error;
    }
  }

  /**
   * Get suggestions for autocomplete
   */
  async getAutocompleteSuggestions(keyword: string): Promise<string[]> {
    try {
      console.log(`[Trends] Fetching autocomplete suggestions for "${keyword}"...`);

      const result = await googleTrends.autoComplete({
        keyword,
      });

      const parsed = JSON.parse(result);
      const suggestions = (parsed.default.topics || []).map((topic: any) => topic.title);

      console.log(`[Trends] ${suggestions.length} suggestions found`);

      return suggestions;
    } catch (error) {
      console.error('[Trends] Failed to fetch autocomplete suggestions:', error);
      throw error;
    }
  }

  /**
   * Helper: Parse time range string to start date
   */
  private parseTimeRange(timeRange: string): { startTime: Date } {
    const now = new Date();
    let startTime = new Date();

    if (timeRange === 'now 1-H') {
      startTime.setHours(now.getHours() - 1);
    } else if (timeRange === 'now 4-H') {
      startTime.setHours(now.getHours() - 4);
    } else if (timeRange === 'now 7-d') {
      startTime.setDate(now.getDate() - 7);
    } else if (timeRange === 'today 1-m') {
      startTime.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'today 3-m') {
      startTime.setMonth(now.getMonth() - 3);
    } else if (timeRange === 'today 12-m') {
      startTime.setMonth(now.getMonth() - 12);
    } else if (timeRange === 'today 5-y') {
      startTime.setFullYear(now.getFullYear() - 5);
    } else {
      // Default to 12 months
      startTime.setMonth(now.getMonth() - 12);
    }

    return { startTime };
  }
}

/**
 * Factory function to create Trends service
 */
export function createTrendsService(): GoogleTrendsService {
  return new GoogleTrendsService();
}
