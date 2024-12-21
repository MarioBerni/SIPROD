'use client';

import React from 'react';

export interface DashboardStatsProps {
  stats: {
    label: string;
    value: number | string;
    change?: number;
  }[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
        >
          <dl>
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                {/* Icon placeholder */}
                <div className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.label}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              {item.change && (
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </p>
              )}
            </dd>
          </dl>
        </div>
      ))}
    </div>
  );
};
