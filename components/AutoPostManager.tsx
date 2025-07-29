'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Settings, Play, Pause, Trash2, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { autoPostService, AutoPostJob, AutoPostSettings } from '../lib/autoPostService';
import { openaiService } from '../lib/openai';

interface AutoPostManagerProps {
  farcasterFid: string;
  settings: AutoPostSettings;
  onSettingsChange: (settings: AutoPostSettings) => void;
}

export default function AutoPostManager({
  farcasterFid,
  settings,
  onSettingsChange,
}: AutoPostManagerProps) {
  const [jobs, setJobs] = useState<AutoPostJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [farcasterFid]);

  const loadJobs = async () => {
    try {
      const userJobs = await autoPostService.getUserJobs(farcasterFid);
      setJobs(userJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError('Failed to load scheduled posts');
    }
  };

  const handleToggleAutoPost = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    onSettingsChange(newSettings);
  };

  const handleScheduleChange = (field: keyof AutoPostSettings, value: any) => {
    const newSettings = { ...settings, [field]: value };
    onSettingsChange(newSettings);
  };

  const scheduleTestPost = async () => {
    if (!settings.enabled) {
      setError('Please enable auto-posting first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate content using AI
      const mockInfluencer = {
        id: 'enhancer',
        name: 'Content Enhancer',
        handle: 'enhancer',
        avatar: '',
        description: 'AI-powered content enhancement tool',
        style: 'crypto',
        followers: 0,
        category: 'crypto' as const,
        sampleTweets: [],
      };

      const enhancedContent = await openaiService.generateShitpost(
        {
          influencerId: 'enhancer',
          prompt: 'Generate a viral crypto post about Base ecosystem',
          style: 'based',
          length: 'medium',
        },
        mockInfluencer
      );

      // Schedule for 2 minutes from now
      const scheduledTime = new Date();
      scheduledTime.setMinutes(scheduledTime.getMinutes() + 2);

      await autoPostService.schedulePost(
        farcasterFid,
        enhancedContent,
        scheduledTime,
        settings
      );

      await loadJobs();
    } catch (error: any) {
      console.error('Failed to schedule test post:', error);
      setError(error.message || 'Failed to schedule test post');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelJob = async (jobId: string) => {
    try {
      await autoPostService.cancelJob(jobId);
      await loadJobs();
    } catch (error) {
      console.error('Failed to cancel job:', error);
      setError('Failed to cancel scheduled post');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'retrying':
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Scheduled';
      case 'posted':
        return 'Posted';
      case 'failed':
        return 'Failed';
      case 'retrying':
        return 'Retrying';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto-Post Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Auto-Post Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Auto-Posting</h3>
              <p className="text-sm text-gray-500">Automatically post enhanced content</p>
            </div>
            <button
              onClick={handleToggleAutoPost}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.enabled && (
            <>
              {/* Daily Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Post Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.dailyLimit}
                  onChange={(e) => handleScheduleChange('dailyLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Schedule Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posting Time
                </label>
                <input
                  type="time"
                  value={settings.scheduleTime}
                  onChange={(e) => handleScheduleChange('scheduleTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleScheduleChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Shanghai">Shanghai</option>
                </select>
              </div>

              {/* Auto-Enhance Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Auto-Enhance Content</h3>
                  <p className="text-sm text-gray-500">Use AI to generate content automatically</p>
                </div>
                <button
                  onClick={() => handleScheduleChange('autoEnhance', !settings.autoEnhance)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoEnhance ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoEnhance ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Test Post Button */}
              <button
                onClick={scheduleTestPost}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Scheduling Test Post...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Schedule Test Post (2 min)</span>
                  </div>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Scheduled Posts</h2>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No scheduled posts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(job.status)}
                    <span className="text-sm font-medium text-gray-700">
                      {getStatusText(job.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{job.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(job.scheduledTime).toLocaleString()}
                  </p>
                </div>
                {job.status === 'pending' && (
                  <button
                    onClick={() => cancelJob(job.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Cancel post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
} 