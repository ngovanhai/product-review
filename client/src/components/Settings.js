import React, { useCallback, useState } from "react";
import Alert from "./contents/Alert";

import $ from "jquery";
import { hideNotificationDemo } from "../actions/settings";
import Title from "./service/Title";
import { connect } from "react-redux";
import { Layout, TextStyle, Scrollable, Icon, Tabs } from "@shopify/polaris";
import config from "../config/config";
import DisplayReview from "./modals/settings-page/DisplayReview";
import DisplayAdvanced from "./modals/settings-page/DisplayAdvanced";
import DisplayCustomizeText from "./modals/settings-page/DisplayCustomizeText";
import { TabletMajor, GlobeMajor, ToolsMajor } from "@shopify/polaris-icons";
import { Route, Link } from "react-router-dom";
import Loading from "./contents/Spinner";
import { useHistory } from "react-router-dom";
import MoreApp from "./plugin/MoreApp";
const Settings = ({ settings: { loading } }) => {
  const history = useHistory();
  const [activeIconDisplay, setActiveIconDisplay] = useState("blueDark");
  const [activeIconCustomize, setActiveIconCustomize] = useState("black");
  const [activeIconAdvance, setActiveIconAdvance] = useState("black");
  const [statusDisplay, setStatusDisplay] = useState(true);
  const [statusCustomize, setStatusCustomize] = useState(false);
  const [statusAdvanced, setStatusAdvanced] = useState(false);
  const handleDisplay = useCallback(() => {
    setActiveIconDisplay("blueDark");
    setActiveIconCustomize("black");
    setActiveIconAdvance("black");
    setStatusDisplay(true);
    setStatusCustomize(false);
    setStatusAdvanced(false);
  });
  const handleCustomize = useCallback(() => {
    setActiveIconDisplay("black");
    setActiveIconCustomize("blueDark");
    setActiveIconAdvance("black");

    setStatusDisplay(false);
    setStatusCustomize(true);
    setStatusAdvanced(false);
  });
  const handleAdvanced = useCallback(() => {
    setActiveIconDisplay("black");
    setActiveIconCustomize("black");
    setActiveIconAdvance("blueDark");

    setStatusDisplay(false);
    setStatusCustomize(false);
    setStatusAdvanced(true);
  });
  $(".Polaris-Scrollable").on("scroll", onScroll);
  //smoothscroll
  $('a[href^="#"]').on("click", function (e) {
    // e.preventDefault();
    $(".Polaris-Scrollable").off("scroll");

    $("a").each(function () {
      $(this).removeClass("active");
    });
    $(this).addClass("active");
    // var div = $(this).attr("href");
    // console.log($(`${div}`).offset().top);
    // $(".Polaris-Scrollable")
    //   .stop()
    //   .animate(
    //     {
    //       scrollTop: $("#review-per-page").offset().top,
    //     },
    //     500,
    //     "swing",
    //     function () {
    //       $(".Polaris-Scrollable").on("scroll", onScroll);
    //     }
    //   );
  });
  function onScroll(event) {
    var scrollPos = $(window).scrollTop();
    $(".menu-link-settings a").each(function () {
      var currLink = $(this);
      var refElement = $(currLink.attr("href"));
      if (
        refElement.position().top <= scrollPos &&
        refElement.position().top + refElement.height() > scrollPos
      ) {
        $("#menu-link-settings a").removeClass("active");
        currLink.addClass("active");
      } else {
        currLink.removeClass("active");
      }
    });
  }
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    if (selectedTabIndex == 0) {
      history.push(config.pathName + "/settings/display-reviews");
    }
    if (selectedTabIndex == 1) {
      history.push(config.pathName + "/settings/display-customize");
    }
    if (selectedTabIndex == 2) {
      history.push(config.pathName + "/settings/display-advanced");
    }
  }, []);

  const tabs = [
    {
      id: "display-reviews",
      content: "Display reviews",
    },
    {
      id: "customize-reviews",
      content: "Customize form review",
    },
    {
      id: "advanced-settings",
      content: "Advanced settings",
    },
  ];
  return (
    <div>
      {loading && <Loading />}
      <Layout>
        <Layout.Section oneThird>
          <div style={{ margin: "11px 0 13px" }}>
            <Title title="Settings" />
          </div>
        </Layout.Section>
      </Layout>
      <Alert />
      <div
        style={{ marginBottom: "40px", width: "50%", margin: "0 auto 40px" }}
      >
        <Tabs
          tabs={tabs}
          selected={selected}
          onSelect={handleTabChange}
          fitted
        ></Tabs>
      </div>
      <Layout>
        {/* <Layout.Section oneThird>
          <div className="menu-link">
            <div style={{ display: "flex" }}>
              <i style={{ paddingTop: "22px" }}>
                <Icon color={activeIconDisplay} source={TabletMajor} />
              </i>
              {statusDisplay ? (
                <Link
                  className="btn .btn-lg top-button btn-outline"
                  id="hoverButton-active"
                  to={config.pathName + "/settings/display-reviews"}
                  onClick={handleDisplay}
                >
                  Display reviews
                </Link>
              ) : (
                <Link
                  className="btn btn-outline .btn-lg top-button"
                  id="hoverButton"
                  to={config.pathName + "/settings/display-reviews"}
                  onClick={handleDisplay}
                >
                  Display reviews
                </Link>
              )}
            </div>
            {statusDisplay && (
              <div className="menu-link-settings">
                <a href="#display-reviews" id="hoverButton">
                  Reviews Layout
                </a>
                <a href="#display-purchased" id="hoverButton">
                  Show "Verified Purchased" text
                </a>
                <a href="#display-recommend" id="hoverButton">
                  Show "Recommend Customer" text
                </a>
                <a href="#display-featured" id="hoverButton">
                  Only show featured reviews
                </a>
              </div>
            )}
            <div style={{ display: "flex" }}>
              <i style={{ paddingTop: "22px" }}>
                <Icon color={activeIconCustomize} source={GlobeMajor} />
              </i>

              {statusCustomize ? (
                <Link
                  className="btn btn-outline  .btn-lg top-button"
                  id="hoverButton-active"
                  to={config.pathName + "/settings/display-customize"}
                  onClick={handleCustomize}
                >
                  Customize text
                </Link>
              ) : (
                <Link
                  className="btn btn-outline  .btn-lg top-button"
                  id="hoverButton"
                  to={config.pathName + "/settings/display-customize"}
                  onClick={handleCustomize}
                >
                  Customize text
                </Link>
              )}
            </div>

            {statusCustomize && (
              <div className="menu-link-settings">
                <a id="hoverButton" href="#review-form-text">
                  Review form text
                </a>
                <a id="hoverButton" href="#review-listing-text">
                  Review listing text
                </a>
              </div>
            )}
            <div style={{ display: "flex" }}>
              <i style={{ paddingTop: "22px" }}>
                <Icon color={activeIconAdvance} source={ToolsMajor} />
              </i>
              {statusAdvanced ? (
                <Link
                  className="btn btn-outline  .btn-lg top-button"
                  id="hoverButton-active"
                  to={config.pathName + "/settings/display-advanced"}
                  onClick={handleAdvanced}
                >
                  Advanced settings
                </Link>
              ) : (
                <Link
                  className="btn btn-outline  .btn-lg top-button"
                  id="hoverButton"
                  to={config.pathName + "/settings/display-advanced"}
                  onClick={handleAdvanced}
                >
                  Advanced settings
                </Link>
              )}
            </div>
            {statusAdvanced && (
              <div className="menu-link-settings">
                <a id="hoverButton" href="#asking-customer">
                  Asking customer for review
                </a>
                <a id="hoverButton" href="#auto-publish">
                  Auto publish
                </a>
                <a id="hoverButton" href="#email-settings">
                  Email settings
                </a>
                <a id="hoverButton" href="#maximum-characters">
                  Maximum characters
                </a>
                <a id="hoverButton" href="#maximum-images">
                  Maximum images
                </a>
                <a id="hoverButton" href="#review-per-page">
                  Review per page
                </a>
                <a id="hoverButton" href="#featured-box-badge">
                  Featured reviews box badge
                </a>
                <a id="hoverButton" href="#insert-shortCode">
                  Insert shortCode
                </a>
                <a id="hoverButton" href="#custom-css">
                  Custom css
                </a>
              </div>
            )}
          </div>
        </Layout.Section> */}
        <Layout.Section>
          {/* <Scrollable shadow style={{ height: "100vh" }}> */}
          <Route
            path={config.pathName + "/settings/display-reviews"}
            component={DisplayReview}
          />
          <Route
            path={config.pathName + "/settings/display-customize"}
            component={DisplayCustomizeText}
          />
          <Route
            path={config.pathName + "/settings/display-advanced"}
            component={DisplayAdvanced}
          />
          {/* </Scrollable> */}
        </Layout.Section>
      </Layout>
      <div
        style={{
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextStyle variation="subdued">
          Copyright © 2010 - 2021 Omegatheme.com. All Rights Reserved
        </TextStyle>
      </div>
      <MoreApp />
    </div>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps, {})(Settings);
