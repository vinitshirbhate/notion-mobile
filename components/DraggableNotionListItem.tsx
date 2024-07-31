import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { NotionFile } from "@prisma/client/react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { extendedClient } from "@/myDbModule";
import { Colors } from "@/constants/Colors";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function DraggableNotionListItem({
  drag,
  isActive,
  item,
}: RenderItemParams<NotionFile>) {
  return (
    <NotionFileItem
      isActive={isActive}
      notionFile={item}
      iconColor="gray"
      drag={drag}
    />
  );
}

interface InnerNotionFileItemProps {
  parentId: number | undefined;
}

function InnerNotionFileItem({ parentId }: InnerNotionFileItemProps) {
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "light" ? Colors.light.icon : Colors.dark.icon;
  const childs = extendedClient.notionFile.useFindMany({
    where: { parentFileId: parentId },
  });

  if (childs.length === 0) {
    return <ThemedText lightColor="gray">No page inside</ThemedText>;
  }
  return (
    <View>
      {childs.map((notionFile: NotionFile) => (
        <NotionFileItem
          key={notionFile.id}
          iconColor={iconColor}
          notionFile={notionFile}
        />
      ))}
    </View>
  );
}

interface NotionFileItemProps {
  drag?: () => void;
  isActive?: boolean;
  notionFile: NotionFile;
  iconColor: string;
}

function NotionFileItem({
  drag,
  isActive,
  notionFile,
  iconColor,
}: NotionFileItemProps) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [isOpen, setIsOpen] = useState(false);

  const onPress = (id: number) => {
    const options = ["Delete", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case 0: {
            extendedClient.notionFile.delete({
              where: {
                id,
              },
            });
            break;
          }
          case 1: {
            break;
          }
        }
      }
    );
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        activeOpacity={0.8}
        disabled={isActive}
        onLongPress={drag}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Ionicons
              name={isOpen ? "chevron-down" : "chevron-forward-outline"}
              size={18}
              style={{ marginRight: 10 }}
              color={iconColor}
            />
          </Pressable>
          <ThemedText type="defaultSemiBold">
            {notionFile.icon} {notionFile.title}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => onPress(notionFile.id)}>
            <Ionicons
              name={"ellipsis-horizontal"}
              size={18}
              color={iconColor}
            />
          </Pressable>
          <Ionicons name={"add"} size={22} color={iconColor} />
        </View>
      </TouchableOpacity>
      {isOpen ? (
        <View style={styles.content}>
          <InnerNotionFileItem parentId={notionFile.id} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  content: {
    marginLeft: 24,
  },
});
