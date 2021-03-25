import React, { Component, useState, useCallback, useEffect } from "react";
import { Button, TextContainer, Modal, Icon } from "@shopify/polaris";
import { deleteImage, getImageInReview } from "../../../actions/reviews";
import {
  reloadListReview,
  // searchReview,
  // getImageReview,
} from "../../../actions/listReviews";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const ModalDeleteImage = ({
  id,
  reloadListReview,
  idReview,
  deleteImage,
  getImageInReview,
  // getImageReview,
  reviews: { loading },
}) => {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleClose = (e) => {
    setActive((active) => !active);
  };
  const handleSubmit = async (e) => {
    handleChange();
    reloadListReview();
    await deleteImage(id);
    // getImageReview();
    getImageInReview(idReview);
  };

  const activator = (
    <Button plain destructive onClick={handleChange}>
      Delete
    </Button>
  );

  return (
    <div style={{ marginBottom: "20px" }}>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Delete this image?"
        primaryAction={{
          content: "Agree",
          onAction: handleSubmit,
          destructive: true,
        }}
        secondaryActions={[
          {
            content: "Disagree",
            onAction: handleClose,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>Are you sure you want to delete this image?</p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
};
ModalDeleteImage.propTypes = {
  reloadListReview: PropTypes.func.isRequired,
  reviews: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  reviews: state.importReviewUrl,
});

export default connect(mapStateToProps, {
  reloadListReview,
  deleteImage,
  getImageInReview,
  // getImageReview,
})(ModalDeleteImage);
