import React, { useEffect, useState } from "react";
import "../style/comment.css";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import {
  PencilFill,
  SendFill,
  ThreeDotsVertical,
  TrashFill,
} from "react-bootstrap-icons";
import { Constants } from "../utils/constants";

const Comment = () => {
  const { id } = useParams();
  const [listComments, setListComments] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const username = localStorage.getItem("username");
  const fullname = localStorage.getItem("fullname");
  const userId = localStorage.getItem("userId");

  const [selectedComment, setSelectedComment] = useState(null);
  const [updateInput, setUpdateInput] = useState(false);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState(null);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    const formattedDate = `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year}`;

    return formattedDate;
  };

  useEffect(() => {
    axios
      .get(`${Constants.apiHost}/reviews/` + id)
      .then((res) => {
        const sortedComments = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setListComments(sortedComments);
        console.log(sortedComments);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleDeleteComment = (e, index) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete" + index + "?")) {
      axios
        .delete(`${Constants.apiHost}/reviews/` + index)
        .then(() => {
          toast.success("Comment deleted successfully");
          setListComments(listComments.filter((t) => t._id !== index));
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };
  const handleCreate = (e) => {
    e.preventDefault();
    axios
      .post(`${Constants.apiHost}/reviews`, {
        text: text,
        rating: rating,
        spaceId: id,
        userId: userId,
      })

      .then((response) => {
        if (response.status === 201) {
          const newCommentId = response.data.newReview._id;
          const userId = response.data.newReview.userId;
          const time = response.data.newReview.createdAt;
          console.log(userId);
          console.log(newCommentId);
          setListComments([
            {
              _id: newCommentId,
              userId: { fullname: fullname },
              rating:rating,
              text: text,
              createdAt: time,
            },
            ...listComments,
          ]);
          toast.success("Comment created successfully");
          setText("");
          setRating(0)
          console.log(response.data);
        } else {
          console.log("Comment thất bại");
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };
  const handleUpdateComment = (index) => {
    axios
      .put(`${Constants.apiHost}/reviews/` + index, {
        text: editComment,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Edit comment successfully");
          axios
            .get(`${Constants.apiHost}/reviews/` + id)
            .then((res) => {
              const sortCmt = res.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              setListComments(sortCmt);
            })
            .catch((err) => {
              console.log(err.message);
            });
        } else {
          toast.error("Edit comment failed");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
    setEditComment("");
    setSelectedComment(null);
    setUpdateInput(false);
  };
  const handleEditCmt = (index, currentText) => {
    setEditComment(currentText);
    setSelectedComment(index);
    setUpdateInput(true);
  };
  const handleSelectComment = (index) => {
    setSelectedCommentIndex(index === selectedCommentIndex ? null : index);
  };

  const isCurrentUserComment = (commentUserId) => {
    return commentUserId === fullname;
  };

  return (
    <div class="cardd">
      <span class="title">Bình luận</span>
      {username && (
        <Row
          style={{
            border: "solid #CCC 1px",
            margin: "20px",
            display: "flex",
            boxShadow: "5px 10px 10px 5px #C0C0C0",
            height: "85px",
            borderRadius: "20px",
          }}
        >
          <Col md={10}>
            <Form className="d-flex align-items-center mt-4">
              <Image
                src="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
                roundedCircle
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <Form.Group
                controlId="commentInput"
                className="flex-grow-1 mr-2"
                style={{ marginRight: "15px" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Để lại cảm nhận của bạn "
                  value={text}
                  rows={2}
                  cols={30}
                  onChange={(e) => setText(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Col>
          {/* <Col md={1} className="d-flex align-items-center">
            <div className="rating" style={{ marginTop: "-15px" }}>
              <div className="radio">
                {[5,4,3,2,1].map((value) => (
                  <React.Fragment key={value}>
                    <input
                      value={value}
                      name="rating"
                      type="radio"
                      id={`rating-${value}`}
                      checked={rating === value}
                      onChange={() => setRating(value)} 
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
          </Col> */}
          <Col
            md={1}
            className="d-flex align-items-center justify-content-end"
            style={{ marginLeft: "auto" }}
          >
            {username && (
              <Button
                type="submit"
                style={{ backgroundColor: "#D3D3D3", border: "none" }}
                onClick={handleCreate}
              >
                <SendFill style={{ fontSize: "20px", color: "#696969" }} />
              </Button>
            )}
          </Col>
        </Row>
      )}
      {listComments.map((c, index) => (
        <div class="comments" key={index}>
          <div class="comment-react">
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
                  stroke-linecap="round"
                  stroke-width="2"
                  stroke="#707277"
                  d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
                ></path>
              </svg>
            </button>

            <hr />
            <span>14</span>
          </div>

          <div class="comment-container">
            <div class="user">
              <div class="user-pic">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linejoin="round"
                    fill="#707277"
                    stroke-linecap="round"
                    stroke-width="2"
                    stroke="#707277"
                    d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                  ></path>
                  <path
                    stroke-width="2"
                    fill="#707277"
                    stroke="#707277"
                    d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                  ></path>
                </svg>
              </div>
              <div class="user-info">
                <p style={{ fontSize: "15px", color: "black" }}>
                  {c.userId.fullname}
                </p>
                <small
                  style={{
                    display: "block",
                    marginTop: "-20px",
                    marginLeft: "10px",
                    color: "gray",
                    fontSize: "10px",
                  }}
                >
                  {formatDate(c.createdAt)}
                </small>
              </div>
            </div>
            <div className="d-flex">
              <div class="comment-content" style={{ marginLeft: "60px" }}>
                {updateInput && selectedComment === index ? (
                  <Row className="input-button-container">
                    <Col md={10} sm={10} xs={10}>
                      <input
                        className="text-muted"
                        style={{
                          fontSize: "15px",
                          width: "500px",
                          border: "none",
                          height: "40px",
                        }}
                        value={editComment}
                        rows={2}
                        cols={30}
                        onChange={(e) => setEditComment(e.target.value)}
                      ></input>
                    </Col>
                    <Col md={2} sm={2} xs={2}>
                      <Button
                        variant="primary"
                        type="submit"
                        onClick={() => handleUpdateComment(c._id)}
                        style={{
                          backgroundColor: "#EEEEEE",
                          border: "none",
                          marginBottom: "7px",
                        }}
                      >
                        <SendFill
                          style={{ fontSize: "20px", color: "#0099FF" }}
                        />
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <div>
                    <div
                      className="rating"
                      style={{ marginBottom: "5px", marginLeft: "14px" }}
                    >
                      {/* <div className="radio">
                        {[5, 4, 3, 2, 1].map((value) => (
                          <React.Fragment key={value}>
                            <input
                              value={value}
                              name={`rating-${c._id}`}
                              type="radio"
                              id={`rating-${c._id}-${value}`}
                              checked={c.rating === value}
                              readOnly
                            />
                            <label
                              title={`${value} star${value > 1 ? "s" : ""}`}
                              htmlFor={`rating-${c._id}-${value}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="13px"
                                viewBox="0 0 576 512"
                                fill={c.rating >= value ? "#FFD700" : "#e4e5e9"}
                              >
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                              </svg>
                            </label>
                          </React.Fragment>
                        ))}
                      </div> */}
                    </div>
                    <div
                      className="bg-light"
                      style={{
                        width: "auto",
                        height: "30px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <p
                        className="comment-text p-2 "
                        style={{ fontSize: "15px", color: "black" }}
                      >
                        {c.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ marginLeft: "300px" }}>
                {isCurrentUserComment(c.userId.fullname) && (
                  <>
                    <Button
                      style={{ border: "none", backgroundColor: "#FFFF" }}
                      onClick={() => handleSelectComment(index)}
                    >
                      <ThreeDotsVertical style={{ color: "#777777" }} />
                    </Button>
                  </>
                )}
                {isCurrentUserComment(c.userId.fullname) &&
                  selectedCommentIndex === index && (
                    <>
                      <Button
                        style={{
                          border: "none",
                          backgroundColor: "#FFFF",
                          marginLeft: "10px",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteComment(e, c._id);
                        }}
                      >
                        <TrashFill
                          style={{ color: "#FF0000", fontSize: "20px" }}
                        />
                      </Button>
                      <Button
                        style={{
                          border: "none",
                          backgroundColor: "#FFFF",
                          marginLeft: "10px",
                        }}
                        onClick={() => handleEditCmt(index, c.text)}
                      >
                        <PencilFill
                          style={{ color: "#0066FF", fontSize: "20px" }}
                        />
                      </Button>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comment;
