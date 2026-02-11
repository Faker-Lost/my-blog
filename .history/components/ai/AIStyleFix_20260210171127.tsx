'use client';

export default function AIStyleFix() {
  return (
    <style jsx global>{`
      header, footer {
        display: none !important;
      }
    `}</style>
  );
}
