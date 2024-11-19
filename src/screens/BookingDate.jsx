import React, { useEffect, useState } from 'react';
// import Calendar from 'react-calendar';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  checkDayAvailability,
  checkHourAvailability,
  createBooking,
} from '../Api/BookingRequests';
import { priceFormatter } from '../utils/numberFormatter';

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import cloneDeep from 'lodash/cloneDeep';
import { Calendar } from 'react-multi-date-picker';

dayjs.locale('vi');
dayjs.extend(customParseFormat);

const vietnamese_lowercase = {
  name: 'vietnamese_lowercase',
  months: [
    ['Tháng 1', 'Thg 1'],
    ['Tháng 2', 'Thg 2'],
    ['Tháng 3', 'Thg 3'],
    ['Tháng 4', 'Thg 4'],
    ['Tháng 5', 'Thg 5'],
    ['Tháng 6', 'Thg 6'],
    ['Tháng 7', 'Thg 7'],
    ['Tháng 8', 'Thg 8'],
    ['Tháng 9', 'Thg 9'],
    ['Tháng 10', 'Thg 10'],
    ['Tháng 11', 'Thg 11'],
    ['Tháng 12', 'Thg 12'],
  ],
  weekDays: [
    ['Thứ Bảy', 'T7'],
    ['Chủ Nhật', 'CN'],
    ['Thứ Hai', 'T2'],
    ['Thứ Ba', 'T3'],
    ['Thứ Tư', 'T4'],
    ['Thứ Năm', 'T5'],
    ['Thứ Sáu', 'T6'],
  ],
  digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  meridiems: [
    ['SA', 'sa'],
    ['CH', 'ch'],
  ],
};

const BookingForm = () => {
  const { id } = useParams();
  const [spaceData, setSpaceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [rentalType, setRentalType] = useState('hour');
  const [summary, setSummary] = useState([]);
  // const [goldenHour, setGoldenHour] = useState({});
  const [availableSlots, setAvailableSlots] = useState({});
  const userId = localStorage.getItem('userId');

  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedFirstDayMonths, setSelectedFirstDayMonths] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const nav = useNavigate()
  const [selectedWeeks, setSelectedWeeks] = useState({});

  const {
    pricePerHour,
    pricePerDay,
    pricePerWeek,
    pricePerMonth,
    goldenHourDetails,
  } = spaceData;

  useEffect(() => {
    fetchSpaceData();
  }, []);

  const fetchSpaceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9999/spaces/${id}`);
      setSpaceData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pricePerHour > 0) {
      setRentalType('hour')
      return
    }
    if (pricePerDay > 0) {
      setRentalType('day')
      return
    }
    if (pricePerWeek > 0) {
      setRentalType('week')
      return
    }
    if (pricePerMonth > 0) {
      setRentalType('month')
      return
    }
  }, [pricePerHour, pricePerDay, pricePerWeek, pricePerMonth])

  const fetchAvailableSlots = async (dates, newRentalType) => {
    return new Promise(async (resolve, reject) => {
      try {
        const formattedDates = dates.map((date) => date.toISOString());

        let response;
        let body = {
          spaceId: id,
          dates: formattedDates,
        };
        if (newRentalType === 'hour' || newRentalType === 'day') {
          // Gọi API checkHourAvailability cho thuê theo giờ và ngày
          response = await checkHourAvailability({ ...body, rentalType: newRentalType });

          if (newRentalType === 'hour') {
            if (!response.data?.availableSlots || response.data.availableSlots.filter(slot => slot?.isAvailable).length < 1) {
              toast.warning(`Đã có người đặt`);
            }
          }
        } else {
          // Gọi API checkDayAvailability cho thuê theo tuần và tháng
          response = await checkDayAvailability(body);
        }

        const newAvailableSlots = (response.data.availableSlots || []).reduce(
          (acc, slotInfo) => {
            const dayKey = dayjs(slotInfo.date).format('dddd, D MMMM YYYY');
            // console.log('120 dayKey ===>', { dayKey });
            if (newRentalType === 'hour') {
              acc[dayKey] = slotInfo.slots || [];
            } else {
              acc[dayKey] =
                slotInfo.isAvailable !== undefined
                  ? slotInfo.isAvailable
                  : true;
            }
            return acc;
          },
          {}
        );

        setAvailableSlots(newAvailableSlots);

        resolve(newAvailableSlots);
      } catch (error) {
        console.error('Error fetching available slots', error);
        reject(error);
      }
    });
  };

  const handleRentalTypeChange = async (event) => {
    const newRentalType = event.target.value;
    setRentalType(newRentalType);

    // reset all data
    setSelectedDates([]);
    setSelectedFirstDayMonths([]);

    setAvailableSlots({});
    setSelectedWeeks({});

    setSelectedSlots([]);
    setSummary([]);

    /* Xuất lý thay đổi rentalType
    // Gọi fetchAvailableSlots khi đổi rentalType để cập nhật danh sách khả dụng
    const today = new Date();
    if (
      newRentalType === 'day' ||
      newRentalType === 'week' ||
      newRentalType === 'month'
    ) {
      const datesToFetch = Array.from({ length: 30 }, (_, i) =>
        addDays(today, i)
      ); 
      // Lấy 30 ngày từ hôm nay
      await fetchAvailableSlots(datesToFetch, newRentalType);
    }*/
  };

  // const isGoldenHour = (time) => {
  //   if (!spaceData || !spaceData.isGoldenHour) return false;
  //   if (!time) return false;
  //   const { startTime, endTime } = spaceData.goldenHourDetails;

  //   // Tạo các đối tượng Date cho startTime, endTime và time để so sánh
  //   const [startHour, startMinute] = startTime?.split(':').map(Number);
  //   const [endHour, endMinute] = endTime?.split(':').map(Number);
  //   const [timeHour, timeMinute] = time?.split(':').map(Number);

  //   const start = new Date();
  //   start.setHours(startHour, startMinute, 0, 0);

  //   const end = new Date();
  //   end.setHours(endHour, endMinute, 0, 0);

  //   const currentTime = new Date();
  //   currentTime.setHours(timeHour, timeMinute, 0, 0);

  //   return currentTime >= start && currentTime < end;
  // };

  // const isGoldenHourV2 = ({ slotStartTime, slotEndTime }) => {
  //   if (!spaceData || !spaceData.isGoldenHour) return false;
  //   if (!slotStartTime || !slotEndTime) return false;
  //   const { startTime, endTime } = spaceData.goldenHourDetails;

  //   // Tạo các đối tượng Date cho startTime, endTime và time để so sánh
  //   const [startHour, startMinute] = startTime?.split(':').map(Number);
  //   const [endHour, endMinute] = endTime?.split(':').map(Number);
  //   const [timeHour, timeMinute] = time?.split(':').map(Number);

  //   const start = new Date();
  //   start.setHours(startHour, startMinute, 0, 0);

  //   const end = new Date();
  //   end.setHours(endHour, endMinute, 0, 0);

  //   const currentTime = new Date();
  //   currentTime.setHours(timeHour, timeMinute, 0, 0);

  //   return currentTime >= start && currentTime < end;
  // };

  // const checkGoldenHour = ({ startTime, endTime }) => {
  //   if (!spaceData || !spaceData.isGoldenHour) return false;

  //   const { startTime: goldenStartTime, endTime: goldenEndTime } =
  //     spaceData.goldenHourDetails;

  //   const returnValue =
  //     startTime === goldenStartTime && endTime === goldenEndTime ? true : false;

  //   console.log('203 ============>', {
  //     goldenEndTime,
  //     goldenStartTime,
  //     startTime,
  //     endTime,
  //     returnValue,
  //   });

  //   return returnValue;
  // };

  const checkGoldenHourV2 = ({ slotStartTime, slotEndTime }) => {
    if (!spaceData || !spaceData.isGoldenHour) return false;

    // const { startTime: goldenStartTime, endTime: goldenEndTime } =
    //   spaceData.goldenHourDetails;

    // const returnValue =
    //   startTime === goldenStartTime && endTime === goldenEndTime ? true : false;

    const returnValue = spaceData.goldenHourDetails
      ? spaceData.goldenHourDetails.some((item, index) => {
          return (
            item.startTime === slotStartTime && item.endTime === slotEndTime
          );
        })
      : false;

    // console.log('203 ============>', {
    //   goldenEndTime,
    //   goldenStartTime,
    //   startTime,
    //   endTime,
    //   returnValue,
    // });

    return returnValue;
  };

  // const calculatePrice = (time) => {
  //   if (!spaceData) return 0;
  //   const {
  //     pricePerHour,
  //     pricePerDay,
  //     pricePerWeek,
  //     pricePerMonth,
  //     goldenHourDetails,
  //   } = spaceData;

  //   let checkGoldenHour = isGoldenHour(time);

  //   setGoldenHour({
  //     checkGoldenHour: checkGoldenHour,
  //     priceIncrease: goldenHourDetails?.priceIncrease,
  //   });

  //   if (rentalType === 'hour') {
  //     const basePrice = checkGoldenHour
  //       ? pricePerHour * (1 + goldenHourDetails?.priceIncrease / 100)
  //       : pricePerHour;
  //     return !!checkGoldenHour
  //       ? { basePrice: basePrice, isGolden: !!checkGoldenHour }
  //       : basePrice;
  //   } else if (rentalType === 'day') {
  //     return pricePerDay;
  //   } else if (rentalType === 'week') {
  //     return pricePerWeek;
  //   } else {
  //     return pricePerMonth;
  //   }
  // };

  const calculatePriceV2 = ({ slotStartTime, slotEndTime }) => {
    if (!spaceData) return 0;

    // let checkGoldenHour = isGoldenHourV2({ slotStartTime, slotEndTime });
    const checkGoldenHour = checkGoldenHourV2({ slotStartTime, slotEndTime });

    const priceIncrease = goldenHourDetails
      ? goldenHourDetails.find((item) => {
          return (
            item.startTime === slotStartTime && item.endTime === slotEndTime
          );
        })?.priceIncrease
      : 0;

    // setGoldenHour({
    //   checkGoldenHour,
    //   priceIncrease,
    // });

    if (rentalType === 'hour') {
      const basePrice = checkGoldenHour
        ? pricePerHour * (1 + priceIncrease / 100)
        : pricePerHour;
      return !!checkGoldenHour
        ? { basePrice: basePrice, isGolden: !!checkGoldenHour, priceIncrease }
        : basePrice;
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

  const handleChangeCalendarValue = async (date) => {
    // console.log('264 handleChangeCalendarValue ===>', { date });
    const dateConvert = date.map((item, index) => {
      return new Date(item);
    });

    // console.log('312 handleChangeCalendarValue ===>', {
    //   dateConvert: dayjs(dateConvert).month(),
    //   daysInMonth: dayjs(dateConvert).daysInMonth(),
    // });

    switch (rentalType) {
      case 'hour': {
        if (dateConvert.length > 0) {
          setSelectedDates(dateConvert);
          await fetchAvailableSlots(dateConvert, 'hour');
        } else {
          setSelectedDates([]);
          setSummary([]);
          setSelectedSlots([]);
        }

        break;
      }
      case 'day': {
        if (dateConvert.length > 0) {
          const dateString = dayjs(
            dateConvert[dateConvert.length - 1].toDateString()
          ).format('dddd, D MMMM YYYY');

          const newAvailableSlots = await fetchAvailableSlots(
            dateConvert,
            'day'
          );

          // const allDaysAvailable = dateConvert.every((d) => {
          //   const dayKey = dayjs(d.toDateString()).format('dddd, D MMMM YYYY');
          //   return availableSlots[dayKey] === true;
          // });

          // if (!allDaysAvailable) {
          if (
            Object.keys(newAvailableSlots).length > 0 &&
            newAvailableSlots[dateString]
          ) {
            setSelectedDates(dateConvert);
            setSummary(
              dateConvert.map((d) => ({
                slotKey: dayjs(d.toDateString()).format('dddd, D MMMM YYYY'),
                price: calculatePriceV2({
                  slotStartTime: null,
                  slotEndTime: null,
                }),
              }))
            );
          } else {
            setSelectedDates([...selectedDates, ...[]]);

            toast.warning(`Ngày ${dateString} đã có người đặt`);
          }
        } else {
          setSelectedDates([]);
          setSummary([]);
        }

        break;
      }

      default: {
        return;
      }
    }
  };

  const handleCreateBooking = async () => {
    try {
      const adjustedDates = selectedDates.map((date) => {
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
        selectedSlots: selectedSlots.map((slot) => {
          const [datePart, timePart] = slot.selectedSlot.split(' - [');
          const [startTime, endTime] = timePart.replace(']', '').split(' - ');
          //   const dateObj = new Date(dayjs(datePart).format('dddd, D MMMM YYYY'));
          const dateObj = new Date(datePart);

          const localDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}T00:00:00.000Z`;

          return { date: localDateStr, startTime, endTime };
        }),
        selectedDates: adjustedDates,
        status: 'awaiting payment',
        notes: 'Đặt phòng mới',
        totalAmount,
      };

      console.log('bookingData >>', bookingData);

      const response = await createBooking(bookingData);
      toast.success('Đặt địa điểm thành công.');
      nav('/history')
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Nếu có xung đột ngày/slot, thông báo cho người dùng
        toast.warning(
          "Lịch bạn chọn đã có người đặt trước. Vui lòng chọn ngày hoặc slot khác."
        );
      } else {
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
        toast.error(errorMessage);
      }
    }
  };

  // Xử lý chọn hoặc bỏ chọn khung giờ
  // const handleTimeSlotSelection = (date, slotStartTime, slotEndTime) => {
  //   const slotKey = `${date.toDateString()} - [${slotStartTime} - ${slotEndTime}]`;
  //   const slotKeyConvert = `${dayjs(date.toDateString()).format('dddd, D MMMM YYYY')} - [${slotStartTime} - ${slotEndTime}]`;
  //   if (selectedSlots.includes(slotKey)) {
  //     // Nếu đã chọn, bỏ chọn khung giờ
  //     setSelectedSlots(selectedSlots.filter((s) => s !== slotKey));
  //     setSummary(summary.filter((item) => item.slotKey !== slotKeyConvert));

  //     const remainingSlotsForDate = selectedSlots.filter((s) =>
  //       s.startsWith(date.toDateString())
  //     );
  //     if (remainingSlotsForDate.length === 1) {
  //       setSelectedDates(
  //         selectedDates.filter(
  //           (d) =>
  //             dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !==
  //             dayjs(date.toDateString()).format('dddd, D MMMM YYYY')
  //         )
  //       );
  //     }
  //   } else {
  //     // Chọn mới khung giờ
  //     setSelectedSlots([...selectedSlots, slotKey]);
  //     const priceInfo = calculatePrice(slotStartTime); // Tính giá cho slot này
  //     console.log('priceInfo', priceInfo);

  //     setSummary([
  //       ...summary,
  //       {
  //         slotKey: slotKeyConvert,
  //         price: priceInfo?.isGolden ? priceInfo.basePrice : priceInfo,
  //         isGolden: priceInfo?.isGolden,
  //         priceIncrease: goldenHour?.priceIncrease, // Lưu mức tăng giá trong thời gian khung giờ vàng (nếu có)
  //       },
  //     ]);
  //   }
  // };

  // const handleRemoveSlot = ({ slotKey, week }) => {
  //   setSelectedSlots(selectedSlots.filter((s) => s !== slotKey));
  //   setSummary(summary.filter((item) => item.slotKey !== slotKey));

  //   const dateStr = slotKey.split(' - ')[0];

  //   // Điều chỉnh logic để xoá ngày khỏi selectedDates nếu chọn theo "day"
  //   if (rentalType === 'day') {
  //     // Xoá ngày khỏi selectedDates
  //     setSelectedDates(
  //       selectedDates.filter(
  //         (d) => dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
  //       )
  //     );
  //   } else if (rentalType === 'hour') {
  //     // Cho các rental type khác, kiểm tra remainingSlotsForDate như trước
  //     const remainingSlotsForDate = selectedSlots.filter((s) =>
  //       s.startsWith(dateStr)
  //     );
  //     if (remainingSlotsForDate.length === 1) {
  //       setSelectedDates(
  //         selectedDates.filter(
  //           (d) =>
  //             dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
  //         )
  //       );
  //     }
  //   } else if (rentalType === 'month') {
  //     // Cho các rental type khác, kiểm tra remainingSlotsForDate như trước
  //     //   const remainingSlotsForDate = selectedSlots.filter((s) =>
  //     //     s.startsWith(dateStr)
  //     //   );
  //     //   if (remainingSlotsForDate.length === 1) {
  //     setSelectedDates(
  //       selectedDates.filter(
  //         (d) => dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
  //       )
  //     );

  //     setSelectedFirstDayMonths(
  //       selectedFirstDayMonths.filter(
  //         (d) => dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
  //       )
  //     );
  //     //   }
  //   } else if (rentalType === 'week') {
  //     setSelectedDates(
  //       selectedDates.filter(
  //         (d) => dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
  //       )
  //     );

  //     setSelectedFirstDayMonths(
  //       selectedFirstDayMonths.filter(
  //         (d) => dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
  //       )
  //     );

  //     if (week.name) {
  //     }
  //   }
  // };

  const handleRemoveSummary = ({ slotKey, weekObject, firstDayOfMonth }) => {
    // const selectedSlotConvert = selectedSlots.map((item) => {
    //   const dateStr = item.split(' - ')[0];
    //   const slotTime = item.split(' - ')[1] + ' - ' + item.split(' - ')[2];

    //   const temp =
    //     dayjs(dateStr).format('dddd, D MMMM YYYY') + ' - ' + slotTime;

    //   return {
    //     selectedSlot: item,
    //     selectedSlotConvert: temp,
    //   };
    // });

    // const selectedSlotUpdate = selectedSlotConvert
    //   .filter((s) => s.selectedSlotConvert !== slotKey)
    //   .map((item) => item.selectedSlot);

    switch (rentalType) {
      case 'hour': {
        const dateStr = slotKey.split(' - ')[0];

        setSelectedSlots(
          selectedSlots.filter((s) => s.selectedSlotConvert !== slotKey)
        );

        const countSlotForDate = selectedSlots.filter((s) =>
          s.selectedSlotConvert.startsWith(dateStr)
        );
        if (countSlotForDate.length === 1) {
          setSelectedDates(
            selectedDates.filter(
              (d) =>
                dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
            )
          );
        }

        setSummary(summary.filter((item) => item.slotKey !== slotKey));

        break;
      }
      case 'day': {
        const dateStr = slotKey.split(' - ')[0];

        setSelectedSlots(
          selectedSlots.filter((s) => s.selectedSlotConvert !== slotKey)
        );

        setSummary(summary.filter((item) => item.slotKey !== slotKey));

        setSelectedDates(
          selectedDates.filter(
            (d) =>
              dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
          )
        );

        break;
      }
      case 'week': {
        const daysInMonth = dayjs(firstDayOfMonth.toDateString()).daysInMonth();
        const tempMonth = dayjs(firstDayOfMonth.toDateString()).month();
        const tempYear = dayjs(firstDayOfMonth.toDateString()).year();

        const startDate = new Date(firstDayOfMonth.toDateString());
        const endDate = addDays(startDate, daysInMonth - 1);

        const tempMonthRange = Array.from({ length: daysInMonth }, (_, i) =>
          addDays(startDate, i)
        );

        const tempSelectedDatesFilter = selectedDates.filter((item, index) => {
          return (
            tempMonthRange
              .map((i) => i.toDateString())
              .indexOf(item.toDateString()) === -1
          );
        });

        setSelectedDates([...tempSelectedDatesFilter]);

        const tempSelectedWeek = cloneDeep(selectedWeeks);

        const newSelectedWeekName = tempSelectedWeek[
          firstDayOfMonth
        ].weekName.filter((item) => {
          return item !== weekObject.name;
        });

        tempSelectedWeek[firstDayOfMonth].weekName = newSelectedWeekName;

        setSummary(summary.filter((item) => item.slotKey !== slotKey));

        const countTotalShowWeek =
          selectedWeeks[firstDayOfMonth].weekName.length;

        // if only chose 1 week value before
        if (countTotalShowWeek === 1) {
          delete tempSelectedWeek[firstDayOfMonth];

          const tempReturnMonth = selectedFirstDayMonths.filter((item) => {
            return item.toDateString() !== firstDayOfMonth.toDateString();
          });
          setSelectedFirstDayMonths([...tempReturnMonth]);
        }

        setSelectedWeeks(tempSelectedWeek);

        break;
      }
      case 'month': {
        const daysInMonth = dayjs(firstDayOfMonth.toDateString()).daysInMonth();
        const tempMonth = dayjs(firstDayOfMonth.toDateString()).month();
        const tempYear = dayjs(firstDayOfMonth.toDateString()).year();

        const startDate = new Date(firstDayOfMonth.toDateString());
        const endDate = addDays(startDate, daysInMonth - 1);

        const tempMonthRange = Array.from({ length: daysInMonth }, (_, i) =>
          addDays(startDate, i)
        );

        const tempSeletedDatesFilter = selectedDates.filter((item, index) => {
          return (
            tempMonthRange
              .map((i) => i.toDateString())
              .indexOf(item.toDateString()) === -1
          );
        });

        setSelectedDates([...tempSeletedDatesFilter]);
        setSelectedFirstDayMonths(
          selectedFirstDayMonths.filter(
            (d) => d.toDateString() !== startDate.toDateString()
          )
        );
        setSummary(summary.filter((item) => item.slotKey !== slotKey));

        break;
      }
      default: {
        return;
      }
    }
  };

  const handleWeekSlotSelection = async ({ firstDayOfMonth, weekObject }) => {
    if (isExpiredDayInWeek({ firstDayOfMonth, weekObject })) {
      toast.error('Tuần đã quá ngày để đặt !!!');

      return;
    }
    if (
      Object.keys(selectedWeeks).length > 0 &&
      selectedWeeks[firstDayOfMonth].weekName.includes(weekObject.name)
    ) {
      setSelectedWeeks((selectedWeeks) => {
        const tempWeek = selectedWeeks[firstDayOfMonth].weekName.filter(
          (item) => {
            return item !== weekObject.name;
          }
        );

        const tempSelectedWeek = {};

        tempSelectedWeek[firstDayOfMonth] = {
          weekName: [...tempWeek],
          weekList: [...selectedWeeks[firstDayOfMonth].weekList],
        };

        return { ...selectedWeeks, ...tempSelectedWeek };
      });

      const tempMonth = dayjs(firstDayOfMonth).month();
      const tempYear = dayjs(firstDayOfMonth).year();

      const firstDayOfWeek = dayjs()
        .month(tempMonth)
        .year(tempYear)
        .startOf('month')
        .add(weekObject.value - 1, 'week')
        .startOf('week');

      const dateStringConvert = dayjs(new Date(firstDayOfWeek)).format(
        'dddd, D MMMM YYYY'
      );

      setSummary(
        summary.filter((item) => {
          return !item.slotKey.startsWith(dateStringConvert);
        })
      );

      const countTotalShowWeek = selectedWeeks[firstDayOfMonth].weekName.length;

      // if only chose 1 week value before
      if (countTotalShowWeek === 1) {
        const tempReturnMonth = selectedFirstDayMonths.filter((item) => {
          return item.toDateString() !== firstDayOfMonth.toDateString();
        });
        setSelectedFirstDayMonths([...tempReturnMonth]);
      }

      return;
    }

    const tempMonth = dayjs(firstDayOfMonth).month();
    const tempYear = dayjs(firstDayOfMonth).year();

    const firstDayOfWeek = dayjs()
      .month(tempMonth)
      .year(tempYear)
      .startOf('month')
      .add(weekObject.value - 1, 'week')
      .startOf('week');

    const endDayOfWeek = new Date(firstDayOfWeek.endOf('week'));

    const firstDayOfWeekConvert = new Date(firstDayOfWeek);
    const endDayOfWeekConvert = new Date(endDayOfWeek);

    const tempSummary = {
      slotKey: `${dayjs(firstDayOfWeekConvert.toDateString()).format('dddd, D MMMM YYYY')} - ${dayjs(endDayOfWeekConvert.toDateString()).format('dddd, D MMMM YYYY')}`,
      weekObject: weekObject,
      month: tempMonth,
      firstDayOfMonth,
      year: tempYear,
      price: calculatePriceV2({
        slotStartTime: null,
        slotEndTime: null,
      }),
    };

    const tempMonthRange = Array.from({ length: 7 }, (_, i) =>
      addDays(firstDayOfWeekConvert, i)
    );

    const newAvailableSlots = await fetchAvailableSlots(
      tempMonthRange,
      'month'
    );

    const isMonthAvailable = tempMonthRange.every((day) => {
      const dayKey = dayjs(day.toDateString()).format('dddd, D MMMM YYYY');
      return newAvailableSlots[dayKey] === true;
    });

    if (isMonthAvailable) {
      setSelectedFirstDayMonths([...selectedFirstDayMonths, ...[]]);

      setSelectedWeeks((selectedWeeks) => {
        const tempSelectedWeek = {};
        tempSelectedWeek[firstDayOfMonth] = {
          weekName: [
            ...selectedWeeks[firstDayOfMonth].weekName,
            weekObject.name,
          ],
          weekList: [...selectedWeeks[firstDayOfMonth].weekList],
        };

        return { ...selectedWeeks, ...tempSelectedWeek };
      });

      setSelectedDates([...selectedDates, ...tempMonthRange]);
      setSummary([...summary, ...[tempSummary]]);
    } else {
      setSelectedFirstDayMonths([...selectedFirstDayMonths, ...[]]);

      toast.warning(
        'Một hoặc nhiều ngày trong tuần này đã có phòng đặt, vui lòng chọn tuần khác.'
      );
    }
  };

  const handleChangeCalendarOnlyMonthValue = async (date) => {
    // console.log(
    //   '--------------------------------------------------------------------'
    // );
    // console.log('264 handleChangeCalendarValue ===>', { date });
    const dateConvert = date.map((item, index) => {
      const convert = new Date(item);

      //   console.log('312 handleChangeCalendarValue ===>', {
      //     convert,
      //     dateConvert: dayjs(item).month(),
      //     daysInMonth: dayjs(item).daysInMonth(),
      // });
      return convert;
    });

    switch (rentalType) {
      case 'week': {
        if (dateConvert.length > 0) {
          let dateString = '';

          if (dateConvert.length > selectedFirstDayMonths.length) {
            dateString = dateConvert[dateConvert.length - 1].toDateString();
          } else {
            const removeDateMonth = selectedFirstDayMonths.find(
              (item, index) => {
                return (
                  dateConvert
                    .map((item, index) => {
                      return item.toDateString();
                    })
                    .indexOf(item.toDateString()) === -1
                );
              }
            );

            dateString = removeDateMonth.toDateString();
          }

          const daysInMonth = dayjs(dateString).daysInMonth();
          const tempMonth = dayjs(dateString).month();
          const tempYear = dayjs(dateString).year();

          const startDate = new Date(dateString);
          const endDate = addDays(startDate, daysInMonth - 1);

          // const tempSummary = {
          //   slotKey: `${dayjs(startDate.toDateString()).format('dddd, D MMMM YYYY')} - ${dayjs(endDate.toDateString()).format('dddd, D MMMM YYYY')}`,
          //   price: calculatePriceV2({
          //     slotStartTime: null,
          //     slotEndTime: null,
          //   }),
          // };

          const tempMonthRange = Array.from({ length: daysInMonth }, (_, i) =>
            addDays(startDate, i)
          );

          if (dateConvert.length > selectedFirstDayMonths.length) {
            const newAvailableSlots = await fetchAvailableSlots(
              tempMonthRange,
              'month'
            );

            const isMonthAvailable = tempMonthRange.some((day) => {
              const dayKey = dayjs(day.toDateString()).format(
                'dddd, D MMMM YYYY'
              );
              return newAvailableSlots[dayKey] === true;
            });

            if (isMonthAvailable) {
              const allWeeks = [
                { value: 1, name: 'Tuần thứ 1' },
                { value: 2, name: 'Tuần thứ 2' },
                { value: 3, name: 'Tuần thứ 3' },
                { value: 4, name: 'Tuần thứ 4' },
              ];

              const tempSelectedWeek = {};
              tempSelectedWeek[startDate] = {
                weekList: allWeeks,
                weekName: [],
              };

              setSelectedWeeks({ ...selectedWeeks, ...tempSelectedWeek });

              setSelectedFirstDayMonths([
                ...selectedFirstDayMonths,
                ...[startDate],
              ]);
            } else {
              setSelectedFirstDayMonths([...selectedFirstDayMonths, ...[]]);

              toast.warning(
                'Tất cả các ngày trong tháng này đã có phòng đặt, vui lòng chọn tháng khác.'
              );
            }
          } else {
            const tempSelectedMonthFilter = selectedFirstDayMonths.filter(
              (item, index) => {
                return item.toDateString() !== startDate.toDateString();
              }
            );
            const tempSummaryFilter = summary.filter((item, index) => {
              return !item.slotKey.includes(`${tempMonth + 1} ${tempYear}`);
            });
            const tempSeletedDatesFilter = selectedDates.filter(
              (item, index) => {
                return (
                  tempMonthRange
                    .map((i) => i.toDateString())
                    .indexOf(item.toDateString()) === -1
                );
              }
            );

            delete selectedWeeks[startDate];

            setSelectedWeeks(selectedWeeks);

            setSelectedFirstDayMonths([...tempSelectedMonthFilter]);
            setSummary([...tempSummaryFilter]);
            setSelectedDates([...tempSeletedDatesFilter]);
          }
        } else {
          setSelectedFirstDayMonths([]);
          setSummary([]);
          setSelectedWeeks({});
        }

        break;
      }
      case 'month': {
        if (dateConvert.length > 0) {
          let dateString = '';

          if (dateConvert.length > selectedFirstDayMonths.length) {
            dateString = dateConvert[dateConvert.length - 1].toDateString();
          } else {
            const removeDateMonth = selectedFirstDayMonths.find(
              (item, index) => {
                return (
                  dateConvert
                    .map((item, index) => {
                      return item.toDateString();
                    })
                    .indexOf(item.toDateString()) === -1
                );
              }
            );

            dateString = removeDateMonth.toDateString();
          }

          const daysInMonth = dayjs(dateString).daysInMonth();
          const tempMonth = dayjs(dateString).month();

          const startDate = new Date(dateString);
          const endDate = addDays(startDate, daysInMonth - 1);

          const tempSummary = {
            slotKey: `${dayjs(startDate.toDateString()).format('dddd, D MMMM YYYY')} - ${dayjs(endDate.toDateString()).format('dddd, D MMMM YYYY')}`,
            price: calculatePriceV2({
              slotStartTime: null,
              slotEndTime: null,
            }),
            firstDayOfMonth: startDate,
          };

          const tempMonthRange = Array.from({ length: daysInMonth }, (_, i) =>
            addDays(startDate, i)
          );

          if (dateConvert.length > selectedFirstDayMonths.length) {
            const newAvailableSlots = await fetchAvailableSlots(
              tempMonthRange,
              'month'
            );

            const isMonthAvailable = tempMonthRange.every((day) => {
              const dayKey = dayjs(day.toDateString()).format(
                'dddd, D MMMM YYYY'
              );
              return newAvailableSlots[dayKey] === true;
            });

            if (isMonthAvailable) {
              setSelectedFirstDayMonths([
                ...selectedFirstDayMonths,
                ...[startDate],
              ]);

              setSelectedDates([...selectedDates, ...tempMonthRange]);
              setSummary([...summary, ...[tempSummary]]);
            } else {
              setSelectedFirstDayMonths([...selectedFirstDayMonths, ...[]]);

              toast.warning(
                'Một hoặc nhiều ngày trong tháng này đã có phòng đặt, vui lòng chọn tháng khác.'
              );
            }
          } else {
            const tempSelectedMonthFilter = selectedFirstDayMonths.filter(
              (item, index) => {
                return item.toDateString() !== startDate.toDateString();
              }
            );
            const tempSummaryFilter = summary.filter((item, index) => {
              return item.slotKey !== tempSummary.slotKey;
            });
            const tempSeletedDatesFilter = selectedDates.filter(
              (item, index) => {
                return (
                  tempMonthRange
                    .map((i) => i.toDateString())
                    .indexOf(item.toDateString()) === -1
                );
              }
            );
            setSelectedFirstDayMonths([...tempSelectedMonthFilter]);
            setSummary([...tempSummaryFilter]);
            setSelectedDates([...tempSeletedDatesFilter]);
          }
        } else {
          setSelectedFirstDayMonths([]);
          setSummary([]);
          setSelectedDates([]);
        }

        break;
      }
      default: {
        break;
      }
    }
  };

  const handleTimeSlotSelectionV2 = ({ date, slotStartTime, slotEndTime }) => {
    if (isExpiredTimeInDay({ slotStartTime, slotEndTime, choiceDate: date })) {
      toast.error('Slot đã quá giờ để đặt !!!');

      return;
    }

    const slotKey = `${date.toDateString()} - [${slotStartTime} - ${slotEndTime}]`;
    const slotKeyConvert = `${dayjs(date.toDateString()).format('dddd, D MMMM YYYY')} - [${slotStartTime} - ${slotEndTime}]`;

    if (
      selectedSlots
        .map((item) => {
          return item.selectedSlot;
        })
        .includes(slotKey)
    ) {
      setSelectedSlots(selectedSlots.filter((s) => s.selectedSlot !== slotKey));
      setSummary(summary.filter((item) => item.slotKey !== slotKeyConvert));

      const countSlotForDate = selectedSlots.filter((s) =>
        s.selectedSlot.startsWith(date.toDateString())
      );

      if (countSlotForDate.length === 1) {
        setSelectedDates(
          selectedDates.filter(
            (d) =>
              dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !==
              dayjs(date.toDateString()).format('dddd, D MMMM YYYY')
          )
        );
      }
    } else {
      setSelectedSlots([
        ...selectedSlots,
        {
          selectedSlot: slotKey,
          selectedSlotConvert: slotKeyConvert,
        },
      ]);
      const priceInfo = calculatePriceV2({ slotStartTime, slotEndTime }); // Tính giá cho slot này
      console.log('866 show priceInfo ===>', { priceInfo });

      setSummary([
        ...summary,
        ...[
          {
            slotKey: slotKeyConvert,
            price: priceInfo?.isGolden ? priceInfo.basePrice : priceInfo,
            isGolden: priceInfo?.isGolden,
            priceIncrease: priceInfo?.priceIncrease, // Lưu mức tăng giá trong thời gian khung giờ vàng (nếu có)
          },
        ],
      ]);
    }
  };

  const isExpiredTimeInDay = ({ slotEndTime, slotStartTime, choiceDate }) => {
    const currentDate = dayjs().startOf('day');
    const dateToCompare = dayjs(choiceDate).startOf('day');

    if (dateToCompare.isBefore(currentDate)) {
      return true;
    }

    if (slotEndTime === '00:00' && !!!dateToCompare.isBefore(currentDate)) {
      return false;
    }

    const currentTime = dayjs();

    const startTimeToCompare = dayjs(
      currentTime.format('YYYY-MM-DD') + `T${slotStartTime}`
    );
    const endTimeToCompare = dayjs(
      currentTime.format('YYYY-MM-DD') + `T${slotEndTime}`
    );

    // console.log('1171 endTimeToCompare.isAfter(currentTime) ===>', {
    //   slotEndTime,
    //   slotStartTime,
    //   isAfter_endTimeToCompare: endTimeToCompare.isAfter(currentTime),
    //   isAfter_startTimeToCompare: startTimeToCompare.isAfter(currentTime),
    //   isBefore_startTimeToCompare: startTimeToCompare.isBefore(currentTime),
    //   isBefore_endTimeToCompare: endTimeToCompare.isBefore(currentTime),
    // });

    if (
      !!!endTimeToCompare.isAfter(currentTime) &&
      dateToCompare.isSame(currentDate, 'day')
    ) {
      return true;
    } else if (
      !!!startTimeToCompare.isBefore(currentTime) &&
      dateToCompare.isSame(currentDate, 'day')
    ) {
      return false;
    } else if (
      startTimeToCompare.isBefore(currentTime) &&
      dateToCompare.isSame(currentDate, 'day') &&
      !!!endTimeToCompare.isBefore(currentTime)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isExpiredDayInWeek = ({ firstDayOfMonth, weekObject }) => {
    const tempMonth = dayjs(firstDayOfMonth.toDateString()).month();
    const tempYear = dayjs(firstDayOfMonth.toDateString()).year();

    const startDayOfWeek = dayjs()
      .month(tempMonth)
      .year(tempYear)
      .startOf('month')
      .add(weekObject.value - 1, 'week')
      .startOf('week');

    const endDayOfWeek = new Date(startDayOfWeek.endOf('week'));

    // 1. Lấy ngày hiện tại (không bao gồm giờ phút)
    const currentDate = dayjs().startOf('day');

    // 2. Tạo đối tượng Day.js từ ngày cần so sánh (ví dụ: "2024-11-10")
    const startDateToCompare = dayjs(startDayOfWeek).startOf('day');
    const endDateToCompare = dayjs(endDayOfWeek).endOf('day');

    // 3. So sánh ngày
    if (!!!endDateToCompare.isAfter(currentDate)) {
      return true;
    } else if (!!!startDateToCompare.isBefore(currentDate)) {
      return false;
    } else if (
      startDateToCompare.isBefore(currentDate) &&
      endDateToCompare.isAfter(currentDate)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Container>
      <Row>
        <Col md={12} align="center">
          <Typography variant="h5" align="center" gutterBottom>
            Chọn cách thức thuê
          </Typography>
          <FormControl component="fieldset" align="center">
            <RadioGroup
              row
              value={rentalType}
              onChange={handleRentalTypeChange}
            >
              {pricePerHour > 0 ? (
                <FormControlLabel
                  value="hour"
                  control={<Radio />}
                  label="Theo giờ"
                />
              ) : (
                <></>
              )}
              {pricePerDay > 0 ? (
                <FormControlLabel
                  value="day"
                  control={<Radio />}
                  label="Theo ngày"
                />
              ) : (
                <></>
              )}
              {pricePerWeek > 0 ? (
                <FormControlLabel
                  value="week"
                  control={<Radio />}
                  label="Theo tuần"
                />
              ) : (
                <></>
              )}
              {pricePerMonth > 0 ? (
                <FormControlLabel
                  value="month"
                  control={<Radio />}
                  label="Theo tháng"
                />
              ) : (
                <></>
              )}
            </RadioGroup>
          </FormControl>
        </Col>
        <Col md={6} align="center" style={{ paddingTop: '10px' }}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            {rentalType === 'hour' ? (
              <span> Chọn ngày và khung giờ trong ngày đó</span>
            ) : rentalType === 'day' ? (
              <span> Chọn ngày</span>
            ) : rentalType === 'week' ? (
              <span> Chọn tháng và tuần trong tháng đó</span>
            ) : rentalType === 'month' ? (
              <span> Chọn tháng</span>
            ) : (
              <></>
            )}
          </Typography>

          {rentalType === 'hour' ? (
            <Calendar
              value={selectedDates}
              onChange={handleChangeCalendarValue}
              multiple
              locale={vietnamese_lowercase}
              numberOfMonths={2}
              minDate={new Date()}
            />
          ) : rentalType === 'day' ? (
            <Calendar
              value={selectedDates}
              onChange={handleChangeCalendarValue}
              multiple
              locale={vietnamese_lowercase}
              numberOfMonths={2}
              minDate={new Date()}
            />
          ) : rentalType === 'week' ? (
            <Calendar
              onlyMonthPicker
              locale={vietnamese_lowercase}
              value={selectedFirstDayMonths}
              multiple
              onChange={handleChangeCalendarOnlyMonthValue}
              hideMonth
            />
          ) : rentalType === 'month' ? (
            <Calendar
              onlyMonthPicker
              locale={vietnamese_lowercase}
              value={selectedFirstDayMonths}
              onChange={handleChangeCalendarOnlyMonthValue}
              hideMonth
            />
          ) : (
            <></>
          )}

          {rentalType === 'hour' && selectedDates.length > 0 ? (
            selectedDates.map((date, idx) => (
              <Box key={idx} mt={3}>
                <Typography variant="subtitle1">
                  {dayjs(date.toDateString()).format('dddd, D MMMM YYYY')}
                </Typography>
                <Grid container justifyContent="center" spacing={1} mt={1}>
                  {Array.isArray(
                    availableSlots[
                      dayjs(date.toDateString()).format('dddd, D MMMM YYYY')
                    ]
                  ) ? (
                    availableSlots[
                      dayjs(date.toDateString()).format('dddd, D MMMM YYYY')
                    ].map((slot, index) => (
                      <Grid item key={index}>
                        <Button
                          variant={
                            selectedSlots
                              .map((item) => {
                                return item.selectedSlot;
                              })
                              .includes(
                                `${date.toDateString()} - [${slot.startTime} - ${slot.endTime}]`
                              )
                              ? 'contained'
                              : 'outlined'
                          }
                          sx={
                            checkGoldenHourV2({
                              slotStartTime: slot.startTime,
                              slotEndTime: slot.endTime,
                            })
                              ? { border: '4px solid yellow' }
                              : {}
                          }
                          onClick={() =>
                            handleTimeSlotSelectionV2({
                              date,
                              slotStartTime: slot.startTime,
                              slotEndTime: slot.endTime,
                            })
                          }
                          style={{ margin: '5px' }}
                          disabled={isExpiredTimeInDay({
                            slotEndTime: slot.endTime,
                            slotStartTime: slot.startTime,

                            choiceDate: date,
                          })}
                        >
                          {slot.startTime} - {slot.endTime}
                        </Button>
                      </Grid>
                    ))
                  ) : (
                    <Typography>
                      Ngày này đã được đặt hoặc không có slot khả dụng
                    </Typography>
                  )}
                </Grid>
              </Box>
            ))
          ) : (
            <></>
          )}

          {rentalType === 'week' && selectedFirstDayMonths.length > 0 ? (
            selectedFirstDayMonths.map((firstDayOfMonth, index) => {
              return (
                <Box key={index} mt={3}>
                  <Typography variant="subtitle1">
                    {dayjs(firstDayOfMonth.toDateString()).format('MMMM YYYY')}
                  </Typography>
                  <Grid container justifyContent="center" spacing={1} mt={1}>
                    {Object.keys(selectedWeeks).length &&
                      selectedWeeks[firstDayOfMonth].weekList.map(
                        (weekObject, index) => {
                          return (
                            <Grid item key={index}>
                              <Button
                                variant={
                                  selectedWeeks[
                                    firstDayOfMonth
                                  ].weekName.includes(weekObject.name)
                                    ? 'contained'
                                    : 'outlined'
                                }
                                onClick={() =>
                                  handleWeekSlotSelection({
                                    firstDayOfMonth: firstDayOfMonth,
                                    weekObject: weekObject,
                                  })
                                }
                                style={{ margin: '5px' }}
                                disabled={isExpiredDayInWeek({
                                  weekObject: weekObject,
                                  firstDayOfMonth: firstDayOfMonth,
                                })}
                              >
                                {weekObject.name}
                              </Button>
                            </Grid>
                          );
                        }
                      )}
                  </Grid>
                </Box>
              );
            })
          ) : (
            <></>
          )}
        </Col>
        <Col md={6} align="center" style={{ paddingTop: '10px' }}>
          <Typography variant="h6">Danh sách đã chọn</Typography>
          <Paper
            elevation={3}
            style={{ maxWidth: '500px', margin: '20px auto', padding: '10px' }}
          >
            <List>
              {summary.length > 0 ? (
                <>
                  {summary.map((summaryItem, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={summaryItem.slotKey}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: 'text.primary', display: 'inline' }}
                            >
                              {priceFormatter(summaryItem.price)} vnđ
                            </Typography>
                            {summaryItem?.isGolden && summaryItem?.priceIncrease
                              ? ` - Khung giờ vàng (+${summaryItem?.priceIncrease}%)`
                              : ''}

                            {summaryItem?.weekObject
                              ? ` - ${summaryItem?.weekObject.name} tháng ${summaryItem.month + 1} ${summaryItem.year}`
                              : ''}
                          </React.Fragment>
                          // `Giá: ${priceFormatter(item.price)} vnđ ${(!!goldenHour?.checkGoldenHour && item?.isGolden) ?
                          //     `(+${goldenHour?.priceIncrease}%)`
                          //     : ""
                          // }`
                        }
                      />
                      <IconButton
                        edge="end"
                        onClick={() =>
                          handleRemoveSummary({
                            slotKey: summaryItem.slotKey,
                            weekObject: summaryItem.weekObject,
                            firstDayOfMonth: summaryItem.firstDayOfMonth,
                          })
                        }
                      >
                        <Delete />
                      </IconButton>
                    </ListItem>
                  ))}
                  <Button onClick={() => handleCreateBooking()}>
                    Đặt Phòng
                  </Button>
                </>
              ) : (
                <Typography>Chưa chọn lịch</Typography>
              )}
            </List>
            <Typography variant="h6">
              Tổng số tiền:{' '}
              {priceFormatter(
                summary.reduce((acc, summaryItem) => acc + summaryItem.price, 0)
              )}{' '}
              VND
            </Typography>
            <Typography variant="h6">
              Tổng số: {priceFormatter(summary.length)}
            </Typography>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingForm;