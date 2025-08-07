'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface TestResult {
  endpoint: string
  status: 'success' | 'error' | 'testing'
  message: string
  details?: string
}

export default function ApiTest() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const endpoints = [
    { name: 'Health Check', url: 'https://nobroker-app-backend.onrender.com/health' },
    { name: 'Properties API', url: 'https://nobroker-app-backend.onrender.com/api/properties' },
    { name: 'Auth API', url: 'https://nobroker-app-backend.onrender.com/api/auth/test' },
  ]

  const testEndpoint = async (endpoint: { name: string; url: string }): Promise<TestResult> => {
    try {
      console.log(`Testing ${endpoint.name}...`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      const contentType = response.headers.get('content-type') || ''
      const responseText = await response.text()
      
      if (response.ok) {
        return {
          endpoint: endpoint.name,
          status: 'success',
          message: `✅ Success (${response.status})`,
          details: contentType.includes('application/json') 
            ? `JSON Response: ${responseText.substring(0, 100)}...`
            : `Text Response: ${responseText.substring(0, 100)}...`
        }
      } else {
        return {
          endpoint: endpoint.name,
          status: 'error',
          message: `❌ Error ${response.status}: ${response.statusText}`,
          details: responseText.substring(0, 200)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        endpoint: endpoint.name,
        status: 'error',
        message: `❌ Network Error`,
        details: errorMessage
      }
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    setResults([])
    
    for (const endpoint of endpoints) {
      setResults(prev => [...prev, {
        endpoint: endpoint.name,
        status: 'testing',
        message: '🔄 Testing...'
      }])
      
      const result = await testEndpoint(endpoint)
      
      setResults(prev => prev.map(r => 
        r.endpoint === endpoint.name ? result : r
      ))
    }
    
    setTesting(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'testing':
        return <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Backend API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runAllTests} disabled={testing} className="w-full">
          {testing ? 'Testing...' : 'Run All Tests'}
        </Button>
        
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{result.endpoint}</h3>
                  {getStatusIcon(result.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-700">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
                      {result.details}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Backend URL:</strong> https://nobroker-app-backend.onrender.com</p>
          <p><strong>Note:</strong> Render free tier servers may take 30+ seconds to wake up from sleep.</p>
        </div>
      </CardContent>
    </Card>
  )
}
