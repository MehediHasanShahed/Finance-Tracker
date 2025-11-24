// components/ArcjetClientCheck.jsx
'use client';
import { useEffect } from 'react';

export default function ArcjetClientCheck() {
  useEffect(() => {
    fetch('/api/arcjet/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.block) window.location.href = '/blocked';
      })
      .catch(err => console.error(err));
  }, []);

  return null;
}
