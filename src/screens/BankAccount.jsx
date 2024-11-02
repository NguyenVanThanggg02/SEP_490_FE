import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner, Card, Image } from "react-bootstrap";
import axios from "axios";

const BankAccount = () => {
  const userId = localStorage.getItem("userId");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [defaultBankAccount, setDefaultBankAccount] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchBankAccounts();
      fetchBanks();
    } else {
      setError("Không tìm thấy ID người dùng.");
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/users/${userId}`);
      if (response.data && response.data.defaultBankAccount) {
        setDefaultBankAccount(response.data.defaultBankAccount?._id);
      } else {
        setError("Không tìm thấy thông tin tài khoản người dùng.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Không thể tải thông tin người dùng.");
    }
  };

  const fetchBankAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:9999/bankaccount/${userId}`
      );
      if (Array.isArray(response.data)) {
        setBankAccounts(response.data);
      } else {
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      setError("Không thể tải dữ liệu tài khoản ngân hàng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await axios.get("http://localhost:9999/bank");
      if (Array.isArray(response.data)) {
        setBanks(response.data);
      } else {
        setError("Dữ liệu ngân hàng không hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      setError("Không thể tải dữ liệu ngân hàng.");
    }
  };

  const handleInputChange = (accountId, field, value) => {
    setBankAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account._id === accountId ? { ...account, [field]: value } : account
      )
    );
  };

  const handleSaveBankAccount = async (accountId) => {
    const accountToUpdate = bankAccounts.find((acc) => acc._id === accountId);
    try {
      await axios.put(
        `http://localhost:9999/bankaccount/${accountId}`,
        accountToUpdate
      );
      setSuccess("Cập nhật thông tin tài khoản ngân hàng thành công!");
      setEditingAccountId(null);
      await fetchBankAccounts(); // Refetch bank accounts to update the UI
    } catch (error) {
      console.error("Error saving bank account:", error);
      setError("Cập nhật thông tin tài khoản ngân hàng thất bại.");
    }
  };

  const handleDeleteBankAccount = async (accountId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:9999/bankaccount/${accountId}`);
        setSuccess("Xóa tài khoản ngân hàng thành công!");
        await fetchBankAccounts(); // Refetch bank accounts after deletion
      } catch (error) {
        console.error("Error deleting bank account:", error);
        setError("Xóa tài khoản ngân hàng thất bại.");
      }
    }
  };

  const handleAddBank = async (newBank) => {
    try {
      await axios.post("http://localhost:9999/bank", newBank); // Assuming newBank has the required structure
      setSuccess("Thêm ngân hàng thành công!");
      await fetchBanks(); // Refetch banks to include the newly added one
    } catch (error) {
      console.error("Error adding bank:", error);
      setError("Thêm ngân hàng thất bại.");
    }
  };

  const BankAccountForm = ({ account }) => (
    <Card
      className={`mb-3 ${account._id === defaultBankAccount ? "border-primary" : ""}`}
      style={
        account._id === defaultBankAccount ? { backgroundColor: "#e7f1ff" } : {}
      }
    >
      <Card.Body>
        <Form.Group>
          <Form.Label>Ngân hàng:</Form.Label>
          <div className="d-flex align-items-center">
            <Image
              src={account.bank?.imageUrl || "https://via.placeholder.com/30"}
              rounded
              style={{ width: "60px", height: "60px", marginRight: "10px" }}
            />
            <Form.Control
              as="select"
              value={account.bank?._id || ""}
              onChange={(e) =>
                handleInputChange(account._id, "bank", e.target.value)
              }
              disabled={editingAccountId !== account._id}
            >
              <option value="">Chọn ngân hàng</option>
              {banks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.bankName}
                </option>
              ))}
            </Form.Control>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Số tài khoản:</Form.Label>
          <Form.Control
            type="text"
            value={account.accountNumber || ""}
            onChange={(e) =>
              handleInputChange(account._id, "accountNumber", e.target.value)
            }
            disabled={editingAccountId !== account._id}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          {account._id === defaultBankAccount ? (
            <strong>Tài khoản mặc định.</strong>
          ) : (
            <Form.Check
              type="checkbox"
              label="Đặt làm tài khoản mặc định"
              checked={account.isDefault || false}
              onChange={(e) =>
                handleInputChange(account._id, "isDefault", e.target.checked)
              }
              disabled={!editingAccountId}
            />
          )}
        </Form.Group>
      </Card.Body>
      {account.isDefault && (
        <Card.Footer className="bg-success text-white">
          <strong>Tài khoản này là tài khoản mặc định.</strong>
        </Card.Footer>
      )}
      <Card.Footer>
        {editingAccountId === account._id ? (
          <>
            <Button
              variant="success"
              onClick={() => handleSaveBankAccount(account._id)}
            >
              Lưu
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditingAccountId(null)}
              className="ml-2"
            >
              Hủy
            </Button>
          </>
        ) : (
          <Button
            variant="outline-dark"
            onClick={() => setEditingAccountId(account._id)}
          >
            Chỉnh sửa
          </Button>
        )}
        <Button
          variant="outline-danger"
          onClick={() => handleDeleteBankAccount(account._id)}
          className="ml-2"
        >
          Xóa
        </Button>
      </Card.Footer>
    </Card>
  );

  return (
    <div className="p-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {bankAccounts.length > 0 ? (
            bankAccounts.map((account) => (
              <BankAccountForm key={account._id} account={account} />
            ))
          ) : (
            <p>Không có tài khoản ngân hàng nào.</p>
          )}
        </div>
      )}
      <Button
        variant="outline-success"
        onClick={() =>
          handleAddBank({
            bankName: "Ngân Hàng Mới",
            imageUrl: "https://via.placeholder.com/30",
          })
        } // Example new bank data
      >
        Thêm tài khoản ngân hàng
      </Button>
    </div>
  );
};

export default BankAccount;
