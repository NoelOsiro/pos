import type { IFarmCard } from '@/types/farmer';
import type { Grid2Props } from '@mui/material/Grid2';

import Grid from '@mui/material/Grid2';

import { FarmCard } from './farm-card';

type Props = Grid2Props & {
  farms: IFarmCard[];
};

export function FarmCardList({ farms, ...other }: Props) {
  return (
    <Grid container spacing={3} {...other}>
      {farms.map((farm) => (
        <Grid key={farm.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FarmCard farm={farm} />
        </Grid>
      ))}
    </Grid>
  );
}