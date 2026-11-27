import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Leaf, Sparkles, Database, Layers } from 'lucide-react';
import { ROUTES } from '../../routes/paths';
import { Skeleton } from '../common/SkeletonLoader';

export default function Navbar({ backendStatus }) {
  const statusClass =
    backendStatus === 'healthy'
      ? 'online'
      : backendStatus === 'offline'
      ? 'offline'
      : 'connecting';

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* Brand */}
        <Link to={ROUTES.HOME} className="nav-brand">
          <div className="brand-icon-box">
            <Leaf size={20} />
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">BioShield</span>
            <span className="brand-tag">PRO AI</span>
          </div>
        </Link>

        {/* Navigation Tabs with Dynamic Routes */}
        <div className="nav-links">
          <NavLink
            to={ROUTES.HOME}
            end
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            <Sparkles size={16} />
            <span>AI Diagnostic Lab</span>
          </NavLink>

          <NavLink
            to={ROUTES.ENCYCLOPEDIA}
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            <Database size={16} />
            <span>Disease Encyclopedia</span>
          </NavLink>

          <NavLink
            to={ROUTES.ARCHITECTURE}
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>Model Architecture</span>
          </NavLink>
        </div>

        {/* Status Pill */}
        <div className="nav-actions">
          <div
            className={`engine-status-pill ${statusClass}`}
            title="PyTorch CNN Backend Status"
          >
            <span className="status-dot" />
            {backendStatus === 'connecting' ? (
              <Skeleton width={116} height={12} variant="pill" />
            ) : (
              <span>
                {backendStatus === 'healthy' ? 'Neural Engine Online' : 'Backend Offline'}
              </span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
