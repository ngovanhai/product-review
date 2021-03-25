import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactStars from "react-stars";
import axios from "axios";
import config from "../config/config";
import {
  getCountAllReviews,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  getCountProductInShopify,
  getCollectionsSelect,
  getProductType,
  getStaticalReviewPublish,
  getStaticalReviewPlace,
} from "../actions/statistical";
import Title from "./service/Title";
import MoreApp from "./plugin/MoreApp";
import { getSettings } from "../actions/settings";
import "../css/style.css";
import { Card, Layout, TextStyle, ResourceList } from "@shopify/polaris";

const Statistical = ({
  getSettings,
  getCountAllReviews,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  getCountProductInShopify,
  getCollectionsSelect,
  getProductType,
  getStaticalReviewPublish,
  getStaticalReviewPlace,
  statistical: {
    loading,
    countAllReviews,
    countAllUnPublishReview,
    countAllPublishReview,
    productNoReview,
    countProductInShopify,
    collections,
    productType,
    reviewQuery,
    reviewPlace,
  },
}) => {
  useEffect(() => {
    getStaticalReviewPublish();
  }, [getStaticalReviewPublish]);
  useEffect(() => {
    getStaticalReviewPlace();
  }, [getStaticalReviewPlace]);
  useEffect(() => {
    getProductType();
  }, [getProductType]);
  useEffect(() => {
    setProductTypeLength(productType.length);
  }, [productType]);
  useEffect(() => {
    getCountAllReviews();
  }, [getCountAllReviews]);
  useEffect(() => {
    getCollectionsSelect();
  }, [getCollectionsSelect]);
  useEffect(() => {
    setCollectionsLength(collections.length);
  }, [collections]);
  useEffect(() => {
    getCountProductInShopify();
  }, [getCountProductInShopify]);
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  useEffect(() => {
    getUnPublishReviews();
  }, [getUnPublishReviews]);
  useEffect(() => {
    getPublishReviews(0);
  }, [getPublishReviews]);
  useEffect(() => {
    getCountProductNoReview(0);
  }, [getCountProductNoReview]);
  // const handlePostWebhook = useCallback(() => {
  //   axios
  //     .get(config.rootLink + `/backend/server.php`, {
  //       params: {
  //         getWebhook: "",
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //     });
  // });
  // console.log(reviewPlace);
  const [collectionsLength, setCollectionsLength] = useState(0);
  const [productTypeLength, setProductTypeLength] = useState(0);
  return (
    <div>
      <Layout>
        <Layout.Section oneThird>
          <div style={{ margin: "11px 0 13px" }}>
            <Title title="Statistical" />
          </div>
          {/* <button onClick={handlePostWebhook}>Post webhook</button> */}
        </Layout.Section>
      </Layout>
      <Card>
        <Card.Section>
          <Layout>
            <Layout.Section oneThird>
              <Card title="Total reviews">
                <Card.Section>
                  <TextStyle variation="subdued">{countAllReviews}</TextStyle>
                </Card.Section>
                <Card.Section>
                  <ResourceList
                    resourceName={{ singular: "product", plural: "products" }}
                    items={[
                      {
                        id: 1,
                        name: "Publish",
                        quantity: countAllPublishReview,
                      },
                      {
                        id: 2,
                        name: "Un Publish",
                        quantity: countAllUnPublishReview,
                      },
                      {
                        id: 3,
                        name: "No Reviews",
                        quantity: productNoReview,
                      },
                    ]}
                    renderItem={(item) => {
                      const { id, url, name, sku, media, quantity } = item;

                      return (
                        <ResourceList.Item
                          id={id}
                          // url={url}
                          media={media}
                          accessibilityLabel={`View details for ${name}`}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h3>
                              <TextStyle variation="strong">{name}</TextStyle>
                            </h3>
                            <TextStyle variation="subdued">
                              {quantity}
                            </TextStyle>
                          </div>
                        </ResourceList.Item>
                      );
                    }}
                  />
                </Card.Section>
              </Card>
            </Layout.Section>
            <Layout.Section oneThird>
              <Card title="Average Stars base on published reviews">
                <Card.Section>
                  <div style={{ paddingLeft: "4px" }}>
                    <TextStyle variation="subdued">
                      {reviewQuery["averageReview"].toFixed(2)}/5
                    </TextStyle>
                  </div>
                  <ReactStars
                    style={{ display: "inline-block" }}
                    count={5}
                    size={24}
                    emptyIcon={<i className="far fa-star"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    color2="#ffb50d"
                    value={parseInt(reviewQuery["averageReview"])}
                    edit={false}
                  />
                </Card.Section>
                <Card.Section>
                  <ResourceList
                    resourceName={{ singular: "product", plural: "products" }}
                    items={[
                      {
                        id: 1,
                        name: "5 Stars",
                        quantity: reviewQuery["fiveStars"],
                      },
                      {
                        id: 2,
                        name: "4 Stars",
                        quantity: reviewQuery["fourStars"],
                      },
                      {
                        id: 3,
                        name: "3 Stars",
                        quantity: reviewQuery["threeStars"],
                      },
                      {
                        id: 4,
                        name: "2 Stars",
                        quantity: reviewQuery["twoStars"],
                      },
                      {
                        id: 5,
                        name: "1 Star",
                        quantity: reviewQuery["oneStar"],
                      },
                    ]}
                    renderItem={(item) => {
                      const { id, url, name, sku, media, quantity } = item;

                      return (
                        <ResourceList.Item
                          id={id}
                          // url={url}
                          media={media}
                          accessibilityLabel={`View details for ${name}`}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ display: "flex" }}>
                              <div class="rate">
                                <label
                                  style={{ color: "#ffc700" }}
                                  for="star1"
                                  title="text"
                                ></label>
                              </div>
                              <TextStyle variation="strong">{name}</TextStyle>
                            </div>
                            <TextStyle variation="subdued">
                              {quantity}
                            </TextStyle>
                          </div>
                        </ResourceList.Item>
                      );
                    }}
                  />
                </Card.Section>
              </Card>
            </Layout.Section>
            <Layout.Section oneThird>
              <Card title="Statistical reviews (collections, products, products type)">
                <Card.Section>
                  <TextStyle variation="subdued">{countAllReviews}</TextStyle>
                </Card.Section>
                <Card.Section>
                  <ResourceList
                    resourceName={{ singular: "product", plural: "products" }}
                    items={[
                      {
                        id: 1,
                        name: "Reviews for all pages",
                        quantity: countAllReviews,
                      },
                      {
                        id: 2,
                        name:
                          "Reviews for " + countProductInShopify + " Products",
                        quantity: reviewPlace["reviewForProducts"],
                      },
                      {
                        id: 3,
                        name:
                          "Reviews for " + collectionsLength + " Collections",
                        quantity: reviewPlace["reviewForCollection"],
                      },
                      {
                        id: 4,
                        name:
                          "Reviews for " + productTypeLength + " Product Types",
                        quantity: reviewPlace["reviewForProductTypes"],
                      },
                    ]}
                    renderItem={(item) => {
                      const { id, url, name, sku, media, quantity } = item;

                      return (
                        <ResourceList.Item
                          id={id}
                          // url={url}
                          media={media}
                          accessibilityLabel={`View details for ${name}`}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h3>
                              <TextStyle variation="strong">{name}</TextStyle>
                            </h3>
                            <TextStyle variation="subdued">
                              {quantity}
                            </TextStyle>
                          </div>
                        </ResourceList.Item>
                      );
                    }}
                  />
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </Card.Section>
        <MoreApp />
      </Card>
    </div>
  );
};
Statistical.propTypes = {
  reviews: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  statistical: state.statistical,
});

export default connect(mapStateToProps, {
  getCountAllReviews,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  getSettings,
  getCountProductInShopify,
  getCollectionsSelect,
  getProductType,
  getStaticalReviewPublish,
  getStaticalReviewPlace,
})(Statistical);
