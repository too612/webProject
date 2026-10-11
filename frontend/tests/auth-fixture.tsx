import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "../src/router/ProtectedRoute";
import { useLogin } from "../src/common/auth/login/loginHook";
import { useAuthStore } from "../src/common/auth/authStore";
import client from "../src/common/api/api.client";

function Login() {
  const login = useLogin();
  return (
    <form onSubmit={login.onSubmit}>
      <label>Username<input value={login.username} onChange={(event) => login.setUsername(event.target.value)} /></label>
      <label>Password<input type="password" value={login.password} onChange={(event) => login.setPassword(event.target.value)} /></label>
      <button disabled={login.isSubmitting}>Login</button>
      <p role="alert">{login.feedbackMessage}</p>
    </form>
  );
}

function Fixture() {
  const location = useLocation();
  return (
    <>
      <output data-testid="path">{location.pathname + location.search + location.hash}</output>
      <button onClick={() => { void client.get("/probe").catch(() => undefined); }}>Start request</button>
      <button onClick={() => useAuthStore.getState().setAuth({ userId: "test-user" })}>New login</button>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/erp" element={<ProtectedRoute><p>ERP content</p></ProtectedRoute>} />
      </Routes>
    </>
  );
}

const initialPath = new URLSearchParams(window.location.search).get("path") ?? "/erp?menu=test#detail";
createRoot(document.getElementById("root")!).render(
  <StrictMode><MemoryRouter initialEntries={[initialPath]}><Fixture /></MemoryRouter></StrictMode>,
);
