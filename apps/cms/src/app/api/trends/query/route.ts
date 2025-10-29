import { NextRequest, NextResponse } from 'next/server';
import { createKeywordPlannerService, LOCATION_IDS } from '@/lib/google-keyword-planner';
import { prisma } from '@/lib/prisma';

// POST query Google Keyword Planner (Official Google API)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, geo = 'AE', timeRange = 'today 12-m', saveToDb = true } = body;

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    console.log(`[Keyword API] Querying keywords for "${keyword}"...`);

    const service = createKeywordPlannerService();

    // Get location ID from country code
    const locationId = LOCATION_IDS[geo as keyof typeof LOCATION_IDS] || LOCATION_IDS.UAE;

    // Fetch keyword data and related keywords
    const [keywordData, relatedKeywords] = await Promise.all([
      service.getKeywordIdeas([keyword], locationId),
      service.getRelatedKeywords(keyword, locationId, undefined, 10)
    ]);

    const mainKeyword = keywordData[0];
    if (!mainKeyword) {
      throw new Error('No keyword data found');
    }

    // Transform to match the existing trends format for compatibility
    const interestOverTime = mainKeyword.monthlySearchVolumes.map(month => ({
      time: `${month.year}-${String(month.month).padStart(2, '0')}`,
      value: Math.min(100, Math.round((month.monthlySearches / mainKeyword.avgMonthlySearches) * 100)),
      formattedTime: `${month.month} ${month.year}`,
      formattedValue: month.monthlySearches.toLocaleString()
    }));

    // Calculate peak and current interest
    const values = interestOverTime.map((d) => d.value);
    const peakInterest = Math.max(...values);
    const currentInterest = values[values.length - 1] || 0;

    // Format related queries
    const relatedQueries = {
      top: relatedKeywords.slice(0, 5).map(kw => ({
        query: kw.keyword,
        value: kw.avgMonthlySearches
      })),
      rising: relatedKeywords.slice(5, 10).map(kw => ({
        query: kw.keyword,
        value: kw.avgMonthlySearches,
        formattedValue: `${kw.avgMonthlySearches.toLocaleString()} searches`
      }))
    };

    // Mock regional interest (can be expanded with actual regional data)
    const regionalInterest = [
      { geoName: 'Dubai', value: 85 },
      { geoName: 'Abu Dhabi', value: 75 },
      { geoName: 'Sharjah', value: 60 },
      { geoName: 'Ajman', value: 45 },
      { geoName: 'Ras Al Khaimah', value: 40 }
    ];

    const result = {
      keyword,
      geo,
      timeRange,
      averageInterest: mainKeyword.avgMonthlySearches,
      peakInterest,
      currentInterest,
      interestOverTime,
      relatedQueries,
      regionalInterest,
      // Additional data from Keyword Planner
      competition: mainKeyword.competition,
      competitionIndex: mainKeyword.competitionIndex,
      suggestedBid: {
        low: mainKeyword.topOfPageBidLowRange,
        high: mainKeyword.topOfPageBidHighRange
      }
    };

    // Save to database if requested
    if (saveToDb) {
      await prisma.trendsQuery.create({
        data: {
          keyword,
          geo: geo || null,
          timeRange,
          averageInterest: mainKeyword.avgMonthlySearches,
          peakInterest,
          currentInterest,
          interestOverTime,
          relatedQueries,
          regionalInterest,
        },
      });

      console.log('[Keyword API] Query saved to database');
    }

    return NextResponse.json({
      success: true,
      result,
      message: 'Using Google Keyword Planner API (Official)'
    });
  } catch (error) {
    console.error('[Keyword API] Query failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to query keywords',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}