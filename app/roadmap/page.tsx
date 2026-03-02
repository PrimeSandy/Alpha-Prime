import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Roadmap – AlphaPrime',
    description: 'See what\'s coming next to AlphaPrime — launched tools, features in progress, and future ideas.',
    openGraph: {
        title: 'Roadmap – AlphaPrime',
        description: 'See what\'s coming next to AlphaPrime.',
        url: 'https://alphaprime.co.in/roadmap',
    },
};

const LAUNCHED = [
    { name: 'PrimeLink Chat', desc: 'Secure private chat rooms — no accounts, no logs.', date: 'Feb 2026' },
    { name: 'Link Vault', desc: 'Hide secret actions behind any HTTPS link.', date: 'Feb 2026' },
    { name: 'Online Compiler', desc: 'Run Python, C++, JS and more in your browser.', date: 'Jan 2026' },
    { name: 'Color Tools', desc: 'Pickers, gradients, palettes for designers.', date: 'Dec 2025' },
    { name: 'Password Generator', desc: 'Ultra-secure local password generation.', date: 'Dec 2025' },
    { name: 'Diff Checker, Base64, Case Converter, Word Counter, Image Resizer', desc: 'Core productivity tools launched at v1.', date: 'Nov 2025' },
];

const IN_PROGRESS = [
    { name: 'QR Code Generator', desc: 'Generate and download QR codes instantly — no upload, fully private.' },
    { name: 'JSON Formatter', desc: 'Prettify, minify, and validate JSON in one place.' },
    { name: 'Markdown Editor', desc: 'Live preview markdown editor with export to HTML/PDF.' },
];

const COMING_SOON = [
    { name: 'AlphaPrime Pro', desc: 'Unlock premium tools with one subscription — no ads, priority access.' },
    { name: 'Unit Converter', desc: 'Convert length, weight, temperature, and more instantly.' },
    { name: 'Regex Tester', desc: 'Test and debug regular expressions with real-time match highlighting.' },
];

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Roadmap</p>
                    <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4 leading-tight">
                        What&apos;s Coming to AlphaPrime
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Follow our journey — from what&apos;s already live to what we&apos;re building next.
                    </p>
                </div>

                {/* ✅ Launched */}
                <Section icon="✅" label="Launched" labelColor="text-green-600" bgColor="bg-green-50 border-green-200">
                    {LAUNCHED.map((item) => (
                        <TimelineCard key={item.name} {...item} badge={item.date} badgeColor="bg-green-100 text-green-700" />
                    ))}
                </Section>

                {/* 🔨 In Progress */}
                <Section icon="🔨" label="In Progress" labelColor="text-yellow-600" bgColor="bg-yellow-50 border-yellow-200">
                    {IN_PROGRESS.map((item) => (
                        <TimelineCard key={item.name} {...item} badge="Building" badgeColor="bg-yellow-100 text-yellow-700" />
                    ))}
                </Section>

                {/* 🔮 Coming Soon */}
                <Section icon="🔮" label="Coming Soon" labelColor="text-purple-600" bgColor="bg-purple-50 border-purple-200">
                    {COMING_SOON.map((item) => (
                        <TimelineCard key={item.name} {...item} badge="Planned" badgeColor="bg-purple-100 text-purple-700" />
                    ))}
                </Section>

                <p className="text-center text-sm text-gray-400 mt-10">
                    Have an idea?{' '}
                    <a href="/contact" className="underline hover:text-black transition-colors">
                        Suggest a tool →
                    </a>
                </p>
            </div>
        </div>
    );
}

function Section({
    icon, label, labelColor, bgColor, children,
}: {
    icon: string; label: string; labelColor: string; bgColor: string; children: React.ReactNode;
}) {
    return (
        <div className="mb-14">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold mb-6 ${bgColor} ${labelColor}`}>
                <span>{icon}</span>
                <span>{label}</span>
            </div>
            <div className="flex flex-col gap-4 border-l-2 border-gray-100 pl-6">
                {children}
            </div>
        </div>
    );
}

function TimelineCard({
    name, desc, badge, badgeColor,
}: {
    name: string; desc: string; badge?: string; badgeColor?: string;
}) {
    return (
        <div className="relative bg-white border border-gray-200 rounded-2xl p-5 hover:border-black hover:shadow-md transition-all duration-200">
            <div className="absolute -left-9 top-5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-bold text-black text-base mb-1">{name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
                {badge && (
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}
