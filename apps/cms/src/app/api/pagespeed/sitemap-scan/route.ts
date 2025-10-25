import { NextRequest, NextResponse } from 'next/server';
import { createPageSpeedService } from '@/lib/google-pagespeed';
import { prisma } from '@/lib/prisma';

// POST scan all URLs from sitemap
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sitemapUrl, strategies = ['mobile', 'desktop'], maxUrls = 50 } = body;

    if (!sitemapUrl) {
      return NextResponse.json({ error: 'Sitemap URL is required' }, { status: 400 });
    }

    console.log(`[PageSpeed Sitemap] Fetching sitemap from ${sitemapUrl}...`);

    // Fetch sitemap
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }

    const sitemapXml = await response.text();

    // Extract URLs from sitemap XML
    const urlMatches = sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g);
    let urls = Array.from(urlMatches, (match) => match[1]);

    // Limit URLs
    if (urls.length > maxUrls) {
      urls = urls.slice(0, maxUrls);
    }

    console.log(`[PageSpeed Sitemap] Found ${urls.length} URLs to analyze`);

    const service = await createPageSpeedService();
    const results = [];
    let processed = 0;
    let failed = 0;

    // Analyze each URL with both strategies
    for (const url of urls) {
      for (const strategy of strategies) {
        try {
          console.log(`[PageSpeed Sitemap] Analyzing ${url} (${strategy})... [${processed + 1}/${urls.length * strategies.length}]`);

          const result = await service.analyzeUrl(url, strategy as 'mobile' | 'desktop');

          // Save to database
          await prisma.pageSpeedAnalysis.create({
            data: {
              url: result.url,
              strategy: result.strategy,
              performanceScore: result.metrics.performanceScore,
              lcp: result.metrics.lcp,
              fid: result.metrics.fid,
              cls: result.metrics.cls,
              fcp: result.metrics.fcp,
              ttfb: result.metrics.ttfb,
              speedIndex: result.metrics.speedIndex,
              totalBlockingTime: result.metrics.totalBlockingTime,
              interactive: result.metrics.interactive,
              loadingExperience: result.loadingExperience || null,
              opportunities: result.opportunities || null,
              diagnostics: result.diagnostics || null,
              timestamp: result.timestamp,
            },
          });

          // Update or create monitoring record
          const monitoring = await prisma.pageSpeedMonitoring.findUnique({
            where: { url: result.url },
          });

          if (monitoring) {
            const updateData: any = {
              lastAnalysisAt: new Date(),
            };

            if (strategy === 'mobile') {
              updateData.lastMobileScore = result.metrics.performanceScore;
            } else {
              updateData.lastDesktopScore = result.metrics.performanceScore;
            }

            // Check alert thresholds
            const assessment = service.getCoreWebVitalsAssessment(result.metrics);
            if (
              result.metrics.performanceScore < (monitoring.minPerformanceScore || 0) ||
              assessment.overall === 'poor'
            ) {
              updateData.alertStatus = 'critical';
              updateData.alertMessage = `Performance score dropped to ${result.metrics.performanceScore}`;
            } else if (assessment.overall === 'needs-improvement') {
              updateData.alertStatus = 'warning';
              updateData.alertMessage = 'Core Web Vitals need improvement';
            } else {
              updateData.alertStatus = 'ok';
              updateData.alertMessage = null;
            }

            await prisma.pageSpeedMonitoring.update({
              where: { url: result.url },
              data: updateData,
            });
          } else {
            // Create new monitoring record
            await prisma.pageSpeedMonitoring.create({
              data: {
                name: new URL(url).pathname || url,
                url: result.url,
                isActive: true,
                monitoringFrequency: 'weekly',
                strategies: strategies as string[],
                lastAnalysisAt: new Date(),
                lastMobileScore: strategy === 'mobile' ? result.metrics.performanceScore : null,
                lastDesktopScore: strategy === 'desktop' ? result.metrics.performanceScore : null,
                alertStatus: result.metrics.performanceScore >= 80 ? 'ok' : result.metrics.performanceScore >= 50 ? 'warning' : 'critical',
              },
            });
          }

          results.push({
            url: result.url,
            strategy: result.strategy,
            performanceScore: result.metrics.performanceScore,
            status: 'success',
          });

          processed++;

          // Add delay between requests to avoid rate limits (2 seconds)
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`[PageSpeed Sitemap] Failed to analyze ${url} (${strategy}):`, error);
          failed++;
          results.push({
            url,
            strategy,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    console.log(`[PageSpeed Sitemap] Scan complete. Processed: ${processed}, Failed: ${failed}`);

    return NextResponse.json({
      success: true,
      message: `Scanned ${urls.length} URLs with ${strategies.length} strategies`,
      summary: {
        totalUrls: urls.length,
        totalAnalyses: urls.length * strategies.length,
        successful: processed,
        failed,
      },
      results,
    });
  } catch (error) {
    console.error('[PageSpeed Sitemap] Scan failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to scan sitemap',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET scan status/history
export async function GET(request: NextRequest) {
  try {
    // Get recent scans grouped by URL
    const recentAnalyses = await prisma.pageSpeedAnalysis.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      select: {
        url: true,
        strategy: true,
        performanceScore: true,
        timestamp: true,
      },
    });

    // Group by URL
    const grouped = recentAnalyses.reduce((acc, analysis) => {
      if (!acc[analysis.url]) {
        acc[analysis.url] = {
          url: analysis.url,
          mobile: null,
          desktop: null,
          lastAnalyzed: analysis.timestamp,
        };
      }

      if (analysis.strategy === 'mobile') {
        acc[analysis.url].mobile = analysis.performanceScore;
      } else {
        acc[analysis.url].desktop = analysis.performanceScore;
      }

      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      urls: Object.values(grouped),
    });
  } catch (error) {
    console.error('[PageSpeed Sitemap] Failed to get scan status:', error);

    return NextResponse.json(
      {
        error: 'Failed to get scan status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
