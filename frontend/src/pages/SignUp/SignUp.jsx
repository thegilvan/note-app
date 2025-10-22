import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Favor insira um nome");
      return;
    }

    if (!validateEmail(email)) {
      setError("Favor insira um email válido.");
      return;
    }

    if (!password) {
      setError("Favor insira uma senha");
      return;
    }
    setError("");

    //API cadastro aqui
    //o front e o back têm de estar rodando para o teste funcionar
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      //Se cadastro not ok
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        console.log(error);
        setError("Um erro inesperado ocorreu. Tente novamente");
      }
    }
  };
  return (
    <>
      <Navbar />
      {/* inputs de dados */}
      <div className="flex items-center justify-center mt-28">
        <div className="W-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Cadastro</h4>

            <input
              type="text"
              placeholder="Nome"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Cadastrar
            </button>

            <p className="text-sm text-center mt-4">
              Já está cadastrado?{" "}
              <Link to="/Login" className="font-bold text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
