"use client";

import { useState } from "react";

export default function AddExpenseModal({
  isOpen,
  onClose,
  groupId,
  groupMembers = [],
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("you");
  const [splitType, setSplitType] = useState("equally");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!amount || !description) return;

    try {
      const token = localStorage.getItem("token");

      const total = parseFloat(amount);

      const participants = groupMembers.map((m) => m.user_id);
      const splitAmount = total / (participants.length + 1);

      const splits = groupMembers.map((member) => ({
        user_id: member.user_id,
        amount: splitAmount,
      }));

      const response = await fetch(`http://127.0.0.1:5000/group/${groupId}/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description,
            amount: total,
            splits,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al crear el gasto");
      }

      const data = await response.json();
      console.log("Gasto creado:", data);

      setAmount("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-[#d4a017] text-xl">🧾</span>
            <span className="text-white font-medium text-base">Agregar gasto</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Amount + Description + Date */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="text-[11px] text-gray-500 tracking-widest uppercase block mb-2">
                Cantidad
              </label>

              <div className="flex items-center gap-2 border-b border-white/20 pb-2">
                <span className="text-gray-400 text-xl">€</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-none outline-none text-2xl text-white w-full placeholder-gray-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">

              <div>
                <label className="text-[11px] text-gray-500 tracking-widest uppercase block mb-2">
                  Descripción
                </label>

                <div className="flex items-center gap-2 border-b border-white/20 pb-2">
                  <span className="text-gray-500 text-sm">✏️</span>
                  <input
                    type="text"
                    placeholder="Añade una nota..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-500 tracking-widest uppercase block mb-2">
                  Fecha
                </label>

                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-gray-400 text-sm">📅</span>
                  <span className="text-sm text-white">
                    {new Date().toLocaleDateString("es-ES", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* With you and */}
          <div>
            <label className="text-[11px] text-gray-500 tracking-widest uppercase block mb-2">
              Contigo y
            </label>

            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 mb-2">
              <span className="text-gray-500">🔍</span>
              <input
                type="text"
                placeholder="Buscar amigos o grupo..."
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-600"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {groupMembers.map((member) => (
                <span
                  key={member.user_id}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300"
                >
                  <div className="w-4 h-4 rounded-full bg-[#d4a017] flex items-center justify-center text-[10px] font-medium text-black">
                    {member.user?.name?.[0] || "U"}
                  </div>
                  {member.user?.name || member.user?.user_name || "Usuario"}
                </span>
              ))}
            </div>
          </div>

          {/* Paid by */}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">Pagado por</p>
                <p className="text-xs text-gray-500">¿Quién pagó inicialmente?</p>
              </div>

              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none cursor-pointer"
              >
                <option value="you">Tú</option>
                {groupMembers.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.user?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Split type */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">Tipo de división</p>
                <p className="text-xs text-gray-500">¿Cómo dividir el gasto?</p>
              </div>

              <div className="flex gap-1">
                {["equally", "%", "exact"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSplitType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      splitType === type
                        ? "bg-[#d4a017] text-black"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Split details */}
            <div>
              <label className="text-[11px] text-gray-500 tracking-widest uppercase block mb-2">
                División
              </label>

              <div className="flex flex-col gap-2">

                <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#d4a017] flex items-center justify-center text-xs font-medium text-black">
                      Y
                    </div>
                    <span className="text-sm text-white">Tú</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    €{amount ? (parseFloat(amount) / (groupMembers.length + 1)).toFixed(2) : "0.00"}
                  </span>
                </div>

                {groupMembers.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white">
                        {member.user?.name?.[0] || "U"}
                      </div>
                      <span className="text-sm text-white">
                        {member.user?.name || member.user?.user_name || "Usuario"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      €{amount ? (parseFloat(amount) / (groupMembers.length + 1)).toFixed(2) : "0.00"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/10">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-white/20 text-sm text-gray-300 hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-[#d4a017] text-black text-sm font-medium hover:bg-[#e6b01e] transition-colors"
          >
            Guardar gasto
          </button>

        </div>

      </div>
    </div>
  );
}