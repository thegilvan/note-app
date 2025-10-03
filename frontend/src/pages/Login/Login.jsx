import React from "react";
import Navbar from "../../componentes/Navbar";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="W-96 border rounded bg-white px-7 py-10">
          <form onSubmit={() => {}}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input type="text" placeholder="Email" className="input-box" />
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Ainda não registrado?{" "}
              <Link to="/signup" className="font-bold text-blue-500 underline">
                Crie uma conta agora mesmo!
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
