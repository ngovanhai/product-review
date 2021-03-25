import React, { useCallback, useState, useEffect } from "react";
import { connect } from "react-redux";
import config from "../../../config/config";
import axios from "axios";

import { displayError } from "../../../actions/importUrl";
import {
  Card,
  Button,
  TextField,
  ButtonGroup,
  TextStyle,
  Layout,
  ProgressBar,
  DropZone,
  RadioButton,
  Stack,
} from "@shopify/polaris";
import ModalPreview from "./ModalPreview";
import Loading from "../../../components/contents/Spinner";

import {
  saveSettingsCustomize,
  reloadSettings,
  getSettings,
} from "../../../actions/settings";
const DisplayCustomizeText = ({
  saveSettingsCustomize,
  reloadSettings,
  getSettings,
  displayError,
  settings: { dataSettings },
}) => {
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  //form text
  const [authorName, setAuthorName] = useState(dataSettings.form_author);
  const handleChangeAuthorName = useCallback((newValue) => {
    setAuthorName(newValue);
    setStatusButtonSave(true);
  }, []);

  const [placeholderAuthorName, setPlaceholderAuthorName] = useState(
    dataSettings.form_author_desc
  );
  const handleChangePlaceholderAuthorName = useCallback((newValue) => {
    setPlaceholderAuthorName(newValue);
    setStatusButtonSave(true);
  }, []);

  const [authorEmail, setAuthorEmail] = useState(dataSettings.form_email);
  const handleChangeAuthorEmail = useCallback((newValue) => {
    setAuthorEmail(newValue);
    setStatusButtonSave(true);
  }, []);

  const [placeholderAuthorEmail, setPlaceholderAuthorEmail] = useState(
    dataSettings.form_email_desc
  );
  const handleChangePlaceholderAuthorEmail = useCallback((newValue) => {
    setPlaceholderAuthorEmail(newValue);
    setStatusButtonSave(true);
  }, []);

  const [reviewTitle, setReviewTitle] = useState(dataSettings.form_title);
  const handleChangeReviewTitle = useCallback((newValue) => {
    setReviewTitle(newValue);
    setStatusButtonSave(true);
  }, []);

  const [placeholderReviewTitle, setPlaceholderReviewTitle] = useState(
    dataSettings.form_title_desc
  );
  const handleChangePlaceholderReviewTitle = useCallback((newValue) => {
    setPlaceholderReviewTitle(newValue);
    setStatusButtonSave(true);
  }, []);
  const [reviewMessage, setReviewMessage] = useState(dataSettings.form_review);
  const handleChangeReviewMessage = useCallback((newValue) => {
    setReviewMessage(newValue);
    setStatusButtonSave(true);
  }, []);

  const [placeholderReviewMessage, setPlaceholderReviewMessage] = useState(
    dataSettings.form_review_desc
  );
  const handleChangePlaceholderReviewMessage = useCallback((newValue) => {
    setPlaceholderReviewMessage(newValue);
    setStatusButtonSave(true);
  }, []);

  const [reviewButton, setReviewButton] = useState(dataSettings.form_button);
  const handleChangeReviewButton = useCallback((newValue) => {
    setReviewButton(newValue);
    setStatusButtonSave(true);
  }, []);

  const [buttonSubmit, setButtonSubmit] = useState(
    dataSettings.form_button_submit
  );
  const handleChangeButtonSubmit = useCallback((newValue) => {
    setButtonSubmit(newValue);
    setStatusButtonSave(true);
  }, []);

  const [successMessage, setSuccessMessage] = useState(
    dataSettings.submit_mess
  );
  const handleChangeSuccessMessage = useCallback((newValue) => {
    setSuccessMessage(newValue);
    setStatusButtonSave(true);
  }, []);

  const [errorMessage, setErrorMessage] = useState(
    dataSettings.submit_error_mess
  );
  const handleChangeErrorMessage = useCallback((newValue) => {
    setErrorMessage(newValue);
    setStatusButtonSave(true);
  }, []);

  const [ratingLabel, setRatingLabel] = useState(dataSettings.form_rating);
  const handleChangeRatingLabel = useCallback((newValue) => {
    setRatingLabel(newValue);
    setStatusButtonSave(true);
  }, []);
  const [recommendLabel, setRecommendLabel] = useState(
    dataSettings.form_recommend
  );
  const handleChangeRecommendLabel = useCallback((newValue) => {
    setRecommendLabel(newValue);
    setStatusButtonSave(true);
  }, []);

  const [imageButton, setImageButton] = useState(dataSettings.form_upload);
  const handleChangeImageButton = useCallback((newValue) => {
    setImageButton(newValue);
    setStatusButtonSave(true);
  }, []);
  // listing text
  const [listHeadline, setListHeadline] = useState(dataSettings.reviews_title);
  const handleListHeadline = useCallback((value) => {
    setListHeadline(value);
    setStatusButtonSave(true);
  }, []);

  const [averageReview, setAverageReview] = useState(dataSettings.text_average);
  const handleChangeAverageReview = useCallback((newValue) => {
    setAverageReview(newValue);
    setStatusButtonSave(true);
  }, []);
  const [secretKey, setSecretKey] = useState(dataSettings.secretKey);
  const handleChangeSecretKey = useCallback((newValue) => {
    setSecretKey(newValue);
    setStatusButtonSave(true);
    setStatusButtonTestKey(true);
  }, []);
  const [siteKey, setSiteKey] = useState(dataSettings.siteKey);
  const handleChangeSiteKey = useCallback((newValue) => {
    setSiteKey(newValue);
    setStatusButtonTestKey(true);
    setStatusButtonSave(true);
  }, []);

  const [agreeText, setAgreeText] = useState(dataSettings.text_agree);
  const handleChangeAgreeText = useCallback((newValue) => {
    setAgreeText(newValue);
    setStatusButtonSave(true);
  }, []);

  const [declineText, setDeclineText] = useState(dataSettings.text_decline);
  const handleChangeDeclineText = useCallback((newValue) => {
    setDeclineText(newValue);
    setStatusButtonSave(true);
  }, []);
  const [valueRadioCaptcha, setValueRadioCaptcha] = useState(
    dataSettings.captcha
  );
  const handleChangeRadioCaptcha = useCallback((_checked, newValue) => {
    setStatusButtonSave(true);
    setStatusButtonTestKeyLoading(false);
    setStatusButtonTestKey(false);
    setValueRadioCaptcha(newValue);
  }, []);
  const formdata = {
    form_author: authorName,
    form_author_desc: placeholderAuthorName,
    form_email: authorEmail,
    form_email_desc: placeholderAuthorEmail,
    form_title: reviewTitle,
    form_title_desc: placeholderReviewTitle,
    form_review: reviewMessage,
    form_review_desc: placeholderReviewMessage,
    form_button: reviewButton,
    form_button_submit: buttonSubmit,
    submit_mess: successMessage,
    submit_error_mess: errorMessage,
    form_rating: ratingLabel,
    form_recommend: recommendLabel,
    form_upload: imageButton,
    text_agree: agreeText,
    text_decline: declineText,
    reviews_title: listHeadline,
    text_average: averageReview,
    siteKey: siteKey,
    secretKey: secretKey,
    captchaStatus: valueRadioCaptcha,
  };
  const handleSaveSettings = useCallback((formdata) => {
    reloadSettings();
    saveSettingsCustomize(formdata);
    setStatusButtonSave(false);
    setTimeout(() => {
      getSettings();
    }, 1500);
  }, []);
  const cancelSave = useCallback(async () => {
    setStatusButtonSave(false);
    setAgreeText(dataSettings.text_agree);
    setDeclineText(dataSettings.text_decline);
    setRecommendLabel(dataSettings.form_recommend);
    setAuthorName(dataSettings.form_author);
    setReviewMessage(dataSettings.form_review);
    setAuthorEmail(dataSettings.form_email);
    setReviewTitle(dataSettings.form_title);
    setPlaceholderAuthorName(dataSettings.form_author_desc);
    setPlaceholderAuthorEmail(dataSettings.form_email_desc);
    setPlaceholderReviewTitle(dataSettings.form_title_desc);
    setPlaceholderReviewMessage(dataSettings.form_review_desc);
    setReviewButton(dataSettings.form_button);
    setButtonSubmit(dataSettings.form_button_submit);
    setSuccessMessage(dataSettings.submit_mess);
    setErrorMessage(dataSettings.submit_error_mess);
    setRatingLabel(dataSettings.form_rating);
    setImageButton(dataSettings.form_upload);
    setListHeadline(dataSettings.reviews_title);
    setAverageReview(dataSettings.text_average);
    setSiteKey(dataSettings.siteKey);
    setSecretKey(dataSettings.secretKey);
    setValueRadioCaptcha(dataSettings.captcha);
    // await getSettings();
  }, []);
  //PREVIEW:
  const [selectedChangeLayout, setSelectedChangeLayout] = useState(
    dataSettings.app_layout
  );
  const [colorButtonBackground, setColorButtonBackground] = useState(
    dataSettings.button_color
  );
  const [colorButtontext, setColorButtontext] = useState(
    dataSettings.button_textcolor
  );
  const [colorReview, setColorReview] = useState(dataSettings.progress_color);
  const [valueSelectedStar, setValueSelectedStar] = useState(
    dataSettings.star_style
  );
  const [valueRadioRecommend, setValueRadioRecommend] = useState(
    dataSettings.show_recommend
  );
  const [valueRadioPurchased, setValueRadioPurchased] = useState(
    dataSettings.show_purchase
  );
  const shop = config.shop;

  const [statusButtonSave, setStatusButtonSave] = useState(false);
  const [statusButtonTestKey, setStatusButtonTestKey] = useState(false);
  const [statusButtonTestKeyLoading, setStatusButtonTestKeyLoading] = useState(
    false
  );
  const testkeyMethob = useCallback(async (siteKey, secretKey) => {
    setStatusButtonTestKeyLoading(true);
    setStatusButtonTestKey(false);
    await createScript();
    setTimeout(() => {
      window.grecaptcha.ready(function () {
        try {
          window.grecaptcha
            .execute(siteKey, {
              action: "submit",
            })
            .then(function (token) {
              try {
                apiCheckCaptcha(token);
              } catch (err) {
                displayError("Something is not right, please review!");
                setStatusButtonTestKeyLoading(false);
                setStatusButtonTestKey(true);
              }
            })
            .catch(function (err) {
              displayError("Something is not right, May not add domain yet!");
              setStatusButtonTestKeyLoading(false);
              setStatusButtonTestKey(true);
            });
        } catch (err) {
          displayError("Incorrect site key, please review!");
          setStatusButtonTestKeyLoading(false);
          setStatusButtonTestKey(true);
        }
      });
    }, 2000);
  });
  const createScript = useCallback(() => {
    let checkExit = document.querySelector("#captcha");
    if (checkExit !== null) {
      checkExit.remove();
    }
    let imported = document.createElement("script");
    imported.setAttribute("id", "captcha");
    imported.src = "https://www.google.com/recaptcha/api.js?render=" + siteKey;
    document.head.appendChild(imported);
  });
  const apiCheckCaptcha = useCallback(async (token) => {
    const res = await axios.post(
      config.rootLink + "/backend/testkey.php",
      {
        action: "testKey",
        shop: shop,
        token: token,
        secret: secretKey,
      },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (res.data === "success") {
      displayError("Success!");
    } else if (res.data === "falsed") {
      displayError("Incorrect secret key, please review!!");
    }
    setStatusButtonTestKeyLoading(false);
    setStatusButtonTestKey(true);
  });

  return (
    <div>
      <input
        type="hidden"
        value=""
        name="recaptcha_response"
        id="recaptchaResponse"
      ></input>
      {/* <Alert /> */}
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
          <div
            style={{
              width: "40%",
              textAlign: "end",
              lineHeight: "46px",
              color: "#cccccc",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            <TextStyle>Unsaved changes</TextStyle>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "5px 80px 5px 0",
              width: "60%",
            }}
          >
            <ButtonGroup>
              <Button onClick={cancelSave}>Cancel</Button>
              <Button onClick={() => handleSaveSettings(formdata)} primary>
                Save
              </Button>
            </ButtonGroup>
          </div>
        </div>
      )}
      <Layout>
        <Layout.Section oneHalf>
          <div id="review-listing-text">
            <Card>
              <div className="session-settings_header">
                <h1 id="title-settings">CAPTCHA</h1>
              </div>
              <div style={{ margin: "20px" }}>
                <TextStyle variation="subdued">
                  reCAPTCHA is a free service from Google that helps protect
                  websites from spam and abuse. A “CAPTCHA” is a turing test to
                  tell human and bots apart. It is easy for humans to solve, but
                  hard for “bots” and other malicious software to figure out. By
                  adding reCAPTCHA to a site, you can block automated software
                  while helping your welcome users to enter with ease
                </TextStyle>
                <br></br>
              </div>
              <div className="marginBottom" style={{ margin: "20px" }}>
                <Stack vertical>
                  <div style={{ display: "flex", marginBottom: "20px" }}>
                    <div style={{ marginRight: "20px" }}>
                      <RadioButton
                        label="Enable"
                        checked={valueRadioCaptcha === "yesCaptcha"}
                        id="yesCaptcha"
                        name="yesnoCaptcha"
                        onChange={handleChangeRadioCaptcha}
                      />
                    </div>
                    <RadioButton
                      label="Disable"
                      id="noCaptcha"
                      name="yesnoCaptcha"
                      checked={valueRadioCaptcha === "noCaptcha"}
                      onChange={handleChangeRadioCaptcha}
                    />
                  </div>
                </Stack>
              </div>
              {valueRadioCaptcha === "yesCaptcha" && (
                <div>
                  <div style={{ margin: "20px" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <TextStyle variation="subdued">
                        <b>STEP 1</b>: Go to the{" "}
                        <a
                          href="https://www.google.com/recaptcha/admin/create"
                          target="_blank"
                        >
                          reCAPTCHA page
                        </a>{" "}
                      </TextStyle>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <TextStyle variation="subdued">
                        <b>STEP 2</b>: In{" "}
                        <i style={{ fontWeight: "500" }}>reCAPTCHA type</i>,
                        select reCAPTCHA v3
                      </TextStyle>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <TextStyle variation="subdued">
                        <b>STEP 3</b>: In{" "}
                        <i style={{ fontWeight: "500" }}>Domains</i> add the
                        domain{" "}
                        <i style={{ fontWeight: "500" }}>
                          "apps.omegatheme.com"
                        </i>{" "}
                        and your shop domain (ex: nguyen-q-huy.myshopify.com)
                        then click SUBMIT
                      </TextStyle>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <TextStyle variation="subdued">
                        <b>STEP 4</b>: Copy{" "}
                        <i style={{ fontWeight: "500" }}>SITE KEY</i> and{" "}
                        <i style={{ fontWeight: "500" }}>SECRET KEY</i> and go
                        back and fill in the corresponding input below.
                      </TextStyle>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <TextStyle variation="subdued">
                        Look at the bottom left corner of the screen to check if
                        "captcha" is working in your store
                      </TextStyle>
                    </div>
                    <br></br>
                    <img
                      width="100%"
                      height="200px"
                      style={{ marginTop: "5px" }}
                      src={config.rootLink + "/backend/images/checkcaptcha.PNG"}
                    ></img>
                  </div>
                  <div style={{ margin: "20px" }}>
                    <TextStyle variation="strong">
                      Note: Click the "Test Key" button before Save
                    </TextStyle>
                  </div>
                  <div className="session-settings_content">
                    <div className="marginBottom">
                      <TextField
                        label="SITE KEY"
                        value={siteKey}
                        placeholder="Enter your site key"
                        onChange={handleChangeSiteKey}
                        // helpText="Special character '%s' will be replace with product's title, remove if you don't want it."
                      />
                    </div>
                    <div className="marginBottom">
                      <TextField
                        placeholder="Enter your secret key"
                        value={secretKey}
                        label="SECRET KEY"
                        onChange={handleChangeSecretKey}
                      />
                    </div>
                    {statusButtonTestKey && (
                      <div className="animate__animated animate__fadeIn">
                        <Button
                          destructive
                          onClick={() => testkeyMethob(siteKey, secretKey)}
                        >
                          Test Key
                        </Button>
                      </div>
                    )}
                    {statusButtonTestKeyLoading && (
                      <Button destructive loading>
                        Test Key
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {/* <img src={config.rootLink + "/backend/images/captcha.png"}></img> */}
            </Card>
          </div>
          <div id="review-form-text" className="session-setting">
            <Card>
              <div className="session-settings_header">
                <h1 id="title-settings">Review form text</h1>
              </div>
              <div className="session-settings_content">
                <div className="marginBottom">
                  <TextField
                    label="Author's name"
                    value={authorName}
                    onChange={handleChangeAuthorName}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Author's name field placeholder"
                    value={placeholderAuthorName}
                    onChange={handleChangePlaceholderAuthorName}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Author's email"
                    value={authorEmail}
                    onChange={handleChangeAuthorEmail}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Author's email field placeholder"
                    value={placeholderAuthorEmail}
                    onChange={handleChangePlaceholderAuthorEmail}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Review's title"
                    value={reviewTitle}
                    onChange={handleChangeReviewTitle}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Review's title field placeholder"
                    value={placeholderReviewTitle}
                    onChange={handleChangePlaceholderReviewTitle}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Review's message"
                    value={reviewMessage}
                    onChange={handleChangeReviewMessage}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Review's message field placeholder"
                    value={placeholderReviewMessage}
                    onChange={handleChangePlaceholderReviewMessage}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Review form title"
                    value={reviewButton}
                    onChange={handleChangeReviewButton}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Review form submit button"
                    value={buttonSubmit}
                    onChange={handleChangeButtonSubmit}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Success message"
                    value={successMessage}
                    onChange={handleChangeSuccessMessage}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Error message"
                    value={errorMessage}
                    onChange={handleChangeErrorMessage}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Rating field label"
                    value={ratingLabel}
                    onChange={handleChangeRatingLabel}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Recommend field label"
                    value={recommendLabel}
                    onChange={handleChangeRecommendLabel}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Upload image button"
                    value={imageButton}
                    onChange={handleChangeImageButton}
                  />
                </div>
              </div>
            </Card>
          </div>
          <div id="review-listing-text">
            <Card>
              <div className="session-settings_header">
                <h1 id="title-settings">Review listing text</h1>
              </div>
              <div className="session-settings_content">
                <div className="marginBottom">
                  <TextField
                    label="Reviews's list headline text"
                    value={listHeadline}
                    onChange={handleListHeadline}
                    // helpText="Special character '%s' will be replace with product's title, remove if you don't want it."
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Average review"
                    value={averageReview}
                    onChange={handleChangeAverageReview}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Agree text"
                    value={agreeText}
                    onChange={handleChangeAgreeText}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Decline text"
                    value={declineText}
                    onChange={handleChangeDeclineText}
                  />
                </div>
              </div>
            </Card>
          </div>
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
                reviewTitle={reviewTitle}
                reviewMessage={reviewMessage}
                imageButton={imageButton}
                buttonSubmit={buttonSubmit}
                authorName={authorName}
                authorEmail={authorEmail}
              />
              <div
                style={{
                  margin: "10px 0 10px",
                  marginBottom: "50px",
                }}
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
                  <div
                    style={{
                      marginTop: "10px",
                      height: "40px",
                      display: "flex",
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
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps, {
  saveSettingsCustomize,
  reloadSettings,
  getSettings,
  displayError,
})(DisplayCustomizeText);
