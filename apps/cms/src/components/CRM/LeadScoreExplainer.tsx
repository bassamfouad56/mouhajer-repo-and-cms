'use client';

import OnboardingTooltip from './OnboardingTooltip';

interface LeadScoreBreakdown {
  category: string;
  value: string;
  points: number;
  maxPoints: number;
  description: string;
}

interface LeadScoreExplainerProps {
  score: number;
  budgetRange?: string;
  source?: string;
  timeline?: string;
  projectType?: string;
  hasEmail: boolean;
  hasWhatsApp?: boolean;
  hasMessage?: boolean;
}

export default function LeadScoreExplainer({
  score,
  budgetRange = 'not_specified',
  source = 'website',
  timeline = 'flexible',
  projectType = 'other',
  hasEmail,
  hasWhatsApp,
  hasMessage
}: LeadScoreExplainerProps) {

  // Calculate points for each category
  const calculateBudgetPoints = (): LeadScoreBreakdown => {
    const budgetScores: Record<string, number> = {
      ultra_luxury: 30,
      luxury: 25,
      mid_range: 20,
      economical: 10,
      not_specified: 0
    };

    return {
      category: 'Budget Range',
      value: budgetRange.replace(/_/g, ' '),
      points: budgetScores[budgetRange] || 0,
      maxPoints: 30,
      description: 'Higher budgets indicate more serious prospects'
    };
  };

  const calculateSourcePoints = (): LeadScoreBreakdown => {
    const sourceScores: Record<string, number> = {
      referral: 25,
      walk_in: 20,
      website: 20,
      phone: 18,
      social_media: 15,
      email: 15,
      advertisement: 10
    };

    return {
      category: 'Lead Source',
      value: source.replace(/_/g, ' '),
      points: sourceScores[source] || 10,
      maxPoints: 25,
      description: 'Referrals and walk-ins are highest quality'
    };
  };

  const calculateTimelinePoints = (): LeadScoreBreakdown => {
    const timelineScores: Record<string, number> = {
      immediate: 20,
      '1_month': 18,
      '3_months': 15,
      '6_months': 10,
      flexible: 5
    };

    return {
      category: 'Timeline',
      value: timeline.replace(/_/g, ' '),
      points: timelineScores[timeline] || 5,
      maxPoints: 20,
      description: 'Urgent projects convert faster'
    };
  };

  const calculateProjectTypePoints = (): LeadScoreBreakdown => {
    const projectScores: Record<string, number> = {
      villa: 15,
      penthouse: 15,
      hotel: 12,
      restaurant: 12,
      office: 10,
      apartment: 8,
      retail_store: 8,
      other: 5
    };

    return {
      category: 'Project Type',
      value: projectType.replace(/_/g, ' '),
      points: projectScores[projectType] || 5,
      maxPoints: 15,
      description: 'Larger projects score higher'
    };
  };

  const calculateContactInfoPoints = (): LeadScoreBreakdown => {
    let points = 5; // Base for phone (required)
    if (hasEmail) points += 2;
    if (hasWhatsApp) points += 3;

    const completeness = hasEmail && hasWhatsApp ? 'Complete' : hasEmail ? 'Good' : 'Basic';

    return {
      category: 'Contact Info',
      value: completeness,
      points,
      maxPoints: 10,
      description: 'More contact options = better reach'
    };
  };

  const calculateEngagementPoints = (): LeadScoreBreakdown => {
    let points = 0;
    let engagement = 'Minimal';

    if (hasMessage) {
      points = 10;
      engagement = 'Detailed inquiry';
    } else {
      points = 3;
      engagement = 'Basic form';
    }

    return {
      category: 'Engagement',
      value: engagement,
      points,
      maxPoints: 10,
      description: 'Detailed messages show serious intent'
    };
  };

  const breakdown: LeadScoreBreakdown[] = [
    calculateBudgetPoints(),
    calculateSourcePoints(),
    calculateTimelinePoints(),
    calculateProjectTypePoints(),
    calculateContactInfoPoints(),
    calculateEngagementPoints()
  ];

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-300';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-300';
    return 'text-red-600 bg-red-50 border-red-300';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return '🔥 Hot Lead';
    if (score >= 60) return '⭐ Warm Lead';
    if (score >= 40) return '🆗 Medium Lead';
    return '❄️ Cold Lead';
  };

  const getActionRecommendation = (score: number): string => {
    if (score >= 80) return 'Contact within 1 hour! High priority.';
    if (score >= 60) return 'Contact within 24 hours. Good prospect.';
    if (score >= 40) return 'Contact within 2-3 days. Worth exploring.';
    return 'Review carefully before contacting. May be low quality.';
  };

  const calculatePercentage = (points: number, maxPoints: number): number => {
    return Math.round((points / maxPoints) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className={`p-4 rounded-lg border-2 ${getScoreColor(score)}`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold">{getScoreLabel(score)}</h3>
            <p className="text-sm mt-1">{getActionRecommendation(score)}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{score}</div>
            <div className="text-xs">out of 100</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-white bg-opacity-50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-current transition-all duration-500"
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Score Breakdown</h4>
          <OnboardingTooltip
            title="How Scoring Works"
            content={`Leads are scored 0-100 based on budget, source, timeline, project type, contact completeness, and engagement level. Higher scores = better quality leads.`}
            position="left"
          />
        </div>

        <div className="space-y-3">
          {breakdown.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">{item.category}</span>
                  <OnboardingTooltip
                    title={item.category}
                    content={item.description}
                    position="right"
                    icon="help"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{item.value}</span>
                  <span className="font-semibold text-gray-900">
                    {item.points}/{item.maxPoints}
                  </span>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    calculatePercentage(item.points, item.maxPoints) >= 75
                      ? 'bg-green-500'
                      : calculatePercentage(item.points, item.maxPoints) >= 50
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`}
                  style={{ width: `${calculatePercentage(item.points, item.maxPoints)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-gray-700">Total Score</span>
            <span className={`text-lg ${
              score >= 60 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {score} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Improvement Tips */}
      {score < 80 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h5 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            How to Improve Lead Quality
          </h5>
          <ul className="space-y-1 text-sm text-blue-800">
            {breakdown.find(b => b.category === 'Budget Range' && b.points < 20) && (
              <li>• Add budget range questions to your contact forms</li>
            )}
            {breakdown.find(b => b.category === 'Lead Source' && b.value === 'advertisement') && (
              <li>• Focus on referral programs - they generate highest quality leads</li>
            )}
            {breakdown.find(b => b.category === 'Contact Info' && b.points < 7) && (
              <li>• Collect both email AND WhatsApp for better communication</li>
            )}
            {breakdown.find(b => b.category === 'Engagement' && b.points < 7) && (
              <li>• Add a message/requirements field to understand client needs better</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
