import { supabase } from "../supabaseclient";

export const logout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) {
        console.error(error);
    }
 // eslint-disable-line no-unused-vars
    
}
