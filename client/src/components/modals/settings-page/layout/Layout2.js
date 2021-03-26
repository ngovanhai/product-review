import { Card, Icon, Subheading, TextStyle } from "@shopify/polaris";
import React from "react";
import { AddNoteMajor } from "@shopify/polaris-icons";

function Layout2(props) {
  const {
    valueSelectedStar,
    listHeadline,
    colorReview,
    averageReview,
    colorButtonBackground,
    colorButtontext,
    reviewButton,
    valueRadioPurchased,
    valueRadioRecommend,
    isPreview,
    handleShowNewReview,
    selectedChangeLayout
  } = props;
  const onClickShowNewReview = () => {
    if (isPreview === true) {
      handleShowNewReview();
    }
  };
  console.log("la", selectedChangeLayout);
  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          marginTop: "19px",
          height: "300px",
        }}
      >
        <div style={{ width: "70%", paddingRight: "7px" }}>
          <div style={{ marginBottom: "24px" }}>
            <TextStyle variation="strong">{listHeadline}</TextStyle>
          </div>
          <div
            style={{ height: "95px", display: "flex" }}
            className="statistical"
          >
            <div
              style={{ width: "30%", marginBottom: "22px", marginTop: "25px" }}
              className="scoreRate"
            >
              <div
                style={{
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                Average
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    background: colorReview,
                    width: "50px",
                    height: "52px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "3px",
                  }}
                >
                  <h1 style={{ fontSize: "23px", color: "white" }}>4.1</h1>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    display: "flex",
                    marginRight: "10px",
                    marginLeft: "10px",
                    marginTop: "10px",
                  }}
                >
                  <div class="rate" style={{ marginRight: "-5px" }}>
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate" style={{ marginRight: "-5px" }}>
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate" style={{ marginRight: "-5px" }}>
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate" style={{ marginRight: "-5px" }}>
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate" style={{ marginRight: "-5px" }}>
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h3 style={{ fontWeight: "bold" }}>
                  {averageReview} 1100 reviews
                </h3>
              </div>
            </div>

            <div style={{ width: "70%" }}>
              <div style={{ display: "flex", marginBottom: "7px" }}>
                <div
                  className="nameRate"
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Excellent
                </div>
                <div className="statistical_bar" style={{ width: "65%" }}>
                  <div
                    class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall"
                    style={{ height: "0.4rem" }}
                  >
                    <progress
                      class="Polaris-ProgressBar__Progress"
                      value="90"
                      max="100"
                    ></progress>
                    <div
                      class="Polaris-ProgressBar__Indicator"
                      style={{
                        width: "90%",
                        backgroundColor: colorReview,
                      }}
                    >
                      {/* <span class="Polaris-ProgressBar__Label">
                                        75%
                              </span> */}
                    </div>
                  </div>
                  <div id="PolarisPortalsContainer"></div>
                  <span
                    className="count-comment"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginTop: "5px",
                      left: "80%",
                    }}
                  >
                    600
                    <span
                      class="r--rate-after"
                      style={{ borderTopColor: "rgba(253, 188, 0, 0.8)" }}
                    ></span>
                    <span
                      class="r--rate-before"
                      style={{ borderTopColor: "rgb(253, 188, 0)" }}
                    ></span>
                  </span>
                </div>
                <div></div>
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: "7px",
                  margin: "17px 0px",
                }}
              >
                <div
                  className="nameRate"
                  className="nameRate"
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Very Good
                </div>
                {/* <div
                          style={{
                            marginLeft: "23px",
                            marginRight: "23px",
                            width: "40%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ProgressBar progress={50} size="small" />
                        </div> */}
                <div className="statistical_bar" style={{ width: "65%" }}>
                  <div
                    class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall"
                    style={{ height: "0.4rem" }}
                  >
                    <progress
                      class="Polaris-ProgressBar__Progress"
                      value="75"
                      max="100"
                    ></progress>
                    <div
                      class="Polaris-ProgressBar__Indicator"
                      style={{
                        width: "75%",
                        backgroundColor: colorReview,
                      }}
                    >
                      {/* <span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}
                    </div>
                  </div>
                  <div id="PolarisPortalsContainer"></div>
                  <div
                    className="count-comment"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginTop: "5px",
                      left: "65%",
                    }}
                  >
                    200
                    <span
                      class="r--rate-after"
                      style={{ borderTopColor: "rgba(253, 188, 0, 0.8)" }}
                    ></span>
                    <span
                      class="r--rate-before"
                      style={{ borderTopColor: "rgb(253, 188, 0)" }}
                    ></span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: "7px",
                  margin: "17px 0px",
                }}
              >
                <div
                  className="nameRate"
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Average
                </div>
                {/* <div
                          style={{
                            marginLeft: "23px",
                            marginRight: "23px",
                            width: "40%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ProgressBar progress={40} size="small" />
                        </div> */}
                <div className="statistical_bar" style={{ width: "65%" }}>
                  <div
                    class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall"
                    style={{ height: "0.4rem" }}
                  >
                    <progress
                      class="Polaris-ProgressBar__Progress"
                      value="40"
                      max="100"
                    ></progress>
                    <div
                      class="Polaris-ProgressBar__Indicator"
                      style={{
                        width: "40%",
                        backgroundColor: colorReview,
                      }}
                    >
                      {/* <span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}
                    </div>
                  </div>
                  <div id="PolarisPortalsContainer"></div>
                  <div
                    className="count-comment"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginTop: "5px",
                      left: "30%",
                    }}
                  >
                    200
                    <span
                      class="r--rate-after"
                      style={{ borderTopColor: "rgba(253, 188, 0, 0.8)" }}
                    ></span>
                    <span
                      class="r--rate-before"
                      style={{ borderTopColor: "rgb(253, 188, 0)" }}
                    ></span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: "7px",
                  margin: "17px 0px",
                }}
              >
                <div
                  className="nameRate"
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Poor
                </div>
                {/* <div
                          style={{
                            marginLeft: "23px",
                            marginRight: "23px",
                            width: "40%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ProgressBar progress={30} size="small" />
                        </div> */}
                <div className="statistical_bar" style={{ width: "65%" }}>
                  <div
                    class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall"
                    style={{ height: "0.4rem" }}
                  >
                    <progress
                      class="Polaris-ProgressBar__Progress"
                      value="30"
                      max="100"
                    ></progress>
                    <div
                      class="Polaris-ProgressBar__Indicator"
                      style={{
                        width: "25%",
                        backgroundColor: colorReview,
                      }}
                    >
                    </div>
                  </div>
                  <div id="PolarisPortalsContainer"></div>
                  <div
                    className="count-comment"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginTop: "5px",
                      left: "15%",
                    }}
                  >
                    100
                    <span
                      class="r--rate-after"
                      style={{ borderTopColor: "rgba(253, 188, 0, 0.8)" }}
                    ></span>
                    <span
                      class="r--rate-before"
                      style={{ borderTopColor: "rgb(253, 188, 0)" }}
                    ></span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: "7px",
                  margin: "17px 0px",
                }}
              >
                <div
                  className="nameRate"
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Terrible
                </div>
                <div className="statistical_bar" style={{ width: "65%" }}>
                  <div
                    class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall"
                    style={{ height: "0.4rem" }}
                  >
                    <progress
                      class="Polaris-ProgressBar__Progress"
                      value="0"
                      max="100"
                    ></progress>
                    <div
                      class="Polaris-ProgressBar__Indicator"
                      style={{
                        width: "0%",
                        backgroundColor: colorReview,
                      }}
                    >
                      {/* <span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}
                    </div>
                  </div>
                  <div id="PolarisPortalsContainer"></div>
                  <div
                    className="count-comment"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginTop: "5px",
                      left: "0%",
                    }}
                  >
                    0
                    <span
                      class="r--rate-after"
                      style={{ borderTopColor: "rgba(253, 188, 0, 0.8)" }}
                    ></span>
                    <span
                      class="r--rate-before"
                      style={{ borderTopColor: "rgb(253, 188, 0)" }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "30%",
            paddingLeft: "7px",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: "40%" }}>
            <button
              onClick={onClickShowNewReview}
              className="Polaris-Button buttonWriteReview"
              style={{
                background: colorButtonBackground,
                color: colorButtontext,
                float: "right",
                borderRadius: "25px",
                borderRadius: "5px",
              }}
            >
              {/* <Icon source={AddNoteMajor} id="hihi" /> */}
              <i class="fas fa-feather-alt" style={{ marginRight: "5px" }}></i>
              {reviewButton.toUpperCase()}
            </button>
            {/* <TextStyle variation="strong">{reviewButton}</TextStyle> */}
          </div>
        </div>
      </div>
      {selectedChangeLayout === "1" && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              borderRadius: "4px",
              boxShadow: "0 4px 15px rgba(0,0,0,.1)",
              padding: "15px 25px 1px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#f2f2f2",
                width: "140px",
                borderRadius: "25px",
              }}
            >
              <div
                className="author"
                style={{
                  backgroundColor: "#5ecd62",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  width: "30px",
                  alignItems: "center",
                  borderRadius: "50%",
                }}
              >
                <div> L</div>
              </div>
              <p
                className="nameAuthor"
                style={{
                  padding: "5px",
                  display: "inline-block",
                  color: "black",
                }}
              >
                Lorem Ipsum
            </p>
            </div>
            <div
              style={{
                marginTop: "15px",
                // borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    marginRight: "10px",
                  }}
                >
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                </div>
                <div className="divNameLayoutOverstock" style={{ margin: "0px" }}>
                  <div className="iconCheck">
                    <i
                      class="fas fa-check-circle"
                      style={{ color: "#22b345" }}
                    ></i>
                  </div>

                  {valueRadioPurchased === "yesShowPurchase" && (
                    <span
                      className="purchase"
                      style={{
                        color: "#22b345",
                      }}
                    >
                      Verified Purchase
                    </span>
                  )}

                  {valueRadioRecommend === "yesShowRecommend" && (
                    <div style={{ display: "inline-block" }}>
                      <span style={{ color: "#22b345", marginLeft: "5px" }}>
                        I recommend this!
                    </span>
                    </div>
                  )}
                  <p className="time" style={{ marginLeft: "10px" }}>
                    1 day ago
                </p>
                </div>
              </div>

              <p className="title-comment">Lorem Ipsum Dolor Sit Amet</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                blandit fringilla turpis at tempor. Maecenas ipsum nisi, semper
                nec urna et, tristique placerat ex. Vestibulum ultricies mauris
                elit, non maximus erat vehicula et.
            </p>
              <p>20 customers thought this review helpful!</p>
            </div>
          </div>
          <div
            style={{
              borderRadius: "4px",
              boxShadow: "0 4px 15px rgba(0,0,0,.1)",
              padding: "15px 25px 1px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#f2f2f2",
                width: "140px",
                borderRadius: "25px",
              }}
            >
              <div
                className="author"
                style={{
                  backgroundColor: "#dcd857",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  width: "30px",
                  alignItems: "center",
                  borderRadius: "50%",
                }}
              >
                <div>P</div>
              </div>
              <p
                className="nameAuthor"
                style={{
                  padding: "5px",
                  display: "inline-block",
                  color: "black",
                }}
              >
                Peter
            </p>
            </div>
            <div
              style={{
                marginTop: "15px",
                // borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    marginRight: "10px",
                  }}
                >
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                </div>
                <div className="divNameLayoutOverstock" style={{ margin: "0px" }}>
                  <div className="iconCheck">
                    <i
                      class="fas fa-check-circle"
                      style={{ color: "#22b345" }}
                    ></i>
                  </div>

                  {valueRadioPurchased === "yesShowPurchase" && (
                    <span
                      className="purchase"
                      style={{
                        color: "#22b345",
                      }}
                    >
                      Verified Purchase
                    </span>
                  )}

                  {valueRadioRecommend === "yesShowRecommend" && (
                    <div style={{ display: "inline-block" }}>
                      <span style={{ color: "#22b345", marginLeft: "5px" }}>
                        I recommend this!
                    </span>
                    </div>
                  )}
                  <p className="time" style={{ marginLeft: "10px" }}>
                    1 day ago
                </p>
                </div>
              </div>

              <p className="title-comment">Lorem Ipsum Dolor Sit Amet</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                blandit fringilla turpis at tempor. Maecenas ipsum nisi, semper
                nec urna et, tristique placerat ex. Vestibulum ultricies mauris
                elit, non maximus erat vehicula et.
            </p>
              <p>20 customers thought this review helpful!</p>
            </div>
          </div>
        </div>)}

      {selectedChangeLayout === "2" && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              borderRadius: "4px",
              boxShadow: "0 4px 15px rgba(0,0,0,.1)",
              marginBottom: "15px",
              padding: "15px 25px 1px",
            }}
          >
            <div
              style={{
                marginTop: "19px",
                // borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
              }}
            >
              <div style={{ padding: "5px", display: "flex" }}>
                <Subheading>
                  Lorem Ipsum Dolor Sit Amet By Lorem Ipsum
                </Subheading>
                <small style={{ marginLeft: "5px" }}>
                  Reviewed by Lorem ipsum (1 day ago)
                </small>
              </div>
              <p>
                {valueRadioRecommend === "yesShowRecommend" && (
                  <div style={{ display: "inline-block" }}>
                    <img
                      src="https://apps.omegatheme.com/customer-reviews/assets/images/recommend.png"
                      title="I recommend this!"
                      alt="icon-recommend"
                    ></img>
                    <span style={{ color: "#22b345", marginLeft: "5px" }}>
                      I recommend this!
                    </span>
                  </div>
                )}
                {valueRadioPurchased === "yesShowPurchase" && (
                  <span style={{ color: "#22b345", marginLeft: "2px" }}>
                    | Verified Purchase
                  </span>
                )}
                <br></br>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  blandit fringilla turpis at tempor. Maecenas ipsum nisi,
                  semper nec urna et, tristique placerat ex. Vestibulum
                  ultricies mauris elit, non maximus erat vehicula et.
                </p>
                <br></br>
                <TextStyle variation="strong">RATING</TextStyle>
                <br></br>
                <div
                  style={{
                    display: "flex",
                    marginRight: "10px",
                  }}
                >
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                </div>
                <p>20 customers thought this review helpful!</p>
              </p>
            </div>
          </div>
          <div
            style={{
              borderRadius: "4px",
              boxShadow: "0 4px 15px rgba(0,0,0,.1)",
              marginBottom: "15px",
              padding: "15px 25px 1px",
            }}
          >
            <div
              style={{
                marginTop: "19px",
                // borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
              }}
            >
              <div style={{ padding: "5px", display: "flex" }}>
                <Subheading>
                  Lorem Ipsum Dolor Sit Amet By Lorem Ipsum
                </Subheading>
                <small style={{ marginLeft: "5px" }}>
                  Reviewed by Lorem ipsum (1 day ago)
                </small>
              </div>
              <p>
                {valueRadioRecommend === "yesShowRecommend" && (
                  <div style={{ display: "inline-block" }}>
                    <img
                      src="https://apps.omegatheme.com/customer-reviews/assets/images/recommend.png"
                      title="I recommend this!"
                      alt="icon-recommend"
                    ></img>
                    <span style={{ color: "#22b345", marginLeft: "5px" }}>
                      I recommend this!
                    </span>
                  </div>
                )}
                {valueRadioPurchased === "yesShowPurchase" && (
                  <span style={{ color: "#22b345", marginLeft: "2px" }}>
                    | Verified Purchase
                  </span>
                )}
                <br></br>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  blandit fringilla turpis at tempor. Maecenas ipsum nisi,
                  semper nec urna et, tristique placerat ex. Vestibulum
                  ultricies mauris elit, non maximus erat vehicula et.
                </p>
                <br></br>
                <TextStyle variation="strong">RATING</TextStyle>
                <br></br>
                <div
                  style={{
                    display: "flex",
                    marginRight: "10px",
                  }}
                >
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                </div>
                <p>20 customers thought this review helpful!</p>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* layout masonry */}
      {selectedChangeLayout === "3" && (
        <div className="divLayOutMasonry">
          <div className="divChildLayoutMasonry">
            <Card>
              <img
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "7%",
                  marginBottom: "10px",
                }}
                alt="product"
                src="https://cdn.shopify.com/s/files/1/0002/3796/1256/t/2/assets/5494_UTB82eZrkrnJXKJkSahGq6xhzFXay.jpg"
              ></img>
              <br></br>
              <div
                style={{
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  <i class="fas fa-user-circle avatar"></i>
                  <TextStyle variation="strong">Lorem ipsum</TextStyle>
                  {valueRadioPurchased === "yesShowPurchase" && (
                    <img
                      src="https://apps.omegatheme.com/customer-reviews/assets/images/checked.png"
                      title="Verified Purchase"
                      alt="icon-purchase"
                    ></img>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginRight: "10px",
                    justifyContent: "center",
                  }}
                >
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                </div>
                {valueRadioRecommend === "yesShowRecommend" && (
                  <img
                    src="https://apps.omegatheme.com/customer-reviews/assets/images/recommend.png"
                    title="I recommend this!"
                    alt="icon-recommend"
                  ></img>
                )}
                <p style={{ fontWeight: "500", fontSize: "12px" }}>
                  Lorem ipsum dolor sit amet
                </p>
                <br></br>

                <p style={{ fontSize: "12px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  blandit fringilla turpis at tempor. Maecenas ipsum nisi,
                  semper nec urna et, tristique placerat ex.
                </p>
                <br></br>
                <time className="time-settings">11/21/2018</time>
              </div>
            </Card>
          </div>
          <div className="divChildLayoutMasonry">
            <Card>
              <img
                style={{
                  width: "100%",
                  height: "230px",
                  borderRadius: "7%",
                  marginBottom: "10px",
                }}
                alt="product"
                src="https://cdn.shopify.com/s/files/1/0002/3796/1256/t/2/assets/7220_UTB8_V.0kDzIXKJkSafVq6yWgXXan.jpg"
              ></img>
              <br></br>
              <div style={{ textAlign: "center", padding: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  <i class="fas fa-user-circle avatar"></i>
                  <TextStyle variation="strong">Lorem ipsum</TextStyle>
                  {valueRadioPurchased === "yesShowPurchase" && (
                    <img
                      src="https://apps.omegatheme.com/customer-reviews/assets/images/checked.png"
                      title="Verified Purchase"
                      alt="icon-purchase"
                    ></img>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginRight: "10px",
                    justifyContent: "center",
                  }}
                >
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                </div>
                {valueRadioRecommend === "yesShowRecommend" && (
                  <img
                    src="https://apps.omegatheme.com/customer-reviews/assets/images/recommend.png"
                    title="I recommend this!"
                    alt="icon-recommend"
                  ></img>
                )}
                <p style={{ fontWeight: "500", fontSize: "12px" }}>
                  Lorem ipsum dolor sit amet
                </p>
                <br></br>
                <p style={{ fontSize: "12px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  blandit fringilla turpis at tempor. Maecenas ipsum nisi,
                  semper nec urna et, tristique placerat ex.
                </p>
                <br></br>
                <time className="time-settings">11/21/2018</time>
              </div>
            </Card>
          </div>
          <div className="divChildLayoutMasonry">
            <Card>
              <img
                style={{
                  width: "100%",
                  height: "200px",
                  marginBottom: "10px",
                  borderRadius: "7%",
                }}
                alt="product"
                src="https://cdn.shopify.com/s/files/1/0002/3796/1256/t/2/assets/8712_UTB8SVJLjMnJXKJkSaelq6xUzXXa7.jpg"
              ></img>
              <br></br>
              <div style={{ textAlign: "center", padding: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  <i class="fas fa-user-circle avatar"></i>
                  <TextStyle variation="strong">Lorem ipsum</TextStyle>
                  {valueRadioPurchased === "yesShowPurchase" && (
                    <img
                      src="https://apps.omegatheme.com/customer-reviews/assets/images/checked.png"
                      title="Verified Purchase"
                      alt="icon-purchase"
                    ></img>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    marginRight: "10px",
                    justifyContent: "center",
                  }}
                >
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                  <div class="rate">
                    <label
                      style={{ color: valueSelectedStar }}
                      for="star1"
                      title="text"
                    ></label>
                  </div>
                </div>
                {valueRadioRecommend === "yesShowRecommend" && (
                  <img
                    src="https://apps.omegatheme.com/customer-reviews/assets/images/recommend.png"
                    title="I recommend this!"
                    alt="icon-recommend"
                  ></img>
                )}
                <p style={{ fontWeight: "500", fontSize: "12px" }}>
                  Lorem ipsum dolor sit amet
                </p>
                <br></br>
                <p style={{ fontSize: "12px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  blandit fringilla turpis at tempor. Maecenas ipsum nisi,
                  semper nec urna et, tristique placerat ex.
                </p>
                <br></br>
                <time className="time-settings">11/21/2018</time>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout2;
