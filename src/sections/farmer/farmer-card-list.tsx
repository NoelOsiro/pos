import type { IFarmerCard } from '@/types/farmer';
import type { Grid2Props } from '@mui/material/Grid2';

import Grid from '@mui/material/Grid2';

import { FarmerCard } from './farmer-card';

type Props = Grid2Props & {
  farmers: IFarmerCard[];
};

export function FarmerCardList({ farmers, ...other }: Props) {
  return (
    <Grid container spacing={3} {...other}>
      {farmers.map((farmer) => (
        <Grid key={farmer.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <FarmerCard farmer={farmer} />
        </Grid>
      ))}
    </Grid>
  );
}