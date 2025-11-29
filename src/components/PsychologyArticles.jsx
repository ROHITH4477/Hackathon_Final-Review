import React from 'react';

const PsychologyArticles = ({ currentFilter }) => {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // --------------------------------------------------------------------------
  // PROJECT REQUIREMENT: INTEGRATE API KEY
  // Get your free API key from https://newsapi.org/register
  // and replace 'YOUR_API_KEY_HERE' with your actual key.
  // --------------------------------------------------------------------------
  const API_KEY = '7dcfdce879fb4950a4a439668cd9e2d4';

  React.useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      // Map categories to search queries
      const queryMap = {
        'all': 'mental health psychology',
        'anxiety': 'anxiety disorder mental health',
        'depression': 'depression mental health',
        'stress': 'stress management psychology',
        'relationships': 'healthy relationships psychology',
        'self_esteem': 'self esteem psychology',
        'academic': 'academic stress student mental health',
        'sleep': 'sleep hygiene mental health'
      };

      const query = queryMap[currentFilter] || 'mental health';

      try {
        if (API_KEY === 'YOUR_API_KEY_HERE') {
          throw new Error('Please insert your NewsAPI Key in the code.');
        }

        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevancy&pageSize=6&apiKey=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch articles. Check your API Key.');
        }

        const data = await response.json();

        // Transform API data to our format
        const formattedArticles = data.articles.map((article, index) => ({
          id: index,
          title: article.title,
          author: article.source.name, // Use source name as author
          summary: article.description || "Click to read the full article.",
          source: article.url,
          image: article.urlToImage // Optional: if we want to show images later
        }));

        setArticles(formattedArticles);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
        // Fallback to some static data if API fails (optional, but good for UX)
        // For now, we show the error to fulfill the "Integrate API Key" requirement clearly.
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

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
            {error.includes('API Key') && (
              <p className="text-sm text-red-600 mt-1">
                Open <code>src/components/PsychologyArticles.jsx</code> and add your key.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(239,246,255,0.7))', borderRadius: '1rem', padding: '1rem' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6 card-hover" style={{ boxShadow: '0 18px 36px rgba(99,102,241,0.18)' }}>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{article.title}</h4>
            <p className="text-indigo-600 text-sm font-medium mb-2">{article.author}</p>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
            {article.source && (
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-block' }}
              >
                Read Full Article ↗
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-4 text-center">
        Powered by NewsAPI.org
      </div>
    </div>
  );
};

export default PsychologyArticles;