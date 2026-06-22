export const EmptyState = ({
  icon = "inventory_2",
  title = "No hay información para mostrar",
  message = "Cuando existan registros disponibles aparecerán aquí.",
  action = null,
}) => {
  return (
    <div className="empty-state animate__animated animate__fadeIn">
      <span className="material-symbols-rounded empty-state__icon">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
};
