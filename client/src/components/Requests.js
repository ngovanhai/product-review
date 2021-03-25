import React, { useCallback, useState, useEffect } from "react";
import config from "../config/config";
import Title from "./service/Title";
import $ from "jquery";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  reload,
  ChangeCheckedReviews,
  syncCollections,
  getVendorProduct,
  getProductTypeSelect,
  getProductsSearch,
  getCountProductInShopify,
  getAllProductDB,
} from "../actions/reviews";
import {
  searchRequest,
  getImageReview,
  loadDataTable,
  getCountAllRequest,
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  getConnectProductReviews,
} from "../actions/listReviews";
import { getSettings } from "../actions/settings";
import { useHistory } from "react-router-dom";
import ModalDeleteReview from "./modals/listReviews-page/ModalDeleteReview";
import ModalStepImport from "./modals/reviews-page/ModalStepImport";
import MoreApp from "./plugin/MoreApp";

import { BrowserRouter as Router, Link } from "react-router-dom";
import ModalCreateReview from "./modals/reviews-page/ModalCreateReview";
import ModalImport from "./modals/reviews-page/ModalImport";
import ReactStars from "react-stars";
import ModalExport from "./modals/reviews-page/ModalExport";
import ModalUnPublishChecked from "./modals/listReviews-page/ModalUnPublishChecked";
import ModalPublishChecked from "./modals/listReviews-page/ModalPublishChecked";
import ModalAssignChecked from "./modals/listReviews-page/ModalAssignChecked";
import ModalUnFlagChecked from "./modals/listReviews-page/ModalUnFlagChecked";
import ModalFlagChecked from "./modals/listReviews-page/ModalFlagChecked";
import ModalDeleteChecked from "./modals/listReviews-page/ModalDeleteChecked";
import Loading from "./contents/Spinner";
import Alert from "./contents/Alert";
import "../css/style.css";
import axios from "axios";
import {
  CollectionsMajor,
  ProductsMajor,
  FeaturedCollectionMajor,
} from "@shopify/polaris-icons";
import { Table } from "reactstrap";
import {
  Card,
  Layout,
  TextField,
  Pagination,
  TextStyle,
  Tabs,
  ChoiceList,
  ResourceList,
  Filters,
  Spinner,
  Badge,
  Icon,
  Select,
} from "@shopify/polaris";

const Reviews = ({
  getAllProductDB,
  match,
  getConnectProductReviews,
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  getSettings,
  getCountAllRequest,
  ChangeCheckedReviews,
  syncCollections,
  getVendorProduct,
  getProductsSearch,
  loadDataTable,
  reload,
  getProductTypeSelect,
  getCountProductInShopify,
  //them
  searchRequest,
  getImageReview,
  reviews: {
    arrCheckedReview,
    collectionsSelect,
    productTypeSelect,
    vendor,
    countProductInShopify,
    productsInDB,
  },

  listReviews: {
    countAllReviews,
    reviewsSearch,
    imageReviews,
    loading,
    loadingTable,
    connectCollectionReviews,
    connectProductTypeReviews,
    connectProductReviews,
  },
  productTypes: { productTypes },
}) => {
  // console.log(config.shop);
  const shop = config.shop;
  const [vendorStatus, setVendor] = useState("");
  const [collectionsStatus, setCollectionsStatus] = useState("");
  const [typeStatus, setTypeStatus] = useState("");
  const [filterProductStatus, setFilterProductStatus] = useState("");
  const [since_id, setSinceID] = useState(0);
  const [countProducts, setCountProducts] = useState(0);
  useEffect(() => {
    ChangeCheckedReviews([]);
    loadDataTable();
    getAllProductDB();
  }, []);
  useEffect(() => {
    getConnectCollectionReviews();
  }, [getConnectCollectionReviews]);
  useEffect(() => {
    getConnectProductReviews();
  }, [getConnectProductReviews]);

  useEffect(() => {
    searchRequest("", 0);
  }, [searchRequest]);
  useEffect(() => {
    getConnectProductTypeReviews();
  }, [getConnectProductTypeReviews]);
  useEffect(() => {
    getCountProductInShopify();
  }, [getCountProductInShopify]);
  useEffect(() => {
    getImageReview();
  }, [getImageReview]);
  useEffect(() => {
    getProductTypeSelect();
  }, [getProductTypeSelect]);
  useEffect(() => {
    getVendorProduct();
  }, [getVendorProduct]);
  useEffect(() => {
    syncCollections();
  }, [syncCollections]);
  useEffect(() => {
    getCountAllRequest("");
  }, [getCountAllRequest]);
  useEffect(() => {
    getSettings();
  }, [getSettings]);
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
  const listAllReviews = reviewsSearch ? reviewsSearch : [];
  var dataFilterReviews = [];
  dataFilterReviews = listAllReviews;
  //search input
  const [valueSearch, setSearch] = useState(""); //console.log(value)
  const [offsetSearch, setOffsetSearch] = useState(0);
  const handleChangeInputSearch = useCallback(
    async (
      newValue,
      selected,
      productType,
      vendor,
      idCollection,
      idProduct,
      sort,
      selectedPagination
    ) => {
      loadDataTable();
      clearSort();
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setSearch(newValue);
      setOffsetSearch(0);
      searchRequest(
        newValue,
        0,
        selected,
        productType,
        vendor,
        idCollection,
        idProduct,
        sort,
        selectedPagination
      );
      getCountAllRequest(
        newValue,
        selected,
        productType,
        vendor,
        idCollection,
        idProduct
      );
    },
    []
  );
  const handleChangeOffsetSearchNext = (
    valueSearch,
    selected,
    productType,
    vendor,
    idCollection,
    idProduct,
    selectedPagination
  ) => {
    if (offsetSearch + 1 < countAllReviews / parseInt(selectedPagination)) {
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setOffsetSearch(offsetSearch + 1);
      loadDataTable();
      let sort = "id";
      if ($("#thRating").hasClass("headerSortDown")) {
        sort = "reviewer_rating";
      }
      if ($("#thName").hasClass("headerSortDown")) {
        sort = "reviewer_name";
      }
      if ($("#thFeedBack").hasClass("headerSortDown")) {
        sort = "reviewer_title";
      }
      if ($("#thSource").hasClass("headerSortDown")) {
        sort = "import_source";
      }
      searchRequest(
        valueSearch,
        offsetSearch + 1,
        selected,
        productType,
        vendor,
        idCollection,
        idProduct,
        sort,
        selectedPagination
      );
    }
  };
  const handleChangeOffsetSearchPre = (
    valueSearch,
    selected,
    productType,
    vendor,
    idCollection,
    idProduct,
    selectedPagination
  ) => {
    if (offsetSearch >= 1) {
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setOffsetSearch(offsetSearch - 1);
      loadDataTable();
      let sort = "id";
      if ($("#thRating").hasClass("headerSortDown")) {
        sort = "reviewer_rating";
      }
      if ($("#thName").hasClass("headerSortDown")) {
        sort = "reviewer_name";
      }
      if ($("#thFeedBack").hasClass("headerSortDown")) {
        sort = "reviewer_title";
      }
      if ($("#thSource").hasClass("headerSortDown")) {
        sort = "import_source";
      }
      searchRequest(
        valueSearch,
        offsetSearch - 1,
        selected,
        productType,
        vendor,
        idCollection,
        idProduct,
        sort,
        selectedPagination
      );
    }
  };
  const [statusCheckAll, setStatusCheckAll] = useState(false);
  const handleCheckAll = useCallback(async () => {
    await setStatusCheckAll(!statusCheckAll);
    var checkboxes = document.getElementsByName("nameReview[]");
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
    var checkboxes = document.getElementsByName("nameReview[]");
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
  const history = useHistory();
  function disambiguateLabel(key, value) {
    switch (key) {
      case "collections":
        return `Reviews in "${value}" collections`;
      case "productFilter":
        return `Filter review by "${value}" product`;
      case "selectReviews":
        return `Filter reviews by "${value}"`;

      case "selected":
        return `Reviews in ${value}`;
      case "stars":
        return value.map((val) => `Filter review by ${val} stars`).join(", ");
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

  const handleVendorStatusChange = useCallback(
    (
      vendor,
      valueSearch,
      selected,
      productType,
      idCollection,
      sort,
      selectedPagination
    ) => {
      loadDataTable();
      clearSort();
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setVendor(vendor);
      setFilterProductStatus("");
      setTimeout(() => {
        searchRequest(
          valueSearch,
          0,
          selected,
          productType,
          vendor,
          idCollection,
          "",
          sort,
          selectedPagination
        );
        getCountAllRequest(
          valueSearch,
          selected,
          productType,
          vendor,
          idCollection
        );
      }, 500);
    },
    []
  );
  const handleCollectionsStatusChange = useCallback(
    (
      idCollection,
      valueSearch,
      selected,
      productType,
      vendor,
      sort,
      selectedPagination
    ) => {
      setCollectionsStatus(idCollection);
      loadDataTable();
      clearSort();
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setFilterProductStatus("");
      setTimeout(() => {
        searchRequest(
          valueSearch,
          0,
          selected,
          productType,
          vendor,
          idCollection,
          "",
          sort,
          selectedPagination
        );
        getCountAllRequest(
          valueSearch,
          selected,
          productType,
          vendor,
          idCollection
        );
      }, 500);
    },
    []
  );

  const handleTypeStatusChange = useCallback(
    (
      productType,
      valueSearch,
      selected,
      vendor,
      idCollection,
      sort,
      selectedPagination
    ) => {
      setTypeStatus(productType);
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setFilterProductStatus("");
      loadDataTable();
      clearSort();
      setTimeout(() => {
        searchRequest(
          valueSearch,
          0,
          selected,
          productType,
          vendor,
          idCollection,
          "",
          sort,
          selectedPagination
        );
        getCountAllRequest(
          valueSearch,
          selected,
          productType,
          vendor,
          idCollection
        );
      }, 500);
    },
    []
  );

  const handleVendorStatusRemove = useCallback(
    (
      valueSearch,
      selected,
      productType,
      idCollection,
      sort,
      selectedPagination
    ) => {
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      loadDataTable();
      clearSort();
      searchRequest(
        valueSearch,
        0,
        selected,
        productType,
        "",
        idCollection,
        "",
        sort,
        selectedPagination
      );
      getCountAllRequest(valueSearch, selected, productType, "", idCollection);
      setVendor([]);
    },
    []
  );
  const handleFilterProductStatusRemove = useCallback((valueSearch) => {
    setStatusCheckAll(false);
    ChangeCheckedReviews([]);
    loadDataTable();
    clearSort();
    searchRequest(valueSearch, 0);
    getCountAllRequest(valueSearch);
    setFilterProductStatus("");
  }, []);
  const handleCollectionsStatusRemove = useCallback(
    (valueSearch, selected, productType, vendor, sort, selectedPagination) => {
      loadDataTable();
      clearSort();
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      searchRequest(
        valueSearch,
        0,
        selected,
        productType,
        vendor,
        "",
        "",
        sort,
        selectedPagination
      );
      getCountAllRequest(valueSearch, selected, productType, vendor, "");
      setCollectionsStatus("");
    },
    []
  );
  const handleTypeStatusRemove = useCallback(
    (valueSearch, selected, vendor, idCollection, sort, selectedPagination) => {
      loadDataTable();
      clearSort();
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      searchRequest(
        valueSearch,
        0,
        selected,
        "",
        vendor,
        idCollection,
        "",
        sort,
        selectedPagination
      );
      getCountAllRequest(valueSearch, selected, "", vendor, idCollection);
      setTypeStatus("");
    },
    []
  );
  // const handleTaggedWithRemove = useCallback(
  //   (valueSearch, selected, productType, vendor, idCollection) => {
  //     loadDataTable();
  //     clearSort();
  //     setStatusCheckAll(false);
  //     ChangeCheckedReviews([]);
  //     searchRequest(
  //       valueSearch,
  //       0,
  //       selected,
  //       productType,
  //       vendor,
  //       "",
  //       idCollection
  //     );
  //     getCountAllRequest(
  //       valueSearch,
  //       selected,
  //       productType,
  //       vendor,
  //       "",
  //       idCollection
  //     );
  //   },
  //   []
  // );
  const handleQueryValueRemove = useCallback(
    (
      selected,
      productType,
      vendor,
      idCollection,
      idProduct,
      sort,
      selectedPagination
    ) => {
      loadDataTable();
      clearSort();
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setSearch("");
      searchRequest(
        "",
        0,
        selected,
        productType,
        vendor,
        idCollection,
        idProduct,
        sort,
        selectedPagination
      );
      getCountAllRequest(
        "",
        selected,
        productType,
        vendor,
        idCollection,
        idProduct
      );
    },
    []
  );
  const handleSelectedStatusRemove = useCallback(
    (
      valueSearch,
      productType,
      vendor,
      idCollection,
      sort,
      selectedPagination
    ) => {
      loadDataTable();
      clearSort();
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setSelected(0);
      searchRequest(
        valueSearch,
        0,
        0,
        productType,
        vendor,
        idCollection,
        "",
        sort,
        selectedPagination
      );
      getCountAllRequest(valueSearch, 0, productType, vendor, idCollection);
    },
    []
  );
  const handleFiltersClearAll = useCallback(() => {
    loadDataTable();
    clearSort();
    searchRequest("", 0);
    getCountAllRequest("");
    setFilterProductStatus("");
    setVendor([]);
    setCollectionsStatus("");
    setSearch("");
    setTypeStatus("");
    setSelected(0);
    setStatusCheckAll(false);
    ChangeCheckedReviews([]);
  }, []);
  const [selected, setSelected] = useState(0);
  // console.log(countAllReviews);
  const handleTabChange = useCallback(
    (
      selectedTabIndex,
      valueSearch,
      vendor,
      idCollection,
      type,
      sort,
      selectedPagination
    ) => {
      loadDataTable();
      clearSort();
      setStatusCheckAll(false);
      ChangeCheckedReviews([]);
      setFilterProductStatus("");
      setSelected(selectedTabIndex);
      searchRequest(
        valueSearch,
        0,
        selectedTabIndex,
        type,
        vendor,
        idCollection,
        "",
        sort,
        selectedPagination
      );
      getCountAllRequest(
        valueSearch,
        selectedTabIndex,
        type,
        vendor,
        idCollection
      );
    },
    []
  );

  const tabs = [
    {
      id: 0,
      content: "All",
    },
    {
      id: 1,
      content: "Have Images",
    },
    // {
    //   id: 2,
    //   content: "Publish",
    // },
    // {
    //   id: 3,
    //   content: "Featured ",
    // },
  ];
  const optionsStars = [
    { label: "All stars", value: "" },
    { label: "1 star", value: "1" },
    { label: "2 stars", value: "2" },
    { label: "3 stars", value: "3" },
    { label: "4 stars", value: "4" },
    { label: "5 stars", value: "5" },
  ];
  const filters = [
    {
      key: "stars",
      label: "Stars",
      filter: (
        <ChoiceList
          titleHidden
          choices={optionsStars}
          selected={vendorStatus || []}
          onChange={(e) => {
            handleVendorStatusChange(
              e,
              valueSearch,
              selected,
              typeStatus,
              collectionsStatus,
              sort,
              selectedPagination
            );
          }}
        />
      ),
      shortcut: true,
    },
    {
      key: "collections",
      label: "Collections",
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
              typeStatus,
              vendorStatus,
              sort,
              selectedPagination
            );
          }}
        />
      ),
      shortcut: true,
    },
    {
      key: "selectReviews",
      label: "Product Types",
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
              collectionsStatus,
              sort,
              selectedPagination
            );
          }}
        />
      ),
    },
  ];
  const appliedFilters = [];
  if (!isEmpty(vendorStatus) && vendorStatus[0] !== "") {
    const key = "stars";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, vendorStatus),
      onRemove: () =>
        handleVendorStatusRemove(
          valueSearch,
          selected,
          typeStatus,
          collectionsStatus,
          sort,
          selectedPagination
        ),
    });
  }
  if (!isEmpty(filterProductStatus)) {
    const key = "productFilter";
    let title = "";
    const temp = productsInDB.filter((e) => e.products_id === match.params.id);
    if (temp.length !== 0) {
      title = temp[0].products_title;
    }
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, title),
      onRemove: () => handleFilterProductStatusRemove(valueSearch),
    });
  }
  if (!isEmpty(selected) && selected !== 0) {
    const key = "selected";
    const title = tabs.filter((e) => e.id === selected);

    appliedFilters.push({
      key,
      label: disambiguateLabel(key, title[0].content),
      onRemove: () =>
        handleSelectedStatusRemove(
          valueSearch,
          typeStatus,
          vendorStatus,
          collectionsStatus,
          sort,
          selectedPagination
        ),
    });
  }
  if (!isEmpty(collectionsStatus)) {
    const key = "collections";
    let title = "";
    const checked = collectionsSelect.filter(
      (e) => e.value === collectionsStatus[0]
    );
    if (checked.length !== 0) {
      title = checked[0].label;
    }
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, title),
      onRemove: () =>
        handleCollectionsStatusRemove(
          valueSearch,
          selected,
          typeStatus,
          vendorStatus,
          sort,
          selectedPagination
        ),
    });
  }
  if (!isEmpty(typeStatus)) {
    const key = "selectReviews";
    const title = productTypeSelect.filter((e) => e.value === typeStatus[0]);
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, title[0].label),
      onRemove: () =>
        handleTypeStatusRemove(
          valueSearch,
          selected,
          vendorStatus,
          collectionsStatus,
          sort,
          selectedPagination
        ),
    });
  }
  const [sort, setSort] = useState("id");

  const clearSort = useCallback(() => {
    setSort("id");
    if ($("#thRating").hasClass("headerSortDown")) {
      $("#thRating").removeClass("headerSortDown");
      // $("#thRating").addClass("headerSortUp");
    }
    if ($("#thName").hasClass("headerSortDown")) {
      $("#thName").removeClass("headerSortDown");
      // $("#thName").addClass("headerSortUp");
    }
    if ($("#thFeedBack").hasClass("headerSortDown")) {
      $("#thFeedBack").removeClass("headerSortDown");
      // $("#thFeedBack").addClass("headerSortUp");
    }
    if ($("#thSource").hasClass("headerSortDown")) {
      $("#thSource").removeClass("headerSortDown");
      // $("#thSource").addClass("headerSortUp");
    }
  });
  const handleFilterByName = useCallback(
    (
      value,
      offset,
      selected,
      productType,
      vendor,
      collectionID,
      idProduct,
      selectedPagination
    ) => {
      if (!$("#thName").hasClass("headerSortDown")) {
        $("#thName").addClass("headerSortDown");
        // $("#thName").removeClass("headerSortUp");
        searchRequest(
          value,
          offset,
          selected,
          productType,
          vendor,
          collectionID,
          idProduct,
          "reviewer_name",
          selectedPagination
        );
        setSort("reviewer_name");
        if ($("#thRating").hasClass("headerSortDown")) {
          $("#thRating").removeClass("headerSortDown");
          // $("#thRating").addClass("headerSortUp");
        }
        if ($("#thFeedBack").hasClass("headerSortDown")) {
          $("#thFeedBack").removeClass("headerSortDown");
          // $("#thFeedBack").addClass("headerSortUp");
        }
        if ($("#thSource").hasClass("headerSortDown")) {
          $("#thSource").removeClass("headerSortDown");
          // $("#thSource").addClass("headerSortUp");
        }
      } else {
        searchRequest(
          value,
          offset,
          selected,
          productType,
          vendor,
          collectionID,
          idProduct,
          "id",
          selectedPagination
        );
        // $("#thName").addClass("headerSortUp");
        $("#thName").removeClass("headerSortDown");
      }
    }
  );
  const handleFilterByRating = useCallback(
    (
      value,
      offset,
      selected,
      productType,
      vendor,
      collectionID,
      idProduct,
      selectedPagination
    ) => {
      if (!$("#thRating").hasClass("headerSortDown")) {
        $("#thRating").addClass("headerSortDown");
        // $("#thRating").removeClass("headerSortUp");
        searchRequest(
          value,
          offset,
          selected,
          productType,
          vendor,
          collectionID,
          idProduct,
          "reviewer_rating",
          selectedPagination
        );
        setSort("reviewer_rating");
        if ($("#thName").hasClass("headerSortDown")) {
          $("#thName").removeClass("headerSortDown");
          // $("#thName").addClass("headerSortUp");
        }
        if ($("#thFeedBack").hasClass("headerSortDown")) {
          $("#thFeedBack").removeClass("headerSortDown");
          // $("#thFeedBack").addClass("headerSortUp");
        }
        if ($("#thSource").hasClass("headerSortDown")) {
          $("#thSource").removeClass("headerSortDown");
          // $("#thSource").addClass("headerSortUp");
        }
      } else {
        searchRequest(
          value,
          offset,
          selected,
          productType,
          vendor,
          collectionID,
          idProduct,
          "id",
          selectedPagination
        );
        // $("#thRating").addClass("headerSortUp");
        $("#thRating").removeClass("headerSortDown");
      }
    }
  );
  const handleFilterByFeedback = useCallback(
    (
      value,
      offset,
      selected,
      productType,
      vendor,
      collectionID,
      idProduct,
      selectedPagination
    ) => {
      if (!$("#thFeedBack").hasClass("headerSortDown")) {
        $("#thFeedBack").addClass("headerSortDown");
        // $("#thFeedBack").removeClass("headerSortUp");
        searchRequest(
          value,
          offset,
          selected,
          productType,
          vendor,
          collectionID,
          idProduct,
          "reviewer_title",
          selectedPagination
        );
        setSort("reviewer_title");
        if ($("#thRating").hasClass("headerSortDown")) {
          $("#thRating").removeClass("headerSortDown");
          // $("#thRating").addClass("headerSortUp");
        }
        if ($("#thName").hasClass("headerSortDown")) {
          $("#thName").removeClass("headerSortDown");
          // $("#thName").addClass("headerSortUp");
        }
        if ($("#thSource").hasClass("headerSortDown")) {
          $("#thSource").removeClass("headerSortDown");
          // $("#thSource").addClass("headerSortUp");
        }
      } else {
        searchRequest(
          value,
          offset,
          selected,
          productType,
          vendor,
          collectionID,
          idProduct,
          "id",
          selectedPagination
        );
        // $("#thFeedBack").addClass("headerSortUp");
        $("#thFeedBack").removeClass("headerSortDown");
      }
    }
  );
  const handleFilterBySource = useCallback(
    (
      value,
      offset,
      selected,
      productType,
      vendor,
      collectionID,
      idProduct,
      selectedPagination
    ) => {
      if (!$("#thSource").hasClass("headerSortDown")) {
        $("#thSource").addClass("headerSortDown");
        // $("#thSource").removeClass("headerSortUp");
        searchRequest(
          value,
          offset,
          selected,
          productType,
          vendor,
          collectionID,
          idProduct,
          "import_source",
          selectedPagination
        );
        setSort("import_source");
        if ($("#thRating").hasClass("headerSortDown")) {
          $("#thRating").removeClass("headerSortDown");
          // $("#thRating").addClass("headerSortUp");
        }
        if ($("#thFeedBack").hasClass("headerSortDown")) {
          $("#thFeedBack").removeClass("headerSortDown");
          // $("#thFeedBack").addClass("headerSortUp");
        }
        if ($("#thName").hasClass("headerSortDown")) {
          $("#thName").removeClass("headerSortDown");
          // $("#thName").addClass("headerSortUp");
        }
      } else {
        searchRequest(
          value,
          offset,
          selected,
          productType,
          vendor,
          collectionID,
          idProduct,
          "id",
          selectedPagination
        );
        // $("#thSource").addClass("headerSortUp");
        $("#thSource").removeClass("headerSortDown");
      }
    }
  );
  const optionsPagination = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
  ];
  const [selectedPagination, setSelectedPagination] = useState("20");
  const handleSelectPaginationChange = useCallback(
    (
      value,
      valueSearch,
      offsetSearch,
      selected,
      typeStatus,
      vendorStatus,
      collectionsStatus,
      idProduct,
      sort
    ) => {
      setSelectedPagination(value);
      searchRequest(
        valueSearch,
        0,
        selected,
        typeStatus,
        vendorStatus,
        collectionsStatus,
        idProduct,
        sort,
        value
      );
      getCountAllRequest(
        valueSearch,
        selected,
        typeStatus,
        vendorStatus,
        collectionsStatus,
        idProduct
      );
    },
    []
  );

  return (
    <div>
      <div style={{ margin: "10px 0 10px" }}>
        <Layout>
          <Layout.Section oneThird>
            <Title title="Requests" />
          </Layout.Section>
          <Layout.Section oneThird>
            <ModalCreateReview
              floatStyle="right"
              id="btn-outline"
              offset={offsetSearch}
              reloadPage="requestPage"
            />
            <ModalImport
              reloadPage="requestPage"
              id="btn-outline"
              offset={offsetSearch}
            />
            {/* <ModalExport id="btn-outline" /> */}
            {/* <Button
              size="slim"
              outline
              id="btn-importUrlHeader"
              onClick={() =>
                history.push(config.pathName + "/ImportUrlToMultiProducts")
              }
            >
              Import Reviews
            </Button> */}
            <ModalStepImport
              styleForm="requests"
              floatStyle="right"
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
              handleTabChange(
                e,
                valueSearch,
                vendorStatus,
                collectionsStatus,
                typeStatus,
                sort,
                selectedPagination
              )
            }
          >
            <ResourceList
              resourceName={{ singular: "reviews", plural: "reviews" }}
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
                        typeStatus,
                        vendorStatus,
                        collectionsStatus,
                        filterProductStatus,
                        sort,
                        selectedPagination
                      )
                    }
                    onQueryClear={() =>
                      handleQueryValueRemove(
                        selected,
                        typeStatus,
                        vendorStatus,
                        collectionsStatus,
                        filterProductStatus,
                        sort,
                        selectedPagination
                      )
                    }
                    onClearAll={handleFiltersClearAll}
                  />
                  <div style={{ overflowX: "auto" }}>
                    <Table id="table" hover>
                      <thead className="thTable">
                        {arrCheckedReview.length !== 0 &&
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
                              <div
                                className="dropdown-menu"
                                style={{ minWidth: "28rem" }}
                              >
                                <ModalAssignChecked
                                  reloadPage="requestPage"
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                                <ModalUnPublishChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  selected={selected}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                                <ModalPublishChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />

                                <ModalUnFlagChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                                <ModalFlagChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                                <ModalDeleteChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                              </div>
                            </div>
                          )}
                        {arrCheckedReview.length !== 0 &&
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
                              <div
                                className="dropdown-menu"
                                style={{ minWidth: "28rem" }}
                              >
                                <ModalUnPublishChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  selected={selected}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                                <ModalPublishChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                                <ModalUnFlagChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                                <ModalFlagChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                                <ModalDeleteChecked
                                  reloadPage="requestPage"
                                  idReviewChecked={arrCheckedReview}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
                                  setStatusChecked={setStatusChecked}
                                />
                              </div>
                            </div>
                          )}
                        {arrCheckedReview.length == 0 && (
                          <tr id="tableInReviews">
                            <th style={{ paddingLeft: "17px" }}>
                              <input
                                type="checkbox"
                                // name="nameReview[]"
                                id="check_all"
                                defaultChecked={statusCheckAll}
                                onClick={handleCheckAll}
                              ></input>
                            </th>
                            <th
                              id="thName"
                              onClick={() =>
                                handleFilterByName(
                                  valueSearch,
                                  offsetSearch,
                                  selected,
                                  typeStatus,
                                  vendorStatus,
                                  collectionsStatus,
                                  filterProductStatus,
                                  selectedPagination
                                )
                              }
                              width="5%"
                            >
                              Name
                            </th>
                            <th
                              id="thRating"
                              onClick={() =>
                                handleFilterByRating(
                                  valueSearch,
                                  offsetSearch,
                                  selected,
                                  typeStatus,
                                  vendorStatus,
                                  collectionsStatus,
                                  filterProductStatus,
                                  selectedPagination
                                )
                              }
                              width="15%"
                            >
                              Rating
                            </th>
                            <th
                              id="thFeedBack"
                              onClick={() =>
                                handleFilterByFeedback(
                                  valueSearch,
                                  offsetSearch,
                                  selected,
                                  typeStatus,
                                  vendorStatus,
                                  collectionsStatus,
                                  filterProductStatus,
                                  selectedPagination
                                )
                              }
                              width="20%"
                            >
                              Feedback
                            </th>
                            <th
                              id="thSource"
                              onClick={() =>
                                handleFilterBySource(
                                  valueSearch,
                                  offsetSearch,
                                  selected,
                                  typeStatus,
                                  vendorStatus,
                                  collectionsStatus,
                                  filterProductStatus,
                                  selectedPagination
                                )
                              }
                              width="5%"
                            >
                              Source
                            </th>
                            <th>Status</th>
                            <th className="" width="15%">
                              Photo
                            </th>
                            <th width="5%" style={{ textAlign: "center" }}>
                              Assigned
                            </th>
                            <th style={{ textAlign: "center" }}>Action</th>
                          </tr>
                        )}
                        {arrCheckedReview.length !== 0 && (
                          <tr>
                            <th></th>
                            <th width="5%"></th>
                            <th width="15%"></th>
                            <th width="20%"></th>
                            <th className="" width="5%"></th>
                            <th></th>
                            <th className="" width="15%"></th>
                            <th width="5%"></th>
                            <th></th>
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        {loadingTable == false &&
                          dataFilterReviews.map((data, index) => (
                            <tr
                              key={index}
                              className="animate__animated animate__fadeIn"
                              name="rowChecked"
                            >
                              <td style={{ paddingLeft: "17px" }}>
                                <input
                                  type="checkbox"
                                  name="nameReview[]"
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
                                </h1>
                                <br></br>
                                <p className="textContent">
                                  {data.reviewer_mess}
                                </p>
                              </td>
                              <td className="">
                                {data.import_source ? (
                                  <h1>{data.import_source}</h1>
                                ) : (
                                  <h1>customize</h1>
                                )}
                              </td>

                              {/* <td> */}
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

                              {/* </td> */}
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
                              <td className="">
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
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    cursor: "pointer",
                                  }}
                                  title="Products has been assigned"
                                >
                                  <div style={{ width: "17px" }}>
                                    <Icon
                                      color="inkLighter"
                                      source={ProductsMajor}
                                    />
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
                                    <Icon
                                      color="inkLighter"
                                      source={CollectionsMajor}
                                    />
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
                              <td
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <ModalCreateReview
                                  styleButton="editButton"
                                  id="btn-outline"
                                  floatStyle="left"
                                  reloadPage="requestPage"
                                  idReview={data.id}
                                  offset={offsetSearch}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  selected={selected}
                                  type={typeStatus}
                                  styleForm="editForm"
                                  limit={selectedPagination}
                                  sort={sort}
                                />
                                <ModalDeleteReview
                                  reloadPage="requestPage"
                                  id={data.id}
                                  offset={offsetSearch}
                                  selected={selected}
                                  valueSearch={valueSearch}
                                  idCollection={collectionsStatus}
                                  vendor={vendorStatus}
                                  type={typeStatus}
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
                    dataFilterReviews.length == 0 && loadingTable == false && (
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
                  <div style={{ display: "flex" }}>
                    <Pagination
                      style={{ float: "right!important" }}
                      hasPrevious
                      label={countAllReviews}
                      onPrevious={() =>
                        handleChangeOffsetSearchPre(
                          valueSearch,
                          selected,
                          typeStatus,
                          vendorStatus,
                          collectionsStatus,
                          filterProductStatus,
                          selectedPagination
                        )
                      }
                      hasNext
                      onNext={() =>
                        handleChangeOffsetSearchNext(
                          valueSearch,
                          selected,
                          typeStatus,
                          vendorStatus,
                          collectionsStatus,
                          filterProductStatus,
                          selectedPagination
                        )
                      }
                    />
                    <div style={{ marginLeft: "10px" }}>
                      <Select
                        options={optionsPagination}
                        onChange={(e) =>
                          handleSelectPaginationChange(
                            e,
                            valueSearch,
                            offsetSearch,
                            selected,
                            typeStatus,
                            vendorStatus,
                            collectionsStatus,
                            match.params.id,
                            sort
                          )
                        }
                        value={selectedPagination}
                      />
                    </div>
                  </div>
                </div>
              }
              items={[dataFilterReviews]}
              renderItem={(item) => {
                return;
              }}
            />
          </Tabs>
          <MoreApp />
        </Card>
      </div>
      {
        loading == true && <Loading /> //loading
      }
    </div>
  );
};
Reviews.propTypes = {
  reviews: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  reviews: state.reviews,
  listReviews: state.listReviews,
  productTypes: state.productTypes,
});

export default connect(mapStateToProps, {
  getCountAllRequest,
  reload,
  getSettings,
  ChangeCheckedReviews,
  syncCollections,
  getVendorProduct,
  loadDataTable,
  //thêm
  searchRequest,
  getImageReview,
  getProductTypeSelect,
  getProductsSearch,
  getCountProductInShopify,
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  getConnectProductReviews,
  getAllProductDB,
})(Reviews);
