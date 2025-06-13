import React from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { BookOpen, Calculator, Microscope, Globe, Computer, TrendingUp, Play, ArrowRight } from 'lucide-react';
import { 
  ScrollReveal, 
  MotionDiv, 
  MagneticButton,
  staggerContainer,
  fadeInUp
} from './motion-components';

interface SampleQuestion {
  id: string;
  subject: string;
  examBoard: string;
  questionType: string;
  totalMarks: string;
  question: string;
  sampleAnswer: string;
  markScheme?: string;
  icon: React.ReactNode;
}

interface SampleQuestionsProps {
  onUseSample: (sample: SampleQuestion) => void;
}

export const SampleQuestions: React.FC<SampleQuestionsProps> = ({ onUseSample }) => {
  const sampleQuestions: SampleQuestion[] = [
    {
      id: 'english-1',
      subject: 'english',
      examBoard: 'aqa',
      questionType: 'paper1q4',
      totalMarks: '20',
      icon: <BookOpen className="h-5 w-5" />,
      question: `Read the following extract from a novel and then answer the question that follows.

"The rain hammered against the windows like angry fists, each drop a tiny explosion of fury against the glass. Sarah pressed her face to the cold pane, watching the world dissolve into a watercolor blur of greys and browns. The storm had been raging for three days now, and she felt as trapped as a bird in a cage, her wings clipped by the relentless weather."

Question: How does the writer use language and structure to create a sense of confinement and frustration? [20 marks]`,
      sampleAnswer: `The writer effectively uses both language and structure to create a powerful sense of confinement and frustration throughout this extract.

The writer employs personification to make the rain seem aggressive and hostile: "angry fists" and "tiny explosion of fury." This violent imagery suggests that nature itself is attacking Sarah, trapping her inside. The metaphor of raindrops as "fists" creates a sense of being under siege, emphasizing her helplessness.

The simile comparing Sarah to "a bird in a cage" directly reinforces the theme of confinement. Birds are symbols of freedom, so a caged bird represents the complete opposite - total restriction. The phrase "wings clipped" extends this metaphor, suggesting not just temporary confinement but permanent damage to her ability to escape.

Structurally, the writer uses a progression from the external (rain against windows) to the internal (Sarah's emotional state). This mirrors how the physical confinement leads to psychological frustration. The sentence lengths also reflect the mood - the longer, more complex sentences mirror the drawn-out nature of her captivity.

The visual imagery of the world dissolving into "a watercolor blur" suggests that clarity and definition are being lost, just as Sarah's sense of control and freedom are disappearing. The colors "greys and browns" are deliberately dull and lifeless, reflecting her emotional state.`,
      markScheme: `Level 4 (16-20 marks): Perceptive analysis of language and structure
- Detailed analysis of writer's methods
- Judicious use of terminology
- Coherent evaluation of effects

Level 3 (11-15 marks): Clear understanding and explanation
Level 2 (6-10 marks): Some understanding
Level 1 (1-5 marks): Simple awareness`
    },
    {
      id: 'maths-1',
      subject: 'maths',
      examBoard: 'aqa',
      questionType: 'general',
      totalMarks: '6',
      icon: <Calculator className="h-5 w-5" />,
      question: `Solve the following quadratic equation by factorisation:
2x² + 7x - 15 = 0

Show your working clearly. [6 marks]`,
      sampleAnswer: `2x² + 7x - 15 = 0

Step 1: Look for two numbers that multiply to give (2 × -15 = -30) and add to give 7.
These numbers are 10 and -3, because: 10 × (-3) = -30 and 10 + (-3) = 7

Step 2: Rewrite the middle term using these numbers:
2x² + 10x - 3x - 15 = 0

Step 3: Factor by grouping:
2x(x + 5) - 3(x + 5) = 0
(2x - 3)(x + 5) = 0

Step 4: Set each factor equal to zero:
2x - 3 = 0  or  x + 5 = 0
2x = 3      or  x = -5
x = 3/2     or  x = -5

Therefore: x = 1.5 or x = -5`,
      markScheme: `6 marks total:
- 1 mark: Correct factorisation approach
- 2 marks: Correct factorisation (2x-3)(x+5)=0
- 2 marks: Both correct solutions x=1.5 and x=-5
- 1 mark: Clear working shown`
    },
    {
      id: 'science-1',
      subject: 'science',
      examBoard: 'aqa',
      questionType: 'general',
      totalMarks: '15',
      icon: <Microscope className="h-5 w-5" />,
      question: `Describe the process of photosynthesis in plants. Include:
- The equation for photosynthesis
- Where photosynthesis occurs in the plant
- The role of chlorophyll
- Why photosynthesis is important for life on Earth

[15 marks]`,
      sampleAnswer: `Photosynthesis is the process by which green plants make their own food using sunlight, carbon dioxide, and water.

The equation for photosynthesis is:
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

Or in words: Carbon dioxide + Water + Light energy → Glucose + Oxygen

Location in the plant:
Photosynthesis occurs primarily in the leaves of plants, specifically in the chloroplasts found in leaf cells. The chloroplasts contain chlorophyll, which is essential for capturing light energy.

Role of chlorophyll:
Chlorophyll is a green pigment that absorbs light energy from the sun. It captures red and blue light most effectively, reflecting green light (which is why plants appear green). This absorbed light energy is used to power the chemical reactions that convert carbon dioxide and water into glucose.

Importance for life on Earth:
1. Produces oxygen - All aerobic organisms, including humans, depend on the oxygen released by photosynthesis for respiration.
2. Produces food - Plants form the base of most food chains, providing energy for herbivores, which in turn feed carnivores.
3. Removes carbon dioxide - Photosynthesis removes CO₂ from the atmosphere, helping to regulate climate.
4. Energy storage - The glucose produced stores energy that can be accessed by plants and the organisms that eat them.

Without photosynthesis, there would be no oxygen in the atmosphere and no food for most life forms, making it essential for life on Earth.`,
      markScheme: `15 marks total:
- 2 marks: Correct equation (symbols or words)
- 3 marks: Location (leaves, chloroplasts, cells)
- 3 marks: Role of chlorophyll (absorbs light, green pigment, powers reactions)
- 7 marks: Importance (oxygen production, food production, CO₂ removal, energy storage)`
    }
  ];

  return (
    <div className="space-y-6">
      <ScrollReveal animation="fadeInUp" delay={0.2}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Sample Questions</h2>
          <p className="text-muted-foreground">
            Try these example questions to see how our AI marking works across different subjects
          </p>
        </div>
      </ScrollReveal>

      <MotionDiv
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {sampleQuestions.map((sample, index) => (
          <MotionDiv
            key={sample.id}
            variants={fadeInUp}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="group"
          >
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MotionDiv
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20"
                    >
                      {sample.icon}
                    </MotionDiv>
                    <div>
                      <Badge variant="outline" className="capitalize group-hover:bg-primary/10 transition-colors">
                        {sample.subject}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="font-medium">{sample.examBoard.toUpperCase()}</div>
                    <div className="text-primary font-semibold">{sample.totalMarks} marks</div>
                  </div>
                </div>
                
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {sample.subject.charAt(0).toUpperCase() + sample.subject.slice(1)} Sample Question
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <div className="bg-muted/50 p-3 rounded-lg border border-border/50 group-hover:bg-muted/70 transition-colors">
                    <p className="font-medium mb-2 flex items-center">
                      <Play className="w-3 h-3 mr-1" />
                      Question Preview:
                    </p>
                    <p className="line-clamp-4 text-foreground/80">
                      {sample.question.split('\n')[0].length > 150 
                        ? sample.question.split('\n')[0].substring(0, 150) + '...'
                        : sample.question.split('\n')[0]
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <MagneticButton>
                    <Button 
                      onClick={() => onUseSample(sample)}
                      className="w-full group/btn relative overflow-hidden"
                      variant="default"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Use This Sample
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </Button>
                  </MagneticButton>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-muted/50 transition-all duration-300"
                    onClick={() => {
                      // You could implement a preview modal here
                      console.log('Preview sample:', sample.id);
                    }}
                  >
                    Preview Full Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </MotionDiv>
    </div>
  );
}; 