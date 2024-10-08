import React, { createContext, useState } from 'react';

// Tạo context
export const SpaceContext = createContext();

// Provider component
export const SpaceProvider = ({ children }) => {
  // Quản lý state cho từng phần dữ liệu
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedApplianceId, setSelectedApplianceId] = useState(null);
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [location, setLocation] = useState(null);
  const [spaceInfo, setSpaceInfo] = useState({
    name: '',
    description: '',
    area: 0,
    rulesId: null,
    pricePerHour: 0
  });

  return (
    <SpaceContext.Provider value={{
      selectedCategoryId,
      setSelectedCategoryId,
      selectedApplianceId,
      setSelectedApplianceId,
      selectedAppliances,
      setSelectedAppliances, // Cập nhật hàm này để lưu toàn bộ appliance object
      location,
      setLocation,
      spaceInfo,
      setSpaceInfo
    }}>
      {children}
    </SpaceContext.Provider>
  );
};
