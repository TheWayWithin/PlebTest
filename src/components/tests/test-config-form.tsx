'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  Users,
  MessageSquare,
  Eye,
  Smile,
  Scale,
  Frown,
  Zap,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  createTestSchema,
  type CreateTestInput,
  TEST_MODE_OPTIONS,
  VALIDATION_MODE_OPTIONS,
  PUSHBACK_PRESET_OPTIONS,
  type TestMode,
  type ValidationMode,
  type PushbackPreset,
  getTierFeatures,
  isTestModeAvailable,
  isValidationModeAvailable,
} from '@/lib/validations/test';

interface Icp {
  id: string;
  name: string;
  pain_intensity: string | null;
}

interface TestConfigFormProps {
  ideaId: string;
  proposalId: string;
  icps: Icp[];
  userTier: 'solo' | 'growth' | 'scale' | 'pro' | null;
  testsUsedThisMonth: number;
}

export function TestConfigForm({
  ideaId,
  proposalId,
  icps,
  userTier,
  testsUsedThisMonth,
}: TestConfigFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tierLimits = getTierFeatures(userTier);
  const testsRemaining = tierLimits.testsPerMonth - testsUsedThisMonth;

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTestInput>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      icp_ids: icps.length === 1 ? [icps[0].id] : [],
      persona_count: TEST_MODE_OPTIONS.standard.personaCount,
      test_mode: 'standard',
      validation_mode: 'spectator',
      pushback_preset: 'pragmatist',
    },
  });

  const selectedIcpIds = watch('icp_ids');
  const testMode = watch('test_mode');
  const validationMode = watch('validation_mode');
  const pushbackPreset = watch('pushback_preset');
  const personaCount = watch('persona_count');

  const handleIcpToggle = (icpId: string, checked: boolean) => {
    const current = selectedIcpIds || [];
    if (checked) {
      setValue('icp_ids', [...current, icpId]);
    } else {
      setValue('icp_ids', current.filter((id) => id !== icpId));
    }
  };

  const handleTestModeChange = (mode: TestMode) => {
    setValue('test_mode', mode);
    setValue('persona_count', TEST_MODE_OPTIONS[mode].personaCount);
  };

  const onSubmit = async (data: CreateTestInput) => {
    if (testsRemaining <= 0) {
      setError('You have reached your monthly test limit. Please upgrade your plan.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/ideas/${ideaId}/proposals/${proposalId}/tests`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create test');
      }

      const { test } = await response.json();
      router.push(`/ideas/${ideaId}/proposals/${proposalId}/tests/${test.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create test');
      setIsSubmitting(false);
    }
  };

  const testModeIcon = {
    quick: Zap,
    standard: Clock,
    deep: Target,
  };

  const pushbackIcon = {
    cheerleader: Smile,
    pragmatist: Scale,
    critic: Frown,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Tests Remaining Banner */}
      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div>
          <p className="text-gray-300 font-medium">Tests Remaining This Month</p>
          <p className="text-sm text-gray-500">
            {userTier || 'solo'} tier • Resets at billing cycle
          </p>
        </div>
        <div className="text-right">
          <span className={`text-3xl font-bold ${testsRemaining > 5 ? 'text-green-400' : testsRemaining > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
            {testsRemaining}
          </span>
          <span className="text-gray-500"> / {tierLimits.testsPerMonth}</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ICP Selection */}
      <section className="space-y-4">
        <div>
          <Label className="text-white text-lg">Select ICPs to Test</Label>
          <p className="text-sm text-gray-400 mt-1">
            Choose which customer profiles you want to validate against
          </p>
        </div>

        {icps.length === 0 ? (
          <Alert className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No ICPs defined yet. Please create at least one ICP before running a test.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            {icps.map((icp) => (
              <label
                key={icp.id}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedIcpIds.includes(icp.id)
                    ? 'bg-orange-500/10 border-orange-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Checkbox
                  checked={selectedIcpIds.includes(icp.id)}
                  onCheckedChange={(checked) => handleIcpToggle(icp.id, checked as boolean)}
                  className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{icp.name}</p>
                </div>
                {icp.pain_intensity && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    icp.pain_intensity === 'blocking'
                      ? 'bg-red-500/20 text-red-400'
                      : icp.pain_intensity === 'costly'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {icp.pain_intensity}
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
        {errors.icp_ids && (
          <p className="text-sm text-red-400">{errors.icp_ids.message}</p>
        )}
      </section>

      {/* Test Mode */}
      <section className="space-y-4">
        <div>
          <Label className="text-white text-lg">Test Mode</Label>
          <p className="text-sm text-gray-400 mt-1">
            How thorough should the validation be?
          </p>
        </div>

        <RadioGroup
          value={testMode}
          onValueChange={(v) => handleTestModeChange(v as TestMode)}
          className="grid gap-3"
        >
          {(Object.entries(TEST_MODE_OPTIONS) as [TestMode, typeof TEST_MODE_OPTIONS[TestMode]][]).map(
            ([mode, config]) => {
              const Icon = testModeIcon[mode];
              const available = isTestModeAvailable(userTier, mode);
              return (
                <label
                  key={mode}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    testMode === mode
                      ? 'bg-orange-500/10 border-orange-500/50'
                      : available
                      ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-800/30 border-gray-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <RadioGroupItem
                    value={mode}
                    disabled={!available}
                    className="border-gray-600 text-orange-500"
                  />
                  <Icon className={`w-5 h-5 ${testMode === mode ? 'text-orange-400' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{config.label}</p>
                    <p className="text-sm text-gray-400">{config.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">{config.duration}</span>
                  {!available && (
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded">
                      Upgrade
                    </span>
                  )}
                </label>
              );
            }
          )}
        </RadioGroup>
      </section>

      {/* Persona Count Slider */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white text-lg">Persona Count</Label>
            <p className="text-sm text-gray-400 mt-1">
              Number of AI personas to interview
            </p>
          </div>
          <span className="text-2xl font-bold text-orange-400">{personaCount}</span>
        </div>

        <div className="px-2">
          <Slider
            value={[personaCount]}
            onValueChange={([v]) => setValue('persona_count', v)}
            min={1}
            max={Math.min(tierLimits.maxPersonasPerTest, 50)}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>1</span>
            <span>Max: {Math.min(tierLimits.maxPersonasPerTest, 50)}</span>
          </div>
        </div>
      </section>

      {/* Validation Mode */}
      <section className="space-y-4">
        <div>
          <Label className="text-white text-lg">Validation Mode</Label>
          <p className="text-sm text-gray-400 mt-1">
            How do you want to participate?
          </p>
        </div>

        <RadioGroup
          value={validationMode}
          onValueChange={(v) => setValue('validation_mode', v as ValidationMode)}
          className="grid md:grid-cols-2 gap-3"
        >
          {(Object.entries(VALIDATION_MODE_OPTIONS) as [ValidationMode, typeof VALIDATION_MODE_OPTIONS[ValidationMode]][]).map(
            ([mode, config]) => {
              const Icon = mode === 'interactive' ? MessageSquare : Eye;
              const available = isValidationModeAvailable(userTier, mode);
              return (
                <label
                  key={mode}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    validationMode === mode
                      ? 'bg-orange-500/10 border-orange-500/50'
                      : available
                      ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-800/30 border-gray-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <RadioGroupItem
                    value={mode}
                    disabled={!available}
                    className="border-gray-600 text-orange-500 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${validationMode === mode ? 'text-orange-400' : 'text-gray-400'}`} />
                      <p className="text-white font-medium">{config.label}</p>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{config.description}</p>
                  </div>
                  {!available && (
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded">
                      Upgrade
                    </span>
                  )}
                </label>
              );
            }
          )}
        </RadioGroup>
      </section>

      {/* Pushback Preset */}
      <section className="space-y-4">
        <div>
          <Label className="text-white text-lg">Pushback Level</Label>
          <p className="text-sm text-gray-400 mt-1">
            How critical should the personas be?
          </p>
        </div>

        <RadioGroup
          value={pushbackPreset}
          onValueChange={(v) => setValue('pushback_preset', v as PushbackPreset)}
          className="grid gap-3"
        >
          {(Object.entries(PUSHBACK_PRESET_OPTIONS) as [PushbackPreset, typeof PUSHBACK_PRESET_OPTIONS[PushbackPreset]][]).map(
            ([preset, config]) => {
              const Icon = pushbackIcon[preset];
              return (
                <label
                  key={preset}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    pushbackPreset === preset
                      ? 'bg-orange-500/10 border-orange-500/50'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <RadioGroupItem
                    value={preset}
                    className="border-gray-600 text-orange-500"
                  />
                  <Icon className={`w-5 h-5 ${pushbackPreset === preset ? 'text-orange-400' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{config.label}</p>
                    <p className="text-sm text-gray-400">{config.description}</p>
                  </div>
                </label>
              );
            }
          )}
        </RadioGroup>
      </section>

      {/* Summary */}
      <section className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-2">
        <h3 className="text-white font-medium mb-3">Test Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-400">ICPs Selected:</span>
          <span className="text-white">{selectedIcpIds.length}</span>
          <span className="text-gray-400">Personas:</span>
          <span className="text-white">{personaCount}</span>
          <span className="text-gray-400">Test Mode:</span>
          <span className="text-white capitalize">{testMode}</span>
          <span className="text-gray-400">Validation Mode:</span>
          <span className="text-white capitalize">{validationMode}</span>
          <span className="text-gray-400">Pushback Level:</span>
          <span className="text-white capitalize">{pushbackPreset}</span>
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || selectedIcpIds.length === 0 || testsRemaining <= 0}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Test...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Start Test
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
