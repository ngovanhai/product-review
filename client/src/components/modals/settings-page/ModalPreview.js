import React, { useCallback, useState, useEffect } from "react";
import { connect } from "react-redux";
import {} from "../../../actions/reviews";
import { ViewMinor } from "@shopify/polaris-icons";
import jQuery from "jquery";

import {
  Card,
  Select,
  TextStyle,
  RadioButton,
  Stack,
  ButtonGroup,
  Subheading,
  Button,
  Layout,
  TextField,
  ProgressBar,
  DropZone,
  Modal,
  TextContainer,
  DisplayText,
} from "@shopify/polaris";
import Layout1 from "./layout/Layout1";
import Layout2 from "./layout/Layout2";
const ModalPreview = ({
  colorReview,
  valueSelectedStar,
  valueRadioRecommend,
  selectedChangeLayout,
  valueRadioPurchased,
  colorButtonBackground,
  colorButtontext,
  listHeadline,
  averageReview,
  reviewButton,
  ratingLabel,
  placeholderAuthorName,
  placeholderAuthorEmail,
  placeholderReviewTitle,
  placeholderReviewMessage,
  recommendLabel,
  agreeText,
  declineText,
  imageButton,
  buttonSubmit,
  reviewTitle,
  reviewMessage,
  authorName,
  authorEmail,
  chooseLayout,
}) => {
  const [active, setActive] = useState(false);
  const [statusForm, setStatusForm] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleShowNewReview = () => {
    jQuery(".reviews-form").toggle("slow", function () {});
  };
  const activator = (
    <Button size="slim" icon={ViewMinor} onClick={handleChange}>
      Preview
    </Button>
  );
  return (
    <Modal activator={activator} open={active} onClose={handleChange} large>
      <Modal.Section>
        <TextContainer>
          <div className="divPreview">
            <div style={{ marginBottom: "24px" }}>
              <DisplayText size="medium">{listHeadline}</DisplayText>
            </div>
            <div
              style={{
                margin: "10px 0 10px",
                display: "block",
                marginBottom: "50px",
              }}
              className="animate__animated animate__slideInDown reviews-form"
            >
              <div style={{ marginBottom: "9px", width: "50%" }}>
                <TextField
                  label={authorName + " *"}
                  placeholder={placeholderAuthorName}
                />
              </div>
              <div style={{ width: "50%", marginBottom: "9px" }}>
                <TextField
                  label={authorEmail + " *"}
                  placeholder={placeholderAuthorEmail}
                />
              </div>
              <div style={{ marginBottom: "9px" }}>
                <div>
                  <p>{ratingLabel}</p>
                </div>
                <div style={{ marginTop: "10px" }}>
                  <i
                    class="fas fa-star"
                    style={{
                      color: valueSelectedStar,
                      marginRight: "5px",
                      fontSize: "20px",
                    }}
                  ></i>
                  <i
                    class="fas fa-star"
                    style={{
                      color: valueSelectedStar,
                      marginRight: "5px",
                      fontSize: "20px",
                    }}
                  ></i>
                  <i
                    class="fas fa-star"
                    style={{
                      color: valueSelectedStar,
                      marginRight: "5px",
                      fontSize: "20px",
                    }}
                  ></i>
                  <i
                    class="fas fa-star"
                    style={{
                      color: valueSelectedStar,
                      marginRight: "5px",
                      fontSize: "20px",
                    }}
                  ></i>
                  <i
                    class="fas fa-star"
                    style={{
                      color: valueSelectedStar,
                      marginRight: "5px",
                      fontSize: "20px",
                    }}
                  ></i>
                </div>
              </div>
              <div style={{ marginBottom: "16px", width: "50%" }}>
                <TextField
                  label={reviewTitle + " *"}
                  placeholder={placeholderReviewTitle}
                />
              </div>
              <div style={{ marginBottom: "16px", width: "50%" }}>
                <TextField
                  label={reviewMessage + " *"}
                  placeholder={placeholderReviewMessage}
                  multiline={2}
                />
              </div>
              <p>{recommendLabel}</p>
              <div style={{ marginTop: "10px" }}>
                <Stack>
                  <RadioButton
                    label={agreeText}
                    checked={valueRadioRecommend === "yesShowRecommend"}
                    id="yesShowRecommend"
                    name="yesnoRecommend"
                    value="yesShowRecommend"
                  />
                  <RadioButton
                    label={declineText}
                    id="noShowRecommend"
                    name="yesnoRecommend"
                    value="noShowRecommend"
                    checked={valueRadioRecommend === "noShowRecommend"}
                  />
                </Stack>
              </div>
              <div
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {/* <div style={{ display: "flex" }}> */}
                {/* <div style={{ width: 50, height: 25 }}>
                      <DropZone type="image" disabled={true}>
                        <DropZone.FileUpload />
                      </DropZone>
                    </div> */}
                <button
                  className="Polaris-Button"
                  style={{
                    background: colorButtonBackground,
                    color: colorButtontext,
                    // float: "left",
                  }}
                >
                  {imageButton}
                </button>
                {/* </div> */}
              </div>
              {/* <div> */}
              <button
                className="Polaris-Button"
                style={{
                  background: colorButtonBackground,
                  color: colorButtontext,
                  // float: "right",
                }}
              >
                {buttonSubmit}
              </button>
              {/* </div> */}
            </div>

            {chooseLayout === "layout1" ? (
              <Layout1
                valueSelectedStar={valueSelectedStar}
                listHeadline={listHeadline}
                colorReview={colorReview}
                averageRevie={averageReview}
                colorButtonBackground={colorButtonBackground}
                colorButtontext={colorButtontext}
                reviewButton={reviewButton}
                valueRadioPurchased={valueRadioPurchased}
                valueRadioRecommend={valueRadioRecommend}
                selectedChangeLayout={selectedChangeLayout}
                isPreview={active}
                handleShowNewReview={handleShowNewReview}
              />
            ) : (
              <Layout2
                valueSelectedStar={valueSelectedStar}
                listHeadline={listHeadline}
                colorReview={colorReview}
                averageRevie={averageReview}
                colorButtonBackground={colorButtonBackground}
                colorButtontext={colorButtontext}
                reviewButton={reviewButton}
                valueRadioPurchased={valueRadioPurchased}
                valueRadioRecommend={valueRadioRecommend}
                isPreview={active}
                handleShowNewReview={handleShowNewReview}
              />
            )}
          </div>
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
};
const mapStateToProps = (state) => ({
  reviews: state.reviews,
});

export default connect(mapStateToProps, {})(ModalPreview);
