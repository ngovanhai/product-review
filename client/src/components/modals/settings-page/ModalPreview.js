import React, { useCallback, useState, useEffect } from "react";
import { connect } from "react-redux";
import { } from "../../../actions/reviews";
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
    jQuery(".reviews-form").toggle("slow", function () { });
  };
  console.log(imageButton);
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
                display: "none",
                marginBottom: "50px",
              }}
              className="animate__animated animate__slideInDown reviews-form"
            >

              <div style={{ marginBottom: "9px" }}>
                <div>
                  <p style={{ fontWeight: "bold" }}>{ratingLabel}</p>
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

              <div style={{ marginBottom: "9px", width: "50%" }}>
                <TextField
                  id="titleName"
                  label={authorName + " *"}
                  placeholder={placeholderAuthorName}
                />
              </div>
              <div style={{ width: "50%", marginBottom: "9px" }}>
                <TextField
                  id="titleEmail"
                  label={authorEmail + " *"}
                  placeholder={placeholderAuthorEmail}
                />
              </div>

              <div style={{ marginBottom: "16px", width: "50%" }}>
                <TextField
                  id="titleComment"
                  label={reviewTitle + " *"}
                  placeholder={placeholderReviewTitle}
                />
              </div>
              <div style={{ marginBottom: "16px", width: "50%" }}>
                <TextField
                  id="titleMessage"
                  label={reviewMessage + " *"}
                  placeholder={placeholderReviewMessage}
                  multiline={2}
                />
              </div>
              <p style={{ fontWeight: "bold" }}>{recommendLabel}</p>
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
              <div className="btn-upload-image" style={{ display: "flex" }}>
                <div className="image-upload" >
                  <i class="fas fa-upload"></i>
                </div>
                <div className="text-upload-image" style={{ marginLeft: "20px" }}>
                  <p style={{ fontWeight: "bold" }}>{imageButton}</p>
                  <p > <i style={{ color: "#c4cdd5" }}>Accept .jpg, .png, .svg and max size 2MB </i></p>
                </div>

              </div>

              {/* <div> */}
              <div className="btn-add-review">
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
              </div>
              <p></p>
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
                selectedChangeLayout={selectedChangeLayout}
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
