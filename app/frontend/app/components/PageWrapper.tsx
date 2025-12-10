export default function PageWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">{title}</h1>

      <div className="bg-white rounded-xl shadow-md border p-6">{children}</div>
    </div>
  );
}
