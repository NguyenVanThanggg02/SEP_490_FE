import React from "react";
import { Container, Table } from "react-bootstrap";
import "../style/topSpace.css";

const TopSpaceHeader = () => (
  <div style={{ padding: "10px", fontWeight: "bold", color: "gray" }}>
    Top Spaces
  </div>
);

const TableRow = ({ name, image, address, bookings, status }) => (
  <tr className="text-center">
    <td>{name}</td>
    <td>{image}</td>
    <td>{address}</td>
    <td>{bookings}</td>
    <td>{status}</td>
  </tr>
);

const TopSpace = () => {
  const spaces = [
    { name: "abc", image: "abc", address: "Hà Nội", bookings: 10, status: "Đang sử dụng" },
    { name: "abc", image: "abc", address: "Hà Nội", bookings: 10, status: "Đang sử dụng" },
  ];

  return (
    <Container className="topSpace">
      <Table className="table-no-border">
        <thead>
          <TopSpaceHeader />
          <tr className="text-center">
            <th>Tên</th>
            <th>Hình ảnh</th>
            <th>Địa chỉ</th>
            <th>Số lượt book</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space, index) => (
            <TableRow
              key={index}
              name={space.name}
              image={space.image}
              address={space.address}
              bookings={space.bookings}
              status={space.status}
            />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TopSpace;
