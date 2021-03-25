import axios from "axios";
import config from "../../config/config";
export default async function callApi(method, data, enpoint = "services.php") {
  if (method === "get") {
    data.urlParams = config.urlParams;
    data.shop = config.shop;
    return await axios
      .get(`${config.rootLink}${enpoint}`, {
        params: data,
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    data.append("urlParams", config.urlParams);
    data.append("shop", config.shop);
    return await axios
      .post(config.rootLink + "services.php", data)
      .catch(function (error) {
        console.log(error);
      });
  }
}
