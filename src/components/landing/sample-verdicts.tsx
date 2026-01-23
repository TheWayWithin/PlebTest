"use client";

import { TrendingDown, TrendingUp, AlertTriangle, ArrowRight, X, RotateCcw, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VerdictCardProps {
  type: "kill" | "pivot" | "build";
  ideaName: string;
  ideaDescription: string;
  riskScore: number;
  confidence: "Low" | "Medium" | "High";
  keyObjection: string;
}

function VerdictCard({ type, ideaName, ideaDescription, riskScore, confidence, keyObjection }: VerdictCardProps) {
  const config = {
    kill: {
      gradient: "from-rose-600 to-red-600",
      bgGlow: "bg-rose-500/20",
      border: "border-rose-500/30",
      badgeBg: "bg-rose-500/20",
      badgeText: "text-rose-400",
      badgeBorder: "border-rose-500/30",
      icon: X,
      iconBg: "bg-rose-500/20",
      iconColor: "text-rose-400",
      label: "KILL",
      riskLabel: "High Risk",
      riskColor: "text-rose-400",
    },
    pivot: {
      gradient: "from-amber-600 to-orange-600",
      bgGlow: "bg-amber-500/20",
      border: "border-amber-500/30",
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-400",
      badgeBorder: "border-amber-500/30",
      icon: RotateCcw,
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      label: "PIVOT",
      riskLabel: "Medium Risk",
      riskColor: "text-amber-400",
    },
    build: {
      gradient: "from-emerald-600 to-teal-600",
      bgGlow: "bg-emerald-500/20",
      border: "border-emerald-500/30",
      badgeBg: "bg-emerald-500/20",
      badgeText: "text-emerald-400",
      badgeBorder: "border-emerald-500/30",
      icon: Rocket,
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      label: "BUILD",
      riskLabel: "Low Risk",
      riskColor: "text-emerald-400",
    },
  };

  const c = config[type];
  const Icon = c.icon;

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${c.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`} />

      <Card className={`relative bg-gray-900/90 backdrop-blur-sm ${c.border} border overflow-hidden`}>
        {/* Verdict header bar */}
        <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${c.iconColor}`} />
              </div>
              <div>
                <Badge className={`${c.badgeBg} ${c.badgeText} ${c.badgeBorder} mb-1`}>
                  {c.label}
                </Badge>
                <h3 className="text-lg font-semibold text-white">{ideaName}</h3>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">{ideaDescription}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Metrics row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Risk Score */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Risk Score</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${c.riskColor}`}>{riskScore}</span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${c.gradient} rounded-full transition-all`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
            </div>

            {/* Confidence */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Confidence</div>
              <div className="flex items-center gap-2">
                {confidence === "High" && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                {confidence === "Medium" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {confidence === "Low" && <TrendingDown className="w-5 h-5 text-rose-400" />}
                <span className={`text-lg font-semibold ${
                  confidence === "High" ? "text-emerald-400" :
                  confidence === "Medium" ? "text-amber-400" : "text-rose-400"
                }`}>
                  {confidence}
                </span>
              </div>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full ${
                      (confidence === "High" && level <= 3) ||
                      (confidence === "Medium" && level <= 2) ||
                      (confidence === "Low" && level <= 1)
                        ? `bg-gradient-to-r ${c.gradient}`
                        : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Key Objection */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Key Finding</div>
            <p className="text-sm text-gray-300 italic">"{keyObjection}"</p>
          </div>

          {/* CTA Button */}
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 cursor-not-allowed opacity-60"
            disabled
          >
            View Full Report
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function SampleVerdicts() {
  const sampleVerdicts: VerdictCardProps[] = [
    {
      type: "kill",
      ideaName: "Uber for Dog Walking",
      ideaDescription: "An app that connects dog owners with local dog walkers for on-demand walking services.",
      riskScore: 87,
      confidence: "High",
      keyObjection: "\"I already use Rover. Unless you're half the price, I'm not switching.\" — Sarah, Dog Owner",
    },
    {
      type: "pivot",
      ideaName: "AI Recipe Generator",
      ideaDescription: "Generate personalized recipes based on ingredients you have at home using AI.",
      riskScore: 52,
      confidence: "Medium",
      keyObjection: "\"I'd use this for recipes, but I won't pay monthly. Make it one-time.\" — Lisa, Busy Parent",
    },
    {
      type: "build",
      ideaName: "B2B Invoice Automation",
      ideaDescription: "Automated invoice processing and reconciliation for small accounting firms.",
      riskScore: 23,
      confidence: "High",
      keyObjection: "\"I chase payments manually every month. I'd pay $10/mo to stop that.\" — Alex, Freelancer",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-violet-500/50 text-violet-400">
            Real Examples
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            See What Verdicts Look Like
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Every idea gets a clear, actionable verdict. No wishy-washy feedback - just honest analysis.
          </p>
        </div>

        {/* Verdict Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleVerdicts.map((verdict, index) => (
            <VerdictCard key={index} {...verdict} />
          ))
          }
        </div>

        {/* Patterns Not Predictions Disclaimer */}
        <div className="mt-12 text-center">
          <div className="inline-block rounded-xl bg-slate-800/50 border border-slate-700 px-6 py-4 max-w-2xl">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-slate-300">Patterns, not predictions.</span>{" "}
              PlebTest doesn&apos;t predict revenue or market size. It surfaces patterns of objections and blind spots so you know whether to kill it, pivot, or build.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-400 mb-4">Ready to get your verdict?</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8"
            asChild
          >
            <a href="#waitlist">
              Join the Waitlist
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
