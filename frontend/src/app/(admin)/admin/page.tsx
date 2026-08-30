export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
      <p className="text-gray-400">System overview and management.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Nodes</h3>
          <div className="text-3xl font-bold text-white">4</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Users</h3>
          <div className="text-3xl font-bold text-white">128</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Active Slots</h3>
          <div className="text-3xl font-bold text-white">42</div>
        </div>
      </div>
    </div>
  );
}
