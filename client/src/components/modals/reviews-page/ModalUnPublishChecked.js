import React, { useCallback, useState, useEffect } from "react";
import { Button, TextContainer, Modal } from "@shopify/polaris";

import {
  // getProductsDetail,
  // getAllReviewProductInPage,
  updateCountReview,
  getProductsSearch,
  reload,
  unPublishReviewProductsChecked,
  getPublishReviews,
  getUnPublishReviews,
  // publishReviewChecked,
} from "../../../actions/reviews";
import { connect } from "react-redux";
const ModalUnPublishChecked = ({
  arrIdProducts,
  setStatusChecked,
  getProductsSearch,
  selected,
  offset,
  reload,
  getPublishReviews,
  getUnPublishReviews,
  unPublishReviewProductsChecked,
  // valueSearch,
}) => {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleSubmit = useCallback(async () => {
    handleChange();
    reload();
    await unPublishReviewProductsChecked(arrIdProducts);
    getPublishReviews();
    getUnPublishReviews();

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
  });
  const activator = (
    <button id="button-function-detail" onClick={handleChange}>
      UnPublish all reviews in selected products
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
              Are you sure you want to Unpublish all reviews in products
              selected?
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
  updateCountReview,
  reload,
  unPublishReviewProductsChecked,
  getPublishReviews,
  getUnPublishReviews,
  getProductsSearch,
})(ModalUnPublishChecked);
