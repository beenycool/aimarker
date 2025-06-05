import { Metadata } from 'next';
import LandingPage from '@/components/landing-page';

export const metadata: Metadata = {
  title: 'AI GCSE Marker | Intelligent Essay Grading & Feedback',
  description: 'Transform your GCSE marking with AI-powered accuracy. Get detailed feedback, consistent grading, and save hours of marking time.',
  keywords: 'AI marking, GCSE grading, essay feedback, education technology, automated marking',
  openGraph: {
    title: 'AI GCSE Marker | Intelligent Essay Grading & Feedback',
    description: 'Transform your GCSE marking with AI-powered accuracy. Get detailed feedback, consistent grading, and save hours of marking time.',
    type: 'website',
  },
};

export default function HomePage() {
  return <LandingPage />;
}