import React, { Component, useEffect } from "react";
import Products from "./components/Products";
import Reviews from "./components/Reviews";
import Collections from "./components/Collections";
import ProductTypes from "./components/ProductTypes";
import Settings from "./components/Settings";
import Instructions from "./components/Instructions";
import DetailProduct from "./components/DetailProduct";
import Statistical from "./components/Statistical";
import Rating from "./components/plugin/Rating";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider, Frame, Icon } from "@shopify/polaris";
import "./css/style.css";
import {
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
} from "react-bootstrap";
import "@shopify/polaris/dist/styles.css";
import store from "./store";
import { Provider } from "react-redux";
import config from "./config/config";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "animate.css/animate.css";
import {
  AnalyticsMajor,
  CollectionsMajor,
  ProductsMajor,
  SettingsMajor,
  ListMajor,
  HintMajor,
  FeaturedCollectionMajor,
  FraudProtectPendingMajor,
} from "@shopify/polaris-icons";
import Requests from "./components/Requests";
const App = () => {
  return (
    <Provider store={store}>
      <AppProvider i18n={enTranslations}>
        <Frame>
          <Rating />
          <Router>
            <header>
              <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link href="#reviews">
                      <Link
                        className="Polaris-Button  linkHeader"
                        to={config.pathName + "/"}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "5px",
                          }}
                        >
                          <Icon source={ListMajor} />
                        </div>
                        Reviews
                      </Link>
                    </Nav.Link>
                    <Nav.Link href="#requests">
                      <Link
                        className="Polaris-Button  linkHeader"
                        to={config.pathName + "/requests"}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "5px",
                          }}
                        >
                          <Icon source={FraudProtectPendingMajor} />
                        </div>
                        Requests
                      </Link>
                    </Nav.Link>
                    <Nav.Link href="#product">
                      <Link
                        className="Polaris-Button  linkHeader"
                        to={config.pathName + "/products"}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "5px",
                          }}
                        >
                          <Icon source={ProductsMajor} />
                        </div>
                        Products
                      </Link>
                    </Nav.Link>
                    <Nav.Link href="#productType">
                      <Link
                        className="Polaris-Button  linkHeader"
                        to={config.pathName + "/productTypes"}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "5px",
                          }}
                        >
                          <Icon source={FeaturedCollectionMajor} />
                        </div>
                        Product Types
                      </Link>
                    </Nav.Link>
                    <Nav.Link href="#collections">
                      <Link
                        className="Polaris-Button  linkHeader"
                        to={config.pathName + "/collections"}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "5px",
                          }}
                        >
                          <Icon source={CollectionsMajor} />
                        </div>
                        Collections
                      </Link>
                    </Nav.Link>
                    <Nav.Link href="#statistical">
                      <Link
                        className="Polaris-Button  linkHeader"
                        to={config.pathName + "/statistical"}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "5px",
                          }}
                        >
                          <Icon source={AnalyticsMajor} />
                        </div>
                        Statistical
                      </Link>
                    </Nav.Link>
                    <Nav.Link href="#settings">
                      <Link
                        className="Polaris-Button  linkHeader "
                        to={config.pathName + "/settings/display-reviews"}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "5px",
                          }}
                        >
                          <Icon source={SettingsMajor} />
                        </div>
                        Settings
                      </Link>
                    </Nav.Link>
                    <Nav.Link href="#instructions">
                      <Link
                        className="Polaris-Button  linkEndHeader"
                        to={config.pathName + "/instructions"}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "5px",
                          }}
                        >
                          <Icon source={HintMajor} />
                        </div>
                        Instructions
                      </Link>
                    </Nav.Link>
                  </Nav>
                  <Form inline>
                    <div
                      style={{
                        textAlign: "end",
                        lineHeight: "46px",
                        display: "inline-block",
                      }}
                    >
                      <a
                        href="https://apps.omegatheme.com/customer-reviews/guide.html"
                        style={{
                          marginRight: "50px",
                          fontSize: "17px",
                          fontWeight: "bold",
                        }}
                        target="_blank"
                      >
                        Document here!
                      </a>
                    </div>
                  </Form>
                </Navbar.Collapse>
              </Navbar>
            </header>
            <div id="reviews-box">
              <Route
                path={config.pathName + "/products"}
                component={Products}
              />
              <Route path={config.pathName + "/"} exact component={Reviews} />
              <Route
                path={config.pathName + "/filter/productType/:id"}
                component={Reviews}
              />
              <Route
                path={config.pathName + "/filter/collection/:id"}
                component={Reviews}
              />
              <Route
                path={config.pathName + "/filter/product/:id"}
                component={Reviews}
              />
              <Route
                path={config.pathName + "/settings"}
                component={Settings}
              />
              <Route
                path={config.pathName + "/instructions"}
                component={Instructions}
              />
              <Route
                path={config.pathName + "/detail-product/:id"}
                component={DetailProduct}
              />
              <Route
                path={config.pathName + "/statistical"}
                component={Statistical}
              />
              <Route
                path={config.pathName + "/productTypes"}
                component={ProductTypes}
              />
              <Route
                path={config.pathName + "/collections"}
                component={Collections}
              />
              <Route
                path={config.pathName + "/requests"}
                component={Requests}
              />

              {/* <Route
                  path={config.pathName + "/importUrl/:id"}
                  component={ImportUrl}
                /> */}
              {/* <Route
                  path={config.pathName + "/ImportUrlToMultiProducts"}
                  component={ImportUrlToMultiProducts}
                /> */}
            </div>
          </Router>
        </Frame>
      </AppProvider>
    </Provider>
  );
};

export default App;
