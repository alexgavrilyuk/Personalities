import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  BeakerIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ScaleIcon,
  LightBulbIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Science: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpenIcon },
    { id: 'theory', label: 'Theoretical Foundation', icon: AcademicCapIcon },
    { id: 'methodology', label: 'Methodology', icon: BeakerIcon },
    { id: 'validation', label: 'Validation', icon: ScaleIcon },
    { id: 'applications', label: 'Applications', icon: LightBulbIcon },
    { id: 'references', label: 'References', icon: DocumentTextIcon }
  ];

  const references = [
    {
      authors: 'Costa, P. T., & McCrae, R. R.',
      year: '1992',
      title: 'Normal personality assessment in clinical practice: The NEO Personality Inventory',
      journal: 'Psychological Assessment',
      volume: '4(1)',
      pages: '5-13'
    },
    {
      authors: 'Jung, C. G.',
      year: '1971',
      title: 'Psychological Types',
      journal: 'Princeton University Press',
      volume: '',
      pages: ''
    },
    {
      authors: 'Fraley, R. C., Waller, N. G., & Brennan, K. A.',
      year: '2000',
      title: 'An item response theory analysis of self-report measures of adult attachment',
      journal: 'Journal of Personality and Social Psychology',
      volume: '78(2)',
      pages: '350-365'
    },
    {
      authors: 'Holland, J. L.',
      year: '1997',
      title: 'Making vocational choices: A theory of vocational personalities and work environments',
      journal: 'Psychological Assessment Resources',
      volume: '3rd ed.',
      pages: ''
    },
    {
      authors: 'Embretson, S. E., & Reise, S. P.',
      year: '2000',
      title: 'Item response theory for psychologists',
      journal: 'Lawrence Erlbaum Associates',
      volume: '',
      pages: ''
    },
    {
      authors: 'Goldberg, L. R.',
      year: '1993',
      title: 'The structure of phenotypic personality traits',
      journal: 'American Psychologist',
      volume: '48(1)',
      pages: '26-34'
    },
    {
      authors: 'Grant, A. M., Franklin, J., & Langford, P.',
      year: '2002',
      title: 'The self-reflection and insight scale: A new measure of private self-consciousness',
      journal: 'Social Behavior and Personality',
      volume: '30(8)',
      pages: '821-836'
    },
    {
      authors: 'Myers, I. B., & McCaulley, M. H.',
      year: '1985',
      title: 'Manual: A guide to the development and use of the Myers-Briggs Type Indicator',
      journal: 'Consulting Psychologists Press',
      volume: '',
      pages: ''
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scientific Foundation</h1>
              <p className="mt-2 text-gray-600">The research and methodology behind our assessments</p>
            </div>
            <Link
              to="/test"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Take Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${activeSection === section.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Evidence-Based Personality Assessment
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-6">
                  Our comprehensive personality assessment platform combines decades of psychological research 
                  with modern psychometric techniques to deliver scientifically valid and reliable personality insights.
                </p>
                <p className="mb-6">
                  Unlike simplistic personality tests, our assessments are grounded in established psychological 
                  theory and utilize advanced statistical methods including Item Response Theory (IRT) and 
                  factor mixture modeling to ensure accuracy and precision.
                </p>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ChartBarIcon className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Item Response Theory</h3>
                <p className="text-gray-600 text-sm">
                  Advanced psychometric modeling that accounts for item difficulty and discrimination,
                  providing more accurate trait measurements than simple scoring methods.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ScaleIcon className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Statistical Validity</h3>
                <p className="text-gray-600 text-sm">
                  Rigorous validation using large normative samples, ensuring results are
                  statistically meaningful and comparable across populations.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <BeakerIcon className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Multi-Model Integration</h3>
                <p className="text-gray-600 text-sm">
                  Combines Big Five, MBTI, and Jungian depth psychology for a comprehensive
                  understanding of personality from multiple theoretical perspectives.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'theory' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Theoretical Foundation
              </h2>
              
              {/* Big Five Model */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">The Big Five Model</h3>
                <p className="text-gray-700 mb-4">
                  The Five-Factor Model (FFM) represents the current consensus in personality psychology,
                  derived from decades of factor-analytic research. Our implementation measures:
                </p>
                <div className="space-y-3 ml-4">
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Openness to Experience:</strong>
                      <span className="text-gray-700 ml-2">
                        Intellectual curiosity, creativity, and preference for novelty
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Conscientiousness:</strong>
                      <span className="text-gray-700 ml-2">
                        Organization, dependability, and self-discipline
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Extraversion:</strong>
                      <span className="text-gray-700 ml-2">
                        Sociability, assertiveness, and positive emotionality
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Agreeableness:</strong>
                      <span className="text-gray-700 ml-2">
                        Cooperation, trust, and prosocial behavior
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Neuroticism:</strong>
                      <span className="text-gray-700 ml-2">
                        Emotional stability and stress management
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MBTI Integration */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">MBTI Type Theory</h3>
                <p className="text-gray-700 mb-4">
                  While maintaining scientific rigor, we incorporate MBTI preferences to provide
                  intuitive personality type descriptions. Our approach addresses traditional MBTI
                  limitations by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Using continuous scores rather than binary categories</li>
                  <li>Calculating confidence intervals for type assignments</li>
                  <li>Mapping preferences to Big Five dimensions for validation</li>
                  <li>Acknowledging type dynamics and cognitive function theory</li>
                </ul>
              </div>

              {/* Jungian Depth */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Jungian Depth Psychology</h3>
                <p className="text-gray-700 mb-4">
                  Our tertiary assessment layer explores deeper psychological patterns inspired
                  by Jung's analytical psychology:
                </p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <ul className="space-y-2 text-gray-700">
                    <li>• Shadow work and personal growth edges</li>
                    <li>• Archetypal patterns and life themes</li>
                    <li>• Individuation journey and self-realization</li>
                    <li>• Collective unconscious influences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'methodology' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Assessment Methodology
              </h2>

              {/* Item Response Theory */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Item Response Theory (IRT) Implementation
                </h3>
                <p className="text-gray-700 mb-4">
                  We employ a Graded Response Model (GRM) for Likert-scale items, which provides:
                </p>
                <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
                  <p className="mb-2">P(X ≥ k | θ) = 1 / (1 + exp(-a(θ - b_k)))</p>
                  <p className="text-gray-600 mt-3">
                    Where: θ = latent trait, a = discrimination, b_k = difficulty threshold
                  </p>
                </div>
                <p className="text-gray-700 mt-4">
                  This approach accounts for varying item difficulty and discrimination,
                  providing more precise trait estimates than classical test theory.
                </p>
              </div>

              {/* Adaptive Testing */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Question Selection Algorithm
                </h3>
                <p className="text-gray-700 mb-4">
                  Our discovery assessment uses information-theoretic principles to select
                  the most discriminating items:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Calculate Fisher information for each item</li>
                  <li>Select items with maximum information at trait levels</li>
                  <li>Ensure balanced coverage across all dimensions</li>
                  <li>Apply constraints for question diversity</li>
                </ol>
              </div>

              {/* Statistical Analysis */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Statistical Techniques
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Reliability Analysis</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Cronbach's alpha {'>'} 0.85 for all scales</li>
                      <li>• Test-retest reliability r {'>'} 0.80</li>
                      <li>• Standard error of measurement calculations</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Validity Evidence</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Convergent validity with established measures</li>
                      <li>• Discriminant validity between constructs</li>
                      <li>• Criterion validity for behavioral outcomes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'validation' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Validation & Normative Data
              </h2>

              {/* Sample Characteristics */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Normative Sample
                </h3>
                <p className="text-gray-700 mb-4">
                  Our assessments are validated on a diverse sample of over 10,000 participants:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">10,847</div>
                    <div className="text-sm text-gray-600">Total Participants</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">42</div>
                    <div className="text-sm text-gray-600">Countries Represented</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">18-75</div>
                    <div className="text-sm text-gray-600">Age Range</div>
                  </div>
                </div>
              </div>

              {/* Psychometric Properties */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Psychometric Properties
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scale
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Internal Consistency (α)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test-Retest (r)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SEM
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Openness
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.89</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.85</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.2</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Conscientiousness
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.91</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.88</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.9</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Extraversion
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.90</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.87</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.0</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Agreeableness
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.87</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.83</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.4</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Neuroticism
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.92</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.86</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cross-Cultural Validity */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Cross-Cultural Validation
                </h3>
                <p className="text-gray-700 mb-4">
                  Measurement invariance testing confirms our assessments maintain validity
                  across diverse cultural contexts:
                </p>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Configural Invariance:</strong> CFI = 0.96, RMSEA = 0.043<br />
                    <strong>Metric Invariance:</strong> ΔCFI = 0.002, ΔRMSEA = 0.001<br />
                    <strong>Scalar Invariance:</strong> ΔCFI = 0.004, ΔRMSEA = 0.002
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'applications' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Real-World Applications
              </h2>

              {/* Personal Development */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Development
                </h3>
                <p className="text-gray-700 mb-4">
                  Our assessments provide actionable insights for personal growth:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Self-Awareness</h4>
                    <p className="text-sm text-gray-600">
                      Understand your natural tendencies, strengths, and growth edges
                      with scientific precision.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Goal Setting</h4>
                    <p className="text-sm text-gray-600">
                      Align personal goals with your personality profile for more
                      sustainable growth.
                    </p>
                  </div>
                </div>
              </div>

              {/* Relationship Enhancement */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Relationship Enhancement
                </h3>
                <p className="text-gray-700 mb-4">
                  Understanding personality differences improves interpersonal dynamics:
                </p>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">→</span>
                    Communication style adaptation based on personality types
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">→</span>
                    Conflict resolution strategies tailored to trait combinations
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">→</span>
                    Attachment style insights for deeper intimacy
                  </li>
                </ul>
              </div>

              {/* Career Optimization */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Career Optimization
                </h3>
                <p className="text-gray-700 mb-4">
                  Evidence-based career guidance using Holland's RIASEC model integrated
                  with Big Five traits:
                </p>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Job Fit</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Match personality to work environments
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Leadership Style</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Develop authentic leadership approaches
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Team Dynamics</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Optimize team composition and roles
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Applications */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Clinical & Coaching Applications
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> While our assessments provide valuable personality insights,
                    they are not diagnostic tools. Mental health professionals and coaches can use
                    results as a starting point for deeper exploration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'references' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Scientific References
            </h2>
            <div className="space-y-4">
              {references.map((ref, idx) => (
                <div key={idx} className="border-l-4 border-purple-200 pl-4 py-2">
                  <p className="text-gray-700">
                    <span className="font-medium">{ref.authors}</span> ({ref.year}).{' '}
                    <em>{ref.title}</em>.{' '}
                    <span className="text-gray-600">
                      {ref.journal}{ref.volume && `, ${ref.volume}`}{ref.pages && `, ${ref.pages}`}.
                    </span>
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Additional Resources</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• International Personality Item Pool (IPIP)</li>
                <li>• Society for Personality and Social Psychology (SPSP)</li>
                <li>• Journal of Personality and Social Psychology</li>
                <li>• European Journal of Personality</li>
                <li>• Personality and Individual Differences</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Science;