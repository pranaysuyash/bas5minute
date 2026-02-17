'use client';

import React, { useState, useEffect } from 'react';
import { getMetricsCollector } from '@/lib/serviceMetrics';
import { getServiceFactory } from '@/lib/serviceFactory';

export function ServiceMetricsPanel() {
  const [activeService, setActiveService] = useState<'map' | 'isochrone' | 'geocoding'>('map');
  const [metrics, setMetrics] = useState<any[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const collector = getMetricsCollector();
      const factory = getServiceFactory();
      const serviceMetrics = factory.getMetricsForService(activeService);
      setMetrics(serviceMetrics);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeService]);

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-mono z-50"
        title="Service Metrics Dashboard"
      >
        📊 Metrics
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden z-50 font-mono text-xs flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-3 flex justify-between items-center border-b border-gray-700">
        <div className="flex gap-2">
          {(['map', 'isochrone', 'geocoding'] as const).map((svc) => (
            <button
              key={svc}
              onClick={() => setActiveService(svc)}
              className={`px-2 py-1 rounded ${
                activeService === svc ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {svc}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {metrics.length === 0 ? (
          <div className="text-gray-400">No metrics yet. Try using the {activeService} services.</div>
        ) : (
          metrics.map((metric) => (
            <div key={`${metric.provider}`} className="bg-gray-800 p-2 rounded border border-gray-700">
              <div className="font-bold text-blue-400">{metric.provider}</div>
              <div className="text-gray-300 mt-1 space-y-0.5">
                <div>Requests: {metric.totalRequests} ({metric.successfulRequests} ✓ {metric.failedRequests} ✗)</div>
                <div>Avg: {metric.averageDuration.toFixed(0)}ms (min: {metric.minDuration}ms, max: {metric.maxDuration}ms)</div>
                <div>Error Rate: {(metric.errorRate * 100).toFixed(1)}%</div>
                {metric.averageDataSize > 0 && (
                  <div>Data: {(metric.totalDataSize / 1024).toFixed(1)}KB avg {(metric.averageDataSize / 1024).toFixed(2)}KB</div>
                )}
                {metric.estimatedCost > 0 && (
                  <div className="text-yellow-400">Est. Cost: ${metric.estimatedCost.toFixed(4)}</div>
                )}
                <div className="text-gray-400 text-xs">Last: {new Date(metric.lastUsed).toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-2 border-t border-gray-700 flex gap-2">
        <button
          onClick={() => {
            const collector = getMetricsCollector();
            const csv = collector.exportAsCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `metrics-${Date.now()}.csv`;
            a.click();
          }}
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={() => {
            const collector = getMetricsCollector();
            collector.clearMetrics();
            setMetrics([]);
          }}
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
