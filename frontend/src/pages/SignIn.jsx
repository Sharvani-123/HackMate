// Login.jsx
import React from 'react';
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { checkIfUserProfileExists } from "../utils/firebaseHelpers"
import { app } from '../firebase'; 
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignIn = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;


      // Check backend if user profile exists
      const userExists = await checkIfUserProfileExists(user.uid); 
      if (userExists) {
        navigate('/hackathons'); // or wherever authenticated users go
      } else {
        navigate('/createprofile');
      }
    } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      alert('Popup was blocked by your browser. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      // user closed it themselves, no need to alert
    } else {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-200 via-white to-gray-350">
    <Header/>
        <main className="flex-grow flex items-center justify-center px-4">
      <div className=" bg-white rounded-xl shadow-md p-15 max-w-md w-full text-center m-[70px]">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to <span className="text-purple-600">HackMate</span>
        </h1>
        <p className="mb-6 text-gray-600">Sign in with Google to continue</p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:shadow-md transition cursor-pointer"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign in with Google
        </button>

        <p className="mt-4 text-sm text-gray-500">
          You’ll be redirected to create your profile after signing in.
        </p>
      </div>
      </main>
      <Footer/>
    </div>
  );
};

export default SignIn;

