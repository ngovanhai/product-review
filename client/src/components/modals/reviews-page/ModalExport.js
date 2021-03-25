import React, { useCallback, useState } from "react";
import { Button, TextContainer, Modal } from "@shopify/polaris";
import { ExportMinor } from "@shopify/polaris-icons";
import axios from "axios";
import config from "../../../config/config";
import $ from "jquery";
export default function ModalExport() {
  const [active, setActive] = useState(false);
  const shop = config.shop;

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleSubmit = useCallback(() => {
    axios
      .get(config.rootLink + `/backend/server.php`, {
        params: {
          shop: shop,
          exportReviewsData: "",
        },
      })
      .then((res) => {
        if (res.data.success > 0) {
          // $("<a id='export-review-download'></a>").insertAfter(
          //   "#export-review-button"
          // );
          $("#export-review-download").attr("href", res.data.url);
          $("#export-review-download").attr("download", res.data.url);
          $("#export-review-download")[0].click();
          $("#export-review-download").remove();
          setTimeout(function () {
            axios
              .get(config.rootLink + `/backend/server.php`, {
                params: {
                  shop: shop,
                  deleteExportReviewsFile: "",
                  url: res.data.url,
                },
              })
              .then((result) => {
              });
          }, 10000);
        } else {
          // ShopifyApp.flashError("Export file error!");
        }
        handleChange();
      });
  }, [active]);

  const activator = (
    <Button disabled outline onClick={handleChange} size="slim">
      Export
    </Button>
  );

  return (
    <div style={{ float: "right", marginRight: "10px" }}>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Export product reviews?"
        primaryAction={{
          content: "Agree",
          onAction: handleSubmit,
        }}
        secondaryActions={[
          {
            content: "Disagree",
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <a id="export-review-download"></a>
            {/* <input type="hidden" id="export-review-button"></input> */}
            <p>
              Are you sure you want to export all product reviews to Excel file?
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}
