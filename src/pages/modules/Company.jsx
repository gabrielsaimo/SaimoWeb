import { useEffect, useState } from "react";
import { getImgLogo } from "../../services/config";
import "../../css/Company.css";
import { Spin } from "antd";

export default function Company() {
  const companys = JSON.parse(localStorage.getItem("dateUser"));
  const [images, setImages] = useState({});

  useEffect(() => {
    companys.user_profile_json.forEach(async (company) => {
      const img = await getImgLogo(company.idcompany);
      setImages((prevImages) => ({
        ...prevImages,
        [company.idcompany]: img[0]?.imagem,
      }));
    });
  }, []);

  return (
    <div
      className="background-page control-painel "
      style={{ height: "100%", textAlign: "center" }}
    >
      <h1 style={{ marginTop: 0, padding: 21 }} className="title-company">
        Empresas
      </h1>
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 280px))",
            gap: "20px",
            padding: "15px",
            overflowX: "auto",
          }}
        >
          {companys.user_profile_json.map((company) => (
            <div
              key={company.id}
              onClick={() =>
                (window.location.href = "/dashboard/" + company.company)
              }
              className="company-card background-page"
            >
              {images[company.idcompany] ? (
                <div className="company-image-container">
                  <img
                    src={atob(images[company.idcompany])}
                    alt="img"
                    className="company-image"
                  />
                </div>
              ) : (
                <div className="company-image-container">
                  <Spin />
                </div>
              )}
              <h3 className="title-company">{company.company}</h3>
              <p className="title-company">{company.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
