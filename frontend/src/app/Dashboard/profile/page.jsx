"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconUser, IconCheck } from "@/components/icons";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Jack",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Fairshare1",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Fairshare2",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool"
];

const AccountSettings = () => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  // Intentamos obtener el usuario del localStorage antes de renderizar
  const tuUsuarioLocal = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const usuarioInicial = tuUsuarioLocal ? JSON.parse(tuUsuarioLocal) : {};

  // Ahora tus estados iniciales tendrán los datos reales de la sesión actual
  const [name, setName] = useState(usuarioInicial.name || '');
  const [lastName, setLastName] = useState(usuarioInicial.last_name || '');
  const [userName, setUserName] = useState(usuarioInicial.user_name || '');
  const [email, setEmail] = useState(usuarioInicial.email || '');
  const [avatar, setAvatar] = useState(usuarioInicial.avatar || '');
  const [currency, setCurrency] = useState(usuarioInicial.currency || 'USD ($)');
  const [emailNotifications, setEmailNotifications] = useState(usuarioInicial.email_notifications ?? false);
  const [pushNotifications, setPushNotifications] = useState(usuarioInicial.push_notifications ?? false);
  const [userId, setUserId] = useState(usuarioInicial.id || '');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        alert("Sesión expirada. Por favor, inicia sesión.");
        router.push('/login');
        return;
      }

      try {
        const userObj = JSON.parse(storedUser);
        const userId = userObj.id;

        const response = await fetch(`http://localhost:5000/user/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setName(data.name || '');
          setLastName(data.last_name || '');
          setUserName(data.user_name || '');
          setEmail(data.email || '');
          setAvatar(data.avatar || '');
          if (data.currency) setCurrency(data.currency);
          setUserId(data.id || userObj.id);
          if (data.email_notifications !== undefined) setEmailNotifications(data.email_notifications);
          if (data.push_notifications !== undefined) setPushNotifications(data.push_notifications);
        } else {
          const errMsg = data.error || data.msg || "Error desconocido";
          console.error("Error al obtener perfil:", errMsg);
          if (response.status === 401) {
            alert("Sesion expirada. Por favor, inicia sesion nuevamente.");
            localStorage.clear();
            router.push('/login');
          }
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    try {
      const userObj = JSON.parse(storedUser);
      const userId = userObj.id;

      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          last_name: lastName,
          user_name: userName,
          currency: currency,
          avatar: avatar,
          email_notifications: emailNotifications,
          push_notifications: pushNotifications
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Guardamos el JSON fresco en el almacenamiento local
        localStorage.setItem("user", JSON.stringify(data));

        // 2. 🌟 FORZAMOS a los estados a tomar los valores recién devueltos por Flask
        setName(data.name || '');
        setLastName(data.last_name || '');
        setUserName(data.user_name || '');
        setCurrency(data.currency || 'USD ($)');
        setAvatar(data.avatar || '');
        setEmailNotifications(!!data.email_notifications); // El !! asegura que sea un booleano estricto
        setPushNotifications(!!data.push_notifications);

        setIsSaveModalOpen(true);
      } else {
        const errMsg = data.error || data.msg || "Error al actualizar la configuracion.";
        alert(errMsg);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    try {
      const userObj = JSON.parse(storedUser);
      const userId = userObj.id;

      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Usuario eliminado correctamente");
        localStorage.clear();
        setIsDeleteModalOpen(false);
        router.push('/register');
      } else {
        const errMsg = data.error || data.msg || "No se pudo eliminar la cuenta.";
        alert(errMsg);
      }
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("Ocurrió un error en el servidor.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-gray-200 font-sans p-6">

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">Configuración de la cuenta</h1>
        <p className="text-gray-400 text-sm mt-1">Seguridad y preferencias</p>
      </header>

      <form onSubmit={handleSaveChanges} className="space-y-6">

        <section className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Perfil</h2>
          <hr className="border-slate-700 mb-6" />

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Contenedor del Avatar y Selector */}
            <div className="flex flex-col items-center gap-2 min-w-[100px]">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#3B82F6] bg-slate-700 flex items-center justify-center shadow-lg">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar de usuario"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-400"><IconUser size={24} /></span>
                )}
              </div>

              <button
                type="button"
                className="text-[10px] tracking-wider text-[#3B82F6] uppercase font-bold hover:underline mt-1"
                onClick={() => setIsAvatarSelectorOpen(!isAvatarSelectorOpen)}
              >
                {isAvatarSelectorOpen ? "Cerrar selección" : "Cambiar avatar"}
              </button>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Apellido</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Tu apellido"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Nombre de usuario</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Dirección de correo electrónico (Lectura)</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  placeholder="Dirección de correo electrónico"
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-gray-400 mb-1 uppercase">Tu ID de usuario</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userId}
                    disabled
                    placeholder="ID"
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-[#3B82F6] font-mono font-bold text-lg cursor-default outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(userId) }}
                    className="shrink-0 bg-slate-700 hover:bg-slate-600 text-gray-300 px-3 py-3 rounded-lg text-xs font-mono transition-colors border border-slate-600"
                    title="Copiar ID"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Comparte este ID para que tus amigos te envien solicitudes de amistad o te agreguen a grupos.
                </p>
              </div>
            </div>
          </div>

          {isAvatarSelectorOpen && (
            <div className="mt-6 bg-[#0f172a] border border-slate-700 rounded-xl p-4 animate-in fade-in duration-200">
              <p className="text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider">Selecciona un avatar predeterminado:</p>
              <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
                {PRESET_AVATARS.map((avatarUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setAvatar(avatarUrl);
                      setIsAvatarSelectorOpen(false); // Cierra la grilla al elegir uno
                    }}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden bg-slate-700 border-2 transition-all p-1 hover:scale-105 ${avatar === avatarUrl ? 'border-[#3B82F6] bg-slate-600 ring-2 ring-[#3B82F6]/20' : 'border-transparent border-slate-600'
                      }`}
                  >
                    <img src={avatarUrl} alt={`Opción ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Preferencias</h2>
          <hr className="border-slate-700 mb-6" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">Notificaciones por Email</h3>
                <p className="text-xs text-gray-400 mt-0.5">Recibe actualizaciones sobre la actividad del grupo.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">Notificaciones Push</h3>
                <p className="text-xs text-gray-400 mt-0.5">Recibe alertas instantáneas.</p>
              </div>
              <button
                type="button"
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotifications ? 'bg-blue-600' : 'bg-slate-600'}`}
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
                  className="w-full md:w-64 bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-[#3B82F6] transition-colors cursor-pointer"
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

        {/* Zona de Peligro */}
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
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                <div className="relative w-full max-w-md bg-[#1e293b] border border-red-950/60 rounded-2xl p-6 shadow-2xl z-10">
                  <h3 className="text-xl font-bold text-white mb-2">¿Estás absolutamente seguro?</h3>
                  <p className="text-sm text-gray-400 mb-6">Esta acción es permanente e irreversible.</p>
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#334155] border border-slate-700 text-gray-300 rounded-xl text-sm font-semibold hover:bg-slate-700"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700"
                      onClick={handleDeleteAccount}
                    >
                      Sí, eliminar cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Botón Guardar Cambios */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#3B82F6] text-[#0f172a] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2563EB] transition-colors shadow-md"
          >
            Guardar cambios
          </button>

          {isSaveModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsSaveModalOpen(false)} />
              <div className="relative w-full max-w-sm bg-[#1e293b] border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 text-center">
                <div className="w-14 h-14 bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4"><IconCheck size={24} /></div>
                <h3 className="text-xl font-bold text-white mb-2">¡Cambios guardados!</h3>
                <button
                  type="button"
                  className="w-full bg-[#22C55E] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#16A34A]"
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