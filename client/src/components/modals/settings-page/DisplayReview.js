import React, { useCallback, useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactStars from "react-stars";
import ModalPreview from "./ModalPreview";

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
  Icon,
} from "@shopify/polaris";
import {
  AddNoteMajor
} from '@shopify/polaris-icons';
import {
  getSettings,
  saveSettingsReview,
  reloadSettings,
} from "../../../actions/settings";
import { FavoriteMajor } from "@shopify/polaris-icons";
import Layout2 from "./layout/Layout2";
const DisplayReviews = ({
  getSettings,
  saveSettingsReview,
  reloadSettings,
  settings: { dataSettings },
}) => {
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  //selected
  const [selectedChangeLayout, setSelectedChangeLayout] = useState(
    dataSettings.app_layout
  );
  const handleSelectChangeLayout = useCallback((value) => {
    setSelectedChangeLayout(value);
    setStatusButtonSave(true);
  }, []);

  const options = [
    { label: "Overstock", value: "1" },
    { label: "Collateral", value: "2" },
    { label: "Masonry", value: "3" },
  ];
  const options2 = [
    { label: "Overstock2", value: "1" },
    { label: "Collateral2", value: "2" },
    { label: "Masonry2", value: "3" },
  ];
  const [valueLayout, setValueLayout] = useState('layout1');
  const handleChange = useCallback(
    (_checked, newValue) => setValueLayout(newValue),
    [],
  );
  //select star
  const [valueSelectedStar, setValueSelectedStar] = useState(
    dataSettings.star_style
  );
  // const handleChangeSelectedStar = useCallback(
  //   (_checked, newValue) => setValueSelectedStar(newValue),
  //   []
  // );
  //color

  const [colorButtonBackground, setColorButtonBackground] = useState(
    dataSettings.button_color
  );
  const [colorButtontext, setColorButtontext] = useState(
    dataSettings.button_textcolor
  );
  const [colorReview, setColorReview] = useState(dataSettings.progress_color);

  //selected purchased
  const [valueRadioPurchased, setValueRadioPurchased] = useState(
    dataSettings.show_purchase
  );
  const handleChangeRadioPurchased = useCallback((_checked, newValue) => {
    setValueRadioPurchased(newValue);
    setStatusButtonSave(true);
  }, []);
  //selected recommend
  const [valueRadioRecommend, setValueRadioRecommend] = useState(
    dataSettings.show_recommend
  );
  const handleChangeRadioRecommend = useCallback((_checked, newValue) => {
    setValueRadioRecommend(newValue);
    setStatusButtonSave(true);
  }, []);
  //selected only show featured
  const [valueRadioFeatured, setValueRadioFeatured] = useState(
    dataSettings.show_featured
  );
  const handleChangeRadioFeatured = useCallback((_checked, newValue) => {
    setValueRadioFeatured(newValue);
    setStatusButtonSave(true);
  }, []);
  const formdata = {
    show_featured: valueRadioFeatured,
    show_purchase: valueRadioPurchased,
    show_recommend: valueRadioRecommend,
    app_layout: selectedChangeLayout,
    star_style: valueSelectedStar,
    button_color: colorButtonBackground,
    button_textcolor: colorButtontext,
    progress_color: colorReview,
  };

  const handleSaveSettings = useCallback((formdata) => {
    setStatusButtonSave(false);
    reloadSettings();
    saveSettingsReview(formdata);
    setTimeout(() => {
      getSettings();
    }, 1500);
  }, []);
  const cancelSave = useCallback(async () => {
    setStatusButtonSave(false);
    setSelectedChangeLayout(dataSettings.app_layout);
    setValueSelectedStar(dataSettings.star_style);
    setColorButtonBackground(dataSettings.button_color);
    setColorButtontext(dataSettings.button_textcolor);
    setColorReview(dataSettings.progress_color);
    setValueRadioPurchased(dataSettings.show_purchase);
    setValueRadioRecommend(dataSettings.show_recommend);
    setValueRadioFeatured(dataSettings.show_featured);
    // await getSettings();
  }, []);
  const [statusButtonSave, setStatusButtonSave] = useState(false);
  //PREVIEW:
  const [listHeadline, setListHeadline] = useState(dataSettings.reviews_title);
  const [averageReview, setAverageReview] = useState(dataSettings.text_average);
  const [reviewButton, setReviewButton] = useState(dataSettings.form_button);
  const [ratingLabel, setRatingLabel] = useState(dataSettings.form_rating);
  const [placeholderAuthorName, setPlaceholderAuthorName] = useState(
    dataSettings.form_author_desc
  );
  const [placeholderAuthorEmail, setPlaceholderAuthorEmail] = useState(
    dataSettings.form_email_desc
  );

  const [placeholderReviewTitle, setPlaceholderReviewTitle] = useState(
    dataSettings.form_title_desc
  );
  const [placeholderReviewMessage, setPlaceholderReviewMessage] = useState(
    dataSettings.form_review_desc
  );
  const [recommendLabel, setRecommendLabel] = useState(
    dataSettings.form_recommend
  );
  const [agreeText, setAgreeText] = useState(dataSettings.text_agree);

  const [declineText, setDeclineText] = useState(dataSettings.text_decline);

  const [authorName, setAuthorName] = useState(dataSettings.form_author);
  const [authorEmail, setAuthorEmail] = useState(dataSettings.form_email);
  const [reviewTitle, setReviewTitle] = useState(dataSettings.form_title);
  const [reviewMessage, setReviewMessage] = useState(dataSettings.form_review);

  // const [recommendLabel, setRecommendLabel] = useState(
  //   dataSettings.form_recommend
  // );
  // const [agreeText, setAgreeText] = useState(dataSettings.text_agree);
  // const [declineText, setDeclineText] = useState(dataSettings.text_decline);
  const [imageButton, setImageButton] = useState(dataSettings.form_upload);
  const [buttonSubmit, setButtonSubmit] = useState(
    dataSettings.form_button_submit
  );
  return (
    <div>
      {statusButtonSave && (
        <div
          className="animate__animated animate__fadeIn"
          style={{
            width: "100vw",
            height: "46px",
            position: "-webkit-sticky",
            // position: "sticky",
            position: "fixed",
            top: 0,
            right: 0,
            backgroundColor: "black",
            zIndex: "1000",
            display: "flex",
          }}
        >
          <div className="textSaveChange">
            <TextStyle>Unsaved changes</TextStyle>
          </div>
          <div className="divGroupChange">
            <ButtonGroup>
              <Button onClick={cancelSave}>Cancel</Button>
              <Button onClick={() => handleSaveSettings(formdata)} primary>
                Save
              </Button>
            </ButtonGroup>
          </div>
        </div>
      )}
      <div id="display-reviews" className="session-setting">
        {/* <div className="session-settings_header"> */}
        {/* <h1 id="title-settings">Reviews Layout</h1> */}

        {/* </div> */}
        <Layout>
          <Layout.Section oneHalf>
            <Card>
              <div style={{ padding: "20px" }}>
                <div style={{ padding: "0 0 20px 0" }}>
                  <Subheading>Design</Subheading>
                  <p>Choose Layout</p>
                  <Stack vertical>
                    <RadioButton
                      label="Layout 1"
                      checked={valueLayout === 'layout1'}
                      id="layout1"
                      name="accounts"
                      onChange={handleChange}
                    />
                    <RadioButton
                      label="Layout 2"
                      id="layout2"
                      name="accounts"
                      checked={valueLayout === 'layout2'}
                      onChange={handleChange}
                    />
                  </Stack>
                </div>
                <div className="marginBottom">
                  <Select
                    options={valueLayout == "layout1" ? options : options2}
                    onChange={handleSelectChangeLayout}
                    value={selectedChangeLayout}
                  />

                </div>
                <div className="groupChangeColor">
                  <div className="rowColor">
                    <TextField
                      label="Choose rating star's style"
                      value={valueSelectedStar}
                      onChange={(e) => {
                        setValueSelectedStar(e);
                        setStatusButtonSave(true);
                      }}
                    />
                    <input
                      type="color"
                      value={valueSelectedStar}
                      onChange={(e) => {
                        setValueSelectedStar(e.target.value);
                        setStatusButtonSave(true);
                      }}
                      style={{
                        height: "44px",
                        border: "none",
                        width: "44px",
                        padding: "0px",
                        marginLeft: "5px",
                        marginTop: "24px",
                      }}
                    />
                  </div>
                  <div className="rowColor">
                    <TextField
                      label="Button background color"
                      value={colorButtonBackground}
                      onChange={(e) => {
                        setColorButtonBackground(e);
                        setStatusButtonSave(true);
                      }}
                    />
                    <input
                      type="color"
                      value={colorButtonBackground}
                      onChange={(e) => {
                        setColorButtonBackground(e.target.value);
                        setStatusButtonSave(true);
                      }}
                      style={{
                        height: "44px",
                        border: "none",
                        width: "44px",
                        padding: "0px",
                        marginLeft: "5px",
                        marginTop: "24px",
                      }}
                    />
                  </div>
                </div>
                <div className="groupChangeColor">
                  <div className="rowColor">
                    <TextField
                      label="Button text color"
                      value={colorButtontext}
                      onChange={(e) => {
                        setColorButtontext(e);
                        setStatusButtonSave(true);
                      }}
                    />
                    <input
                      type="color"
                      value={colorButtontext}
                      onChange={(e) => {
                        setColorButtontext(e.target.value);
                        setStatusButtonSave(true);
                      }}
                      style={{
                        height: "44px",
                        border: "none",
                        width: "44px",
                        padding: "0px",
                        marginLeft: "5px",
                        marginTop: "24px",
                      }}
                    />
                  </div>
                  <div className="rowColor">
                    <TextField
                      label="Main color"
                      value={colorReview}
                      onChange={(e) => {
                        setColorReview(e);
                        setStatusButtonSave(true);
                      }}
                    />
                    <input
                      type="color"
                      value={colorReview}
                      onChange={(e) => {
                        setColorReview(e.target.value);
                        setStatusButtonSave(true);
                      }}
                      style={{
                        height: "44px",
                        border: "none",
                        width: "44px",
                        padding: "0px",
                        marginLeft: "5px",
                        marginTop: "24px",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div id="display-purchased">
                <Card>
                  <div className="session-settings_content">
                    <div style={{ padding: "0 0 20px 0" }}>
                      <Subheading>Show "Verified Purchased"</Subheading>
                    </div>
                    <Stack vertical>
                      <RadioButton
                        label="Yes"
                        helpText="The customer can see the reviewer's 'Verified Purchase' icon and text."
                        checked={valueRadioPurchased === "yesShowPurchase"}
                        id="yesShowPurchase"
                        name="yesNoPurchased"
                        onChange={handleChangeRadioPurchased}
                      />
                      <RadioButton
                        label="No"
                        helpText="The customer can't see the reviewer's 'Verified Purchase' icon and text."
                        id="noShowPurchase"
                        name="yesNoPurchased"
                        checked={valueRadioPurchased === "noShowPurchase"}
                        onChange={handleChangeRadioPurchased}
                      />
                    </Stack>
                  </div>
                </Card>
              </div>
              <div id="display-recommend">
                <Card>
                  {/* <div className="session-settings_header">
                    <h1 id="title-settings">Show "Recommend Customer" text</h1>
                    <div className="session-settings_content"></div>
                  </div> */}
                  <div className="session-settings_content">
                    <div style={{ padding: "0 0 20px 0" }}>
                      <Subheading>Show "Recommend Customer" text</Subheading>
                    </div>
                    <Stack vertical>
                      <RadioButton
                        label="Yes"
                        helpText="The customer can see the reviewer's 'Recommend Customer' icon and text."
                        checked={valueRadioRecommend === "yesShowRecommend"}
                        id="yesShowRecommend"
                        name="yesNoRecommend"
                        onChange={handleChangeRadioRecommend}
                      />
                      <RadioButton
                        label="No"
                        helpText="The customer can't see the reviewer's 'Recommend Customer' icon and text."
                        id="noShowRecommend"
                        name="yesNoRecommend"
                        checked={valueRadioRecommend === "noShowRecommend"}
                        onChange={handleChangeRadioRecommend}
                      />
                    </Stack>
                  </div>
                </Card>
              </div>
              <div id="display-featured">
                <Card>
                  <div className="session-settings_content">
                    <div style={{ padding: "0 0 20px 0" }}>
                      <Subheading>Only show featured reviews</Subheading>
                    </div>
                    <Stack vertical>
                      <RadioButton
                        label="Yes"
                        helpText="Only Featured review to are display."
                        checked={valueRadioFeatured === "yesShowFeatured"}
                        id="yesShowFeatured"
                        name="yesNoFeatured"
                        onChange={handleChangeRadioFeatured}
                      />
                      <RadioButton
                        label="No"
                        helpText="All reviews are displayed."
                        id="noShowFeatured"
                        name="yesNoFeatured"
                        checked={valueRadioFeatured === "noShowFeatured"}
                        onChange={handleChangeRadioFeatured}
                      />
                    </Stack>
                  </div>
                </Card>
              </div>
            </Card>
          </Layout.Section>

          <Layout.Section oneHalf>
            <Card>
              <div style={{ padding: "20px" }}>
                <ModalPreview
                  colorReview={colorReview}
                  valueSelectedStar={valueSelectedStar}
                  valueRadioRecommend={valueRadioRecommend}
                  selectedChangeLayout={selectedChangeLayout}
                  valueRadioPurchased={valueRadioPurchased}
                  colorButtonBackground={colorButtonBackground}
                  colorButtontext={colorButtontext}
                  listHeadline={listHeadline}
                  averageReview={averageReview}
                  reviewButton={reviewButton}
                  ratingLabel={ratingLabel}
                  placeholderAuthorName={placeholderAuthorName}
                  placeholderAuthorEmail={placeholderAuthorEmail}
                  placeholderReviewTitle={placeholderReviewTitle}
                  placeholderReviewMessage={placeholderReviewMessage}
                  recommendLabel={recommendLabel}
                  agreeText={agreeText}
                  declineText={declineText}
                  authorName={authorName}
                  authorEmail={authorEmail}
                  reviewTitle={reviewTitle}
                  reviewMessage={reviewMessage}
                  imageButton={imageButton}
                  buttonSubmit={buttonSubmit}
                />
                {/* <div
                  style={{
                    display: "flex",
                    width: "100%",
                    marginTop: "19px",
                    height: "300px",
                  }}
                > */}
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
                />





                {/* <div style={{ width: "70%", paddingRight: "7px" }}>
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
                        <h1 style={{ fontSize: "23px", color: "white" }}>
                          4.1
                        </h1>
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
                          </div> */}
                {/*---------------- <i
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


                {/* </div>
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
                              }} */}

                {/* --------------- <span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}

                {/* </div>
                          </div>
                          <div id="PolarisPortalsContainer"></div>
                        </div> */}


                {/* ------------------- <div
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

                {/* <h1>600</h1>
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
                        </div> */}
                {/*  -------------------- <div
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


                {/* <div className="statistical_bar">
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
                            > */}
                {/* ---------------------- <span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}
                {/* </div>
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
                        </div> */}
                {/* ------------------ <div
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


                {/* <div className="statistical_bar">
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
                {/* </div>
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
            </div>  */}


                {/* ---------------------------- <div
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



                {/* <div className="statistical_bar">
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
                            > */}
                {/*  ------------------<span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}
                {/* </div>
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
                        </div> */}


                {/* -------------------------- <div
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


                {/*<div className="statistical_bar">
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
                            > */}


                {/* <span class="Polaris-ProgressBar__Label">
                                75%
                              </span> */}



                {/* ---------- </div>
                          </div>
                          <div id="PolarisPortalsContainer"></div>
                        </div>
                        <div>
                          <h1>50</h1>
                        </div>
                      </div>
                    </div>
                  </div> */}




                {/* 
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

                      >
                        <Icon
                          source={AddNoteMajor}
                        />  {reviewButton.toUpperCase()}
                      </button> */}
                {/* <TextStyle variation="strong">{reviewButton}</TextStyle> */}
                {/* </div> */}
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
                {/* </div>
                </div> */}
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
                              <span
                                style={{ color: "#22b345", margin: "0 5px 0" }}
                              >
                                |
                              </span>
                              <img
                                src="https://apps.omegatheme.com/customer-reviews/assets/images/recommend.png"
                                title="I recommend this!"
                                alt="icon-recommend"
                              ></img>
                              <span
                                style={{ color: "#22b345", marginLeft: "5px" }}
                              >
                                I recommend this!
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="time">- 1 day ago -</p>
                        <p>Lorem Ipsum Dolor Sit Amet</p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed blandit fringilla turpis at tempor. Maecenas
                          ipsum nisi, semper nec urna et, tristique placerat ex.
                          Vestibulum ultricies mauris elit, non maximus erat
                          vehicula et.
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
                              <span
                                style={{ color: "#22b345", margin: "0 5px 0" }}
                              >
                                |
                              </span>
                              <img
                                src="https://apps.omegatheme.com/customer-reviews/assets/images/recommend.png"
                                title="I recommend this!"
                                alt="icon-recommend"
                              ></img>
                              <span
                                style={{ color: "#22b345", marginLeft: "5px" }}
                              >
                                I recommend this!
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="time">- 1 day ago -</p>
                        <p>Lorem Ipsum Dolor Sit Amet</p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed blandit fringilla turpis at tempor. Maecenas
                          ipsum nisi, semper nec urna et, tristique placerat ex.
                          Vestibulum ultricies mauris elit, non maximus erat
                          vehicula et.
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
                              <span
                                style={{ color: "#22b345", marginLeft: "5px" }}
                              >
                                I recommend this!
                              </span>
                            </div>
                          )}
                          {valueRadioPurchased === "yesShowPurchase" && (
                            <span
                              style={{ color: "#22b345", marginLeft: "2px" }}
                            >
                              | Verified Purchase
                            </span>
                          )}
                          <br></br>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed blandit fringilla turpis at tempor.
                            Maecenas ipsum nisi, semper nec urna et, tristique
                            placerat ex. Vestibulum ultricies mauris elit, non
                            maximus erat vehicula et.
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
                              <span
                                style={{ color: "#22b345", marginLeft: "5px" }}
                              >
                                I recommend this!
                              </span>
                            </div>
                          )}
                          {valueRadioPurchased === "yesShowPurchase" && (
                            <span
                              style={{ color: "#22b345", marginLeft: "2px" }}
                            >
                              | Verified Purchase
                            </span>
                          )}
                          <br></br>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed blandit fringilla turpis at tempor.
                            Maecenas ipsum nisi, semper nec urna et, tristique
                            placerat ex. Vestibulum ultricies mauris elit, non
                            maximus erat vehicula et.
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
                            <TextStyle variation="strong">
                              Lorem ipsum
                            </TextStyle>
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed blandit fringilla turpis at tempor.
                            Maecenas ipsum nisi, semper nec urna et, tristique
                            placerat ex.
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
                            <TextStyle variation="strong">
                              Lorem ipsum
                            </TextStyle>
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed blandit fringilla turpis at tempor.
                            Maecenas ipsum nisi, semper nec urna et, tristique
                            placerat ex.
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
                            <TextStyle variation="strong">
                              Lorem ipsum
                            </TextStyle>
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed blandit fringilla turpis at tempor.
                            Maecenas ipsum nisi, semper nec urna et, tristique
                            placerat ex.
                          </p>
                          <br></br>
                          <time className="time-settings">11/21/2018</time>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Layout.Section>
        </Layout >
      </div >

      {/* <div className="saveSettings">
        <Button primary onClick={() => handleSaveSettings(formdata)}>
          Save
        </Button>
      </div> */}
    </div >
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps, {
  getSettings,
  saveSettingsReview,
  reloadSettings,
})(DisplayReviews);
