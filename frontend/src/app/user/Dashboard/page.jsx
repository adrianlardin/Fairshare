"use client";

import React, { useState } from 'react';
import Image from 'next/image';


const AccountSettings = () => {
  // Estados para los inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Estado para el modal de eliminación de cuenta
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Estado para el modal de guardado de cambios
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  // Estados para las preferencias
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [currency, setCurrency] = useState('USD ($)');

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // -------------------------------------->Aquí va la logica para guardar los cambios en el backend<-----------------------------------
    console.log('Guardando datos...');

    setIsSaveModalOpen(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-gray-200 font-sans p-6">

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">Configuración de la cuenta</h1>
        <p className="text-gray-400 text-sm mt-1">Seguridad y preferencias</p>
      </header>

      <form onSubmit={handleSaveChanges} className="space-y-6">

        <section className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Perfil</h2>
          <hr className="border-neutral-800 mb-6" />

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 min-w-[100px]">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#eec24b]">

                {/* --------------->Aqui va la imagen del usuario<---------------- */}

              </div>
              <button type="button" className="text-[10px] tracking-wider text-[#eec24b] uppercase font-bold hover:underline mt-1">
                Cambiar avatar
              </button>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Nombre completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#eec24b] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Dirección de correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Dirección de correo electrónico"
                  className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#eec24b] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Número de teléfono</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Número de teléfono"
                  className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#eec24b] transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Preferencias</h2>
          <hr className="border-neutral-800 mb-6" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">Notificaciones por Email</h3>
                <p className="text-xs text-gray-400 mt-0.5">Recibe actualizaciones sobre la actividad del grupo y los asuntos pendientes.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-neutral-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">Notificaciones Push</h3>
                <p className="text-xs text-gray-400 mt-0.5">Recibe alertas instantáneas en tu dispositivo.</p>
              </div>
              <button
                type="button"
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotifications ? 'bg-blue-600' : 'bg-neutral-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Moneda Predeterminada</label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full md:w-64 bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-[#eec24b] transition-colors cursor-pointer"
                >
                  <option value="ARS ($)">ARS ($)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-52 md:left-56 flex items-center px-2 text-gray-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#241313] border border-red-950 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Zona de Peligro</h3>
          <p className="text-xs text-red-300/80 mb-4">Una vez que eliminas tu cuenta, no hay vuelta atrás.</p>
          <div>
            <button
              type="button"
              className="border border-red-900/60 bg-transparent text-red-400 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-950/40 transition-colors"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Eliminar cuenta
            </button>

            {isDeleteModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                />

                <div className="relative w-full max-w-md bg-[#1a1a1a] border border-red-950/60 rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">

                  <div className="w-12 h-12 bg-red-950/50 border border-red-900/60 text-red-400 rounded-full flex items-center justify-center text-xl mb-4">
                    ⚠️
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">¿Estás absolutamente seguro?</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    Esta acción es permanente. Al eliminar tu cuenta perderás el acceso a todos tus grupos, historiales de gastos compartidos y saldos pendientes.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">

                    <button
                      type="button"
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#262626] border border-neutral-800 text-gray-300 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                      onClick={() => {
                        console.log("Cuenta eliminada definitivamente");
                        setIsDeleteModalOpen(false);
                        //------------------------>Aqui va la logica para eliminar la cuenta del usuario en el backend<-----------------------------------
                      }}
                    >
                      Sí, eliminar cuenta
                    </button>

                  </div>

                </div>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end pt-2">

          <button
            type="submit"
            className="bg-[#eec24b] text-[#121212] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#d8ae3e] transition-colors shadow-md"
          >
            Guardar cambios
          </button>

          {isSaveModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setIsSaveModalOpen(false)}
              />

              <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 text-center animate-in fade-in zoom-in-95 duration-200">

                <div className="w-14 h-14 bg-[#008744]/20 border border-[#008744] text-[#008744] rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-inner">
                  ✓
                </div>

                <h3 className="text-xl font-bold text-white mb-2">¡Cambios guardados!</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Tu perfil y preferencias de configuración han sido actualizados con éxito.
                </p>

                <button
                  type="button"
                  className="w-full bg-[#008744] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#007139] transition-colors shadow-lg shadow-emerald-950/20"
                  onClick={() => setIsSaveModalOpen(false)}
                >
                  Entendido
                </button>

              </div>
            </div>
          )}
        </div>

      </form>
    </div>
  );
};

export default AccountSettings;