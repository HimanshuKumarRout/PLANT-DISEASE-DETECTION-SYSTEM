import React, { useState } from 'react';
import { Sprout, TestTube2, Sparkles } from 'lucide-react';

const SAMPLES = [
  {
    crop: 'Tomato',
    className: 'Tomato___Early_blight',
    condition: 'Early Blight',
    emoji: '🍅',
    category: 'tomato'
  },
  {
    crop: 'Tomato',
    className: 'Tomato___healthy',
    condition: 'Healthy Leaf',
    emoji: '🌿',
    category: 'tomato'
  },
  {
    crop: 'Apple',
    className: 'Apple___Black_rot',
    condition: 'Black Rot',
    emoji: '🍎',
    category: 'apple'
  },
  {
    crop: 'Apple',
    className: 'Apple___healthy',
    condition: 'Healthy Leaf',
    emoji: '🍏',
    category: 'apple'
  },
  {
    crop: 'Corn',
    className: 'Corn___Common_rust',
    condition: 'Common Rust',
    emoji: '🌽',
    category: 'corn'
  },
  {
    crop: 'Corn',
    className: 'Corn___healthy',
    condition: 'Healthy Leaf',
    emoji: '🌱',
    category: 'corn'
  },
  {
    crop: 'Potato',
    className: 'Potato___Early_blight',
    condition: 'Early Blight',
    emoji: '🥔',
    category: 'potato'
  },
  {
    crop: 'Potato',
    className: 'Potato___healthy',
    condition: 'Healthy Leaf',
    emoji: '🍃',
    category: 'potato'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Crops' },
  { id: 'tomato', label: 'Tomato' },
  { id: 'apple', label: 'Apple' },
  { id: 'corn', label: 'Corn' },
  { id: 'potato', label: 'Potato' }
];

export default function SampleGallery({ onSelectSample, isLoading }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSamples = selectedCategory === 'all'
    ? SAMPLES
    : SAMPLES.filter((s) => s.category === selectedCategory);

  return (
    <div className="glass-panel sample-section">
      <div className="panel-header">
        <div className="panel-title-wrap">
          <div className="panel-icon-badge">
            <TestTube2 size={18} />
          </div>
          <div>
            <h3 className="panel-title">Quick Test Library</h3>
            <p className="panel-desc">Don't have a leaf image? Click any sample to run instant diagnosis</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sample-category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="sample-cards-grid">
        {filteredSamples.map((sample) => (
          <button
            key={sample.className}
            type="button"
            className="sample-card-btn"
            onClick={() => onSelectSample(sample.className)}
            disabled={isLoading}
          >
            <div className="sample-thumb-circle">
              {sample.emoji}
            </div>
            <div className="sample-text-block">
              <span className="sample-crop-name">{sample.crop}</span>
              <span className="sample-condition-name">{sample.condition}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
