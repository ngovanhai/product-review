import React, { useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../../../config/config";
import {
  Button,
  TextContainer,
  Modal,
  Tag,
  Layout,
  Scrollable,
} from "@shopify/polaris";
import {
  changeCheckedCollectionImport,
  getArrCollectionsImport,
  clearDataInCollection,
} from "../../../actions/collections";
import {
  changeCheckedProductTypesImport,
  getArrProductTypesImport,
  clearDataInProductTypes,
} from "../../../actions/productTypes";
import { getArrProductsImport } from "../../../actions/importUrl";
import {
  unsubscribeProduct,
  unsubscribeCollection,
  unsubscribeProductType,
  subscribeProduct,
  subscribeProductType,
  subscribeCollection,
  changeProductsImport,
  clearArrCheckedReview,
} from "../../../actions/reviews";
import {
  reloadListReview,
  searchReview,
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  searchRequest,
} from "../../../actions/listReviews";
import { connect } from "react-redux";
const ModalAssignChecked = ({
  reloadPage,
  searchRequest,
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  clearArrCheckedReview,
  clearDataInProductTypes,
  clearDataInCollection,
  getArrProductTypesImport,
  changeCheckedProductTypesImport,
  getArrCollectionsImport,
  changeCheckedCollectionImport,
  changeProductsImport,
  getArrProductsImport,
  unsubscribeProduct,
  unsubscribeCollection,
  unsubscribeProductType,
  subscribeProduct,
  subscribeProductType,
  subscribeCollection,
  //////
  idReviewChecked,
  setStatusChecked,
  idProduct,
  offset,
  reloadListReview,
  valueSearch,
  idCollection,
  vendor,
  type,
  searchReview,
  selected,
  ///
  url: { arrProductImports },
  reviews: { arrCheckedProducts, arrCheckedReview },
  productTypes: { arrCheckedProductTypeImport, arrProductTypeImport },
  collections: { arrCheckedCollectionImport, arrCollectionImports },
}) => {
  const shop = config.shop;

  const [active, setActive] = useState(false);
  const [display, setDisplay] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };
  // const setPokeDex = (poke, id) => {
  //   setIdProduct(id);
  //   setSearch(poke);
  //   setDisplay(false);
  //   setDisableSave(false);
  // };
  const addProduct = async (productId, arr, title) => {
    if (window.confirm("Subscribe from review with " + title + " product!")) {
      // await subscribeProduct({ idReview: idReview, idProduct: productId });
      // if (arr.indexOf(productId) == -1) {
      //   arr.push(productId);
      // }
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
  useEffect(() => {}, []);
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
    if (arr.indexOf(collectionID) == -1) {
      arr.push(collectionID);
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
      const End = arrCheckedReview.length;
      const queue = new AQueue(End);
      for (let i = 0; i < End; i++) {
        queue.enqueue(arrCheckedReview[i]);
      }
      for (let j = 0; j < End; j++) {
        let shift = queue.dequeue();
        if (shift !== undefined) {
          await subscribeCollection({
            idReview: shift,
            idCollection: collectionID,
          });
        }
      }
      await changeCheckedCollectionImport(arr);
      getArrCollectionsImport(arr);
      setDisplayCollection(false);
      setDisableSave(false);
    }
  };

  const handleRemoveTagProduct = async (productId, title) => {
    if (window.confirm("Unsubscribe from review with " + title + " product!")) {
      // await unsubscribeProduct({ idReview: idReview, idProduct: productId });
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
    if (
      window.confirm("Unsubscribe from review with " + title + " collection!")
    ) {
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
      const End = arrCheckedReview.length;
      const queue = new AQueue(End);
      for (let i = 0; i < End; i++) {
        queue.enqueue(arrCheckedReview[i]);
      }
      for (let j = 0; j < End; j++) {
        let shift = queue.dequeue();
        if (shift !== undefined) {
          await unsubscribeCollection({
            idReview: shift,
            idCollection: collectionID,
          });
        }
      }
      // await unsubscribeCollection({
      //   idReview: idReview,
      //   idCollection: collectionID,
      // });
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
    if (
      window.confirm("Unsubscribe from review with " + title + " product type!")
    ) {
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
      const End = arrCheckedReview.length;
      const queue = new AQueue(End);
      for (let i = 0; i < End; i++) {
        queue.enqueue(arrCheckedReview[i]);
      }
      for (let j = 0; j < End; j++) {
        let shift = queue.dequeue();
        if (shift !== undefined) {
          await unsubscribeProductType({
            idReview: shift,
            idProductType: productTypeId,
          });
        }
      }
      // await unsubscribeProductType({
      //   idReview: idReview,
      //   idProductType: productTypeId,
      // });
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
    if (arr.indexOf(productTypeID) == -1) {
      arr.push(productTypeID);
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
      const End = arrCheckedReview.length;
      const queue = new AQueue(End);
      for (let i = 0; i < End; i++) {
        queue.enqueue(arrCheckedReview[i]);
      }
      for (let j = 0; j < End; j++) {
        let shift = queue.dequeue();
        if (shift !== undefined) {
          await subscribeProductType({
            idReview: shift,
            idProductType: productTypeID,
          });
        }
      }
      await changeCheckedProductTypesImport(arr);
      getArrProductTypesImport(arr);
      setDisplayProductTypes(false);
      setDisableSave(false);
    }
  };
  //end complete
  const handleClose = useCallback(() => {
    setActive(!active);
    var checkboxes = document.getElementsByName("nameReview[]");
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
    getConnectCollectionReviews();
    getConnectProductTypeReviews();
    setStatusChecked();
    clearDataInCollection();
    clearDataInProductTypes();
    clearArrCheckedReview();
  });
  const handleChange = useCallback(() => {
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
  const handleSubmit = useCallback(async () => {
    handleChange();
    reloadListReview();
    // await publishReviewChecked(idReviewChecked);
    searchReview(valueSearch, offset, selected, type, vendor, idCollection);
    var checkboxes = document.getElementsByName("nameReview[]");
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
    clearDataInCollection();
    clearDataInProductTypes();
    clearArrCheckedReview();
  });
  const activator = (
    <button id="button-function-detail" onClick={handleChange}>
      Assign to Collections, Product types
    </button>
  );

  return (
    <div>
      <Modal
        activator={activator}
        open={active}
        onClose={handleClose}
        title="Assign selected reviews"
        secondaryActions={{
          content: "Close",
          onAction: handleClose,
        }}
      >
        <Modal.Section>
          <TextContainer>
            <div className="marginBottom">
              <Layout>
                {/* <Layout.Section oneThird>
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
                </Layout.Section> */}
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
                      style={{
                        maxHeight: "100px",
                        overflow: "auto",
                        height: "300px",
                      }}
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
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => ({
  reviews: state.reviews,
  productTypes: state.productTypes,
  collections: state.collections,
  url: state.importReviewUrl,
});

export default connect(mapStateToProps, {
  reloadListReview,
  searchReview,
  unsubscribeProduct,
  unsubscribeCollection,
  unsubscribeProductType,
  subscribeProduct,
  subscribeProductType,
  subscribeCollection,
  changeProductsImport,
  getArrProductsImport,
  changeCheckedCollectionImport,
  getArrCollectionsImport,
  changeCheckedProductTypesImport,
  getArrProductTypesImport,
  clearDataInCollection,
  clearDataInProductTypes,
  clearArrCheckedReview,
  getConnectCollectionReviews,
  getConnectProductTypeReviews,
  // resetArrProductImports
})(ModalAssignChecked);
