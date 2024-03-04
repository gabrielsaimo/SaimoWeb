import React, { Suspense } from "react";
import { Spin } from "antd";

const Destaque = React.lazy(() => import("./SlideDestaque"));

const componentMap = {
  0: Destaque,
};

const SlideRenderer = ({ index }) => {
  const Component = componentMap[index];

  return <Suspense fallback={<Spin />}>{Component && <Component />}</Suspense>;
};

export default SlideRenderer;
