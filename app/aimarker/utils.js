import { toast } from "sonner";

// Helper function to automatically detect total marks from question
export const detectTotalMarksFromQuestion = (questionText) => {
  if (!questionText) return null;
  
  // Common patterns for total marks in GCSE questions
  const patterns = [
    /\[(\d+) marks?\]/i,                 // [8 marks]
    /\((\d+) marks?\)/i,                 // (8 marks)
    /worth (\d+) marks?/i,               // worth 8 marks
    /for (\d+) marks?/i,                 // for 8 marks
    /total (?:of )?(\d+) marks?/i,       // total of 8 marks
    /\[Total:? (\d+)(?:\s*marks?)?\]/i,  // [Total: 8] or [Total: 8 marks]
    /\(Total:? (\d+)(?:\s*marks?)?\)/i,  // (Total: 8) or (Total: 8 marks)
    /^(\d+) marks?:?/i,                  // 8 marks: at start of line
    /\[(\d+)(?:\s*m)\]/i,                // [8m]
    /\((\d+)(?:\s*m)\)/i                 // (8m)
  ];
  
  for (const pattern of patterns) {
    const match = questionText.match(pattern);
    if (match && match[1]) {
      const marks = parseInt(match[1]);
      if (!isNaN(marks) && marks > 0) {
        console.log(`Detected ${marks} total marks from question`);
        
        // Show a toast notification to inform the user
        if (typeof toast !== 'undefined') {
          toast.info(`Automatically detected ${marks} total marks from the question`);
        }
        
        return marks.toString();
      }
    }
  }
  
  return null;
};

// Helper function to calculate grade based on boundaries
export const calculateGradeFromBoundaries = (achievedMarks, totalMarks, boundaries) => {
  if (!achievedMarks || !totalMarks || totalMarks <= 0) {
    return null;
  }
  
  const percentage = (parseFloat(achievedMarks) / parseFloat(totalMarks)) * 100;
  
  // Sort grades in descending order to find the highest grade the student achieved
  const sortedGrades = Object.entries(boundaries)
    .sort(([a], [b]) => parseInt(b) - parseInt(a)); // Sort by grade number descending
  
  for (const [grade, threshold] of sortedGrades) {
    if (percentage >= threshold) {
      return grade;
    }
  }
  
  // If below all thresholds, assign Grade 1
  return '1';
};

// Helper function to copy feedback to clipboard
export const copyFeedbackToClipboard = (feedback) => {
  if (feedback) {
    navigator.clipboard.writeText(feedback);
    alert("Feedback copied to clipboard!");
  }
};

// Enhanced feedback sharing functionality
export const shareFeedback = (feedback, method, grade) => {
  const title = `GCSE Grade ${grade} Feedback`;
  const cleanFeedback = feedback.replace(/\[GRADE:\d\]/g, '');
  
  switch (method) {
    case 'clipboard':
      navigator.clipboard.writeText(cleanFeedback);
      return 'Feedback copied to clipboard!';
    case 'email':
      const emailSubject = encodeURIComponent(title);
      const emailBody = encodeURIComponent(cleanFeedback);
      window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
      return 'Email client opened';
    case 'twitter':
      const tweetText = encodeURIComponent(`I received a Grade ${grade} on my GCSE assessment! #GCSE #Education`);
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`);
      return 'Twitter share opened';
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
      return 'Facebook share opened';
    default:
      return '';
  }
};

// Improved PDF export function using html2canvas and jsPDF
export const saveFeedbackAsPdf = async (feedbackElement, grade) => {
  try {
    const html2canvasModule = await import('html2canvas');
    const jsPDFModule = await import('jspdf');
    
    const html2canvas = html2canvasModule.default;
    const jsPDF = jsPDFModule.default;
    
    const feedbackContainer = feedbackElement.current;
    if (!feedbackContainer) {
      toast.error("Feedback element not found for PDF export.");
      return;
    }
    
    // Slightly increase scale for better quality, ensure all content is captured
    const canvas = await html2canvas(feedbackContainer, {
      scale: 2.5, // Increased scale
      useCORS: true,
      logging: false,
      scrollY: -window.scrollY, // Capture full element even if scrolled
      windowWidth: feedbackContainer.scrollWidth,
      windowHeight: feedbackContainer.scrollHeight,
      backgroundColor: window.getComputedStyle(document.documentElement).getPropertyValue('--card').trim() || '#ffffff', // Use theme background
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4', true); // Added 'true' for better compression
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = (pdfHeight - imgHeight * ratio) / 2; // Center vertically too
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`GCSE_Grade${grade || 'N/A'}_Feedback.pdf`);
    
    toast.success('Feedback saved as PDF');
    return 'Feedback saved as PDF';
  } catch (error) {
    console.error('Error saving PDF:', error);
    toast.error('Could not generate PDF. Please try again.');
  }
};

// Improved print functionality
export const printFeedback = (feedbackElement) => {
  try {
    const printWindow = window.open('', '_blank');
    const feedbackHTML = feedbackElement.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GCSE Assessment Feedback</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .feedback-container { max-width: 800px; margin: 0 auto; }
            h1, h2, h3 { color: #333; }
            ul { padding-left: 20px; }
            li { margin-bottom: 5px; }
            .grade { display: inline-block; width: 40px; height: 40px; 
                    background: #f0f0f0; border-radius: 50%; text-align: center; 
                    line-height: 40px; font-weight: bold; font-size: 20px; 
                    margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="feedback-container">
            <h1>GCSE Assessment Feedback</h1>
            ${feedbackHTML}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    return 'Print dialog opened';
  } catch (error) {
    console.error('Error printing feedback:', error);
    alert('Could not open print dialog. Please try again or use another method to save the feedback.');
  }
};

// Simple placeholder function since we removed the test button
export const testMarkSchemeGeneration = () => {
  toast.info("Test generation functionality has been removed");
}; 