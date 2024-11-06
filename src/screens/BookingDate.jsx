import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    Box, Grid, Typography, FormControl, RadioGroup, FormControlLabel, Radio,
    Button, Paper, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { priceFormatter } from '../utils/numberFormatter';
import { checkDayAvailability, checkHourAvailability, createBooking } from '../Api/BookingRequests';
import { toast } from 'react-toastify';

const BookingForm = () => {
    const { id } = useParams()
    const [spaceData, setSpaceData] = useState({})
    const [loading, setLoading] = useState(false);
    const [rentalType, setRentalType] = useState('hour');
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [summary, setSummary] = useState([]);
    const [goldenHour, setGoldenHour] = useState({});
    const [availableSlots, setAvailableSlots] = useState([]);
    const userId = localStorage.getItem("userId")

    useEffect(() => {
        fetchSpaceData();
    }, []);

    const fetchSpaceData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`http://localhost:9999/spaces/${id}`);
            setSpaceData(response.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async (dates, newRentalType) => {
        try {
            const formattedDates = dates.map(date => date.toISOString());

            let response;
            let body = {
                spaceId: id,
                dates: formattedDates
            }
            if (newRentalType === 'hour' || newRentalType === 'day') {
                // Gọi API checkHourAvailability cho thuê theo giờ và ngày
                response = await checkHourAvailability(body)
            } else {
                // Gọi API checkDayAvailability cho thuê theo tuần và tháng
                response = await checkDayAvailability(body)
            }

            const newAvailableSlots = (response.data.availableSlots || []).reduce((acc, slotInfo) => {
                const dayKey = slotInfo.date;
                if (newRentalType === 'hour') {
                    acc[dayKey] = slotInfo.slots || [];
                } else {
                    acc[dayKey] = slotInfo.isAvailable !== undefined ? slotInfo.isAvailable : true;
                }
                return acc;
            }, {});

            setAvailableSlots(newAvailableSlots);
        } catch (error) {
            console.error("Error fetching available slots", error);
        }
    };





    const handleRentalTypeChange = async (event) => {
        const newRentalType = event.target.value;
        setRentalType(newRentalType);
        setSelectedDates([]);
        setSelectedSlots([]);
        setSummary([]);

        // Gọi fetchAvailableSlots khi đổi rentalType để cập nhật danh sách khả dụng
        const today = new Date();
        if (newRentalType === 'day' || newRentalType === 'week' || newRentalType === 'month') {
            const datesToFetch = Array.from({ length: 30 }, (_, i) => addDays(today, i)); // Lấy 30 ngày từ hôm nay
            await fetchAvailableSlots(datesToFetch, newRentalType);
        }
    };

    const isGoldenHour = (time) => {
        if (!spaceData || !spaceData.isGoldenHour) return false;
        const { startTime, endTime } = spaceData.goldenHourDetails;
    
        // Tạo các đối tượng Date cho startTime, endTime và time để so sánh
        const [startHour, startMinute] = startTime?.split(':').map(Number);
        const [endHour, endMinute] = endTime?.split(':').map(Number);
        const [timeHour, timeMinute] = time?.split(':').map(Number);
    
        const start = new Date();
        start.setHours(startHour, startMinute, 0, 0);
    
        const end = new Date();
        end.setHours(endHour, endMinute, 0, 0);
    
        const currentTime = new Date();
        currentTime.setHours(timeHour, timeMinute, 0, 0);
    
        return currentTime >= start && currentTime < end;
    };
    

    const calculatePrice = (time) => {
        if (!spaceData) return 0;
        const { pricePerHour, pricePerDay, pricePerWeek, pricePerMonth, goldenHourDetails } = spaceData;
        let checkGoldenHour = isGoldenHour(time)
        setGoldenHour({
            checkGoldenHour: checkGoldenHour,
            priceIncrease: goldenHourDetails?.priceIncrease
        })
        if (rentalType === 'hour') {
            const basePrice = checkGoldenHour ? pricePerHour * (1 + (goldenHourDetails?.priceIncrease / 100)) : pricePerHour;
            return !!checkGoldenHour ? { basePrice: basePrice, isGolden: !!checkGoldenHour } : basePrice;
        } else if (rentalType === 'day') {
            return pricePerDay;
        } else if (rentalType === 'week') {
            return pricePerWeek;
        } else {
            return pricePerMonth;
        }
    };

    const addDays = (startDate, days) => {
        const result = new Date(startDate);
        result.setDate(result.getDate() + days);
        return result;
    };

    const handleDateChange = async (date) => {
        if (rentalType === 'hour') {
            const dateString = date.toDateString();
            if (selectedDates.some(d => d.toDateString() === dateString)) {
                setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateString));
            } else {
                const newSelectedDates = [...selectedDates, date];
                setSelectedDates(newSelectedDates);
                await fetchAvailableSlots(newSelectedDates, 'hour');
            }
        } else if (rentalType === 'day') {
            const dateString = date.toDateString();
            const newSelectedDates = selectedDates.some(d => d.toDateString() === dateString)
                ? selectedDates.filter(d => d.toDateString() !== dateString)
                : [...selectedDates, date];

            await fetchAvailableSlots(newSelectedDates, 'day');

            const allDaysAvailable = newSelectedDates.every(d => {
                const dayKey = d.toDateString();
                return availableSlots[dayKey] === true;
            });

            if (!allDaysAvailable) {
                setSelectedDates(newSelectedDates);
                setSummary(newSelectedDates.map(d => ({
                    slotKey: d.toDateString(),
                    price: calculatePrice(null),
                })));
            } else {
                toast.warning(`Ngày ${dateString} đã có người đặt`);
            }
        } else if (rentalType === 'week') {
            const startDate = date;
            const endDate = addDays(startDate, 6);
            const weekRange = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

            await fetchAvailableSlots(weekRange, 'week');

            const isWeekAvailable = weekRange.every(day => {
                const dayKey = day.toDateString();
                return availableSlots[dayKey] === true;
            });

            if (!isWeekAvailable) {
                setSelectedDates(weekRange);
                setSummary([{
                    slotKey: `${startDate.toDateString()} - ${endDate.toDateString()}`,
                    price: calculatePrice(null),
                }]);
            } else {
                toast.warning('Một hoặc nhiều ngày trong tuần này đã có phòng đặt, vui lòng chọn tuần khác.');
            }
        } else if (rentalType === 'month') {
            const startDate = date;
            const endDate = addDays(startDate, 29);
            const monthRange = Array.from({ length: 30 }, (_, i) => addDays(startDate, i));

            await fetchAvailableSlots(monthRange, 'month');

            const isMonthAvailable = monthRange.every(day => {
                const dayKey = day.toDateString();
                return availableSlots[dayKey] === true;
            });

            if (!isMonthAvailable) {
                setSelectedDates(monthRange);
                setSummary([{
                    slotKey: `${startDate.toDateString()} - ${endDate.toDateString()}`,
                    price: calculatePrice(null),
                }]);
            } else {
                toast.warning('Một hoặc nhiều ngày trong tháng này đã có phòng đặt, vui lòng chọn tháng khác.');
            }
        }
    };

    const handleCreateBooking = async () => {
        try {
            const adjustedDates = selectedDates.map(date => {
                const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00.000Z`;
                return new Date(localDateStr);
            });
            const totalAmount = summary.reduce((acc, item) => acc + item.price, 0);
            const bookingData = {
                userId: userId,
                spaceId: id,
                rentalType: rentalType,
                startDate: adjustedDates[0], // Ngày đầu tiên trong mảng
                endDate: adjustedDates[adjustedDates.length - 1], // Ngày cuối cùng trong mảng
                selectedSlots: selectedSlots.map(slot => {
                    const [datePart, timePart] = slot.split(' - [');
                    const [startTime, endTime] = timePart.replace(']', '').split(' - ');
                    const dateObj = new Date(datePart);
                    const localDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}T00:00:00.000Z`;

                    return { date: localDateStr, startTime, endTime };
                }),
                selectedDates: adjustedDates,
                status: 'awaiting payment',
                notes: 'Đặt phòng mới',
                totalAmount
            };

            console.log("bookingData >>", bookingData);

            const response = await createBooking(bookingData);
            toast.success('Đặt địa điểm thành công.');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // Nếu có xung đột ngày/slot, thông báo cho người dùng
                toast.warning("Lịch bạn chọn đã có người đặt trước. Vui lòng chọn ngày hoặc slot khác.");
            } else {
                console.error("Error creating booking:", error.response ? error.response.data : error.message);
                toast.error('Lỗi khi đặt địa điểm.');
            }
        }
    };

    // Xử lý chọn hoặc bỏ chọn khung giờ
    const handleTimeSlotSelection = (date, slotStartTime, slotEndTime) => {
        const slotKey = `${date.toDateString()} - [${slotStartTime} - ${slotEndTime}]`;
        if (selectedSlots.includes(slotKey)) {
            // Nếu đã chọn, bỏ chọn khung giờ
            setSelectedSlots(selectedSlots.filter(s => s !== slotKey));
            setSummary(summary.filter(item => item.slotKey !== slotKey));

            const remainingSlotsForDate = selectedSlots.filter(s => s.startsWith(date.toDateString()));
            if (remainingSlotsForDate.length === 1) {
                setSelectedDates(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
            }
        } else {
            // Chọn mới khung giờ
            setSelectedSlots([...selectedSlots, slotKey]);
            const priceInfo = calculatePrice(slotStartTime); // Tính giá cho slot này
            console.log("priceInfo", priceInfo);

            setSummary([
                ...summary,
                {
                    slotKey,
                    price: priceInfo?.isGolden ? priceInfo.basePrice : priceInfo,
                    isGolden: priceInfo?.isGolden,
                    priceIncrease: goldenHour?.priceIncrease // Lưu mức tăng giá trong thời gian khung giờ vàng (nếu có)
                }
            ]);
        }
    };




    const handleRemoveSlot = (slotKey) => {
        setSelectedSlots(selectedSlots.filter(s => s !== slotKey));
        setSummary(summary.filter(item => item.slotKey !== slotKey));

        const dateStr = slotKey.split(" - ")[0];

        // Điều chỉnh logic để xoá ngày khỏi selectedDates nếu chọn theo "day"
        if (rentalType === 'day') {
            // Xoá ngày khỏi selectedDates
            setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateStr));
        } else {
            // Cho các rental type khác, kiểm tra remainingSlotsForDate như trước
            const remainingSlotsForDate = selectedSlots.filter(s => s.startsWith(dateStr));
            if (remainingSlotsForDate.length === 1) {
                setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateStr));
            }
        }
    };



    return (
        <Container>
            <Row>
                <Col md={12} align='center'>
                    <Typography variant="h5" align="center" gutterBottom>Chọn cách thức thuê</Typography>
                    <FormControl component="fieldset" align="center">
                        <RadioGroup row value={rentalType} onChange={handleRentalTypeChange}>
                            <FormControlLabel value="hour" control={<Radio />} label="Theo giờ" />
                            <FormControlLabel value="day" control={<Radio />} label="Theo ngày" />
                            <FormControlLabel value="week" control={<Radio />} label="Theo tuần" />
                            <FormControlLabel value="month" control={<Radio />} label="Theo tháng" />
                        </RadioGroup>
                    </FormControl>
                </Col>
                <Col md={6} align='center' style={{ paddingTop: '10px' }}>
                    <Typography variant="h6">Chọn ngày và khung giờ</Typography>
                    <Calendar
                        onChange={handleDateChange}
                        selectRange={false} // Không bật range, chọn ngày bắt đầu và tự động tính toán
                        value={selectedDates}
                        tileDisabled={({ date }) => {
                            // Vô hiệu hóa các ngày đã qua cho tất cả các kiểu thuê
                            return date < new Date();
                        }}
                        showDoubleView={true}
                        tileClassName={({ date }) =>
                            selectedDates.some(d => d.toDateString() === date.toDateString()) ? 'selected' : ''
                        }
                    />

                    {rentalType === 'hour' && selectedDates.length > 0 && (
                        selectedDates.map((date, idx) => (
                            <Box key={idx} mt={3}>
                                <Typography variant="subtitle1">{date.toDateString()}</Typography>
                                <Grid container justifyContent="center" spacing={1} mt={1}>
                                    {Array.isArray(availableSlots[date.toDateString()]) ? (
                                        availableSlots[date.toDateString()].map((slot, index) => (
                                            <Grid item key={index}>
                                                <Button
                                                    variant={selectedSlots.includes(`${date.toDateString()} - [${slot.startTime} - ${slot.endTime}]`) ? 'contained' : 'outlined'}
                                                    onClick={() => handleTimeSlotSelection(date, slot.startTime, slot.endTime)}
                                                    style={{ margin: '5px' }}
                                                >
                                                    {slot.startTime} - {slot.endTime}
                                                </Button>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography>Ngày này đã được đặt hoặc không có slot khả dụng</Typography>
                                    )}

                                </Grid>
                            </Box>
                        ))
                    )}

                </Col>
                <Col md={6} align="center" style={{ paddingTop: '10px' }}>
                    <Typography variant="h6">Danh sách đã chọn</Typography>
                    <Paper elevation={3} style={{ maxWidth: '500px', margin: '20px auto', padding: '10px' }}>
                        <List>
                            {summary.length > 0 ? (
                                <>
                                    {summary.map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={item.slotKey}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: 'text.primary', display: 'inline' }}
                                                        >
                                                            {priceFormatter(item.price)} vnđ
                                                        </Typography>
                                                        {item?.isGolden && item?.priceIncrease
                                                            ? ` - Khung giờ vàng (+${item?.priceIncrease}%)`
                                                            : ""
                                                        }
                                                    </React.Fragment>
                                                    // `Giá: ${priceFormatter(item.price)} vnđ ${(!!goldenHour?.checkGoldenHour && item?.isGolden) ?
                                                    //     `(+${goldenHour?.priceIncrease}%)`
                                                    //     : ""
                                                    // }`
                                                }
                                            />
                                            <IconButton edge="end" onClick={() => handleRemoveSlot(item.slotKey)}>
                                                <Delete />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                    <Button
                                        onClick={() => handleCreateBooking()}
                                    >
                                        Đặt Phòng
                                    </Button>
                                </>
                            ) : (
                                <Typography>Chưa chọn lịch</Typography>
                            )}
                        </List>
                        <Typography variant="h6">
                            Tổng: {priceFormatter(summary.reduce((acc, item) => acc + item.price, 0))} VND
                        </Typography>
                    </Paper>
                </Col>
            </Row>
        </Container >
    );
};

export default BookingForm;