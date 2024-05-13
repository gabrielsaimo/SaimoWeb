import {
  Button,
  ColorPicker,
  Popconfirm,
  theme,
  Upload,
  message,
  Select,
  Collapse,
  Affix,
} from "antd";
import "../../css/LayoutSite.css";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useMemo, useState } from "react";
import { DeleteImg, InsertImg } from "../../services/cardapio.ws";
import { getImgLogo } from "../../services/config";
import { CaretRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { postStyles } from "../../services/user.ws";
import { generate, green, presetPalettes, red } from "@ant-design/colors";
import temaBlack from "../../assets/tinta.webp";
import temaWhite from "../../assets/tinta_white.png";
import temaBlue from "../../assets/tinta_blue.png";
import temaBrown from "../../assets/tinta_brown.png";
const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
  }));
const { Panel } = Collapse;
const SlideRenderer = () => {
  const [fundoColor1, setFundoColor1] = useState("#1677ff");
  const [fundoColor2, setFundoColor2] = useState("#1677ff");
  const [textColor, setTextColor] = useState("#1677ff");
  const [Tema, setTema] = useState("");
  const [fileList, setFileList] = useState([]);
  const [totalImg, setTotalImg] = useState(0);
  const [coint, setCoint] = useState(0);
  const random = Math.floor(Math.random() * 100000000);
  const dateUser = JSON.parse(localStorage.getItem("dateUser"));
  const company = JSON.parse(localStorage.getItem("companySelectd"));
  const { token } = theme.useToken();
  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
  });
  const [imgSrc, setImgSrc] = useState(null);
  const [idImg, setIdImg] = useState(null);

  const CompanyName = window.location.href.split("/").pop();
  useEffect(() => {
    if (dateUser.styles) {
      const stylesObj = JSON.parse(dateUser.styles);
      setFundoColor1(stylesObj.backgrondColor.split(",")[1].replace("0%", ""));
      setFundoColor2(
        stylesObj.backgrondColor.split(",")[2].replace("100%)", "")
      );
      setTextColor(stylesObj.colorText);
      setTema(stylesObj.tema);
    }
  }, [dateUser.styles]);

  const fetchData = async () => {
    const styles = `{"backgrondColor":"linear-gradient(90deg,${fundobgColor1} 0%,${fundobgColor2} 100%)","colorText":"${textbgColor}", "tema":"${temabgSelect}"}`;
    const data = {
      company: CompanyName.replace(/%20/g, " "),
      idcompany: company.idcompany,
      styles: styles.toString().replace(/\\/g, ""),
    };

    await postStyles(data);
    const newDataUSer = {
      id: dateUser.id,
      name: dateUser.name,
      categoria: dateUser.categoria,
      active: dateUser.active,
      idcompany: dateUser.idcompany,
      user_profile_json: dateUser.user_profile_json,
      company: dateUser.company,

      styles: styles.toString().replace(/\\/g, ""),
    };
    localStorage.setItem("dateUser", JSON.stringify(newDataUSer));
    message.success("Estilo salvo com sucesso!");
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setCoint(coint + 1);
  };
  const fundobgColor1 = useMemo(
    () =>
      typeof fundoColor1 === "string" ? fundoColor1 : fundoColor1.toHexString(),
    [fundoColor1]
  );
  const fundobgColor2 = useMemo(
    () =>
      typeof fundoColor2 === "string" ? fundoColor2 : fundoColor2.toHexString(),
    [fundoColor2]
  );

  const textbgColor = useMemo(
    () => (typeof textColor === "string" ? textColor : textColor.toHexString()),
    [textColor]
  );

  const temabgSelect = useMemo(
    () => (typeof Tema === "string" ? Tema : Tema.toHexString()),
    [Tema]
  );
  const FundoStyle = {
    marginTop: 16,
    background:
      "linear-gradient(90deg, " +
      fundobgColor1 +
      " 0%, " +
      fundobgColor2 +
      " 100%)",
    width: 300,
    height: 300,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    cursor: "pointer",
    color: textbgColor,
    border: textbgColor === "#ffffff" ? "solid 1px #000000" : "solid 1px red",
  };
  const FundoStyle2 = {
    background:
      "linear-gradient(90deg, " +
      fundobgColor1 +
      " 0%, " +
      fundobgColor2 +
      " 100%)",
    width: 334,
    height: 600,
    borderRadius: 10,
    color: textbgColor,
    border: textbgColor === "#ffffff" ? "solid 1px #000000" : "solid 1px red",
  };

  const TextStyle = {
    marginTop: 16,
    background:
      "linear-gradient(90deg, " +
      fundobgColor1 +
      " 0%, " +
      fundobgColor2 +
      " 100%)",
    display: "flex",
    alignItems: "center",
    fontSize: 50,
    cursor: "pointer",
    color: textbgColor,
    border: textbgColor === "#ffffff" ? "solid 1px #000000" : "solid 1px red",
    borderRadius: 10,
  };
  const TextStyle2 = {
    color: textbgColor,
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  async function confirmDeleteImg(record) {
    await DeleteImg(record, dateUser.company);
    message.success("Imagem deletada com sucesso!");
    setImgSrc(null);
  }

  const items = [
    {
      key: "1",
      label: "Logo",
      children: (
        <div>
          <div>
            {totalImg < 1 && (
              <ImgCrop>
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={(e) => onChange(e)}
                  onPreview={onPreview}
                  accept="image/*"
                >
                  {fileList.length < 1 && <p>+add Logo</p>}
                </Upload>
              </ImgCrop>
            )}
          </div>
          {imgSrc && (
            <>
              <img
                src={atob(imgSrc.imagem)}
                alt="img"
                style={{
                  width: 300 - 21,
                  marginRight: 5,
                  borderRadius: 500,
                  marginLeft: 16,
                }}
              />
              <Popconfirm
                title="Tem certeza que deseja excluir essa imagem?"
                okText="Excluir"
                okButtonProps={{ danger: true }}
                onConfirm={() => confirmDeleteImg(idImg)}
                cancelText="Cancelar"
              >
                <Button
                  style={{
                    backgroundColor: "#fc5f5f",
                    width: 20,
                    position: "absolute",
                    marginLeft: -37,
                  }}
                >
                  <DeleteOutlined
                    size={24}
                    style={{
                      color: "#fff",
                      marginLeft: -7,
                    }}
                  />
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Cor de Fundo",
      children: (
        <div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            cor 1
            <ColorPicker
              value={fundoColor1}
              presets={presets}
              allowClear
              onChange={setFundoColor1}
            />
            cor 2
            <ColorPicker
              value={fundoColor2}
              presets={presets}
              allowClear
              onChange={setFundoColor2}
            />
          </div>
          <ColorPicker disabled>
            <div style={FundoStyle}>Fundo do Site</div>
          </ColorPicker>
        </div>
      ),
    },
    {
      key: "3",
      label: "Cor do Texto",
      children: (
        <div>
          <ColorPicker value={textColor} onChange={setTextColor}>
            <p style={TextStyle}>Texto do Site</p>
          </ColorPicker>
        </div>
      ),
    },
    {
      key: "4",
      label: "Fundo de Texto da Catégoria",
      children: (
        <div>
          <div>
            <Select value={Tema} onChange={setTema} style={{ width: 300 }}>
              <Select.Option value="Black">
                <div style={{ display: "flex", alignItems: "center" }}>
                  Preto
                  <img
                    src={temaBlack}
                    alt="img"
                    style={{
                      width: 80,
                      height: 40,
                      cursor: "pointer",
                      marginLeft: 10,
                    }}
                    onClick={() => setTema("Black")}
                  />
                </div>
              </Select.Option>
              <Select.Option value="White">
                <div style={{ display: "flex", alignItems: "center" }}>
                  Branco
                  <img
                    src={temaWhite}
                    alt="img"
                    style={{
                      width: 80,
                      height: 40,
                      cursor: "pointer",
                      marginLeft: 10,
                    }}
                    onClick={() => setTema("White")}
                  />
                </div>
              </Select.Option>
              <Select.Option value="Blue">
                <div style={{ display: "flex", alignItems: "center" }}>
                  Azul
                  <img
                    src={temaBlue}
                    alt="img"
                    style={{
                      width: 80,
                      height: 40,
                      cursor: "pointer",
                      marginLeft: 10,
                    }}
                    onClick={() => setTema("Blue")}
                  />
                </div>
              </Select.Option>
              <Select.Option value="Brown">
                <div style={{ display: "flex", alignItems: "center" }}>
                  Marrom
                  <img
                    src={temaBrown}
                    alt="img"
                    style={{
                      width: 80,
                      height: 40,
                      cursor: "pointer",
                      marginLeft: 10,
                    }}
                    onClick={() => setTema("Brown")}
                  />
                </div>
              </Select.Option>
            </Select>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getImgLogos();
  }, []);

  const getImgLogos = async () => {
    const img = await getImgLogo(company.idcompany);
    if (img[0]) {
      setImgSrc(img[0]);
      setIdImg(img[0]?.id);
      setTotalImg(img.length);
    }
  };

  useEffect(() => {
    if (fileList.length > 0 && coint == 1) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        insertImg(reader.result);
      });
      reader.readAsDataURL(fileList[0].originFileObj);
    }
  }, [fileList[0]]);

  const insertImg = async (code) => {
    let body = {
      imagem: code,
      idreq: company.idcompany,
      tipo: "Logo",
      id: random,
      company: company.company,
    };
    if (code) await InsertImg(body);
  };

  return (
    <div style={{ height: "85vh" }}>
      <Affix offsetTop={10} style={{ position: "fixed", right: 10 }}>
        <Button type="primary" onClick={() => fetchData()}>
          Salvar
        </Button>
      </Affix>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",

          flex: 1,
        }}
      >
        <Collapse
          items={items}
          defaultActiveKey={1}
          style={{ minWidth: 334, marginTop: 20, marginRight: 20 }}
        />
        <div style={{ marginTop: 20 }}>
          <ColorPicker disabled style={{ minWidth: 334 }}>
            <>
              <div style={FundoStyle2}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  {imgSrc?.imagem && (
                    <img
                      src={atob(imgSrc?.imagem)}
                      alt="img"
                      style={{
                        width: 150,
                        marginRight: 5,
                        borderRadius: 500,
                        marginBottom: 20,
                      }}
                    />
                  )}
                  <Collapse
                    bordered={false}
                    header={<p style={TextStyle2}>Categoria</p>}
                    easing="ease-in-out"
                    waitForAnimate={true}
                    defaultActiveKey={1}
                    destroyInactivePanel={false}
                    expandIconPosition="end"
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    style={{
                      background: "transparent",
                      width: 334,
                    }}
                  >
                    <Panel
                      id={1}
                      style={
                        TextStyle2 && {
                          fontWeight: "bold",
                          backgroundImage: `url(${
                            Tema == "Black"
                              ? temaBlack
                              : Tema === "White"
                              ? temaWhite
                              : Tema === "Blue"
                              ? temaBlue
                              : Tema === "Brown"
                              ? temaBrown
                              : temaBlack
                          })`,
                          textAlign: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: 150,
                          backgroundPositionX: "50%",
                          backgroundPositionY: -8,
                          flexWrap: "wrap",
                        }
                      }
                      header={<text style={TextStyle2}>Categoria</text>}
                    >
                      <p style={TextStyle2}>Texto do Site123</p>
                    </Panel>
                  </Collapse>

                  <p style={TextStyle2}>Texto do Site</p>
                </div>
              </div>
            </>
          </ColorPicker>
        </div>
      </div>
    </div>
  );
};

export default SlideRenderer;
