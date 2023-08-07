import { createContext, useContext, useEffect, useState } from "react";
import type { SetStateAction, Dispatch } from "react";
import type { CognitoUser } from "@aws-amplify/auth";
import { Auth, Hub } from "aws-amplify";

interface UserContextType {
  user: CognitoUser | null;
  setUser: Dispatch<SetStateAction<CognitoUser | null>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

interface Props {
  children: React.ReactElement;
}

const AuthContext = ({ children }: Props): React.ReactElement => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  // every time an auth action happens we update the user value
  const checkUser = async (): Promise<void> => {
    try {
      const amplifyUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      if (amplifyUser != null) {
        setUser(amplifyUser);
      }
    } catch (error) {
      console.log(error);
      // logged out or no user at all
      setUser(null);
    }
  };

  // check user on first render
  useEffect(() => {
    void checkUser();
  }, []);

  useEffect(() => {
    Hub.listen("auth", () => {
      // do something when SignUp or SignIn or Logout
      void checkUser();
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthContext;

export const useUser = (): UserContextType => useContext(UserContext);
