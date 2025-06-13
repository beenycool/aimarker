const StatCard = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col gap-2">
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
  
  export const Stats = () => (
    <section id="stats" className="bg-secondary/50">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard value="10+" label="AI Models" />
          <StatCard value="15+" label="Subjects" />
          <StatCard value="4" label="Exam Boards" />
          <StatCard value="10k+" label="Papers to Mark" />
        </div>
      </div>
    </section>
  ); 