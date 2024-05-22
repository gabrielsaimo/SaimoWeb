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
  Input,
  Divider,
  Anchor,
} from "antd";
import "../../css/LayoutSite.css";
import logo from "../../assets/logo.webp";
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
const SlideRenderer = (atualizar) => {
  const styles = JSON.parse(localStorage.getItem("styles"));

  const [fundoColor1, setFundoColor1] = useState("#1677ff");
  const [fundoColor2, setFundoColor2] = useState("#1677ff");
  const [textColor, setTextColor] = useState("#1677ff");
  const [texteColorGeral, setTexteColorGeral] = useState("#1677ff");
  const [texteColorCategoria, setTexteColorCategoria] = useState("#1677ff");
  const [texteColorNome, setTexteColorNome] = useState("#1677ff");
  const [texteColorDescricao, setTexteColorDescricao] = useState("#1677ff");
  const [texteColorSub, setTexteColorSub] = useState("#1677ff");
  const [texteColorPreco, setTexteColorPreco] = useState("#1677ff");

  const [fonteGeral, setFonteGeral] = useState("georgia-font");
  const [fonteCategoria, setFonteCategoria] = useState("georgia-font");
  const [fonteNome, setFonteNome] = useState("georgia-font");
  const [fonteDescricao, setFonteDescricao] = useState("georgia-font");
  const [fonteSub, setFonteSub] = useState("georgia-font");
  const [fontePreco, setFontePreco] = useState("georgia-font");

  const [BorderColor, setBorderColor] = useState("#1677ff");
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
    if (styles) {
      const stylesObj = JSON.parse(styles.styles);
      setFundoColor1(stylesObj.backgrondColor.split(",")[1].replace("0%", ""));
      setFundoColor2(
        stylesObj.backgrondColor.split(",")[2].replace("100%)", "")
      );
      setTextColor(stylesObj.colorText);
      if (stylesObj.ColorCategoria) {
        if (
          stylesObj.ColorGeral === stylesObj.ColorNome &&
          stylesObj.ColorGeral === stylesObj.ColorDescricao &&
          stylesObj.ColorGeral === stylesObj.ColorSub &&
          stylesObj.ColorGeral === stylesObj.ColorPreco &&
          stylesObj.ColorGeral === stylesObj.ColorCategoria
        ) {
          GeralColor(stylesObj.ColorCategoria);
          setTexteColorGeral(stylesObj.ColorGeral);
          setTexteColorCategoria(stylesObj.ColorCategoria);
          setTexteColorNome(stylesObj.ColorNome);
          setTexteColorDescricao(stylesObj.ColorDescricao);
          setTexteColorSub(stylesObj.ColorSub);
          setTexteColorPreco(stylesObj.ColorPreco);
          setFonteGeral(stylesObj.fonteGeral);
          setFonteCategoria(stylesObj.fonteCategoria);
          setFonteNome(stylesObj.fonteNome);
          setFonteDescricao(stylesObj.fonteDescricao);
          setFonteSub(stylesObj.fonteSub);
          setFontePreco(stylesObj.fontePreco);
        } else {
          setTexteColorCategoria(stylesObj.ColorCategoria);
          setTexteColorGeral(stylesObj.ColorGeral);
          setTexteColorNome(stylesObj.ColorNome);
          setTexteColorDescricao(stylesObj.ColorDescricao);
          setTexteColorSub(stylesObj.ColorSub);
          setTexteColorPreco(stylesObj.ColorPreco);
          setFonteGeral(stylesObj.fonteGeral);
          setFonteCategoria(stylesObj.fonteCategoria);
          setFonteNome(stylesObj.fonteNome);
          setFonteDescricao(stylesObj.fonteDescricao);
          setFonteSub(stylesObj.fonteSub);
          setFontePreco(stylesObj.fontePreco);
        }
      }

      setBorderColor(stylesObj.borderColor || "black");
      setTema(stylesObj.tema);
    }
  }, [styles.styles, atualizar]);

  const fetchData = async () => {
    const styles = `{"backgrondColor":"linear-gradient(90deg,${fundobgColor1} 0%,${fundobgColor2} 100%)","colorText":"${textbgColor}", "tema":"${Tema}", "borderColor":"${BorderbgColor}" , "fonteGeral":"${textbgFonteGeral}", "fonteCategoria":"${textbgFonteCategoria}", "fonteNome":"${textbgFonteNome}", "fonteDescricao":"${textbgFonteDescricao}", "fonteSub":"${textbgFonteSub}", "fontePreco":"${textbgFontePreco}","ColorGeral": "${textbgColorGeral}", "ColorCategoria":"${textbgColorCategoria}", "ColorNome":"${textbgColorNome}", "ColorDescricao":"${textbgColorDescricao}", "ColorSub":"${textbgColorSub}", "ColorPreco":"${textbgColorPreco}"}`;

    const data = {
      company: CompanyName.replace(/%20/g, " "),
      idcompany: company.idcompany,
      styles: styles.toString().replace(/\\/g, ""),
    };

    await postStyles(data);
    message.success("Estilo salvo com sucesso!");
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
    localStorage.setItem(
      "styles",
      JSON.stringify({
        styles: styles.toString().replace(/\\/g, ""),
      })
    );

    window.location.reload();
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setCoint(coint + 1);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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

  const textbgColorGeral = useMemo(
    () =>
      typeof texteColorGeral === "string"
        ? texteColorGeral
        : texteColorGeral.toHexString(),
    [texteColorGeral]
  );

  const textbgColorCategoria = useMemo(
    () =>
      typeof texteColorCategoria === "string"
        ? texteColorCategoria
        : texteColorCategoria.toHexString(),
    [texteColorCategoria]
  );

  const textbgColorNome = useMemo(
    () =>
      typeof texteColorNome === "string"
        ? texteColorNome
        : texteColorNome.toHexString(),
    [texteColorNome]
  );

  const textbgColorDescricao = useMemo(
    () =>
      typeof texteColorDescricao === "string"
        ? texteColorDescricao
        : texteColorDescricao.toHexString(),
    [texteColorDescricao]
  );

  const textbgColorSub = useMemo(
    () =>
      typeof texteColorSub === "string"
        ? texteColorSub
        : texteColorSub.toHexString(),
    [texteColorSub]
  );

  const textbgColorPreco = useMemo(
    () =>
      typeof texteColorPreco === "string"
        ? texteColorPreco
        : texteColorPreco.toHexString(),
    [texteColorPreco]
  );

  const textbgFonteGeral = useMemo(
    () =>
      typeof fonteGeral === "string" ? fonteGeral : fonteGeral.toHexString(),
    [fonteGeral]
  );

  const textbgFonteCategoria = useMemo(
    () =>
      typeof fonteCategoria === "string"
        ? fonteCategoria
        : fonteCategoria.toHexString(),
    [fonteCategoria]
  );

  const textbgFonteNome = useMemo(
    () => (typeof fonteNome === "string" ? fonteNome : fonteNome.toHexString()),
    [fonteNome]
  );

  const textbgFonteDescricao = useMemo(
    () =>
      typeof fonteDescricao === "string"
        ? fonteDescricao
        : fonteDescricao.toHexString(),
    [fonteDescricao]
  );

  const textbgFonteSub = useMemo(
    () => (typeof fonteSub === "string" ? fonteSub : fonteSub.toHexString()),
    [fonteSub]
  );

  const textbgFontePreco = useMemo(
    () =>
      typeof fontePreco === "string" ? fontePreco : fontePreco.toHexString(),
    [fontePreco]
  );

  const BorderbgColor = useMemo(
    () =>
      typeof BorderColor === "string" ? BorderColor : BorderColor.toHexString(),
    [BorderColor]
  );

  const temabgSelect = useMemo(
    () => (typeof Tema === "string" ? Tema : Tema.toHexString()),
    [Tema]
  );

  const salveStyleFonte = async (fonte, e) => {
    switch (fonte.title) {
      case "Geral":
        setFonteGeral(e);
        setFonteCategoria(e);
        setFonteNome(e);
        setFonteDescricao(e);
        setFonteSub(e);
        setFontePreco(e);
        break;
      case "Categoria":
        setFonteCategoria(e);
        break;
      case "Nome":
        setFonteNome(e);
        break;
      case "Descrição":
        setFonteDescricao(e);
        break;
      case "Sub":
        setFonteSub(e);
        break;
      case "Preço":
        setFontePreco(e);
        break;
      default:
        break;
    }
  };

  const SelectFont = (fonte) => {
    return (
      <div style={{ marginTop: 20 }}>
        <text
          className="text"
          style={{
            fontSize: 20,
            marginTop: 16,
            fontWeight: "bold",
            paddingRight: 10,
          }}
        >
          {fonte.title}
        </text>
        <Select
          value={fonte.value}
          onChange={(e) => salveStyleFonte(fonte, e)}
          style={{ width: 250 }}
        >
          <Select.Option value="Arial">
            <text style={{ fontFamily: "Arial", fontSize: 25 }}>Arial</text>
          </Select.Option>
          <Select.Option value="georgia-font">
            <text className="georgia-font" style={{ fontSize: 25 }}>
              Georgia
            </text>
          </Select.Option>
          <Select.Option value="greek-freak-font">
            <text className="greek-freak-font" style={{ fontSize: 25 }}>
              Greek Freak
            </text>
          </Select.Option>
          <Select.Option value="luckiest-guy-font">
            <text className="luckiest-guy-font" style={{ fontSize: 25 }}>
              Luckiest Guy
            </text>
          </Select.Option>
          <Select.Option value="creepster-font">
            <text className="creepster-font" style={{ fontSize: 25 }}>
              Creepster
            </text>
          </Select.Option>
          <Select.Option value="monoton-font">
            <text className="monoton-font" style={{ fontSize: 25 }}>
              Monoton
            </text>
          </Select.Option>
          <Select.Option value="press-start-font">
            <text className="press-start-font" style={{ fontSize: 25 }}>
              Press Start
            </text>
          </Select.Option>
          <Select.Option value="sacramento-font">
            <text className="sacramento-font" style={{ fontSize: 25 }}>
              Sacramento
            </text>
          </Select.Option>
          <Select.Option value="shojumaru-font">
            <text className="shojumaru-font" style={{ fontSize: 25 }}>
              Shojumaru
            </text>
          </Select.Option>
          <Select.Option value="amatic-font">
            <text className="amatic-font" style={{ fontSize: 25 }}>
              AmaticSC
            </text>
          </Select.Option>
          <Select.Option value="danfo-font">
            <text className="danfo-font" style={{ fontSize: 25 }}>
              Danfo
            </text>
          </Select.Option>
          <Select.Option value="indie-flower-font">
            <text className="indie-flower-font" style={{ fontSize: 25 }}>
              IndieFlower
            </text>
          </Select.Option>
          <Select.Option value="jacquard-font">
            <text className="jacquard-font" style={{ fontSize: 25 }}>
              Jacquard24
            </text>
          </Select.Option>
        </Select>
      </div>
    );
  };

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
    minWidth: 400,
    borderRadius: 10,
    color: textbgColor,
    border: textbgColor === "#ffffff" ? "solid 1px #000000" : "solid 1px red",
  };

  const TextStyle2 = {
    color: textbgColor,
  };

  const GeralColor = (e) => {
    setTexteColorCategoria(e);
    setTexteColorNome(e);
    setTexteColorDescricao(e);
    setTexteColorSub(e);
    setTexteColorPreco(e);
    setTexteColorGeral(e);
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
    await DeleteImg(record.id, record.idreq);
    message.success("Imagem deletada com sucesso!");
    message.warning("Logue novamente para ver as alterações!");
    setImgSrc(null);
    window.location.reload();
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
                  marginLeft: 16,
                }}
              />
              <Popconfirm
                title="Tem certeza que deseja excluir essa imagem?"
                okText="Excluir"
                okButtonProps={{ danger: true }}
                onConfirm={() => confirmDeleteImg(imgSrc)}
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
            <text className="text"> Cor 1</text>
            <ColorPicker
              value={fundoColor1}
              presets={presets}
              allowClear
              onChange={setFundoColor1}
            />
            <text className="text">Cor 2</text>
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
      label: "Texto",
      children: (
        <div>
          <ColorPicker value={texteColorGeral} onChange={(e) => GeralColor(e)}>
            <text
              style={{
                color: `${textbgColorGeral}`,
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
                border:
                  textbgColor === "#ffffff"
                    ? "solid 1px #000000"
                    : "solid 1px red",
                borderRadius: 10,
              }}
              className={`${textbgFonteGeral}`}
            >
              Geral
            </text>
          </ColorPicker>
          <SelectFont value={fonteGeral} title="Geral" />
          <Divider />
          <ColorPicker value={fonteCategoria} onChange={setTexteColorCategoria}>
            <text
              style={{
                color: `${textbgColorCategoria}`,
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
                border:
                  textbgColor === "#ffffff"
                    ? "solid 1px #000000"
                    : "solid 1px red",
                borderRadius: 10,
              }}
              className={`${textbgFonteCategoria}`}
            >
              Categoria
            </text>
          </ColorPicker>
          <SelectFont value={fonteCategoria} title="Categoria" />
          <Divider />
          <ColorPicker value={textbgColorNome} onChange={setTexteColorNome}>
            <text
              style={{
                color: `${textbgColorNome}`,
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
                border:
                  textbgColor === "#ffffff"
                    ? "solid 1px #000000"
                    : "solid 1px red",
                borderRadius: 10,
              }}
              className={`${textbgFonteNome}`}
            >
              Nome
            </text>
          </ColorPicker>
          <SelectFont value={fonteNome} title="Nome" />
          <Divider />

          <ColorPicker
            value={textbgColorDescricao}
            onChange={setTexteColorDescricao}
          >
            <text
              style={{
                color: `${textbgColorDescricao}`,
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
                border:
                  textbgColor === "#ffffff"
                    ? "solid 1px #000000"
                    : "solid 1px red",
                borderRadius: 10,
              }}
              className={`${textbgFonteDescricao}`}
            >
              Descrição
            </text>
          </ColorPicker>
          <SelectFont value={fonteDescricao} title="Descrição" />
          <Divider />
          <ColorPicker value={textbgColorSub} onChange={setTexteColorSub}>
            <text
              style={{
                color: `${textbgColorSub}`,
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
                border:
                  textbgColor === "#ffffff"
                    ? "solid 1px #000000"
                    : "solid 1px red",
                borderRadius: 10,
              }}
              className={`${textbgFonteSub}`}
            >
              Sub
            </text>
          </ColorPicker>
          <SelectFont value={fonteSub} title="Sub" />
          <Divider />
          <ColorPicker value={textbgColorPreco} onChange={setTexteColorPreco}>
            <text
              style={{
                color: `${textbgColorPreco}`,
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
                border:
                  textbgColor === "#ffffff"
                    ? "solid 1px #000000"
                    : "solid 1px red",
                borderRadius: 10,
              }}
              className={`${textbgFontePreco}`}
            >
              Preço $
            </text>
          </ColorPicker>
          <SelectFont value={fontePreco} title="Preço" />
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
    {
      key: "5",
      label: "Borda do Card",
      children: (
        <ColorPicker value={BorderColor} onChange={setBorderColor}>
          <div
            style={{
              width: 100,
              height: 10,
              backgroundColor: BorderbgColor,
              borderRadius: 10,
            }}
          />
        </ColorPicker>
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
    } else {
      message.info("Logo não encontrada!");
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",

          flex: 1,
        }}
      >
        <Affix
          offsetTop={10}
          style={{
            position: "fixed",
            left: "50%",
            bottom: 10,
            transform: "translate(-50%, 0)",
            zIndex: 1,
          }}
        >
          <Button
            type="primary"
            onClick={() => fetchData()}
            style={{
              width: "100vw",
              maxWidth: 450,
              height: 50,
            }}
          >
            Salvar
          </Button>
        </Affix>
        <Collapse
          defaultActiveKey={1}
          style={{ minWidth: 334, marginTop: 20, marginRight: 20 }}
        >
          {items.map((item) => (
            <Panel
              key={item.key}
              style={{ backgroundColor: "#282c34 !important" }}
              header={<text className="text">{item.label}</text>}
            >
              {item.children}
            </Panel>
          ))}
        </Collapse>

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
                        marginBottom: 20,
                      }}
                    />
                  )}

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
                      readOnly={true}
                    />
                  </div>

                  <Anchor
                    affix={false}
                    direction="horizontal"
                    defaultActiveKey={["1"]}
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
                    items={[
                      {
                        title: (
                          <text
                            className={`${textbgFonteCategoria}`}
                            style={{
                              color: `${textbgColorCategoria}`,
                              fontWeight: "bold",
                            }}
                          >
                            Categoria
                          </text>
                        ),
                        href: "categoria",
                        key: "1",
                      },
                    ]}
                  />
                  <Collapse
                    bordered={false}
                    header="This is panel header 1"
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
                      minWidth: 334,
                    }}
                  >
                    <Panel
                      id={1}
                      style={{
                        color: styles.colorText,
                        fontWeight: "bold",
                        backgroundImage: `url(${
                          temabgSelect == "Black"
                            ? temaBlack
                            : temabgSelect === "White"
                            ? temaWhite
                            : temabgSelect === "Blue"
                            ? temaBlue
                            : temabgSelect === "Brown"
                            ? temaBrown
                            : temaBlack
                        })`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "315px 90px",
                        minWidth: 334,
                        backgroundPositionX: "50%",
                        backgroundPositionY: -8,
                        flexWrap: "wrap",
                        textAlign: "center",
                      }}
                      header={
                        <text
                          id="categoria"
                          className={` ${textbgFonteCategoria}`}
                          style={{
                            color: `${textbgColorCategoria}`,
                            height: 100,
                            fontSize: 30,
                            fontWeight: "bold",
                          }}
                        >
                          Categoria
                        </text>
                      }
                    >
                      <div
                        key={2}
                        className="border_test"
                        style={{ border: `3px solid ${BorderbgColor}` }}
                      >
                        <div style={{ display: "flex" }}>
                          <img
                            src={logo}
                            alt="img"
                            style={{
                              width: 150,
                              marginRight: 5,
                              marginBottom: 20,
                              filter: "grayscale(100%)",
                              borderRadius: 10,
                            }}
                          />

                          <div className="flex">
                            <div style={{ width: "100%", display: "block" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  className={`p_1 name ${textbgFonteNome}`}
                                  style={{ color: `${textbgColorNome}` }}
                                >
                                  Item 001
                                </p>
                              </div>
                              <div>
                                <p
                                  className="name"
                                  style={{
                                    backgroundColor: "#FFFFFF70",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: 40,
                                    textAlign: "center",
                                    height: 20,
                                    fontSize: 12,
                                    padding: 5,
                                    color: textbgColor,
                                    borderRadius: 10,
                                    fontWeight: "bold",
                                  }}
                                >
                                  N° 1
                                </p>
                              </div>
                              <div className="flex" style={{ marginTop: 30 }}>
                                <div
                                  className={`sub ${textbgFonteSub}`}
                                  style={{ color: `${textbgColorSub}` }}
                                >
                                  Subtitulo
                                </div>
                              </div>
                              <div
                                className={`description2Teste ${textbgFonteDescricao}`}
                                style={{ color: `${textbgColorDescricao}` }}
                              >
                                Descrição
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
                                className={`p_1 preco ${textbgFontePreco}`}
                                style={{ color: `${textbgColorPreco}` }}
                              >
                                R$ 00,00
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
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
