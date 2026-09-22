export interface Coordinate {
  lat: float;
  lng: float;
}

export type float = number;

export interface RegionSummary {
  id: string;
  name: string;
  tagline: string;
  description: string;
  state: string;
  country: string;
  ecosystem_type: string;
  center: Coordinate;
  default_zoom: number;
  total_plots: number;
  model_type: string;
  outputs_supported: string[];
  has_boundary: boolean;
  status: string;
}

export interface PlotSummary {
  plot_id: string;
  latitude: number;
  longitude: number;
  observed_dominant_family: string | null;
  observed_species_richness: number | null;
  observed_shannon_index: number | null;
  has_ground_truth: boolean;
}

export interface PlotDetail extends PlotSummary {
  region_id: string;
  features: Record<string, number>;
}

export interface ProbabilityItem {
  class_name: string;
  probability: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  category: string;
  description: string;
}

export interface PredictionResult {
  dominant_family?: string;
  dominant_family_probability?: number;
  family_probabilities?: ProbabilityItem[];
  species_richness?: number;
  shannon_diversity?: number;
  land_cover_class?: string;
  land_cover_probability?: number;
  class_probabilities?: ProbabilityItem[];
}

export interface ObservedTruth {
  dominant_family?: string;
  species_richness?: number;
  shannon_index?: number;
}

export interface ValidationMetric {
  method: string;
  metric_name: string;
  value: number;
  display_value: string;
  interpretation: string;
  scientific_note: string;
}

export interface ExplanationData {
  title: string;
  summary: string;
  key_drivers: string[];
  scientific_context: string;
}

export interface CarbonBiomassEstimate {
  aboveground_biomass_mgha: number;
  belowground_biomass_mgha: number;
  total_biomass_mgha: number;
  carbon_stock_tcha: number;
  co2_equivalent_tco2eha: number;
  vcm_valuation_usdha: number;
  biomass_category: string;
  sar_derivation_note: string;
  optical_derivation_note: string;
  ipcc_tier_alignment: string;
}

export interface BotanicalDiagnosticProfile {
  family_name: string;
  common_name: string;
  representative_taxa: string[];
  leaf_morphology: string;
  bark_stem_anatomy: string;
  ecological_keystone_role: string;
  ethnobotany_timber: string;
  conservation_status: string;
  image_url: string;
  radar_signature: string;
}

export interface AnalyzeResponse {
  region_id: string;
  plot_id: string | null;
  coordinates: Coordinate;
  mode: string;
  mode_badge: string;
  mode_description: string;
  prediction: PredictionResult;
  observed?: ObservedTruth;
  features: Record<string, number>;
  top_feature_importances: FeatureImportanceItem[];
  validation_metric: ValidationMetric;
  explanation: ExplanationData;
  biomass_carbon?: CarbonBiomassEstimate;
  botanical_profile?: BotanicalDiagnosticProfile;
}

export interface TechnicalModelDetails {
  region_id: string;
  region_name: string;
  model_family: string;
  estimators: Record<string, string>;
  total_training_units: number;
  training_data_source: string;
  feature_count: number;
  feature_list: string[];
  target_variables: string[];
  validation_methodology: string;
  validation_metric_display: string;
  validation_metric_value: number;
  feature_importances: FeatureImportanceItem[];
  limitations: string[];
}
