import React, { useEffect, useState, useCallback } from "react";
import "../css/detailProduct/index.css";
import { ViewMinor, EditMinor } from "@shopify/polaris-icons";
import config from "../config/config";
import { Table } from "reactstrap";
import ModalDeleteReview from "./modals/detail-product-page/ModalDeleteReview";
import ModalUnPublishChecked from "./modals/detail-product-page/ModalUnPublishChecked";
import ModalPublishChecked from "./modals/detail-product-page/ModalPublishChecked";
import ModalFlagChecked from "./modals/detail-product-page/ModalFlagChecked";
import ModalUnFlagChecked from "./modals/detail-product-page/ModalUnFlagChecked";
import ModalDeleteChecked from "./modals/detail-product-page/ModalDeleteChecked";
import ModalStepImport from "./modals/reviews-page/ModalStepImport";
import ModalCreateReview from "./modals/reviews-page/ModalCreateReview";

import { Link } from "react-router-dom";
import Alert from "./contents/Alert";

import {
  Page,
  Badge,
  ProgressBar,
  Pagination,
  TextField,
  Icon,
  Card,
  SkeletonThumbnail,
  SkeletonBodyText,
  Spinner,
  TextStyle,
} from "@shopify/polaris";
import { FavoriteMajor } from "@shopify/polaris-icons";
import ReactStars from "react-stars";
import { useHistory } from "react-router-dom";

import {
  getProductsDetail,
  getAllReviewProduct,
  getAllReviewProductInPage,
  getCountReviewByProduct,
  getImageReviewByProduct,
  ChangeCheckedReviews,
  getProductTypeSelect,
  getCollectionsSelect,
  loadDataTable,
  reloadTheme,
} from "../actions/reviews";
import {
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  getConnectProductReviews,
  getImageReview,
} from "../actions/listReviews";
import {
  CollectionsMajor,
  ProductsMajor,
  FeaturedCollectionMajor,
} from "@shopify/polaris-icons";
import { getProductType } from "../actions/productTypes";
import Loading from "./contents/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const DetailProduct = ({
  getImageReview,
  getConnectProductReviews,
  getConnectCollectionReviews,
  getProductsDetail,
  getAllReviewProductInPage,
  getCountReviewByProduct,
  getImageReviewByProduct,
  getAllReviewProduct,
  ChangeCheckedReviews,
  getProductTypeSelect,
  getCollectionsSelect,
  getConnectProductTypeReviews,
  getProductType,
  loadDataTable,
  reloadTheme,
  reviews: {
    loading,
    product,
    reviewByProduct,
    countReviewByProduct,
    // imageReviews,
    allReviewByProduct,
    deleteImage,
    arrCheckedReview,
    loadingTable,
    collectionsSelect,
    productTypeSelect,
    loadingTheme,
  },
  listReviews: {
    connectCollectionReviews,
    connectProductTypeReviews,
    connectProductReviews,
    imageReviews,
  },
  productTypes: { productTypes },
  match,
}) => {
  useEffect(() => {
    loadDataTable();
    reloadTheme();
  }, []);
  useEffect(() => {
    ChangeCheckedReviews([]);
  }, []);
  useEffect(() => {
    getImageReview();
  }, [getImageReview]);
  useEffect(() => {
    getConnectProductReviews();
  }, [getConnectProductReviews]);
  useEffect(() => {
    getConnectCollectionReviews();
  }, [getConnectCollectionReviews]);
  useEffect(() => {
    getProductType();
  }, [getProductType]);
  useEffect(() => {
    getConnectProductTypeReviews();
  }, [getConnectProductTypeReviews]);

  useEffect(() => {
    getProductsDetail(match.params.id);
  }, [getProductsDetail]);
  useEffect(() => {
    getAllReviewProductInPage("", match.params.id, 0);
  }, [getAllReviewProductInPage]);

  useEffect(() => {
    getProductTypeSelect();
  }, [getProductTypeSelect]);
  useEffect(() => {
    getCollectionsSelect();
  }, [getCollectionsSelect]);
  useEffect(() => {
    getAllReviewProduct(match.params.id);
  }, [getAllReviewProduct]);
  // useEffect(() => {
  //   getImageReviewByProduct(match.params.id);
  // }, [getImageReviewByProduct]);
  useEffect(() => {
    getCountReviewByProduct("", match.params.id);
  }, [getCountReviewByProduct]);
  const [statusCheckAll, setStatusCheckAll] = useState(false);
  const handleCheckAll = useCallback(async () => {
    // let e = collectionsSelect.filter(
    //   (r) =>
    //     r.value ===
    //     connectCollectionReviews.filter((e) => e.review_id == "2081")[0]
    //       .collection_id
    // );
    await setStatusCheckAll(!statusCheckAll);
    var checkboxes = document.getElementsByName("nameProducts[]");
    let arr = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (statusCheckAll == true) {
        checkboxes[i].checked = false;
        arr = [];
      }
      if (statusCheckAll == false) {
        checkboxes[i].checked = true;
        arr.push(checkboxes[i].value);
      }
    }
    ChangeCheckedReviews(arr);
    var rowChecked = document.getElementsByName("rowChecked");
    for (var j = 0; j < rowChecked.length; j++) {
      if (rowChecked[j].children[0].children[0].checked) {
        rowChecked[j].classList.add("rowChecked");
      }
      if (rowChecked[j].children[0].children[0].checked == false) {
        rowChecked[j].classList.remove("rowChecked");
      }
    }
  });
  const setStatusChecked = useCallback(() => {
    setStatusCheckAll(false);
  });
  const handleCheckOnly = useCallback(() => {
    let arr = [];
    var checkboxes = document.getElementsByName("nameProducts[]");
    let checkAllOrNo = true;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        arr.push(checkboxes[i].value);
      } else {
        checkAllOrNo = false;
      }
    }
    ChangeCheckedReviews(arr);
    var rowChecked = document.getElementsByName("rowChecked");

    for (var j = 0; j < rowChecked.length; j++) {
      if (rowChecked[j].children[0].children[0].checked) {
        rowChecked[j].classList.add("rowChecked");
      }
      if (rowChecked[j].children[0].children[0].checked == false) {
        rowChecked[j].classList.remove("rowChecked");
      }
    }
    var checkboxesAll = document.getElementById("check_all");
    if (checkAllOrNo) {
      checkboxesAll.checked = true;
      setStatusCheckAll(true);
    }
    if (checkAllOrNo == false) {
      checkboxesAll.checked = false;
      setStatusCheckAll(false);
    }
  });
  //search
  const [offsetSearch, setOffsetSearch] = useState(0);

  const [valueSearch, setSearch] = useState(""); //console.log(value)
  const handleChangeInputSearch = useCallback(async (newValue) => {
    setSearch(newValue);
    loadDataTable();
    getAllReviewProductInPage(newValue, match.params.id, 0);
    getCountReviewByProduct(newValue, match.params.id);
  }, []);
  const handleChangeOffsetSearchNext = () => {
    if (offsetSearch + 1 < Math.ceil(countReviewByProduct / 25)) {
      loadDataTable();
      setOffsetSearch(offsetSearch + 1);
      getAllReviewProductInPage(valueSearch, match.params.id, offsetSearch + 1);
    }
  };
  const handleChangeOffsetSearchPre = () => {
    if (offsetSearch >= 1) {
      loadDataTable();
      setOffsetSearch(offsetSearch - 1);
      getAllReviewProductInPage(valueSearch, match.params.id, offsetSearch - 1);
    }
  };
  const history = useHistory();
  return (
    <div>
      <Alert />
      <Link className="btn btn-back" to={config.pathName + "/products"}>
        &#10094; List Products
      </Link>
      <Page
        title={
          loadingTheme ? (
            <Card>
              <div style={{ padding: "20px" }}>
                <SkeletonThumbnail size="large" />
                <SkeletonBodyText />
              </div>
            </Card>
          ) : (
            <Card>
              <div className="detail-card">
                <div className="card-detail">
                  <div>
                    <img
                      width="160px"
                      height="160px"
                      src={product.products_image_url}
                    ></img>
                  </div>
                  <div className="info-detail">
                    <a
                      className="title-detail-product"
                      href={product.productUrl}
                      target="_blank"
                    >
                      {product.products_title}
                    </a>
                    <div id="group-status">
                      <Badge status="success">
                        {
                          allReviewByProduct.filter((e) => e.publish === "1")
                            .length
                        }{" "}
                        Published
                      </Badge>
                      <Badge>
                        {
                          allReviewByProduct.filter((e) => e.publish === "0")
                            .length
                        }{" "}
                        UnPublished
                      </Badge>
                      <Badge status="success">
                        {
                          allReviewByProduct.filter((e) => e.featured === "1")
                            .length
                        }{" "}
                        Featured
                      </Badge>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <ModalStepImport
                        idProduct={match.params.id}
                        styleButton="importInDetailProduct"
                        setStatusChecked={setStatusChecked}
                      />
                    </div>
                  </div>
                </div>
                <div className="rating-detail">
                  <div className="rating-total">
                    {product.countReviews === "0" ? (
                      <div>
                        <h1 id="medium-rating">0/5</h1>
                        <ReactStars
                          style={{ display: "inline-block" }}
                          count={5}
                          size={24}
                          emptyIcon={<i className="far fa-star"></i>}
                          fullIcon={<i className="fa fa-star"></i>}
                          color2="#ffb50d"
                          value={0}
                          edit={false}
                        />
                      </div>
                    ) : (
                      <div>
                        <h1 id="medium-rating">
                          {(
                            product.ratingReviews / product.countReviews
                          ).toFixed(2)}
                          /5
                        </h1>
                        <ReactStars
                          style={{ display: "inline-block" }}
                          count={5}
                          size={24}
                          emptyIcon={<i className="far fa-star"></i>}
                          fullIcon={<i className="fa fa-star"></i>}
                          color2="#ffb50d"
                          value={parseInt(
                            (
                              product.ratingReviews / product.countReviews
                            ).toFixed(2)
                          )}
                          edit={false}
                        />
                      </div>
                    )}
                  </div>
                  <div className="rating-star">
                    <div className="star-progress">
                      <p style={{ fontSize: "20px" }}>1</p>
                      <i
                        className="fas fa-star"
                        style={{
                          color: "rgb(255, 181, 13)",
                          margin: "0 5px 0",
                          fontSize: "18px",
                        }}
                      ></i>
                      {allReviewByProduct.length === 0 ? (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar progress={0} />
                        </div>
                      ) : (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar
                            progress={
                              (allReviewByProduct.filter(
                                (e) => e.reviewer_rating === "1"
                              ).length /
                                allReviewByProduct.length) *
                              100
                            }
                          />
                        </div>
                      )}
                      <p style={{ fontSize: "20px", marginLeft: "5px" }}>
                        {
                          allReviewByProduct.filter(
                            (e) => e.reviewer_rating === "1"
                          ).length
                        }{" "}
                      </p>
                    </div>
                    <div className="star-progress">
                      <p style={{ fontSize: "20px" }}>2</p>
                      <i
                        className="fas fa-star"
                        style={{
                          color: "rgb(255, 181, 13)",
                          margin: "0 5px 0",
                          fontSize: "18px",
                        }}
                      ></i>
                      {allReviewByProduct.length === 0 ? (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar progress={0} />
                        </div>
                      ) : (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar
                            progress={
                              (allReviewByProduct.filter(
                                (e) => e.reviewer_rating === "2"
                              ).length /
                                allReviewByProduct.length) *
                              100
                            }
                          />
                        </div>
                      )}

                      <p style={{ fontSize: "20px", marginLeft: "5px" }}>
                        {
                          allReviewByProduct.filter(
                            (e) => e.reviewer_rating === "2"
                          ).length
                        }{" "}
                      </p>
                    </div>
                    <div className="star-progress">
                      <p style={{ fontSize: "20px" }}>3</p>
                      <i
                        className="fas fa-star"
                        style={{
                          color: "rgb(255, 181, 13)",
                          margin: "0 5px 0",
                          fontSize: "18px",
                        }}
                      ></i>
                      {allReviewByProduct.length === 0 ? (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar progress={0} />
                        </div>
                      ) : (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar
                            progress={
                              (allReviewByProduct.filter(
                                (e) => e.reviewer_rating === "3"
                              ).length /
                                allReviewByProduct.length) *
                              100
                            }
                          />
                        </div>
                      )}
                      <p style={{ fontSize: "20px", marginLeft: "5px" }}>
                        {
                          allReviewByProduct.filter(
                            (e) => e.reviewer_rating === "3"
                          ).length
                        }{" "}
                      </p>
                    </div>
                    <div className="star-progress">
                      <p style={{ fontSize: "20px" }}>4</p>
                      <i
                        className="fas fa-star"
                        style={{
                          color: "rgb(255, 181, 13)",
                          margin: "0 5px 0",
                          fontSize: "18px",
                        }}
                      ></i>
                      {allReviewByProduct.length === 0 ? (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar progress={0} />
                        </div>
                      ) : (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar
                            progress={
                              (allReviewByProduct.filter(
                                (e) => e.reviewer_rating === "4"
                              ).length /
                                allReviewByProduct.length) *
                              100
                            }
                          />
                        </div>
                      )}
                      <p style={{ fontSize: "20px", marginLeft: "5px" }}>
                        {
                          allReviewByProduct.filter(
                            (e) => e.reviewer_rating === "4"
                          ).length
                        }{" "}
                      </p>
                    </div>
                    <div className="star-progress">
                      <p style={{ fontSize: "20px" }}>5</p>
                      <i
                        className="fas fa-star"
                        style={{
                          color: "rgb(255, 181, 13)",
                          margin: "0 5px 0",
                          fontSize: "18px",
                        }}
                      ></i>
                      {allReviewByProduct.length === 0 ? (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar progress={0} />
                        </div>
                      ) : (
                        <div style={{ width: "50%", float: "left" }}>
                          <ProgressBar
                            progress={
                              (allReviewByProduct.filter(
                                (e) => e.reviewer_rating === "5"
                              ).length /
                                allReviewByProduct.length) *
                              100
                            }
                          />
                        </div>
                      )}
                      <p style={{ fontSize: "20px", marginLeft: "5px" }}>
                        {
                          allReviewByProduct.filter(
                            (e) => e.reviewer_rating === "5"
                          ).length
                        }{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        }
        secondaryActions={[
          {
            content: "Edit Product",
            icon: EditMinor,
            onAction: () => {
              window.open(
                "https://" + config.shop + "/admin/products/" + match.params.id
              );
            },
          },
          {
            content: "View on store",
            icon: ViewMinor,
            onAction: () => {
              window.open(product.productUrl);
            },
          },
        ]}
      >
        <Card>
          <div style={{ padding: "15px" }}>
            <TextField
              placeholder="Type to search"
              value={valueSearch}
              onChange={handleChangeInputSearch}
            />
          </div>
          {arrCheckedReview.length !== 0 && (
            <div
              style={{
                position: "absolute",
                zIndex: 11,
                marginTop: "10px",
                marginLeft: "10px",
              }}
            >
              <button
                className="Polaris-Button Polaris-Button selected-button-custom"
                onClick={handleCheckAll}
              >
                <input
                  style={{ marginRight: "10px" }}
                  type="checkbox"
                  defaultChecked={statusCheckAll}
                  id="check_all"
                ></input>
                {arrCheckedReview.length} selected
              </button>
              <button
                type="button"
                className="Polaris-Button Polaris-Button dropdown-toggle dropdown-button-custom"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                More action
              </button>
              <div className="dropdown-menu" style={{ minWidth: "28rem" }}>
                <ModalUnPublishChecked
                  idReviewChecked={arrCheckedReview}
                  offset={offsetSearch}
                  idProduct={match.params.id}
                  setStatusChecked={setStatusChecked}
                />
                <ModalPublishChecked
                  idReviewChecked={arrCheckedReview}
                  offset={offsetSearch}
                  idProduct={match.params.id}
                  setStatusChecked={setStatusChecked}
                />
                <ModalUnFlagChecked
                  idReviewChecked={arrCheckedReview}
                  offset={offsetSearch}
                  idProduct={match.params.id}
                  setStatusChecked={setStatusChecked}
                />
                <ModalFlagChecked
                  idReviewChecked={arrCheckedReview}
                  offset={offsetSearch}
                  idProduct={match.params.id}
                  setStatusChecked={setStatusChecked}
                />
                <ModalDeleteChecked
                  idReviewChecked={arrCheckedReview}
                  offset={offsetSearch}
                  idProduct={match.params.id}
                  setStatusChecked={setStatusChecked}
                />
              </div>
            </div>
          )}
          <Table id="table" hover>
            <thead className="thTable">
              {arrCheckedReview.length == 0 && (
                <tr>
                  <th width="5%" style={{ paddingLeft: "27px" }}>
                    <input
                      type="checkbox"
                      defaultChecked={statusCheckAll}
                      id="check_all"
                      onClick={handleCheckAll}
                    ></input>
                  </th>
                  <th width="10%">Name</th>
                  <th width="15%">Rating</th>
                  <th width="30%">Feedback</th>
                  <th>Source</th>
                  <th width="20%">Photo</th>
                  <th>Status</th>
                  <th width="5%" style={{ textAlign: "center" }}>
                    Assigned
                  </th>
                  <th>Action</th>
                </tr>
              )}
              {arrCheckedReview.length !== 0 && (
                <tr>
                  <th width="5%"></th>
                  <th width="10%"></th>
                  <th width="15%"></th>
                  <th width="30%"></th>
                  <th></th>
                  <th width="20%"></th>
                  <th></th>
                  <th width="5%"></th>
                  <th></th>
                </tr>
              )}
            </thead>
            <tbody>
              {loadingTable == false &&
                reviewByProduct.map((data, index) => (
                  <tr key={index} name="rowChecked">
                    <td style={{ paddingLeft: "27px" }}>
                      <input
                        type="checkbox"
                        name="nameProducts[]"
                        value={data.id}
                        onClick={handleCheckOnly}
                      ></input>
                    </td>
                    <td>{data.reviewer_name}</td>
                    <td>
                      <ReactStars
                        style={{ display: "inline-block" }}
                        count={5}
                        size={24}
                        emptyIcon={<i className="far fa-star"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        color2="#ffb50d"
                        value={parseInt(data.reviewer_rating)}
                        edit={false}
                      />
                    </td>
                    <td>
                      <h1>
                        <b>{data.reviewer_title}</b>
                        <br></br>
                        {data.reviewer_mess}
                      </h1>
                    </td>
                    <td>
                      <h1>{data.import_source}</h1>
                    </td>
                    <td>
                      <h1>
                        {imageReviews.map(
                          (e, index) =>
                            e.review_id == data.id && (
                              <img
                                key={index}
                                width="50px"
                                height="60px"
                                style={{
                                  marginRight: "5px",
                                  border: "1px solid rgb(191 203 214)",
                                }}
                                src={e.url}
                              ></img>
                            )
                        )}
                      </h1>
                    </td>
                    <td>
                      {data.publish === "1" ? (
                        <div>
                          <Badge status="success">Published</Badge>
                          <br></br>
                        </div>
                      ) : (
                        <div>
                          <Badge>UnPublished</Badge>
                          <br></br>
                        </div>
                      )}
                      {data.featured === "1" && (
                        <Badge status="success">Featured</Badge>
                      )}
                    </td>
                    {/* <td>
                      {data.collection_id !== "0" &&
                        collectionsSelect.map(
                          (dataResult) =>
                            dataResult.value ===
                              connectCollectionReviews.filter(
                                (e) => e.review_id == data.id
                              )[0].collection_id && (
                              <div key={index}>
                                <TextStyle variation="positive">
                                  {dataResult.label}
                                </TextStyle>
                              </div>
                            )
                        )}
                    </td> */}
                    <td>
                      {/* {data.product_type !== "0" &&
                        productTypes.map(
                          (dataResult) =>
                            dataResult.id ===
                              connectProductTypeReviews.filter(
                                (e) => e.review_id == data.id
                              )[0].id_product_type && (
                              <div key={index}>
                                <TextStyle variation="positive">
                                  {dataResult.product_type}
                                </TextStyle>
                              </div>
                            )
                        )} */}
                      {/* {data.product_id !== "0" && (
                        <div>
                          <TextStyle variation="positive">Products</TextStyle>
                          <br></br>
                        </div>
                      )}
                      {data.collection_id !== "0" && (
                        <div>
                          <TextStyle variation="positive">Collection</TextStyle>
                          <br></br>
                        </div>
                      )}
                      {data.product_type !== "0" && (
                        <div>
                          <TextStyle variation="positive">
                            Product Types
                          </TextStyle>
                          <br></br>
                        </div>
                      )}
                      {data.product_type == "0" &&
                        data.collection_id == "0" &&
                        data.product_id == "0" && (
                          <div>
                            <TextStyle variation="negative">
                              Has not been registered anywhere
                            </TextStyle>
                            <br></br>
                          </div>
                        )} */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          cursor: "pointer",
                        }}
                        title="Products has been assigned"
                      >
                        <div style={{ width: "17px" }}>
                          <Icon color="inkLighter" source={ProductsMajor} />
                        </div>
                        &rarr;
                        <TextStyle variation="subdued">
                          {
                            connectProductReviews.filter(
                              (e) => e.review_id === data.id
                            ).length
                          }
                        </TextStyle>
                        <br></br>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          cursor: "pointer",
                        }}
                        title="Collections has been assigned"
                      >
                        <div style={{ width: "17px" }}>
                          <Icon color="inkLighter" source={CollectionsMajor} />
                        </div>
                        &rarr;
                        <TextStyle variation="subdued">
                          {
                            connectCollectionReviews.filter(
                              (e) => e.review_id === data.id
                            ).length
                          }
                        </TextStyle>
                        <br></br>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          cursor: "pointer",
                        }}
                        title="Product types has been assigned"
                      >
                        <div style={{ width: "17px" }}>
                          <Icon
                            color="inkLighter"
                            source={FeaturedCollectionMajor}
                          />
                        </div>
                        &rarr;
                        <TextStyle variation="subdued">
                          {
                            connectProductTypeReviews.filter(
                              (e) => e.review_id === data.id
                            ).length
                          }
                        </TextStyle>
                        <br></br>
                      </div>
                    </td>
                    <td>
                      <ModalCreateReview
                        idReview={data.id}
                        productID={match.params.id}
                        offset={offsetSearch}
                        styleButton="editButton"
                        styleForm="editForm"
                      />
                      <ModalDeleteReview
                        id={data.id}
                        idProduct={match.params.id}
                        offset={offsetSearch}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {loadingTable && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "30vh",
              }}
            >
              <Spinner
                accessibilityLabel="Spinner example"
                size="large"
                color="inkLightest"
              />
            </div>
          )}
          {
            reviewByProduct.length == 0 && loadingTable == false && (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  lineHeight: "30vh",
                  height: "30vh",
                }}
              >
                <TextStyle variation="subdued">Not found data!</TextStyle>
              </div>
            ) //có dữ liệu nhưng trống
          }
          <div style={{ padding: "20px" }}>
            <Pagination
              hasPrevious
              onPrevious={handleChangeOffsetSearchPre}
              hasNext
              onNext={handleChangeOffsetSearchNext}
            />
          </div>
        </Card>
      </Page>
      {
        loading && <Loading /> //loading
      }
    </div>
  );
};
DetailProduct.propTypes = {
  getProductsDetail: PropTypes.func.isRequired,
  reviews: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reviews: state.reviews,
  listReviews: state.listReviews,
  productTypes: state.productTypes,
});

export default connect(mapStateToProps, {
  getProductsDetail,
  getAllReviewProductInPage,
  getCountReviewByProduct,
  getImageReviewByProduct,
  getAllReviewProduct,
  ChangeCheckedReviews,
  loadDataTable,
  getProductTypeSelect,
  getCollectionsSelect,
  getConnectCollectionReviews,
  getProductType,
  getConnectProductTypeReviews,
  loadDataTable,
  reloadTheme,
  getConnectProductReviews,
  getImageReview,
})(DetailProduct);
