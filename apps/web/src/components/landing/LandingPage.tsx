'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap, ArrowRight, Server, Database, Monitor, Shield, MessagesSquare, HardDrive,
  Code2, Cloud, LayoutDashboard, Boxes, GitBranch, Download,
} from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Visual Architecture Design',
    description: 'Drag and drop services onto a canvas. Connect them visually. See your system take shape in real time.',
  },
  {
    icon: Code2,
    title: 'Multi-Stack Code Generation',
    description: 'Generate production-ready code in Node.js, Python, or .NET. Choose your stack per service.',
  },
  {
    icon: Cloud,
    title: 'Infrastructure as Code',
    description: 'Generate Terraform for AWS with VPC, ECS, RDS, and S3. Azure and GCP coming soon.',
  },
  {
    icon: Zap,
    title: 'AI-Enhanced Logic',
    description: 'Optionally use Claude AI to generate business logic, route handlers, and database queries.',
  },
  {
    icon: Boxes,
    title: 'Starter Templates',
    description: 'Jump-start with pre-built architectures: SaaS, Microservices, E-Commerce, and more.',
  },
  {
    icon: Download,
    title: 'You Own the Code',
    description: 'Download clean, standard code as a ZIP. No vendor lock-in. Works without our tool.',
  },
];

const componentTypes = [
  { icon: Server, label: 'API Service', color: 'text-blue-500' },
  { icon: Database, label: 'Database', color: 'text-emerald-500' },
  { icon: Monitor, label: 'Frontend', color: 'text-purple-500' },
  { icon: Shield, label: 'Auth', color: 'text-amber-500' },
  { icon: MessagesSquare, label: 'Queue', color: 'text-orange-500' },
  { icon: HardDrive, label: 'Storage', color: 'text-cyan-500' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-lg">Solution Prototyping</span>
          </div>
          <Link href="/designer">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Open Designer <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            Visual Architecture &rarr; Working Code
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-6">
            Design your architecture visually.
            <br />
            <span className="text-blue-600">Generate production-ready code.</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Drag and drop services, configure tech stacks, and generate a complete application
            with Docker, infrastructure, and deployment configs. In any stack, for any cloud.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/designer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 h-12">
                <Zap className="h-5 w-5 mr-2" /> Start Designing
              </Button>
            </Link>
            <Link href="/designer">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Component strip */}
      <section className="py-8 border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 flex-wrap px-6">
          {componentTypes.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Icon className={`h-4 w-4 ${color}`} />
              {label}
            </div>
          ))}
          <span className="text-sm text-gray-400">+ Serverless</span>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to go from diagram to deployment
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Design visually, generate code in your preferred stack, deploy to your cloud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-800
                           hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all"
              >
                <Icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Three steps to a working app
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Design', desc: 'Drag services onto the canvas and connect them. Choose tech stacks per component.' },
              { step: '2', title: 'Configure', desc: 'Define models, endpoints, tables, and pages in the properties panel.' },
              { step: '3', title: 'Generate', desc: 'Preview the code, download as ZIP, and run with docker compose up.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to prototype?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            No account required. Start designing in your browser right now.
          </p>
          <Link href="/designer">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base px-10 h-12">
              Open the Designer <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Solution Prototyping
          </div>
          <div>
            Built for architects and engineers
          </div>
        </div>
      </footer>
    </div>
  );
}
