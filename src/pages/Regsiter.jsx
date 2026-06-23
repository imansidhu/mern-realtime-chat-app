import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { googleAuth, registerUser, validUser } from "../apis/auth";

import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from "react-toastify";


const defaultData = {
  firstname: "",
  lastname: "",
  email: "",
  password: ""
};


function Regsiter() {

  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const pageRoute = useNavigate();



  const handleOnChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };



  const handleOnSubmit = async (e) => {

    e.preventDefault();

    if(formData.email.includes("@") && formData.password.length > 6){

      setIsLoading(true);


      const {data} = await registerUser(formData);


      if(data?.token){

        localStorage.setItem("userToken", data.token);

        toast.success("Successfully Registered 😍");

        setIsLoading(false);

        pageRoute("/chats");

      }
      else{

        setIsLoading(false);

        toast.error("Invalid Credentials!");

      }


    }
    else{

      toast.warning("Provide valid Credentials!");

      setFormData({
        ...formData,
        password:""
      });

    }

  };




  const googleSuccess = async (credentialResponse)=>{

    try{

      const user = jwtDecode(
        credentialResponse.credential
      );


      console.log("Google User",user);


      setIsLoading(true);


      const response = await googleAuth({
        tokenId: credentialResponse.credential
      });


      setIsLoading(false);


      if(response.data.token){

        localStorage.setItem(
          "userToken",
          response.data.token
        );


        toast.success("Google Login Success");


        pageRoute("/chats");

      }


    }
    catch(error){

      setIsLoading(false);

      toast.error("Google Login Failed");

      console.log(error);

    }

  };




  useEffect(()=>{


    const checkUser = async()=>{

      const data = await validUser();

      if(data?.user){

        window.location.href="/chats";

      }

    };


    checkUser();


  },[]);




  return (

    <div className="bg-[#121418] w-[100vw] h-[100vh] flex justify-center items-center">


      <div className="w-[90%] sm:w-[400px] h-[400px] relative">



        <div className="absolute -top-7 left-0">

          <h3 className="text-[25px] font-bold text-white">
            Register
          </h3>


          <p className="text-white text-[12px]">

            Have Account ?

            <Link 
            className="text-[rgba(0,195,154,1)] underline ml-1"
            to="/login">

              Sign in

            </Link>

          </p>

        </div>





        <form 
        onSubmit={handleOnSubmit}
        className="flex flex-col gap-y-3 mt-[12%]">



          <div className="flex gap-x-2">


            <input

            className="bg-[#222222] h-[50px] pl-3 text-white w-[50%]"

            name="firstname"

            placeholder="First Name"

            value={formData.firstname}

            onChange={handleOnChange}

            required

            />


            <input

            className="bg-[#222222] h-[50px] pl-3 text-white w-[50%]"

            name="lastname"

            placeholder="Last Name"

            value={formData.lastname}

            onChange={handleOnChange}

            required

            />


          </div>





          <input

          className="bg-[#222222] h-[50px] pl-3 text-white"

          name="email"

          type="email"

          placeholder="Email"

          value={formData.email}

          onChange={handleOnChange}

          required

          />






          <div className="relative">


            <input

            className="bg-[#222222] h-[50px] pl-3 text-white w-full"

            name="password"

            type={showPass ? "text":"password"}

            placeholder="Password"

            value={formData.password}

            onChange={handleOnChange}

            required

            />



            {
              showPass ?

              <BsEmojiExpressionless

              onClick={()=>setShowPass(false)}

              className="absolute right-5 top-3 text-white cursor-pointer"

              />

              :

              <BsEmojiLaughing

              onClick={()=>setShowPass(true)}

              className="absolute right-5 top-3 text-white cursor-pointer"

              />

            }



          </div>





          <button

          className="h-[50px] font-bold"

          style={{
          background:"linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)"
          }}

          >

          {isLoading ? "Loading..." : "Register"}

          </button>






          <p className="text-white text-center">
            /
          </p>





          <GoogleLogin

          onSuccess={googleSuccess}

          onError={()=>{
            toast.error("Google Login Failed")
          }}

          />





        </form>


      </div>


    </div>


  );

}


export default Regsiter;