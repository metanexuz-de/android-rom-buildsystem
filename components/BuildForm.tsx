
import React, { useState } from 'react';
import { AndroidVersion, BuildType, BuildConfiguration } from '../types';

interface BuildFormProps {
  config: BuildConfiguration;
  onChange: (config: BuildConfiguration) => void;
  disabled: boolean;
}

const BuildForm: React.FC<BuildFormProps> = ({ config, onChange, disabled }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Let the logic handle required-ness if needed, here we just check format if present
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field: keyof BuildConfiguration, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleCustomRepoChange = (field: string, value: string) => {
    const isUrlField = ['device', 'vendor', 'kernel', 'manifest'].includes(field);
    
    if (isUrlField) {
      if (value && !validateUrl(value)) {
        setErrors(prev => ({ ...prev, [field]: 'Invalid repository URL protocol (must include http/https)' }));
      } else {
        setErrors(prev => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    }

    onChange({
      ...config,
      customRepos: {
        ...(config.customRepos || {
          device: '',
          vendor: '',
          kernel: '',
          manifest: '',
          branch: ''
        }),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6 glass-panel p-6 rounded-lg neon-border">
      <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-tighter neon-text-cyan mb-4">
        Configuration
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-mono text-cyan-500/70 uppercase">Firmware Name</label>
          <input
            type="text"
            value={config.outputName}
            onChange={(e) => handleInputChange('outputName', e.target.value)}
            disabled={disabled}
            className="bg-black/50 border border-cyan-900 rounded px-3 py-2 text-cyan-200 focus:outline-none focus:border-cyan-400 transition-all"
            placeholder="e.g. MatrixOS-sanders"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs font-mono text-cyan-500/70 uppercase">Target Version</label>
          <select
            value={config.androidVersion}
            onChange={(e) => handleInputChange('androidVersion', e.target.value)}
            disabled={disabled}
            className="bg-black/50 border border-cyan-900 rounded px-3 py-2 text-cyan-200 focus:outline-none focus:border-cyan-400"
          >
            {Object.values(AndroidVersion).map(v => (
              <option key={v} value={v}>Android {v}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
          <label className="text-xs font-mono text-cyan-500/70 uppercase">Build Engine (ROM Type)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {Object.values(BuildType).map(t => (
              <button
                key={t}
                onClick={() => handleInputChange('buildType', t)}
                disabled={disabled}
                className={`px-3 py-2 text-xs font-bold rounded border transition-all ${
                  config.buildType === t 
                    ? 'bg-cyan-900/50 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                    : 'bg-black/30 border-cyan-900/50 text-cyan-700 hover:border-cyan-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {config.buildType === BuildType.CUSTOM && (
        <div className="mt-6 pt-6 border-t border-cyan-900/30 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono text-magenta-400 uppercase tracking-widest">Manual Repository Mapping</h3>
            {Object.keys(errors).length > 0 && (
              <span className="text-[10px] font-bold text-rose-500 animate-pulse">Validation Warning</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['device', 'vendor', 'kernel', 'manifest', 'branch'].map((field) => (
              <div key={field} className="flex flex-col space-y-1">
                <label className={`text-[10px] font-mono uppercase ${errors[field] ? 'text-rose-500' : 'text-magenta-500/70'}`}>
                  {field} repository / source
                </label>
                <input
                  type="text"
                  value={(config.customRepos as any)?.[field] || ''}
                  onChange={(e) => handleCustomRepoChange(field, e.target.value)}
                  disabled={disabled}
                  className={`bg-black/50 border rounded px-3 py-2 text-magenta-200 text-xs focus:outline-none transition-all placeholder:text-magenta-900/40 ${
                    errors[field] 
                      ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]' 
                      : 'border-magenta-900/50 focus:border-magenta-400'
                  }`}
                  placeholder={`Enter ${field} ${field === 'branch' ? 'name' : 'URL'}...`}
                />
                {errors[field] && (
                  <span className="text-[9px] text-rose-400 font-mono italic mt-1 leading-none">
                    {errors[field]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildForm;
