import type { IAgentItem } from '@/types/agent';

import { useMemo } from 'react';

import Box from '@mui/material/Box';

import { AgentCard } from './agent-card';

type Props = {
  agents: IAgentItem[];
};

export function AgentCardList({ agents }: Props) {
  const memoizedAgents = useMemo(() => agents, [agents]);

  return (
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      }}
    >
      {memoizedAgents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </Box>
  );
}
