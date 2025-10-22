'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Tooltip from './Tooltip';

interface NavItem {
  href: string;
  name: string;
  icon: React.ReactNode;
}

interface NavigationGroupProps {
  title: string;
  items: NavItem[];
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  color?: 'blue' | 'green' | 'gray';
  onItemClick?: () => void;
}

const colorStyles = {
  blue: {
    header: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    activeItem: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400',
    hoverItem: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    header: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    activeItem: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-r-2 border-green-600 dark:border-green-400',
    hoverItem: 'hover:bg-green-50 dark:hover:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
  },
  gray: {
    header: 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800',
    activeItem: 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-r-2 border-gray-600 dark:border-gray-400',
    hoverItem: 'hover:bg-gray-50 dark:hover:bg-gray-800',
    icon: 'text-gray-600 dark:text-gray-400',
  },
};

export default function NavigationGroup({
  title,
  items,
  icon,
  defaultOpen = true,
  color = 'gray',
  onItemClick,
}: NavigationGroupProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const styles = colorStyles[color];

  // Check if any item in this group is active
  const hasActiveItem = items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'));

  return (
    <div className="mb-2">
      {/* Group Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors ${
          hasActiveItem ? styles.header : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span>{title}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Group Items */}
      {isOpen && (
        <div className="mt-1 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Tooltip key={item.href} content={item.name} position="right">
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ml-2 ${
                    isActive
                      ? styles.activeItem
                      : `text-gray-700 dark:text-gray-300 ${styles.hoverItem}`
                  }`}
                >
                  <span className={isActive ? styles.icon : 'text-gray-400 dark:text-gray-500'}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}
