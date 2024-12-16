import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Modal, Spinner } from 'react-bootstrap';
import {
  CheckCircle,
  PencilSquare,
  PlusCircle,
  Trash,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import ConfirmPassword from './ConfirmPassword';
import { Constants } from '../utils/constants';

const BankAccount = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openConfirmPwd, setOpenConfirmPwd] = useState(false);

  const [loadingUserData, setLoadingUserData] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    bank: '',
    accountNumber: '',
  });
  const [banks, setBanks] = useState([]);
  const [modalType, setModalType] = useState(null); // 'edit' or 'add'
  const [defaultPaymentAccount, setDefaultPaymentAccount] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserData();
    fetchBankAccounts();
    fetchBanks();
  }, [userId]);

  const fetchUserData = async () => {
    setLoadingUserData(true);
    try {
      const response = await axios.get(`${Constants.apiHost}/users/${userId}`);
      setUserData(response.data);
      setDefaultPaymentAccount(response.data?.defaultBankAccount?._id);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Không thể tải dữ liệu người dùng.');
    } finally {
      setLoadingUserData(false);
    }
  };

  const fetchBankAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Constants.apiHost}/bankaccount/${userId}`
      );
      if (Array.isArray(response.data)) {
        setBankAccounts(response.data);
      } else {
        setError('Dữ liệu không hợp lệ.');
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setError('Không thể tải dữ liệu tài khoản ngân hàng.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${Constants.apiHost}/bank`);
      setBanks(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
      setError('Không thể tải danh sách ngân hàng.');
    }
  };

  const handleEditClick = (account) => {
    setEditingId(account._id);
    setEditForm({
      bank: account.bank?._id || '',
      accountNumber: account.accountNumber,
    });
    setModalType('edit');
  };

  const handleAddClick = () => {
    setEditingId(null);
    setEditForm({ bank: '', accountNumber: '' });
    setModalType('add');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axios.put(`${Constants.apiHost}/bankaccount/${editingId}`, {
          bank: editForm.bank,
          accountNumber: editForm.accountNumber,
        });
        setSuccess('Cập nhật tài khoản ngân hàng thành công.');
      } else {
        await axios.post(`${Constants.apiHost}/bankaccount`, {
          bank: editForm.bank,
          accountNumber: editForm.accountNumber,
          user: userId,
        });
        setSuccess('Thêm tài khoản ngân hàng thành công.');
      }
      fetchBankAccounts();
      setModalType(null);
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast.error(
        error?.response?.data?.message ??
          'Không thể cập nhật hoặc thêm tài khoản ngân hàng.'
      );

      setError('Không thể cập nhật hoặc thêm tài khoản ngân hàng.');
    }
  };

  const openPwdConfirm = () => {
    if (bankAccounts.length === 0) {
      handleSave();
    } else {
      setOpenConfirmPwd(true);
    }
  };
  // const openPwdConfirm = () => {
  //   setOpenConfirmPwd(true);
  // };

  const handleDelete = async (accountId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?')) {
      try {
        await axios.delete(`${Constants.apiHost}/bankaccount/${accountId}`);
        setSuccess('Xóa tài khoản ngân hàng thành công.');
        fetchBankAccounts();
      } catch (error) {
        console.error('Error deleting bank account:', error);
        setError('Không thể xóa tài khoản ngân hàng.');
      }
    }
  };

  const handleDefaultChange = async (accountId) => {
    try {
      await axios.put(`${Constants.apiHost}/users/def/${userId}`, {
        defaultBankAccountId: accountId,
      });
      setDefaultPaymentAccount(accountId);
      setSuccess('Cập nhật tài khoản thanh toán mặc định thành công.');
      fetchBankAccounts();
    } catch (error) {
      console.error('Error updating default payment account:', error);
      setError('Không thể cập nhật tài khoản thanh toán mặc định.');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 3000);
  });

  return (
    <div
      className="p-4"
      style={{
        maxWidth: '600px',
        margin: 'auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h2 className="text-center mb-4">Danh sách tài khoản ngân hàng</h2>
      {loading ? (
        <Spinner animation="border" className="d-block mx-auto" />
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Button variant="primary" className="mb-3" onClick={handleAddClick}>
            <PlusCircle className="me-2" /> Thêm tài khoản ngân hàng
          </Button>
          <ul className="list-unstyled">
            {bankAccounts.map((account) => (
              <li key={account._id} className="mb-3">
                <Card
                  className={`shadow-sm ${defaultPaymentAccount === account._id ? 'border border-primary' : ''}`}
                  style={
                    defaultPaymentAccount === account._id
                      ? { borderWidth: '2px', borderColor: '#007bff' }
                      : {}
                  }
                >
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      {account.bank?.imageUrl && (
                        <img
                          src={account.bank.imageUrl}
                          alt={`${account.bank.bankName} Logo`}
                          style={{
                            width: '50px',
                            height: 'auto',
                            marginRight: '10px',
                          }}
                        />
                      )}
                      <h5 className="mb-0">{account?.bank?.bankName}</h5>
                      {defaultPaymentAccount === account._id ? (
                        <span
                          style={{ marginLeft: 'auto', fontWeight: 'bold' }}
                        >
                          <CheckCircle className="text-success me-1" /> Tài
                          khoản thanh toán
                        </span>
                      ) : (
                        <Form.Check
                          type="checkbox"
                          label="Tài khoản thanh toán"
                          checked={defaultPaymentAccount === account._id}
                          onChange={() => handleDefaultChange(account._id)}
                          style={{ marginLeft: 'auto' }}
                        />
                      )}
                    </div>
                    <p>Số tài khoản: {account.accountNumber}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        variant="outline-dark"
                        onClick={() => handleEditClick(account)}
                      >
                        <PencilSquare className="me-2" /> Chỉnh sửa
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(account._id)}
                      >
                        <Trash className="me-2" /> Xóa
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
      <Modal show={!!modalType} onHide={() => setModalType(null)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'edit'
              ? 'Chỉnh sửa tài khoản ngân hàng'
              : 'Thêm tài khoản ngân hàng'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {openConfirmPwd && bankAccounts.length > 0 ? (
            // {openConfirmPwd ? (
            <ConfirmPassword
              setOpenConfirmPwd={setOpenConfirmPwd}
              handleSave={handleSave}
            />
          ) : (
            <>
              {editForm.bank && (
                <div className="mb-3">
                  <img
                    src={
                      banks.find((bank) => bank._id === editForm.bank)?.imageUrl
                    }
                    alt="Current Bank Logo"
                    style={{
                      width: '50px',
                      height: 'auto',
                      marginRight: '10px',
                    }}
                  />
                </div>
              )}
              <Form.Group>
                <Form.Label>Ngân hàng</Form.Label>
                <Form.Control
                  as="select"
                  name="bank"
                  value={editForm.bank}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn ngân hàng</option>
                  {banks.map((bank) => (
                    <option key={bank._id} value={bank._id}>
                      {bank.bankName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Số tài khoản</Form.Label>
                <Form.Control
                  type="text"
                  name="accountNumber"
                  value={editForm.accountNumber}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalType(null)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={openPwdConfirm}>
            {modalType === 'edit' ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BankAccount;
