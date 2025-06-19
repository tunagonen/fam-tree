import FamilyTree from "@/components/FamilyTree";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Family Tree</h1>
            <p className="text-gray-600">Interactive Family Genealogy</p>
          </div>
        </div>
      </header>
      <main>
        <FamilyTree />
      </main>
    </div>
  );
}
