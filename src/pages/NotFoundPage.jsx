import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Trophy } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-pitch-border text-center max-w-lg w-full space-y-6 shadow-2xl">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent-green/10 animate-pulse-subtle"></div>
          <div className="w-20 h-20 rounded-2xl bg-pitch-surface border border-pitch-border flex items-center justify-center text-accent-cyan shadow-inner">
            <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-4xl sm:text-6xl font-black font-mono text-accent-green">
            404
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-sport-text">
            Page Not Found
          </h1>
          <p className="text-sm text-sport-muted leading-relaxed">
            The match, fixture, or route you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" onClick={() => navigate('/')} icon={ArrowLeft}>
            Back to Match Feed
          </Button>
          <Button variant="secondary" onClick={() => navigate('/search')}>
            Search Matches
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
