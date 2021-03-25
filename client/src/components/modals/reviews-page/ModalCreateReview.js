import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  Select,
  Stack,
  Banner,
  Caption,
  DropZone,
  List,
  TextField,
  Thumbnail,
  RadioButton,
  Layout,
  Scrollable,
  InlineError,
  Tag,
  Icon,
} from "@shopify/polaris";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import config from "../../../config/config";
import { PlusMinor } from "@shopify/polaris-icons";
import "../../../css/style.css";
import { EditMinor } from "@shopify/polaris-icons";
import Loading from "../../contents/Spinner";

import moment from "moment";
import {
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  getConnectProductReviews,
  searchReview,
  getCountAllReview,
  getCountAllRequest,
  searchRequest,
  getImageReview,
  reloadListReview,
  loadDataTable,
} from "../../../actions/listReviews";
import {
  getProductsSearch,
  getCountAllReviews,
  addReviewProducts,
  updateCountReview,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  changeProductsImport,
  addReviewCollections,
  addReviewProductTypes,
  getReviewEdit,
  getImageInReview,
  editReview,
  getAllReviewProductInPage,
  getImageReviewByProduct,
  getProductsDetail,
  unsubscribeProduct,
  unsubscribeCollection,
  unsubscribeProductType,
  subscribeProduct,
  subscribeProductType,
  subscribeCollection,
  resetProductsImport,
  changeImage,
  resetImages,
} from "../../../actions/reviews";
import {
  changeCheckedCollectionImport,
  getArrCollectionsImport,
  clearDataInCollection,
  updateCountReviewInCollection,
  getCollections,
} from "../../../actions/collections";
import {
  changeCheckedProductTypesImport,
  getArrProductTypesImport,
  clearDataInProductTypes,
  updateCountReviewInType,
  getProductType,
} from "../../../actions/productTypes";
import {
  getArrProductsImport,
  resetArrProductImports,
} from "../../../actions/importUrl";
import ModalDeleteImage from "../listReviews-page/ModalDeleteImage";
const ModalCreateReview = ({
  //edit form
  loadDataTable,
  limit,
  changeImage,
  sort,
  searchRequest,
  getCountAllRequest,
  resetImages,
  getImageInReview,
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  getConnectProductReviews,
  getProductType,
  getCollections,
  updateCountReviewInType,
  updateCountReviewInCollection,
  resetProductsImport,
  resetArrProductImports,
  unsubscribeProductType,
  unsubscribeCollection,
  unsubscribeProduct,
  subscribeProduct,
  subscribeProductType,
  subscribeCollection,
  getProductsDetail,
  getImageReviewByProduct,
  getAllReviewProductInPage,
  valueSearch,
  selected,
  type,
  vendor,
  tags,
  idCollection,
  getImageReview,
  editReview,
  productID,
  getReviewEdit,
  styleForm,
  changeProductsImport,
  addReviewProductTypes,
  addReviewCollections,
  getArrProductsImport,
  floatStyle,
  styleButton,
  getProductsSearch,
  reloadListReview,
  getCountAllReviews,
  getCountAllReview,
  addReviewProducts,
  updateCountReview,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  offset,
  idReview,
  searchReview,
  changeCheckedCollectionImport,
  getArrCollectionsImport,
  clearDataInCollection,
  changeCheckedProductTypesImport,
  getArrProductTypesImport,
  clearDataInProductTypes,
  idProduct,
  idProductType,
  reloadPage,
  listReviews: { loadingReviews },
  reviews: {
    dataInsertReview,
    loading,
    arrCheckedProducts,
    reviewEdit,
    imageInReview,
    imageUpload,
  },
  url: { arrProductImports },
  collections: { arrCheckedCollectionImport, arrCollectionImports },
  productTypes: { arrCheckedProductTypeImport, arrProductTypeImport },
}) => {
  const shop = config.shop;

  const [active, setActive] = useState(false);
  const [display, setDisplay] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  // const [idProduct, setIdProduct] = useState("");
  const wrapperRef = useRef(null);
  const [imageData, setImage] = useState([]);
  useEffect(() => {
    if (reviewEdit.length !== 0 && styleForm === "editForm") {
      setName(reviewEdit["reviewer_name"]);
      setTitle(reviewEdit["reviewer_title"]);
      setEmail(reviewEdit["reviewer_email"]);
      setMessage(reviewEdit["reviewer_mess"]);
      setSelectedRating(reviewEdit["reviewer_rating"]);
      setDate(reviewEdit["publishdate"].replace(/\s/, "T"));
      setValueRadioPurchased(
        reviewEdit["purchase"] == "1" ? "yesPurchased" : "noPurchased"
      );
      setvalueRadioRecommend(
        reviewEdit["product_recommend"] == "1" ? "yesRecommend" : "noRecommend"
      );
      setValueRadioPublish(
        reviewEdit["publish"] == "1" ? "yesPublish" : "noPublish"
      );
      setValueRadioFeatured(
        reviewEdit["featured"] == "1" ? "yesFeatured" : "noFeatured"
      );
    }
  }, [active]);

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const addProduct = async (productId, arr, title) => {
    if (styleForm === "editForm") {
      if (arr.indexOf(productId) == -1) {
        arr.push(productId);
        await subscribeProduct({ idReview: idReview, idProduct: productId });
        await changeProductsImport(arr);
        getArrProductsImport(arr);
      }
      setDisplay(false);
      setDisableSave(false);
      // }
    } else {
      if (arr.indexOf(productId) == -1) {
        arr.push(productId);
      }
      await changeProductsImport(arr);
      getArrProductsImport(arr);
      setDisplay(false);
      setDisableSave(false);
    }
  };

  //autocomplete collections
  const [optionsCollection, setOptionsCollection] = useState([]);
  const wrapperRefCollection = useRef(null);
  const [searchCollection, setSearchCollection] = useState("");
  const [displayCollection, setDisplayCollection] = useState(false);
  // useEffect(() => {}, []);
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
  const addCollection = async (collectionID, arr, title) => {
    if (styleForm === "editForm") {
      // if (
      //   window.confirm("Subscribe from review with " + title + " collection!")
      // ) {
      if (arr.indexOf(collectionID) == -1) {
        arr.push(collectionID);
        await subscribeCollection({
          idReview: idReview,
          idCollection: collectionID,
        });
        await changeCheckedCollectionImport(arr);
        getArrCollectionsImport(arr);
      }
      setDisplayCollection(false);
      setDisableSave(false);
      // }
    } else {
      if (arr.indexOf(collectionID) == -1) {
        arr.push(collectionID);
      }
      await changeCheckedCollectionImport(arr);
      getArrCollectionsImport(arr);
      setDisplayCollection(false);
      setDisableSave(false);
    }
  };

  const handleRemoveTagProduct = async (productId, title) => {
    if (styleForm === "editForm") {
      if (
        window.confirm("Unsubscribe from review with " + title + " product!")
      ) {
        await unsubscribeProduct({ idReview: idReview, idProduct: productId });
        arrCheckedProducts.splice(arrCheckedProducts.indexOf(productId), 1);
        changeProductsImport(arrCheckedProducts);
        getArrProductsImport(arrCheckedProducts);
        if (
          arrCheckedProductTypeImport.length == 0 &&
          arrCheckedCollectionImport.length == 0 &&
          arrCheckedProducts.length == 0
        ) {
          setDisableSave(true);
        }
      }
    } else {
      arrCheckedProducts.splice(arrCheckedProducts.indexOf(productId), 1);
      changeProductsImport(arrCheckedProducts);
      getArrProductsImport(arrCheckedProducts);
      if (
        arrCheckedProductTypeImport.length == 0 &&
        arrCheckedCollectionImport.length == 0 &&
        arrCheckedProducts.length == 0
      ) {
        setDisableSave(true);
      }
    }
  };
  const handleRemoveTagCollection = async (collectionID, title) => {
    if (styleForm === "editForm") {
      if (
        window.confirm("Unsubscribe from review with " + title + " collection!")
      ) {
        await unsubscribeCollection({
          idReview: idReview,
          idCollection: collectionID,
        });
        arrCheckedCollectionImport.splice(
          arrCheckedCollectionImport.indexOf(collectionID),
          1
        );
        changeCheckedCollectionImport(arrCheckedCollectionImport);
        getArrCollectionsImport(arrCheckedCollectionImport);
        if (
          arrCheckedProductTypeImport.length == 0 &&
          arrCheckedCollectionImport.length == 0 &&
          arrCheckedProducts.length == 0
        ) {
          setDisableSave(true);
        }
      }
    } else {
      arrCheckedCollectionImport.splice(
        arrCheckedCollectionImport.indexOf(collectionID),
        1
      );
      changeCheckedCollectionImport(arrCheckedCollectionImport);
      getArrCollectionsImport(arrCheckedCollectionImport);
      if (
        arrCheckedProductTypeImport.length == 0 &&
        arrCheckedCollectionImport.length == 0 &&
        arrCheckedProducts.length == 0
      ) {
        setDisableSave(true);
      }
    }
  };
  const handleRemoveTagProductType = async (productTypeId, title) => {
    if (styleForm === "editForm") {
      if (
        window.confirm(
          "Unsubscribe from review with " + title + " product type!"
        )
      ) {
        await unsubscribeProductType({
          idReview: idReview,
          idProductType: productTypeId,
        });
        arrCheckedProductTypeImport.splice(
          arrCheckedProductTypeImport.indexOf(productTypeId),
          1
        );
        changeCheckedProductTypesImport(arrCheckedProductTypeImport);
        getArrProductTypesImport(arrCheckedProductTypeImport);
        if (
          arrCheckedProductTypeImport.length == 0 &&
          arrCheckedCollectionImport.length == 0 &&
          arrCheckedProducts.length == 0
        ) {
          setDisableSave(true);
        }
      }
    } else {
      arrCheckedProductTypeImport.splice(
        arrCheckedProductTypeImport.indexOf(productTypeId),
        1
      );
      changeCheckedProductTypesImport(arrCheckedProductTypeImport);
      getArrProductTypesImport(arrCheckedProductTypeImport);
      if (
        arrCheckedProductTypeImport.length == 0 &&
        arrCheckedCollectionImport.length == 0 &&
        arrCheckedProducts.length == 0
      ) {
        setDisableSave(true);
      }
    }
  };

  //autocomplete product types
  const [optionsProductTypes, setOptionsProductTypes] = useState([]);
  const wrapperRefProductTypes = useRef(null);
  const [searchProductTypes, setSearchProductTypes] = useState("");
  const [displayProductTypes, setDisplayProductTypes] = useState(false);
  useEffect(() => {}, []);
  const handleClickOutsideProductTypes = (event) => {
    const { current: wrap } = wrapperRefProductTypes;
    if (wrap && !wrap.contains(event.target)) {
      setDisplayProductTypes(false);
    }
  };
  const addProductTypes = async (productTypeID, arr, title) => {
    if (styleForm === "editForm") {
      // if (
      //   window.confirm("Subscribe from review with " + title + " product type!")
      // ) {
      if (arr.indexOf(productTypeID) == -1) {
        arr.push(productTypeID);
        await subscribeProductType({
          idReview: idReview,
          idProductType: productTypeID,
        });
        await changeCheckedProductTypesImport(arr);
        getArrProductTypesImport(arr);
      }
      setDisplayProductTypes(false);
      setDisableSave(false);
      // }
    } else {
      if (arr.indexOf(productTypeID) == -1) {
        arr.push(productTypeID);
      }
      await changeCheckedProductTypesImport(arr);
      getArrProductTypesImport(arr);
      setDisplayProductTypes(false);
      setDisableSave(false);
    }
  };
  //end complete
  //custom modal
  const handleChange = useCallback(async () => {
    resetImages();
    if (styleForm === "editForm") {
      reloadListReview();
      await getReviewEdit(idReview);
      await getImageInReview(idReview);
      setDisableSave(false);
    }
    if (idProduct) {
      changeProductsImport([idProduct]);
      getArrProductsImport([idProduct]);
      setDisableSave(false);
    }
    if (idCollection) {
      changeCheckedCollectionImport(idCollection);
      getArrCollectionsImport(idCollection);
      setDisableSave(false);
    }
    if (idProductType) {
      changeCheckedProductTypesImport([idProductType]);
      getArrProductTypesImport([idProductType]);
      setDisableSave(false);
    }
    setActive(!active);
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
    const productType = [];
    axios
      .get(config.rootLink + `/backend/server.php`, {
        params: {
          shop: shop,
          getAutoCompleteProductTypes: "",
        },
      })
      .then((res) => {
        return res.data.map((e) => productType.push(e));
      });
    setOptionsProductTypes(productType);
  }, [active]);
  // const activator =
  //   styleButton === "createInTable" ? (
  //     <Button id="btn-delete" onClick={handleChange}>
  //       Add Reviews
  //     </Button>
  //   ) : (
  //     <Button primary size="slim" onClick={handleChange}>
  //       Add Review
  //     </Button>
  //   );

  let activator = (
    <Button primary size="slim" onClick={handleChange}>
      Add Review
    </Button>
  );
  switch (styleButton) {
    case "createInTable":
      {
        activator = (
          <button
            id="btn-outline"
            className="Polaris-Button Polaris-Button--iconOnly"
            onClick={handleChange}
            title="Add reviews"
          >
            <Icon source={PlusMinor} />
          </button>
        );
      }
      break;
    case "editButton":
      {
        activator = (
          <Button
            id="btn-outline"
            onClick={handleChange}
            icon={EditMinor}
          ></Button>
        );
      }
      break;
  }

  //end
  //input name
  const [errorName, setErrorName] = useState("");
  const [name, setName] = useState(""); //console.log(value)
  const handleChangeInputName = useCallback((newValue) => {
    setName(newValue);
    if (newValue !== "") {
      setErrorName("");
    }
    if (!newValue) {
      setErrorName("Please enter your name.");
    }
  }, []);
  //title input
  const [errorTitle, setErrorTitle] = useState("");
  const [title, setTitle] = useState(""); //console.log(value)
  const handleChangeInputTitle = useCallback((newValue) => {
    setTitle(newValue);
    if (newValue !== "") {
      setErrorTitle("");
    }
    if (!newValue) {
      setErrorTitle("Please enter your title.");
    }
  }, []);

  //email input
  const [errorEmail, setErrorEmail] = useState("");
  const [email, setEmail] = useState(""); //console.log(value)
  const handleChangeInputEmail = useCallback((newValue) => {
    setEmail(newValue);
    if (newValue !== "") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(newValue)) {
        setErrorEmail("Please enter valid email address.");
      }
      if (pattern.test(newValue) === true) {
        setErrorEmail("");
      }
    }
  }, []);
  //messenge input
  const [errorMess, setErrorMess] = useState("");
  const [message, setMessage] = useState(""); //console.log(value)
  const handleChangeInputMessage = useCallback((newValue) => {
    setMessage(newValue);
    if (!newValue) {
      setErrorMess("Please enter your message.");
    }
    if (newValue !== "") {
      setErrorMess("");
    }
  }, []);
  //select rating input
  const [selectedRating, setSelectedRating] = useState("5");

  const handleSelectChange = useCallback(
    (value) => setSelectedRating(value),
    []
  );
  //validate
  function validate() {
    let isValid = true;
    if (!name) {
      isValid = false;
      setErrorName("Please enter your name.");
    }
    // if (!search) {
    //   isValid = false;
    // }

    if (!title) {
      isValid = false;
      setErrorTitle("Please enter your title.");
    }

    if (!message) {
      isValid = false;
      setErrorMess("Please enter your message.");
    }
    return isValid;
  }
  const rating = [
    { label: "1 stars", value: "1" },
    { label: "2 stars", value: "2" },
    { label: "3 stars", value: "3" },
    { label: "4 stars", value: "4" },
    { label: "5 stars", value: "5" },
  ];
  //upload image

  //DATE
  const today = moment(new Date()).format("YYYY-MM-DDTHH:mm");
  const [date, setDate] = useState(today);

  const handleChangeDate = useCallback((newValue) => setDate(newValue), []);

  //radio button recommend this product
  const [valueRadioRecommend, setvalueRadioRecommend] = useState(
    "yesRecommend"
  );
  const handleChangeRadioRecommend = useCallback(
    (_checked, newValue) => setvalueRadioRecommend(newValue),
    []
  );
  //radio button Purchased customers
  const [valueRadioPurchased, setValueRadioPurchased] = useState(
    "yesPurchased"
  );

  const handleChangeRadioPurchased = useCallback(
    (_checked, newValue) => setValueRadioPurchased(newValue),
    []
  );
  //radio button Featured review
  const [valueRadioFeatured, setValueRadioFeatured] = useState("yesFeatured");

  const handleChangeRadioFeatured = useCallback(
    (_checked, newValue) => setValueRadioFeatured(newValue),
    []
  );
  //radio button Publish this review
  const [valueRadioPublish, setValueRadioPublish] = useState("yesPublish");

  const handleChangeRadioPublish = useCallback(
    (_checked, newValue) => setValueRadioPublish(newValue),
    []
  );

  //end
  //form test
  const clearInput = () => {
    setSearch("");
    setName("");
    setTitle("");
    setEmail("");
    setMessage("");
    setSelectedRating("5");
    setFiles([]);
    setDate(today);
    setValueRadioPublish("yesPublish");
    setValueRadioPurchased("yesPurchased");
    setValueRadioFeatured("yesFeatured");
    setvalueRadioRecommend("yesRecommend");
    setErrorName("");
    setErrorEmail("");
    setErrorTitle("");
    setErrorMess("");
    setImage([]);
  };

  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleDrop = useCallback(
    async (_droppedFiles, acceptedFiles, rejectedFiles) => {
      await setFiles((files) => [...files, ...acceptedFiles]);

      setRejectedFiles(rejectedFiles);
      acceptedFiles.map((e) => {
        let reader = new window.FileReader();
        reader.readAsDataURL(e);
        reader.onload = function () {
          changeImage({ name: e.name, base: reader.result });
        };
      });
    },
    []
  );
  useEffect(() => {
    if (
      imageUpload.name &&
      imageUpload.base &&
      imageData.indexOf(imageUpload.name) === -1
    ) {
      imageData.push({
        name: imageUpload.name,
        base: imageUpload.base,
      });
    }
  }, [imageUpload]);

  // );
  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={window.URL.createObjectURL(file)}
          />
          <div>
            {file.name} <Caption>{file.size} bytes</Caption>
          </div>
        </Stack>
      ))}
    </Stack>
  );
  const errorMessage = hasError && (
    <Banner
      title="The following images couldn’t be uploaded:"
      status="critical"
    >
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (styleForm === "editForm") {
      handleChange();
      reloadListReview();
      await editReview({
        selectedProduct: search,
        valueName: name,
        valueTitle: title,
        valueEmail: email,
        valueMessage: message,
        selectedRating: selectedRating,
        valueRadioRecommend: valueRadioRecommend,
        valueRadioPurchased: valueRadioPurchased,
        valueRadioPublish: valueRadioPublish,
        valueRadioFeatured: valueRadioFeatured,
        valueDate: date,
        image: imageData,
        id: idReview,
      });
      getImageReview();
      clearDataInCollection();
      clearDataInProductTypes();
      resetArrProductImports();
      resetProductsImport();
      if (reloadPage == "reviewPage") {
        searchReview(
          valueSearch,
          offset,
          selected,
          type,
          vendor,
          idCollection,
          "",
          sort,
          limit
        );
        getCountAllReview(valueSearch, selected, type, vendor, idCollection);
      }
      if (reloadPage == "requestPage") {
        searchRequest(
          valueSearch,
          offset,
          selected,
          type,
          vendor,
          idCollection,
          "",
          sort,
          limit
        );
        getCountAllRequest(valueSearch, selected, type, vendor, idCollection);
      }
      if (productID) {
        getAllReviewProductInPage("", productID, offset);
        getImageReviewByProduct(productID);
        getProductsDetail(productID);
      }
      clearInput();
    } else {
      if (validate() === true) {
        handleChange();
        reloadListReview();
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
        // if (arrCheckedCollectionImport.length > 0) {
        //   const End = arrCheckedCollectionImport.length;
        //   const queue = new AQueue(End);
        //   for (let i = 0; i < End; i++) {
        //     queue.enqueue(arrCheckedCollectionImport[i]);
        //   }
        //   for (let j = 0; j < End; j++) {
        //     let shift = queue.dequeue();
        //     if (shift !== undefined) {
        //       await addReviewCollections({
        //         selectedProduct: search,
        //         idCollection: shift,
        //         valueName: name,
        //         valueTitle: title,
        //         valueEmail: email,
        //         valueMessage: message,
        //         selectedRating: selectedRating,
        //         valueRadioRecommend: valueRadioRecommend,
        //         valueRadioPurchased: valueRadioPurchased,
        //         valueRadioPublish: valueRadioPublish,
        //         valueRadioFeatured: valueRadioFeatured,
        //         valueDate: date,
        //         image: imageData,

        //       });
        //     }
        //     await updateCountReviewInCollection(shift);
        //   }
        //   getProductsSearch("", 0);
        //   getProductType();
        //   getCollections();
        //   if (reloadPage == "reviewPage") {
        //     searchReview("", 0);
        //     getCountAllReview("");
        //   }
        //   if (reloadPage == "requestPage") {
        //     searchRequest("", 0);
        //     getCountAllRequest("");
        //   }
        // }
        // if (arrCheckedProducts.length > 0) {
        // const End = arrCheckedProducts.length;
        // const queue = new AQueue(End);
        // for (let i = 0; i < End; i++) {
        //   queue.enqueue(arrCheckedProducts[i]);
        // }
        // for (let j = 0; j < End; j++) {
        //   let shift = queue.dequeue();
        //   if (shift !== undefined) {
        await addReviewProducts({
          selectedProduct: search,
          valueName: name,
          valueTitle: title,
          valueEmail: email,
          valueMessage: message,
          selectedRating: selectedRating,
          valueRadioRecommend: valueRadioRecommend,
          valueRadioPurchased: valueRadioPurchased,
          valueRadioPublish: valueRadioPublish,
          valueRadioFeatured: valueRadioFeatured,
          valueDate: date,
          image: imageData,
          arrayCollection: arrCheckedCollectionImport,
          arrayProduct: arrCheckedProducts,
          arrayProductType: arrCheckedProductTypeImport,
        });
        getProductsSearch("", 0);
        getProductType();
        getCollections();
        if (reloadPage == "reviewPage") {
          searchReview("", 0);
          getCountAllReview("");
          getImageReview();
          loadDataTable();
        }
        if (reloadPage == "requestPage") {
          searchRequest("", 0);
          getCountAllRequest("");
          getImageReview();
          loadDataTable();
        }
        // }
        //   await updateCountReview(shift);
        // }
        // getProductsSearch("", 0);
        // getProductType();
        // getCollections();
        // if (reloadPage == "reviewPage") {
        //   searchReview("", 0);
        //   getCountAllReview("");
        // }
        // if (reloadPage == "requestPage") {
        //   searchRequest("", 0);
        //   getCountAllRequest("");
        // }
        // }

        // if (arrCheckedProductTypeImport.length > 0) {
        //   const End = arrCheckedProductTypeImport.length;
        //   const queue = new AQueue(End);
        //   for (let i = 0; i < End; i++) {
        //     queue.enqueue(arrCheckedProductTypeImport[i]);
        //   }
        //   for (let j = 0; j < End; j++) {
        //     let shift = queue.dequeue();
        //     if (shift !== undefined) {
        //       await addReviewProductTypes({
        //         selectedProduct: search,
        //         idProductType: shift,
        //         valueName: name,
        //         valueTitle: title,
        //         valueEmail: email,
        //         valueMessage: message,
        //         selectedRating: selectedRating,
        //         valueRadioRecommend: valueRadioRecommend,
        //         valueRadioPurchased: valueRadioPurchased,
        //         valueRadioPublish: valueRadioPublish,
        //         valueRadioFeatured: valueRadioFeatured,
        //         valueDate: date,
        //         image: imageData,
        //       });
        //     }
        //     await updateCountReviewInType(shift);
        //   }
        //   getProductsSearch("", 0);
        //   getProductType();
        //   getCollections();
        //   if (reloadPage == "reviewPage") {
        //     searchReview("", 0);
        //     getCountAllReview("");
        //   }
        //   if (reloadPage == "requestPage") {
        //     searchRequest("", 0);
        //     getCountAllRequest("");
        //   }
        // }
        // getPublishReviews();
        // getUnPublishReviews();
        // getCountAllReviews();
        // getCountProductNoReview();
        // getProductsSearch("", offset);
        clearInput();
        setDisableSave(false);

        getConnectCollectionReviews();
        getConnectProductTypeReviews();
        getConnectProductReviews();
        clearDataInCollection();
        clearDataInProductTypes();
        resetArrProductImports();
        resetProductsImport();
      }
    }
  };
  const handleClose = useCallback(() => {
    clearDataInProductTypes();
    resetArrProductImports();
    resetProductsImport();
    resetImages();
    clearInput();
    getConnectCollectionReviews();
    getConnectProductTypeReviews();
    getConnectProductReviews();
    clearDataInCollection();
    setDisableSave(true);
    if (productID) {
      getImageReviewByProduct(productID);
    }

    setActive((active) => !active);
  });
  return (
    <div style={{ float: floatStyle }}>
      <Modal
        large
        limitHeight={false}
        activator={activator}
        open={active}
        onClose={handleClose}
        title="Create new review"
        primaryAction={{
          content: "Save",
          onAction: handleSubmit,
          disabled: disableSave,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleClose,
          },
        ]}
      >
        <Modal.Section>
          <div className="padding">
            <div className="marginBottom">
              <Layout>
                <Layout.Section oneThird>
                  <div ref={wrapperRef} className="div-autocomplete">
                    <p id="title-autocomplete">Choose product</p>
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
                                  key={i}
                                  onClick={() =>
                                    addProduct(
                                      v.products_id,
                                      arrCheckedProducts,
                                      v.products_title
                                    )
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
                  <div style={{ marginTop: "5px" }}>
                    <Scrollable
                      shadow
                      style={{ maxHeight: "100px", overflow: "auto" }}
                    >
                      {arrProductImports.length !== 0 &&
                        arrProductImports.map((e, i) => (
                          <div
                            key={i}
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                              display: "inline-block",
                            }}
                          >
                            <Tag
                              onRemove={() =>
                                handleRemoveTagProduct(
                                  e.products_id,
                                  e.products_title
                                )
                              }
                            >
                              {e.products_title}
                            </Tag>
                          </div>
                        ))}
                    </Scrollable>
                  </div>
                </Layout.Section>
                <Layout.Section oneThird>
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
                                  key={i}
                                  onClick={() =>
                                    addCollection(
                                      v.collection_id,
                                      arrCheckedCollectionImport,
                                      v.title
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
                  <div>
                    <Scrollable
                      shadow
                      style={{ maxHeight: "100px", overflow: "auto" }}
                    >
                      {arrCollectionImports.length !== 0 &&
                        arrCollectionImports.map((e, i) => (
                          <div key={i} style={{ marginBottom: "2px" }}>
                            <Tag
                              onRemove={() =>
                                handleRemoveTagCollection(
                                  e.collection_id,
                                  e.title
                                )
                              }
                            >
                              {e.title}
                            </Tag>
                          </div>
                        ))}
                    </Scrollable>
                  </div>
                </Layout.Section>
                <Layout.Section oneThird>
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
                                  .indexOf(searchProductTypes.toLowerCase()) >
                                -1
                            )
                            .map((v, i) => {
                              return (
                                <div
                                  key={i}
                                  onClick={() =>
                                    addProductTypes(
                                      v.id,
                                      arrCheckedProductTypeImport,
                                      v.product_type
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
                  <div>
                    <Scrollable
                      shadow
                      style={{ maxHeight: "100px", overflow: "auto" }}
                    >
                      {arrProductTypeImport.length !== 0 &&
                        arrProductTypeImport.map((e, i) => (
                          <div key={i} style={{ marginBottom: "2px" }}>
                            <Tag
                              onRemove={() =>
                                handleRemoveTagProductType(e.id, e.product_type)
                              }
                            >
                              {e.product_type}
                            </Tag>
                          </div>
                        ))}
                    </Scrollable>
                  </div>
                </Layout.Section>
              </Layout>
            </div>
            <div className="marginBottom">
              <Layout>
                <Layout.Section oneHalf>
                  <TextField
                    label="Title"
                    value={title}
                    onChange={handleChangeInputTitle}
                  />
                  <InlineError message={errorTitle} fieldID="myFieldID" />
                </Layout.Section>
                <Layout.Section oneHalf>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={handleChangeInputName}
                  />
                  <InlineError message={errorName} fieldID="myFieldID" />
                </Layout.Section>
              </Layout>
            </div>
            <div className="marginBottom">
              <Layout>
                <Layout.Section oneHalf>
                  <TextField
                    label="Email"
                    value={email}
                    onChange={handleChangeInputEmail}
                  />
                  <InlineError message={errorEmail} fieldID="myFieldID" />
                </Layout.Section>

                <Layout.Section oneHalf>
                  <Select
                    label="Rating"
                    options={rating}
                    onChange={handleSelectChange}
                    value={selectedRating}
                  />
                </Layout.Section>
              </Layout>
              <Layout>
                <Layout.Section>
                  <TextField
                    label="Message"
                    value={message}
                    onChange={handleChangeInputMessage}
                    multiline={4}
                  />
                  <InlineError message={errorMess} fieldID="myFieldID" />
                </Layout.Section>
              </Layout>
            </div>
            <div className="marginBottom">
              <Layout>
                <Layout.Section oneHalf>
                  <Stack vertical>
                    {errorMessage}
                    <DropZone
                      label="Add photo"
                      accept="image/*"
                      type="image"
                      name="upload"
                      onDrop={handleDrop}
                    >
                      {uploadedFiles}
                      {fileUpload}
                    </DropZone>
                  </Stack>
                </Layout.Section>
              </Layout>
            </div>
            {styleForm === "editForm" && (
              <div className="marginBottom" style={{ display: "flex" }}>
                {imageInReview.map((e) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "120px",
                      marginRight: "20px",
                    }}
                  >
                    <img
                      width="120px"
                      height="129px"
                      style={{ border: "1px solid rgb(191 203 214)" }}
                      src={e.url}
                    ></img>
                    {/* <Button>Delete</Button> */}
                    <ModalDeleteImage id={e.id} idReview={idReview} />
                  </div>
                ))}
              </div>
            )}
            <div className="marginBottom">
              <Layout>
                <Layout.Section oneHalf>
                  <TextField
                    label="Publish date"
                    value={date}
                    onChange={handleChangeDate}
                    type="datetime-local"
                  />
                </Layout.Section>
                <Layout.Section oneHalf>
                  <p>Recommend this product</p>
                  <div style={{ marginTop: "15px" }}>
                    <Stack>
                      <RadioButton
                        label="Yes"
                        checked={valueRadioRecommend === "yesRecommend"}
                        id="yesRecommend"
                        name="yesnoRecommend"
                        value="yesRecommend"
                        onChange={handleChangeRadioRecommend}
                      />
                      <RadioButton
                        label="No"
                        id="noRecommend"
                        name="yesnoRecommend"
                        value="noRecommend"
                        checked={valueRadioRecommend === "noRecommend"}
                        onChange={handleChangeRadioRecommend}
                      />
                    </Stack>
                  </div>
                </Layout.Section>
              </Layout>
            </div>
            <div className="marginBottom">
              <Layout>
                <Layout.Section oneHalf>
                  <p>Purchased customers</p>
                  <div style={{ marginTop: "15px" }}>
                    <Stack>
                      <RadioButton
                        label="Yes"
                        checked={valueRadioPurchased === "yesPurchased"}
                        id="yesPurchased"
                        name="yesnoPurchased"
                        value="yesPurchased"
                        onChange={handleChangeRadioPurchased}
                      />
                      <RadioButton
                        label="No"
                        id="noPurchased"
                        name="yesnoPurchased"
                        value="noPurchased"
                        checked={valueRadioPurchased === "noPurchased"}
                        onChange={handleChangeRadioPurchased}
                      />
                    </Stack>
                  </div>
                </Layout.Section>
                <Layout.Section oneHalf>
                  <p>Publish this review</p>
                  <div style={{ marginTop: "15px" }}>
                    <Stack>
                      <RadioButton
                        label="Yes"
                        checked={valueRadioPublish === "yesPublish"}
                        id="yesPublish"
                        name="yesnoPublish"
                        value="yesPublish"
                        onChange={handleChangeRadioPublish}
                      />
                      <RadioButton
                        label="No"
                        id="noPublish"
                        name="yesnoPublish"
                        value="noPublish"
                        checked={valueRadioPublish === "noPublish"}
                        onChange={handleChangeRadioPublish}
                      />
                    </Stack>
                  </div>
                </Layout.Section>
              </Layout>
            </div>
            <div className="marginBottom">
              <Layout>
                <Layout.Section oneHalf>
                  <p>Featured review</p>
                  <div style={{ marginTop: "15px" }}>
                    <Stack>
                      <RadioButton
                        label="Yes"
                        checked={valueRadioFeatured === "yesFeatured"}
                        id="yesFeatured"
                        name="yesnoFeatured"
                        value="yesFeatured"
                        onChange={handleChangeRadioFeatured}
                      />
                      <RadioButton
                        label="No"
                        id="noFeatured"
                        name="yesnoFeatured"
                        value="noFeatured"
                        checked={valueRadioFeatured === "noFeatured"}
                        onChange={handleChangeRadioFeatured}
                      />
                    </Stack>
                  </div>
                </Layout.Section>
              </Layout>
            </div>
          </div>
          {loadingReviews && <Loading />}
        </Modal.Section>
      </Modal>
    </div>
  );
};
// export default ModalCreateReview;
ModalCreateReview.propTypes = {
  // addProduct: PropTypes.func.isRequired,
  reviews: PropTypes.object.isRequired,
  getProductsSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  reviews: state.reviews,
  url: state.importReviewUrl,
  collections: state.collections,
  productTypes: state.productTypes,
  listReviews: state.listReviews,
});

export default connect(mapStateToProps, {
  getProductsSearch,
  getCountAllReviews,
  addReviewProducts,
  updateCountReview,
  getPublishReviews,
  getUnPublishReviews,
  getCountProductNoReview,
  reloadListReview,
  searchReview,
  changeProductsImport,
  getArrProductsImport,
  changeCheckedCollectionImport,
  getArrCollectionsImport,
  clearDataInCollection,
  changeCheckedProductTypesImport,
  getArrProductTypesImport,
  clearDataInProductTypes,
  addReviewCollections,
  addReviewProductTypes,
  getReviewEdit,
  getImageInReview,
  getImageReview,
  editReview,
  getAllReviewProductInPage,
  getImageReviewByProduct,
  getProductsDetail,
  unsubscribeProduct,
  unsubscribeCollection,
  unsubscribeProductType,
  subscribeProduct,
  subscribeProductType,
  subscribeCollection,
  resetArrProductImports,
  resetProductsImport,
  updateCountReviewInType,
  getProductType,
  getCollections,
  updateCountReviewInCollection,
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  getConnectProductReviews,
  searchRequest,
  getCountAllReview,
  getCountAllRequest,
  changeImage,
  resetImages,
  loadDataTable,
})(ModalCreateReview);
//dasua
