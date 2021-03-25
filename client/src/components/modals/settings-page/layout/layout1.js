import { Card, Subheading, TextStyle } from "@shopify/polaris";
import React from "react";

function Layout1(props) {
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
    selectedChangeLayout,
    isPreview,
    handleShowNewReview,
  } = props;
  const onClickShowNewReview = () => {
    if (isPreview === true) {
      handleShowNewReview();
    }
  };
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

          <div style={{ display: "flex", marginBottom: "22px" }}>
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
            <div
              style={{
                paddingLeft: "20px",
                height: "52px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h1 style={{ fontWeight: "bold" }}>
                {averageReview} 1100 reviews
              </h1>
            </div>
          </div>
          <div style={{ height: "95px" }}>
            <div style={{ display: "flex", marginBottom: "7px" }}>
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
                {/* <i
                            class="fas fa-star"
                            style={{
                              color: valueSelectedStar,
                              marginRight: "5px",
                            }}
                          ></i>
                          <i
                            class="fas fa-star"
                            style={{
                              color: valueSelectedStar,
                              marginRight: "5px",
                            }}
                          ></i>
                          <i
                            class="fas fa-star"
                            style={{
                              color: valueSelectedStar,
                              marginRight: "5px",
                            }}
                          ></i>
                          <i
                            class="fas fa-star"
                            style={{
                              color: valueSelectedStar,
                              marginRight: "5px",
                            }}
                          ></i>
                          <i
                            class="fas fa-star"
                            style={{
                              color: valueSelectedStar,
                              marginRight: "5px",
                            }}
                          ></i> */}
              </div>
              <div className="statistical_bar">
                <div class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall">
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
                        <ProgressBar progress={75} size="small" />
                        </div> */}
              <h1>600</h1>
            </div>
            <div style={{ display: "flex", marginBottom: "7px" }}>
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
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
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
              <div className="statistical_bar">
                <div class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall">
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
              </div>
              <div>
                <h1>200</h1>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "7px" }}>
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
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
                <div class="rate">
                  <label
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
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
              <div className="statistical_bar">
                <div class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall">
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
              </div>
              <div>
                <h1>150</h1>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "7px" }}>
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
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
                <div class="rate">
                  <label
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
                <div class="rate">
                  <label
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
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
              <div className="statistical_bar">
                <div class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall">
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
                    {/* <span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}
                  </div>
                </div>
                <div id="PolarisPortalsContainer"></div>
              </div>
              <div>
                <h1>100</h1>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "7px" }}>
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
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
                <div class="rate">
                  <label
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
                <div class="rate">
                  <label
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
                <div class="rate">
                  <label
                    style={{ color: "#ccc" }}
                    for="star1"
                    title="text"
                  ></label>
                </div>
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
                          <ProgressBar progress={25} size="small" />
                        </div> */}
              <div className="statistical_bar">
                <div class="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall">
                  <progress
                    class="Polaris-ProgressBar__Progress"
                    value="25"
                    max="100"
                  ></progress>
                  <div
                    class="Polaris-ProgressBar__Indicator"
                    style={{
                      width: "25%",
                      backgroundColor: colorReview,
                    }}
                  >
                    {/* <span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}
                  </div>
                </div>
                <div id="PolarisPortalsContainer"></div>
              </div>
              <div>
                <h1>50</h1>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "30%",
            paddingLeft: "7px",
          }}
        >
          <div>
            <button
              className="Polaris-Button buttonWriteReview"
              style={{
                background: colorButtonBackground,
                color: colorButtontext,
                float: "right",
                borderRadius: "25px",
              }}
              onClick={onClickShowNewReview}
            >
              {reviewButton.toUpperCase()}
            </button>
            {/* <TextStyle variation="strong">{reviewButton}</TextStyle> */}
          </div>
          {/* <div style={{ display: "flex", margin: "10px 0 10px" }}>
                      <div>
                        <p>{ratingLabel}</p>
                      </div>
                      <div style={{ marginLeft: "23px" }}>
                        <i
                          class="fas fa-star"
                          style={{
                            color: valueSelectedStar,
                            marginRight: "5px",
                          }}
                        ></i>
                        <i
                          class="fas fa-star"
                          style={{
                            color: valueSelectedStar,
                            marginRight: "5px",
                          }}
                        ></i>
                        <i
                          class="fas fa-star"
                          style={{
                            color: valueSelectedStar,
                            marginRight: "5px",
                          }}
                        ></i>
                        <i
                          class="fas fa-star"
                          style={{
                            color: valueSelectedStar,
                            marginRight: "5px",
                          }}
                        ></i>
                        <i
                          class="fas fa-star"
                          style={{
                            color: valueSelectedStar,
                            marginRight: "5px",
                          }}
                        ></i>
                      </div>
                    </div>
                    <div style={{ display: "flex", marginBottom: "16px" }}>
                      <div style={{ marginRight: "9px", width: "50%" }}>
                        <TextField placeholder={placeholderAuthorName} />
                      </div>
                      <div style={{ width: "50%" }}>
                        <TextField placeholder={placeholderAuthorEmail} />
                      </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <TextField placeholder={placeholderReviewTitle} />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <TextField
                        placeholder={placeholderReviewMessage}
                        multiline={2}
                      />
                    </div>
                    <div
                      style={{
                        marginBottom: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <div style={{ width: 50, height: 25 }}>
                          <DropZone type="image" disabled={true}>
                            <DropZone.FileUpload />
                          </DropZone>
                        </div>
                        <p style={{ marginLeft: "10px", marginTop: "10px" }}>
                          {imageButton}
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        className="Polaris-Button"
                        style={{
                          background: colorButtonBackground,
                          color: colorButtontext,
                          float: "right",
                        }}
                      >
                        {buttonSubmit}
                      </button>
                    </div> */}
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
                marginTop: "19px",

                // borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
              }}
            >
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
              <div className="divNameLayoutOverstock">
                <i class="fas fa-user-circle avatar"></i>
                <p
                  className="nameAuthor"
                  style={{
                    padding: "5px",
                    display: "inline-block",
                  }}
                >
                  Lorem Ipsum
                </p>
                {valueRadioPurchased === "yesShowPurchase" && (
                  <span
                    style={{
                      color: "#22b345",
                      display: "inline-block",
                    }}
                  >
                    | Verified Purchase
                  </span>
                )}
                {valueRadioRecommend === "yesShowRecommend" && (
                  <div style={{ display: "inline-block" }}>
                    <span style={{ color: "#22b345", margin: "0 5px 0" }}>
                      |
                    </span>
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
              </div>

              <p className="time">- 1 day ago -</p>
              <p>Lorem Ipsum Dolor Sit Amet</p>
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
                marginTop: "19px",
                // borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
              }}
            >
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
              <div className="divNameLayoutOverstock">
                <i class="fas fa-user-circle avatar"></i>
                <p
                  className="nameAuthor"
                  style={{
                    padding: "5px",
                    display: "inline-block",
                  }}
                >
                  Lorem Ipsum
                </p>
                {valueRadioPurchased === "yesShowPurchase" && (
                  <span
                    style={{
                      color: "#22b345",
                      display: "inline-block",
                    }}
                  >
                    | Verified Purchase
                  </span>
                )}
                {valueRadioRecommend === "yesShowRecommend" && (
                  <div style={{ display: "inline-block" }}>
                    <span style={{ color: "#22b345", margin: "0 5px 0" }}>
                      |
                    </span>
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
              </div>

              <p className="time">- 1 day ago -</p>
              <p>Lorem Ipsum Dolor Sit Amet</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                blandit fringilla turpis at tempor. Maecenas ipsum nisi, semper
                nec urna et, tristique placerat ex. Vestibulum ultricies mauris
                elit, non maximus erat vehicula et.
              </p>
              <p>20 customers thought this review helpful!</p>
            </div>
          </div>
        </div>
      )}

      {/* layout collateral */}
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

export default Layout1;
