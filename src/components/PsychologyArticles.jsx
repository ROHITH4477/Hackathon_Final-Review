import React from 'react';

const PsychologyArticles = ({ currentFilter }) => {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [usingFallback, setUsingFallback] = React.useState(false);

  // --------------------------------------------------------------------------
  // PROJECT REQUIREMENT: INTEGRATE API KEY
  // NewsData.io API Key
  // --------------------------------------------------------------------------
  const API_KEY = 'pub_28b64395d4904a57a29b9703e9cde583';

  // Fallback data for when API fails
  const fallbackArticles = [
    {
      id: 101,
      title: "The Science of Sleep: Why You Need 8 Hours",
      author: "Sleep Foundation",
      summary: "Sleep is essential for mental health. Discover the cognitive benefits of a good night's rest and tips for better sleep hygiene.",
      source: "https://www.sleepfoundation.org/",
      image: null
    },
    {
      id: 102,
      title: "Managing Academic Stress in College",
      author: "Student Minds",
      summary: "Exams and deadlines can be overwhelming. Here are practical strategies to manage stress and maintain a healthy work-life balance.",
      source: "https://www.studentminds.org.uk/",
      image: null
    },
    {
      id: 103,
      title: "Understanding Anxiety: Signs and Coping Mechanisms",
      author: "NIMH",
      summary: "Anxiety is more than just being nervous. Learn about the symptoms of anxiety disorders and effective grounding techniques.",
      source: "https://www.nimh.nih.gov/",
      image: null
    },
    {
      id: 104,
      title: "The Power of Mindfulness Meditation",
      author: "Mindful.org",
      summary: "Mindfulness can reduce stress and improve focus. A beginner's guide to starting a daily meditation practice.",
      source: "https://www.mindful.org/",
      image: null
    },
    {
      id: 105,
      title: "Building Healthy Relationships on Campus",
      author: "Love is Respect",
      summary: "Navigating friendships and dating in college. Tips for communication, boundaries, and recognizing healthy dynamics.",
      source: "https://www.loveisrespect.org/",
      image: null
    },
    {
      id: 106,
      title: "Fueling Your Brain: Nutrition for Mental Health",
      author: "Harvard Health",
      summary: "What you eat affects how you feel. Explore the connection between diet, gut health, and mood regulation.",
      source: "https://www.health.harvard.edu/",
      image: null
    }
  ];

  React.useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      // Map categories to search queries
      const queryMap = {
        'all': 'mental health',
        'anxiety': 'anxiety',
        'depression': 'depression',
        'stress': 'stress',
        'relationships': 'relationships',
        'self_esteem': 'self esteem',
        'academic': 'student stress',
        'sleep': 'sleep health'
      };

      const query = queryMap[currentFilter] || 'mental health';

      try {
        // NewsData.io Endpoint with category=health to ensure relevance
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${encodeURIComponent(query)}&language=en&category=health`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== 'success') {
          throw new Error('API returned unsuccessful status');
        }

        // Transform NewsData.io data to our format
        // NewsData.io uses 'results' array
        const formattedArticles = data.results.slice(0, 6).map((article, index) => ({
          id: index,
          title: article.title,
          author: article.source_id || "News Source",
          summary: article.description ? (article.description.length > 150 ? article.description.substring(0, 150) + "..." : article.description) : "Click to read the full article.",
          source: article.link,
          image: article.image_url // NewsData.io uses image_url
        }));

        setArticles(formattedArticles);
      } catch (err) {
        console.warn("NewsData.io API failed. Using fallback data.", err);
        // Use fallback data instead of showing an error
        setArticles(fallbackArticles);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentFilter]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Fetching latest articles...</p>
      </div>
    );
  }

  return (
    <div className="mb-8" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(239,246,255,0.7))', borderRadius: '1rem', padding: '1rem' }}>
      {usingFallback && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Displaying curated resources. (Live news feed unavailable).
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6 card-hover flex flex-col" style={{ boxShadow: '0 18px 36px rgba(99,102,241,0.18)' }}>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{article.title}</h4>
            <p className="text-indigo-600 text-sm font-medium mb-2 uppercase">{article.author}</p>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">{article.summary}</p>
            {article.source && (
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-auto self-start"
                style={{ display: 'inline-block' }}
              >
                Read Full Article ↗
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-4 text-center">
        {usingFallback ? 'Curated Wellness Resources' : 'Powered by NewsData.io'}
      </div>
    </div>
  );
};

export default PsychologyArticles;
