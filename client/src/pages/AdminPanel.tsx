import AdminControls from '../components/AdminControls';

export default function AdminPage() {
  return (
    <div className="p-6 bg-[#001433] min-h-screen text-slate-100">
      <h1 className="text-4xl font-bold mb-6">Admin Panel</h1>
      <AdminControls />
    </div>
  );
}
