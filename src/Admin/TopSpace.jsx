import React from "react";
import { Container, Table } from "react-bootstrap";
import "../style/topSpace.css";

const TopSpace = () => {
  return (
    <Container className="topSpace">
      <Table className="table-no-border">
        <thead>
          <div style={{ padding: "10px", fontWeight: "bold", color: "gray" }}>
            Top Spaces
          </div>
          <tr className="text-center">
            <th>Tên</th>
            <th>hình ảnh</th>
            <th>Địa chỉ</th>
            <th>Số lượt book</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td>abc</td>
            <td>abc</td>
            <td>Hà Nội</td>
            <td>10</td>
            <td>Đang sử dụng</td>
          </tr>
          <tr className="text-center">
            <td>abc</td>
            <td>abc</td>
            <td>Hà Nội</td>
            <td>10</td>
            <td>Đang sử dụng</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default TopSpace;
