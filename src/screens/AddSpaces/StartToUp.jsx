import React from 'react';
import { Link } from 'react-router-dom';

const StartToUp = () => {
  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#ffffff',
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
      marginTop: '50px',
      position: 'relative',
    },
    leftSection: {
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '150px',
    },
    rightSection: {
      flex: 1,
      padding: '20px',
    },
    logo: {
      width: '30px',
      height: '30px',
    },
    title: {
      fontSize: '40px',
      fontWeight: 'bold',
      marginTop: '20px',
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    stepNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginRight: '10px',
    },
    stepContent: {
      flex: 1,
    },
    stepTitle: {
      fontSize: '25px',
      fontWeight: 'bold',
    },
    stepDescription: {
      fontSize: '20px',
      color: '#555555',
    },
    stepImage: {
      width: '140px',
      height: '140px',
      marginLeft: '10px',
    },
    backButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      backgroundColor: '#ffffff',
      border: '1px solid #dddddd',
      borderRadius: '5px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    startButton: {
      display: 'block',
      width: '100px',
      margin: '20px auto',
      padding: '10px',
      backgroundColor: '#ff385c',
      color: '#ffffff',
      textAlign: 'center',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    divider: {
      borderTop: '1px solid #dddddd',
      margin: '20px 0',
    },
  };

  return (
    <div style={styles.container}>
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <button style={styles.backButton}>Trở về</button>
      </Link>
      <div style={styles.leftSection}>
        <div style={styles.title}>Bắt đầu trên SpaceHub thật dễ dàng</div>
      </div>
      <div style={styles.rightSection}>
        <div style={styles.step}>
          <div style={styles.stepNumber}>1</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>
              Chia sẻ thông tin về không gian của bạn cho chúng tôi
            </div>
            <div style={styles.stepDescription}>
              Chia sẻ một số thông tin cơ bản, như vị trí của không gian cho
              thuê...
            </div>
          </div>
          <img
            src="https://storage.googleapis.com/a1aa/image/ZSKjbWf61hxKMCgiZxWckmzb9gmZXMjePZQxZdQYejmwzranA.jpg"
            alt="Bed illustration"
            style={styles.stepImage}
          />
        </div>
        <div style={styles.divider}></div>
        <div style={styles.step}>
          <div style={styles.stepNumber}>2</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>
              Làm cho không gian cho thuê trở nên nổi bật
            </div>
            <div style={styles.stepDescription}>
              Thêm ảnh cùng với tiêu đề và nội dung mô tả – chúng tôi sẽ giúp
              bạn thực hiện.
            </div>
          </div>
          <img
            src="https://storage.googleapis.com/a1aa/image/uXFgHrUbx4IBN52q9JmM9esll9et29KDH1d5J29Vekb3zranA.jpg"
            alt="Living room illustration"
            style={styles.stepImage}
          />
        </div>
        <div style={styles.divider}></div>
        <div style={styles.step}>
          <div style={styles.stepNumber}>3</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>Hoàn thiện và đăng mục cho thuê</div>
            <div style={styles.stepDescription}>
              Chọn giá khởi điểm, một vài thông tin cần thiết, sau đó đăng mục
              cho thuê của bạn.
            </div>
          </div>
          <img
            src="https://storage.googleapis.com/a1aa/image/GN2X9kDCZn5OLlVfJwfNsCppl9DEMdXnSZyykFePq1tvzranA.jpg"
            alt="Door illustration"
            style={styles.stepImage}
          />
        </div>
        <Link to={"/alladd"} style={{ textDecoration: "none" }}>
          <button style={styles.startButton}>Bắt đầu</button>
        </Link>
      </div>
    </div>
  );
};

export default StartToUp;
