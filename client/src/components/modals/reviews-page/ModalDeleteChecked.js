import React, { useCallback, useState, useEffect } from "react";
import { Button, TextContainer, Modal } from "@shopify/polaris";

import {
  deleteImageProductsChecked,
  getProductsSearch,
  reload,
  deleteReviewProductsChecked,
  getCountAllReviews,
  getCountProductNoReview,
  getPublishReviews,
  getUnPublishReviews,
} from "../../../actions/reviews";
import { connect } from "react-redux";
const ModalDeleteChecked = ({
  arrIdProducts,
  setStatusChecked,
  getProductsSearch,
  deleteReviewProductsChecked,
  deleteImageProductsChecked,
  selected,
  offset,
  vendor,
  tags,
  type,
  idCollection,
  reload,
  valueSearch,
  getCountAllReviews,
  getCountProductNoReview,
  getPublishReviews,
  getUnPublishReviews,
}) => {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleSubmit = useCallback(async () => {
    handleChange();
    reload();
    await deleteReviewProductsChecked(arrIdProducts);
    await deleteImageProductsChecked(arrIdProducts);
    getProductsSearch(
      valueSearch,
      offset,
      selected,
      vendor,
      tags,
      idCollection,
      type
    );
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
    getCountAllReviews();
    getCountProductNoReview();
    getPublishReviews();
    getUnPublishReviews();
  });
  const activator = (
    <button id="button-function-detail" onClick={handleChange}>
      Delete all reviews in selected products
    </button>
  );

  return (
    <div>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Publish selected reviews?"
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
              Are you sure you want to delete all reviews in products selected?
            </p>
            <br></br>
            <p>
              Note: The reviews in the Collection / Product Type will not be
              deleted (if you want to delete the reviews in the 2 items above,
              go to detail product page or Review page)
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
  deleteImageProductsChecked,
  reload,
  deleteReviewProductsChecked,
  getProductsSearch,
  getCountAllReviews,
  getCountProductNoReview,
  getPublishReviews,
  getUnPublishReviews,
})(ModalDeleteChecked);
