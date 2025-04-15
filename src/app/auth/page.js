"use client";

import { useEffect, useState, useCallback } from "react";
import "../globals.css";
import { useAuth } from "common/components/AuthProvider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Auth() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);

  useEffect(() => {
    const email = Cookies.get("email");
    if (email) {
      setEmail(email);
      setSaveEmail(true);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (saveEmail) {
        Cookies.set("email", email, { expires: 7 });
      } else {
        Cookies.remove("email");
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_REST_API_URL}/auth/login`, {
          method: "POST",
          body: new URLSearchParams({
            email: email,
            password: password,
          }),
        });
        if (!response.ok) {
          throw new Error("로그인 요청 실패!");
        }
        const result = await response.json();

        if (result.status == "success") {
          setToken(result.data); // JWT 토큰을 AuthProvider에 저장
          router.push(`${process.env.NEXT_PUBLIC_AUTH_UI_URL}/`); // 로그인 성공 시 메인 페이지로 이동
        } else {
          setErrorMessage("사용자 인증 실패!");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [email, password, saveEmail]
  );

  return (
    <>
      <h2>로그인</h2>
      {errorMessage && <p className='error'>사용자 인증 실패!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          {`${process.env.NEXT_PUBLIC_AUTH_UI_URL}/members`}
          <label htmlFor='email'>이메일:</label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor='password'>암호:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type='checkbox'
            checked={saveEmail}
            onChange={(e) => setSaveEmail(e.target.checked)}
          />
          <label htmlFor='saveEmail'>이메일 저장</label>
        </div>
        <div>
          <button>로그인</button>
        </div>
      </form>
    </>
  );
}
