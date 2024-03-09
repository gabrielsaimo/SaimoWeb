import React, { useState, useEffect } from "react";
import Atropos from "atropos/react";
import "atropos/css";
import { Card } from "antd";
import { getImgLogo } from "../../services/config";
const { Meta } = Card;
const idcompany = JSON.parse(localStorage.getItem("dateUser")).idcompany;
const Company = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // const companies = JSON.parse(localStorage.getItem("companies"));
    // setCompanies(companies);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Atropos
        className="atropos"
        rotateTouch="true"
        scaleTouch="true"
        rotateX="30"
        rotateY="30"
        rotate="true"
        scale="true"
        style={{ width: "240px" }}
      >
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              data-atropos-offset={"4"}
              style={{
                padding: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              alt="example"
              src="https://consultoriaritz.com/wp-content/uploads/2021/07/prata.png"
            />
          }
        >
          <Meta title="Plano de R$30" data-atropos-offset={"-4"} />
        </Card>
      </Atropos>

      <ul>
        {companies.map((company, index) => (
          <li key={index}>{company}</li>
        ))}
      </ul>
    </div>
  );
};

export default Company;
