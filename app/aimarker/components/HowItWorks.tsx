const HowItWorksCard = ({ step, title, description }: { step: string; title: string; description: string }) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
        {step}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
  
  export const HowItWorks = () => (
    <section className="container-custom section-padding">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="heading-secondary">How It Works</h2>
        <p className="mt-4 text-muted-foreground">
          Get AI-powered feedback on GCSE papers in three simple steps
        </p>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
        <HowItWorksCard
          step="1"
          title="Enter Question & Answer"
          description="Paste your question and student's answer, or use one of our sample questions"
        />
        <HowItWorksCard
          step="2"
          title="Choose Settings"
          description="Select subject, exam board, and AI model for personalized marking"
        />
        <HowItWorksCard
          step="3"
          title="Get AI Feedback"
          description="Receive detailed feedback, marks, and suggestions for improvement"
        />
      </div>
    </section>
  ); 