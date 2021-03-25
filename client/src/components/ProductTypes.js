import React, { useCallback, useState, useEffect } from "react";
import config from "../config/config";
import Title from "./service/Title";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Link } from "react-router-dom";
import ReactStars from "react-stars";
import MoreApp from "./plugin/MoreApp";
import { syncCollections } from "../actions/reviews";
import {
  reload,
  loadDataTable,
  changeCheckedProductTypes,
  getProductType,
  getCountProductType,
} from "../actions/productTypes";
import ModalStepImport from "./modals/reviews-page/ModalStepImport";

import ModalCreateReview from "./modals/reviews-page/ModalCreateReview";
import ModalImport from "./modals/reviews-page/ModalImport";
import ModalExport from "./modals/reviews-page/ModalExport";

import { getSettings } from "../actions/settings";
import Loading from "./contents/Spinner";
import Alert from "./contents/Alert";
import "../css/style.css";
import axios from "axios";

import { Table } from "reactstrap";
import {
  Select,
  Card,
  Layout,
  Pagination,
  TextStyle,
  ResourceList,
  Filters,
  Spinner,
  ChoiceList,
} from "@shopify/polaris";
import { Dropdown } from "react-bootstrap";

const Collections = ({
  getCountProductType,
  getSettings,
  syncCollections,
  loadDataTable,
  reload,
  changeCheckedProductTypes,
  getProductType,
  productTypes: {
    loading,
    productTypes,
    loadingTable,
    arrCheckedProductTypeImport,
    countProductTypes,
  },
}) => {
  const shop = config.shop;
  useEffect(() => {
    changeCheckedProductTypes([]);
    loadDataTable();
  }, []);
  useEffect(() => {
    getCountProductType();
  }, [getCountProductType]);
  // useEffect(() => {
  //   syncCollections();
  // }, [syncCollections]);
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  useEffect(() => {
    getProductType();
  }, [getProductType]);
  useEffect(() => {
    axios.get(config.rootLink + `/backend/server.php`, {
      params: {
        shop: shop,
        syncDataToDBStart: "",
        since_id: 0,
      },
    });
  }, []);
  const [selected, setSelected] = useState("allReview");
  const listAllProduct = productTypes ? productTypes : [];
  var datFilterProducts = [];

  const handleSelectChange = useCallback((selected, valueSearch, offset) => {
    loadDataTable();
    setStatusCheckAll(false);
    changeCheckedProductTypes([]);
    if (selected.length > 0) {
      setSelected(selected[0]);
      getProductType(valueSearch, offset, selected[0]);
      getCountProductType(valueSearch, selected[0]);
    }
  }, []);
  datFilterProducts = listAllProduct;
  //search input
  const [valueSearch, setSearch] = useState(""); //console.log(value)
  const [offsetSearch, setOffsetSearch] = useState(0);
  const handleChangeInputSearch = useCallback(
    async (newValue, offset, selected) => {
      loadDataTable();
      setSearch(newValue);
      getProductType(newValue, offset, selected);
      getCountProductType(newValue, selected);
      setStatusCheckAll(false);
      changeCheckedProductTypes([]);
    },
    []
  );
  const handleChangeOffsetSearchNext = (valueSearch, selected) => {
    if (offsetSearch + 1 < countProductTypes / 20) {
      setOffsetSearch(offsetSearch + 1);
      getProductType(valueSearch, offsetSearch + 1, selected);
      getCountProductType(valueSearch, selected);
      setStatusCheckAll(false);
      changeCheckedProductTypes([]);
    }
  };
  const handleChangeOffsetSearchPre = (valueSearch, selected) => {
    if (offsetSearch >= 1) {
      setOffsetSearch(offsetSearch - 1);
      getProductType(valueSearch, offsetSearch - 1, selected);
      getCountProductType(valueSearch, selected);
      setStatusCheckAll(false);
      changeCheckedProductTypes([]);
    }
  };

  const [statusCheckAll, setStatusCheckAll] = useState(false);
  const handleCheckAll = useCallback(async () => {
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
    changeCheckedProductTypes(arr);
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
    changeCheckedProductTypes(arr);
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
  const options = [
    { label: "All Products", value: "allReview" },
    { label: "Added Reviews", value: "addedReview" },
    { label: "No Reviews", value: "noReview" },
  ];
  function disambiguateLabel(key, value) {
    switch (key) {
      case "selectReviews":
        const render = value === "noReview" ? "No reviews" : "Added review";
        return `Filter products by "${render}"`;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "";
    }
  }

  const handleSelectReviewsRemove = useCallback((valueSearch, offset) => {
    loadDataTable();
    setSelected("allReview");
    getProductType(valueSearch, offset, "allReview");
    getCountProductType(valueSearch, "allReview");
    setStatusCheckAll(false);
    changeCheckedProductTypes([]);
  }, []);

  const handleQueryValueRemove = useCallback((selected, offset) => {
    loadDataTable();
    setSearch("");
    getProductType("", offset, selected);
    getCountProductType("", selected);
    setStatusCheckAll(false);
    changeCheckedProductTypes([]);
  }, []);
  const handleFiltersClearAll = useCallback(() => {
    loadDataTable();
    setSearch("");
    setSelected("allReview");
    getProductType();
    getCountProductType();
    setStatusCheckAll(false);
    changeCheckedProductTypes([]);
  }, []);
  const filters = [
    {
      key: "selectReviews",
      label: "Sort by Reviews",
      filter: (
        // <Select
        //   label="Sort by"
        //   labelInline
        //   options={options}
        //   onChange={(e) => handleSelectChange(e, valueSearch)}
        //   value={selected}
        // />
        <ChoiceList
          titleHidden
          choices={options}
          selected={selected || []}
          onChange={(e) => {
            handleSelectChange(e, valueSearch, offsetSearch);
          }}
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [];

  if (!isEmpty(selected) && selected !== "allReview") {
    const key = "selectReviews";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, selected),
      onRemove: () => handleSelectReviewsRemove(valueSearch, offsetSearch),
    });
  }

  const [selectedItems, setSelectedItems] = useState([]);
  return (
    <div>
      <div style={{ margin: "10px 0 10px" }}>
        <Layout>
          <Layout.Section oneThird>
            <Title title="Product Types" />
          </Layout.Section>
          <Layout.Section oneThird>
            <ModalCreateReview
              id="btn-outline"
              floatStyle="right"
              offset={offsetSearch}
            />
            {/* <ModalImport id="btn-outline" offset={offsetSearch} />
            <ModalExport id="btn-outline" />
            <ModalStepImport /> */}
          </Layout.Section>
        </Layout>
      </div>
      <Alert />
      <div style={{ height: "568px" }}>
        <Card>
          <ResourceList
            resourceName={{
              singular: "product types",
              plural: "product types",
            }}
            filterControl={
              <div>
                <Filters
                  queryValue={valueSearch}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={(e) =>
                    handleChangeInputSearch(e, offsetSearch, selected)
                  }
                  onQueryClear={() =>
                    handleQueryValueRemove(selected, offsetSearch)
                  }
                  onClearAll={handleFiltersClearAll}
                />
                {arrCheckedProductTypeImport.length !== 0 &&
                  appliedFilters.length == 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "64px",
                        left: "16px",
                        zIndex: 11,
                        // zIndex: 100,
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
                        {arrCheckedProductTypeImport.length} selected
                      </button>
                      <button
                        type="button"
                        className="dropdown-toggle Polaris-Button Polaris-Button dropdown-button-custom"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        More action
                      </button>
                      <div
                        className="dropdown-menu"
                        style={{ minWidth: "33rem" }}
                      >
                        <ModalStepImport
                          styleButton="importInChecked"
                          setStatusChecked={setStatusChecked}
                        />
                      </div>
                    </div>
                  )}
                {arrCheckedProductTypeImport.length !== 0 &&
                  appliedFilters.length !== 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "105px",
                        left: "16px",
                        zIndex: 11,
                        // zIndex: 100,
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
                        {arrCheckedProductTypeImport.length} selected
                      </button>
                      <button
                        type="button"
                        className="dropdown-toggle Polaris-Button Polaris-Button dropdown-button-custom"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        More action
                      </button>
                      <div
                        className="dropdown-menu"
                        style={{ minWidth: "33rem" }}
                      >
                        <ModalStepImport
                          styleButton="importInChecked"
                          setStatusChecked={setStatusChecked}
                        />
                      </div>
                    </div>
                  )}
                <div style={{ overflowX: "auto" }}>
                  <Table id="table">
                    <thead id="thead-table" className="thTable">
                      {arrCheckedProductTypeImport.length == 0 && (
                        <tr>
                          <th width="5%" style={{ paddingLeft: "17px" }}>
                            <input
                              type="checkbox"
                              onClick={handleCheckAll}
                              defaultChecked={statusCheckAll}
                              id="check_all"
                            ></input>
                          </th>
                          <th width="25%">Product Types</th>
                          <th width="20%">Rating</th>
                          <th width="20%">Reviews</th>

                          <th width="5%" style={{ textAlign: "center" }}>
                            Actions
                          </th>
                        </tr>
                      )}
                      {arrCheckedProductTypeImport.length !== 0 && (
                        <tr>
                          <th width="5%"></th>
                          <th width="25%"></th>
                          <th width="20%"></th>
                          <th width="20%"></th>
                          <th width="5%"></th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {loadingTable == false &&
                        datFilterProducts.map((data, index) => (
                          <tr key={index} name="rowChecked">
                            <td style={{ paddingLeft: "17px" }}>
                              <input
                                type="checkbox"
                                name="nameProducts[]"
                                value={data.id}
                                onClick={handleCheckOnly}
                              ></input>
                            </td>
                            <td>
                              <Link
                                to={
                                  config.pathName +
                                  "/filter/productType/" +
                                  data.id
                                }
                              >
                                {data.product_type}
                              </Link>
                            </td>
                            <td>
                              <ReactStars
                                style={{ display: "inline-block" }}
                                count={5}
                                size={24}
                                emptyIcon={<i className="far fa-star"></i>}
                                fullIcon={<i className="fa fa-star"></i>}
                                color2="#ffb50d"
                                value={parseInt(
                                  data["ratingReviews"] / data["countReviews"]
                                )}
                                edit={false}
                              />
                            </td>
                            <td>
                              <Link
                                to={
                                  config.pathName +
                                  "/filter/productType/" +
                                  data.id
                                }
                              >
                                {data["countReviews"]} reviews
                              </Link>
                              {/* <p style={{ display: "block", marginTop: "10px" }}>
                              {data["countReviews"]} reviews
                            </p> */}
                            </td>
                            <td style={{ display: "flex" }}>
                              <ModalCreateReview
                                styleButton="createInTable"
                                idProductType={data.id}
                                setStatusChecked={setStatusChecked}
                              />
                              <ModalStepImport
                                styleButton="importInTable"
                                idProductType={data.id}
                                setStatusChecked={setStatusChecked}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
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
                  datFilterProducts.length == 0 && loadingTable == false && (
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
                <Pagination
                  style={{ float: "right!important" }}
                  hasPrevious
                  onPrevious={() =>
                    handleChangeOffsetSearchPre(valueSearch, selected)
                  }
                  hasNext
                  onNext={() =>
                    handleChangeOffsetSearchNext(valueSearch, selected)
                  }
                />
              </div>
            }
            items={[datFilterProducts]}
            renderItem={(item) => {
              return <ResourceList.Item></ResourceList.Item>;
            }}
          />
          <MoreApp />
        </Card>
      </div>
      {
        loading == true && <Loading /> //loading
      }
      {/* <Loading /> */}
    </div>
  );
};
Collections.propTypes = {
  reviews: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  productTypes: state.productTypes,
});

export default connect(mapStateToProps, {
  reload,
  getSettings,
  syncCollections,
  loadDataTable,
  changeCheckedProductTypes,
  getProductType,
  getCountProductType,
})(Collections);
