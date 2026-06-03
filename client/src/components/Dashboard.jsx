export default function Dashboard({ stats }) {
  const items = [
    { label: 'Total Tasks', value: stats?.total ?? 0 },
    { label: 'Pending Tasks', value: stats?.pending ?? 0 },
    { label: 'Completed Tasks', value: stats?.completed ?? 0 }
  ];

  return (
    <section className="dashboard" aria-label="Task dashboard">
      {items.map((item) => (
        <div className="metric" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </section>
  );
}
