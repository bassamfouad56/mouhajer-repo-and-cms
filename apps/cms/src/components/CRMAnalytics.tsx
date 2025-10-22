'use client';

import { useState, useEffect } from 'react';
import { LeadsChart } from './charts/LeadsChart';
import { PipelineChart } from './charts/PipelineChart';
import { ConversionChart } from './charts/ConversionChart';
import { RevenueChart } from './charts/RevenueChart';

export function CRMAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    leadsData: [] as Array<{ date: string; leads: number; converted: number }>,
    pipelineData: [] as Array<{ stage: string; count: number; value: number }>,
    conversionData: [] as Array<{ name: string; value: number }>,
    revenueData: [] as Array<{ month: string; revenue: number }>,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch analytics data via GraphQL
      const analyticsQuery = `
        query GetCRMAnalytics {
          crmAnalytics {
            leadsOverTime {
              date
              leads
              converted
            }
            pipelineByStage {
              stage
              count
              value
            }
            conversionStats {
              name
              value
            }
            revenueOverTime {
              month
              revenue
            }
          }
        }
      `;

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: analyticsQuery }),
      });

      const result = await response.json();

      if (result.data?.crmAnalytics) {
        setAnalyticsData({
          leadsData: result.data.crmAnalytics.leadsOverTime || [],
          pipelineData: result.data.crmAnalytics.pipelineByStage || [],
          conversionData: result.data.crmAnalytics.conversionStats || [],
          revenueData: result.data.crmAnalytics.revenueOverTime || [],
        });
      }
    } catch (error) {
      console.error('Error fetching CRM analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">CRM Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Leads Over Time</h3>
          {analyticsData.leadsData.length > 0 ? (
            <LeadsChart data={analyticsData.leadsData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No leads data available
            </div>
          )}
        </div>

        {/* Pipeline by Stage */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Pipeline by Stage</h3>
          {analyticsData.pipelineData.length > 0 ? (
            <PipelineChart data={analyticsData.pipelineData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No pipeline data available
            </div>
          )}
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Conversion Rate</h3>
          {analyticsData.conversionData.length > 0 ? (
            <ConversionChart data={analyticsData.conversionData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No conversion data available
            </div>
          )}
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Revenue Trend</h3>
          {analyticsData.revenueData.length > 0 ? (
            <RevenueChart data={analyticsData.revenueData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No revenue data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
