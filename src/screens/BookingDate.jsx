import React, { useEffect, useMemo, useState } from "react";
// import Calendar from 'react-calendar';
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Col, Container, Row } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import ".././style/BookingDate.css"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createBooking } from "../Api/BookingRequests";
import { availableSlots as allAvailableSlots } from "./AddSpaces/AddSpaceInforSpace";
import { Info, ErrorOutline, Rule, CreditCard, Gavel, AccountBalance, CheckCircle, Warning, EventNote } from "@mui/icons-material"
import AvailableSlots, { checkGoldenHour } from "./booking/AvailableSlots";
import CalendarForEachRentalType from "./booking/CalendarForEachRentalType";
import RadiosForChoseRentalType from "./booking/RadiosForChoseRentalType";
import Summary from "./booking/Summary";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";

// NOTICE

dayjs.locale("vi");
dayjs.extend(customParseFormat);

const mapForPricePer = {
  hour: "pricePerHour",
  day: "pricePerDay",
  month: "pricePerMonth",
};

const calBasePrice = (spaceData, selectedData) => {
  const { rentalType } = selectedData;
  return spaceData[mapForPricePer[rentalType]];
};

export const convertDatePart = (datePart) => {
  return dayjs(datePart).format("dddd, D MMMM YYYY");
};

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedData, setSelectedData] = useState({
    rentalType: "hour",
    selectedDates: [],
    selectedMonthObjs: [],
  });
  const [spaceData, setSpaceData] = useState({});
  const [loading, setLoading] = useState(false);

  const [openWarning, setOpenWarning] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    setOpenWarning(true);
  }, []);
  const handleWarningClose = () => {
    setOpenWarning(false);
  };
  const handleAgreeChange = (event) => {
    setIsAgreed(event.target.checked);
  };
  const [summary, setSummary] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedSlotsWithDateParts, setSelectedSlotsWithDateParts] = useState(
    []
  );

  const userId = localStorage.getItem("userId");

  // calculate the bookedDatePartsNoIncludeHourRent
  const bookedDatePartsNoIncludeHourRent = useMemo(() => {
    if (!spaceData?.bookings) return [];
    return spaceData.bookings.flatMap((booking) => {
      const {
        selectedDates: selectedDatesOfBook,
        selectedSlots: selectedSlotsOfBook,
      } = booking;
      if (!selectedSlotsOfBook.length) {
        return selectedDatesOfBook.map(
          (selDateOfBoo) => selDateOfBoo.split("T")[0]
        );
      } else {
        // incase the rental is hour, return yesterday
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split("T")[0];
      }
    });
  }, [spaceData]);

  // calculate the bookedDatePartsIncludeHourRent
  const bookedDatePartsIncludeHourRent = useMemo(() => {
    if (!spaceData?.bookings) return [];
    return spaceData.bookings.flatMap((booking) => {
      const {
        selectedDates: selectedDatesOfBook,
        selectedSlots: selectedSlotsOfBook,
      } = booking;
      return selectedDatesOfBook.map(
        (selDateOfBoo) => selDateOfBoo.split("T")[0]
      );
    });
  }, [spaceData]);

  // calculate the bookedDatePartsNoIncludeHourRent
  const bookedSlotsOfDateParts = useMemo(() => {
    if (!spaceData?.bookings) return [];
    return spaceData.bookings.reduce((acc, booking) => {
      const { selectedSlots: selectedSlotsOfBook } = booking;
      // loop for booking list and push the taken obj (takenObj: {datePart, takenSlots})
      selectedSlotsOfBook.forEach((selectedSlotOfBook) => {
        const datePart = selectedSlotOfBook.date.split("T")[0];
        const slot = {
          startTime: selectedSlotOfBook.startTime,
          endTime: selectedSlotOfBook.endTime,
        };
        // check exist datePart in list
        const foundSlotObj = acc.find(
          (slotObj) => slotObj.datePart === datePart
        );
        // if there is datePart, push slot to takenSlots, if no, push to acc
        if (foundSlotObj) {
          const otherDatePart = acc.filter(
            (slotObj) => slotObj.datePart !== datePart
          );

          acc = [
            ...otherDatePart,
            {
              datePart,
              takenSlots: [...foundSlotObj.takenSlots, slot],
            },
          ];
        } else {
          acc.push({
            datePart,
            takenSlots: [slot],
          });
        }
      });
      return acc;
    }, []);
  }, [spaceData]);

  const amountsPerDates = useMemo(() => {
    if (selectedData.rentalType === "hour") {
      return selectedSlotsWithDateParts.flatMap((slotsWithDate) => {
        const { datePart, selectedSlots } = slotsWithDate;
        const slotList = selectedSlots.map((slot) => {
          const goldenSlot = checkGoldenHour(spaceData, slot);

          const dateKey = `${convertDatePart(datePart)} - [${slot.startTime}-${slot.endTime}]${goldenSlot ? ` - Khung giờ vàng (+${goldenSlot.priceIncrease}%)` : ""}`;

          let finalAmount = 0;
          const baseAmount = calBasePrice(spaceData, selectedData);
          if (!goldenSlot) {
            finalAmount = baseAmount;
          } else {
            finalAmount =
              baseAmount + (baseAmount * goldenSlot.priceIncrease) / 100;
          }

          return {
            text: dateKey,
            amount: finalAmount,
          };
        });
        return slotList;
      });
    } else if (selectedData.rentalType === "day") {
      return selectedData.selectedDates.map((selectedDate) => {
        const dateKey = `Ngày ${convertDatePart(selectedDate)}`;

        const finalAmount = calBasePrice(spaceData, selectedData);

        return {
          text: dateKey,
          amount: finalAmount,
        };
      });
    } else if (selectedData.rentalType === "month") {
      return selectedData.selectedMonthObjs.map((selectedMonthObj) => {
        const dateKey = `Tháng ${selectedMonthObj.year}/${selectedMonthObj.month}`;

        const finalAmount = calBasePrice(spaceData, selectedData);

        return {
          text: dateKey,
          amount: finalAmount,
        };
      });
    }
  }, [selectedData, spaceData, selectedSlotsWithDateParts]);

  const fetchSpaceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:9999/spaces/with-bookings/${id}`
      );
      console.log("response", response);
      setSpaceData(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkHourAndDateAvailability = (selectedDates) => {
    let slotsInSelectedDates = [];
    let takenSelectedDates = [];
    let availableSelectedDates = [];

    // this space dont have any booking
    if (!spaceData?.bookings?.length) {
      slotsInSelectedDates = selectedDates.map((selectedDate) => {
        const datePart = selectedDate.split("T")[0];
        let availableSlots = allAvailableSlots;

        // eliminate the expired slot when the selected date is today
        const today = new Date();
        const currHour = today.getHours();
        const currDatePart = today.toISOString().split("T")[0];
        if (datePart === currDatePart) {
          availableSlots = allAvailableSlots.filter((availableSlot) => {
            const startHour = Number(availableSlot.startTime.split(":")[0]); // the startTime format: hh:mm
            return startHour > currHour;
          });
        }

        return { datePart, availableSlots };
      });

      availableSelectedDates = selectedDates;
    } else {
      // have some bookings
      // calculate the stats above
      // check datePart
      if (selectedData.rentalType !== "hour") {
        availableSelectedDates = selectedDates.filter((selectedDate) => {
          const datePart = selectedDate.split("T")[0];
          return !bookedDatePartsIncludeHourRent.includes(datePart);
        });
      } else {
        // because when we booked based on hour, the booking also show selectedDate in if there any slot taken
        // so if the rental type is hour, must check is there any slot in date
        availableSelectedDates = selectedDates.filter((selectedDate) => {
          const datePart = selectedDate.split("T")[0];

          let isAvailableFlag = true;
          // first check slot
          // the definition of takenObj is above
          const foundTakenObj = bookedSlotsOfDateParts.find(
            (bookedSlotsOfDatePart) => {
              return bookedSlotsOfDatePart.datePart === datePart;
            }
          );

          if (foundTakenObj?.takenSlots?.length === allAvailableSlots.length) {
            // in this date, full slot are taken
            isAvailableFlag = false;
          } else {
            // in this date, no slot taken was found or some slot was taken,
            //  now we check the is there any day/month booking inlude this date,
            const isWholeDateTaken =
              bookedDatePartsNoIncludeHourRent.includes(datePart);
            if (isWholeDateTaken) isAvailableFlag = false;
          }

          return isAvailableFlag;
        });

        // if some availableSelectedDates, cal the available slot
        slotsInSelectedDates = availableSelectedDates.map((selectedDate) => {
          const datePart = selectedDate.split("T")[0];
          // first check slot
          // the definition of takenObj is above
          const foundTakenObj = bookedSlotsOfDateParts.find(
            (bookedSlotsOfDatePart) => {
              return bookedSlotsOfDatePart.datePart === datePart;
            }
          );

          let availableSlots;
          // if no one taken this date
          if (!foundTakenObj) {
            availableSlots = allAvailableSlots;
          } else {
            availableSlots = allAvailableSlots.filter((slot) => {
              return !foundTakenObj.takenSlots.find(
                (takenSlot) => takenSlot.startTime === slot.startTime
              );
            });
          }

          // eliminate the expired slot when the selected date is today
          const today = new Date();
          const currHour = today.getHours();
          const currDatePart = today.toISOString().split("T")[0];
          if (datePart === currDatePart) {
            availableSlots = availableSlots.filter((availableSlot) => {
              const startHour = Number(availableSlot.startTime.split(":")[0]); // the startTime format: hh:mm
              return startHour > currHour;
            });
          }

          return { datePart, availableSlots };
        });
      }
    }

    takenSelectedDates = selectedDates.filter((selectedDate) => {
      const datePart = selectedDate.split("T")[0];
      const availableSelectedDateParts = availableSelectedDates.map(
        (selectedDate) => selectedDate.split("T")[0]
      );
      return !availableSelectedDateParts.includes(datePart);
    });

    // return stats
    return {
      slotsInSelectedDates,
      takenSelectedDates,
      availableSelectedDates,
    };
  };

  const checkMonth = (selectedMonthObjs) => {
    // this space dont have any booking
    if (!spaceData?.bookings?.length) return { availableSelectedMonthObjs: selectedMonthObjs };
    // have some bookings
    let takenSelectedMonthObjs = [];
    let availableSelectedMonthObjs = [];

    // calculate the stats above
    availableSelectedMonthObjs = selectedMonthObjs.filter(
      (selectedMonthObj) => {
        // check this month is currentMonth=>false
        const today = new Date();
        const currMonth = today.getMonth() + 1;
        const currYear = today.getFullYear();
        if (
          currMonth === selectedMonthObj.month &&
          currYear === selectedMonthObj.year
        ) {
          return false;
        }

        // some already book some date in this month=>false
        return !bookedDatePartsIncludeHourRent.find(
          (bookedDatePartIncludeHourRent) => {
            // check is there any date in selected month is booked
            const yearPart = bookedDatePartIncludeHourRent.split("-")[0];
            const monthPart = bookedDatePartIncludeHourRent.split("-")[1];

            return (
              yearPart === selectedMonthObj.year &&
              monthPart === selectedMonthObj.month
            );
          }
        );
      }
    );

    takenSelectedMonthObjs = selectedMonthObjs.filter((selectedMonthObj) => {
      return !availableSelectedMonthObjs.find(
        (availableSelectedMonthObj) =>
          availableSelectedMonthObj.month === selectedMonthObj.month &&
          availableSelectedMonthObj.year === selectedMonthObj.year
      );
    });

    return {
      takenSelectedMonthObjs,
      availableSelectedMonthObjs,
    };
  };

  const onChoseSlot = (datePart, slot) => {
    const foundDatePart = selectedSlotsWithDateParts.find(
      (selectedSlotsWithDatePart) =>
        selectedSlotsWithDatePart.datePart === datePart
    );

    // if we not choose this date before
    if (!foundDatePart) {
      setSelectedSlotsWithDateParts((prev) => [
        ...prev,
        { datePart, selectedSlots: [slot] },
      ]);
    } else {
      // if we choose this date before
      const other = selectedSlotsWithDateParts.filter(
        (selectedSlotsWithDatePart) =>
          selectedSlotsWithDatePart.datePart !== datePart
      );

      const foundSlot = foundDatePart.selectedSlots.find(
        (selectedSlot) => selectedSlot.startTime === slot.startTime
      );

      // if we not selected this slot before=>Add slot
      if (!foundSlot) {
        setSelectedSlotsWithDateParts([
          ...other,
          { datePart, selectedSlots: [...foundDatePart.selectedSlots, slot] },
        ]);
      } else {
        // if we selected this slot before=>
        // check this is only slot
        const isOnlyOneSlotInDate = foundDatePart.selectedSlots.length === 1;
        if (isOnlyOneSlotInDate) {
          // remove the datePart with slot
          setSelectedSlotsWithDateParts([...other]);

          // remove the this date in selectedData
          setSelectedData((prev) => {
            const { selectedDates } = prev;
            const other = selectedDates.filter((selectedDate) => {
              const isoformat = new Date(selectedDate).toISOString();
              console.log("selectedDate", selectedDate, isoformat);
              const datePart = isoformat.split("T")[0];
              return datePart !== foundDatePart.datePart;
            });

            return { ...prev, selectedDates: other };
          });
        } else {
          const otherSlot = foundDatePart.selectedSlots.filter(
            (selectedSlot) => selectedSlot.startTime !== slot.startTime
          );
          setSelectedSlotsWithDateParts([
            ...other,
            { datePart, selectedSlots: otherSlot },
          ]);
        }
      }
    }
  };

  const handleCreateBooking = async () => {
    try {
      let adjustedDates;
      if (selectedData.rentalType !== "month") {
        adjustedDates = selectedData.selectedDates.map((date) => {
          const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T00:00:00.000Z`;
          return new Date(localDateStr);
        });
      } else {
        adjustedDates = selectedData.selectedMonthObjs.flatMap(
          (selectedMonthObj) => {
            return [...Array(31).keys()].map((i) => {
              const localDateStr = `${selectedMonthObj.year}-${String(selectedMonthObj.month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}T00:00:00.000Z`;
              return new Date(localDateStr);
            });
          }
        );
      }
      const totalAmount = amountsPerDates.reduce(
        (acc, item) => acc + item.amount,
        0
      );
      const bookingData = {
        userId: userId,
        spaceId: id,
        rentalType: selectedData.rentalType,
        startDate: adjustedDates[0], // Ngày đầu tiên trong mảng
        endDate: adjustedDates[adjustedDates.length - 1], // Ngày cuối cùng trong mảng
        selectedSlots: selectedSlotsWithDateParts.flatMap(
          (selectedSlotsWithDatePart) => {
            const { datePart, selectedSlots } = selectedSlotsWithDatePart;
            return selectedSlots.map((selectedSlot) => {
              const { startTime, endTime } = selectedSlot;

              const dateStr = `${datePart}T00:00:00.000Z`;

              return { date: dateStr, startTime, endTime };
            });
          }
        ),
        selectedDates: adjustedDates,
        status: "awaiting payment",
        notes: "Đặt phòng mới",
        totalAmount,
      };

      console.log("bookingData >>", bookingData);

      const response = await createBooking(bookingData);
      toast.success("Đặt địa điểm thành công.");

      navigate("/history");
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

  const onRentalTypeChange = (e) => {
    const newRentalType = e.target.value;
    setSelectedData({
      rentalType: newRentalType,
      selectedDates: [],
      selectedMonthObjs: [],
    });
    setAvailableSlots([]);
    setSelectedSlotsWithDateParts([]);
  };

  const handleHourAndDay = (selectedIObjs) => {
    const selectedDates = selectedIObjs.map((selectedIObj) => {
      const dateType = new Date(selectedIObj);
      return dateType.toISOString();
    });

    if (selectedDates.length) {
      // check available, taken date, slotsInDatePart
      const ret = checkHourAndDateAvailability(selectedDates);
      console.log("ret", ret);
      const {
        takenSelectedDates,
        availableSelectedDates,
        slotsInSelectedDates,
      } = ret;

      // notice when user choose some date taken or day expored
      if (takenSelectedDates.length) {
        const noticeString = takenSelectedDates
          .map((takenSelectedDate) => {
            return dayjs(takenSelectedDate).format("D MMMM YYYY");
          })
          .join(", ");

        toast.warning(
          `Ngày ${noticeString} đã có người đặt trước hoặc đã hết slot, đến cuối ngày ngày.`
        );
      }

      // set available selectedDates to calendar
      setSelectedData((prev) => ({
        ...prev,
        selectedDates: availableSelectedDates.map((date) => new Date(date)),
      }));

      // set available slot
      setAvailableSlots(slotsInSelectedDates);

      // clear slot in selectedSlotsWithDateParts
      setSelectedSlotsWithDateParts((prev) => {
        const other = prev.filter((selectedSlotsWithDatePart) =>
          availableSelectedDates.find((availableSelectedDate) => {
            const datePart = availableSelectedDate.split("T")[0];
            return datePart === selectedSlotsWithDatePart.datePart;
          })
        );
        return other;
      });
    } else {
      setSelectedData((prev) => ({
        rentalType: prev.rentalType,
        selectedDates: [],
        selectedMonthObjs: [],
      }));
      setAvailableSlots([]);
      setSelectedSlotsWithDateParts([]);
    }
  };

  const handleMonth = (selectedIObjs) => {
    const selectedMonthObjs = selectedIObjs.map((selectedIObj) => {
      const currentMonth = dayjs().month() + 1;
      if (selectedIObj.month.number === currentMonth) return null;
      return { month: selectedIObj.month.number, year: selectedIObj.year };
    }).filter(s => s !==null);

    if (selectedMonthObjs.length) {
      // check available, taken date, slotsInDatePart
      const ret = checkMonth(selectedMonthObjs);
      const { takenSelectedMonthObjs, availableSelectedMonthObjs } = ret;

      // notice when user choose some date taken
      if (takenSelectedMonthObjs && takenSelectedMonthObjs.length) {
        const noticeString = takenSelectedMonthObjs
          .map((takenSelectedMonthObj) => {
            return `${takenSelectedMonthObj.year}-${takenSelectedMonthObj.month}`;
          })
          .join(", ");

        toast.warning(`Tháng ${noticeString} đã có người đặt trong tháng.`);
      }

      // set available selectedDates to calendar
      setSelectedData((prev) => ({
        ...prev,
        selectedDates: availableSelectedMonthObjs.map(
          (monthObj) => new Date(`${monthObj.year}-${monthObj.month}-01`)
        ),
        selectedMonthObjs: availableSelectedMonthObjs,
      }));
    }
  };

  const onChangeDatePart = (selectedIObjs) => {
    setSelectedData((prev) => ({
      rentalType: prev.rentalType,
      selectedDates: [],
      selectedMonthObjs: [],
    }));
    if (
      selectedData.rentalType === "hour" ||
      selectedData.rentalType === "day"
    ) {
      handleHourAndDay(selectedIObjs);
    } else {
      handleMonth(selectedIObjs);
    }
  };

  useEffect(() => {
    fetchSpaceData();
  }, []);

  return (
    <Container>
      <Row>
        {/* radio list */}
        <Col md={12} align="center">
          <RadiosForChoseRentalType
            {...{ spaceData, selectedData, onRentalTypeChange }}
          />
        </Col>
        {/* calendar */}
        <Col md={6} align="center" style={{ paddingTop: "10px" }}>
          <CalendarForEachRentalType {...{ selectedData, onChangeDatePart }} />
        </Col>

        {/* summary about what you select */}
        <Col md={6} align="center" style={{ paddingTop: "10px" }}>
          <Summary
            {...{
              selectedData,
              spaceData,
              selectedSlotsWithDateParts,
              handleCreateBooking,
              amountsPerDates,
            }}
          />
        </Col>
        {/* options for hour  */}
        <AvailableSlots
          {...{
            spaceData,
            rentalType: selectedData.rentalType,
            availableSlots,
            selectedSlotsWithDateParts,
            setSelectedSlotsWithDateParts,
            onChoseSlot,
          }}
        />
      </Row>
      <Dialog
        open={openWarning}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setOpenWarning(false);
          }
        }}
        disableEscapeKeyDown
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Info color="primary" sx={{ fontSize: 36, mr: 1 }} />
              Chính sách hoàn tiền và lưu ý khi đặt không gian
            </Box>
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {/* Thông báo nhấn mạnh */}
          <Alert
            severity="info"
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
            icon={<ErrorOutline fontSize="large" />}
          >
            Vui lòng đọc kỹ chính sách hoàn tiền trước khi đặt không gian để đảm bảo
            quyền lợi của quý khách!
          </Alert>
          {/* Chính sách hoàn tiền 100%  */}

          <Paper
            elevation={4}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "#e8f5e9",
              borderLeft: "5px solid #4caf50",
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ mr: 1 }} />
                Chính sách hoàn tiền 100%
              </Box>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Quý khách sẽ được hoàn lại toàn bộ số tiền đã thanh toán trong các trường hợp sau đây:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  <strong>Đặt theo slot:</strong> Nếu quý khách hủy đặt phòng ít nhất{" "}
                  <Typography
                    variant="body1"
                    component="span"
                    color="secondary"
                    fontWeight="bold"
                    sx={{
                      animation: "blink 0.5s infinite", color: "#005005"
                    }}

                  >
                    5 giờ
                  </Typography>{" "}
                  trước thời gian bắt đầu sử dụng.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Đặt theo ngày:</strong> Nếu quý khách hủy đặt phòng ít nhất{" "}
                  <Typography
                    variant="body1"
                    component="span"
                    color="secondary"
                    fontWeight="bold"
                    sx={{
                      animation: "blink 0.5s infinite", color: "#005005"
                    }}
                  >
                    24 giờ
                  </Typography>{" "}
                  trước ngày bắt đầu sử dụng.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Đặt theo tháng:</strong> Nếu quý khách hủy đặt phòng ít nhất{" "}
                  <Typography
                    variant="body1"
                    component="span"
                    color="secondary"
                    fontWeight="bold"
                    sx={{
                      animation: "blink 0.5s infinite", color: "#005005"
                    }}
                  >
                    7 ngày
                  </Typography>{" "}
                  trước ngày bắt đầu sử dụng.
                </Typography>
              </li>
            </ul>
          </Paper>


          {/* Chính sách hoàn tiền 1 phần */}
          <Paper
            elevation={4}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "#fffde7",
              borderLeft: "5px solid #ffeb3b",
            }}
          >
            <Typography variant="h6" color="secondary" gutterBottom>
              <Box display="flex" alignItems="center">
                <AccountBalance sx={{ mr: 1 }} />
                Chính sách hoàn tiền một phần
              </Box>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Trong một số trường hợp đặc biệt, quý khách vẫn có thể được hoàn lại một phần tiền đã thanh toán như sau:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  <strong>Đặt theo tháng:</strong>
                  <br />
                  - Nếu quý khách hủy từ{" "}
                  <Typography
                    variant="body1"
                    component="span"
                    color="secondary"
                    fontWeight="bold"
                    sx={{
                      animation: "blink 0.5s infinite", color: "#FF6F00"
                    }}
                  >
                    1-7 ngày
                  </Typography>{" "}
                  trước ngày bắt đầu sử dụng, chúng tôi sẽ hoàn lại{" "}
                  <Typography
                    variant="body1"
                    component="span"
                    color="primary"
                    fontWeight="bold"
                  >
                    80%
                  </Typography>{" "}
                  số tiền đã thanh toán.
                </Typography>
              </li>
              <Typography variant="body1">
                - Nếu quý khách hủy trong{" "}
                <Typography
                  variant="body1"
                  component="span"
                  color="secondary"
                  fontWeight="bold"
                  sx={{
                    animation: "blink 0.5s infinite", color: "#FF6F00"
                  }}
                >
                  tuần đầu tiên
                </Typography>{" "}
                của thời gian sử dụng, chúng tôi sẽ hoàn lại{" "}
                <Typography
                  variant="body1"
                  component="span"
                  color="primary"
                  fontWeight="bold"
                >
                  60%
                </Typography>.
              </Typography>
              <Typography variant="body1">
                - Nếu quý khách hủy trong{" "}
                <Typography
                  variant="body1"
                  component="span"
                  color="secondary"
                  fontWeight="bold"
                  sx={{
                    animation: "blink 0.5s infinite", color: "#FF6F00"
                  }}
                >
                  tuần thứ hai
                </Typography>{" "}
                của thời gian sử dụng, chúng tôi sẽ hoàn lại{" "}
                <Typography
                  variant="body1"
                  component="span"
                  color="primary"
                  fontWeight="bold"
                >
                  30%
                </Typography>.
              </Typography>
              <Typography variant="body1" >
                <Typography variant="body1"
                  fontWeight="bold"
                  sx={{
                    color: "red",display:"inline"
                  }}
                > <Warning /> Chú ý :</Typography> Sau{" "}
                <Typography
                  variant="body1"
                  component="span"
                  color="secondary"
                  fontWeight="bold"
                  sx={{
                    animation: "blink 0.5s infinite", color: "#FF6F00"
                  }}
                >
                  tuần thứ hai
                </Typography>{" "}
                của thời gian sử dụng, chúng tôi rất tiếc{" "}
                <Typography
                  variant="body1"
                  component="span"
                  color="primary"
                  fontWeight="bold"
                  sx={{
                    color: "red", animation: "blink 0.5s infinite"
                  }}
                >
                  không thể hoàn lại
                </Typography>{" "}

                tiền cho quý khách.
              </Typography>
            </ul>
          </Paper>




          {/* Quy định không gian */}
          <Paper
            elevation={4}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "#e3f2fd",
              borderLeft: "5px solid #2196f3",
            }}
          >
            <Typography variant="h6" color="secondary" gutterBottom>
              <Box display="flex" alignItems="center">
                <Rule sx={{ mr: 1 }} />
                Quy định không gian
              </Box>
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  Quý khách vui lòng tuân thủ các quy định riêng của không gian đặt ra.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Quý khách sẽ bồi thường tổn thất cho không gian với những hành vi làm đổ vỡ hay hư hại trong quá trình sử dụng không gian.
                </Typography>
              </li>
            </ul>
          </Paper>
          <Paper
  elevation={4}
  sx={{
    p: 3,
    mb: 3,
    bgcolor: "#f5f5f5",
    borderLeft: "5px solid #ff9800",
  }}
>
  <Typography variant="h6" color="warning" gutterBottom>
    <Box display="flex" alignItems="center">
      <EventNote sx={{ mr: 1 }} />
      Trả và nhận phòng
    </Box>
  </Typography>

  <ul>
    <li>
      <Typography variant="body1">
        Quý khách nhớ nhận không gian đúng thời gian để đảm bảo quyền lợi.
      </Typography>
    </li>
    <li>
      <Typography variant="body1">
        Sau khi trả không gian, hãy đánh giá về không gian để chúng tôi phục vụ quý khách tốt hơn vào lần tiếp theo.
      </Typography>
    </li>
  </ul>
</Paper>
          {/* Phương thức thanh toán */}
          <Paper
            elevation={4}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "#fff3e0",
              borderLeft: "5px solid #ff9800",
            }}
          >
            <Typography variant="h6" color="info" gutterBottom>
              <Box display="flex" alignItems="center">
                <CreditCard sx={{ mr: 1 }} />
                Phương thức thanh toán
              </Box>
            </Typography>
            <Typography variant="body1">
              Thanh toán qua ngân hàng theo hướng dẫn trong quy trình đặt không gian.
            </Typography>
          </Paper>

          {/* Quy định chung */}
          <Paper
            elevation={4}
            sx={{
              p: 3,
              bgcolor: "#f8d7da",
              borderLeft: "5px solid #d32f2f",
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              <Box display="flex" alignItems="center">
                <Gavel sx={{ mr: 1 }} />
                Quy định chung
              </Box>
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  Không gây ồn ào, ảnh hưởng đến các không gian khác.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Bảo vệ tài sản và giữ vệ sinh sạch sẽ trong không gian.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Tuân thủ quy định pháp luật và chính sách an toàn.
                </Typography>
              </li>
            </ul>
          </Paper>

          {/* Lời cảm ơn */}
          <Typography
            variant="body1"
            align="center"
            sx={{
              fontWeight: "bold",
              mt: 3,
              color: "#4caf50",
              textTransform: "uppercase",
            }}
          >
            Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi
          </Typography>

          {/* Checkbox đồng ý chính sách */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAgreed}
                  onChange={handleAgreeChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Tôi đã hiểu và đồng ý với chính sách
                </Typography>
              }
              sx={{ userSelect: "none" }}
            />
          </Box>
        </DialogContent>

        {/* Nút đóng */}
        <DialogActions>
          <Button
            onClick={handleWarningClose}
            variant="contained"
            color="primary"
            disabled={!isAgreed}
            sx={{
              opacity: isAgreed ? 1 : 0.6,
              transition: "opacity 0.3s ease",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>


    </Container>
  );
};

export default BookingForm;
