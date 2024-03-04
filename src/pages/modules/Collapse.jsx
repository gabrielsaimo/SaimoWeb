/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Collapse, Carousel, Spin } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import LazyLoad from "react-lazyload";
import "../../css/Collapse.css";
import { getCardapio, getImgCardapio } from "../../services/cardapio.ws";
import { getCategoty } from "../../services/category.ws";
import { useParams } from "react-router-dom";

const { Panel } = Collapse;
const LazyLoadedImage = lazy(() =>
  import("antd").then((module) => ({ default: module.Image }))
);

const CollapseMenu = () => {
  // get params from url
  const { Company } = useParams();

  const [cardapio, setCardapio] = useState([]);
  const [cardapioCategory, setCardapioCategory] = useState([]);
  const [imgSrc, setImgSrc] = useState([]);

  useEffect(() => {
    if (cardapio.length === 0 && cardapioCategory.length === 0) {
      getCardapios();
    }
    if (cardapioCategory.length === 0) {
      getCardapioCategory();
    }
  }, []);

  const getCardapios = async () => {
    const cardapioCollection = await getCardapio(Company);
    setCardapio(cardapioCollection);
  };

  const getCardapioCategory = async () => {
    const cardapioCollection = await getCategoty(Company);
    setCardapioCategory(cardapioCollection);
  };

  const memoizedImgSrc = useMemo(() => {
    if (cardapio.length > 0 && imgSrc.length === 0) {
      const images = [];
      cardapio.forEach(async (item) => {
        if (!item.ids) return;
        const img = await getImgCardapio(item.id, item.ids);
        setImgSrc((prevImgSrc) => [...prevImgSrc, img]);
        images.push(img);
      });
      return images;
    }
    return imgSrc;
  }, [cardapio, imgSrc]);

  const renderImageCarousel = (img, index, id) =>
    img[0].idreq === id && (
      <div className="img" key={index} style={{ zIndex: 5 }}>
        <LazyLoad key={index} height={200} offset={100}>
          <Carousel
            autoplay={true}
            autoplaySpeed={2000}
            showArrows={true}
            Swiping={true}
            draggable={true}
            effect="fade"
            dotPosition="bottom"
            style={{
              width: "80vw",
              maxWidth: 300,
              minWidth: "100px",
              color: "#fff",
            }}
          >
            {img
              .filter((img1) => img1.idreq && img1.idreq === id)
              .map((img1, index) => (
                <Suspense key={index} fallback={<Spin />}>
                  <div style={{ width: "80vw", maxWidth: 300 }}>
                    <LazyLoadedImage
                      src={atob(img1.imagem)}
                      key={index}
                      style={{
                        borderRadius: 10,
                        color: "#fff",
                        objectFit: "fill",
                        minWidth: "100px",
                      }}
                      alt="img"
                      width={"100%"}
                      loading="lazy"
                    />
                  </div>
                </Suspense>
              ))}
          </Carousel>
        </LazyLoad>
      </div>
    );

  const renderCardapioItems = () => {
    return cardapioCategory.map((item1, index) => {
      const key = item1.name;
      return (
        <div key={key}>
          <Suspense fallback={<Spin />}>
            <Collapse
              bordered={false}
              header={item1.name}
              easing="ease-in-out"
              waitForAnimate={true}
              defaultActiveKey={Array.from({ length: 1 }, (_, i) => String(i))}
              destroyInactivePanel={false}
              expandIconPosition="end"
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{
                background: "transparent",
              }}
            >
              <Panel
                id={key}
                style={{
                  color: "#7a4827",
                  fontWeight: "bold",
                  backgroundImage: `url(${require("../../assets/tinta.webp")}) `,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: 150,
                  backgroundPositionX: "50%",
                  backgroundPositionY: -8,
                  flexWrap: "wrap",
                }}
                header={item1.name}
              >
                {cardapio
                  .filter(
                    (categoria) =>
                      categoria.category === item1.name && categoria.active
                  )
                  .map((categoria, idx) => (
                    <div key={idx} className="border">
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {categoria.ids &&
                          memoizedImgSrc.map((img1, index) =>
                            renderImageCarousel(img1, index, categoria.id)
                          )}

                        <div className="flex">
                          <div style={{ width: "100%", display: "contents" }}>
                            <div>
                              <p className="p_1 name georgia-font">
                                {categoria.name}
                              </p>
                            </div>
                            <div className="flex">
                              {categoria.description.length > 25 && (
                                <>
                                  <div className="sub">{categoria.sub}</div>
                                  <div className="description">
                                    {categoria.description}
                                  </div>
                                </>
                              )}
                              {categoria.description.length <= 25 && (
                                <>
                                  <div className="sub">{categoria.sub}</div>
                                  <div className="description2">
                                    {categoria.description}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "end",
                              minWidth: "100%",
                              alignItems: "flex-end",
                            }}
                          >
                            <p className="p_1 price georgia-bold-font">
                              {`R$ ${
                                categoria.price % 1 !== 0
                                  ? categoria.price.replace(".", ",")
                                  : categoria.price + ",00"
                              }`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </Panel>
            </Collapse>
          </Suspense>
        </div>
      );
    });
  };

  return <div style={{ margin: 5 }}>{renderCardapioItems()}</div>;
};

export default CollapseMenu;
