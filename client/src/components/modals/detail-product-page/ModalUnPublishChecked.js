import React, { useCallback, useState, useEffect } from "react";
import { Button, TextContainer, Modal } from "@shopify/polaris";

import {
  getProductsDetail,
  getAllReviewProductInPage,
  getAllReviewProduct,
  reload,
  unPublishReviewChecked,
} from "../../../actions/reviews";
import { connect } from "react-redux";
const ModalUnPublishChecked = ({
  idReviewChecked,
  setStatusChecked,
  idProduct,
  offset,
  getProductsDetail,
  getAllReviewProductInPage,
  getAllReviewProduct,
  reload,
  unPublishReviewChecked,
}) => {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleSubmit = useCallback(async () => {
    handleChange();
    reload();
    await unPublishReviewChecked(idReviewChecked);
    getProductsDetail(idProduct);
    getAllReviewProductInPage("", idProduct, offset);
    getAllReviewProduct(idProduct);
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
      Unpublish selected reviews
    </button>
  );

  return (
    <div>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Unpublish selected reviews?"
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
            <p>Are you sure you want to unpublish selected reviews?</p>
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
  getProductsDetail,
  getAllReviewProductInPage,
  getAllReviewProduct,
  reload,
  unPublishReviewChecked,
})(ModalUnPublishChecked);
