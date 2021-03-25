import React, { useCallback, useState, useEffect } from "react";
import config from "../../../config/config";
import $ from "jquery";
import { connect } from "react-redux";
import { Button, TextContainer, Modal, TextStyle } from "@shopify/polaris";
import {
  getCountAllReviews,
  getProductsSearch,
  getCountProductNoReview,
  reload,
  getPublishReviews,
  getUnPublishReviews,
  importReviewExcel,
} from "../../../actions/reviews";
import {
  searchReview,
  reloadListReview,
  searchRequest,
} from "../../../actions/listReviews";
const ModalImport = ({
  searchReview,
  reloadListReview,
  offset,
  getCountAllReviews,
  getProductsSearch,
  getCountProductNoReview,
  reload,
  getPublishReviews,
  getUnPublishReviews,
  importReviewExcel,
  reloadPage,
  searchRequest,
}) => {
  const [active, setActive] = useState(false);
  // const shop = localStorage.getItem("shop");

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleImport = useCallback(async () => {
    handleChange();
    reload();
    reloadListReview();

    const fd = new FormData();
    fd.append("importFile", $('input[name$="file"]')[0].files[0]);
    fd.append("shop", config.shop);
    fd.append("action", "importExcel");
    // await axios.post(config.rootLink + "/backend/server.php", fd);
    await importReviewExcel(fd);
    getCountAllReviews();
    getPublishReviews();
    getUnPublishReviews();
    getProductsSearch("", offset);
    getCountProductNoReview();
    if (reloadPage == "reviewPage") {
      searchReview("", 0);
    }
    if (reloadPage == "requestPage") {
      searchRequest("", 0);
    }
  });

  const activator = (
    <Button outline size="slim" onClick={handleChange}>
      Import
    </Button>
  );
  return (
    <div style={{ float: "right", marginRight: "10px" }}>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Import reviews"
        primaryAction={{
          content: "Import",
          onAction: handleImport,
        }}
        secondaryActions={[
          {
            content: "Close",
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <form method="POST" enctype="multipart/form-data">
              <input type="file" name="file"></input>
            </form>
            <h1 style={{ fontWeight: "bold", fontSize: "1.8rem" }}>
              Maximum 2000 lines in file can be import
            </h1>
            <p>
              We suggested you to split the file into smaller ones to making the
              debug of the reviews, a little easier. <br></br>Download our{" "}
              <a
                href={config.rootLink + "/reviews_import.xlsx"}
                download={config.rootLink + "/reviews_import.xlsx"}
              >
                .xlsx template
              </a>{" "}
              to see an example of the required format. <br></br> Go to{" "}
              <a
                href="https://apps.omegatheme.com/customer-reviews/guide.html"
                target="_blank"
              >
                here
              </a>{" "}
              to see <b>How to get product's handle for importing data.</b>
            </p>
            <br></br>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => ({
  reviews: state.reviews,
});

export default connect(mapStateToProps, {
  getCountAllReviews,
  getProductsSearch,
  getCountProductNoReview,
  reload,
  reloadListReview,
  getPublishReviews,
  getUnPublishReviews,
  importReviewExcel,
  searchReview,
  searchRequest,
})(ModalImport);
