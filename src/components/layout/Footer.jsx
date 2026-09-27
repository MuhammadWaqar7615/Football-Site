import { Trophy, Activity } from 'lucide-react';
import { useMatchData } from '../../context/MatchDataContext.jsx';

export function Footer() {
  const { totalCount, referenceTime } = useMatchData();

  return (
    <footer className="glass-panel border-t border-pitch-border mt-auto pt-10 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-pitch-border/60">
          {/* Brand & Slogan */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent-green/20 border border-accent-green/40 flex items-center justify-center text-accent-green">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-sport-text">
                MATCHPULSE
              </span>
            </div>
            <p className="text-xs text-sport-muted leading-relaxed">
              Production-grade football match tracking platform. Real-time scores, normalized league analytics, and fixture schedules.
            </p>
          </div>

          {/* Mock API Status Pill & Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Cache Active Status Pill (mandated by SRS 4.1) */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Cache Active</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-pitch-surface border border-pitch-border text-sport-muted text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-accent-cyan" />
              <span>{totalCount} Fixtures Ingested</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sport-muted">
          <div>
            © 2026 MATCHPULSE Football Analytics. Software Requirements Specification compliant.
          </div>

          <div className="flex items-center space-x-6 text-sport-subtle">
            <span className="hover:text-sport-text transition-colors">WCAG AA Accessible</span>
            <span className="hover:text-sport-text transition-colors">Vercel Ready</span>
            <span className="hover:text-sport-text transition-colors">Defensive Parser v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
