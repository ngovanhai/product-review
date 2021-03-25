import React, { useCallback, useState, useEffect, useRef } from "react";
import { Button } from "@shopify/polaris";
import { DeleteMinor } from "@shopify/polaris-icons";
import {
  Page,
  Layout,
  Card,
  TextField,
  Select,
  Stack,
  RadioButton,
  TextStyle,
  Scrollable,
  Tag,
} from "@shopify/polaris";
import Loading from "./contents/Spinner";
import PropTypes from "prop-types";
import {
  getReviewImportUrl,
  reload,
  saveAndLoadMoreMultiProducts,
  clearData,
  ChangeCheckedReviews,
  DeleteCheckedReviews,
  replaceReviews,
  getArrProductsImport,
  displayError,
} from "../actions/importUrl";
import {
  changeProductsImport,
  resetProductsImport,
  getPublishReviews,
  getUnPublishReviews,
  getCountAllReviews,
  getCountProductNoReview,
  getProductsSearch,
  updateCountReview,
} from "../actions/reviews";
import { Link } from "react-router-dom";
import ReactStars from "react-stars";

import { Table } from "reactstrap";

import { connect } from "react-redux";
import config from "../config/config";
import Alert from "./contents/Alert";
import axios from "axios";
const ImportUrlToMultiProducts = ({
  match,
  getReviewImportUrl,
  reload,
  saveAndLoadMoreMultiProducts,
  updateCountReview,
  clearData,
  displayError,
  ChangeCheckedReviews,
  DeleteCheckedReviews,
  replaceReviews,
  getArrProductsImport,
  changeProductsImport,
  resetProductsImport,
  getPublishReviews,
  getUnPublishReviews,
  getCountAllReviews,
  getCountProductNoReview,
  getProductsSearch,
  url: {
    reviewsImportUrl,
    loading,
    reviewAdd,
    arrCheckedReview,
    arrProductImports,
  },
  reviews: { arrCheckedProducts },
}) => {
  // autoComplete
  const shop = config.shop;
  const [options, setOptions] = useState([]);
  const wrapperRef = useRef(null);
  const [idProduct, setIdProduct] = useState("");
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  useEffect(() => {
    const products = [];
    axios
      .get(config.rootLink + `/backend/server.php`, {
        params: {
          shop: shop,
          getAllProductDB: "",
        },
      })
      .then((res) => {
        return res.data.map((e) => products.push(e));
      });
    setOptions(products);
  }, []);
  useEffect(() => {
    getArrProductsImport(arrCheckedProducts);
  }, [getArrProductsImport]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };
  const setPokeDex = (poke, id) => {
    setIdProduct(id);
    setDisplay(false);
    setDisableSave(false);
  };
  //////////////////////////
  const [showLoading, setShowLoading] = useState("none");
  let reviews = [];
  useEffect(() => {
    reviews = reviewsImportUrl;
  }, [reviewsImportUrl]);
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleOut = useCallback(async () => {
    clearData();
    resetProductsImport();
    getPublishReviews();
    getUnPublishReviews();
    getCountAllReviews();
    getCountProductNoReview();
    getProductsSearch("", 0);
  });
  const activator = (
    <Button id="btn-outline" icon={DeleteMinor} onClick={handleChange}></Button>
  );
  //Start config area...........................................................................................................
  //input url
  const [valueUrl, setUrl] = useState("");
  const [isDisabledButtonSearch, setIsDisabledButtonSearch] = useState(true);
  const handleProductUrl = useCallback((newValue) => {
    setUrl(newValue);
    if (newValue === "") {
      setIsDisabledButtonSearch(true);
    } else setIsDisabledButtonSearch(false);
  }, []);
  //input reviewer name
  const [valueReviewersName, setReviewersName] = useState("Customer");
  const handleReviewerName = useCallback(
    (newValue) => setReviewersName(newValue),
    []
  );
  //input reviewer title
  const [valueReviewersTitle, setReviewersTitle] = useState("");
  const handleReviewerTitle = useCallback(
    (newValue) => setReviewersTitle(newValue),
    []
  );
  //select sort
  const [selectedSort, setSelectedSort] = useState("most-recent");
  const handleSelectChangeSort = useCallback(
    (value) => setSelectedSort(value),
    []
  );

  const optionsSort = [
    { value: "top-rated", label: "Top rated" },
    { value: "most-recent", label: "Most recent" },
  ];
  //select filter by star
  const [selectedStar, setSelectedStar] = useState("0");
  const handleSelectChangeStar = useCallback(
    (value) => setSelectedStar(value),
    []
  );
  const optionsStar = [
    { value: "0", label: "All stars" },
    { value: "5", label: "5 stars" },
    { value: "4", label: "4 stars" },
    { value: "3", label: "3 stars" },
    { value: "2", label: "2 stars" },
    { value: "1", label: "1 stars" },
    { value: "positive", label: "All Positive" },
    { value: "critical", label: "All Critical" },
  ];
  //radio buttons verified purchase
  const [verifiedPurchase, setVerifiedPurchase] = useState(
    "yesVerifiedPurchase"
  );

  const handleChangeVerifiedPurchase = useCallback((_checked, newValue) => {
    setVerifiedPurchase(newValue);
  }, []);
  //radio buttons image and video
  const [imageAndVideo, setImageAndVideo] = useState("noImageAndVideo");
  const handleChangeImageAndVideo = useCallback(
    (_checked, newValue) => setImageAndVideo(newValue),
    []
  );
  //radio buttons show blank
  const [showBlank, setShowBlank] = useState("noShowBlank");
  const handleChangeShowBlank = useCallback(
    (_checked, newValue) => setShowBlank(newValue),
    []
  );
  //End config area...........................................................................................................
  //Start show reviews area...........................................................................................................
  //select filter by star
  const [selectedStarInShow, setSelectedStarInShow] = useState("0");
  const handleSelectChangeStarInShow = useCallback((value) => {
    setSelectedStarInShow(value);
  }, []);
  if (selectedStarInShow === "0") {
    reviews = reviewsImportUrl;
  }
  if (selectedStarInShow === "1") {
    reviews = reviewsImportUrl.filter((e) => e.rating === "1");
  }
  if (selectedStarInShow === "2") {
    reviews = reviewsImportUrl.filter((e) => e.rating === "2");
  }
  if (selectedStarInShow === "3") {
    reviews = reviewsImportUrl.filter((e) => e.rating === "3");
  }
  if (selectedStarInShow === "4") {
    reviews = reviewsImportUrl.filter((e) => e.rating === "4");
  }
  if (selectedStarInShow === "5") {
    reviews = reviewsImportUrl.filter((e) => e.rating === "5");
  }
  const optionsStarInShow = [
    { value: "0", label: "All stars" },
    { value: "1", label: "1 stars" },
    { value: "2", label: "2 stars" },
    { value: "3", label: "3 stars" },
    { value: "4", label: "4 stars" },
    { value: "5", label: "5 stars" },
  ];
  //input find
  const [valueFind, setFind] = useState("");
  const handleFind = useCallback((newValue) => setFind(newValue), []);
  //input replace
  const [valueReplace, setReplace] = useState("");
  const handleReplace = useCallback((newValue) => {
    setReplace(newValue);
  }, []);
  const handleReplaceButton = useCallback((value, reviews) => {
    replaceReviews(value, reviews);
  }, []);
  //tableDsave
  const [checked, setChecked] = useState(false);
  const handleChangeChecked = useCallback(
    (newChecked) => setChecked(newChecked),
    []
  );
  const [statusCheckAll, setStatusCheckAll] = useState(false);
  const handleCheckAll = useCallback(async () => {
    await setStatusCheckAll(!statusCheckAll);
    var checkboxes = document.getElementsByName("name[]");
    let arr = [];
    for (var i = 1; i < checkboxes.length; i++) {
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
  });
  const Delete = useCallback((arr, reviews) => {
    DeleteCheckedReviews(arr, reviews);
    var checkboxes = document.getElementsByName("name[]");
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    setStatusCheckAll(false);
  }, []);
  const setStatusChecked = useCallback(() => {
    setStatusCheckAll(false);
  });
  const [arrIdChecked, setArrIdChecked] = useState([]);
  const handleCheckOnly = useCallback(() => {
    let arr = [];
    var checkboxes = document.getElementsByName("name[]");
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        arr.push(checkboxes[i].value);
      }
    }
    ChangeCheckedReviews(arr);
  });
  //SUBMIT
  let dataForm = [];
  const resolveData = useCallback(() => {
    dataForm["verifiedPurchase"] =
      verifiedPurchase === "yesVerifiedPurchase" ? "1" : "0";
    dataForm["imageAndVideo"] =
      imageAndVideo === "yesImageAndVideo" ? "1" : "0";
    dataForm["showBlank"] = showBlank === "yesShowBlank" ? "1" : "0";
  });
  const [page, setPage] = useState(1);
  const [countImport, setCountImport] = useState(0);
  const handleSaveAndLoadMore = useCallback(async () => {
    setPage(page + 1);
    await resolveData();
    reload();
    setShowLoading("block");

    await saveAndLoadMoreMultiProducts({
      arrId: arrCheckedProducts,
      reviews: reviews,
      url: valueUrl,
      count: countImport,
    });
    await getReviewImportUrl(
      valueUrl,
      selectedSort,
      dataForm["verifiedPurchase"],
      selectedStar,
      dataForm["imageAndVideo"],
      page + 1,
      valueReviewersName,
      valueReviewersTitle,
      dataForm["showBlank"]
    );
    updateCountReview(match.params.id);
    // if (reviewAdd["count"]) {
    //   setCountImport(reviewAdd["count"]);
    // } else {
    //   setCountImport(0);
    // }
  });
  useEffect(() => {
    setCountImport(reviewAdd["count"]);
  }, [reviewAdd["count"]]);

  const handleSearchButton = async () => {
    if (arrCheckedProducts.length == 0) {
      displayError("Not selected any products yet!");
    } else {
      await resolveData();
      reload();
      setShowLoading("block");
      await getReviewImportUrl(
        valueUrl,
        selectedSort,
        dataForm["verifiedPurchase"],
        selectedStar,
        dataForm["imageAndVideo"],
        page,
        valueReviewersName,
        valueReviewersTitle,
        dataForm["showBlank"]
      );
      setIsDisabledButtonSearch(true);
    }
  };
  const addProduct = async (productId, arr) => {
    if (arr.indexOf(productId) == -1) {
      arr.push(productId);
    }
    await changeProductsImport(arr);
    getArrProductsImport(arr);
    setDisplay(false);
    setDisableSave(false);
  };
  const removeTags = async (productID, arr) => {
    arr.indexOf(productID);
    arr.splice(arr.indexOf(productID), 1);
    // await changeProductsImport(arr);
    // getArrProductsImport(arr);
    // setDisplay(false);
    // setDisableSave(false);
  };

  //End show reviews area...........................................................................................................
  return (
    <div>
      <Link
        className="btn btn-back"
        onClick={handleOut}
        to={config.pathName + "/"}
      >
        &#10094; List Reviews
      </Link>

      <Page>
        <Alert />
        <Layout>
          <Layout.Section secondary>
            <Card sectioned>
              <div
                ref={wrapperRef}
                className="div-autocomplete"
                style={{ marginBottom: "5px" }}
              >
                <p id="title-autocomplete">Choose product import</p>
                <input
                  className="form-control mr-sm-2 input-autocomplete"
                  type="search"
                  aria-label="Search"
                  onClick={() => setDisplay(true)}
                  id="auto"
                  placeholder="Type to search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                ></input>
                {display && (
                  <div className="autoContainer">
                    <Scrollable
                      shadow
                      style={{ maxHeight: "50vh", overflow: "auto" }}
                    >
                      {options
                        .filter(
                          ({ products_title }) =>
                            products_title
                              .toLowerCase()
                              .indexOf(search.toLowerCase()) > -1
                        )
                        .map((v, i) => {
                          return (
                            <div
                              onClick={
                                () =>
                                  addProduct(v.products_id, arrCheckedProducts)
                                // })
                              }
                              className="options"
                              key={i}
                              tabIndex="0"
                            >
                              <span>{v.products_title}</span>
                            </div>
                          );
                        })}
                    </Scrollable>
                  </div>
                )}
              </div>
              <div className="marginBottom">
                <Scrollable
                  shadow
                  style={{ maxHeight: "100px", overflow: "auto" }}
                >
                  {arrProductImports.length !== 0 &&
                    arrProductImports.map((e, i) => (
                      <div key={i} style={{ marginBottom: "2px" }}>
                        <Tag
                          onRemove={() => {
                            arrCheckedProducts.splice(
                              arrCheckedProducts.indexOf(e.products_id),
                              1
                            );
                            changeProductsImport(arrCheckedProducts);
                            getArrProductsImport(arrCheckedProducts);
                          }}
                        >
                          {e.products_title}
                        </Tag>
                        {/* <br></br> */}
                      </div>
                    ))}
                </Scrollable>
              </div>
              <div className="marginBottom">
                <TextField
                  label="Product's URL"
                  value={valueUrl}
                  onChange={handleProductUrl}
                />
              </div>
              <div className="marginBottom">
                <Select
                  label="Date range"
                  options={optionsSort}
                  onChange={handleSelectChangeSort}
                  value={selectedSort}
                />
              </div>
              <div className="marginBottom">
                <p>Only verified purchase (Amazon's products)</p>
                <div style={{ marginTop: "15px" }}>
                  <Stack>
                    <RadioButton
                      label="Yes"
                      checked={verifiedPurchase === "yesVerifiedPurchase"}
                      id="yesVerifiedPurchase"
                      name="yesNoVerifiedPurchase"
                      onChange={handleChangeVerifiedPurchase}
                    />
                    <RadioButton
                      label="No"
                      id="noVerifiedPurchase"
                      name="yesNoVerifiedPurchase"
                      checked={verifiedPurchase === "noVerifiedPurchase"}
                      onChange={handleChangeVerifiedPurchase}
                    />
                  </Stack>
                </div>
              </div>
              <div className="marginBottom">
                <Select
                  label="Filter by star"
                  options={optionsStar}
                  onChange={handleSelectChangeStar}
                  value={selectedStar}
                />
              </div>
              <div className="marginBottom">
                <p>Only image and video review</p>
                <div style={{ marginTop: "15px" }}>
                  <Stack>
                    <RadioButton
                      label="Yes"
                      checked={imageAndVideo === "yesImageAndVideo"}
                      id="yesImageAndVideo"
                      name="yesImageAndVideo"
                      onChange={handleChangeImageAndVideo}
                    />
                    <RadioButton
                      label="No"
                      id="noImageAndVideo"
                      name="noImageAndVideo"
                      checked={imageAndVideo === "noImageAndVideo"}
                      onChange={handleChangeImageAndVideo}
                    />
                  </Stack>
                </div>
              </div>
              <div className="marginBottom">
                <p>Show blank review's content</p>
                <div style={{ marginTop: "15px" }}>
                  <Stack>
                    <RadioButton
                      label="Yes"
                      checked={showBlank === "yesShowBlank"}
                      id="yesShowBlank"
                      name="yesNoShowBlank"
                      onChange={handleChangeShowBlank}
                    />
                    <RadioButton
                      label="No"
                      id="noShowBlank"
                      name="yesNoShowBlank"
                      checked={showBlank === "noShowBlank"}
                      onChange={handleChangeShowBlank}
                    />
                  </Stack>
                </div>
              </div>
              <div className="marginBottom">
                <TextField
                  label="Default reviewer's name when blank"
                  value={valueReviewersName}
                  onChange={handleReviewerName}
                />
              </div>
              <div className="marginBottom">
                <TextField
                  label="Default review's title when blank"
                  value={valueReviewersTitle}
                  onChange={handleReviewerTitle}
                />
              </div>
              <Button
                primary
                disabled={isDisabledButtonSearch}
                onClick={handleSearchButton}
              >
                Search
              </Button>
            </Card>
          </Layout.Section>
          <Layout.Section>
            {
              loading == true && <Loading show={showLoading} /> //loading
            }
            {reviews.length == 0 && loading == true && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "180px",
                  fontSize: "2rem",
                }}
              >
                <TextStyle variation="subdued">No reviews found.</TextStyle>
              </div>
            )}
            {reviews.length == 0 && loading == false && (
              <Card sectioned>
                {arrCheckedReview.length == 0 && (
                  <div
                    className="marginBottom"
                    style={{
                      float: "right",
                    }}
                  >
                    <Button primary onClick={handleSaveAndLoadMore}>
                      Save &amp; Load more
                    </Button>
                  </div>
                )}
                <TextStyle variation="positive">
                  {countImport} reviews imported
                </TextStyle>
                {reviewAdd["countDuplicate"] > 0 && (
                  <div>
                    <br></br>
                    <TextStyle variation="positive">
                      Skipped - {reviewAdd["countDuplicate"]} reviews duplicate
                    </TextStyle>
                  </div>
                )}
                <div style={{ display: "flex" }}>
                  <div
                    className="marginBottom"
                    style={{ marginTop: "20px", width: "35%" }}
                  >
                    <Select
                      options={optionsStarInShow}
                      onChange={handleSelectChangeStarInShow}
                      value={selectedStarInShow}
                    />
                  </div>
                  <div
                    className="marginBottom"
                    style={{
                      marginTop: "20px",
                      width: "35%",
                      marginLeft: "20px",
                    }}
                  >
                    <TextField
                      placeholder="Find"
                      value={valueFind}
                      onChange={handleFind}
                    />
                  </div>
                </div>
                <Layout>
                  <Layout.Section oneThird>
                    <div className="marginBottom">
                      <TextField
                        placeholder="Replace by"
                        value={valueReplace}
                        onChange={handleReplace}
                      />
                    </div>
                  </Layout.Section>
                  <Layout.Section oneThird>
                    <Button
                      primary
                      onClick={() => handleReplaceButton(valueReplace, reviews)}
                    >
                      REPLACE
                    </Button>
                  </Layout.Section>
                </Layout>
                <Table id="table" hover>
                  <thead>
                    <tr>
                      <th width="5%"></th>
                      <th width="40%">Review</th>
                      <th width="20%">Rating</th>
                      <th width="35%">Author</th>
                    </tr>
                  </thead>
                </Table>
                {reviews.length == 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "80px",
                      fontSize: "2rem",
                    }}
                  >
                    <TextStyle variation="subdued">No reviews found.</TextStyle>
                  </div>
                )}
              </Card>
            )}

            {reviews.length !== 0 && ( //có dữ liệu
              <Card sectioned>
                {arrCheckedReview.length !== 0 && (
                  <div style={{ float: "right" }}>
                    <Button
                      destructive
                      onClick={() => Delete(arrCheckedReview, reviews)}
                    >
                      Delete Selected
                    </Button>
                  </div>
                )}
                {arrCheckedReview.length == 0 && (
                  <div
                    className="marginBottom"
                    style={{
                      float: "right",
                    }}
                  >
                    <Button primary onClick={handleSaveAndLoadMore}>
                      Save &amp; Load more
                    </Button>
                  </div>
                )}
                <TextStyle variation="positive">
                  {countImport} reviews imported
                </TextStyle>
                {reviewAdd["countDuplicate"] > 0 && (
                  <div>
                    <br></br>
                    <TextStyle variation="positive">
                      Skipped - {reviewAdd["countDuplicate"]} reviews duplicate
                    </TextStyle>
                  </div>
                )}
                <div style={{ display: "flex" }}>
                  <div
                    className="marginBottom"
                    style={{ marginTop: "20px", width: "35%" }}
                  >
                    <Select
                      options={optionsStarInShow}
                      onChange={handleSelectChangeStarInShow}
                      value={selectedStarInShow}
                    />
                  </div>
                  <div
                    className="marginBottom"
                    style={{
                      marginTop: "20px",
                      width: "35%",
                      marginLeft: "20px",
                    }}
                  >
                    <TextField
                      placeholder="Find"
                      value={valueFind}
                      onChange={handleFind}
                    />
                  </div>
                </div>
                <Layout>
                  <Layout.Section oneThird>
                    <div className="marginBottom">
                      <TextField
                        placeholder="Replace by"
                        value={valueReplace}
                        onChange={handleReplace}
                      />
                    </div>
                  </Layout.Section>
                  <Layout.Section oneThird>
                    <Button
                      primary
                      onClick={() => handleReplaceButton(valueReplace, reviews)}
                    >
                      REPLACE
                    </Button>
                  </Layout.Section>
                </Layout>
                <Table id="table" hover>
                  <thead>
                    <tr>
                      <th width="5%">
                        <input
                          type="checkbox"
                          name="name[]"
                          id="check_all"
                          onClick={handleCheckAll}
                        ></input>
                      </th>
                      <th width="40%">Review</th>
                      <th width="20%">Rating</th>
                      <th width="35%">Author</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews
                      .filter(
                        (e) =>
                          e.review_title.toLowerCase().indexOf(valueFind) >
                            -1 ||
                          e.reviewer_name.toLowerCase().indexOf(valueFind) >
                            -1 ||
                          e.review_content.toLowerCase().indexOf(valueFind) > -1
                      )
                      .map((data, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              name="name[]"
                              value={data.id}
                              onClick={handleCheckOnly}
                            ></input>
                          </td>
                          <td>
                            <b>Title: </b>
                            {data.review_title}
                            <br></br>
                            <b>Content: </b>
                            {data.review_content}
                            <br></br>
                            {data.images.map((e) => (
                              <img
                                src={e}
                                width="90px"
                                height="100px"
                                style={{ margin: "5px" }}
                              ></img>
                            ))}
                          </td>
                          <td>
                            {" "}
                            <ReactStars
                              style={{ display: "inline-block" }}
                              count={5}
                              size={24}
                              emptyIcon={<i className="far fa-star"></i>}
                              fullIcon={<i className="fa fa-star"></i>}
                              color2="#ffb50d"
                              value={data.rating}
                              edit={false}
                            />
                          </td>
                          <td>
                            {data.reviewer_name} on {data.date}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card>
            )}
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
};
ImportUrlToMultiProducts.propTypes = {
  getReviewImportUrl: PropTypes.func.isRequired,
  saveAndLoadMoreMultiProducts: PropTypes.func.isRequired,
  url: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  url: state.importReviewUrl,
  reviews: state.reviews,
});

export default connect(mapStateToProps, {
  getReviewImportUrl,
  reload,
  saveAndLoadMoreMultiProducts,
  updateCountReview,
  clearData,
  ChangeCheckedReviews,
  DeleteCheckedReviews,
  replaceReviews,
  getArrProductsImport,
  changeProductsImport,
  resetProductsImport,
  getPublishReviews,
  getUnPublishReviews,
  getCountAllReviews,
  getCountProductNoReview,
  getProductsSearch,
  displayError,
})(ImportUrlToMultiProducts);
