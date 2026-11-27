// Common / UI Primitives
export {
  Skeleton,
  DiagnosticResultSkeleton,
  EncyclopediaSkeleton,
  PageRouteSkeleton
} from './common/SkeletonLoader';

// Layout Components
export { default as Navbar } from './layout/Navbar';
export { default as HeroSection } from './layout/HeroSection';
export { default as Footer } from './layout/Footer';

// Leaf Scanner & Diagnostics
export { default as UploadZone } from './scanner/UploadZone';
export { default as SampleGallery } from './scanner/SampleGallery';
export { default as DiagnosticHub } from './scanner/DiagnosticHub';

// Pathology Report & PDF Generation
export { default as ReportModal } from './report/ReportModal';
export { default as OfficialPdfReport } from './report/OfficialPdfReport';

// Knowledge Base & Neural Architecture Views
export { default as DiseaseEncyclopedia } from './views/DiseaseEncyclopedia';
export { default as ModelArchitecture } from './views/ModelArchitecture';
