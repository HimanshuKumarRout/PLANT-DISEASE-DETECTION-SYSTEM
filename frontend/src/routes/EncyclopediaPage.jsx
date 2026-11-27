import React from 'react';
import DiseaseEncyclopedia from '../components/views/DiseaseEncyclopedia';

/**
 * EncyclopediaPage Route Component (/encyclopedia)
 * Full pathology search, symptoms catalog, causes, prevention,
 * and treatment guidelines across 10 supported plant disease classes.
 */
export default function EncyclopediaPage({ apiBase }) {
  return <DiseaseEncyclopedia apiBase={apiBase} />;
}
