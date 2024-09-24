import React, { useState } from "react";
import "../style/comment.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PenFill, SendArrowUpFill, Trash3Fill } from "react-bootstrap-icons";


const Comment = () => {
  const [showReply, setShowReply] = useState(false); // state để điều khiển việc hiển thị hộp phản hồi
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Kiểm soát chế độ chỉnh sửa
  const [commentContent, setCommentContent] = useState(
    "I've been using this product for a few days now and I'm really impressed!"
  ); // Lưu trữ nội dung bình luận

  const toggleReply = () => {
    setShowReply(!showReply); // chuyển đổi trạng thái hiển thị
  };
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="card">
      <span className="title">Comments</span>
      <div className="comments">
        <div className="comment-react">
          <button>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#707277"
                strokeLinecap="round"
                strokeWidth="2"
                stroke="#707277"
                d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
              ></path>
            </svg>
          </button>
          <hr />
          <span>14</span>
        </div>

        <div className="comment-container">
          <div className="user">
            <div className="user-pic">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinejoin="round"
                  fill="#707277"
                  strokeLinecap="round"
                  strokeWidth="2"
                  stroke="#707277"
                  d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                ></path>
                <path
                  strokeWidth="2"
                  fill="#707277"
                  stroke="#707277"
                  d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                ></path>
              </svg>
            </div>
            <div className="user-info">
              <span>Yassine Zanina</span>
              <p>Wednesday, March 13th at 2:45pm</p>
            </div>
          </div>

          <div className="rating" style={{ marginTop: "-15px" }}>
            <div className="radio">
              {[5, 4, 3, 2, 1].map((value) => (
                <React.Fragment key={value}>
                  <input
                    value={value}
                    name="rating"
                    type="radio"
                    id={`rating-${value}`}
                  />
                  <label
                    title={`${value} star${value > 1 ? "s" : ""}`}
                    htmlFor={`rating-${value}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="13px"
                      viewBox="0 0 576 512"
                    >
                      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                    </svg>
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="comment-wrapper">
            {isEditing ? (
              <>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  style={{ width: '100%', height: '100px', fontSize: '16px' }} // Điều chỉnh kích thước và font-size
                />
                {/* Nút Lưu chỉ hiển thị khi đang chỉnh sửa */}
                <button onClick={() => setIsEditing(false)}>Lưu</button>
              </>
            ) : (
              <p className="comment-content">{commentContent}</p>
            )}

            <div className="options-menu">
              <div className="vertical-dots" onClick={toggleOptions}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>

              {showOptions && (
                <div className="options-dropdown">
                  <ul>
                    <li className="icon-container">
                      <div><PenFill onClick={() => setIsEditing(true)} /></div>

                      <div><Trash3Fill /></div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>


          {/* Nút phản hồi */}
          <div className="reply-button" onClick={toggleReply}>
            Phản hồi
          </div>


          {/* Hiển thị hộp phản hồi khi nhấn nút */}
          {showReply && (
            <div className="reply-box">
              <textarea placeholder="Reply comment..."></textarea>
              <div className="send-reply">
                <SendArrowUpFill />
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Phần bình luận mới */}
      <div className="text-box">
        <div className="box-container">
          <textarea placeholder=" Comment ....."></textarea>
          <div style={{ display: "flex" }}>
            <div className="formatting">
              <button type="button">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M5 6C5 4.58579 5 3.87868 5.43934 3.43934C5.87868 3 6.58579 3 8 3H12.5789C15.0206 3 17 5.01472 17 7.5C17 9.98528 15.0206 12 12.5789 12H5V6Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
              <button type="button">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M12 4H19"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M8 20L16 4"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M5 20H12"
                  ></path>
                </svg>
              </button>
              <button type="button">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M5.5 3V11.5C5.5 15.0899 8.41015 18 12 18C15.5899 18 18.5 15.0899 18.5 11.5V3"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M3 21H21"
                  ></path>
                </svg>
              </button>
              <button type="button">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M3 6H21"
                  ></path>
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M3 12H21"
                  ></path>
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M3 18H21"
                  ></path>
                </svg>
              </button>
              <button type="button">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    r="10"
                    cy="12"
                    cx="12"
                  ></circle>
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#707277"
                    d="M8 15C8.91212 16.2144 10.3643 17 12 17C13.6357 17 15.0879 16.2144 16 15"
                  ></path>
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="3"
                    stroke="#707277"
                    d="M8.00897 9L8 9M16 9L15.991 9"
                  ></path>
                </svg>
              </button>
            </div>
            <div style={{ marginLeft: "auto", marginRight: "30px", color: "blue" }}>
              <SendArrowUpFill style={{ fontSize: "25px" }} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
