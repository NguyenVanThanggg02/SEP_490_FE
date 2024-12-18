import { Save } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SpaceContext } from '../../Context/SpaceContext ';
import { Constants } from '../../utils/constants';

import Appliances from './Appliances';
import CategoriesPosted from './CategoriesPosted';
import EditLocation from './EditLocation';
import PreviewImage from './PreviewImage';
import Price from './Price';
import RuleList from './RuleList';
import Description from './Description';

const panels = {
  panel1: {
    0: CategoriesPosted,
    1: Appliances,
    2: Description,
  },
  panel2: {
    0: PreviewImage,
    1: RuleList,
  },
  panel3: {
    0: Price,
  },
  panel4: {
    0: EditLocation,
  },
};

const EditSpacePosted = () => {
  const locationWeb = useLocation();
  const navigate = useNavigate(); // Hook to navigate after successful registration

  const { spaceId } = locationWeb.state;
  const [isNotChangeData, setIsNotChangeData] = useState(true);
  const [isChangeAppliancesOfInitialCate, setIsChangeAppliancesOfInitialCate] =
    useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [selectedTab, setSelectedTab] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [spaceName, setSpaceName] = useState("")
  const userId = localStorage.getItem("userId");
  const {
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
  } = useContext(SpaceContext);
  const handleChangeAccordion = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    setSelectedTab(0);
  };

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const isHaveAtLeastOnePricePer =
  spaceInfo.pricePerHour ||
  spaceInfo.pricePerDay ||
  spaceInfo.pricePerWeek ||
  spaceInfo.pricePerMonth;

  const canSave =
    spaceInfo.name &&
    isHaveAtLeastOnePricePer &&
    spaceInfo.area > 0 &&
    selectedRules.length &&
    location &&
    spaceInfo.latLng.length;
  console.log(
    'canSave',
    spaceInfo,
    selectedAppliances,
    selectedRules,
    location,
    canSave,
    loading,
    isNotChangeData
  );

  // Nội dung từng tab của từng Accordion
  const renderTabContent = () => {
    const Comp = panels?.[expanded]?.[selectedTab];

    if (Comp)
      return (
        <Comp
          {...{
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
            setIsNotChangeData,
            isChangeAppliancesOfInitialCate,
            setIsChangeAppliancesOfInitialCate,
          }}
        />
      );
  };

  const onSave = async () => {
    try {
      const updatedSpace = {
        ...spaceInfo,
        name: spaceName,
        userId,
        rulesId: {
          _id: spaceInfo.rulesId._id,
          rules: selectedRules,
          customeRules: customRule ? customRule.split(';') : [],
        },
        location,
        isGoldenHour,
        goldenHourDetails,
        categoriesId: selectedCategoryId,
        appliancesId: {
          _id: spaceInfo.appliancesId._id,
          categoryId: selectedCategoryId,
          appliances: selectedAppliances,
        },
      };
      const res = await axios.post(
        `${Constants.apiHost}/spaces/update/${spaceId}`,
        updatedSpace
      );

      toast.success(
        'Cập nhật thông tin thành công! Đang chuyển hướng đến trang chi tiết...'
      );

      setTimeout(() => {
        navigate(`/spaces/${spaceId}`);
      }, 2000);
    } catch (error) {
      toast.error('Chỉnh sửa không thành công');
    }
  };

  useEffect(() => {
    const fetchSpaceData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${Constants.apiHost}/spaces/${spaceId}`
        );

        const {
          name,
          rulesId,
          area,
          description,
          pricePerHour,
          pricePerDay,
          // pricePerWeek,
          pricePerMonth,
          images,
          location,
          latLng,
          locationPoint,
          categoriesId,
          appliancesId,
          isGoldenHour,
          goldenHourDetails,
        } = response.data;

        setSpaceName(name);

        setSelectedCategoryId(categoriesId._id);
        setSelectedAppliances(appliancesId.appliances);

        setSelectedRules(rulesId.rules);
        setCustomRule(rulesId.customeRules.join(';'));

        setIsGoldenHour(isGoldenHour);
        setGoldenHourDetails(goldenHourDetails);

        setLocation(location);
        setPriceIncrease(goldenHourDetails?.[0]?.priceIncrease || '');

        console.log(
          'goldenHourDetails after fetch data space',
          goldenHourDetails
        );
        setSpaceInfo({
          name,
          area,
          description,
          pricePerHour,
          pricePerDay,
          description,
          // pricePerWeek,
          pricePerMonth,
          images,
          rulesId: {
            _id: rulesId._id,
            rules: rulesId.rules,
            customeRules: rulesId.customeRules,
          },
          categoriesId: categoriesId._id,
          appliancesId: {
            _id: appliancesId._id,
            categoryId: appliancesId.categoryId,
            appliances: appliancesId.appliances,
          },

          location,
          latLng,
        });
      } catch (err) {
        console.error(err);
        setError('Something wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceData();
  }, []);

  return (
    <Container>
      <Row>
        {/* Accordion Section */}
        <Col md={4}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2} 
              >
                <TextField
                  variant="outlined"
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  label="Tên không gian"
                  fullWidth
                  size="small" 
                  sx={{ borderRadius: 1 }} 
                />
                <IconButton
                  disabled={!canSave || loading || isNotChangeData}
                  onClick={onSave}
                  sx={{
                    backgroundColor: !!error ? "grey" : "primary.main", 
                    color: "white", 
                    "&:hover": {
                      backgroundColor: !!error ? "grey" : "primary.dark", 
                    },
                    padding: "10px", 
                    borderRadius: 1, 
                    height:'40px'
                  }}
                >
                  <Save />
                  Lưu
                </IconButton>
              </Stack>
              <Divider
                sx={{
                  bgcolor: "gray",
                  margin: "20px auto",
                  width: "150%",
                  transform: "translateX(-25%)",
                }}
              />

              {/* Accordion với Tabs */}
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChangeAccordion("panel1")}
                sx={{
                  boxShadow: 0, // Tạo hiệu ứng giống card
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor:
                      expanded === "panel1" ? "#e0f7fa" : "transparent", // Màu xanh nhạt
                    color: expanded === "panel1" ? "#1976d2" : "inherit", // Màu xanh đậm
                    fontWeight: expanded === "panel1" ? "bold" : "normal", // Làm đậm chữ khi mở
                  }}
                >
                  <Typography>Thông tin cơ bản</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Tabs
                      value={selectedTab}
                      onChange={handleChangeTab}
                      orientation="vertical"
                      variant="fullWidth"
                      TabIndicatorProps={{ style: { left: 0 } }}
                      sx={{ borderLeft: 1, borderColor: "divider" }}
                    >
                      <Tab
                        label="Thể loại không gian"
                        sx={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Tiện ích không gian"
                        sx={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Mô tả không gian & Diện tích"
                        sx={{ textTransform: 'none' }}
                      />
                    </Tabs>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChangeAccordion("panel2")}
                sx={{
                  boxShadow: 0, // Tạo hiệu ứng giống card
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor:
                      expanded === "panel2" ? "#e0f7fa" : "transparent", // Màu xanh nhạt
                    color: expanded === "panel2" ? "#1976d2" : "inherit", // Màu xanh đậm
                    fontWeight: expanded === "panel2" ? "bold" : "normal", // Làm đậm chữ khi mở
                  }}
                >
                  <Typography>Hình ảnh & Quy định</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Tabs
                      value={selectedTab}
                      onChange={handleChangeTab}
                      orientation="vertical"
                      variant="fullWidth"
                      TabIndicatorProps={{ style: { left: 0 } }}
                      sx={{ borderLeft: 1, borderColor: "divider" }}
                    >
                      <Tab label="Hình ảnh" sx={{ textTransform: "none" }} />
                      <Tab label="Quy định" sx={{ textTransform: "none" }} />
                    </Tabs>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChangeAccordion("panel3")}
                sx={{
                  boxShadow: 0, // Tạo hiệu ứng giống card
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor:
                      expanded === "panel3" ? "#e0f7fa" : "transparent", // Màu xanh nhạt
                    color: expanded === "panel3" ? "#1976d2" : "inherit", // Màu xanh đậm
                    fontWeight: expanded === "panel3" ? "bold" : "normal", // Làm đậm chữ khi mở
                  }}
                >
                  <Typography>Chính sách giá</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Tabs
                      value={selectedTab}
                      onChange={handleChangeTab}
                      orientation="vertical"
                      variant="fullWidth"
                      TabIndicatorProps={{ style: { left: 0 } }}
                      sx={{ borderLeft: 1, borderColor: "divider" }}
                    >
                      <Tab
                        label="Giá theo giờ/ ngày/ tháng /năm"
                        sx={{ textTransform: "none" }}
                      />
                    </Tabs>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChangeAccordion("panel4")}
                sx={{
                  boxShadow: 0, // Tạo hiệu ứng giống card
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor:
                      expanded === "panel4" ? "#e0f7fa" : "transparent", // Màu xanh nhạt
                    color: expanded === "panel4" ? "#1976d2" : "inherit", // Màu xanh đậm
                    fontWeight: expanded === "panel4" ? "bold" : "normal", // Làm đậm chữ khi mở
                  }}
                >
                  <Typography>Thay đổi địa điểm</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Tabs
                      value={selectedTab}
                      onChange={handleChangeTab}
                      orientation="vertical"
                      variant="fullWidth"
                      TabIndicatorProps={{ style: { left: 0 } }}
                      sx={{ borderLeft: 1, borderColor: "divider" }}
                    >
                      <Tab label="Vị trí" sx={{ textTransform: "none" }} />
                    </Tabs>
                  </div>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Col>

        {/* Content Section */}
        <Col md={8}>
          {loading ? <Typography>Loading...</Typography> : renderTabContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default EditSpacePosted;
