/**
 * Mouhajer CMS Admin Dashboard
 * Content Management System for Mouhajer Design Website
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SkeletonStatCard } from "@/components/Skeleton";
import { CRMAnalytics } from "@/components/CRMAnalytics";
import { AnimatedStatCard } from "@/components/animated/AnimatedStatCard";
import { FadeInSection } from "@/components/animated/FadeInSection";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animated/StaggerContainer";

export default function CMSDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    blogPosts: 0,
    mediaFiles: 0,
    leads: 0,
    contacts: 0,
    pipelineValue: 0,
    conversionRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      // Fetch CMS data
      const [projects, services, blog, media] = await Promise.all([
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/services").then((r) => r.json()),
        fetch("/api/blog").then((r) => r.json()),
        fetch("/api/media").then((r) => r.json()),
      ]);

      // Fetch CRM data via GraphQL
      const crmStatsQuery = `
        query GetCRMStats {
          crmStats {
            totalLeads
            totalContacts
            totalDeals
            pipelineValue
            wonDeals
          }
        }
      `;

      const crmResponse = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: crmStatsQuery }),
      });

      const crmData = await crmResponse.json();
      const crmStats = crmData?.data?.crmStats || {};

      // Calculate conversion rate
      const conversionRate =
        crmStats.totalLeads > 0
          ? ((crmStats.wonDeals / crmStats.totalLeads) * 100).toFixed(1)
          : 0;

      setStats({
        projects: projects.length || 0,
        services: services.length || 0,
        blogPosts: blog.length || 0,
        mediaFiles: media.length || 0,
        leads: crmStats.totalLeads || 0,
        contacts: crmStats.totalContacts || 0,
        pipelineValue: crmStats.pipelineValue || 0,
        conversionRate: parseFloat(conversionRate as string) || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/activity?limit=5");
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "create":
        return (
          <div className="bg-green-100 rounded-full p-2">
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        );
      case "update":
        return (
          <div className="bg-blue-100 rounded-full p-2">
            <svg
              className="h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        );
      case "delete":
        return (
          <div className="bg-red-100 rounded-full p-2">
            <svg
              className="h-4 w-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-full p-2">
            <svg
              className="h-4 w-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 ">
            {session?.user?.name
              ? `Welcome back, ${session.user.name}!`
              : "Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • Content Management & CRM Overview
          </p>
        </div>

        {/* Stats Cards - Simplified to 3 primary metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {loadingStats ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/projects")}
                className="group bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-100"
                aria-label="Go to Projects page"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <svg
                          className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          Total Projects
                        </dt>
                        <dd className="text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {stats.projects}
                        </dd>
                      </dl>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push("/services")}
                className="group bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-100"
                aria-label="Go to Services page"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <svg
                          className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          Services
                        </dt>
                        <dd className="text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {stats.services}
                        </dd>
                      </dl>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push("/blog")}
                className="group bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-100"
                aria-label="Go to Blog page"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <svg
                          className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          Blog Posts
                        </dt>
                        <dd className="text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {stats.blogPosts}
                        </dd>
                      </dl>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </>
          )}
        </div>

        {/* CRM Analytics Charts */}
        <FadeInSection delay={0.2}>
          <CRMAnalytics />
        </FadeInSection>

        {/* Recent Activity */}
        <FadeInSection delay={0.3}>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Recent Activity
              </h3>
              <button
                onClick={() => router.push("/activity")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View All
              </button>
            </div>
            <div className="px-6 py-4">
              {loadingActivity ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center gap-3"
                    >
                      <div className="bg-gray-200 rounded-full h-10 w-10"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent activity to show.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      {getActivityIcon(activity.action)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          <span className="capitalize">{activity.action}</span>{" "}
                          {activity.resource}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {activity.user?.name || "System"} •{" "}
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
