import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}

export default function ToolCard({ title, description, href, icon }: ToolCardProps) {
    return (
        <div className="group h-full">
            <Link href={href} className="block h-full outline-none">
                <div className="h-full p-6 bg-card border border-border rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                    {/* Icon Box */}
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary group-hover:text-white">
                        {icon}
                    </div>

                    <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h2>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        Open Tool <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
