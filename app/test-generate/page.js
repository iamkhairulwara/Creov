'use client';

import { useState } from 'react';

export default function TestGenerate() {
  const [prompt, setPrompt] = useState('Create a modern portfolio website for a photographer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt,
          userId: 'test-user'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }
      
      setResult(data);
      console.log('Success:', data);
      
      // Display the HTML in an iframe
      const iframe = document.getElementById('preview');
      if (iframe && data.html) {
        iframe.srcdoc = data.html;
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🧪 Gemini API Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          cols={60}
          style={{ width: '100%', padding: '10px' }}
        />
        <br />
        <button 
          onClick={testGenerate} 
          disabled={loading}
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px',
            background: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate Website'}
        </button>
      </div>
      
      {error && (
        <div style={{ padding: '10px', background: '#fee', color: '#c00', borderRadius: '5px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}
      
      {result && (
        <div>
          <h2>✅ Success!</h2>
          <p>Website ID: {result.websiteId}</p>
          <p>Intent: {JSON.stringify(result.intent)}</p>
          
          <h3>Preview:</h3>
          <iframe 
            id="preview"
            title="Preview"
            style={{ width: '100%', height: '600px', border: '1px solid #ccc', borderRadius: '5px' }}
            sandbox="allow-same-origin allow-scripts"
          />
          
          <details style={{ marginTop: '20px' }}>
            <summary>View HTML</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', maxHeight: '400px' }}>
              {result.html}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}