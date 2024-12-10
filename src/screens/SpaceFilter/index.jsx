/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

export const SpaceFilter = ({
  filter,
  setLoading,
  setListSpace,
  setFilter,
  loadInitData,
  filterDefault,
}) => {
  const [categories, setCategories] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [formattedMinPrice, setFormattedMinPrice] = useState(filter.minPrice);
  const [formattedMaxPrice, setFormattedMaxPrice] = useState(filter.maxPrice);
  const [formattedMinArea, setFormattedMinArea] = useState(filter.minArea); // Thay đổi từ filter.minminArea
  const [formattedMaxArea, setFormattedMaxArea] = useState(filter.maxArea); // Thay đổi từ filter.maxminArea

  const applianceNames = [
    ...new Set(
      appliances.flatMap((item) =>
        item.appliances.map((appliance) => appliance.name)
      )
    ),
  ];

  // get appliances
  useEffect(() => {
    axios
      .get("http://localhost:9999/appliances")
      .then((response) => setAppliances(response?.data))
      .catch((error) => console.error("Error fetching appliances:", error));
  }, []);

  // get categories
  useEffect(() => {
    axios
      .get("http://localhost:9999/categories")
      .then((response) => setCategories(response?.data))
      .catch((error) => console.error("Error fetching brands:", error));
  }, []);

  const labelForPricePer = {
    pricePerHour: "Giờ",
    pricePerDay: "Ngày",
    pricePerMonth: "Tháng",
  };

  const onFilterSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:9999/spaces/filter", {
        params: {
          ...filter,
          minPrice: formattedMinPrice.replace(/\./g, ""),
          maxPrice: formattedMaxPrice.replace(/\./g, ""),
          minArea: formattedMinArea.replace(/\./g, ""),
          maxArea: formattedMaxArea.replace(/\./g, ""),
        },
        paramsSerializer: {
          indexes: null, // by default: false
        },
      });
      console.log("get filter space", response);
      if (response.data?.data && response.data?.data?.length > 0) {
        setListSpace(response.data.data);
      } else {
        setListSpace([]);
      }
    } catch (error) {
      console.error("Error fetching filtered spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFilterReset = () => {
    setFilter(filterDefault);
    loadInitData();
    setFormattedMinArea(filterDefault.minArea); // Sửa lại để lấy giá trị từ filterDefault
    setFormattedMaxArea(filterDefault.maxArea); // Sửa lại để lấy giá trị từ filterDefault
    setFormattedMinPrice(filterDefault.minPrice);
    setFormattedMaxPrice(filterDefault.maxPrice);
  };

  const formatPrice = (value) => {
    // Chỉ định dạng giá trị hiển thị
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const formatArea = (value) => {
    // Chỉ định dạng diện tích hiển thị
    return value; // Có thể thêm logic định dạng nếu cần
  };

  const onFilterChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;

    if (key === "minPrice") {
      setFormattedMinPrice(value);
    } else if (key === "maxPrice") {
      setFormattedMaxPrice(value);
    } else if (key === "minArea") {
      setFormattedMinArea(value);
    } else if (key === "maxArea") {
      setFormattedMaxArea(value);
    } else {
      setFilter((prev) => {
        if (key !== "applianceNames") {
          return {
            ...prev,
            [key]: value,
          };
        } else {
          if (checked) {
            return {
              ...prev,
              [key]: [...prev.applianceNames, value],
            };
          } else {
            const otherApplianceNames = prev.applianceNames.filter(
              (appName) => appName !== value
            );
            return {
              ...prev,
              [key]: otherApplianceNames,
            };
          }
        }
      });
    }
  };

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <React.Fragment>
      {isMd && (
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <Button onClick={onFilterReset}>Bỏ lọc</Button>
            <Button onClick={onFilterSave} variant="contained">
              Lọc
            </Button>
          </Stack>
          <TextField
            label="Tên không gian"
            name={"name"}
            variant="outlined"
            fullWidth
            value={filter.name}
            onChange={onFilterChange}
          />
          <FormControl fullWidth>
            <InputLabel id="type-of-cate-select-label">
              Loại không gian
            </InputLabel>
            <Select
              labelId="type-of-cate-select-label"
              id="type-of-cate-select"
              name="cateId"
              value={filter.cateId}
              label="Loại không gian"
              onChange={onFilterChange}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {categories.map((cate) => (
                <MenuItem key={cate._id} value={cate._id}>
                  {cate.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{ m: 3, maxHeight: "300px", overflow: "auto" }}
            component="fieldset"
            variant="standard"
          >
            <FormLabel component="legend">Tiện nghi</FormLabel>
            <FormGroup>
              {applianceNames.map((name, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      value={name}
                      onChange={onFilterChange}
                      name={"applianceNames"}
                    />
                  }
                  label={name}
                />
              ))}
            </FormGroup>
          </FormControl>
          <div className="filter-section" style={{ border: "none" }}>
            <div
              className="filter-section-title"
              style={{ marginRight: "10px", color: "gray" }}
            >
              Diện tích:
            </div>
            <div
              style={{
                borderBottom: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                name="minArea"
                variant="outlined"
                value={formatPrice(formattedMinArea.replace(/\./g, ""))}
                onChange={onFilterChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      / m<sup>2</sup>
                    </InputAdornment>
                  ),
                }}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "."
                  ) {
                    e.preventDefault();
                  }
                }}
                sx={{
                  height: "40px",
                  "& .MuiOutlinedInput-root": {
                    height: "100%",
                  },
                  width: "118px",
                  marginRight: "10px",
                }}
              />
              <TextField
                name="maxArea"
                variant="outlined"
                required
                value={formatPrice(formattedMaxArea.replace(/\./g, ""))}
                onChange={onFilterChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      / m<sup>2</sup>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  height: "40px",
                  "& .MuiOutlinedInput-root": {
                    height: "100%",
                  },
                  width: "118px",
                }}
              />
            </div>
          </div>
          <div className="filter-section" style={{ border: "none" }}>
            <div className="filter-section-title" style={{ color: "gray" }}>
              Giá:
            </div>
            <div
              style={{
                borderBottom: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="  Từ"
                name="minPrice"
                onChange={onFilterChange}
                value={formatPrice(formattedMinPrice.replace(/\./g, ""))} // Hiển thị giá đã định dạng
                style={{
                  height: "40px",
                  border: "solid #CCC 1px",
                  borderRadius: "5px",
                  width: "118px",
                  marginRight: "10px",
                }}
              />
              <input
                type="text"
                placeholder="  Đến"
                name="maxPrice"
                onChange={onFilterChange}
                value={formatPrice(formattedMaxPrice.replace(/\./g, ""))} // Hiển thị giá đã định dạng
                style={{
                  height: "40px",
                  border: "solid #CCC 1px",
                  borderRadius: "5px",
                  width: "118px",
                }}
              />
            </div>
          </div>
          <FormControl fullWidth>
            <InputLabel id="type-of-price-select-label">
              Hình thức thuê
            </InputLabel>
            <Select
              labelId="type-of-price-select-label"
              id="type-of-price-select"
              name="typeOfPrice"
              value={filter.typeOfPrice}
              label="Hình thức thuê"
              onChange={onFilterChange}
            >
              {[...Object.keys(labelForPricePer)].map((key, i) => (
                <MenuItem key={i} value={key}>
                  {labelForPricePer[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}
      {!isMd && (
        <IconButton
          onClick={() => toggleDrawer(true)}
          color="primary"
          sx={{ mt: 1 }}
        >
          <FilterAltIcon />
        </IconButton>
      )}
      {!isMd && (
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={() => toggleDrawer(false)}
        >
          <Stack spacing={2} sx={{ padding: 2, width: "300px" }}>
            <Stack direction="row" spacing={1}>
              <Button onClick={onFilterReset}>Bỏ lọc</Button>
              <Button onClick={onFilterSave} variant="contained">
                Lọc
              </Button>
            </Stack>
            <TextField
              label="Tên không gian"
              name={"name"}
              variant="outlined"
              fullWidth
              value={filter.name}
              onChange={onFilterChange}
            />
            <FormControl fullWidth>
              <InputLabel id="type-of-cate-select-label">
                Loại không gian
              </InputLabel>
              <Select
                labelId="type-of-cate-select-label"
                id="type-of-cate-select"
                name="cateId"
                value={filter.cateId}
                label="Loại không gian"
                onChange={onFilterChange}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {categories.map((cate) => (
                  <MenuItem key={cate._id} value={cate._id}>
                    {cate.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{ m: 3, maxHeight: "300px", overflow: "auto" }}
              component="fieldset"
              variant="standard"
            >
              <FormLabel component="legend">Tiện nghi</FormLabel>
              <FormGroup>
                {applianceNames.map((name, i) => (
                  <FormControlLabel
                    key={i}
                    control={
                      <Checkbox
                        value={name}
                        onChange={onFilterChange}
                        name={"applianceNames"}
                      />
                    }
                    label={name}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <div className="filter-section" style={{ border: "none" }}>
              <div
                className="filter-section-title"
                style={{ marginRight: "10px", color: "gray" }}
              >
                Diện tích:
              </div>
              <div
                style={{
                  borderBottom: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  name="minArea"
                  variant="outlined"
                  value={formattedMinArea} // Sử dụng giá trị hiển thị
                  onChange={onFilterChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        / m<sup>2</sup>
                      </InputAdornment>
                    ),
                  }}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "."
                    ) {
                      e.preventDefault();
                    }
                  }}
                  sx={{
                    height: "40px",
                    "& .MuiOutlinedInput-root": {
                      height: "100%",
                    },
                    width: "118px",
                    marginRight: "10px",
                  }}
                />
                <TextField
                  name="maxArea"
                  variant="outlined"
                  required
                  value={formattedMaxArea} // Sử dụng giá trị hiển thị
                  onChange={onFilterChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        / m<sup>2</sup>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    height: "40px",
                    "& .MuiOutlinedInput-root": {
                      height: "100%",
                    },
                    width: "118px",
                  }}
                />
              </div>
            </div>
            <div className="filter-section" style={{ border: "none" }}>
              <div className="filter-section-title" style={{ color: "gray" }}>
                Giá:
              </div>
              <div
                style={{
                  borderBottom: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="  Từ"
                  name="minPrice"
                  onChange={onFilterChange}
                  value={formatPrice(formattedMinPrice.replace(/\./g, ""))} // Hiển thị giá đã định dạng
                  style={{
                    height: "40px",
                    border: "solid #CCC 1px",
                    borderRadius: "5px",
                    width: "118px",
                    marginRight: "10px",
                  }}
                />
                <input
                  type="text"
                  placeholder="  Đến"
                  name="maxPrice"
                  onChange={onFilterChange}
                  value={formatPrice(formattedMaxPrice.replace(/\./g, ""))} // Hiển thị giá đã định dạng
                  style={{
                    height: "40px",
                    border: "solid #CCC 1px",
                    borderRadius: "5px",
                    width: "118px",
                  }}
                />
              </div>
            </div>
            <FormControl fullWidth>
              <InputLabel id="type-of-price-select-label">
                Hình thức thuê
              </InputLabel>
              <Select
                labelId="type-of-price-select-label"
                id="type-of-price-select"
                name="typeOfPrice"
                value={filter.typeOfPrice}
                label="Hình thức thuê"
                onChange={onFilterChange}
              >
                {[...Object.keys(labelForPricePer)].map((key, i) => (
                  <MenuItem key={i} value={key}>
                    {labelForPricePer[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Drawer>
      )}
    </React.Fragment>
  );
};
