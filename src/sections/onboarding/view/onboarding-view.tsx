"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { Iconify } from "@/components/iconify";
import { SplashScreen } from "@/components/loading-screen";
import { useAuthContext } from "@/auth/hooks";

import {
  createShopAndCompleteOnboarding,
  joinShopAndCompleteOnboarding,
} from "@/app/onboarding/actions";

// ----------------------------------------------------------------------

const STEPS = ["Welcome", "Choose a path", "Get started"];

const BUSINESS_TYPES = [
  { value: "liquor_store", label: "Liquor store" },
  { value: "grocery_store", label: "Grocery store" },
  { value: "mini_mart", label: "Mini-mart" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "clothing", label: "Clothing & fashion" },
  { value: "electronics", label: "Electronics" },
  { value: "restaurant", label: "Restaurant" },
  { value: "other", label: "Other" },
];

type OnboardingPath = "create" | "join";
type Completion = { shopName: string; inviteCode?: string };

// ----------------------------------------------------------------------

export function OnboardingView() {
  const router = useRouter();
  const { user, loading, authenticated, onboardingComplete, refreshSession } =
    useAuthContext();

  const [activeStep, setActiveStep] = useState(0);
  const [path, setPath] = useState<OnboardingPath | null>(null);
  const [firstNameInput, setFirstNameInput] = useState<string | null>(null);
  const [lastNameInput, setLastNameInput] = useState<string | null>(null);
  const [shopName, setShopName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [contactEmailInput, setContactEmailInput] = useState<string | null>(
    null,
  );
  const [contactPhone, setContactPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [completion, setCompletion] = useState<Completion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace(paths.auth.signIn);
    } else if (authenticated && onboardingComplete === true && !completion) {
      router.replace(paths.dashboard.root);
    }
  }, [authenticated, completion, loading, onboardingComplete, router]);

  const nameParts = user?.name?.trim().split(/\s+/) ?? [];
  const firstName = firstNameInput ?? nameParts[0] ?? "";
  const lastName = lastNameInput ?? nameParts.slice(1).join(" ");
  const contactEmail = contactEmailInput ?? user?.email ?? "";

  const handleNext = () => {
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Enter your first and last name to continue.");
      return;
    }

    setActiveStep((current) => current + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result =
        path === "create"
          ? await createShopAndCompleteOnboarding({
              firstName,
              lastName,
              name: shopName,
              businessType,
              location,
              address,
              contactEmail,
              contactPhone,
            })
          : await joinShopAndCompleteOnboarding({
              firstName,
              lastName,
              inviteCode,
            });

      if ("error" in result) {
        setErrorMessage(result.error);
        return;
      }

      await refreshSession();
      setCompletion({
        shopName: result.shopName,
        inviteCode: result.inviteCode,
      });
      setActiveStep(STEPS.length);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Onboarding could not be completed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyInviteCode = async () => {
    if (!completion?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(completion.inviteCode);
      setCopied(true);
    } catch {
      setErrorMessage(
        "Could not copy the invite code. Please select and copy it manually.",
      );
    }
  };

  if (loading || !authenticated) {
    return <SplashScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 2,
        py: { xs: 4, md: 8 },
        bgcolor: "background.neutral",
      }}
    >
      <Card sx={{ maxWidth: 820, mx: "auto", p: { xs: 3, sm: 5 } }}>
        <Box sx={{ maxWidth: 620, mx: "auto" }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Let&apos;s get your shop ready
            </Typography>
            <Typography color="text.secondary">
              A few quick steps to set up your POS workspace.
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {STEPS.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {!!errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {completion ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Box sx={{ color: "success.main", mb: 2 }}>
                <Iconify icon="solar:check-circle-bold" width={56} />
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                You&apos;re all set!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {completion.inviteCode
                  ? `${completion.shopName} is ready. Share this staff invite code with your team:`
                  : `You joined ${completion.shopName}. Welcome aboard!`}
              </Typography>

              {completion.inviteCode && (
                <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ letterSpacing: 3, fontFamily: "monospace" }}
                  >
                    {completion.inviteCode}
                  </Typography>
                  <Button
                    onClick={handleCopyInviteCode}
                    startIcon={
                      <Iconify
                        icon={
                          copied ? "mingcute:check-fill" : "solar:copy-bold"
                        }
                      />
                    }
                    sx={{ mt: 1 }}
                  >
                    {copied ? "Copied" : "Copy invite code"}
                  </Button>
                </Card>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={() => router.replace(paths.dashboard.root)}
              >
                Go to dashboard
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Welcome{firstName ? `, ${firstName}` : ""}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    What should we call you?
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="First name"
                      value={firstName}
                      onChange={(event) =>
                        setFirstNameInput(event.target.value)
                      }
                      required
                      autoComplete="given-name"
                    />
                    <TextField
                      label="Last name"
                      value={lastName}
                      onChange={(event) => setLastNameInput(event.target.value)}
                      required
                      autoComplete="family-name"
                    />
                  </Box>
                  <TextField
                    label="Account email"
                    value={user?.email ?? ""}
                    disabled
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    How would you like to get started?
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Choose whether you&apos;re setting up a shop or joining an
                    existing team.
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        borderColor:
                          path === "create" ? "primary.main" : "divider",
                        borderWidth: path === "create" ? 2 : 1,
                      }}
                    >
                      <Button
                        fullWidth
                        onClick={() => setPath("create")}
                        sx={{
                          minHeight: 180,
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                          textAlign: "center",
                        }}
                      >
                        <Iconify icon="solar:shop-2-bold-duotone" width={42} />
                        <Typography variant="h6">Set up a shop</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Create a workspace and invite your staff.
                        </Typography>
                      </Button>
                    </Card>
                    <Card
                      variant="outlined"
                      sx={{
                        borderColor:
                          path === "join" ? "primary.main" : "divider",
                        borderWidth: path === "join" ? 2 : 1,
                      }}
                    >
                      <Button
                        fullWidth
                        onClick={() => setPath("join")}
                        sx={{
                          minHeight: 180,
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                          textAlign: "center",
                        }}
                      >
                        <Iconify
                          icon="solar:users-group-rounded-bold-duotone"
                          width={42}
                        />
                        <Typography variant="h6">Join as staff</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Join your shop with an invite code.
                        </Typography>
                      </Button>
                    </Card>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && path === "create" && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Tell us about your shop
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    You can update these details later in your settings.
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Shop name"
                      value={shopName}
                      onChange={(event) => setShopName(event.target.value)}
                      required
                      fullWidth
                    />
                    <TextField
                      select
                      label="Main business type"
                      value={businessType}
                      onChange={(event) => setBusinessType(event.target.value)}
                      required
                      fullWidth
                    >
                      {BUSINESS_TYPES.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Town or city"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Shop address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Contact email"
                      type="email"
                      value={contactEmail}
                      onChange={(event) =>
                        setContactEmailInput(event.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Contact phone"
                      type="tel"
                      value={contactPhone}
                      onChange={(event) => setContactPhone(event.target.value)}
                      fullWidth
                    />
                  </Box>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    We&apos;ll create a staff invite code for you to share with
                    your team.
                  </Alert>
                </Box>
              )}

              {activeStep === 2 && path === "join" && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Join your shop
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Ask your shop owner or manager for the staff invite code.
                  </Typography>
                  <TextField
                    label="Staff invite code"
                    value={inviteCode}
                    onChange={(event) =>
                      setInviteCode(event.target.value.toUpperCase())
                    }
                    required
                    fullWidth
                    inputProps={{ maxLength: 32, autoCapitalize: "characters" }}
                    helperText="Invite codes contain 32 letters or numbers."
                  />
                </Box>
              )}

              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={() => {
                    setErrorMessage(null);
                    setActiveStep((current) => Math.max(0, current - 1));
                  }}
                >
                  Back
                </Button>
                {activeStep < 2 ? (
                  <Button
                    variant="contained"
                    disabled={activeStep === 1 && !path}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {path === "create" ? "Create shop" : "Join shop"}
                  </LoadingButton>
                )}
              </Box>
            </form>
          )}
        </Box>
      </Card>
    </Box>
  );
}
