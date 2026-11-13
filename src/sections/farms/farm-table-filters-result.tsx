import type { IFarmTableFilters } from '@/types/farmer';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from '@/components/filters-result';

import { useCallback } from 'react';
import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';

import Chip from '@mui/material/Chip';

type Props = FiltersResultProps & {
  onResetPage: () => void;
  filters: UseSetStateReturn<IFarmTableFilters>;
};

export function FarmTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveFarmer = useCallback(() => {
    onResetPage();
    updateFilters({ farmer: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip {...chipProps} label={currentFilters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>

      <FiltersBlock label="Farmer:" isShow={!!currentFilters.farmer}>
        <Chip {...chipProps} label={currentFilters.farmer} onDelete={handleRemoveFarmer} />
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'all' && !!currentFilters.status}>
        <Chip {...chipProps} label={currentFilters.status} onDelete={handleRemoveStatus} />
      </FiltersBlock>
    </FiltersResult>
  );
}