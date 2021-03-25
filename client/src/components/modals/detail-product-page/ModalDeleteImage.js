import React, { Component, useState, useCallback, useEffect } from "react";
import { Button, TextContainer, Modal, Icon } from "@shopify/polaris";
import {
  reload,
  deleteImage,
  getImageInReview,
} from "../../../actions/reviews";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const ModalDeleteImage = ({
  id,
  reload,
  idReview,
  deleteImage,
  getImageInReview,
  reviews: { loading },
}) => {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleClose = (e) => {
    setActive((active) => !active);
  };
  const handleSubmit = async (e) => {
    handleChange();
    reload();
    await deleteImage(id);
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
  reload: PropTypes.func.isRequired,
  reviews: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  reviews: state.importReviewUrl,
});

export default connect(mapStateToProps, {
  reload,
  deleteImage,
  getImageInReview,
})(ModalDeleteImage);
