export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-minecraft-green rounded-sm"></div>
        <h1 className="text-3xl font-bold text-white tracking-wider">MC Panel</h1>
      </div>
      {children}
    </div>
  );
}
