// src/auth/login.js
import { supabase } from "../supabaseclient";

export const login = async (email, password) => {
  if (!email || !password) {
    return { error: new Error("Email and password are required") };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};
