import { supabase } from '@/lib/supabase/client';

// For a test page, we often want fresh data instead of cached data
export const revalidate = 0;

export default async function TestTemplatesPage() {
  // Fetch 'title' and 'category' columns from the 'templates' table
  const { data: templates, error } = await supabase
    .from('templates')
    .select('title, category');

  // Handle any potential fetch errors
  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error fetching templates</h1>
        <pre className="bg-gray-100 p-4 rounded text-black overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Supabase Templates Test</h1>
      
      {templates && templates.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {templates.map((template, index) => (
            <li key={index} className="p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">
                {template.title || 'Untitled Template'}
              </h2>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {template.category || 'Uncategorized'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-6 border rounded-lg bg-gray-50 text-gray-500 text-center">
          <p>No templates found in the database.</p>
        </div>
      )}
    </div>
  );
}
