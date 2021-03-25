import React, { useCallback, useState, useEffect } from "react";
import { Button, TextContainer, Modal } from "@shopify/polaris";
import { ExportMinor } from "@shopify/polaris-icons";
import { ViewMinor, EditMinor, DeleteMinor } from "@shopify/polaris-icons";

import {
  deleteOneReview,
  // getProductsDetail,
  // getAllReviewProductInPage,
  // updateCountReview,
  // getAllReviewProduct,
} from "../../../actions/reviews";
import {
  reloadListReview,
  searchReview,
  searchRequest,
} from "../../../actions/listReviews";

import PropTypes from "prop-types";
import { connect } from "react-redux";
const ModalDeleteReview = ({
  id,
  selected,
  // idProduct,
  offset,
  deleteOneReview,
  // getProductsDetail,
  // getAllReviewProductInPage,
  // updateCountReview,
  // getAllReviewProduct,
  reloadListReview,
  valueSearch,
  idCollection,
  vendor,
  type,
  searchReview,
  searchRequest,
  reloadPage,
  reviews: { deleteImage },
}) => {
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleSubmit = useCallback(async () => {
    handleChange();
    reloadListReview();
    await deleteOneReview(id);
    if (reloadPage == "reviewPage") {
      searchReview(valueSearch, offset, selected, type, vendor, idCollection);
    }
    if (reloadPage == "requestPage") {
      searchRequest(valueSearch, offset, selected, type, vendor, idCollection);
    }
    // getProductsDetail(idProduct);
    // getAllReviewProductInPage("", idProduct, offset);
    // updateCountReview(idProduct);
    // getAllReviewProduct(idProduct);
  });
  const activator = (
    <Button id="btn-outline" icon={DeleteMinor} onClick={handleChange}></Button>
  );

  return (
    <div style={{ float: "left" }}>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Delete this reviews?"
        secondaryActions={{
          content: "Disagree",
          onAction: handleChange,
        }}
        primaryAction={[
          {
            content: "Agree",
            onAction: handleSubmit,
            destructive: true,
            textAlign: "left",
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Are you sure you want to delete this reviews? This action cannot
              be undone.
            </p>
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
  deleteOneReview,
  searchReview,
  reloadListReview,
  searchRequest,
})(ModalDeleteReview);
