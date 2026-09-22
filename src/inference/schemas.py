from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class Coordinate(BaseModel):
    lat: float
    lng: float

class RegionSummary(BaseModel):
    id: str
    name: str
    tagline: str
    description: str
    state: str
    country: str
    ecosystem_type: str
    center: Coordinate
    default_zoom: int
    total_plots: int
    model_type: str
    outputs_supported: List[str]
    has_boundary: bool
    status: str = "active"

class PlotSummary(BaseModel):
    plot_id: str
    latitude: float
    longitude: float
    observed_dominant_family: Optional[str] = None
    observed_species_richness: Optional[float] = None
    observed_shannon_index: Optional[float] = None
    has_ground_truth: bool = True

class PlotDetail(PlotSummary):
    region_id: str
    features: Dict[str, float]

class ProbabilityItem(BaseModel):
    class_name: str
    probability: float

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    category: str
    description: str

class PredictionResult(BaseModel):
    # Kali biodiversity outputs
    dominant_family: Optional[str] = None
    dominant_family_probability: Optional[float] = None
    family_probabilities: Optional[List[ProbabilityItem]] = None
    species_richness: Optional[float] = None
    shannon_diversity: Optional[float] = None
    
    # Sundarbans land-cover outputs
    land_cover_class: Optional[str] = None
    land_cover_probability: Optional[float] = None
    class_probabilities: Optional[List[ProbabilityItem]] = None

class ObservedTruth(BaseModel):
    dominant_family: Optional[str] = None
    species_richness: Optional[float] = None
    shannon_index: Optional[float] = None

class ValidationMetric(BaseModel):
    method: str
    metric_name: str
    value: float
    display_value: str
    interpretation: str
    scientific_note: str

class AnalyzeRequest(BaseModel):
    region_id: str = Field(..., description="Target region: 'kali' or 'sundarbans'")
    plot_id: Optional[str] = Field(None, description="Optional surveyed plot identifier")
    latitude: Optional[float] = Field(None, description="Custom latitude")
    longitude: Optional[float] = Field(None, description="Custom longitude")
    custom_features: Optional[Dict[str, float]] = Field(None, description="Direct feature vector overrides")

class CarbonBiomassEstimate(BaseModel):
    aboveground_biomass_mgha: float
    belowground_biomass_mgha: float
    total_biomass_mgha: float
    carbon_stock_tcha: float
    co2_equivalent_tco2eha: float
    vcm_valuation_usdha: float
    biomass_category: str
    sar_derivation_note: str
    optical_derivation_note: str
    ipcc_tier_alignment: str

class BotanicalDiagnosticProfile(BaseModel):
    family_name: str
    common_name: str
    representative_taxa: List[str]
    leaf_morphology: str
    bark_stem_anatomy: str
    ecological_keystone_role: str
    ethnobotany_timber: str
    conservation_status: str
    image_url: str
    radar_signature: str

class AnalyzeResponse(BaseModel):
    region_id: str
    plot_id: Optional[str] = None
    coordinates: Coordinate
    mode: str
    mode_badge: str
    mode_description: str
    prediction: PredictionResult
    observed: Optional[ObservedTruth] = None
    features: Dict[str, float]
    top_feature_importances: List[FeatureImportanceItem]
    validation_metric: ValidationMetric
    explanation: Dict[str, Any]
    biomass_carbon: Optional[CarbonBiomassEstimate] = None
    botanical_profile: Optional[BotanicalDiagnosticProfile] = None

class TechnicalModelDetails(BaseModel):
    region_id: str
    region_name: str
    model_family: str
    estimators: Dict[str, str]
    total_training_units: int
    training_data_source: str
    feature_count: int
    feature_list: List[str]
    target_variables: List[str]
    validation_methodology: str
    validation_metric_display: str
    validation_metric_value: float
    feature_importances: List[FeatureImportanceItem]
    limitations: List[str]
