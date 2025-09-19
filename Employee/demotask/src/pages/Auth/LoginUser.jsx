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
          toast.success(res.data.message);
          toast.clearWaitingQueue();
          localStorage.setItem("base_url", res.data?.data?.baseUrl);
          localStorage.setItem("authToken", res.data?.data?.token);
          localStorage.setItem(
            "userDetail",
            JSON.stringify(res.data?.data?.user)
          );
          navigate("/dashboard");
        } else if (status === false) {
          alert(res.data.message);
        } else if (status === "expired") {
          alert("Session expired");
        }
      })
      .catch((err) => {
        alert("Error: " + err.message);
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
          <div className="mb-3">
            <input
              type="text"
              name="tenantId"
              id="default-01"
              {...register("tenantId", {
                required: "This field is required",
              })}
              placeholder="Enter Company Code"
              className="form-control-lg form-control"
            />
            {errors.tenantId && (
              <span className="invalid">{errors.tenantId.message}</span>
            )}
          </div>

          <div className="mb-3">
            {/* <input
              type="email"
              placeholder="Enter Email"
              className="form-control mt-2"
              // {...register("email", { required: true })}
            /> */}
          </div>

          <div className="mb-3">
            {/* <input
              type="password"
              placeholder="Password"
              className="form-control large-input mt-2"
              // {...register("password", { required: true })}
            /> */}
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
        <ul>
          <li>
            <h3>Unlimited projects and resources</h3>
          </li>
          <li>
            <h3>Unlimited templates</h3>
          </li>
          <li>
            <h3>Unlimited storage</h3>
          </li>
          <li>
            <h3>List, Board, and Calendar views…</h3>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginUser;
