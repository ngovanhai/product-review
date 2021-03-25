import React, { Component } from "react";
import "../css/style.css";
import MoreApp from "./plugin/MoreApp";
import config from "../config/config";
import Title from "./service/Title";
import { Card, Layout, Page, TextStyle } from "@shopify/polaris";
import imageSync from "./contents/syncHD.png";
class Instructions extends Component {
  render() {
    const divAddReview =
      '<div class="ot-customer-reviews insert-automatic"></div>';
    const addTheStar = '{% include "ot-collection-reviews" %}';
    return (
      <div>
        {/* <Title title="Instructions" /> */}
        <Page>
          <Layout>
            <Layout.Section oneThird>
              <div style={{ margin: "0 0 13px" }}>
                <Title title="Quick Guide" />
              </div>
            </Layout.Section>
          </Layout>
          <Layout>
            <Layout.Section secondary>
              <Card>
                <div
                  style={{ display: "flex" }}
                  className="animate__animated animate__fadeInUp"
                >
                  <img
                    width="200px"
                    height="120px"
                    src={config.rootLink + "/backend/images/guide6.jpg"}
                  />
                  <div style={{ padding: "20px", marginLeft: "30px" }}>
                    <p
                      style={{
                        fontWeight: "bold",
                        marginBottom: "10px",
                        display: "inline-block",
                      }}
                    >
                      1. Optionally add the star ratings badge to your
                      collection pages
                    </p>
                    <br></br>
                    <p
                      style={{ marginBottom: "20px", display: "inline-block" }}
                    >
                      - Here’re details that guide you how to add the code
                      snippet to display star ratings badge to your collection
                      pages (
                      <a
                        target="_blank"
                        href="https://apps.omegatheme.com/customer-reviews/guide.html#app_using_tutorial_collection_page"
                      >
                        read more
                      </a>
                      )
                    </p>
                    <br></br>
                    <TextStyle variation="code">
                      <pre>{addTheStar}</pre>
                    </TextStyle>
                  </div>
                </div>
              </Card>
            </Layout.Section>
          </Layout>
          <Layout>
            <Layout.Section secondary>
              <Card>
                <div
                  style={{ display: "flex" }}
                  className="animate__animated animate__fadeInUp"
                >
                  <img
                    width="200px"
                    height="380px"
                    src={config.rootLink + "/backend/images/import4.jpg"}
                    style={{ border: "1px solid rgb(211 221 230)" }}
                  />
                  <div style={{ padding: "20px", marginLeft: "30px" }}>
                    <p
                      style={{
                        fontWeight: "bold",
                        marginBottom: "10px",
                        display: "inline-block",
                      }}
                    >
                      2. Import reviews via Amazon.com or Aliexpress.com
                    </p>
                    <br></br>
                    <p>
                      - Here’re details that guide you how to Import reviews via
                      Amazon.com or Aliexpress.com (
                      <a
                        target="_blank"
                        href="https://apps.omegatheme.com/customer-reviews/guide.html#app_using_tutorial_import_review"
                      >
                        read more
                      </a>
                      )
                    </p>
                  </div>
                </div>
              </Card>
            </Layout.Section>
          </Layout>
          <MoreApp />
        </Page>
      </div>
    );
  }
}

export default Instructions;
