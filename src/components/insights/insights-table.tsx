"use client";

import { formatDuration } from "@/lib/utils/time";
import type { FeatureInsight } from "@/types";

interface InsightsTableProps {
  features: FeatureInsight[];
  totalSeconds: number;
}

export function InsightsTable({ features, totalSeconds }: InsightsTableProps) {
  if (features.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No time entries yet. Start tracking time on features to see insights.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Feature
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
              Time
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
              % of Total
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
              Entries
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {features.map((feature, index) => {
            const { friendly } = formatDuration(feature.totalSeconds);
            const widthPercent = totalSeconds > 0 
              ? (feature.totalSeconds / totalSeconds) * 100 
              : 0;

            return (
              <tr
                key={feature.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {feature.name}
                      </div>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-mono text-sm text-gray-900">
                    {friendly}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-600">
                    {feature.percentOfProject}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-500">
                    {feature.entryCount}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200 bg-gray-50">
            <td className="py-3 px-4 font-medium text-gray-900">Total</td>
            <td className="py-3 px-4 text-right font-mono font-medium text-gray-900">
              {formatDuration(totalSeconds).friendly}
            </td>
            <td className="py-3 px-4 text-right font-medium text-gray-900">
              100%
            </td>
            <td className="py-3 px-4 text-right text-gray-500">
              {features.reduce((sum, f) => sum + f.entryCount, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
