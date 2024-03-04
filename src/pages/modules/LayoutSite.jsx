import { Button, ColorPicker, Popconfirm, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useMemo, useState } from "react";
import { DeleteImg, InsertImg } from "../../services/cardapio.ws";
import { getImgLogo } from "../../services/config";
import { DeleteOutlined } from "@ant-design/icons";
const SlideRenderer = () => {
  const [fundoColor, setFundoColor] = useState("#1677ff");
  const [textColor, setTextColor] = useState("#1677ff");
  const [fileList, setFileList] = useState([]);
  const [totalImg, setTotalImg] = useState(0);
  const [coint, setCoint] = useState(0);
  const random = Math.floor(Math.random() * 100000000);
  const company = JSON.parse(localStorage.getItem("dateUser")).company;
  const idcompany = JSON.parse(localStorage.getItem("dateUser")).idcompany;
  const [imgSrc, setImgSrc] = useState(null);
  const [idImg, setIdImg] = useState(null);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setCoint(coint + 1);
  };
  const fundobgColor = useMemo(
    () =>
      typeof fundoColor === "string" ? fundoColor : fundoColor.toHexString(),
    [fundoColor]
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

    setImgSrc(img[0]);
    setIdImg(img[0]?.id);
    setTotalImg(img.length);
  };

  useEffect(() => {
    console.log(coint);
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
      // update_at: new Date(),
      //  update_by: JSON.parse(cachedData)[0]?.name,
      //  idcompany: JSON.parse(cachedData)[0]?.idcompany,
      company: company,
    };
    if (code) await InsertImg(body);
  };

  const FundoStyle = {
    marginTop: 16,
    backgroundColor: fundobgColor,
    width: 300,
    height: 300,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    cursor: "pointer",
    color: fundobgColor === "#ffffff" ? "#000000" : "#ffffff",
    border: fundobgColor === "#ffffff" ? "solid 1px #000000" : "solid 1px red",
  };

  const TextStyle = {
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    fontSize: 50,
    cursor: "pointer",
    marginLeft: 16,
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
    <div style={{ display: "flex" }}>
      <ColorPicker value={fundoColor} onChange={setFundoColor}>
        <div style={FundoStyle}>Fundo do Site</div>
      </ColorPicker>
      <ColorPicker value={textColor} onChange={setTextColor}>
        <p style={TextStyle}>Texto do Site</p>
      </ColorPicker>
      <div>
        {imgSrc && (
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
        )}
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
      </div>
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
              {fileList.length < 1 && "+add Imagem"}
            </Upload>
          </ImgCrop>
        )}
      </div>
    </div>
  );
};

export default SlideRenderer;
