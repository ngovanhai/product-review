import React, { useCallback, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Card,
  Select,
  TextStyle,
  Stack,
  RadioButton,
  Checkbox,
  Label,
  TextField,
  Button,
  Icon,
  ButtonGroup,
} from "@shopify/polaris";
import { MobileCancelMajor } from "@shopify/polaris-icons";

import {
  getSettings,
  showNotificationDemo,
  hideNotificationDemo,
  saveSettingsAdvanced,
  reloadSettings,
} from "../../../actions/settings";

const DisplayAdvanced = ({
  showNotificationDemo,
  hideNotificationDemo,
  saveSettingsAdvanced,
  reloadSettings,
  getSettings,
  settings: { dataSettings, notificationsDemo },
}) => {
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  //auto publish
  const [autoPublish, setAutoPublish] = useState(dataSettings.auto_publish);
  const handleChangeAutoPublish = useCallback((_checked, newValue) => {
    setAutoPublish(newValue);
    setStatusButtonSave(true);
  }, []);

  const [checkedEmailSettings, setCheckedEmailSettings] = useState(
    dataSettings.admin_send_mail
  );
  const handleChangeCheckedEmailSettings = useCallback((newChecked) => {
    setCheckedEmailSettings(newChecked);
    setStatusButtonSave(true);
  }, []);

  const [emailAddress, setEmailAddress] = useState(dataSettings.admin_email);
  const handleChangeEmailAddress = useCallback((newValue) => {
    setEmailAddress(newValue);
    setStatusButtonSave(true);
  }, []);

  const [sendCustomerEmail, setSendCustomerEmail] = useState(
    dataSettings.send_mail
  );
  const handleChangeSendCustomerEmail = useCallback((_checked, newValue) => {
    setSendCustomerEmail(newValue);
    setStatusButtonSave(true);
  }, []);

  const [maximumCharacter, setMaximumCharacter] = useState(
    dataSettings.maximum_reviews
  );
  const handleChangeMaximumCharacter = useCallback((newValue) => {
    setMaximumCharacter(newValue);
    setStatusButtonSave(true);
  }, []);

  const [maximumImages, setMaximumImages] = useState(
    dataSettings.maximum_uploaded_images
  );
  const handleChangeMaximumImages = useCallback((newValue) => {
    setMaximumImages(newValue);
    setStatusButtonSave(true);
  }, []);

  const [reviewPerPage, setReviewPerPage] = useState(
    dataSettings.reviews_per_page
  );
  const handleChangeReviewPerPage = useCallback((newValue) => {
    setReviewPerPage(newValue);
    setStatusButtonSave(true);
  }, []);

  const [numberBoughtProduct, setNumberBoughtProduct] = useState(
    dataSettings.numberBoughtProduct
  );
  const [timeLoop, setTimeLoop] = useState(dataSettings.timeLoop);
  const [timeDisplay, setTimeDisplay] = useState(dataSettings.timeDisplay);
  const [askingCustomer, setAskingCustomer] = useState(
    dataSettings.show_notification
  );

  const handleChangeAskingCustomer = useCallback((_checked, newValue) => {
    setAskingCustomer(newValue);
    setStatusButtonSave(true);
    setTimeout(() => {
      let selectedDisplay = document.getElementById("selectDisplay");
      if (selectedDisplay) {
        let options = selectedDisplay.options;
        for (var i = 0; i < options.length; i++) {
          if (options[i].value === dataSettings.effect_display) {
            options[i].selected = true;
          }
        }
      }
      let selectedHidden = document.getElementById("selectHidden");
      if (selectedHidden) {
        let options = selectedHidden.options;
        for (var i = 0; i < options.length; i++) {
          if (options[i].value === dataSettings.effect_hidden) {
            options[i].selected = true;
          }
        }
      }
    }, 1000);
  }, []);

  const [
    selectedPositionNotification,
    setSelectedPositionNotification,
  ] = useState(dataSettings.notification_position);
  const handleSelectChangeSelectedPositionNotification = useCallback(
    (value) => {
      setSelectedPositionNotification(value);
      setStatusButtonSave(true);
    },
    []
  );
  const optionsPositionNotification = [
    { label: "Left Top", value: "top_left" },
    { label: "Left Bottom", value: "left_bottom" },
    { label: "Right Top", value: "top_right" },
    { label: "Right Bottom", value: "bottom_right" },
  ];

  const [effectDisplay, setEffectDisplay] = useState(
    dataSettings.effect_display
  );
  const [effectHidden, setEffectHidden] = useState(dataSettings.effect_hidden);
  const handleSelectedDisplayEffect = useCallback((newValue) => {
    let selectedDisplay = document.getElementById("selectDisplay").value;
    setEffectDisplay(selectedDisplay);
    setStatusButtonSave(true);
  }, []);
  const handleSelectedHiddenEffect = useCallback((newValue) => {
    let selectedHidden = document.getElementById("selectHidden").value;
    setEffectHidden(selectedHidden);
    setStatusButtonSave(true);
  }, []);
  const handleChangeNumberBoughtProduct = useCallback((newValue) => {
    setNumberBoughtProduct(newValue);
    setStatusButtonSave(true);
  }, []);

  const handleChangesTimeLoop = useCallback((newValue) => {
    setTimeLoop(newValue);
    setStatusButtonSave(true);
  }, []);

  const handleChangeTimeDisplay = useCallback((newValue) => {
    setTimeDisplay(newValue);
    setStatusButtonSave(true);
  }, []);

  const [featuredBoxBadge, setFeaturedBoxBadge] = useState(
    dataSettings.show_box_badge
  );
  const [labelBoxBadge, setLabelBoxBadge] = useState(
    dataSettings.label_box_badge
  );
  const [selectedPositionBoxBadge, setSelectedPositionBoxBadge] = useState(
    dataSettings.position_box_badge
  );
  const optionsSelectedPositionBoxBadge = [
    { label: "Bottom Left", value: "bottomleft" },
    { label: "Bottom Right", value: "bottomright" },
    { label: "Bottom Middle", value: "bottommiddle" },
  ];
  const handleChangeFeaturedBoxBadge = useCallback((_checked, newValue) => {
    setFeaturedBoxBadge(newValue);
    setStatusButtonSave(true);
  }, []);
  const handleChangeLabelBoxBadge = useCallback((newValue) => {
    setLabelBoxBadge(newValue);
    setStatusButtonSave(true);
  }, []);
  const handleSelectChangeSelectedPositionBoxBadge = useCallback((value) => {
    setSelectedPositionBoxBadge(value);
    setStatusButtonSave(true);
  }, []);

  const [selectedInsertShortCode, setSelectedInsertShortCode] = useState(
    dataSettings.insert_code
  );
  const handleSelectedInsertShortCode = useCallback((value) => {
    setSelectedInsertShortCode(value);
    setStatusButtonSave(true);
  }, []);
  const optionsInsertShortCode = [
    { label: "Automatic", value: "1" },
    { label: "Manual", value: "0" },
  ];

  const [customCss, setCustomCss] = useState(dataSettings.customcss);
  const handleChangeCustomCss = useCallback((newValue) => {
    setCustomCss(newValue);
    setStatusButtonSave(true);
  }, []);

  const [colorButtonText, setColorReviewButtonText] = useState(
    dataSettings.writeareview_textcolor
  );
  const [colorButtonBackground, setColorReviewButtonBackground] = useState(
    dataSettings.writeareview_bgcolor
  );
  const [notificationLabel, setNotificationLabel] = useState(
    dataSettings.notification_label
  );
  const handleChangeNotificationLabel = useCallback((newValue) => {
    setNotificationLabel(newValue);
    setStatusButtonSave(true);
  }, []);

  const [notificationButtonLabel, setNotificationButtonLabel] = useState(
    dataSettings.writeareview_label
  );
  const handleChangeNotificationButtonLabel = useCallback((newValue) => {
    setNotificationButtonLabel(newValue);
    setStatusButtonSave(true);
  }, []);
  const handleCloseNotification = useCallback((effectDisplay, effectHidden) => {
    let divNotifications = document.getElementById("divNotifications");
    divNotifications.classList.remove("animate__" + effectDisplay);
    divNotifications.classList.add("animate__" + effectHidden);
    hideNotificationDemo();
  }, []);

  const formdata = {
    auto_publish: autoPublish,
    insert_code: selectedInsertShortCode,
    admin_send_mail: checkedEmailSettings,
    admin_email: emailAddress,
    send_mail: sendCustomerEmail,
    reviews_per_page: reviewPerPage,
    maximum_reviews: maximumCharacter,
    maximum_uploaded_images: maximumImages,
    show_notification: askingCustomer,
    numberBoughtProduct: numberBoughtProduct,
    timeLoop: timeLoop,
    timeDisplay: timeDisplay,
    effect_display: effectDisplay,
    effect_hidden: effectHidden,
    notification_label: notificationLabel,
    writeareview_label: notificationButtonLabel,
    writeareview_textcolor: colorButtonText,
    writeareview_bgcolor: colorButtonBackground,
    notification_position: selectedPositionNotification,
    show_box_badge: featuredBoxBadge,
    label_box_badge: labelBoxBadge,
    position_box_badge: selectedPositionBoxBadge,
    customcss: customCss,
  };
  const handleSaveSettings = useCallback((formdata) => {
    reloadSettings();
    saveSettingsAdvanced(formdata);
    setStatusButtonSave(false);
    setTimeout(() => {
      getSettings();
    }, 1500);
  }, []);
  const cancelSave = useCallback(async () => {
    setStatusButtonSave(false);
    setEffectHidden(dataSettings.effect_hidden);
    setEffectDisplay(dataSettings.effect_display);
    setAutoPublish(dataSettings.auto_publish);
    setCheckedEmailSettings(dataSettings.admin_send_mail);
    setEmailAddress(dataSettings.admin_email);
    setSendCustomerEmail(dataSettings.send_mail);
    setMaximumCharacter(dataSettings.maximum_reviews);
    setMaximumImages(dataSettings.maximum_uploaded_images);
    setReviewPerPage(dataSettings.reviews_per_page);
    setNumberBoughtProduct(dataSettings.numberBoughtProduct);
    setTimeLoop(dataSettings.timeLoop);
    setTimeDisplay(dataSettings.timeDisplay);
    setAskingCustomer(dataSettings.show_notification);
    setSelectedPositionNotification(dataSettings.notification_position);
    setFeaturedBoxBadge(dataSettings.show_box_badge);
    setLabelBoxBadge(dataSettings.label_box_badge);
    setSelectedPositionBoxBadge(dataSettings.position_box_badge);
    setSelectedInsertShortCode(dataSettings.insert_code);
    setCustomCss(dataSettings.customcss);
    setColorReviewButtonText(dataSettings.writeareview_textcolor);
    setColorReviewButtonBackground(dataSettings.writeareview_bgcolor);
    setNotificationLabel(dataSettings.notification_label);
    setNotificationButtonLabel(dataSettings.writeareview_label);
  }, []);
  const [statusButtonSave, setStatusButtonSave] = useState(false);

  return (
    <div style={{ width: "70%", margin: "auto" }}>
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
      {notificationsDemo && (
        <div
          id="divNotifications"
          className={
            "animate__animated animate__" +
            effectDisplay +
            " position__notifications__" +
            selectedPositionNotification
          }
          style={{ position: "fixed", zIndex: 1000 }}
        >
          <div className="lastBoughtContent">
            <div className="closeLastBoughtPopup">
              <a
                onClick={() =>
                  handleCloseNotification(effectDisplay, effectHidden)
                }
              >
                <Icon color="redDark" source={MobileCancelMajor} />
              </a>
            </div>
            <h4>{notificationLabel}</h4>
            <h3>Lorem ipsum dolor</h3>
            <div className="reviewLastBought">
              <a
                style={{
                  background: colorButtonBackground,
                  color: colorButtonText,
                }}
              >
                {notificationButtonLabel}
              </a>
            </div>
          </div>
        </div>
      )}

      <div id="asking-customer" className="session-setting">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">Asking customer for review</h1>
          </div>
          <div className="session-settings_content">
            <TextStyle variation="subdued">
              (When your customers login, they will see notification to ask them
              for a review with bought products.)
            </TextStyle>
            <Label>
              Show notification to paid customers to asking for a review
            </Label>
            <div className="marginBottom">
              <Stack vertical>
                <div style={{ display: "flex" }}>
                  <div style={{ marginRight: "20px" }}>
                    <RadioButton
                      label="Yes"
                      checked={askingCustomer === "yesShowNotification"}
                      id="yesShowNotification"
                      name="askingCustomer"
                      onChange={handleChangeAskingCustomer}
                    />
                  </div>
                  <RadioButton
                    label="No"
                    id="noShowNotification"
                    name="askingCustomer"
                    checked={askingCustomer === "noShowNotification"}
                    onChange={handleChangeAskingCustomer}
                  />
                </div>
              </Stack>
            </div>
            {askingCustomer === "yesShowNotification" && (
              <div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div class="marginBottom" style={{ width: "35%" }}>
                    <TextField
                      label="Number of bought products"
                      type="number"
                      min="1"
                      value={numberBoughtProduct}
                      onChange={handleChangeNumberBoughtProduct}
                    />
                  </div>
                  <div className="marginBottom" style={{ width: "30%" }}>
                    <TextField
                      label="Next time display (second)"
                      type="number"
                      min="5"
                      value={timeLoop}
                      onChange={handleChangesTimeLoop}
                    />
                  </div>
                  <div className="marginBottom" style={{ width: "25%" }}>
                    <TextField
                      label="Display time (second)"
                      type="number"
                      min="5"
                      value={timeDisplay}
                      onChange={handleChangeTimeDisplay}
                    />
                  </div>
                </div>

                <div class="marginBottom">
                  <TextField
                    label="Asking review button's label"
                    value={notificationButtonLabel}
                    onChange={handleChangeNotificationButtonLabel}
                  />
                </div>
                <div className="marginBottom">
                  <TextField
                    label="Notification label"
                    value={notificationLabel}
                    onChange={handleChangeNotificationLabel}
                  />
                </div>
                <Label>Asking review button's background color</Label>
                <input
                  type="color"
                  value={colorButtonBackground}
                  onChange={(e) => {
                    setColorReviewButtonBackground(e.target.value);
                    setStatusButtonSave(true);
                  }}
                  style={{
                    height: "40px",
                    borderRadius: "15px",
                    border: "1px solid #bebebe",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                />
                <Label>Asking review button's text color</Label>
                <input
                  type="color"
                  value={colorButtonText}
                  onChange={(e) => {
                    setColorReviewButtonText(e.target.value);
                    setStatusButtonSave(true);
                  }}
                  style={{
                    height: "40px",
                    borderRadius: "15px",
                    border: "1px solid #bebebe",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                />
                <div style={{ display: "flex" }}>
                  <div
                    className="marginBottom"
                    style={{ width: "30%", marginRight: "40px" }}
                  >
                    <Label>Notification display effect</Label>
                    <div
                      className="input-group mb-3"
                      style={{ marginTop: "9px" }}
                    >
                      <select
                        className="custom-select"
                        id="selectDisplay"
                        style={{ height: "36px", fontSize: "14px" }}
                        onChange={handleSelectedDisplayEffect}
                      >
                        <optgroup label="Attention Seekers">
                          <option value="bounce">bounce</option>
                          <option value="flash">flash</option>
                          <option value="pulse">pulse</option>
                          <option value="rubberBand">rubberBand</option>
                          <option value="shake">shake</option>
                          <option value="swing">swing</option>
                          <option value="tada">tada</option>
                          <option value="wobble">wobble</option>
                          <option value="jello">jello</option>
                        </optgroup>
                        <optgroup label="Bouncing Entrances">
                          <option value="bounceIn">bounceIn</option>
                          <option value="bounceInDown">bounceInDown</option>
                          <option value="bounceInLeft">bounceInLeft</option>
                          <option value="bounceInRight">bounceInRight</option>
                          <option value="bounceInUp">bounceInUp</option>
                        </optgroup>
                        <optgroup label="Fading Entrances">
                          <option value="fadeIn">fadeIn</option>
                          <option value="fadeInDown">fadeInDown</option>
                          <option value="fadeInDownBig">fadeInDownBig</option>
                          <option value="fadeInLeft">fadeInLeft</option>
                          <option value="fadeInLeftBig">fadeInLeftBig</option>
                          <option value="fadeInRight">fadeInRight</option>
                          <option value="fadeInRightBig">fadeInRightBig</option>
                          <option value="fadeInUp">fadeInUp</option>
                          <option value="fadeInUpBig">fadeInUpBig</option>
                        </optgroup>
                        <optgroup label="Flippers">
                          <option value="flip">flip</option>
                          <option value="flipInX">flipInX</option>
                          <option value="flipInY">flipInY</option>
                        </optgroup>
                        <optgroup label="Lightspeed">
                          <option value="lightSpeedIn">lightSpeedIn</option>
                        </optgroup>
                        <optgroup label="Rotating Entrances">
                          <option value="rotateIn">rotateIn</option>
                          <option value="rotateInDownLeft">
                            rotateInDownLeft
                          </option>
                          <option value="rotateInDownRight">
                            rotateInDownRight
                          </option>
                          <option value="rotateInUpLeft">rotateInUpLeft</option>
                          <option value="rotateInUpRight">
                            rotateInUpRight
                          </option>
                        </optgroup>
                        <optgroup label="Sliding Entrances">
                          <option value="slideInUp">slideInUp</option>
                          <option value="slideInDown">slideInDown</option>
                          <option value="slideInLeft">slideInLeft</option>
                          <option value="slideInRight">slideInRight</option>
                        </optgroup>
                        <optgroup label="Zoom Entrances">
                          <option value="zoomIn">zoomIn</option>
                          <option value="zoomInDown">zoomInDown</option>
                          <option value="zoomInLeft">zoomInLeft</option>
                          <option value="zoomInRight">zoomInRight</option>
                          <option value="zoomInUp">zoomInUp</option>
                        </optgroup>
                        <optgroup label="Specials">
                          <option value="hinge">hinge</option>
                          <option value="jackInTheBox">jackInTheBox</option>
                          <option value="rollIn">rollIn</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  <div className="marginBottom" style={{ width: "30%" }}>
                    <Label>Notification hidden effect</Label>
                    <div
                      className="input-group mb-3"
                      style={{ marginTop: "9px" }}
                    >
                      <select
                        className="custom-select"
                        id="selectHidden"
                        style={{ height: "36px", fontSize: "14px" }}
                        onChange={handleSelectedHiddenEffect}
                      >
                        <optgroup label="Bouncing Exits">
                          <option value="bounceOut">bounceOut</option>
                          <option value="bounceOutDown">bounceOutDown</option>
                          <option value="bounceOutLeft">bounceOutLeft</option>
                          <option value="bounceOutRight">bounceOutRight</option>
                          <option value="bounceOutUp">bounceOutUp</option>
                        </optgroup>
                        <optgroup label="Fading Exits">
                          <option value="fadeOut">fadeOut</option>
                          <option value="fadeOutDown">fadeOutDown</option>
                          <option value="fadeOutDownBig">fadeOutDownBig</option>
                          <option value="fadeOutLeft">fadeOutLeft</option>
                          <option value="fadeOutLeftBig">fadeOutLeftBig</option>
                          <option value="fadeOutRight">fadeOutRight</option>
                          <option value="fadeOutRightBig">
                            fadeOutRightBig
                          </option>
                          <option value="fadeOutUp">fadeOutUp</option>
                          <option value="fadeOutUpBig">fadeOutUpBig</option>
                        </optgroup>
                        <optgroup label="Lightspeed">
                          <option value="lightSpeedOut">lightSpeedOut</option>
                        </optgroup>
                        <optgroup label="Rotating Exits">
                          <option value="rotateOut">rotateOut</option>
                          <option value="rotateOutDownLeft">
                            rotateOutDownLeft
                          </option>
                          <option value="rotateOutDownRight">
                            rotateOutDownRight
                          </option>
                          <option value="rotateOutUpLeft">
                            rotateOutUpLeft
                          </option>
                          <option value="rotateOutUpRight">
                            rotateOutUpRight
                          </option>
                        </optgroup>
                        <optgroup label="Sliding Exits">
                          <option value="slideOutUp">slideOutUp</option>
                          <option value="slideOutDown">slideOutDown</option>
                          <option value="slideOutLeft">slideOutLeft</option>
                          <option value="slideOutRight">slideOutRight</option>
                        </optgroup>
                        <optgroup label="Zoom Exits">
                          <option value="zoomOut">zoomOut</option>
                          <option value="zoomOutDown">zoomOutDown</option>
                          <option value="zoomOutLeft">zoomOutLeft</option>
                          <option value="zoomOutRight">zoomOutRight</option>
                          <option value="zoomOutUp">zoomOutUp</option>
                        </optgroup>
                        <optgroup label="Specials">
                          <option value="hinge">hinge</option>
                          <option value="rollOut">rollOut</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="marginBottom">
                  <Select
                    label="Position"
                    options={optionsPositionNotification}
                    onChange={handleSelectChangeSelectedPositionNotification}
                    value={selectedPositionNotification}
                  />
                </div>

                {notificationsDemo == false ? (
                  <Button primary onClick={() => showNotificationDemo()}>
                    PREVIEW
                  </Button>
                ) : (
                  <Button
                    destructive
                    onClick={() =>
                      handleCloseNotification(effectDisplay, effectHidden)
                    }
                  >
                    CLOSE
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
      <div id="auto-publish" className="session-setting">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">Auto publish</h1>
          </div>
          <div className="session-settings_content">
            <Stack vertical>
              <RadioButton
                label="Enabled"
                helpText="New reviews automatically published."
                checked={autoPublish === "yesPublish"}
                id="yesPublish"
                name="autoPublish"
                onChange={handleChangeAutoPublish}
              />
              <RadioButton
                label="Disable"
                helpText="You must manually publish new reviews."
                id="noPublish"
                name="autoPublish"
                checked={autoPublish === "noPublish"}
                onChange={handleChangeAutoPublish}
              />
            </Stack>
          </div>
        </Card>
      </div>
      <div id="email-settings" className="session-setting">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">Email settings</h1>
          </div>
          <div className="session-settings_content">
            <TextStyle variation="subdued">
              Choose if you want to receive email notifications for each review.
            </TextStyle>
            <div className="marginBottom">
              <Checkbox
                label="Send me an email when a review is submitted."
                checked={checkedEmailSettings}
                onChange={handleChangeCheckedEmailSettings}
              />
            </div>
            <div className="marginBottom">
              <TextField
                label="Email address:"
                value={emailAddress}
                onChange={handleChangeEmailAddress}
              />
            </div>
            <div className="marginBottom">
              <Label>Send customer a confirmation mail</Label>
              <Stack vertical>
                <div style={{ display: "flex" }}>
                  <div style={{ marginRight: "20px" }}>
                    <RadioButton
                      label="Yes"
                      checked={sendCustomerEmail === "yesSendEmail"}
                      id="yesSendEmail"
                      name="sendEmailCustomer"
                      onChange={handleChangeSendCustomerEmail}
                    />
                  </div>
                  <RadioButton
                    label="No"
                    id="noSendEmail"
                    name="sendEmailCustomer"
                    checked={sendCustomerEmail === "noSendEmail"}
                    onChange={handleChangeSendCustomerEmail}
                  />
                </div>
              </Stack>
            </div>
          </div>
        </Card>
      </div>
      <div id="maximum-characters" className="session-setting">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">Maximum characters in reviews</h1>
          </div>
          <div className="session-settings_content">
            <TextStyle variation="subdued">
              (Value between 100 and 2000)
            </TextStyle>
            <div className="marginBottom" style={{ width: "30%" }}>
              <TextField
                type="number"
                value={maximumCharacter}
                max="2000"
                min="100"
                onChange={handleChangeMaximumCharacter}
              />
            </div>
          </div>
        </Card>
      </div>
      <div id="maximum-images" className="session-setting">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">
              Maximum images can be uploaded in reviews
            </h1>
          </div>
          <div className="session-settings_content">
            <TextStyle variation="subdued">(Value between 1 and 10)</TextStyle>
            <div className="marginBottom" style={{ width: "30%" }}>
              <TextField
                type="number"
                max="10"
                value={maximumImages}
                onChange={handleChangeMaximumImages}
              />
            </div>
          </div>
        </Card>
      </div>
      <div id="review-per-page" className="session-setting">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">Review per page</h1>
          </div>
          <div className="session-settings_content">
            <TextStyle variation="subdued">(Value between 2 and 50)</TextStyle>
            <div className="marginBottom" style={{ width: "30%" }}>
              <TextField
                type="number"
                max="50"
                min="2"
                value={reviewPerPage}
                onChange={handleChangeReviewPerPage}
              />
            </div>
          </div>
        </Card>
      </div>

      <div id="featured-box-badge" className="session-setting">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">Featured reviews box badge</h1>
          </div>
          <div className="session-settings_content">
            <TextStyle variation="subdued">
              (Will appear featured reviews box badge on all your store pages.)
            </TextStyle>
            <Label>Show box badge</Label>
            <div className="marginBottom">
              <Stack vertical>
                <div style={{ display: "flex" }}>
                  <div style={{ marginRight: "20px" }}>
                    <RadioButton
                      label="Yes"
                      checked={featuredBoxBadge === "yesShowBoxBadge"}
                      id="yesShowBoxBadge"
                      name="boxBadge"
                      onChange={handleChangeFeaturedBoxBadge}
                    />
                  </div>
                  <RadioButton
                    label="No"
                    id="noShowBoxBadge"
                    name="boxBadge"
                    checked={featuredBoxBadge === "noShowBoxBadge"}
                    onChange={handleChangeFeaturedBoxBadge}
                  />
                </div>
              </Stack>
            </div>
            <div className="marginBottom">
              <TextField
                label="Label for box badge"
                value={labelBoxBadge}
                onChange={handleChangeLabelBoxBadge}
              />
            </div>
            <div className="marginBottom">
              <Select
                label="Position box badge"
                options={optionsSelectedPositionBoxBadge}
                onChange={handleSelectChangeSelectedPositionBoxBadge}
                value={selectedPositionBoxBadge}
              />
            </div>
          </div>
        </Card>
      </div>
      <div id="insert-shortCode" className="session-setting">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">Insert shortCode</h1>
          </div>
          <div className="session-settings_content">
            <div className="marginBottom-10">
              <Select
                options={optionsInsertShortCode}
                onChange={handleSelectedInsertShortCode}
                value={selectedInsertShortCode}
              />
            </div>
            {selectedInsertShortCode === "manual" && (
              <TextStyle variation="subdued">
                Almost Shopify themes can be automatic added shortcode. If you
                have trouble with your themes, you should add shortcode manual
                or contact us{" "}
                <a href="mailto:contact@omegatheme.com" target="_top">
                  contact@omegatheme.com
                </a>
              </TextStyle>
            )}
          </div>
        </Card>
      </div>
      <div id="custom-css">
        <Card>
          <div className="session-settings_header">
            <h1 id="title-settings">Custom css</h1>
          </div>
          <div className="session-settings_content">
            <TextField
              value={customCss}
              onChange={handleChangeCustomCss}
              multiline={4}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps, {
  getSettings,
  showNotificationDemo,
  hideNotificationDemo,
  saveSettingsAdvanced,
  reloadSettings,
})(DisplayAdvanced);
