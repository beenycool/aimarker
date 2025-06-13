// import { Icon } from "lucide-react";

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="flex flex-col items-center text-center gap-4">
      {/* <Icon name={icon} className="h-10 w-10 text-primary" /> */}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
  
  export const Features = () => (
    <section className="container-custom section-padding">
      <div className="text-center">
        <h2 className="heading-secondary">Why Choose AI GCSE Marker?</h2>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon="brain-circuit"
          title="AI-Powered Accuracy"
          description="Advanced AI models provide consistent, detailed feedback"
        />
        <FeatureCard
          icon="book-open"
          title="Multiple Exam Boards"
          description="Support for AQA, Edexcel, OCR, and WJEC specifications"
        />
        <FeatureCard
          icon="ruler"
          title="Grade Boundaries"
          description="Accurate GCSE grading with customizable boundaries"
        />
        <FeatureCard
          icon="files"
          title="Bulk Processing"
          description="Mark multiple papers simultaneously with batch processing"
        />
      </div>
    </section>
  ); 
 