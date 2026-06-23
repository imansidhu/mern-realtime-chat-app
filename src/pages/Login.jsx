import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { googleAuth, loginUser, validUser } from "../apis/auth";
import { Link, useNavigate } from "react-router-dom";
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from "react-toastify";

const defaultData = {
  email: "",
  password: "",
};

function Login() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const pageRoute = useNavigate();

  const googleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);

      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User:", decoded);

      const response = await googleAuth({
        tokenId: credentialResponse.credential,
      });

      setIsLoading(false);

      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        toast.success("Successfully Login!");
        pageRoute("/chats");
      }

    } catch (error) {
      setIsLoading(false);
      toast.error("Google Login Failed");
      console.log(error);
    }
  };


  const googleFailure = () => {
    toast.error("Something went wrong. Try Again!");
  };


  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const formSubmit = async (e) => {
    e.preventDefault();

    if (formData.email.includes("@") && formData.password.length > 6) {

      setIsLoading(true);

      const { data } = await loginUser(formData);

      if (data?.token) {

        localStorage.setItem("userToken", data.token);

        toast.success("Successfully Login!");

        setIsLoading(false);

        pageRoute("/chats");

      } else {

        setIsLoading(false);

        toast.error("Invalid Credentials!");

        setFormData({
          ...formData,
          password: "",
        });
      }

    } else {

      toast.warning("Provide valid Credentials!");

      setFormData(defaultData);

    }
  };


  useEffect(() => {

    const checkUser = async () => {

      const data = await validUser();

      if (data?.user) {
        window.location.href = "/chats";
      }

    };

    checkUser();

  }, []);



  return (
    <div className="bg-[#121418] w-[100vw] h-[100vh] flex justify-center items-center">

      <div className="w-[90%] sm:w-[400px] h-[400px] relative">


        <div className="absolute -top-5 left-0">

          <h3 className="text-[25px] font-bold tracking-wider text-white">
            Login
          </h3>

          <p className="text-white text-[12px]">
            No Account ?

            <Link
              className="text-[rgba(0,195,154,1)] underline ml-1"
              to="/register"
            >
              Sign up
            </Link>

          </p>

        </div>



        <form
          className="flex flex-col gap-y-3 mt-[12%]"
          onSubmit={formSubmit}
        >


          <input

            className="w-full sm:w-[80%] bg-[#222222] h-[50px] pl-3 text-white"

            onChange={handleOnChange}

            name="email"

            type="text"

            placeholder="Email"

            value={formData.email}

            required

          />



          <div className="relative">

            <input

              className="w-full sm:w-[80%] bg-[#222222] h-[50px] pl-3 text-white"

              onChange={handleOnChange}

              type={showPass ? "text" : "password"}

              name="password"

              placeholder="Password"

              value={formData.password}

              required

            />


            {
              !showPass ?

                <BsEmojiLaughing

                  onClick={() => setShowPass(true)}

                  className="text-white absolute top-3 right-5 cursor-pointer"

                />

                :

                <BsEmojiExpressionless

                  onClick={() => setShowPass(false)}

                  className="text-white absolute top-3 right-5 cursor-pointer"

                />

            }


          </div>



          <button

            className="w-full sm:w-[80%] h-[50px] font-bold text-[#121418]"

            style={{
              background:
              "linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)"
            }}

            type="submit"

          >

            {
              isLoading ? "Loading..." : "Login"
            }


          </button>




          <p className="text-white text-center sm:-ml-20">
            /
          </p>




          <GoogleLogin

            onSuccess={googleSuccess}

            onError={googleFailure}

          />


        </form>


      </div>


    </div>
  );
}


export default Login;