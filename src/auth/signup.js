// src/auth/signup.js
import { supabase } from "../supabaseclient";

export const signup = async (email, password) => {
  if (!email || !password) {
    return { error: new Error("Email and password are required") };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};
