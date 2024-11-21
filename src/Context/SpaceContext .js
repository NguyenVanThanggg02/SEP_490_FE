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
    area: '',
    rulesId: null,
    pricePerHour: 0,
    pricePerDay: 0,
    // pricePerWeek: 0,
    pricePerMonth: 0,
    images: [],
    latLng: [],
  });
  const [isGoldenHour, setIsGoldenHour] = useState(false);
  // {
  //   startTime: '',
  //   endTime: '',
  //   priceIncrease: 0,
  // }
  const [goldenHourDetails, setGoldenHourDetails] = useState([]);
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [customRule, setCustomRule] = useState('');
  const [priceIncrease, setPriceIncrease] = useState(0);

  return (
    <SpaceContext.Provider
      value={{
        selectedCategoryId,
        setSelectedCategoryId,
        selectedApplianceId,
        setSelectedApplianceId,
        selectedAppliances,
        setSelectedAppliances, // Cập nhật hàm này để lưu toàn bộ appliance object
        location,
        setLocation,
        spaceInfo,
        setSpaceInfo,
        rules,
        setRules,
        selectedRules,
        setSelectedRules,
        customRule,
        setCustomRule,
        isGoldenHour,
        setIsGoldenHour,
        goldenHourDetails,
        setGoldenHourDetails,
        priceIncrease,
        setPriceIncrease,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};
