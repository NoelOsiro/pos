import type { IDateValue } from './common';

export type IFarmerItem = {
  id: string;
  member_number: string;
  first_name: string;
  last_name: string;
  national_id?: string;
  national_id_masked: string;
  phone: string;
  payout_phone: string;
  gender: 'female' | 'male' | 'other' | '';
  date_of_birth: string | null;
  county: number;
  county_name: string;
  sub_county: string;
  ward?: string;
  village?: string;
  status: 'pending' | 'active' | 'suspended' | 'exited';
  status_display: string;
  status_reason: string;
  farm_count: number;
  registered_by: number | null;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type IFarmItem = {
  id: string;
  farmer: string;
  farmer_name: string;
  name: string;
  sector: string;
  sector_name: string;
  size_acres: string;
  county: number;
  sub_county: string;
  ward?: string;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type IFarmCard = {
  id: string;
  name: string;
  farmer_name: string;
  sector_name: string;
  size_acres: string;
  county_name: string;
  is_active: boolean;
};

export type IFarmTableFilters = {
  name: string;
  farmer: string;
  status: string;
};

export type IFarmFormData = {
  id?: string;
  name: string;
  sector: string;
  size_acres: string;
  county: number | null;
  sub_county: string;
  ward?: string;
  latitude?: string;
  longitude?: string;
  is_active: boolean;
};

export type IFarmerTableFilters = {
  name: string;
  status: string;
  county: string;
};

export type IFarmerCard = {
  id: string;
  member_number: string;
  first_name: string;
  last_name: string;
  status: string;
  farm_count: number;
  phone: string;
  county_name: string;
};

export type IFarmerStatusOption = {
  value: 'pending' | 'active' | 'suspended' | 'exited';
  label: string;
};

export const FARMER_STATUS_OPTIONS: IFarmerStatusOption[] = [
  { value: 'pending', label: 'Pending approval' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'exited', label: 'Exited' },
];

export type ICountyOption = {
  id: number;
  name: string;
  code?: string;
};

export type IFarmerGenderOption = {
  value: 'female' | 'male' | 'other' | '';
  label: string;
};

export const FARMER_GENDER_OPTIONS: IFarmerGenderOption[] = [
  { value: '', label: 'Select gender' },
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
];

export type IFarmerFormData = {
  id?: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone: string;
  payout_phone?: string;
  gender: 'female' | 'male' | 'other' | '';
  date_of_birth?: string | null;
  county: number | null;
  sub_county: string;
  ward?: string;
  village?: string;
};