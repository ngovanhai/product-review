import React, { useCallback, useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactStars from "react-stars";
import ModalPreview from "./ModalPreview";
import Layout2 from "./layout/Layout2";
// import Layout1 from "./layout/Layout1"
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
import { AddNoteMajor } from "@shopify/polaris-icons";
import {
  getSettings,
  saveSettingsReview,
  reloadSettings,
} from "../../../actions/settings";
import { FavoriteMajor } from "@shopify/polaris-icons";
import Layout1 from "./layout/Layout1";
;
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
    { label: "Overstock", value: "1" },
    { label: "Collateral", value: "2" },
    { label: "Masonry", value: "3" },
  ];

  const handleChange = useCallback(
    (_checked, newValue) => setchooseLayout(newValue),
    []
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
  const [chooseLayout, setchooseLayout] = useState("layout1");
  const [isPreview, setIsPreview] = useState(false);
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
                  <p style={{ padding: "10px 0px" }}>Choose Layout</p>
                  <Stack >
                    <RadioButton
                      label="Layout 1"
                      checked={chooseLayout === "layout1"}
                      id="layout1"
                      name="accounts"
                      onChange={handleChange}
                    />
                    <RadioButton
                      label="Layout 2"
                      id="layout2"
                      name="accounts"
                      checked={chooseLayout === "layout2"}
                      onChange={handleChange}
                    />
                  </Stack>
                </div>
                <div className="marginBottom">
                  <Select
                    options={chooseLayout == "layout1" ? options : options2}
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
                  chooseLayout={chooseLayout}
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
                    isPreview={isPreview}
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
                    selectedChangeLayout={selectedChangeLayout}
                    isPreview={isPreview}
                  />
                )}
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </div>

      {/* <div className="saveSettings">
        <Button primary onClick={() => handleSaveSettings(formdata)}>
          Save
        </Button>
      </div> */}
    </div>
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
