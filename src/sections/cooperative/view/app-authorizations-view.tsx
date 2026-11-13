'use client';

import { useCallback, useEffect, useState } from 'react';
import api, { authEndpoints, cooperativeEndpoints } from '@/auth/services/api';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { paths } from '@/routes/paths';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type RequestedScope = { scope: string; description: string };
type AppAuthorization = {
  id: string;
  app: { id: string; name: string; company: string };
  purpose: string;
  expected_volume: string;
  requested_products: string[];
  requested_scopes: RequestedScope[];
  granted_scopes: string[];
  status: string;
  reason: string;
  last_used_at: string | null;
  created_at: string;
  approved_at: string | null;
};
type AuthorizationResponse = { results: AppAuthorization[] };

export function AppAuthorizationsView() {
  const [pending, setPending] = useState<AppAuthorization[]>([]);
  const [active, setActive] = useState<AppAuthorization[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<Record<string, string[]>>({});
  const [totp, setTotp] = useState('');
  const [verifiedUntil, setVerifiedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadAuthorizations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [pendingResponse, activeResponse] = await Promise.all([
        api.get<AuthorizationResponse>(cooperativeEndpoints.appAuthorizations),
        api.get<AuthorizationResponse>(cooperativeEndpoints.activeAppAuthorizations),
      ]);
      setPending(pendingResponse.data.results);
      setActive(activeResponse.data.results);
      setSelectedScopes((current) => {
        const updated = { ...current };
        pendingResponse.data.results.forEach((item) => {
          updated[item.id] ??= item.requested_scopes.map((scope) => scope.scope);
        });
        return updated;
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not load app authorizations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAuthorizations();
  }, [loadAuthorizations]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleStepUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWorking('mfa');
    setError('');
    setNotice('');
    try {
      const response = await api.post<{ verified: boolean; expires_at: string }>(
        authEndpoints.mfaStepUp,
        { token: totp },
      );
      setVerifiedUntil(new Date(response.data.expires_at).getTime());
      setTotp('');
      setNotice('MFA verified. Approval is enabled for the next 10 minutes.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'MFA verification failed.');
      setVerifiedUntil(null);
    } finally {
      setWorking(null);
    }
  };

  const handleApprove = async (authorization: AppAuthorization) => {
    if (!verifiedUntil || verifiedUntil <= Date.now()) {
      setError('Verify MFA before approving an authorization.');
      return;
    }
    setWorking(authorization.id);
    setError('');
    setNotice('');
    try {
      await api.post(cooperativeEndpoints.approveAppAuthorization(authorization.id), {
        granted_scopes: selectedScopes[authorization.id] ?? [],
      });
      setNotice(`Production access approved for ${authorization.app.name}.`);
      await loadAuthorizations();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not approve authorization.');
    } finally {
      setWorking(null);
    }
  };

  const handleDecline = async (authorization: AppAuthorization) => {
    const reason = window.prompt('Optional reason for declining this access request:') ?? '';
    setWorking(authorization.id);
    setError('');
    setNotice('');
    try {
      await api.post(cooperativeEndpoints.declineAppAuthorization(authorization.id), { reason });
      setNotice(`Production access declined for ${authorization.app.name}.`);
      await loadAuthorizations();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not decline authorization.');
    } finally {
      setWorking(null);
    }
  };

  const handleRevoke = async (authorization: AppAuthorization) => {
    if (!window.confirm(`Revoke ${authorization.app.name}'s production access now?`)) return;
    const reason = window.prompt('Optional reason for revocation:') ?? '';
    setWorking(authorization.id);
    setError('');
    setNotice('');
    try {
      await api.post(cooperativeEndpoints.revokeAppAuthorization(authorization.id), { reason });
      setNotice(`Production access revoked for ${authorization.app.name}.`);
      await loadAuthorizations();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not revoke authorization.');
    } finally {
      setWorking(null);
    }
  };

  const toggleScope = (authorizationId: string, scope: string) => {
    setSelectedScopes((current) => {
      const selected = current[authorizationId] ?? [];
      return {
        ...current,
        [authorizationId]: selected.includes(scope)
          ? selected.filter((item) => item !== scope)
          : [...selected, scope],
      };
    });
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="App authorizations"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cooperative' },
          { name: 'App authorizations' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        {notice && <Alert severity="success">{notice}</Alert>}

        <Card sx={{ p: 3 }}>
          <Stack
            component="form"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'center' }}
            onSubmit={handleStepUp}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Fresh MFA required to approve</Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your authenticator code. Verification lasts 10 minutes and is bound to this cooperative session.
              </Typography>
            </Box>
            <TextField
              label="Authenticator code"
              value={totp}
              onChange={(event) => setTotp(event.target.value)}
              inputProps={{ inputMode: 'numeric', maxLength: 8 }}
              required
              size="small"
            />
            <Button type="submit" variant="outlined" disabled={working === 'mfa'}>
              {working === 'mfa' ? 'Verifying…' : 'Verify MFA'}
            </Button>
          </Stack>
          {verifiedUntil && verifiedUntil > now && (
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
              Verified until {new Date(verifiedUntil).toLocaleTimeString()}.
            </Typography>
          )}
        </Card>

        {loading ? (
          <Stack alignItems="center" sx={{ py: 8 }}><CircularProgress /></Stack>
        ) : (
          <>
            <Stack spacing={2}>
              <Typography variant="h6">Requests waiting for approval</Typography>
              {pending.length === 0 && <Alert severity="info">There are no pending app authorization requests.</Alert>}
              {pending.map((authorization) => (
                <Card key={authorization.id} sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h6">{authorization.app.company} · {authorization.app.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Requested products: {authorization.requested_products.join(', ')} · Expected volume: {authorization.expected_volume}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{authorization.purpose}</Typography>
                    <Box>
                      <Typography variant="subtitle2">Requested permissions — grant only what is needed</Typography>
                      <Stack>
                        {authorization.requested_scopes.map((scope) => (
                          <FormControlLabel
                            key={scope.scope}
                            control={
                              <Checkbox
                                checked={(selectedScopes[authorization.id] ?? []).includes(scope.scope)}
                                onChange={() => toggleScope(authorization.id, scope.scope)}
                              />
                            }
                            label={`${scope.description} (${scope.scope})`}
                          />
                        ))}
                      </Stack>
                    </Box>
                    <Divider />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={() => void handleApprove(authorization)}
                        disabled={!verifiedUntil || verifiedUntil <= now || !(selectedScopes[authorization.id]?.length)}
                      >
                        {working === authorization.id ? 'Saving…' : 'Approve selected scopes'}
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => void handleDecline(authorization)}
                        disabled={working === authorization.id}
                      >
                        Decline
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>

            <Stack spacing={2}>
              <Typography variant="h6">Active authorizations</Typography>
              {active.length === 0 && <Alert severity="info">No apps currently have active cooperative authorization.</Alert>}
              {active.map((authorization) => (
                <Card key={authorization.id} sx={{ p: 3 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography variant="subtitle1">{authorization.app.company} · {authorization.app.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Granted: {authorization.granted_scopes.map((scope) => _scopeLabel(scope)).join(', ')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Last used: {authorization.last_used_at ? new Date(authorization.last_used_at).toLocaleString() : 'Not yet used'}
                      </Typography>
                    </Box>
                    <Button color="error" variant="outlined" onClick={() => void handleRevoke(authorization)}>
                      Revoke access
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </DashboardContent>
  );
}

function _scopeLabel(scope: string) {
  return scope.replace(/:(read|write)$/, (_, permission: string) => permission === 'read' ? ' (read)' : ' (write)');
}
