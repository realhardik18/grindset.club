"use client";

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';

export default function XAnalytics() {
  const [data, setData] = useState(null);
  const [handle, setHandle] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [exportMetrics, setExportMetrics] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);

  const [selectedMetrics, setSelectedMetrics] = useState({
    'Impressions': true,
    'Likes': true,
    'Engagements': false,
    'Bookmarks': false,
    'Shares': false,
    'New follows': true,
    'Unfollows': false,
    'Replies': false,
    'Reposts': false,
    'Profile visits': false,
    'Create Post': true,
    'Video views': false,
    'Media views': false
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data
            .filter(row => row.Date)
            .map(row => ({
              ...row,
              date: new Date(row.Date)
            }))
            .sort((a, b) => a.date - b.date);
          setData(parsedData);
        }
      });
    }
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const toggleAll = (enable) => {
    const newState = {};
    Object.keys(selectedMetrics).forEach(key => {
      newState[key] = enable;
    });
    setSelectedMetrics(newState);
  };

  const getColor = (metric) => {
    const colors = {
      'Impressions': '#3b82f6',
      'Likes': '#ec4899',
      'Engagements': '#8b5cf6',
      'Bookmarks': '#f59e0b',
      'Shares': '#10b981',
      'New follows': '#06b6d4',
      'Unfollows': '#ef4444',
      'Replies': '#6366f1',
      'Reposts': '#14b8a6',
      'Profile visits': '#f97316',
      'Create Post': '#a855f7',
      'Video views': '#84cc16',
      'Media views': '#eab308'
    };
    return colors[metric] || '#64748b';
  };

  const getIntensity = (value, max) => {
    if (value === 0 || value === null) return 0;
    return 0.15 + (value / max) * 0.85;
  };

  const getWeekNumber = (date) => {
    const firstDate = new Date(date);
    firstDate.setHours(0, 0, 0, 0);
    const startOfYear = new Date(firstDate.getFullYear(), 0, 1);
    const diff = firstDate - startOfYear;
    const oneWeek = 604800000;
    return Math.floor(diff / oneWeek);
  };

  const renderContributionChart = (metric, isExport = false) => {
    if (!data || data.length === 0) return null;

    const values = data.map(row => row[metric] || 0);
    const maxValue = Math.max(...values, 1);

    // Create a map of dates to values
    const dateMap = new Map();
    data.forEach(row => {
      const dateStr = row.date.toDateString();
      dateMap.set(dateStr, row[metric] || 0);
    });

    // Get the date range
    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    
    // Find the first Sunday before or on start date
    const firstDay = new Date(startDate);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Find the last Saturday after or on end date
    const lastDay = new Date(endDate);
    lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    // Generate all days
    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(firstDay);

    while (currentDate <= lastDay) {
      const dateStr = currentDate.toDateString();
      const value = dateMap.get(dateStr);
      const dayOfWeek = currentDate.getDay();
      
      currentWeek.push({
        date: new Date(currentDate),
        value: value !== undefined ? value : null,
        hasData: value !== undefined
      });

      if (dayOfWeek === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const color = getColor(metric);

    return (
      <div key={metric} className={`${isExport ? 'flex flex-col items-center justify-center w-full my-2' : 'h-full flex flex-col'}`}>
        <div className="flex items-center justify-center mb-4">
          <h3 
            className={`font-medium px-6 py-2 rounded-full border backdrop-blur-sm ${isExport ? 'text-2xl mb-2' : 'text-lg text-white/90 border-white/10 bg-white/5'}`}
            style={isExport ? {
              color: 'rgba(255,255,255,0.9)',
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.05)'
            } : {}}
          >
            {metric}
          </h3>
        </div>
        <div className={`flex flex-grow items-center ${!isExport ? 'w-full overflow-x-auto pb-4 px-2 justify-start md:justify-center' : 'justify-center'}`}>
          <div 
            className={`inline-flex gap-[2px] p-4 rounded-xl border ${isExport ? 'scale-110' : 'bg-white/[0.02] border-white/5 min-w-fit'}`}
            style={isExport ? {
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.05)'
            } : {}}
          >
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((day, dayIndex) => {
                  const intensity = day.hasData ? getIntensity(day.value, maxValue) : 0;
                  let bgColor;
                  let boxShadow = 'none';
                  
                  if (!day.hasData) {
                    bgColor = 'transparent';
                  } else if (day.value === 0) {
                    bgColor = '#000000'; // Black for zero
                  } else {
                    // Color gradient based on intensity
                    bgColor = `${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`;
                    // Add glow for high intensity
                    if (intensity > 0.7) {
                      boxShadow = `0 0 8px ${color}40`;
                    }
                  }
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-[10px] h-[10px] rounded-[2px] relative group cursor-pointer transition-all duration-300 ${day.hasData && !isExport ? 'hover:scale-150 hover:z-50' : ''}`}
                      style={{ 
                        backgroundColor: bgColor,
                        boxShadow: boxShadow,
                        border: day.hasData && day.value === 0 ? '1px solid #000' : 'none'
                      }}
                      title={day.hasData ? `${day.date.toDateString()}: ${day.value}` : day.date.toDateString()}
                    >
                      {day.hasData && !isExport && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-2xl z-50 min-w-[120px] text-center">
                          <div className="font-medium text-gray-400 mb-1 text-[10px] uppercase tracking-wider">{day.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                          <div className="font-bold text-lg" style={{ color: color }}>{day.value.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500 mt-1">{metric}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {!isExport && (
          <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-500 font-medium">
            <span>Less</span>
            <div className="flex gap-1 items-center bg-white/5 px-2 py-1 rounded-full border border-white/5">
              <div className="w-[8px] h-[8px] rounded-[1px] border border-[#000] bg-[#000]" title="Zero" />
              {[0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => {
                const bgColor = `${color}${Math.round((0.15 + intensity * 0.85) * 255).toString(16).padStart(2, '0')}`;
                return (
                  <div
                    key={i}
                    className="w-[8px] h-[8px] rounded-[1px]"
                    style={{ backgroundColor: bgColor }}
                  />
                );
              })}
            </div>
            <span>More</span>
          </div>
        )}
      </div>
    );
  };

  const metrics = [
    'Impressions',
    'Likes',
    'Engagements',
    'Bookmarks',
    'Shares',
    'New follows',
    'Unfollows',
    'Replies',
    'Reposts',
    'Profile visits',
    'Create Post',
    'Video views',
    'Media views'
  ];

  const toggleExportMetric = (metric) => {
    if (exportMetrics.includes(metric)) {
      setExportMetrics(prev => prev.filter(m => m !== metric));
    } else {
      if (exportMetrics.length < 3) {
        setExportMetrics(prev => [...prev, metric]);
      }
    }
  };

  const generateImage = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#000000',
        scale: 1,
        logging: false,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `x-stats-${handle || 'user'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShowExport(false);
    } catch (err) {
      console.error('Export failed:', err);
    }
    setIsExporting(false);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-white/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 pt-8 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 tracking-tighter">
            X Analytics
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl font-light tracking-wide">Visualize your growth journey</p>
        </div>

        {!data && (
          <div className="mb-16 max-w-2xl mx-auto flex flex-col items-center gap-8">
            <div className="w-full aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
              <video 
                src="/demo.mov" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
            </div>

            <label className="block group w-full px-4 sm:px-0">
              <div className="relative overflow-hidden border border-white/10 rounded-2xl p-8 sm:p-12 text-center transition-all duration-500 hover:border-white/30 hover:bg-white/[0.02] cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <input
                  type="file"
                  accept=".csv,text/csv,application/vnd.ms-excel,application/csv,text/x-csv,application/x-csv,text/comma-separated-values,text/x-comma-separated-values"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                    <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-medium text-white/90">Upload CSV File</p>
                    <p className="text-sm mt-2 text-gray-500">follow the instructions in the demo to get started</p>
                  </div>
                </div>
              </div>
            </label>
          </div>
        )}

        {data && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {metrics
                .filter(metric => selectedMetrics[metric])
                .map(metric => renderContributionChart(metric))}
              
              {metrics.every(metric => !selectedMetrics[metric]) && (
                <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-gray-500 text-lg">Select metrics above to view visualization</p>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={() => setShowExport(true)}
                className="px-8 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Snapshot
              </button>
            </div>
          </div>
        )}
        {/* Export Modal */}
        {showExport && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <h2 className="text-2xl font-bold text-white mb-6">Export Snapshot</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Twitter Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="username"
                      className="w-full bg-black border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowExport(false)}
                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateImage}
                    disabled={!handle || isExporting}
                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isExporting ? 'Generating...' : 'Download Snapshot'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Export Container */}
        {showExport && (
          <div className="fixed left-[9999px] top-0">
            <div
              id="export-container"
              ref={exportRef}
              className="flex flex-col items-center justify-between p-12"
              style={{ 
                backgroundColor: '#000000',
                width: '1080px',
                height: '1350px'
              }}
            >
              <div className="text-center pt-4">
                <h1 className="text-6xl font-bold mb-4" style={{ color: '#ffffff' }}>
                  X Stats <span style={{ color: '#6b7280' }}>@{handle}</span>
                </h1>
              </div>
              
              <div className="flex flex-col gap-8 w-full flex-1 items-center justify-center">
                {['Create Post', 'New follows', 'Likes', 'Impressions'].map(metric => renderContributionChart(metric, true))}
              </div>

              <div 
                className="w-full text-center pb-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
              >
                <p className="font-medium text-2xl mt-6" style={{ color: '#6b7280' }}>Generated by grindset.club/x</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
