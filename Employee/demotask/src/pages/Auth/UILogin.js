import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginAPI } from "../../API";

// Material UI imports
import {
  TextField,
  Button,
  Typography,
  Link,
  List,
  ListItem,
} from "@mui/material";

import img from "../../assets/images/Moneyverse Home Office.png";

const LoginUser = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Submit function
  const onSubmit = (data) => {
    if (!data.tenantId || !data.email || !data.password) {
      toast.error("All fields are required");
      return;
    }

    loginAPI(data)
      .then((res) => {
        const status = res.data.status;
        if (status === true) {
          toast.success(res.data.message);
          localStorage.setItem("base_url", res.data?.data?.baseUrl);
          localStorage.setItem("authToken", res.data?.data?.token);
          localStorage.setItem(
            "userDetail",
            JSON.stringify(res.data?.data?.user)
          );
          navigate("/dashboard");
        } else if (status === false) {
          toast.error(res.data.message);
        } else if (status === "expired") {
          toast.error("Session expired");
        }
      })
      .catch((err) => {
        toast.error("Error: " + err.message);
      });
  };

  return (
    <div className="signup-container">
      {/* Left Side */}
      <div className="signup-left">
        <div className="circle"></div>
        <Typography variant="h4" gutterBottom>
          Sign in
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          By signing in, you agree to the{" "}
          <Link href="#">Terms of use</Link> and{" "}
          <Link href="#">Privacy Policy</Link>.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <TextField
              label="Company Code"
              fullWidth
              size="small"
              {...register("tenantId", { required: "This field is required" })}
              error={!!errors.tenantId}
              helperText={errors.tenantId?.message}
            />
          </div>

          <div className="mb-3">
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="small"
              {...register("email", { required: "This field is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </div>

          <div className="mb-3">
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="small"
              {...register("password", { required: "This field is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </div>

          <div className="form-submit">
            <Button type="submit" variant="contained" className="btn">
              Sign in
            </Button>
            <p className="login-text">
              Don’t have an account? <Link href="#">Sign up</Link>
            </p>
          </div>
          <Link href="#" className="forgot-link">
            Forgot Password?
          </Link>
        </form>
      </div>

      {/* Right Side */}
      <div className="signup-right">
        <img src={img} alt="Illustration" className="illustration" />
        <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
          Your plan includes
        </Typography>
        <List>
          <ListItem>✅ Unlimited projects and resources</ListItem>
          <ListItem>✅ Unlimited templates</ListItem>
          <ListItem>✅ Unlimited storage</ListItem>
          <ListItem>✅ List, Board, and Calendar views…</ListItem>
        </List>
      </div>
    </div>
  );
};

export default LoginUser;
