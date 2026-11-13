export type IAgentItem = {
  id: string;
  email: string;
  full_name: string;
  employee_number: string;
  branch_name: string;
  phone: string;
  assigned_wards: string[];
  status: 'active' | 'suspended' | 'deactivated';
  created_at: string;
};

export type IAgentFormData = {
  id?: string;
  email: string;
  phone: string;
  branch: string;
  employee_number?: string;
  assigned_wards: string[];
};

export type IAgentCard = {
  id: string;
  employee_number: string;
  full_name: string;
  branch_name: string;
  phone: string;
  status: string;
};

export type IAgentTableFilters = {
  name: string;
  status: string;
  branch: string;
};

export type IAgentStatusOption = {
  value: 'active' | 'suspended' | 'deactivated';
  label: string;
};

export const AGENT_STATUS_OPTIONS: IAgentStatusOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'deactivated', label: 'Deactivated' },
];
