import React, { Suspense } from 'react'; // Added React import
import Chat from './Chat';

function SearchBarFallback() {
  return <>placeholder</>;
}
 
export default function Page() {
  return (
    <>
        <Suspense fallback={<SearchBarFallback />}>
            <Chat />
        </Suspense>
    </>
  );
}
