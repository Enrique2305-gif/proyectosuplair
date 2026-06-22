export const DashboardCard = ({ title, value, subtitle, icon, color = "purple", footerText, footerColor = "default" }) => {
  return (
    <div className={`dashboardCard dashboardCard--${color}`}>
      <div className="dashboardCard__header">
        <div className="dashboardCard__icon">
          {icon}
        </div>
        <h3 className="dashboardCard__title">{title}</h3>
      </div>
      <div className="dashboardCard__content">
        <p className="dashboardCard__value">{value}</p>
        <p className="dashboardCard__label">{subtitle}</p>
      </div>
      {footerText && (
        <div className="dashboardCard__footer">
          <p className={`dashboardCard__status dashboardCard__status--${footerColor}`}>
            {footerText}
          </p>
        </div>
      )}
    </div>
  );
};

