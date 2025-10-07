import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import img from "../../assets/images/Moneyverse Home Office.png";
import { useForm } from "react-hook-form";
import { loginAPI } from "../../API";

const LoginUser = () => {
  const navigate = useNavigate();
  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    // Basic validation
    if (!data.tenantId || !data.email || !data.password) {
      alert("All fields are required");
      return;
    }

    loginAPI(data)
      .then((res) => {
        const status = res.data.status;
        if (status === true) {
          const baseUrl = res.data?.data?.baseUrl;
          const token = res.data?.data?.token;
          const user = res.data?.data?.user;
          try {
            localStorage.setItem("base_url", baseUrl);
            localStorage.setItem("authToken", token);
            localStorage.setItem("userDetail", JSON.stringify(user));
          } catch (e) {
            console.error("LocalStorage error:", e);
          }

          toast.success(res.data.message);
          navigate("/dashboard");
        } else if (status === false) {
          console.log(res.data.message, "iuiiuiiuiuiu");
          toast.error(res.data.message);
        } else if (status === "expired") {
          toast.error("Session expired");
        }
      })
      .catch((err) => {
        toast.error("Error: " + err.message);
      });
  };
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="circle"></div>
        <h1>Sign in</h1>
        <p>
          By signing in, you agree to the <a href="#">Terms of use</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1">
            <input
              type="text"
              name="tenantId"
              id="default-01"
              {...register("tenantId", {
                required: "This field is required",
              })}
              placeholder="Enter Company Code"
              className="form-control-login"
            />
            {errors.tenantId && (
              <div className="error-message">{errors.tenantId.message}</div>
            )}
          </div>

          <div className="mb-1">
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control-login"
              name="email"
              id="default-02"
              {...register("email", {
                required: "This field is required",
              })}
            />
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-1">
            <input
              type="password"
              placeholder="Password"
              className="form-control-login"
              name="password"
              id="default-03"
              {...register("password", { required: "This field is required" })}
            />
            {errors.password && (
              <div className="error-message">{errors.password.message}</div>
            )}
          </div>

          <div className="form-submit">
            <button type="submit" className="btn">
              Sign in
            </button>
            <p className="login-text">
              Don’t have an account? <a href="#">Sign up</a>
            </p>
          </div>
          <a href="#" className="forgot-link">
            Forgot Password?
          </a>
        </form>
      </div>

      <div className="signup-right">
        <img src={img} alt="Illustration" className="illustration" />
        <h1>Your plan includes</h1>
        <ul className="listStyle">
          <li>
            <p>Unlimited projects and resources</p>
          </li>
          <li>
            <p>Unlimited templates</p>
          </li>
          <li>
            <p>Unlimited storage</p>
          </li>
          <li>
            <p>List, Board, and Calendar views…</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginUser;
