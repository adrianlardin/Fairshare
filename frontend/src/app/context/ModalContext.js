"use client";
import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalGasto, setModalGasto] = useState(false);
    const [actualizarDatosTrigger, setActualizarDatosTrigger] = useState(0);

    const refrescarDatos = () => setActualizarDatosTrigger(prev => prev + 1);

    return (
        <ModalContext.Provider value={{ 
            modalGasto, setModalGasto,
            actualizarDatosTrigger, refrescarDatos 
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModales = () => useContext(ModalContext);