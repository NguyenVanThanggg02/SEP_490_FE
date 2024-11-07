import React, { useEffect, useState } from 'react';
// import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { priceFormatter } from '../utils/numberFormatter';
import {
  checkDayAvailability,
  checkHourAvailability,
  createBooking,
} from '../Api/BookingRequests';
import { toast } from 'react-toastify';

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import  { Calendar } from 'react-multi-date-picker';

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
  const [goldenHour, setGoldenHour] = useState({});
  const [availableSlots, setAvailableSlots] = useState({});
  const userId = localStorage.getItem('userId');

  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const [selectedWeeks, setSelectedWeeks] = useState({});

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
          response = await checkHourAvailability(body);
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
    setSelectedDates([]);
    setSelectedMonths([]);

    setAvailableSlots({});
    setSelectedWeeks({});

    setSelectedSlots([]);
    setSummary([]);

    // Gọi fetchAvailableSlots khi đổi rentalType để cập nhật danh sách khả dụng
    const today = new Date();
    if (
      newRentalType === 'day' ||
      newRentalType === 'week' ||
      newRentalType === 'month'
    ) {
      const datesToFetch = Array.from({ length: 30 }, (_, i) =>
        addDays(today, i)
      ); // Lấy 30 ngày từ hôm nay
      await fetchAvailableSlots(datesToFetch, newRentalType);
    }
  };

  const isGoldenHour = (time) => {
    if (!spaceData || !spaceData.isGoldenHour) return false;
    if (!time) return false;
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

  const checkGoldenHour = ({ startTime, endTime }) => {
    if (!spaceData || !spaceData.isGoldenHour) return false;

    const { startTime: goldenStartTime, endTime: goldenEndTime } =
      spaceData.goldenHourDetails;

    const returnValue =
      startTime === goldenStartTime && endTime === goldenEndTime ? true : false;

    console.log('203 ============>', {
      goldenEndTime,
      goldenStartTime,
      startTime,
      endTime,
      returnValue,
    });

    return returnValue;
  };

  const calculatePrice = (time) => {
    if (!spaceData) return 0;
    const {
      pricePerHour,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      goldenHourDetails,
    } = spaceData;
    let checkGoldenHour = isGoldenHour(time);
    setGoldenHour({
      checkGoldenHour: checkGoldenHour,
      priceIncrease: goldenHourDetails?.priceIncrease,
    });
    if (rentalType === 'hour') {
      const basePrice = checkGoldenHour
        ? pricePerHour * (1 + goldenHourDetails?.priceIncrease / 100)
        : pricePerHour;
      return !!checkGoldenHour
        ? { basePrice: basePrice, isGolden: !!checkGoldenHour }
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
    console.log('264 handleChangeCalendarValue ===>', { date });
    const dateConvert = date.map((item, index) => {
      return new Date(item);
    });

    console.log('312 handleChangeCalendarValue ===>', {
      dateConvert: dayjs(dateConvert).month(),
      daysInMonth: dayjs(dateConvert).daysInMonth(),
    });
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
                price: calculatePrice(null),
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
      case 'week': {
        if (dateConvert.length > 0) {
          const dateString = dateConvert[dateConvert.length - 1].toDateString();

          const daysInMonth = dayjs(dateString).daysInMonth();
          const tempMonth = dayjs(dateString).month();

          const startDate = new Date(dateString);
          const endDate = addDays(startDate, daysInMonth - 1);

          //   const tempSummary = {
          //     slotKey: `${dayjs(startDate.toDateString()).format('dddd, D MMMM YYYY')} - ${dayjs(endDate.toDateString()).format('dddd, D MMMM YYYY')}`,
          //     price: calculatePrice(null),
          //   };

          const tempMonthRange = Array.from({ length: daysInMonth }, (_, i) =>
            addDays(startDate, i)
          );

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

            setSelectedMonths([...selectedMonths, ...[startDate]]);
          } else {
            setSelectedMonths([...selectedMonths, ...[]]);

            toast.warning(
              'Tất cả các ngày trong tháng này đã có phòng đặt, vui lòng chọn tháng khác.'
            );
          }
        } else {
          setSelectedMonths([]);
          setSummary([]);
          setSelectedWeeks({});
        }

        break;
      }
      case 'month': {
        if (dateConvert.length > 0) {
          // let monthRange = [];
          // let monthList = [];
          // let summaryList = [];

          const dateString = dateConvert[dateConvert.length - 1].toDateString();

          // if (dateConvert.length > 0) {
          //   monthRange = dateConvert.reduce((currentArray, next) => {
          const daysInMonth = dayjs(dateString).daysInMonth();
          const tempMonth = dayjs(dateString).month();

          const startDate = new Date(dateString);
          const endDate = addDays(startDate, daysInMonth - 1);

          const tempSummary = {
            slotKey: `${dayjs(startDate.toDateString()).format('dddd, D MMMM YYYY')} - ${dayjs(endDate.toDateString()).format('dddd, D MMMM YYYY')}`,
            price: calculatePrice(null),
          };

          // monthList.push(month);
          // summaryList.push(summary);

          const tempMonthRange = Array.from({ length: daysInMonth }, (_, i) =>
            addDays(startDate, i)
          );

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
            //   setSelectedDates(monthRange);
            setSelectedMonths([...selectedMonths, ...[startDate]]);

            //   setSummary(summaryList);

            setSelectedDates([...selectedDates, ...tempMonthRange]);
            setSummary([...summary, ...[tempSummary]]);
          } else {
            setSelectedMonths([...selectedMonths, ...[]]);

            toast.warning(
              'Một hoặc nhiều ngày trong tháng này đã có phòng đặt, vui lòng chọn tháng khác.'
            );
          }

          //     return [...currentArray, ...tempMonthRange];
          //   }, []);
          //   })
          // }
        } else {
          setSelectedMonths([]);
          setSummary([]);
          setSelectedDates([]);
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
          const [datePart, timePart] = slot.split(' - [');
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
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Nếu có xung đột ngày/slot, thông báo cho người dùng
        toast.warning(
          'Lịch bạn chọn đã có người đặt trước. Vui lòng chọn ngày hoặc slot khác.'
        );
      } else {
        console.error(
          'Error creating booking:',
          error.response ? error.response.data : error.message
        );
        toast.error('Lỗi khi đặt địa điểm.');
      }
    }
  };

  // Xử lý chọn hoặc bỏ chọn khung giờ
  const handleTimeSlotSelection = (date, slotStartTime, slotEndTime) => {
    const slotKey = `${date.toDateString()} - [${slotStartTime} - ${slotEndTime}]`;
    const slotKeyConvert = `${dayjs(date.toDateString()).format('dddd, D MMMM YYYY')} - [${slotStartTime} - ${slotEndTime}]`;
    if (selectedSlots.includes(slotKey)) {
      // Nếu đã chọn, bỏ chọn khung giờ
      setSelectedSlots(selectedSlots.filter((s) => s !== slotKey));
      setSummary(summary.filter((item) => item.slotKey !== slotKeyConvert));

      const remainingSlotsForDate = selectedSlots.filter((s) =>
        s.startsWith(date.toDateString())
      );
      if (remainingSlotsForDate.length === 1) {
        setSelectedDates(
          selectedDates.filter(
            (d) =>
              dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !==
              dayjs(date.toDateString()).format('dddd, D MMMM YYYY')
          )
        );
      }
    } else {
      // Chọn mới khung giờ
      setSelectedSlots([...selectedSlots, slotKey]);
      const priceInfo = calculatePrice(slotStartTime); // Tính giá cho slot này
      console.log('priceInfo', priceInfo);

      setSummary([
        ...summary,
        {
          slotKey: slotKeyConvert,
          price: priceInfo?.isGolden ? priceInfo.basePrice : priceInfo,
          isGolden: priceInfo?.isGolden,
          priceIncrease: goldenHour?.priceIncrease, // Lưu mức tăng giá trong thời gian khung giờ vàng (nếu có)
        },
      ]);
    }
  };

  const handleRemoveSlot = (slotKey) => {
    setSelectedSlots(selectedSlots.filter((s) => s !== slotKey));
    setSummary(summary.filter((item) => item.slotKey !== slotKey));

    const dateStr = slotKey.split(' - ')[0];

    // Điều chỉnh logic để xoá ngày khỏi selectedDates nếu chọn theo "day"
    if (rentalType === 'day') {
      // Xoá ngày khỏi selectedDates
      setSelectedDates(
        selectedDates.filter(
          (d) => dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
        )
      );
    } else if (rentalType === 'hour') {
      // Cho các rental type khác, kiểm tra remainingSlotsForDate như trước
      const remainingSlotsForDate = selectedSlots.filter((s) =>
        s.startsWith(dateStr)
      );
      if (remainingSlotsForDate.length === 1) {
        setSelectedDates(
          selectedDates.filter(
            (d) =>
              dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
          )
        );
      }
    } else if (rentalType === 'month') {
      // Cho các rental type khác, kiểm tra remainingSlotsForDate như trước
      //   const remainingSlotsForDate = selectedSlots.filter((s) =>
      //     s.startsWith(dateStr)
      //   );
      //   if (remainingSlotsForDate.length === 1) {
      setSelectedDates(
        selectedDates.filter(
          (d) => dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
        )
      );

      setSelectedMonths(
        selectedMonths.filter(
          (d) => dayjs(d.toDateString()).format('dddd, D MMMM YYYY') !== dateStr
        )
      );
      //   }
    } else if (rentalType === 'week') {
    }
  };

  const handleWeekSlotSelection = async ({ month, week }) => {
    if (
      Object.keys(selectedWeeks).length > 0 &&
      selectedWeeks[month].weekName.includes(week.name)
    ) {
      setSelectedWeeks((selectedWeeks) => {
        const tempWeek = selectedWeeks[month].weekName.filter((item) => {
          return item !== week.name;
        });

        const tempSelectedWeek = {};

        tempSelectedWeek[month] = {
          weekName: [...tempWeek],
          weekList: [...selectedWeeks[month].weekList],
        };

        return { ...selectedWeeks, ...tempSelectedWeek };
      });

      const tempMonth = dayjs(month).month();
      const tempYear = dayjs(month).year();

      const firstDayOfWeek = dayjs()
        .month(tempMonth)
        .year(tempYear)
        .startOf('month')
        .add(week.value - 1, 'week')
        .startOf('week');

      const dateStringConvert = dayjs(new Date(firstDayOfWeek)).format(
        'dddd, D MMMM YYYY'
      );

      setSummary(
        summary.filter((item) => {
          return !item.slotKey.startsWith(dateStringConvert);
        })
      );

      return;
    }

    const tempMonth = dayjs(month).month();
    const tempYear = dayjs(month).year();

    const firstDayOfWeek = dayjs()
      .month(tempMonth)
      .year(tempYear)
      .startOf('month')
      .add(week.value - 1, 'week')
      .startOf('week');

    const endDayOfWeek = new Date(firstDayOfWeek.endOf('week'));

    const firstDayOfWeekConvert = new Date(firstDayOfWeek);
    const endDayOfWeekConvert = new Date(endDayOfWeek);

    const tempSummary = {
      slotKey: `${dayjs(firstDayOfWeekConvert.toDateString()).format('dddd, D MMMM YYYY')} - ${dayjs(endDayOfWeekConvert.toDateString()).format('dddd, D MMMM YYYY')}`,
      price: calculatePrice(null),
    };

    // monthList.push(month);
    // summaryList.push(summary);

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
      //   setSelectedDates(monthRange);
      setSelectedMonths([...selectedMonths, ...[]]);

      setSelectedWeeks((selectedWeeks) => {
        const tempSelectedWeek = {};
        tempSelectedWeek[month] = {
          weekName: [...selectedWeeks[month].weekName, week.name],
          weekList: [...selectedWeeks[month].weekList],
        };

        return { ...selectedWeeks, ...tempSelectedWeek };
      });

      setSelectedDates([...selectedDates, ...tempMonthRange]);
      setSummary([...summary, ...[tempSummary]]);
    } else {
      setSelectedMonths([...selectedMonths, ...[]]);

      toast.warning(
        'Một hoặc nhiều ngày trong tuần này đã có phòng đặt, vui lòng chọn tuần khác.'
      );
    }
  };

  const handleChangeCalendaOnlyMonthValue = async (date) => {
    console.log(
      '--------------------------------------------------------------------'
    );
    console.log('264 handleChangeCalendarValue ===>', { date });
    const dateConvert = date.map((item, index) => {
      const convert = new Date(item);

      console.log('312 handleChangeCalendarValue ===>', {
        convert,
        dateConvert: dayjs(item).month(),
        daysInMonth: dayjs(item).daysInMonth(),
      });
      return convert;
    });

    switch (rentalType) {
      case 'week': {
        if (dateConvert.length > 0) {
          let dateString = '';

          if (dateConvert.length > selectedMonths.length) {
            dateString = dateConvert[dateConvert.length - 1].toDateString();
          } else {
            const removeDateMonth = selectedMonths.find((item, index) => {
              return (
                dateConvert
                  .map((item, index) => {
                    return item.toDateString();
                  })
                  .indexOf(item.toDateString()) === -1
              );
            });

            dateString = removeDateMonth.toDateString();
          }

          const daysInMonth = dayjs(dateString).daysInMonth();
          const tempMonth = dayjs(dateString).month();
          const tempYear = dayjs(dateString).year();

          const startDate = new Date(dateString);
          const endDate = addDays(startDate, daysInMonth - 1);

          const tempSummary = {
            slotKey: `${dayjs(startDate.toDateString()).format('dddd, D MMMM YYYY')} - ${dayjs(endDate.toDateString()).format('dddd, D MMMM YYYY')}`,
            price: calculatePrice(null),
          };

          const tempMonthRange = Array.from({ length: daysInMonth }, (_, i) =>
            addDays(startDate, i)
          );

          if (dateConvert.length > selectedMonths.length) {
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

              setSelectedMonths([...selectedMonths, ...[startDate]]);
            } else {
              setSelectedMonths([...selectedMonths, ...[]]);

              toast.warning(
                'Tất cả các ngày trong tháng này đã có phòng đặt, vui lòng chọn tháng khác.'
              );
            }
          } else {
            const tempSelectedMonthFilter = selectedMonths.filter(
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

            setSelectedMonths([...tempSelectedMonthFilter]);
            setSummary([...tempSummaryFilter]);
            setSelectedDates([...tempSeletedDatesFilter]);
          }
        } else {
          setSelectedMonths([]);
          setSummary([]);
          setSelectedWeeks({});
        }

        break;
      }
      case 'month': {
        if (dateConvert.length > 0) {
          let dateString = '';

          if (dateConvert.length > selectedMonths.length) {
            dateString = dateConvert[dateConvert.length - 1].toDateString();
          } else {
            const removeDateMonth = selectedMonths.find((item, index) => {
              return (
                dateConvert
                  .map((item, index) => {
                    return item.toDateString();
                  })
                  .indexOf(item.toDateString()) === -1
              );
            });

            dateString = removeDateMonth.toDateString();
          }

          const daysInMonth = dayjs(dateString).daysInMonth();
          const tempMonth = dayjs(dateString).month();

          const startDate = new Date(dateString);
          const endDate = addDays(startDate, daysInMonth - 1);

          const tempSummary = {
            slotKey: `${dayjs(startDate.toDateString()).format('dddd, D MMMM YYYY')} - ${dayjs(endDate.toDateString()).format('dddd, D MMMM YYYY')}`,
            price: calculatePrice(null),
          };

          const tempMonthRange = Array.from({ length: daysInMonth }, (_, i) =>
            addDays(startDate, i)
          );

          if (dateConvert.length > selectedMonths.length) {
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
              setSelectedMonths([...selectedMonths, ...[startDate]]);

              setSelectedDates([...selectedDates, ...tempMonthRange]);
              setSummary([...summary, ...[tempSummary]]);
            } else {
              setSelectedMonths([...selectedMonths, ...[]]);

              toast.warning(
                'Một hoặc nhiều ngày trong tháng này đã có phòng đặt, vui lòng chọn tháng khác.'
              );
            }
          } else {
            const tempSelectedMonthFilter = selectedMonths.filter(
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
            setSelectedMonths([...tempSelectedMonthFilter]);
            setSummary([...tempSummaryFilter]);
            setSelectedDates([...tempSeletedDatesFilter]);
          }
        } else {
          setSelectedMonths([]);
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
              <FormControlLabel
                value="hour"
                control={<Radio />}
                label="Theo giờ"
              />
              <FormControlLabel
                value="day"
                control={<Radio />}
                label="Theo ngày"
              />
              <FormControlLabel
                value="week"
                control={<Radio />}
                label="Theo tuần"
              />
              <FormControlLabel
                value="month"
                control={<Radio />}
                label="Theo tháng"
              />
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
          {/* <Calendar
            onChange={handleDateChange}
            selectRange={false} // Không bật range, chọn ngày bắt đầu và tự động tính toán
            value={selectedDates}
            tileDisabled={({ date }) => {
              // Vô hiệu hóa các ngày đã qua cho tất cả các kiểu thuê
              return date < new Date();
            }}
            showDoubleView={true}
            tileClassName={({ date }) =>
              selectedDates.some(
                (d) => d.toDateString() === date.toDateString()
              )
                ? 'selected'
                : ''
            }
          /> */}

          {/* <DatePicker value={value} onChange={setValue} multiple       locale={vietnamese_lowercase} 
/> */}
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
              value={selectedMonths}
              multiple
              onChange={handleChangeCalendaOnlyMonthValue}
              hideMonth
            />
          ) : rentalType === 'month' ? (
            <Calendar
              onlyMonthPicker
              locale={vietnamese_lowercase}
              value={selectedMonths}
              onChange={handleChangeCalendaOnlyMonthValue}
              hideMonth
            />
          ) : (
            <></>
          )}

          {rentalType === 'hour' &&
            selectedDates.length > 0 &&
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
                            selectedSlots.includes(
                              `${date.toDateString()} - [${slot.startTime} - ${slot.endTime}]`
                            )
                              ? 'contained'
                              : 'outlined'
                          }
                          sx={
                            checkGoldenHour({
                              startTime: slot.startTime,
                              endTime: slot.endTime,
                            })
                              ? { border: '4px solid yellow' }
                              : {}
                          }
                          onClick={() =>
                            handleTimeSlotSelection(
                              date,
                              slot.startTime,
                              slot.endTime
                            )
                          }
                          style={{ margin: '5px' }}
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
            ))}

          {rentalType === 'week' &&
            selectedMonths.length > 0 &&
            selectedMonths.map((month, index) => {
              return (
                <Box key={index} mt={3}>
                  <Typography variant="subtitle1">
                    {dayjs(month.toDateString()).format('MMMM YYYY')}
                  </Typography>
                  <Grid container justifyContent="center" spacing={1} mt={1}>
                    {Object.keys(selectedWeeks).length &&
                      selectedWeeks[month].weekList.map((week, index) => {
                        return (
                          <Grid item key={index}>
                            <Button
                              variant={
                                selectedWeeks[month].weekName.includes(
                                  week.name
                                )
                                  ? 'contained'
                                  : 'outlined'
                              }
                              onClick={() =>
                                handleWeekSlotSelection({ month, week })
                              }
                              style={{ margin: '5px' }}
                            >
                              {week.name}
                            </Button>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Box>
              );
            })}
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
                        onClick={() => handleRemoveSlot(item.slotKey)}
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
              Tổng:{' '}
              {priceFormatter(
                summary.reduce((acc, item) => acc + item.price, 0)
              )}{' '}
              VND
            </Typography>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingForm;
