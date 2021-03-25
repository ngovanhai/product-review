import React, { useCallback, useState, useEffect } from "react";
import config from "../config/config";
import Title from "./service/Title";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from "jquery";
import jQuery from "jquery";
import {
  getCountAllReviews,
  getCountAllProducts,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  getProductsSearch,
  reload,
  ChangeCheckedProducts,
  getCountProductInShopify,
  syncCollections,
  getVendorProduct,
  loadDataTable,
  getProductTypeSelect,
  // getProductsInCollections,
} from "../actions/reviews";
import MoreApp from "./plugin/MoreApp";

import { ViewMinor } from "@shopify/polaris-icons";

import { getSettings } from "../actions/settings";
import { useHistory } from "react-router-dom";

import { BrowserRouter as Router, Link } from "react-router-dom";
import ModalCreateReview from "./modals/reviews-page/ModalCreateReview";
import ModalImport from "./modals/reviews-page/ModalImport";
import ReactStars from "react-stars";
import ModalExport from "./modals/reviews-page/ModalExport";
import ModalUnPublishChecked from "./modals/reviews-page/ModalUnPublishChecked";
import ModalPublishChecked from "./modals/reviews-page/ModalPublishChecked";
import ModalUnFlagChecked from "./modals/reviews-page/ModalUnFlagChecked";
import ModalFlagChecked from "./modals/reviews-page/ModalFlagChecked";
import ModalDeleteChecked from "./modals/reviews-page/ModalDeleteChecked";
import ModalStepImport from "./modals/reviews-page/ModalStepImport";

import Loading from "./contents/Spinner";
import Alert from "./contents/Alert";
import "../css/style.css";
import axios from "axios";

import { Table } from "reactstrap";
import {
  Select,
  Tabs,
  Card,
  Layout,
  TextField,
  Pagination,
  TextStyle,
  Button,
  ChoiceList,
  ResourceList,
  Filters,
  Spinner,
  ResourceItem,
  Avatar,
  Icon,
} from "@shopify/polaris";
import { Dropdown } from "react-bootstrap";

const Products = ({
  getSettings,
  getCountAllReviews,
  getCountAllProducts,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  getProductsSearch,
  ChangeCheckedProducts,
  getCountProductInShopify,
  syncCollections,
  getVendorProduct,
  loadDataTable,
  reload,
  getProductTypeSelect,
  reviews: {
    productsSearch,
    loading,
    countAllReviews,
    countAllProducts,
    countAllUnPublishReview,
    countAllPublishReview,
    productNoReview,
    arrCheckedProducts,
    countProductInShopify,
    collectionsSelect,
    loadingTable,
    reviewImport,
    productTypeSelect,
    vendor,
  },
}) => {
  const shop = config.shop;
  const [since_id, setSinceID] = useState(0);
  const [countProducts, setCountProducts] = useState(0);
  useEffect(() => {
    syncCollections();
  }, [syncCollections]);
  useEffect(() => {
    ChangeCheckedProducts([]);
    loadDataTable();
  }, []);
  useEffect(() => {
    getProductTypeSelect();
  }, [getProductTypeSelect]);
  useEffect(() => {
    getVendorProduct();
  }, [getVendorProduct]);
  useEffect(() => {
    getCountAllReviews();
  }, [getCountAllReviews]);
  useEffect(() => {
    getCountProductInShopify();
  }, [getCountProductInShopify]);
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  useEffect(() => {
    getCountAllProducts("");
  }, [getCountAllProducts, getCountAllReviews]);
  useEffect(() => {}, [productsSearch]);
  useEffect(() => {
    getUnPublishReviews();
  }, [getUnPublishReviews]);
  useEffect(() => {
    getPublishReviews(0);
  }, [getPublishReviews]);
  useEffect(() => {
    getCountProductNoReview(0);
  }, [getCountProductNoReview]);
  useEffect(() => {
    getProductsSearch("", 0);
  }, [getProductsSearch]);

  useEffect(() => {
    axios
      .get(config.rootLink + `/backend/server.php`, {
        params: {
          shop: shop,
          syncDataToDBStart: "",
          since_id: since_id,
        },
      })
      .then((res) => {
        setSinceID(res.data.since_id);
        setCountProducts(countProducts + res.data.countProducts);
      });
    setTimeout(() => {
      getProductsSearch("", 0);
    }, 2000);
  }, [getProductsSearch]);
  useEffect(() => {
    if (countProducts < countProductInShopify) {
      axios
        .get(config.rootLink + `/backend/server.php`, {
          params: {
            shop: shop,
            syncDataToDB: "",
            since_id: since_id,
          },
        })
        .then((res) => {
          setSinceID(res.data.since_id);
          setCountProducts(countProducts + res.data.countProducts);
        });
    }
  }, [since_id]);

  const [selected, setSelected] = useState(0);
  const listAllProduct = productsSearch ? productsSearch : [];
  var datFilterProducts = [];

  const handleSelectChange = useCallback(
    (selected, valueSearch, vendor, tags, idCollection, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setSelected(selected);
      getCountAllProducts(
        valueSearch,
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
      setTimeout(() => {
        getProductsSearch(
          valueSearch,
          0,
          selected,
          vendor,
          tags,
          idCollection,
          productType
        );
      }, 500);
    },
    []
  );
  datFilterProducts = listAllProduct;
  //search input
  const [valueSearch, setSearch] = useState(""); //console.log(value)
  const [offsetSearch, setOffsetSearch] = useState(0);
  const handleChangeInputSearch = useCallback(
    async (newValue, selected, vendor, tags, idCollection, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setSearch(newValue);
      setOffsetSearch(0);
      getProductsSearch(
        newValue,
        0,
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
      getCountAllProducts(
        newValue,
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
    },
    []
  );
  const handleChangeOffsetSearchNext = (
    valueSearch,
    selected,
    vendor,
    tags,
    idCollection,
    productType
  ) => {
    if (offsetSearch + 1 < countAllProducts / 20) {
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setOffsetSearch(offsetSearch + 1);
      getProductsSearch(
        valueSearch,
        offsetSearch + 1,
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
    }
  };
  const handleChangeOffsetSearchPre = (
    valueSearch,
    selected,
    vendor,
    tags,
    idCollection,
    productType
  ) => {
    if (offsetSearch >= 1) {
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setOffsetSearch(offsetSearch - 1);
      getProductsSearch(
        valueSearch,
        offsetSearch - 1,
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
    }
  };
  //sticky
  // function sticky_menu(menu, sticky) {
  //   if (typeof sticky === "undefined" || !jQuery.isNumeric(sticky)) sticky = 0;
  //   if ($(window).scrollTop() >= sticky) {
  //     // if ($("#just-for-height").length === 0) {
  //     //   menu.after(
  //     //     '<div id="just-for-height" style="height:' +
  //     //       menu.height() +
  //     //       'px"></div>'d
  //     //   );
  //     // }
  //     menu.addClass("sticky");
  //   } else {
  //     menu.removeClass("sticky");
  //     // $("#just-for-height").remove();
  //   }
  // }

  // var menu = $("#thead-table");
  // if (menu.length) {
  //   var sticky = menu.offset().top + 1;
  //   if ($(window).width() > 767) {
  //     sticky_menu(menu, sticky);
  //     $(window).on("scroll", function () {
  //       sticky_menu(menu, sticky);
  //     });
  //   }
  // }
  const [statusCheckAll, setStatusCheckAll] = useState(false);
  const handleCheckAll = useCallback(async () => {
    await setStatusCheckAll(!statusCheckAll);
    //check_all
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
    ChangeCheckedProducts(arr);
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
    setStatusCheckAll(false);
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
    ChangeCheckedProducts(arr);

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
  const tabs = [
    {
      id: "allReview",
      content: "All Products",
    },
    {
      id: "addedReview",
      content: "Added Reviews",
    },
    {
      id: "noReview",
      content: "No Reviews",
    },
  ];
  const history = useHistory();
  function disambiguateLabel(key, value) {
    switch (key) {
      case "collections":
        return `Product in "${value}" collections`;
      case "productType":
        return `Product type with "${value}"`;
      case "selectReviews":
        const render = value === "noReview" ? "No reviews" : "Added review";
        return `Filter products by "${render}"`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "vendor":
        return value.map((val) => `Product vendor is ${val}`).join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "";
    }
  }
  const [vendorStatus, setVendor] = useState("");
  const [collectionsStatus, setCollectionsStatus] = useState("");
  const [typeStatus, setTypeStatus] = useState("");
  const [taggedWith, setTaggedWith] = useState("");

  const handleVendorStatusChange = useCallback(
    (vendor, valueSearch, selected, tags, idCollection, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setVendor(vendor);
      setTimeout(() => {
        getProductsSearch(
          valueSearch,
          0,
          selected,
          vendor,
          tags,
          idCollection,
          productType
        );
        getCountAllProducts(
          valueSearch,
          selected,
          vendor,
          tags,
          idCollection,
          productType
        );
      }, 500);
    },
    []
  );
  const handleCollectionsStatusChange = useCallback(
    (idCollection, valueSearch, selected, vendor, tags, productType) => {
      setCollectionsStatus(idCollection);
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setTimeout(() => {
        getProductsSearch(
          valueSearch,
          0,
          selected,
          vendor,
          tags,
          idCollection,
          productType
        );
        getCountAllProducts(
          valueSearch,
          selected,
          vendor,
          tags,
          idCollection,
          productType
        );
      }, 500);
    },
    []
  );
  const handleTypeStatusChange = useCallback(
    (productType, valueSearch, selected, vendor, tags, idCollection) => {
      setTypeStatus(productType);
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setTimeout(() => {
        getProductsSearch(
          valueSearch,
          0,
          selected,
          vendor,
          tags,
          idCollection,
          productType
        );
        getCountAllProducts(
          valueSearch,
          selected,
          vendor,
          tags,
          idCollection,
          productType
        );
      }, 500);
    },
    []
  );
  const handleTaggedWithChange = useCallback(
    (tags, valueSearch, selected, vendor, idCollection, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setTaggedWith(tags);
      getProductsSearch(
        valueSearch,
        0,
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
      getCountAllProducts(
        valueSearch,
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
    },
    []
  );

  const handleVendorStatusRemove = useCallback(
    (valueSearch, selected, tags, idCollection, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      getProductsSearch(
        valueSearch,
        0,
        selected,
        "",
        tags,
        idCollection,
        productType
      );
      getCountAllProducts(
        valueSearch,
        selected,
        "",
        tags,
        idCollection,
        productType
      );
      setVendor("");
    },
    []
  );
  const handleCollectionsStatusRemove = useCallback(
    (valueSearch, selected, vendor, tags, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      getProductsSearch(
        valueSearch,
        0,
        selected,
        vendor,
        tags,
        "",
        productType
      );
      getCountAllProducts(valueSearch, selected, vendor, tags, "", productType);
      setCollectionsStatus("");
    },
    []
  );
  const handleTypeStatusRemove = useCallback(
    (valueSearch, selected, vendor, tags, idCollection) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      getProductsSearch(valueSearch, 0, selected, vendor, tags, idCollection);
      getCountAllProducts(valueSearch, selected, vendor, tags, idCollection);
      setTypeStatus("");
    },
    []
  );
  const handleSelectReviewsRemove = useCallback(
    (valueSearch, vendor, tags, idCollection, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setSelected(0);
      getProductsSearch(
        valueSearch,
        0,
        0,
        vendor,
        tags,
        idCollection,
        productType
      );
      getCountAllProducts(
        valueSearch,
        0,
        vendor,
        tags,
        idCollection,
        productType
      );
    },
    []
  );
  const handleTaggedWithRemove = useCallback(
    (valueSearch, selected, vendor, idCollection, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      getProductsSearch(
        valueSearch,
        0,
        selected,
        vendor,
        "",
        idCollection,
        productType
      );
      getCountAllProducts(
        valueSearch,
        selected,
        vendor,
        "",
        idCollection,
        productType
      );
      setTaggedWith("");
    },
    []
  );
  const handleQueryValueRemove = useCallback(
    (selected, vendor, tags, idCollection, productType) => {
      loadDataTable();
      ChangeCheckedProducts([]);
      setStatusCheckAll(false);
      setSearch("");
      getProductsSearch(
        "",
        0,
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
      getCountAllProducts(
        "",
        selected,
        vendor,
        tags,
        idCollection,
        productType
      );
    },
    []
  );
  const handleFiltersClearAll = useCallback(() => {
    loadDataTable();
    getProductsSearch("", 0);
    getCountAllProducts("", "allReview");
    setTaggedWith("");
    setVendor("");
    setCollectionsStatus("");
    setSelected("allReview");
    setSearch("");
    setTypeStatus("");
    ChangeCheckedProducts([]);
    setStatusCheckAll(false);
  }, []);
  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={(e) => {
            handleTaggedWithChange(
              e,
              valueSearch,
              selected,
              vendorStatus,
              collectionsStatus,
              typeStatus
            );
          }}
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: "vendor",
      label: "Product vendor",
      filter: (
        <ChoiceList
          titleHidden
          choices={vendor}
          selected={vendorStatus || []}
          onChange={(e) => {
            handleVendorStatusChange(
              e,
              valueSearch,
              selected,
              taggedWith,
              collectionsStatus,
              typeStatus
            );
          }}
        />
      ),
      shortcut: true,
    },
    {
      key: "productType",
      label: "Product Type",
      filter: (
        <ChoiceList
          titleHidden
          choices={productTypeSelect}
          selected={typeStatus || []}
          onChange={(e) => {
            handleTypeStatusChange(
              e,
              valueSearch,
              selected,
              vendorStatus,
              taggedWith,
              collectionsStatus
            );
          }}
        />
      ),
      // shortcut: true,
    },
    {
      key: "collections",
      label: "Product Collections",
      filter: (
        <ChoiceList
          titleHidden
          choices={collectionsSelect}
          selected={collectionsStatus || []}
          onChange={(e) => {
            handleCollectionsStatusChange(
              e,
              valueSearch,
              selected,
              vendorStatus,
              taggedWith,
              typeStatus
            );
          }}
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [];
  if (!isEmpty(vendorStatus)) {
    const key = "vendor";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, vendorStatus),
      onRemove: () =>
        handleVendorStatusRemove(
          valueSearch,
          selected,
          taggedWith,
          collectionsStatus,
          typeStatus
        ),
    });
  }
  if (!isEmpty(typeStatus)) {
    const key = "productType";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, typeStatus),
      onRemove: () =>
        handleTypeStatusRemove(
          valueSearch,
          selected,
          vendorStatus,
          taggedWith,
          collectionsStatus
        ),
    });
  }
  if (!isEmpty(collectionsStatus)) {
    const key = "collections";
    const title = collectionsSelect.filter(
      (e) => e.value === collectionsStatus[0]
    );
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, title[0].label),
      onRemove: () =>
        handleCollectionsStatusRemove(
          valueSearch,
          selected,
          vendorStatus,
          taggedWith,
          typeStatus
        ),
    });
  }
  if (!isEmpty(selected) && selected !== 0) {
    const key = "selectReviews";
    let title = "allReview";
    switch (selected) {
      case 0:
        {
          title = "allReview";
        }
        break;
      case 1:
        {
          title = "addedReview";
        }
        break;
      case 2:
        {
          title = "noReview";
        }
        break;
    }
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, title),
      onRemove: () =>
        handleSelectReviewsRemove(
          valueSearch,
          vendorStatus,
          taggedWith,
          collectionsStatus,
          typeStatus
        ),
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: () =>
        handleTaggedWithRemove(
          valueSearch,
          selected,
          vendorStatus,
          collectionsStatus,
          typeStatus
        ),
    });
  }
  const [selectedItems, setSelectedItems] = useState([]);
  return (
    <div>
      <div style={{ margin: "10px 0 10px" }}>
        <Layout>
          <Layout.Section oneThird>
            <Title title="Products" />
          </Layout.Section>
          <Layout.Section oneThird>
            <ModalCreateReview
              id="btn-outline"
              floatStyle="right"
              offset={offsetSearch}
            />
            <ModalImport id="btn-outline" offset={offsetSearch} />
            {/* <ModalExport id="btn-outline" /> */}
            <ModalStepImport
              floatStyle="right"
              styleForm="products"
              setStatusChecked={setStatusChecked}
            />
          </Layout.Section>
        </Layout>
      </div>
      <Alert />
      <div style={{ height: "568px" }}>
        <Card>
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={(e) =>
              handleSelectChange(
                e,
                valueSearch,
                vendorStatus,
                taggedWith,
                collectionsStatus,
                typeStatus
              )
            }
          >
            <ResourceList
              resourceName={{ singular: "products", plural: "products" }}
              filterControl={
                <div>
                  <Filters
                    queryValue={valueSearch}
                    filters={filters}
                    appliedFilters={appliedFilters}
                    onQueryChange={(e) =>
                      handleChangeInputSearch(
                        e,
                        selected,
                        vendorStatus,
                        taggedWith,
                        collectionsStatus,
                        typeStatus
                      )
                    }
                    onQueryClear={() =>
                      handleQueryValueRemove(
                        selected,
                        vendorStatus,
                        taggedWith,
                        collectionsStatus,
                        typeStatus
                      )
                    }
                    onClearAll={handleFiltersClearAll}
                  />
                  {arrCheckedProducts.length !== 0 &&
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
                            id="check_all"
                            defaultChecked={statusCheckAll}
                          ></input>
                          {arrCheckedProducts.length} selected
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
                            styleForm="products"
                            styleButton="importInChecked"
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalUnPublishChecked
                            arrIdProducts={arrCheckedProducts}
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalPublishChecked
                            arrIdProducts={arrCheckedProducts}
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalUnFlagChecked
                            arrIdProducts={arrCheckedProducts}
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalFlagChecked
                            arrIdProducts={arrCheckedProducts}
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalDeleteChecked
                            arrIdProducts={arrCheckedProducts}
                            offset={offsetSearch}
                            selected={selected}
                            valueSearch={valueSearch}
                            idCollection={collectionsStatus}
                            vendor={vendorStatus}
                            tags={taggedWith}
                            type={typeStatus}
                            setStatusChecked={setStatusChecked}
                          />
                        </div>
                      </div>
                    )}
                  {arrCheckedProducts.length !== 0 &&
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
                            id="check_all"
                            defaultChecked={statusCheckAll}
                          ></input>
                          {arrCheckedProducts.length} selected
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
                            styleForm="products"
                            styleButton="importInChecked"
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalUnPublishChecked
                            arrIdProducts={arrCheckedProducts}
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalPublishChecked
                            arrIdProducts={arrCheckedProducts}
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalUnFlagChecked
                            arrIdProducts={arrCheckedProducts}
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalFlagChecked
                            arrIdProducts={arrCheckedProducts}
                            setStatusChecked={setStatusChecked}
                          />
                          <ModalDeleteChecked
                            arrIdProducts={arrCheckedProducts}
                            offset={offsetSearch}
                            selected={selected}
                            valueSearch={valueSearch}
                            idCollection={collectionsStatus}
                            vendor={vendorStatus}
                            tags={taggedWith}
                            type={typeStatus}
                            setStatusChecked={setStatusChecked}
                          />
                        </div>
                      </div>
                    )}
                  <div style={{ overflowX: "auto" }}>
                    <Table id="table">
                      <thead id="thead-table" className="thTable">
                        {arrCheckedProducts.length == 0 && (
                          <tr>
                            <th width="5%" style={{ paddingLeft: "17px" }}>
                              <input
                                type="checkbox"
                                onClick={handleCheckAll}
                                defaultChecked={statusCheckAll}
                                id="check_all"
                              ></input>
                            </th>
                            <th width="25%">Product</th>
                            <th width="20%">Rating</th>
                            <th width="20%">Reviews</th>
                            {/* <th style={{ textAlign: "center" }} width="10%">
                            View on store
                          </th> */}
                            <th width="15%" style={{ textAlign: "center" }}>
                              Actions
                            </th>
                          </tr>
                        )}
                        {arrCheckedProducts.length !== 0 && (
                          <tr>
                            <th width="5%"></th>
                            <th width="25%"></th>
                            <th width="20%"></th>
                            <th width="20%"></th>
                            {/* <th width="10%"></th> */}
                            <th width="15%"></th>
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
                                  value={data.products_id}
                                  onClick={handleCheckOnly}
                                ></input>
                              </td>
                              <td>
                                <img
                                  src={data.products_image_url}
                                  alt="product"
                                  className="imageProduct-reviewPage"
                                />
                                <Link
                                  to={
                                    config.pathName +
                                    "/detail-product/" +
                                    data.products_id
                                  }
                                >
                                  {data["products_title"]}
                                </Link>
                              </td>

                              {data["countReviews"] == "0" ? (
                                <td
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    history.push(
                                      config.pathName +
                                        "/detail-product/" +
                                        data.products_id
                                    )
                                  }
                                  title={
                                    "Average 0/" +
                                    data["countReviews"] +
                                    " reviews"
                                  }
                                >
                                  <ReactStars
                                    style={{
                                      display: "inline-block",
                                      cursor: "pointer",
                                    }}
                                    count={5}
                                    size={24}
                                    emptyIcon={<i className="far fa-star"></i>}
                                    fullIcon={<i className="fa fa-star"></i>}
                                    color2="#ffb50d"
                                    value={parseInt(
                                      data["ratingReviews"] /
                                        data["countReviews"]
                                    )}
                                    edit={false}
                                  />
                                </td>
                              ) : (
                                <td
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    history.push(
                                      config.pathName +
                                        "/detail-product/" +
                                        data.products_id
                                    )
                                  }
                                  title={
                                    "Average " +
                                    (
                                      parseInt(data["ratingReviews"]) /
                                      parseInt(data["countReviews"])
                                    ).toFixed(2) +
                                    "/" +
                                    data["countReviews"] +
                                    " reviews"
                                  }
                                >
                                  <ReactStars
                                    style={{
                                      display: "inline-block",
                                      cursor: "pointer",
                                    }}
                                    count={5}
                                    size={24}
                                    emptyIcon={<i className="far fa-star"></i>}
                                    fullIcon={<i className="fa fa-star"></i>}
                                    color2="#ffb50d"
                                    value={parseInt(
                                      data["ratingReviews"] /
                                        data["countReviews"]
                                    )}
                                    edit={false}
                                  />
                                </td>
                              )}

                              <td>
                                <Link
                                  to={
                                    config.pathName +
                                    "/filter/product/" +
                                    data.products_id
                                  }
                                >
                                  {data["countReviews"]} reviews
                                </Link>
                                {/* <p
                                style={{ display: "block", marginTop: "10px" }}
                              >
                                {data["countReviews"]} reviews
                              </p> */}
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <ModalCreateReview
                                    styleButton="createInTable"
                                    idProduct={data.products_id}
                                  />
                                  <ModalStepImport
                                    styleForm="products"
                                    styleButton="importInTable"
                                    idProduct={data.products_id}
                                    setStatusChecked={setStatusChecked}
                                  />
                                  <button
                                    id="btn-outline"
                                    className="Polaris-Button Polaris-Button--iconOnly"
                                    onClick={() => {
                                      window.open(data.productUrl);
                                    }}
                                    title="View on store"
                                  >
                                    <Icon source={ViewMinor} />
                                  </button>
                                </div>
                              </td>
                              {/* <td>
                            {data["tags"]} */}

                              {/* </td> */}
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
                        <TextStyle variation="subdued">
                          Not found data!
                        </TextStyle>
                      </div>
                    ) //có dữ liệu nhưng trống
                  }
                  <Pagination
                    style={{ float: "right!important" }}
                    hasPrevious
                    onPrevious={() =>
                      handleChangeOffsetSearchPre(
                        valueSearch,
                        selected,
                        vendorStatus,
                        taggedWith,
                        collectionsStatus,
                        typeStatus
                      )
                    }
                    hasNext
                    onNext={() =>
                      handleChangeOffsetSearchNext(
                        valueSearch,
                        selected,
                        vendorStatus,
                        taggedWith,
                        collectionsStatus,
                        typeStatus
                      )
                    }
                  />
                </div>
              }
              items={[datFilterProducts]}
              renderItem={(item) => {
                return <ResourceList.Item></ResourceList.Item>;
              }}
            />
          </Tabs>
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
Products.propTypes = {
  reviews: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reviews: state.reviews,
});

export default connect(mapStateToProps, {
  getCountAllReviews,
  getCountAllProducts,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  getProductsSearch,
  reload,
  getSettings,
  ChangeCheckedProducts,
  getCountProductInShopify,
  syncCollections,
  getVendorProduct,
  loadDataTable,
  getProductTypeSelect,
})(Products);
