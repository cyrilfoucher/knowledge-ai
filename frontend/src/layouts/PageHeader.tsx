interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-6 border-b border-border pb-4 ">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </header>
  );
}

export default PageHeader;
