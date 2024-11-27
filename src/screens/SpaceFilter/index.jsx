/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react"
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
    Select, Stack,
    TextField,
    useMediaQuery
} from "@mui/material";
import axios from "axios";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Select as SearchSelect } from 'antd';

export const SpaceFilter = ({ filter, setLoading, setListSpace, setFilter, loadInitData, filterDefault }) => {

    const [categories, setCategories] = useState([]);
    const [appliances, setAppliances] = useState([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const isMd = useMediaQuery((theme) => theme.breakpoints.up('md'));
    const [provinces, setProvinces] = useState([]);
    const [provinceSearch, setProvinceSearch] = useState('');
    const [provinceSuggests, setProvinceSuggests] = useState([]);
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
            .get('http://localhost:9999/appliances')
            .then((response) => setAppliances(response?.data))
            .catch((error) => console.error('Error fetching appliances:', error));
    }, []);

    // get categories
    useEffect(() => {
        axios
            .get('http://localhost:9999/categories')
            .then((response) => setCategories(response?.data))
            .catch((error) => console.error('Error fetching brands:', error));
    }, []);

    const labelForPricePer = {
        pricePerHour: 'Giờ',
        pricePerDay: 'Ngày',
        // pricePerWeek: 'Tuần',
        pricePerMonth: ' Tháng',
    };

    const onFilterSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:9999/spaces/filter', {
                params: { ...filter },
                paramsSerializer: {
                    indexes: null, // by default: false
                },
            });
            console.log('get filter space', response);
            if (response.data?.data && response.data?.data?.length > 0) {
                setListSpace(response.data.data);
            } else {
                setListSpace([]);
            }
        } catch (error) {
            console.error('Error fetching filtered spaces:', error);
        } finally {
            setLoading(false);
        }
    };
    const onFilterReset = () => {
        setFilter(filterDefault);
        loadInitData();
    };

    const onFilterChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;
        const checked = e.target.checked;

        setFilter((prev) => {
            if (key !== 'applianceNames') {
                return {
                    ...prev,
                    [key]: value,
                };
            } else {
                if (checked) {
                    console.log([...prev.applianceNames, value]);
                    return {
                        ...prev,
                        [key]: [...prev.applianceNames, value],
                    };
                } else {
                    const otherApplianceNames = prev.applianceNames.filter(
                        (appName) => appName !== value
                    );
                    console.log(otherApplianceNames);

                    return {
                        ...prev,
                        [key]: otherApplianceNames,
                    };
                }
            }
        });
    };

    const onProvinceSearchChange = (e) => {
        const input = e.target.value;
        setProvinceSearch(input);
    };

    const onSetProvince = (value) => {
        setProvinceSearch(value);
        setFilter((prev) => ({ ...prev, province: value }));
    };


    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    useEffect(() => {
        const fetchprovinces = async () => {
            try {
                const response = await axios.get(
                    'https://esgoo.net/api-tinhthanh/1/0.htm'
                );
                // https://provinces.open-api.vn/api/
                const formattedProvinces = response.data.data.map((province) => ({
                    value: province.name,
                    label: province.name,
                }));
                setProvinces(formattedProvinces);
                setProvinceSuggests(formattedProvinces);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchprovinces();
    }, []);
    return (
        <React.Fragment>
            {isMd &&
                <Stack spacing={2}>
                    <Stack direction="row" spacing={1}>
                        <Button onClick={onFilterReset}>Bỏ lọc</Button>
                        <Button onClick={onFilterSave} variant="contained">
                            Lọc
                        </Button>
                    </Stack>

                    <TextField
                        label="Tên không gian"
                        name={'name'}
                        variant="outlined"
                        fullWidth
                        value={filter.name}
                        onChange={onFilterChange} // Cập nhật khi người dùng nhập
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
                        sx={{ m: 3, maxHeight: '300px', overflow: 'auto' }}
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
                                            name={'applianceNames'}
                                        />
                                    }
                                    label={name}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                    <div className="filter-section" style={{ border: 'none' }}>
                        <div
                            className="filter-section-title"
                            style={{ marginRight: '10px', color: 'gray' }}
                        >
                            Diện tích:
                        </div>
                        <div
                            style={{
                                borderBottom: 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                name="minArea"
                                variant="outlined"
                                value={filter.minArea}
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
                                        e.key !== 'Backspace' &&
                                        e.key !== 'Delete' &&
                                        e.key !== '.'
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                sx={{
                                    height: '40px',
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                    },
                                    width: '118px',
                                    marginRight: '10px',
                                }}
                            />

                            <TextField
                                name="maxArea"
                                variant="outlined"
                                required
                                value={filter.maxArea}
                                onChange={onFilterChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            / m<sup>2</sup>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    height: '40px',
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                    },
                                    width: '118px',
                                }}
                            />
                        </div>
                    </div>

                    <div className="filter-section" style={{ border: 'none' }}>
                        <div className="filter-section-title" style={{ color: 'gray' }}>
                            Giá:
                        </div>
                        <div
                            style={{
                                borderBottom: 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <input
                                type="text"
                                placeholder="  Từ"
                                name="minPrice"
                                onChange={onFilterChange}
                                value={filter.minPrice}
                                style={{
                                    height: '40px',
                                    border: 'solid #CCC 1px',
                                    borderRadius: '5px',
                                    width: '118px',
                                    marginRight: '10px',
                                }}
                            />
                            <input
                                type="text"
                                placeholder="  Đến"
                                name="maxPrice"
                                onChange={onFilterChange}
                                value={filter.maxPrice}
                                style={{
                                    height: '40px',
                                    border: 'solid #CCC 1px',
                                    borderRadius: '5px',
                                    width: '118px',
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
                    <div className="filter-section" style={{ border: 'none' }}>
                        <div
                            className="filter-section-title"
                            style={{ marginRight: '10px', color: 'gray' }}
                        >
                            Tỉnh thành:
                        </div>

                        <SearchSelect
                            size="medium"
                            style={{ marginBottom: 50, width: '100%' }}
                            onInputKeyDown={onProvinceSearchChange}
                            showSearch
                            placeholder="Nhập tỉnh thành"
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={provinceSuggests}
                            onChange={(e) => onSetProvince(e)}
                            value={provinceSearch}
                        >
                            {provinceSuggests.map((item, index) => {
                                return (
                                    <SearchSelect.Option
                                        value={item.value}
                                        key={index + '__' + item.label}
                                    >
                                        {item.label}
                                    </SearchSelect.Option>
                                );
                            })}
                        </SearchSelect>
                    </div>
                </Stack>}

            {!isMd && (
                <IconButton onClick={() => toggleDrawer(true)} color="primary" sx={{ mt: 1 }}>
                    <FilterAltIcon />
                </IconButton>
            )}
            {
                !isMd && <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
                    <Stack spacing={2} sx={{ padding: 2, width: '300px' }}>
                        <Stack direction="row" spacing={1}>
                            <Button onClick={onFilterReset}>Bỏ lọc</Button>
                            <Button onClick={onFilterSave} variant="contained">
                                Lọc
                            </Button>
                        </Stack>

                        <TextField
                            label="Tên không gian"
                            name={'name'}
                            variant="outlined"
                            fullWidth
                            value={filter.name}
                            onChange={onFilterChange} // Cập nhật khi người dùng nhập
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
                            sx={{ m: 3, maxHeight: '300px', overflow: 'auto' }}
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
                                                name={'applianceNames'}
                                            />
                                        }
                                        label={name}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        <div className="filter-section" style={{ border: 'none' }}>
                            <div
                                className="filter-section-title"
                                style={{ marginRight: '10px', color: 'gray' }}
                            >
                                Diện tích:
                            </div>
                            <div
                                style={{
                                    borderBottom: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <TextField
                                    name="minArea"
                                    variant="outlined"
                                    value={filter.minArea}
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
                                            e.key !== 'Backspace' &&
                                            e.key !== 'Delete' &&
                                            e.key !== '.'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    sx={{
                                        height: '40px',
                                        '& .MuiOutlinedInput-root': {
                                            height: '100%',
                                        },
                                        width: '118px',
                                        marginRight: '10px',
                                    }}
                                />

                                <TextField
                                    name="maxArea"
                                    variant="outlined"
                                    required
                                    value={filter.maxArea}
                                    onChange={onFilterChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                / m<sup>2</sup>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        height: '40px',
                                        '& .MuiOutlinedInput-root': {
                                            height: '100%',
                                        },
                                        width: '118px',
                                    }}
                                />
                            </div>
                        </div>

                        <div className="filter-section" style={{ border: 'none' }}>
                            <div className="filter-section-title" style={{ color: 'gray' }}>
                                Giá:
                            </div>
                            <div
                                style={{
                                    borderBottom: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="  Từ"
                                    name="minPrice"
                                    onChange={onFilterChange}
                                    value={filter.minPrice}
                                    style={{
                                        height: '40px',
                                        border: 'solid #CCC 1px',
                                        borderRadius: '5px',
                                        width: '118px',
                                        marginRight: '10px',
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="  Đến"
                                    name="maxPrice"
                                    onChange={onFilterChange}
                                    value={filter.maxPrice}
                                    style={{
                                        height: '40px',
                                        border: 'solid #CCC 1px',
                                        borderRadius: '5px',
                                        width: '118px',
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
                        <div className="filter-section" style={{ border: 'none' }}>
                            <div
                                className="filter-section-title"
                                style={{ marginRight: '10px', color: 'gray' }}
                            >
                                Tỉnh thành:
                            </div>
                            <SearchSelect
                                size="medium"
                                style={{ marginBottom: 50, width: '100%' }}
                                onInputKeyDown={onProvinceSearchChange}
                                showSearch
                                placeholder="Nhập tỉnh thành"
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={provinceSuggests}
                                onChange={(e) => onSetProvince(e)}
                                value={provinceSearch}
                            >
                                {provinceSuggests.map((item, index) => {
                                    return (
                                        <SearchSelect.Option
                                            value={item.value}
                                            key={index + '__' + item.label}
                                        >
                                            {item.label}
                                        </SearchSelect.Option>
                                    );
                                })}
                            </SearchSelect>
                        </div>
                    </Stack>
                </Drawer>
            }
        </React.Fragment>
    )
}