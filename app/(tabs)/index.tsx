import { Image, StyleSheet, Platform, Button } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { extendedClient } from "@/myDbModule";
import { NotionFile } from "@prisma/client/react-native";
import DraggableNotionList from "@/components/DraggableNotionList";

export default function HomeScreen() {
  const user = extendedClient.user.useFindFirst({
    where: {
      id: 1,
    },
  });
  const notion = extendedClient.notionFile.useFindMany();
  console.log(notion.length);

  console.log(user);
  const createUser = () => {
    const newUser = {
      name: "John Doe",
      email: "johndoe@gmail.com",
    };
    extendedClient.user.create({
      data: newUser,
    });
    console.log("User created");
  };

  const createNotion = () => {
    const newNotion = {
      title: "Test",
      content: "Test",
      icon: "👋",
      description: "",
      coverPhoto: "",
      type: "default",
      authorId: 1,
    };
    extendedClient.notionFile.create({
      data: newNotion,
    });
    console.log("notion created");
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* <Button title="Create User" onPress={createUser} /> */}
        {/* <Button title="Create notion" onPress={createNotion} /> */}
        <DraggableNotionList />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
