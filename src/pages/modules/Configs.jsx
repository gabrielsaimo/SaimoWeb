import React from "react";
import Emails from "../Components/Emails";
import Company from "./Company";
import { Divider } from "antd";

const Configs = () => {
  return (
    <div>
      <Emails />
      <Divider />
      <Company config={true} />
    </div>
  );
};

export default Configs;
