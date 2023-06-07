import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import { styled } from "nativewind";
import * as SecureStore from "expo-secure-store";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";
import { useRouter } from "expo-router";

import Stripes from "../src/assets/stripes.svg";
import NlwLogo from "../src/assets/logo.svg";
import { api } from "../src/lib/api";
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/5ad97d96b26ac31865f9",
};

const StyledStripes = styled(Stripes);
//5ad97d96b26ac31865f9

export default function App() {
  const router = useRouter();
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  const [request, response, signinWithGithub] = useAuthRequest(
    {
      clientId: "5ad97d96b26ac31865f9",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwSpacetime",
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post("/register", {
      code,
    });

    const { token } = response.data;
    console.log(token);
    await SecureStore.setItemAsync("token", token);

    router.push("/memories");
  }

  useEffect(() => {
    // console.log(makeRedirectUri({
    //   scheme: 'nlwSpacetime'
    // }))
    if (response?.type === "success") {
      const { code } = response.params;

      handleGithubOAuthCode(code);
    }
  }, [response]);

  if (!hasLoadedFonts) return null;
  return (
    <View className="flex-1 items-center justify-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NlwLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
        >
          <Text
            className="font-alt text-sm uppercase text-black"
            onPress={() => signinWithGithub()}
          >
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-base leading-relaxed text-gray-200">
        Feitcom com s2 no NLW da Rocketseat
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
