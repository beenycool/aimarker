import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface CTAProps {
    handleGetStarted: () => void;
}

export const CTA = ({ handleGetStarted }: CTAProps) => (
    <section className="container-custom section-padding text-center">
        <div className="bg-primary/10 rounded-lg p-10">
        <h2 className="heading-secondary">Ready to Start Marking?</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Experience the future of GCSE marking with our AI-powered tool
        </p>
        <Button size="lg" className="mt-8 btn-hero" onClick={handleGetStarted}>
            <Sparkles className="mr-2 h-5 w-5" />
            Start Marking Now
        </Button>
        </div>
    </section>
); 