import resourcesHero from '../assets/resources-hero.png';

const ResourcesTab = () => {
  const resources = [
    {
      icon: '🏥',
      title: 'Health Center',
      description: 'Medical services and health screenings',
      phone: '(555) 123-4567'
    },
    {
      icon: '🚨',
      title: 'Crisis Hotline',
      description: '24/7 emergency mental health support',
      phone: '(555) 911-HELP'
    },
    {
      icon: '💊',
      title: 'Pharmacy',
      description: 'Prescription and over-the-counter medications',
      phone: '(555) 123-MEDS'
    },
    {
      icon: '🍎',
      title: 'Nutrition Services',
      description: 'Dietary consultations and meal planning',
      phone: '(555) 123-FOOD'
    },
    {
      icon: '🏃‍♂️',
      title: 'Recreation Center',
      description: 'Sports facilities and fitness programs',
      phone: '(555) 123-MOVE'
    },
    {
      icon: '📚',
      title: 'Wellness Library',
      description: 'Health education resources and materials',
      phone: '(555) 123-READ'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Full Width */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <img
          src={resourcesHero}
          alt="Campus Resources"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/40 to-transparent flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Campus Resources & Support</h2>
            <p className="text-teal-50 text-xl md:text-2xl max-w-3xl">
              Everything you need to thrive on campus. From medical services to recreation, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl mb-6">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
              <p className="text-gray-600 mb-6">{resource.description}</p>
              <div className="flex items-center text-teal-600 font-medium">
                <span className="mr-2">📞</span>
                {resource.phone}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;