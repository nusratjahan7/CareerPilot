import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0b0b0c]">

      <DashboardSidebar />


      <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}