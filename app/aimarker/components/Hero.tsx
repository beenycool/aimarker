import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface HeroProps {
  handleGetStarted: () => void;
}

export const Hero = ({ handleGetStarted }: HeroProps) => (
  <section className="container-custom text-center py-20">
    <Badge variant="default" className="mb-4">
      Version 2.2.0 - Now with Advanced AI Models
    </Badge>
    <h1 className="heading-primary text-gradient">
      AI-Powered GCSE Essay Grading
    </h1>
    <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
      Get Instant, Unbiased Feedback on GCSE Essays and Save Hours on Marking.
    </p>
    <div className="mt-8 flex justify-center gap-4">
      <Button size="lg" className="btn-hero" onClick={handleGetStarted}>
        Start Marking Now <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
      <Button size="lg" variant="outline" className="btn-hero" onClick={() => document.getElementById('sample-questions')?.scrollIntoView({ behavior: 'smooth' })}>
        View Examples
      </Button>
    </div>
  </section>
); 