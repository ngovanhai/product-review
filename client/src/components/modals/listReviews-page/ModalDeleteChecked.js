import React, { useCallback, useState, useEffect } from "react";
import { Button, TextContainer, Modal } from "@shopify/polaris";

import { deleteReviewChecked } from "../../../actions/reviews";
import {
  reloadListReview,
  searchReview,
  searchRequest,
} from "../../../actions/listReviews";

import { connect } from "react-redux";
const ModalDeleteChecked = ({
  deleteReviewChecked,
  idReviewChecked,
  setStatusChecked,
  offset,
  reloadListReview,
  flagReviewChecked,
  valueSearch,
  idCollection,
  vendor,
  type,
  searchReview,
  selected,
  reloadPage,
  searchRequest,
}) => {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleSubmit = useCallback(async () => {
    handleChange();
    reloadListReview();
    await deleteReviewChecked(idReviewChecked);
    if (reloadPage == "reviewPage") {
      searchReview(valueSearch, offset, selected, type, vendor, idCollection);
    }
    if (reloadPage == "requestPage") {
      searchRequest(valueSearch, offset, selected, type, vendor, idCollection);
    }

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
  });
  const activator = (
    <button id="button-function-detail" onClick={handleChange}>
      Delete selected reviews
    </button>
  );

  return (
    <div>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Delete selected reviews?"
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
              Are you sure you want to delete selected reviews? This action
              cannot be undone.
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
  reloadListReview,
  deleteReviewChecked,
  searchReview,
  searchRequest,
})(ModalDeleteChecked);
