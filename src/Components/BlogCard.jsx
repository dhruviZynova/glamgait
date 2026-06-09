import { useNavigate } from 'react-router-dom';

export const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer" onClick={() => navigate(`/blog/${blog.id}`)}>
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
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/blog/${blog.id}`);
          }}
          className="text-gray-900 font-medium hover:text-gray-600 transition-colors cursor-pointer"
        >
          Read More →
        </button>
      </div>
    </div>
  );
};

export const blogsData = [
  {
    id: 1,
    title: "5 Essential Modest Wear Pieces for Your Wardrobe",
    date: "May 10, 2026",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    summary: "Discover the must-have items that combine modesty with modern fashion trends for a sophisticated look.",
    description: "Building a versatile wardrobe starts with quality basics. In this guide, we explore five essential modest wear pieces—from breathable abayas to versatile hijabs—that every fashion-forward woman should own. We'll discuss how to style them for different occasions, ensuring you look elegant while staying true to your values. Quality fabrics like crepe and silk play a crucial role in longevity and comfort. Learn how to mix and match these staples to create a variety of stunning outfits that reflect your unique personality."
  },
  {
    id: 2,
    title: "Styling Tips: How to Layer for Every Season",
    date: "May 05, 2026",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    summary: "Master the art of layering to stay comfortable and stylish throughout the year without compromising on modesty.",
    description: "Layering is not just about staying warm; it's an art form that adds depth and character to your outfit. For modest fashion enthusiasts, layering is a key strategy for ensuring coverage while experimenting with different textures and colors. This article breaks down the best practices for seasonal layering. From lightweight kimonos in summer to chic trench coats in winter, we show you how to maintain a sleek silhouette. We also delve into color theory to help you choose complementary tones that make your ensemble pop."
  },
  {
    id: 3,
    title: "Behind the Scenes: Our New Summer Collection",
    date: "April 28, 2026",
    image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    summary: "Get an exclusive look at the inspiration and craftsmanship behind our latest collection for the sunny days ahead.",
    description: "Our upcoming Summer Collection is inspired by the vibrant colors of Mediterranean landscapes and the tranquility of coastal retreats. In this behind-the-scenes look, we take you into our design studio to see the initial sketches and fabric selections. Our designers focused on ultra-breathable linens and soft pastels to keep you cool and comfortable. We also highlight the sustainable practices we've integrated into our production process. Join us as we celebrate the craftsmanship that goes into every stitch of Kundrat apparel."
  }
];