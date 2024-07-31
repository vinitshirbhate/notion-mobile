import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { NotionFile } from "@prisma/client/react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

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

interface NotionFileItemProps {
  drag?: () => void;
  isActive: boolean;
  notionFile: NotionFile;
  iconColor: string;
}

function NotionFileItem({
  drag,
  isActive,
  notionFile,
  iconColor,
}: NotionFileItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        activeOpacity={0.8}
        disabled={isActive}
        onLongPress={drag}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable>
            <Ionicons
              name={isOpen ? "chevron-down" : "chevron-forward-outline"}
              size={18}
              style={{ marginRight: 10 }}
              color={iconColor}
            />
          </Pressable>
        </View>
        <ThemedText type="defaultSemiBold">
          {notionFile.icon} {notionFile.title}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
});
