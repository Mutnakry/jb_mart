import React, { createContext, useContext, useState } from 'react';

const QRCodeContext = createContext();

export const useQRCode = () => useContext(QRCodeContext);

export const QRCodeProvider = ({ children }) => {
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);

  return (
    <QRCodeContext.Provider value={{ isQRCodeModalOpen, setIsQRCodeModalOpen, qrCodeData, setQrCodeData }}>
      {children}
    </QRCodeContext.Provider>
  );
};
