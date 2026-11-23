import React, { useState, useEffect } from 'react';
import { Search, Sprout, AlertCircle, ShieldCheck, Stethoscope, ChevronDown, ChevronUp } from 'lucide-react';

const FALLBACK_DISEASES = {
  "Apple___Black_rot": {
    "plant_name": "Apple",
    "disease_name": "Black Rot",
    "symptoms": ["Purple spots on upper leaf surfaces expanding into 'frog-eye' rings.", "Infected fruit develops brown concentric rot.", "Cankers on limbs and twigs."],
    "causes": ["Botryosphaeria obtusa fungus.", "Overwinters in dead wood and mummified fruit.", "Spread by rain splashing."],
    "prevention": ["Prune dead twigs in winter.", "Remove mummified fruit from trees and ground.", "Clear orchard floor of debris."],
    "treatment": ["Apply copper-based fungicides or sulfur powders in early spring.", "Use liquid copper soaps or neem oil."]
  },
  "Apple___healthy": {
    "plant_name": "Apple",
    "disease_name": "Healthy",
    "symptoms": ["Leaves are vibrant green, flat, and free of spots.", "Stems are clean and intact."],
    "causes": ["Optimal growing conditions, proper watering, and balanced nutrients."],
    "prevention": ["Maintain consistent watering from tree base.", "Prune in winter for airflow."],
    "treatment": ["No treatment required. Continue standard orchard maintenance."]
  },
  "Corn___Common_rust": {
    "plant_name": "Corn",
    "disease_name": "Common Rust",
    "symptoms": ["Golden brown to cinnamon-brown pustules on both leaf surfaces.", "Severely infected leaves turn yellow and die prematurely."],
    "causes": ["Puccinia sorghi fungus.", "Windborne spores carried north from subtropical climates."],
    "prevention": ["Plant resistant corn hybrids.", "Plant early in the season to avoid peak spore flights."],
    "treatment": ["Apply foliar strobilurin or triazole fungicides when pustules first appear on lower canopy."]
  },
  "Corn___healthy": {
    "plant_name": "Corn",
    "disease_name": "Healthy",
    "symptoms": ["Sturdy upright stalk with deep green leaves.", "Uniform ear development without discoloration."],
    "causes": ["Proper soil temperature, adequate nitrogen, and reliable moisture."],
    "prevention": ["Soil testing prior to planting.", "Ensure adequate crop rotation."],
    "treatment": ["No disease treatment needed. Maintain weed control and irrigation."]
  },
  "Potato___Early_blight": {
    "plant_name": "Potato",
    "disease_name": "Early Blight",
    "symptoms": ["Dark brown target-like concentric rings on older bottom leaves.", "Leaves turn chlorotic yellow and drop."],
    "causes": ["Alternaria solani fungus.", "Warm temperatures and alternating wet-dry conditions."],
    "prevention": ["Practice 3 to 4 year crop rotation.", "Drip irrigate to minimize leaf wetness."],
    "treatment": ["Apply chlorothalonil, mancozeb, or copper fungicides at 7-14 day intervals."]
  },
  "Potato___Late_blight": {
    "plant_name": "Potato",
    "disease_name": "Late Blight",
    "symptoms": ["Water-soaked dark lesions with white fungal growth on undersides in humid conditions.", "Rapid tissue collapse."],
    "causes": ["Phytophthora infestans oomycete.", "Cool, damp weather with prolonged leaf wetness."],
    "prevention": ["Destroy cull piles before season.", "Plant certified disease-free seed tubers."],
    "treatment": ["Apply systemic fungicides immediately. Destroy severely infested plants."]
  },
  "Potato___healthy": {
    "plant_name": "Potato",
    "disease_name": "Healthy",
    "symptoms": ["Lush green foliage without spotting or wilting.", "Stems are firm and vigorous."],
    "causes": ["Balanced N-P-K nutrition, proper soil hilling, and good drainage."],
    "prevention": ["Ensure soil is well-drained and maintain proper plant spacing."],
    "treatment": ["No chemical treatment required."]
  },
  "Tomato___Bacterial_spot": {
    "plant_name": "Tomato",
    "disease_name": "Bacterial Spot",
    "symptoms": ["Small circular brown spots surrounded by yellow halos.", "Spots coalesce causing leaf blighting."],
    "causes": ["Xanthomonas bacteria.", "Warm, wet conditions and splashing irrigation."],
    "prevention": ["Use disease-free seed and clean transplant flats.", "Avoid overhead sprinkler irrigation."],
    "treatment": ["Apply copper hydroxide combined with mancozeb to prevent bacterial spread."]
  },
  "Tomato___Early_blight": {
    "plant_name": "Tomato",
    "disease_name": "Early Blight",
    "symptoms": ["Concentric bullseye-shaped lesions starting on bottom foliage.", "Stem cankers and blossom-end rot."],
    "causes": ["Alternaria linariae fungal pathogen."],
    "prevention": ["Mulch base of tomato plants to prevent soil splash.", "Stake plants upright."],
    "treatment": ["Spray with organic copper or bio-fungicides at first sighting."]
  },
  "Tomato___healthy": {
    "plant_name": "Tomato",
    "disease_name": "Healthy",
    "symptoms": ["Uniform green foliage, firm stems, and abundant flowering."],
    "causes": ["Adequate sunlight, steady watering, and calcium-rich soil."],
    "prevention": ["Ensure 6-8 hours of direct sunlight and consistent root watering."],
    "treatment": ["No treatment required. Maintain trellis staking."]
  }
};

export default function DiseaseEncyclopedia({ apiBase = '' }) {
  const [diseases, setDiseases] = useState(FALLBACK_DISEASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [expandedKey, setExpandedKey] = useState(null);

  useEffect(() => {
    fetch(`${apiBase}/api/diseases`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.diseases) {
          setDiseases(data.diseases);
        }
      })
      .catch(() => {});
  }, [apiBase]);

  const toggleExpand = (key) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  const diseaseEntries = Object.entries(diseases);

  const filtered = diseaseEntries.filter(([key, info]) => {
    const matchesCrop =
      selectedCrop === 'all' ||
      info.plant_name.toLowerCase() === selectedCrop.toLowerCase();

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      info.plant_name.toLowerCase().includes(query) ||
      info.disease_name.toLowerCase().includes(query) ||
      (info.symptoms || []).some((s) => s.toLowerCase().includes(query)) ||
      (info.causes || []).some((c) => c.toLowerCase().includes(query));

    return matchesCrop && matchesSearch;
  });

  return (
    <div className="encyclopedia-view">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Crop Pathology Knowledge Base
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Explore symptoms, pathogens, biological vectors, and verified agronomic treatment recipes across all 10 trained crop classes.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="encyclopedia-search-bar">
        <Search size={20} color="var(--primary-light)" />
        <input
          type="text"
          placeholder="Search by disease, pathogen, or symptom (e.g., 'Blight', 'Halo', 'Rust', 'Apple')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Crop Filter Tabs */}
      <div className="sample-category-tabs" style={{ marginBottom: '24px' }}>
        {['all', 'Apple', 'Corn', 'Potato', 'Tomato'].map((crop) => (
          <button
            key={crop}
            type="button"
            className={`cat-pill ${selectedCrop.toLowerCase() === crop.toLowerCase() ? 'active' : ''}`}
            onClick={() => setSelectedCrop(crop)}
          >
            {crop === 'all' ? 'All Classes (10)' : crop}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="encyclopedia-cards-grid">
        {filtered.map(([key, info]) => {
          const isHealthy = info.disease_name.toLowerCase() === 'healthy';
          const isExpanded = expandedKey === key;

          return (
            <div key={key} className="disease-info-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span className="crop-name-pill">{info.plant_name}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
                    {info.disease_name}
                  </h3>
                </div>

                <span className={`severity-pill ${isHealthy ? 'healthy' : 'critical'}`} style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                  {isHealthy ? 'Healthy' : 'Pathogen'}
                </span>
              </div>

              {/* Primary Symptom Preview */}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Primary Indicators
                </span>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {info.symptoms && info.symptoms[0]}
                </p>
              </div>

              {/* Expandable Section */}
              {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', animation: 'tab-switch 0.3s ease' }}>
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>
                      Causal Agents:
                    </strong>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {(info.causes || []).map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>
                      Recommended Agronomic Treatment:
                    </strong>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {(info.treatment || []).map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>
                      Prevention Protocol:
                    </strong>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {(info.prevention || []).map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {/* Toggle Details Button */}
              <button
                type="button"
                className="btn-secondary-action"
                style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                onClick={() => toggleExpand(key)}
              >
                <span>{isExpanded ? 'Hide Details' : 'View Full Pathology'}</span>
                {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
