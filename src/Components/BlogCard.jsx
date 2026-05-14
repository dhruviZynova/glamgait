import { useNavigate } from 'react-router-dom';

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