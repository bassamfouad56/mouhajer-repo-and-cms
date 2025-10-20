'use client';

import { useEffect, useRef } from 'react';

export default function GraphQLPlayground() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Load Apollo Sandbox embed
    const script = document.createElement('script');
    script.src = 'https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const { ApolloSandbox } = window as any;
      new ApolloSandbox({
        target: '#sandbox',
        initialEndpoint: `${window.location.origin}/api/graphql`,
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <div id="sandbox" className="w-full h-full" />
    </div>
  );
}
