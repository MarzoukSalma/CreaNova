import React from "react";
import { Navigate } from "react-router-dom";

const Protectelogin = ({ children }) => {
  const token = localStorage.getItem("token"); // récupère le token

  if (token) {
    // pas de token → redirige vers login
    return <Navigate to="/reves" replace />;
  }

  // token existe → afficher la page demandée
  return children;
};

export default Protectelogin;
