import { Button, ColorPicker, Popconfirm, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useMemo, useState } from "react";
import { DeleteImg, InsertImg } from "../../services/cardapio.ws";
import { getImgLogo } from "../../services/config";
import { DeleteOutlined } from "@ant-design/icons";
import { postStyles } from "../../services/user.ws";
const SlideRenderer = () => {
  const [fundoColor1, setFundoColor1] = useState("#1677ff");
  const [fundoColor2, setFundoColor2] = useState("#1677ff");
  const [textColor, setTextColor] = useState("#1677ff");
  const [fileList, setFileList] = useState([]);
  const [totalImg, setTotalImg] = useState(0);
  const [coint, setCoint] = useState(0);
  const random = Math.floor(Math.random() * 100000000);
  const company = JSON.parse(localStorage.getItem("dateUser")).company;
  const idcompany = JSON.parse(localStorage.getItem("dateUser")).idcompany;
  const styles = JSON.parse(localStorage.getItem("dateUser")).styles;

  const [imgSrc, setImgSrc] = useState(null);
  const [idImg, setIdImg] = useState(null);

  const CompanyName = window.location.href.split("/").pop();
  useEffect(() => {
    if (styles) {
      const stylesObj = JSON.parse(styles);
      setFundoColor1(stylesObj.backgrondColor.split(",")[1].replace("0%", ""));
      setFundoColor2(
        stylesObj.backgrondColor.split(",")[2].replace("100%)", "")
      );
      setTextColor(stylesObj.colorText);
    }
  }, [styles]);

  const fetchData = async () => {
    const styles = `{"backgrondColor":"linear-gradient(90deg, ${fundobgColor1} 0%, ${fundobgColor2} 100%)","colorText":"${textbgColor}"}`;
    const data = {
      company: CompanyName.replace(/%20/g, " "),
      styles: styles.toString().replace(/\\/g, ""),
    };

    const response = await postStyles(data);
    const newDataUSer = {
      id: JSON.parse(localStorage.getItem("dateUser")).id,
      name: JSON.parse(localStorage.getItem("dateUser")).name,
      categoria: JSON.parse(localStorage.getItem("dateUser")).categoria,
      active: JSON.parse(localStorage.getItem("dateUser")).active,
      idcompany: JSON.parse(localStorage.getItem("dateUser")).idcompany,
      company: JSON.parse(localStorage.getItem("dateUser")).company,
      styles: styles.toString().replace(/\\/g, ""),
    };
    localStorage.setItem("dateUser", JSON.stringify(newDataUSer));
    console.log(response.data);
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

  useEffect(() => {
    getImgLogos();
  }, []);

  const getImgLogos = async () => {
    const img = await getImgLogo(idcompany);
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
      idreq: idcompany,
      tipo: "Logo",
      id: random,
      company: company,
    };
    if (code) await InsertImg(body);
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
    await DeleteImg(record, company);
    message.success("Imagem deletada com sucesso!");
  }
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          cor 1
          <ColorPicker value={fundoColor1} onChange={setFundoColor1} />
          cor 2
          <ColorPicker value={fundoColor2} onChange={setFundoColor2} />
        </div>

        <div>
          <ColorPicker>
            <div style={FundoStyle}>Fundo do Site</div>
          </ColorPicker>
          <ColorPicker value={textColor} onChange={setTextColor}>
            <p style={TextStyle}>Texto do Site</p>
          </ColorPicker>
        </div>
      </div>

      <div>
        {imgSrc && (
          <>
            <img
              src={atob(imgSrc.imagem)}
              alt="img"
              style={{
                width: 300,
                marginRight: 5,
                borderRadius: 10,
                marginLeft: 16,
                border: "solid 1px #000000",
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
                  marginLeft: -35,
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
      <div style={{ marginLeft: 16 }}>
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
              {fileList.length < 1 && "+add Imagem"}
            </Upload>
          </ImgCrop>
        )}
      </div>

      <Button
        type="primary"
        style={{ marginLeft: 16 }}
        onClick={() => fetchData()}
      >
        Salvar
      </Button>
    </div>
  );
};

export default SlideRenderer;
