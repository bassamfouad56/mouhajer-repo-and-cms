/**
 * Google PageSpeed Insights API Integration
 *
 * Provides performance monitoring and Core Web Vitals tracking for your website.
 * Uses the PageSpeed Insights API v5 to analyze page performance.
 */

export interface PageSpeedMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint (ms)
  fid: number | null; // First Input Delay (ms)
  cls: number | null; // Cumulative Layout Shift (score)
  fcp: number | null; // First Contentful Paint (ms)
  ttfb: number | null; // Time to First Byte (ms)

  // Performance Score
  performanceScore: number; // 0-100

  // Additional Metrics
  speedIndex: number | null;
  totalBlockingTime: number | null;
  interactive: number | null;
}

export interface PageSpeedResult {
  url: string;
  strategy: 'mobile' | 'desktop';
  timestamp: Date;

  // Metrics
  metrics: PageSpeedMetrics;

  // Opportunities (suggestions for improvement)
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
    savings: number | null; // milliseconds saved
  }>;

  // Diagnostics
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
  }>;

  // Overall assessment
  loadingExperience?: {
    overall_category: 'FAST' | 'AVERAGE' | 'SLOW';
    metrics: {
      [key: string]: {
        category: 'FAST' | 'AVERAGE' | 'SLOW';
        percentile: number;
      };
    };
  };
}

export interface PageSpeedConfig {
  apiKey: string;
  urls: string[];
  strategies: ('mobile' | 'desktop')[];
  categories: string[]; // ['performance', 'accessibility', 'best-practices', 'seo', 'pwa']
}

export class GooglePageSpeedService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Analyze a URL with PageSpeed Insights
   */
  async analyzeUrl(
    url: string,
    strategy: 'mobile' | 'desktop' = 'mobile',
    categories: string[] = ['performance']
  ): Promise<PageSpeedResult> {
    try {
      const params = new URLSearchParams({
        url,
        key: this.apiKey,
        strategy,
        category: 'performance', // We focus on performance
      });

      console.log(`[PageSpeed] Analyzing ${url} (${strategy})...`);

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`PageSpeed API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();

      // Extract metrics from the response
      const lighthouseMetrics = data.lighthouseResult?.audits || {};
      const categories = data.lighthouseResult?.categories || {};

      const metrics: PageSpeedMetrics = {
        lcp: this.extractMetric(lighthouseMetrics['largest-contentful-paint']?.numericValue),
        fid: this.extractMetric(lighthouseMetrics['max-potential-fid']?.numericValue),
        cls: this.extractMetric(lighthouseMetrics['cumulative-layout-shift']?.numericValue),
        fcp: this.extractMetric(lighthouseMetrics['first-contentful-paint']?.numericValue),
        ttfb: this.extractMetric(lighthouseMetrics['server-response-time']?.numericValue),
        performanceScore: Math.round((categories.performance?.score || 0) * 100),
        speedIndex: this.extractMetric(lighthouseMetrics['speed-index']?.numericValue),
        totalBlockingTime: this.extractMetric(lighthouseMetrics['total-blocking-time']?.numericValue),
        interactive: this.extractMetric(lighthouseMetrics['interactive']?.numericValue),
      };

      // Extract opportunities
      const opportunities = Object.entries(lighthouseMetrics)
        .filter(([_, audit]: [string, any]) =>
          audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 0.9
        )
        .map(([id, audit]: [string, any]) => ({
          id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          savings: audit.details?.overallSavingsMs || null,
        }))
        .sort((a, b) => (b.savings || 0) - (a.savings || 0))
        .slice(0, 10); // Top 10 opportunities

      // Extract diagnostics
      const diagnostics = Object.entries(lighthouseMetrics)
        .filter(([_, audit]: [string, any]) =>
          audit.details?.type === 'diagnostic' && audit.score !== null && audit.score < 1
        )
        .map(([id, audit]: [string, any]) => ({
          id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
        }))
        .slice(0, 10); // Top 10 diagnostics

      // Extract loading experience (field data)
      const loadingExperience = data.loadingExperience ? {
        overall_category: data.loadingExperience.overall_category,
        metrics: data.loadingExperience.metrics || {},
      } : undefined;

      const result: PageSpeedResult = {
        url,
        strategy,
        timestamp: new Date(),
        metrics,
        opportunities,
        diagnostics,
        loadingExperience,
      };

      console.log(`[PageSpeed] Analysis complete. Score: ${metrics.performanceScore}/100`);

      return result;
    } catch (error) {
      console.error('[PageSpeed] Analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze multiple URLs
   */
  async analyzeMultipleUrls(
    urls: string[],
    strategy: 'mobile' | 'desktop' = 'mobile'
  ): Promise<PageSpeedResult[]> {
    console.log(`[PageSpeed] Analyzing ${urls.length} URLs...`);

    const results: PageSpeedResult[] = [];

    // Analyze sequentially to avoid rate limits
    for (const url of urls) {
      try {
        const result = await this.analyzeUrl(url, strategy);
        results.push(result);

        // Add delay between requests to respect rate limits
        if (urls.indexOf(url) < urls.length - 1) {
          await this.delay(2000); // 2 second delay
        }
      } catch (error) {
        console.error(`[PageSpeed] Failed to analyze ${url}:`, error);
        // Continue with next URL
      }
    }

    return results;
  }

  /**
   * Get Core Web Vitals assessment
   */
  getCoreWebVitalsAssessment(metrics: PageSpeedMetrics): {
    lcp: 'good' | 'needs-improvement' | 'poor';
    fid: 'good' | 'needs-improvement' | 'poor';
    cls: 'good' | 'needs-improvement' | 'poor';
    overall: 'good' | 'needs-improvement' | 'poor';
  } {
    const lcpStatus = this.assessLCP(metrics.lcp);
    const fidStatus = this.assessFID(metrics.fid);
    const clsStatus = this.assessCLS(metrics.cls);

    // Overall is poor if any metric is poor, needs improvement if any needs improvement, otherwise good
    let overall: 'good' | 'needs-improvement' | 'poor' = 'good';
    if (lcpStatus === 'poor' || fidStatus === 'poor' || clsStatus === 'poor') {
      overall = 'poor';
    } else if (lcpStatus === 'needs-improvement' || fidStatus === 'needs-improvement' || clsStatus === 'needs-improvement') {
      overall = 'needs-improvement';
    }

    return {
      lcp: lcpStatus,
      fid: fidStatus,
      cls: clsStatus,
      overall,
    };
  }

  /**
   * Private helper methods
   */
  private extractMetric(value: number | undefined | null): number | null {
    return value !== undefined && value !== null ? value : null;
  }

  private assessLCP(lcp: number | null): 'good' | 'needs-improvement' | 'poor' {
    if (lcp === null) return 'poor';
    if (lcp <= 2500) return 'good';
    if (lcp <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private assessFID(fid: number | null): 'good' | 'needs-improvement' | 'poor' {
    if (fid === null) return 'poor';
    if (fid <= 100) return 'good';
    if (fid <= 300) return 'needs-improvement';
    return 'poor';
  }

  private assessCLS(cls: number | null): 'good' | 'needs-improvement' | 'poor' {
    if (cls === null) return 'poor';
    if (cls <= 0.1) return 'good';
    if (cls <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test API key validity
   */
  async verifyApiKey(): Promise<boolean> {
    try {
      // Test with a simple request
      const params = new URLSearchParams({
        url: 'https://www.google.com',
        key: this.apiKey,
        strategy: 'mobile',
        category: 'performance',
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      return response.ok;
    } catch (error) {
      console.error('[PageSpeed] API key verification failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create PageSpeed service from database config
 */
export async function createPageSpeedService(): Promise<GooglePageSpeedService> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

  if (!apiKey) {
    throw new Error('Google PageSpeed API key not configured');
  }

  return new GooglePageSpeedService(apiKey);
}
