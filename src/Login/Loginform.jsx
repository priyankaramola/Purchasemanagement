import React from "react";
import InputField from "./Inputfield";
import Button from "./Button";

function LoginForm() {
  return (
    <form className="flex flex-col font-medium rounded-none max-w-[330px]">
      <header className="text-center">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3d9cb39f648d5a41315200385261ec9c618f5641ff5dcea3d517780a70a1023d?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db" alt="" className="object-contain self-center aspect-square w-[45px]" />
        <h1 className="mt-5 text-2xl font-semibold text-black">
          Login with your account
        </h1>
        <p className="mt-1 text-base text-zinc-600">
          Provide your register email
        </p>
      </header>
      <main className="mt-10">
        <InputField
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/29fd2ehttp://13.204.15.86:3002   7df1de28c44da98f9ed87ee2383917ddf05dd846203fcd9ee14538?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db"
        />
        <Button text="Continue" className="mt-10" />
      </main>
    </form>
  );
}

export default LoginForm;