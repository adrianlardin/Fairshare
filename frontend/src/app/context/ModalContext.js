"use client";
import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalGasto, setModalGasto] = useState(false);
    
    // ============================================================================
    // PARTE MODIFICADA: Puse el estado modalLiquidar y setModalLiquidar.
    // Era necesario para que el botón "Liquidar deudas" del Dashboard funcione
    // y no dé error de función indefinida al intentar importarlo.
    // ============================================================================
    const [modalLiquidar, setModalLiquidar] = useState(false);

    const [actualizarDatosTrigger, setActualizarDatosTrigger] = useState(0);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const refrescarDatos = () => setActualizarDatosTrigger(prev => prev + 1);

    return (
        <ModalContext.Provider value={{ 
            modalGasto, setModalGasto,
            // Agregamos los estados de liquidación al Provider para que sean accesibles
            modalLiquidar, setModalLiquidar,
            actualizarDatosTrigger, refrescarDatos,
            sidebarCollapsed, setSidebarCollapsed
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModales = () => useContext(ModalContext);