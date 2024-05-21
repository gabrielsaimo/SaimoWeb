import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Collapse, Carousel, Spin, Image, Input, Anchor, Affix } from "antd";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { CaretRightOutlined } from "@ant-design/icons";
import LazyLoad from "react-lazyload";
import "../../css/Collapse.css";
import { getCardapio, getImgCardapio } from "../../services/cardapio.ws";
import { getCategoty } from "../../services/category.ws";
import { useParams } from "react-router-dom";
import { getStyles } from "../../services/user.ws";
import temaBlack from "../../assets/tinta.webp";
import temaWhite from "../../assets/tinta_white.png";
import temaBlue from "../../assets/tinta_blue.png";
import temaBrown from "../../assets/tinta_brown.png";
import currency_BRL from "../Components/CurrencyBRL";
const { Panel } = Collapse;
const LazyLoadedImage = lazy(() =>
  import("antd").then((module) => ({ default: module.Image }))
);

const CollapseMenu = () => {
  // get params from url
  const { idcompany, Company } = useParams();
  const CompanyName = window.location.href.split("/").pop();
  const [cardapio, setCardapio] = useState([]);
  const [cardapioCategory, setCardapioCategory] = useState([]);
  const [imgSrc, setImgSrc] = useState([]);
  const [styles, setStyles] = useState("");
  const [newCardapio, setNewCardapio] = useState([]);

  const getStylesUser = async () => {
    const resp = await getStyles(CompanyName, idcompany);
    setStyles(JSON.parse(resp[0].styles));
  };
  useEffect(() => {
    getStylesUser();
    if (cardapio.length === 0 && cardapioCategory.length === 0) {
      getCardapios();
    }
    if (cardapioCategory.length === 0) {
      getCardapioCategory();
    }
  }, []);

  const getCardapios = async () => {
    const cardapioCollection = await getCardapio(idcompany, Company);
    setCardapio(cardapioCollection);
  };

  const getCardapioCategory = async () => {
    const cardapioCollection = await getCategoty(idcompany, Company);
    setCardapioCategory(cardapioCollection);
  };

  const styleText = {
    color: styles.colorText,
  };

  const ColorCategoria = styles.ColorCategoria
    ? styles.ColorCategoria
    : styleText.color;
  const ColorDescricao = styles.ColorDescricao
    ? styles.ColorDescricao
    : styleText;
  const ColorGeral = styles.ColorGeral ? styles.ColorGeral : styleText;
  const ColorNome = styles.ColorNome ? styles.ColorNome : styleText;
  const ColorPreco = styles.ColorPreco ? styles.ColorPreco : styleText;
  const ColorSub = styles.ColorSub ? styles.ColorSub : styleText;
  const fonteCategoria = styles.fonteCategoria
    ? styles.fonteCategoria
    : "Arial";
  const fonteDescricao = styles.fonteDescricao
    ? styles.fonteDescricao
    : "Arial";
  const fonteGeral = styles.fonteGeral ? styles.fonteGeral : "Arial";
  const fonteNome = styles.fonteNome ? styles.fonteNome : "Arial";
  const fontePreco = styles.fontePreco ? styles.fontePreco : "Arial";
  const fonteSub = styles.fonteSub ? styles.fonteSub : "Arial";

  const searchNameCardapio = (text) => {
    if (text === "") {
      setNewCardapio(cardapio);
      return;
    }
    const array = cardapio.filter(
      (record) =>
        !text ||
        record["name"].toLowerCase().indexOf(text.toLowerCase()) > -1 ||
        !text ||
        record["description"].toLowerCase().indexOf(text.toLowerCase()) > -1 ||
        !text ||
        record["number"].toString().indexOf(text.toLowerCase()) > -1
    );
    setNewCardapio(array);

    return array;
  };

  useEffect(() => {
    setNewCardapio(cardapio);
  }, [cardapio]);

  const memoizedImgSrc = useMemo(() => {
    if (newCardapio.length > 0 && imgSrc.length === 0) {
      const images = [];
      newCardapio.forEach(async (item) => {
        if (!item.ids) return;
        const img = await getImgCardapio(item.id, item.ids);
        setImgSrc((prevImgSrc) => [...prevImgSrc, img]);
        images.push(img);
      });
      return images;
    }
    return imgSrc;
  }, [newCardapio, imgSrc]);

  const renderImageCarousel = (img, index, id) =>
    img[0]?.idreq === id && (
      <div className="img" key={index} style={{ zIndex: 5 }}>
        <LazyLoad key={index} height={200} offset={100}>
          <Image.PreviewGroup>
            <Carousel
              autoplay={true}
              autoplaySpeed={2000}
              showArrows={true}
              Swiping={true}
              draggable={true}
              effect="fade"
              dotPosition="bottom"
              style={{
                width: "45vw",
                maxWidth: 250,
                minWidth: "100px",
                color: "#fff",
              }}
            >
              {img
                .filter((img1) => img1.idreq && img1.idreq === id)
                .map((img1, index) => (
                  <Suspense key={index} fallback={<Spin />}>
                    <div style={{ width: "45vw", maxWidth: 250 }}>
                      <LazyLoadedImage
                        src={atob(img1.imagem)}
                        key={index}
                        style={{
                          borderRadius: 10,
                          color: "#fff",
                          minWidth: "100px",
                          objectFit: "cover",
                        }}
                        alt="img"
                        objectFit="cover"
                        width={"100%"}
                        loading="lazy"
                      />
                    </div>
                  </Suspense>
                ))}
            </Carousel>
          </Image.PreviewGroup>
        </LazyLoad>
      </div>
    );

  const renderCardapioItems = () => {
    return (
      <TransitionGroup>
        {cardapioCategory.map((item1, index) => {
          const key = index;
          const filteredItems = newCardapio.filter(
            (categoria) => categoria.category === item1.name && categoria.active
          );

          if (filteredItems.length === 0) {
            return null;
          }

          return (
            <CSSTransition key={key} timeout={500} classNames="item">
              <div key={key}>
                <Suspense fallback={<Spin />}>
                  <Collapse
                    bordered={false}
                    header={item1.name}
                    easing="ease-in-out"
                    waitForAnimate={true}
                    defaultActiveKey={Array.from({ length: 1 }, (_, i) =>
                      String(i)
                    )}
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
                      id={item1.name}
                      className={`${fonteCategoria}`}
                      style={{
                        color: ColorCategoria,
                        fontWeight: "bold",
                        backgroundImage: `url(${
                          styles.tema == "Black"
                            ? temaBlack
                            : styles.tema === "White"
                            ? temaWhite
                            : styles.tema === "Blue"
                            ? temaBlue
                            : styles.tema === "Brown"
                            ? temaBrown
                            : temaBlack
                        })`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "315px 90px",
                        minWidth: 360,
                        backgroundPositionX: "50%",
                        backgroundPositionY: -8,
                        flexWrap: "wrap",
                      }}
                      header={
                        <text
                          className={`${fonteCategoria}`}
                          style={{
                            color: ColorCategoria,
                            fontSize: 30,
                          }}
                        >
                          {item1.name}
                        </text>
                      }
                    >
                      {filteredItems.map((categoria, idx) => (
                        <div
                          key={idx}
                          className="border"
                          style={{ border: `3px solid ${styles.borderColor}` }}
                        >
                          <div style={{ display: "flex" }}>
                            {categoria.ids &&
                              memoizedImgSrc.map((img1, index) =>
                                renderImageCarousel(img1, index, categoria.id)
                              )}

                            <div className="flex">
                              <div
                                style={{ width: "100%", display: "contents" }}
                              >
                                <div>
                                  <p
                                    className={`p_1 name ${fonteNome}`}
                                    style={{
                                      color: ColorNome,
                                    }}
                                  >
                                    {categoria.name}
                                  </p>
                                  <p
                                    className="name georgia-font"
                                    style={{
                                      backgroundColor: "#FFFFFF70",
                                      width: 40,
                                      textAlign: "center",
                                      height: 20,
                                      fontSize: 12,
                                      padding: 5,
                                      color: styles.colorText,
                                      borderRadius: 10,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    N° {categoria.number}
                                  </p>
                                </div>

                                <div
                                  className={`flex ${fonteDescricao}`}
                                  style={{
                                    color: ColorDescricao,
                                    marginTop: 15,
                                  }}
                                >
                                  {categoria.description.length > 25 && (
                                    <>
                                      <div
                                        className={`sub ${fonteSub}`}
                                        style={{
                                          color: ColorSub,
                                        }}
                                      >
                                        {categoria.sub}
                                      </div>
                                      <div
                                        className={`description ${fonteDescricao}`}
                                        style={{
                                          color: ColorDescricao,
                                        }}
                                      >
                                        {categoria.description}
                                      </div>
                                    </>
                                  )}
                                  {categoria.description.length <= 25 && (
                                    <>
                                      <div
                                        className={`sub ${fonteSub}`}
                                        style={{
                                          color: ColorSub,
                                        }}
                                      >
                                        {categoria.sub}
                                      </div>
                                      <div
                                        className="description2"
                                        style={{ color: ColorDescricao }}
                                      >
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
                                <p
                                  className={`p_1 price ${fontePreco}`}
                                  style={{
                                    color: ColorPreco,
                                  }}
                                >
                                  {currency_BRL(categoria.price)}
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
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  };

  return (
    <div style={{ margin: 5 }}>
      <Suspense fallback={<Spin />}>
        {cardapioCategory.length > 0 && (
          <Affix offsetTop={10}>
            <div
              style={{
                background: styles.backgrondColor,
                borderRadius: 30,
              }}
            >
              <Input
                type="text"
                style={{
                  width: 300,
                  marginBottom: 10,
                  borderRadius: 10,
                  marginTop: 50,
                }}
                placeholder="Pesquisar"
                onChange={(e) => searchNameCardapio(e.target.value)}
              />
            </div>
          </Affix>
        )}
      </Suspense>

      <Anchor
        affix={true}
        direction="horizontal"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: styles.backgrondColor,
          width: "100%",
          zIndex: 10,
          padding: 10,
        }}
        replace
        onChange={(e) => {
          console.log(e);
        }}
        items={cardapioCategory.map((item, index) => ({
          href: `#${item.name}`,
          key: `${index}`,
          title: (
            <text
              className={`${fonteCategoria}`}
              style={{
                color: ColorCategoria,
                fontWeight: "bold",
              }}
            >{`${item.name}`}</text>
          ),
        }))}
      />
      {renderCardapioItems()}
    </div>
  );
};

export default CollapseMenu;
