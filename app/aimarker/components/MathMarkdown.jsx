import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Enhanced Markdown component with LaTeX support
export const MathMarkdown = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // You can customize components if needed
        h1: ({ node, ...props }) => <h1 className="text-xl my-3 font-bold" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg my-3 font-bold" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-base my-2.5 font-semibold" {...props} />,
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="ml-2 my-1" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}; 