"use client";

import { useParams } from "next/navigation";

export default function GroupDetail() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-[#08142c] text-white p-10">

      <div className="flex justify-between items-center mb-10">

        <div>
          <h1 className="text-4xl font-bold">
            Group {params.id}
          </h1>

          <p className="text-gray-400">
            Shared travel expenses
          </p>
        </div>

        <button className="bg-yellow-400 text-black px-5 py-3 rounded-lg font-bold">
          + Add Expense
        </button>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">
            Recent Activity
          </h2>

          <p className="text-gray-400">
            No expenses yet.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">
            Balances
          </h2>

          <p className="text-gray-400">
            No balances available.
          </p>
        </div>

      </div>

    </div>
  );
}