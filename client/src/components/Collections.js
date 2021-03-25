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
  getCollections,
  changeCheckedCollection,
  getCountCollections,
} from "../actions/collections";
import ModalStepImport from "./modals/reviews-page/ModalStepImport";
import { ViewMinor } from "@shopify/polaris-icons";

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
  Button,
  ChoiceList,
  Icon,
} from "@shopify/polaris";
import { Dropdown } from "react-bootstrap";

const Collections = ({
  getCountCollections,
  getSettings,
  syncCollections,
  loadDataTable,
  reload,
  getCollections,
  changeCheckedCollection,
  collection: {
    loading,
    collections,
    loadingTable,
    arrCheckedCollectionImport,
    countCollections,
  },
}) => {
  const shop = config.shop;

  useEffect(() => {
    getCollections();
  }, [getCollections]);
  useEffect(() => {
    changeCheckedCollection([]);
    loadDataTable();
  }, []);
  useEffect(() => {
    getCountCollections();
  }, [getCountCollections]);
  // useEffect(() => {
  //   syncCollections();
  // }, [syncCollections]);
  useEffect(() => {
    getSettings();
  }, [getSettings]);

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
  const listAllProduct = collections ? collections : [];
  var datFilterProducts = [];

  const handleSelectChange = useCallback(
    (selected, valueSearch, offsetSearch) => {
      loadDataTable();
      changeCheckedCollection([]);
      setStatusCheckAll(false);
      if (selected.length > 0) {
        setSelected(selected[0]);
        getCollections(valueSearch, offsetSearch, selected[0]);
        getCountCollections(valueSearch, selected[0]);
      }
    },
    []
  );
  datFilterProducts = listAllProduct;
  //search input
  const [valueSearch, setSearch] = useState(""); //console.log(value)
  const [offsetSearch, setOffsetSearch] = useState(0);
  const handleChangeInputSearch = useCallback(
    async (newValue, offsetSearch, selected) => {
      loadDataTable();
      setSearch(newValue);
      getCollections(newValue, offsetSearch, selected);
      getCountCollections(newValue, selected);
      changeCheckedCollection([]);
      setStatusCheckAll(false);
    },
    []
  );
  const handleChangeOffsetSearchNext = (valueSearch, selected) => {
    if (offsetSearch + 1 < countCollections / 20) {
      setOffsetSearch(offsetSearch + 1);
      getCollections(valueSearch, offsetSearch + 1, selected);
      getCountCollections(valueSearch, selected);
      changeCheckedCollection([]);
      setStatusCheckAll(false);
    }
  };
  const handleChangeOffsetSearchPre = (valueSearch, selected) => {
    if (offsetSearch >= 1) {
      setOffsetSearch(offsetSearch - 1);
      getCollections(valueSearch, offsetSearch - 1, selected);
      getCountCollections(valueSearch, selected);
      changeCheckedCollection([]);
      setStatusCheckAll(false);
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
    changeCheckedCollection(arr);
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
    changeCheckedCollection(arr);
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

  const handleSelectReviewsRemove = useCallback((valueSearch, offsetSearch) => {
    loadDataTable();
    setSelected("allReview");
    getCollections(valueSearch, offsetSearch, "allReview");
    getCountCollections(valueSearch, "allReview");
    changeCheckedCollection([]);
    setStatusCheckAll(false);
  }, []);

  const handleQueryValueRemove = useCallback((selected, offsetSearch) => {
    loadDataTable();
    setSearch("");
    getCollections("", offsetSearch, selected);
    getCountCollections("", selected);
    changeCheckedCollection([]);
    setStatusCheckAll(false);
  }, []);
  const handleFiltersClearAll = useCallback(() => {
    loadDataTable();
    setSearch("");
    setSelected("allReview");
    getCollections();
    getCountCollections();
    changeCheckedCollection([]);
    setStatusCheckAll(false);
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
        //   onChange={(e) => handleSelectChange(e, valueSearch, offsetSearch)}
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
            <Title title="Collections" />
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
            resourceName={{ singular: "collections", plural: "collections" }}
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
                {arrCheckedCollectionImport.length !== 0 &&
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
                        {arrCheckedCollectionImport.length} selected
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
                {arrCheckedCollectionImport.length !== 0 &&
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
                        {arrCheckedCollectionImport.length} selected
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
                      {arrCheckedCollectionImport.length == 0 && (
                        <tr>
                          <th width="5%" style={{ paddingLeft: "17px" }}>
                            <input
                              type="checkbox"
                              onClick={handleCheckAll}
                              defaultChecked={statusCheckAll}
                              id="check_all"
                            ></input>
                          </th>
                          <th width="25%">Collection</th>
                          <th width="20%">Rating</th>
                          <th width="20%">Reviews</th>
                          <th width="5%" style={{ textAlign: "center" }}>
                            Actions
                          </th>
                        </tr>
                      )}
                      {arrCheckedCollectionImport.length !== 0 && (
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
                                value={data.collection_id}
                                onClick={handleCheckOnly}
                                id="check_all"
                              ></input>
                            </td>
                            <td>
                              <img
                                src={data.image}
                                alt="product"
                                className="imageProduct-reviewPage"
                              />
                              <Link
                                to={
                                  config.pathName +
                                  "/filter/collection/" +
                                  data.collection_id
                                }
                              >
                                {data.title}
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
                                  "/filter/collection/" +
                                  data.collection_id
                                }
                              >
                                {data["countReviews"]} reviews
                              </Link>
                              {/* <p
                              style={{ display: "block", marginTop: "10px" }}
                            ></p> */}
                            </td>
                            <td style={{ display: "flex" }}>
                              <ModalCreateReview
                                styleButton="createInTable"
                                idCollection={data.collection_id}
                                setStatusChecked={setStatusChecked}
                              />
                              <ModalStepImport
                                styleButton="importInTable"
                                idCollection={data.collection_id}
                                setStatusChecked={setStatusChecked}
                              />
                              <button
                                id="btn-outline"
                                className="Polaris-Button Polaris-Button--iconOnly"
                                onClick={() => {
                                  window.open(data.url);
                                }}
                                title="View on store"
                              >
                                <Icon source={ViewMinor} />
                              </button>
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
  collection: state.collections,
});

export default connect(mapStateToProps, {
  reload,
  getSettings,
  syncCollections,
  loadDataTable,
  getCollections,
  changeCheckedCollection,
  getCountCollections,
})(Collections);
