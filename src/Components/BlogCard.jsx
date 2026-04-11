import React from 'react';
import { useNavigate } from 'react-router-dom';

export const blogsData = [
    {
    id: 1,
    title: "The Future of Web Development",
    date: "October 8, 2025",
    summary: "Exploring the latest trends and technologies shaping modern web development.",
    description: "The web development landscape is constantly evolving with new frameworks, tools, and best practices. From React to Next.js, developers have more options than ever before. This comprehensive guide explores the cutting-edge technologies that are defining the future of web development. We'll dive deep into serverless architectures, edge computing, and the rise of AI-powered development tools. Understanding these trends is crucial for staying competitive in the ever-changing tech industry. Learn how to adapt your skills and embrace new methodologies that will shape the next decade of web development.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS",
    date: "October 5, 2025",
    summary: "A complete guide to building beautiful interfaces with utility-first CSS.",
    description: "Tailwind CSS has revolutionized how developers approach styling in modern web applications. This utility-first framework allows for rapid prototyping and consistent design systems. In this guide, we'll explore advanced Tailwind techniques, including custom configurations, plugin development, and optimization strategies. You'll learn how to create responsive layouts, implement dark mode, and build reusable component patterns. We'll also cover best practices for maintaining scalability in large projects and how to integrate Tailwind with popular frameworks like React and Vue. By the end, you'll have the skills to build production-ready interfaces with confidence.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "React Performance Optimization",
    date: "October 1, 2025",
    summary: "Tips and tricks to make your React applications lightning fast.",
    description: "Performance is crucial for user experience and SEO. This comprehensive guide covers everything you need to know about optimizing React applications. We'll explore memoization techniques with useMemo and useCallback, lazy loading strategies, code splitting, and virtual scrolling. Learn how to identify performance bottlenecks using React DevTools Profiler and implement effective solutions. We'll also discuss state management optimization, preventing unnecessary re-renders, and leveraging concurrent features in React 18. Understanding these concepts will help you build applications that scale efficiently and provide smooth user experiences across all devices.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Building RESTful APIs",
    date: "September 28, 2025",
    summary: "Learn how to design and implement robust API architectures.",
    description: "APIs are the backbone of modern applications, connecting frontend interfaces with backend services. This guide covers RESTful API design principles, authentication strategies, and best practices for building scalable endpoints. We'll explore HTTP methods, status codes, versioning strategies, and documentation with tools like Swagger. Learn how to implement proper error handling, rate limiting, and security measures including JWT authentication and OAuth. We'll also discuss API testing methodologies, caching strategies, and how to structure your codebase for maintainability. Whether you're building a simple CRUD API or a complex microservices architecture, this guide has you covered.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "Modern JavaScript Features",
    date: "September 25, 2025",
    summary: "Discover ES6+ features that will improve your code quality.",
    description: "JavaScript has evolved significantly with ES6 and beyond, introducing powerful features that make code more readable and maintainable. This guide explores modern JavaScript syntax including arrow functions, destructuring, spread operators, and async/await. We'll dive into advanced concepts like Promises, generators, proxies, and symbols. Learn how to write cleaner code with optional chaining, nullish coalescing, and private class fields. We'll also cover module systems, dynamic imports, and the latest features from ES2024. Understanding these modern JavaScript features is essential for writing efficient, professional-grade code that leverages the full power of the language.",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=500&fit=crop"
  },
  {
    id: 6,
    title: "CSS Grid and Flexbox Mastery",
    date: "September 20, 2025",
    summary: "Master the art of creating flexible and responsive layouts.",
    description: "CSS Grid and Flexbox have transformed how we build layouts on the web. This comprehensive tutorial covers both layout systems in depth, helping you understand when to use each one. We'll explore Grid's two-dimensional layout capabilities, including grid templates, areas, and auto-placement. Then we'll dive into Flexbox's one-dimensional layout power for component-level designs. Learn how to create complex, responsive layouts without media queries using modern CSS techniques. We'll cover practical examples like navigation bars, card layouts, and magazine-style designs. You'll also learn about subgrid, gap properties, and alignment techniques that work across both systems.",
    image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&h=500&fit=crop"
  },
  {
    id: 7,
    title: "TypeScript Best Practices",
    date: "September 15, 2025",
    summary: "Write type-safe code with confidence using TypeScript.",
    description: "TypeScript brings static typing to JavaScript, catching errors before runtime and improving code quality. This guide covers TypeScript fundamentals and advanced patterns for building robust applications. We'll explore type annotations, interfaces, generics, and union types. Learn how to configure TypeScript for your project, integrate it with React, and leverage utility types for maximum productivity. We'll discuss best practices for type safety, including strict mode settings, discriminated unions, and type guards. You'll also learn about advanced features like conditional types, mapped types, and template literal types. By adopting TypeScript, you'll write more maintainable code with better IDE support and fewer bugs.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop"
  },
  {
    id: 8,
    title: "Web Accessibility Guidelines",
    date: "September 10, 2025",
    summary: "Make your websites usable for everyone with proper accessibility.",
    description: "Web accessibility ensures that people with disabilities can use your website effectively. This comprehensive guide covers WCAG guidelines, semantic HTML, ARIA attributes, and keyboard navigation. We'll explore how to make your content accessible to screen readers, implement proper color contrast, and create inclusive forms. Learn about focus management, skip links, and live regions for dynamic content. We'll also discuss testing tools and methodologies to audit your site's accessibility. Building accessible websites isn't just about compliance—it's about creating better experiences for all users. You'll gain practical skills to implement accessibility from the ground up and retrofit existing projects.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=500&fit=crop"
  }
];

export const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <img 
        src={blog.image} 
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">{blog.date}</p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{blog.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{blog.summary}</p>
        <button 
          onClick={() => navigate(`/blog/${blog.id}`)}
          className="text-gray-900 font-medium hover:text-gray-600 transition-colors"
        >
          Read More →
        </button>
      </div>
    </div>
  );
};