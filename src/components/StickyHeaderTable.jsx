import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import * as React from "react";

// Các cột của bảng
const columns = [
  { id: "name", label: "Tên", minWidth: 170 },
  { id: "numOfBook", label: "Số đơn", minWidth: 100 },
  {
    id: "avenue",
    label: "Tổng tiền (VND)",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("vi-VN"),
  },
];

// Tùy chỉnh TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    background: "linear-gradient(to right, #4caf50, #81c784)",
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: 14,
    textAlign: "center",
  },
  "&.MuiTableCell-body": {
    fontSize: 14,
    color: theme.palette.text.secondary,
    textAlign: "center",
  },
}));

// Tùy chỉnh TableRow
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#ffffff",
  },
  "&:hover": {
    backgroundColor: "#e8f5e9",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease-in-out",
  },
}));

export default function StickyHeadTable({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 4,
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        padding: 2,
        background: "linear-gradient(to bottom, #ffffff, #f3f4f6)",
      }}
    >
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-toolbar": {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
          },
          "& .MuiSelect-select": {
            fontSize: 14,
            borderRadius: "12px",
          },
          "& .MuiTablePagination-actions button": {
            background: "linear-gradient(to right, #4caf50, #81c784)",
            color: "white",
            borderRadius: "50%",
            padding: "6px",
            margin: "0 4px",
            "&:hover": {
              background: "#66bb6a",
            },
          },
        }}
      />
    </Paper>
  );
}
