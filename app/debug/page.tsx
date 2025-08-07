import Navbar from '@/components/Navbar'
import ApiTest from '@/components/ApiTest'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Debug & Testing
          </h1>
          <p className="text-gray-600">
            Test the connection to your backend API
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ApiTest />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Backend Information</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">API Endpoints</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• GET /api/properties - Get all properties</li>
                <li>• POST /api/auth/login - User login</li>
                <li>• POST /api/auth/register - User registration</li>
                <li>• GET /api/auth/me - Get user profile</li>
                <li>• POST /api/properties - Create property</li>
                <li>• GET /api/messages - Get messages</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Common Issues</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Backend server might be sleeping (Render free tier)</li>
                <li>• CORS configuration issues</li>
                <li>• Database connection problems</li>
                <li>• API endpoint path mismatches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
