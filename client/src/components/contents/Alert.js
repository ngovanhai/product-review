import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Toast } from "@shopify/polaris";
const Alert = ({ alerts }) => {
  const [active, setActive] = useState(true);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  return (
    <div>
      {alerts !== null &&
        active &&
        alerts.length > 0 &&
        alerts.map((alert, index) => (
          <Toast key={index} content={alert.msg} onDismiss={toggleActive} />
        ))}
    </div>
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
  reviews: state.reviews,
});

export default connect(mapStateToProps)(Alert);
