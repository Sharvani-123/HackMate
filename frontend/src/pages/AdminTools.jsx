import React, { useState } from 'react';
import { auth } from '../firebase';

const AdminTools = () => {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  const getToken = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const firebaseToken = await user.getIdToken(true);
        setToken(firebaseToken);
      } else {
        alert('Not signed in');
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Tools</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Firebase Token</h2>
        
        <button 
          onClick={getToken}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Get Current Token
        </button>
        
        {token && (
          <div>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm break-all mb-4">
              {token}
            </div>
            <button 
              onClick={copyToken}
              className={`px-4 py-2 rounded ${copied ? 'bg-green-500' : 'bg-gray-500'} text-white`}
            >
              {copied ? 'Copied!' : 'Copy Token'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTools;
