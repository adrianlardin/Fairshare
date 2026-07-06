"use client";
import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalGasto, setModalGasto] = useState(false);
    const [actualizarDatosTrigger, setActualizarDatosTrigger] = useState(0);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const refrescarDatos = () => setActualizarDatosTrigger(prev => prev + 1);

    return (
        <ModalContext.Provider value={{ 
            modalGasto, setModalGasto,
            actualizarDatosTrigger, refrescarDatos,
            sidebarCollapsed, setSidebarCollapsed
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModales = () => useContext(ModalContext);