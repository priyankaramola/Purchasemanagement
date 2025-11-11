import React, { useState } from "react";
import login from "../assests/login.jpg";

const PasswordInput = ({ value, onChange }) => (
    <>
        <label htmlFor="password" className="self-start">
            Password
        </label>
        <div className="flex gap-6 px-3.5 py-4 mt-2 text-xs rounded-xl border border-black border-solid bg-zinc-50 text-neutral-400">
            <img
                loading="lazy"
                src="http://cdn.builder.io/api/v1/image/assets/TEMP/350382de318d81cc20156c5999a5e943daab19f908d2bbc10a7c2dad240e635c?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db"
                alt=""
                className="object-contain shrink-0 self-start w-3.5 aspect-square"
            />
            <input
                type="password"
                id="password"
                value={value}
                onChange={onChange}
                placeholder="Enter password"
                className="flex-auto w-[265px] bg-transparent border-none outline-none"
            />
        </div>
    </>
);

const RememberMeCheckbox = ({ checked, onChange }) => (
    <div className="flex gap-1.5 self-start mt-4 text-xs">
        <input
            type="checkbox"
            id="rememberMe"
            checked={checked}
            onChange={onChange}
            className="shrink-0 self-start w-3.5 h-3.5 rounded border border-black border-solid bg-zinc-300 bg-opacity-0"
        />
        <label htmlFor="rememberMe">Remember me</label>
    </div>
);

const Button = ({ children, className, type = "button", onClick }) => (
    <button type={type} className={className} onClick={onClick}>
        {children}
    </button>
);

function PasswordContinuation() {
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleRememberMeChange = () => setRememberMe(!rememberMe);
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };
    const handleBack = () => {
        // Handle back button click
    };

    return (
        <div className="h-screen flex">
            <div className="w-1/2 flex justify-center items-center">
                <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
            </div>
            <main className="flex flex-col text-sm text-black rounded-none ml-[15%] mt-[10%] max-w-[400px]">
                <img
                    loading="lazy"
                    src="http://cdn.builder.io/api/v1/image/assets/TEMP/047e41c687ca366cbdc17b6a91d100d2842916288fb5d4d3fe9daf7cc2e24482?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db"
                    alt=""
                    className="object-contain self-center aspect-square w-[45px]"
                />
                <h1 className="mt-5 w-full text-2xl font-semibold">
                    Continue with your password
                </h1>
                <p className="self-center mt-1 text-base font-medium text-zinc-600">
                    rana123@gmai.com
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col px-1.5 mt-10 w-full text-sm">
                    <PasswordInput value={password} onChange={handlePasswordChange} />
                    <RememberMeCheckbox checked={rememberMe} onChange={handleRememberMeChange} />
                    <Button
                        type="submit"
                        className="px-16 py-3.5 mt-8 font-medium text-white whitespace-nowrap bg-blue-700 rounded-xl"
                    >
                        Continue
                    </Button>
                    <Button
                        type="button"
                        onClick={handleBack}
                        className="flex flex-col justify-center items-center px-16 py-3.5 mt-4 w-full font-medium whitespace-nowrap rounded-xl border border-solid border-neutral-400"
                    >
                        <div className="flex gap-1 w-14">
                            <img
                                loading="lazy"
                                src="http://cdn.builder.io/api/v1/image/assets/TEMP/1ad1f26ed703180392b68dfa61b9ade1973d7f08c1e50e05b7fa8bc87cc38271?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db"
                                alt=""
                                className="object-contain shrink-0 w-5 aspect-[1.18]"
                            />
                            <span>Back</span>
                        </div>
                    </Button>
                </form>
            </main>
        </div>
    );
}

export default PasswordContinuation;