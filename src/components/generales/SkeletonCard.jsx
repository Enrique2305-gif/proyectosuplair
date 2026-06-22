export const SkeletonCard = () => {
  return (
    <div className="skeleton-card" aria-label="Cargando contenido">
      <div className="skeleton-card__image" />
      <div className="skeleton-card__content">
        <div className="skeleton-card__line skeleton-card__line--lg" />
        <div className="skeleton-card__line" />
        <div className="skeleton-card__line skeleton-card__line--sm" />
      </div>
    </div>
  );
};
