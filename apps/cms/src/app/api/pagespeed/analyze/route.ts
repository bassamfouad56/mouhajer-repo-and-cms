import { NextRequest, NextResponse } from 'next/server';
import { createPageSpeedService } from '@/lib/google-pagespeed';
import { prisma } from '@/lib/prisma';

// POST analyze URL with PageSpeed Insights
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, strategy = 'mobile', saveToDb = true } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log(`[PageSpeed] Analyzing ${url} (${strategy})...`);

    const service = await createPageSpeedService();
    const result = await service.analyzeUrl(url, strategy);

    // Save to database if requested
    if (saveToDb) {
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

      // Update monitoring record if exists
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
      }

      console.log('[PageSpeed] Analysis saved to database');
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('[PageSpeed] Analysis failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to analyze URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
