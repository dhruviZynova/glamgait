import React from 'react';
import { BlogCard, blogsData } from './BlogCard';

const Blog = () => {
  return (
    <div className="bg-[#f3f0ed] min-h-screen sm:py-12 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center sm:mb-12 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Insights, tutorials, and updates from our team
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsData.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;