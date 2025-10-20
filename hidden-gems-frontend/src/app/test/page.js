'use client';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function TestPage() {
  const context = useContext(AuthContext);
  
  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h1>Context Test Page</h1>
      <p>Context value: {context ? 'Available ✅' : 'Not Available ❌'}</p>
      <p>Has login function: {context?.login ? 'Yes ✅' : 'No ❌'}</p>
      <p>Has register function: {context?.register ? 'Yes ✅' : 'No ❌'}</p>
    </div>
  );
}
