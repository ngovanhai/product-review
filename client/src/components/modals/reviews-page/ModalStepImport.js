import React, { useCallback, useState, useEffect, useRef } from "react";
import config from "../../../config/config";
import $ from "jquery";
import { connect } from "react-redux";
import {
  Button,
  TextContainer,
  Modal,
  ProgressBar,
  Select,
  TextField,
  TextStyle,
  Stack,
  RadioButton,
  Card,
  Layout,
  Scrollable,
  Tag,
  Spinner,
  Checkbox,
  Icon,
} from "@shopify/polaris";
import ReactStars from "react-stars";
import { Table } from "reactstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { ImportMinor } from "@shopify/polaris-icons";
import {
  getReviewImportUrl,
  reload,
  clearDataInImport,
  ChangeCheckedReviewsImport,
  DeleteCheckedReviews,
  replaceReviews,
  getArrProductsImport,
  resetArrProductImports,
  displayError,
  saveAndLoadMoreCollections,
  saveAndLoadMoreMultiProducts,
  saveAndLoadMoreType,
  reloadWhenSave,
} from "../../../actions/importUrl";
import {
  updateCountReview,
  getProductTypeSelect,
  changeProductsImport,
  resetProductsImport,
  getProductsSearch,
  loadDataTable,
  getCollectionsSelect,
  ChangeCheckedReviews,
} from "../../../actions/reviews";
import {
  changeCheckedCollectionImport,
  getArrCollectionsImport,
  clearDataInCollection,
} from "../../../actions/collections";
import {
  changeCheckedProductTypesImport,
  getArrProductTypesImport,
  clearDataInProductTypes,
  updateCountReviewInType,
} from "../../../actions/productTypes";
import {
  searchReview,
  getImageReview,
  searchRequest,
  getCountAllReview,
} from "../../../actions/listReviews";
import Loading from "../../../components/contents/Spinner";

const ModalStepImport = ({
  reloadWhenSave,
  getCountAllReview,
  updateCountReviewInType,
  changeProductsImport,
  floatStyle,
  idProduct,
  idCollection,
  clearDataInCollection,
  clearDataInProductTypes,
  ChangeCheckedReviews,
  ChangeCheckedReviewsImport,
  styleButton,
  changeCheckedCollectionImport,
  getCollectionsSelect,
  getReviewImportUrl,
  reload,
  updateCountReview,
  clearDataInImport,
  DeleteCheckedReviews,
  replaceReviews,
  getProductTypeSelect,
  getArrProductsImport,
  resetArrProductImports,
  resetProductsImport,
  displayError,
  saveAndLoadMoreCollections,
  saveAndLoadMoreMultiProducts,
  saveAndLoadMoreType,
  getProductsSearch,
  searchReview,
  searchRequest,
  loadDataTable,
  getArrCollectionsImport,
  getArrProductTypesImport,
  changeCheckedProductTypesImport,
  setStatusChecked,
  idProductType,
  styleForm,
  reviews: { collectionsSelect, productTypeSelect, arrCheckedProducts },
  url: {
    reviewsImportUrl,
    loading,
    reviewAdd,
    arrProductImports,
    arrCheckedReview,
    loadingTable,
    countReviewsFound,
    stopResearchReviews,
  },
  collections: {
    arrCheckedCollectionImport,
    arrCollectionImports,
    arrCheckedCollection,
  },
  productTypes: { arrCheckedProductTypeImport, arrProductTypeImport },
}) => {
  const shop = config.shop;
  const [loadReview, setLoadReview] = useState(false);
  const [active, setActive] = useState(false);
  const [step, setStep] = useState("step1");
  let reviews = [];
  useEffect(() => {
    if (loadReview == true) {
      reviews = reviewsImportUrl;
    }
  }, [reviewsImportUrl]);
  useEffect(async () => {}, [active]);
  useEffect(() => {
    getCollectionsSelect();
  }, [getCollectionsSelect]);
  useEffect(() => {
    getProductTypeSelect();
  }, [getProductTypeSelect]);
  const handleChange = useCallback(
    (
      e,
      arrCheckedProducts,
      arrCheckedCollectionImport,
      arrCheckedProductTypeImport
    ) => {
      setActive(!active);
      if (idProduct) {
        changeProductsImport([idProduct]);
        getArrProductsImport([idProduct]);
      }
      if (idCollection) {
        changeCheckedCollectionImport([idCollection]);
        getArrCollectionsImport([idCollection]);
      }
      if (idProductType) {
        changeCheckedProductTypesImport([idProductType]);
        getArrProductTypesImport([idProductType]);
      } else if (!idProduct && !idCollection && !idProductType) {
        getArrProductsImport(arrCheckedProducts);
        getArrCollectionsImport(arrCheckedCollectionImport);
        getArrProductTypesImport(arrCheckedProductTypeImport);
      }
    },
    [active]
  );
  const handleClose = useCallback(() => {
    setActive(!active);
    setPage(1);
    setStep("step1");
    setUrl("");

    setStatusSearch(false);
    setTextImportHasFound("");
    setStatusLoadingReviews(false);
    clearDataInImport();
    setStatusDisableSave(true);
    setLoadReview(false);
    setSearch("");

    if (styleForm == "products") {
      getProductsSearch("", 0);
    }
    if (styleForm == "requests") {
      getImageReview();
      searchRequest("", 0);
      getCountAllReview();
    }
    if (styleForm == "reviews") {
      getImageReview();
      searchReview("", 0);
      getCountAllReview();
    }

    var checkboxes = document.getElementsByName("nameProducts[]");
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    var checkboxesAll = document.getElementById("check_all");
    checkboxesAll.checked = false;
    var rowChecked = document.getElementsByName("rowChecked");
    for (var j = 0; j < rowChecked.length; j++) {
      if (rowChecked[j].children[0].children[0].checked == false) {
        rowChecked[j].classList.remove("rowChecked");
      }
    }
    setStatusChecked();
    ChangeCheckedReviews([]);
    clearDataInCollection();
    clearDataInProductTypes();
    resetArrProductImports();
    resetProductsImport();
  }, [active]);
  const handleNext = useCallback(async () => {
    if (valueUrl == "") {
      displayError("You have not entered the URL!");
    }
    if (
      arrCheckedCollectionImport.length == 0 &&
      arrCheckedProducts.length == 0 &&
      arrCheckedProductTypeImport.length == 0
    ) {
      displayError("Have not selected any import places!");
    }
    if (
      valueUrl !== "" &&
      (arrCheckedCollectionImport.length > 0 ||
        arrCheckedProducts.length > 0 ||
        arrCheckedProductTypeImport.length > 0)
    ) {
      setStep("step2");
    }
    // };
  });
  const handlePreInStep2 = useCallback(async () => {
    setStep("step1");
    setStatusSearch(false);
  });
  const handlePreInStep3 = useCallback(async () => {
    setStep("step2");
    setStatusSearch(false);
  });
  // const [importHasFound, setImportHasFound] = useState(0);
  const [textImportHasFound, setTextImportHasFound] = useState(" (Loading...)");
  const [statusLoadingReviews, setStatusLoadingReviews] = useState(true);
  const [statusDisableSave, setStatusDisableSave] = useState(true);
  const [statusSearch, setStatusSearch] = useState(false);
  const handleNextInStep2 = useCallback(async () => {
    setStatusSearch(true);
    setTextImportHasFound(" (Loading...)");
    setStatusLoadingReviews(true);
    reload();
    await resolveData();
    setLoadReview(true);
    setStep("step3");
    setStatusActionStop(true);

    // class AQueue {
    //   constructor(capacity) {
    //     this.data = [];
    //     this.capacity = capacity;
    //     this.size = 0;
    //   }

    //   isFull() {
    //     return this.size === this.capacity;
    //   }

    //   isEmpty() {
    //     return this.size === 0;
    //   }

    //   enqueue(item) {
    //     if (this.isFull()) return false;

    //     this.data.push(item);
    //     this.size++;
    //     return true;
    //   }

    //   dequeue() {
    //     if (this.isEmpty()) return undefined;

    //     return this.data.shift();
    //   }

    //   front() {
    //     if (this.isEmpty()) return undefined;

    //     return this.data[0];
    //   }

    //   rear() {
    //     if (this.isEmpty()) return undefined;

    //     return this.data[this.size - 1];
    //   }

    //   clear() {
    //     this.data.length = 0;
    //     this.size = 0;
    //   }
    // }

    // const End = 10;

    // // Test queue thông thường
    // const queue = new AQueue(End);

    // for (let i = 1; i < End; i++) {
    //   queue.enqueue(i);
    // }

    // for (let j = 1; j < End; j++) {
    //   let shift = queue.dequeue();
    //   if (shift !== undefined) {
    //     if (shift == 2) {
    //       setStep("step3");
    //     }
    //     if (shift == 9) {
    //       setStatusDisableSave(false);
    //       setStep("step3");
    //       setTextImportHasFound(" (Done)");
    //       setStatusLoadingReviews(false);
    //     }
    //     await getReviewImportUrl(
    //       valueUrl,
    //       selectedSort,
    //       dataForm["verifiedPurchase"],
    //       selectedStar,
    //       dataForm["imageAndVideo"],
    //       shift,
    //       valueReviewersName,
    //       valueReviewersTitle,
    //       dataForm["showBlank"]
    //     );
    //   }
    // }
  });

  //STEP 1
  const [valueUrl, setUrl] = useState("");
  const handleProductUrl = useCallback((newValue) => {
    setUrl(newValue);
  }, []);

  //STEP 2
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
  //STEP 35
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
    ChangeCheckedReviewsImport(arr);
  });
  const Delete = useCallback((arr, reviews) => {
    DeleteCheckedReviews(arr, reviews);
    var checkboxes = document.getElementsByName("name[]");
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    setStatusCheckAll(false);
  }, []);
  // const setStatusChecked = useCallback(() => {
  //   setStatusCheckAll(false);
  // });
  // const [arrIdChecked, setArrIdChecked] = useState([]);
  const handleCheckOnly = useCallback(() => {
    let arr = [];
    var checkboxes = document.getElementsByName("name[]");
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        arr.push(checkboxes[i].value);
      }
    }
    ChangeCheckedReviewsImport(arr);
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
    setLoadReview(false);
    reloadWhenSave();
    class AQueue {
      constructor(capacity) {
        this.data = [];
        this.capacity = capacity;
        this.size = 0;
      }

      isFull() {
        return this.size === this.capacity;
      }

      isEmpty() {
        return this.size === 0;
      }

      enqueue(item) {
        if (this.isFull()) return false;

        this.data.push(item);
        this.size++;
        return true;
      }

      dequeue() {
        if (this.isEmpty()) return undefined;

        return this.data.shift();
      }

      front() {
        if (this.isEmpty()) return undefined;

        return this.data[0];
      }

      rear() {
        if (this.isEmpty()) return undefined;

        return this.data[this.size - 1];
      }

      clear() {
        this.data.length = 0;
        this.size = 0;
      }
    }
    await resolveData();
    if (arrCheckedCollectionImport.length > 0) {
      const End = arrCheckedCollectionImport.length;
      const queue = new AQueue(End);
      for (let i = 0; i < End; i++) {
        queue.enqueue(arrCheckedCollectionImport[i]);
      }
      for (let j = 0; j < End; j++) {
        let shift = queue.dequeue();
        if (shift !== undefined) {
          await saveAndLoadMoreCollections({
            id: shift,
            reviews: reviews,
            url: valueUrl,
            count: countImport,
          });
        }
      }
    }
    if (arrCheckedProducts.length > 0) {
      const End = arrCheckedProducts.length;
      const queue = new AQueue(End);
      for (let i = 0; i < End; i++) {
        queue.enqueue(arrCheckedProducts[i]);
      }
      for (let j = 0; j < End; j++) {
        let shift = queue.dequeue();
        if (shift !== undefined) {
          await saveAndLoadMoreMultiProducts({
            id: shift,
            reviews: reviews,
            url: valueUrl,
            count: countImport,
          });
        }
        await updateCountReview(shift);
      }
    }
    if (arrCheckedProductTypeImport.length > 0) {
      const End = arrCheckedProductTypeImport.length;
      const queue = new AQueue(End);
      for (let i = 0; i < End; i++) {
        queue.enqueue(arrCheckedProductTypeImport[i]);
      }
      for (let j = 0; j < End; j++) {
        let shift = queue.dequeue();
        if (shift !== undefined) {
          await saveAndLoadMoreType({
            id: shift,
            reviews: reviews,
            url: valueUrl,
            count: countImport,
          });
        }
        await updateCountReviewInType(shift);
      }
    }
    setStatusDisableSave(true);

    loadDataTable();
    clearDataInImport();
    clearDataInCollection();
    clearDataInProductTypes();

    handleClose();
    // if (reviewAdd["count"]) {
    //   setCountImport(reviewAdd["count"]);
    // } else {
    //   setCountImport(0);
    // }
  });

  useEffect(() => {
    setCountImport(reviewAdd["count"]);
  }, [reviewAdd["count"]]);
  const [statusActionStop, setStatusActionStop] = useState(false);
  const [statusActionContinue, setStatusActionContinue] = useState(false);
  const handleActionStop = useCallback(() => {
    setStatusActionStop(false);
    setLoadReview(false);
    setStatusActionContinue(true);
    setTextImportHasFound(" (Done)");
    setStatusLoadingReviews(false);
    setStatusDisableSave(false);
  });
  const handleLoadContinue = useCallback(async () => {
    setStatusDisableSave(true);
    setStatusSearch(true);
    setTextImportHasFound(" (Loading...)");
    setStatusLoadingReviews(true);
    await resolveData();
    setLoadReview(true);
    setStatusActionContinue(false);
    setStatusActionStop(true);
  });

  useEffect(async () => {
    if (loadReview && stopResearchReviews == false) {
      await resolveData();
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
      setPage(page + 1);
    }
    if (loadReview && stopResearchReviews == true) {
      setStatusActionStop(false);
      setStatusDisableSave(false);
      //   setStep("step3");
      setTextImportHasFound(" (Done)");
      setStatusLoadingReviews(false);
      setStatusActionContinue(false);
    }
  }, [loadReview, page, stopResearchReviews]);

  let activator = (
    <Button
      outline
      size="slim"
      onClick={(e) =>
        handleChange(
          e,
          arrCheckedProducts,
          arrCheckedCollectionImport,
          arrCheckedProductTypeImport
        )
      }
    >
      Import reviews
    </Button>
  );
  switch (styleButton) {
    case "importInTable":
      {
        activator = (
          <button
            id="btn-outline"
            className="Polaris-Button Polaris-Button--iconOnly"
            onClick={handleChange}
            title="Import reviews"
          >
            <Icon source={ImportMinor} />
          </button>
        );
      }
      break;
    case "importInChecked":
      {
        activator = (
          <button id="button-function-detail" onClick={handleChange}>
            Import reviews
          </button>
        );
      }
      break;
    case "importInDetailProduct": {
      activator = (
        <Button id="btn-importUrl-detail" onClick={handleChange}>
          Import Reviews
        </Button>
      );
    }
  }
  //autocomplete products
  const [options, setOptions] = useState([]);
  const wrapperRef = useRef(null);
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    const products = [];
    axios
      .get(config.rootLink + `/backend/server.php`, {
        params: {
          shop: shop,
          getAutoCompleteProducts: "",
        },
      })
      .then((res) => {
        return res.data.map((e) => products.push(e));
      });
    setOptions(products);
  }, []);
  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };
  const addProduct = async (productId, arr) => {
    if (arr.indexOf(productId) == -1) {
      arr.push(productId);
    }
    await changeProductsImport(arr);
    getArrProductsImport(arr);
    setDisplay(false);
  };
  //autocomplete collections
  const [optionsCollection, setOptionsCollection] = useState([]);
  const wrapperRefCollection = useRef(null);
  const [searchCollection, setSearchCollection] = useState("");
  const [displayCollection, setDisplayCollection] = useState(false);
  useEffect(() => {
    const collections = [];
    axios
      .get(config.rootLink + `/backend/server.php`, {
        params: {
          shop: shop,
          getAutoCompleteCollections: "",
        },
      })
      .then((res) => {
        return res.data.map((e) => collections.push(e));
      });
    setOptionsCollection(collections);
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideCollection);
    document.addEventListener("mousedown", handleClickOutsideProductTypes);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideCollection);
      document.addEventListener("mousedown", handleClickOutsideProductTypes);
    };
  }, []);

  const handleClickOutsideCollection = (event) => {
    const { current: wrap } = wrapperRefCollection;
    if (wrap && !wrap.contains(event.target)) {
      setDisplayCollection(false);
    }
  };
  const addCollection = async (collectionID, arr) => {
    if (arr.indexOf(collectionID) == -1) {
      arr.push(collectionID);
    }
    await changeCheckedCollectionImport(arr);
    getArrCollectionsImport(arr);
    setDisplayCollection(false);
  };
  //autocomplete product types
  const [optionsProductTypes, setOptionsProductTypes] = useState([]);
  const wrapperRefProductTypes = useRef(null);
  const [searchProductTypes, setSearchProductTypes] = useState("");
  const [displayProductTypes, setDisplayProductTypes] = useState(false);
  useEffect(() => {
    const collections = [];
    axios
      .get(config.rootLink + `/backend/server.php`, {
        params: {
          shop: shop,
          getAutoCompleteProductTypes: "",
        },
      })
      .then((res) => {
        return res.data.map((e) => collections.push(e));
      });
    setOptionsProductTypes(collections);
  }, []);
  const handleClickOutsideProductTypes = (event) => {
    const { current: wrap } = wrapperRefProductTypes;
    if (wrap && !wrap.contains(event.target)) {
      setDisplayProductTypes(false);
    }
  };
  const addProductTypes = async (productTypeID, arr) => {
    if (arr.indexOf(productTypeID) == -1) {
      arr.push(productTypeID);
    }
    await changeCheckedProductTypesImport(arr);
    getArrProductTypesImport(arr);
    setDisplayProductTypes(false);
  };
  //end complete
  // const [checkedBoxProducts, setCheckedBoxProducts] = useState(true);
  // const handleChangeCheckedBoxProducts = useCallback((newChecked) => {
  //   if (newChecked == false) {
  //     resetArrProductImports();
  //   }
  //   setCheckedBoxProducts(newChecked);
  // }, []);
  // const [checkedBoxProductType, setCheckedBoxProductType] = useState(false);
  // const handleChangeCheckedBoxProductType = useCallback(
  //   (newChecked) => setCheckedBoxProductType(newChecked),
  //   []
  // );
  // const [checkedBoxCollections, setCheckedBoxCollections] = useState(false);
  // const handleChangeCheckedBoxCollections = useCallback(
  //   (newChecked) => setCheckedBoxCollections(newChecked),
  //   []
  // );
  return (
    <div style={{ float: floatStyle, marginRight: "10px" }}>
      {step == "step1" && (
        <Modal
          activator={activator}
          limitHeight={false}
          open={active}
          onClose={handleClose}
          title={
            <div className="animate__animated animate__fadeIn">
              <TextStyle variation="subdued">
                STEP 1: ENTER THE URL AND CHOOSE WHERE TO IMPORT
              </TextStyle>

              <ProgressBar progress={33} size="small" />
            </div>
          }
          primaryAction={{
            content: "Next",
            onAction: handleNext,
          }}
        >
          <Modal.Section>
            <TextContainer>
              <div className="animate__animated animate__fadeIn">
                <div className="marginBottom">
                  <TextField
                    label="Product's URL"
                    value={valueUrl}
                    onChange={handleProductUrl}
                    placeholder="amazon URL/aliexpress URL"
                  />
                </div>
                <div className="marginBottom">
                  <div style={{ marginTop: "15px" }}>
                    <TextStyle variation="subdued">
                      The reviews will assign products that meet 1 of these
                      conditions
                    </TextStyle>
                  </div>
                </div>
                <div
                  ref={wrapperRef}
                  className="div-autocomplete"
                  style={{ marginBottom: "10px" }}
                >
                  <p id="title-autocomplete">Choose products</p>
                  <input
                    className="form-control mr-sm-2 input-autocomplete"
                    type="search"
                    aria-label="Search"
                    onClick={() => setDisplay(true)}
                    id="auto"
                    placeholder="search products"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                    }}
                  ></input>
                  {display && (
                    <div className="autoContainer">
                      <Scrollable
                        shadow
                        style={{ maxHeight: "200px", overflow: "auto" }}
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
                                onClick={() =>
                                  addProduct(v.products_id, arrCheckedProducts)
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
                        <div
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                            display: "inline-block",
                          }}
                        >
                          <Tag
                            key={i}
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
                        </div>
                      ))}
                  </Scrollable>
                </div>
                <div
                  ref={wrapperRefCollection}
                  className="div-autocomplete"
                  style={{ marginBottom: "10px" }}
                >
                  <p id="title-autocomplete">Choose collections</p>
                  <input
                    className="form-control mr-sm-2 input-autocomplete"
                    type="search"
                    aria-label="Search"
                    onClick={() => setDisplayCollection(true)}
                    id="auto"
                    placeholder="search collections"
                    value={searchCollection}
                    onChange={(event) => {
                      setSearchCollection(event.target.value);
                    }}
                  ></input>
                  {displayCollection && (
                    <div className="autoContainer">
                      <Scrollable
                        shadow
                        style={{ maxHeight: "200px", overflow: "auto" }}
                      >
                        {optionsCollection
                          .filter(
                            ({ title }) =>
                              title
                                .toLowerCase()
                                .indexOf(searchCollection.toLowerCase()) > -1
                          )
                          .map((v, i) => {
                            return (
                              <div
                                onClick={() =>
                                  addCollection(
                                    v.collection_id,
                                    arrCheckedCollectionImport
                                  )
                                }
                                className="options"
                                key={i}
                                tabIndex="0"
                              >
                                <span>{v.title}</span>
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
                    {arrCollectionImports.length !== 0 &&
                      arrCollectionImports.map((e, i) => (
                        <div key={i} style={{ marginBottom: "2px" }}>
                          <Tag
                            onRemove={() => {
                              arrCheckedCollectionImport.splice(
                                arrCheckedCollectionImport.indexOf(
                                  e.collection_id
                                ),
                                1
                              );
                              changeCheckedCollectionImport(
                                arrCheckedCollectionImport
                              );
                              getArrCollectionsImport(
                                arrCheckedCollectionImport
                              );
                            }}
                          >
                            {e.title}
                          </Tag>
                        </div>
                      ))}
                  </Scrollable>
                </div>
                <div
                  ref={wrapperRefProductTypes}
                  className="div-autocomplete"
                  style={{ marginBottom: "10px" }}
                >
                  <p id="title-autocomplete">Choose product types</p>
                  <input
                    className="form-control mr-sm-2 input-autocomplete"
                    type="search"
                    aria-label="Search"
                    onClick={() => setDisplayProductTypes(true)}
                    id="auto"
                    placeholder="search product types"
                    value={searchProductTypes}
                    onChange={(event) => {
                      setSearchProductTypes(event.target.value);
                    }}
                  ></input>
                  {displayProductTypes && (
                    <div className="autoContainer">
                      <Scrollable
                        shadow
                        style={{ maxHeight: "200px", overflow: "auto" }}
                      >
                        {optionsProductTypes
                          .filter(
                            ({ product_type }) =>
                              product_type
                                .toLowerCase()
                                .indexOf(searchProductTypes.toLowerCase()) > -1
                          )
                          .map((v, i) => {
                            return (
                              <div
                                onClick={() =>
                                  addProductTypes(
                                    v.id,
                                    arrCheckedProductTypeImport
                                  )
                                }
                                className="options"
                                key={i}
                                tabIndex="0"
                              >
                                <span>{v.product_type}</span>
                              </div>
                            );
                          })}
                      </Scrollable>
                    </div>
                  )}
                </div>
                <div className="marginBottom" style={{ height: "200px" }}>
                  <Scrollable
                    shadow
                    style={{ maxHeight: "100px", overflow: "auto" }}
                  >
                    {arrProductTypeImport.length !== 0 &&
                      arrProductTypeImport.map((e, i) => (
                        <div key={i} style={{ marginBottom: "2px" }}>
                          <Tag
                            onRemove={() => {
                              arrCheckedProductTypeImport.splice(
                                arrCheckedProductTypeImport.indexOf(e.id),
                                1
                              );
                              changeCheckedProductTypesImport(
                                arrCheckedProductTypeImport
                              );
                              getArrProductTypesImport(
                                arrCheckedProductTypeImport
                              );
                            }}
                          >
                            {e.product_type}
                          </Tag>
                        </div>
                      ))}
                  </Scrollable>
                </div>
              </div>
            </TextContainer>
          </Modal.Section>
        </Modal>
      )}
      {step == "step2" && (
        <Modal
          activator={activator}
          open={active}
          onClose={handleClose}
          title={
            <div className="animate__animated animate__fadeIn">
              <TextStyle variation="subdued">STEP 2: CHOOSE OPTIONS</TextStyle>
              <ProgressBar progress={66} size="small" />
            </div>
          }
          primaryAction={{
            content: "Next",
            onAction: handleNextInStep2,
            disabled: statusSearch,
          }}
          secondaryActions={[
            {
              content: "Previous",
              onAction: handlePreInStep2,
              // disabled: loadingTable,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              {loadingTable && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "30vh",
                  }}
                >
                  <TextStyle variation="subdued">
                    Loading reviews... (it may take 10 seconds)
                  </TextStyle>
                  <Spinner
                    accessibilityLabel="Spinner example"
                    size="large"
                    color="inkLightest"
                  />
                </div>
              )}
              {loadingTable == false && (
                <div className="animate__animated animate__fadeIn">
                  <div className="marginBottom">
                    <Select
                      label="Sort by"
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
                </div>
              )}
            </TextContainer>
          </Modal.Section>
        </Modal>
      )}

      {step == "step3" && (
        <Modal
          large
          activator={activator}
          open={active}
          onClose={handleClose}
          title={
            <div className="animate__animated animate__fadeIn">
              <TextStyle variation="subdued">STEP 3: SAVE</TextStyle>
              <ProgressBar progress={100} size="small" />
            </div>
          }
          primaryAction={{
            content: "Save",
            onAction: handleSaveAndLoadMore,
            disabled: statusDisableSave,
          }}
          // secondaryActions={[
          //   {
          //     content: "Previous",
          //     onAction: handlePreInStep3,
          //     // disabled: loadingTable == false,
          //   },
          // ]}
        >
          <Modal.Section>
            <TextContainer>
              {loading && <Loading></Loading>}
              <div className="animate__animated animate__fadeIn">
                {loadingTable && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "65vh",
                    }}
                  >
                    <TextStyle variation="subdued">
                      Loading... (it may take 10 - 30 seconds)
                    </TextStyle>
                    <Spinner
                      accessibilityLabel="Spinner example"
                      size="large"
                      color="inkLightest"
                    />
                  </div>
                )}
                {reviews.length == 0 && loadingTable == false && (
                  <Card sectioned>
                    {arrCheckedReview.length == 0 && reviews.length !== 0 && (
                      <div
                        className="marginBottom"
                        id="sticky-save"
                        style={{
                          float: "right",
                        }}
                      >
                        {/* <Button primary onClick={handleSaveAndLoadMore}>
                          Save &amp; Load more
                        </Button> */}
                      </div>
                    )}
                    {/* <TextStyle variation="positive">
                      {countImport} reviews imported
                    </TextStyle> */}
                    <TextStyle variation="positive">
                      {countReviewsFound} reviews found {textImportHasFound}
                    </TextStyle>
                    {reviewAdd["countDuplicate"] > 0 && (
                      <div>
                        <br></br>
                        <TextStyle variation="positive">
                          Skipped - {reviewAdd["countDuplicate"]} reviews
                          duplicate
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
                          onClick={() =>
                            handleReplaceButton(valueReplace, reviews)
                          }
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
                          alignItems: "center",
                          marginTop: "80px",
                          fontSize: "2rem",
                          height: "30vh",
                        }}
                      >
                        <TextStyle variation="subdued">
                          No reviews found.
                        </TextStyle>
                      </div>
                    )}
                  </Card>
                )}
                {reviews.length !== 0 &&
                  loadingTable == false && ( //có dữ liệu
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
                      {/* {arrCheckedReview.length == 0 && (
                        <div
                          className="marginBottom"
                          id="sticky-save"
                          style={{
                            float: "right",
                          }}
                        >
                          <Button primary onClick={handleSaveAndLoadMore}>
                            Save &amp; Load more
                          </Button>
                        </div>
                      )} */}
                      {/* <TextStyle variation="positive">
                        {countImport} reviews imported
                      </TextStyle> */}
                      <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "10px" }}>
                          <TextStyle variation="positive">
                            {countReviewsFound} reviews found{" "}
                            {textImportHasFound}
                          </TextStyle>
                        </div>
                        {statusLoadingReviews && (
                          <Spinner
                            accessibilityLabel="Spinner example"
                            size="small"
                            color="inkLightest"
                          />
                        )}
                        {statusActionStop && (
                          <div style={{ marginLeft: "20px" }}>
                            <Button destructive onClick={handleActionStop}>
                              Stop
                            </Button>
                          </div>
                        )}
                        {statusActionContinue && (
                          <div style={{ marginLeft: "20px" }}>
                            <Button primary onClick={handleLoadContinue}>
                              Continue
                            </Button>
                          </div>
                        )}
                      </div>
                      {reviewAdd["countDuplicate"] > 0 && (
                        <div>
                          <br></br>
                          <TextStyle variation="positive">
                            Skipped - {reviewAdd["countDuplicate"]} reviews
                            duplicate
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
                            onClick={() =>
                              handleReplaceButton(valueReplace, reviews)
                            }
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
                                e.review_title
                                  .toLowerCase()
                                  .indexOf(valueFind) > -1 ||
                                e.reviewer_name
                                  .toLowerCase()
                                  .indexOf(valueFind) > -1 ||
                                e.review_content
                                  .toLowerCase()
                                  .indexOf(valueFind) > -1
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
                                  {data.images.map((e, index) => (
                                    <img
                                      key={index}
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
              </div>
            </TextContainer>
          </Modal.Section>
        </Modal>
      )}
    </div>
  );
};
ModalStepImport.propTypes = {
  getReviewImportUrl: PropTypes.func.isRequired,
  // saveAndLoadMoreMultiProducts: PropTypes.func.isRequired,
  url: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  url: state.importReviewUrl,
  reviews: state.reviews,
  collections: state.collections,
  productTypes: state.productTypes,
});

export default connect(mapStateToProps, {
  getReviewImportUrl,
  reload,
  updateCountReview,
  clearDataInImport,
  DeleteCheckedReviews,
  replaceReviews,
  getCollectionsSelect,
  getProductTypeSelect,
  getArrProductsImport,
  changeProductsImport,
  resetArrProductImports,
  resetProductsImport,
  displayError,
  saveAndLoadMoreCollections,
  saveAndLoadMoreMultiProducts,
  saveAndLoadMoreType,
  getProductsSearch,
  loadDataTable,
  updateCountReview,
  changeCheckedCollectionImport,
  getArrCollectionsImport,
  changeCheckedProductTypesImport,
  getArrProductTypesImport,
  ChangeCheckedReviews,
  ChangeCheckedReviewsImport,
  clearDataInCollection,
  clearDataInProductTypes,
  updateCountReviewInType,
  searchReview,
  searchRequest,
  getCountAllReview,
  reloadWhenSave,
})(ModalStepImport);
