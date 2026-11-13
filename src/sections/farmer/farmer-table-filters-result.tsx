import type { IFarmerTableFilters } from '@/types/farmer';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from '@/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';

type Props = FiltersResultProps & {
  onResetPage: () => void;
  filters: UseSetStateReturn<IFarmerTableFilters>;
};

export function FarmerTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemoveCounty = useCallback(() => {
    onResetPage();
    updateFilters({ county: '' });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'all'}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="County:" isShow={!!currentFilters.county}>
        <Chip {...chipProps} label={currentFilters.county} onDelete={handleRemoveCounty} />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip {...chipProps} label={currentFilters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}