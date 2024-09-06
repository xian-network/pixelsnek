import axios from "axios";
import util from "util";

export const getBlockService = (url) => {
  async function getCurrentKeyValue(contractName, variableName, key) {
    try {
      let endpoint = "abci_query";
      let res = await axios(
        `${url}/${endpoint}?path=%22/get/${contractName}.${variableName}:${key}%22`
      );
      return res.data;
    } catch (e) {
      return e;
    }
  }

  async function getContractChanges(contractName, last_tx_uid, limit = 10) {
    let endpoint = "contract_history";
    let query = [
      `contract=${contractName}`,
      `last_tx_uid=${last_tx_uid}`,
      `limit=${limit}`,
    ].join("&");
    let res = await axios(`${url}/${endpoint}?${query}`).then((res) =>
      res.data()
    );
    //console.log(util.inspect(res.data, false, null, true))
    return res.data;
  }

  async function getVariableChanges(contractName, variableName, limit = 10) {
    let endpoint = "abci_query";
    let res = await axios(
      `${url}/${endpoint}?path=%22/state/${contractName}.${variableName}/limit=${limit}/offset=0%22`
    );
    //console.log(util.inspect(res.data, false, null, true))
    return res.data;
  }

  async function getRootKeyChanges(
    contractName,
    variableName,
    root_key,
    last_tx_uid,
    limit = 10
  ) {
    let endpoint = "rootkey_history";
    let query = [
      `contract=${contractName}`,
      `variable=${variableName}`,
      `root_key=${root_key}`,
      `last_tx_uid=${last_tx_uid}`,
      `limit=${limit}`,
    ].join("&");
    let res = await axios(`${url}/${endpoint}?${query}`);
    //console.log(util.inspect(res.data, false, null, true))
    return res.data;
  }

  async function getTx(tx_hash) {
    let endpoint = `tx`;

    let res = await axios(`${url}/${endpoint}?hash=${tx_hash}`);
    //console.log(util.inspect(res.data, false, null, true))
    return res.data;
  }

  return {
    getContractChanges,
    getVariableChanges,
    getRootKeyChanges,
    getCurrentKeyValue,
    getTx,
  };
};
