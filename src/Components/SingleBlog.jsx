import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogsData } from './BlogCard';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogsData.find(b => b.id === parseInt(id));

  if (!blog) {
    return (
      <div className="bg-[#f3f0ed] min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
          <button 
            onClick={() => navigate('/blog')}
            className="text-gray-900 hover:text-gray-600"
          >
            ← Back to blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f0ed] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/blog')}
          className="text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center"
        >
          ← Back to blogs
        </button>
        
        <article className="bg-white rounded-lg overflow-hidden shadow-sm">
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-96 object-cover"
          />
          
          <div className="p-8 md:p-12">
            <p className="text-sm text-gray-500 mb-4">{blog.date}</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
            <p className="text-xl text-gray-600 mb-8 italic">{blog.summary}</p>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">{blog.description}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleBlog;