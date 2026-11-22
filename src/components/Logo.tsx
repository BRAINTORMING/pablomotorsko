// Facet logo: the PNG as it is, no styles or effects (the file lives in public/facet.png).
export function Logo({ className = 'h-6 w-6' }: { className?: string }) {
  return <img src="/facet.png" alt="Facet" className={className + ' object-contain'} draggable={false} />;
}
